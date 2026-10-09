"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { connectToChat, disconnectChat, chatApiFetch, getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import type { Socket } from "socket.io-client";
import Loading from "@/components/ui/Loading";

type Message = {
    _id?: string;
    conversationId: string;
    senderId: string;
    senderRole: "user" | "support" | "admin";
    content: string;
    createdAt?: string;
};

type Conversation = {
    conversationId: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    user: { name: string; email: string } | null;
};

// عدد الشاتات في الصفحة الواحدة (عشان ميبقاش في اسكرول)
const PAGE_SIZE = 5;

const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function AdminSupportChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [page, setPage] = useState(1);

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeIdRef = useRef<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        activeIdRef.current = activeId;
    }, [activeId]);

    const loadConversations = async () => {
        try {
            const { conversations } = await chatApiFetch("/conversations");
            setConversations(conversations);
        } catch {
            // couldn't load the list, it'll stay empty until a new event arrives
        } finally {
            setIsLoadingConversations(false);
        }
    };

    useEffect(() => {
        audioRef.current = new Audio("/notification.mp3");

        let mounted = true;

        const setup = async () => {
            const socket = await connectToChat();
            if (!socket || !mounted) return;

            socketRef.current = socket;

            await loadConversations();

            socket.on("chat message", (msg: Message) => {
                if (msg.conversationId === activeIdRef.current) {
                    setMessages((prev) => [...prev, msg]);
                    if (msg.senderRole === "user") {
                        socket.emit("mark read", { conversationId: msg.conversationId });
                    }
                }

                if (msg.senderRole === "user") {
                    if (msg.conversationId !== activeIdRef.current) {
                        audioRef.current?.play().catch(() => {});
                    }
                    loadConversations();
                }
            });

            socket.on("typing", ({ conversationId, role }: { conversationId: string; role: string }) => {
                if (role === "user" && conversationId === activeIdRef.current) {
                    setIsUserTyping(true);
                }
            });

            socket.on("stop typing", ({ conversationId, role }: { conversationId: string; role: string }) => {
                if (role === "user" && conversationId === activeIdRef.current) {
                    setIsUserTyping(false);
                }
            });

            socket.on("messages read", ({ conversationId }: { conversationId: string }) => {
                if (conversationId === activeIdRef.current) {
                    loadConversations();
                }
            });
        };

        setup();

        return () => {
            mounted = false;
            disconnectChat();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages, isUserTyping]);

    // لو عدد الشاتات قل والصفحة الحالية بقت أكبر من اللازم
    const totalPages = Math.max(1, Math.ceil(conversations.length / PAGE_SIZE));
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const visibleConversations = conversations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const openConversation = async (conversationId: string) => {
        setActiveId(conversationId);
        setIsUserTyping(false);
        setIsLoadingMessages(true);

        try {
            const { messages } = await chatApiFetch(`/messages/${conversationId}`);
            setMessages(messages);
        } catch {
            setMessages([]);
        } finally {
            setIsLoadingMessages(false);
        }

        const socket = socketRef.current || getSocket();
        socket?.emit("mark read", { conversationId });
        setConversations((prev) =>
            prev.map((c) => (c.conversationId === conversationId ? { ...c, unreadCount: 0 } : c))
        );
    };

    const closeConversation = () => {
        if (activeId) {
            socketRef.current?.emit("stop typing", { conversationId: activeId });
        }
        setActiveId(null);
        setMessages([]);
        setIsUserTyping(false);
    };

    const handleInputChange = (value: string) => {
        setInput(value);
        if (!socketRef.current || !activeId) return;

        socketRef.current.emit("typing", { conversationId: activeId });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit("stop typing", { conversationId: activeId });
        }, 1500);
    };

    const handleSend = () => {
        if (!input.trim() || !socketRef.current || !activeId) return;

        socketRef.current.emit("chat message", {
            conversationId: activeId,
            content: input.trim(),
        });

        socketRef.current.emit("stop typing", { conversationId: activeId });
        setInput("");
    };

    const activeConversation = conversations.find((c) => c.conversationId === activeId);

    return (
        <div className="p-4 sm:p-8">
            {/* العنوان بيختفي على الموبايل لما تفتح شات */}
            <div className={activeId ? "hidden lg:block" : ""}>
                <h1 className="text-xl font-extrabold text-black sm:text-2xl">Support Chat</h1>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    View and reply to customer conversations.
                </p>
            </div>

            <div
                className={`grid grid-cols-1 items-start gap-6 lg:mt-8 lg:grid-cols-[380px_minmax(0,1fr)] ${
                    activeId ? "mt-0" : "mt-6"
                }`}
            >
                {/* Conversations list: على الموبايل بتختفي لما تفتح شات */}
                <div
                    className={`${
                        activeId ? "hidden lg:flex" : "flex"
                    } w-full min-w-0 flex-col self-start rounded-[28px] bg-white p-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:p-6 lg:h-[70vh]`}
                >
                    <div className="flex shrink-0 items-center justify-between">
                        <h2 className="text-sm font-semibold text-black">Conversations</h2>
                        <span className="text-xs text-gray-400">{conversations.length} chats</span>
                    </div>

                    <div className="mt-4 flex-1">
                        {isLoadingConversations ? (
                            <div className="flex h-64 items-center justify-center">
                                <Loading />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="flex h-64 items-center justify-center rounded-[28px] border border-dashed border-gray-200">
                                <p className="text-sm text-gray-400">No conversations yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {visibleConversations.map((c) => {
                                    const isActive = activeId === c.conversationId;
                                    const hasUnread = c.unreadCount > 0 && !isActive;
                                    const name = c.user?.name || "Unknown user";

                                    return (
                                        <button
                                            key={c.conversationId}
                                            type="button"
                                            onClick={() => openConversation(c.conversationId)}
                                            className={`flex w-full touch-manipulation items-center gap-3 rounded-3xl border bg-white p-3 text-left transition active:scale-[0.99] ${
                                                isActive
                                                    ? "border-black shadow-md"
                                                    : "border-gray-100 hover:border-gray-300 hover:shadow-sm"
                                            }`}
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-base font-bold text-white">
                                                {name.charAt(0).toUpperCase()}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3
                                                        className={`truncate text-sm text-black ${
                                                            hasUnread ? "font-extrabold" : "font-semibold"
                                                        }`}
                                                    >
                                                        {name}
                                                    </h3>
                                                    <span className="shrink-0 text-[10px] text-gray-400">
                                                        {formatTime(c.lastMessageAt)}
                                                    </span>
                                                </div>
                                                <p
                                                    className={`mt-0.5 truncate text-xs ${
                                                        hasUnread ? "font-medium text-black" : "text-gray-500"
                                                    }`}
                                                >
                                                    {c.lastMessage}
                                                </p>
                                            </div>

                                            {hasUnread && (
                                                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-1.5 text-[10px] font-bold text-white">
                                                    {c.unreadCount}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex shrink-0 items-center justify-between border-t border-gray-100 pt-4">
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                aria-label="Previous page"
                                className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full bg-gray-50 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <span className="text-xs font-medium text-gray-500">
                                {page} / {totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                aria-label="Next page"
                                className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full bg-gray-50 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Active conversation: على الموبايل بتظهر بس لما تفتح شات */}
                <div
                    className={`${
                        activeId ? "flex" : "hidden lg:flex"
                    } h-[75dvh] min-w-0 flex-col rounded-[28px] bg-white p-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:p-6 lg:h-[70vh]`}
                >
                    {!activeId ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                            <MessageCircle size={40} />
                            <p className="text-sm">Select a conversation to start</p>
                        </div>
                    ) : (
                        <div className="flex h-full min-h-0 flex-col">
                            <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 pb-4">
                                <button
                                    type="button"
                                    onClick={closeConversation}
                                    aria-label="Back to conversations"
                                    className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-full bg-gray-50 text-gray-600 transition hover:bg-gray-100 lg:hidden"
                                >
                                    <ArrowLeft size={18} />
                                </button>

                                <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                    <h2 className="truncate text-sm font-semibold text-black">
                                        {activeConversation?.user?.name || "Unknown user"}
                                    </h2>
                                    <span className="truncate text-xs text-gray-400">
                                        {activeConversation?.user?.email}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
                                {isLoadingMessages ? (
                                    <div className="flex h-full items-center justify-center">
                                        <Loading />
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg, i) => {
                                            const isMine = msg.senderRole !== "user";
                                            return (
                                                <div
                                                    key={msg._id || i}
                                                    className={`flex flex-col ${
                                                        isMine ? "items-end" : "items-start"
                                                    }`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] wrap-break-word rounded-2xl px-3 py-2 text-sm sm:max-w-[65%] ${
                                                            isMine
                                                                ? "bg-linear-to-b from-gray-800 via-gray-700 to-black text-white"
                                                                : "bg-gray-100 text-black"
                                                        }`}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                    <span className="mt-1 px-1 text-[10px] text-gray-400">
                                                        {formatTime(msg.createdAt)}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {isUserTyping && (
                                            <div className="flex items-start">
                                                <div className="rounded-2xl bg-gray-100 px-3 py-2 text-sm text-gray-400">
                                                    Typing...
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="mt-4 flex shrink-0 items-center gap-2 border-t border-gray-100 pt-4">
                                <input
                                    value={input}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type a reply..."
                                    enterKeyHint="send"
                                    autoComplete="off"
                                    className="h-11 min-w-0 flex-1 appearance-none rounded-full bg-gray-50 px-4 text-base outline-none sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    aria-label="Send"
                                    className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-white transition hover:opacity-90 active:opacity-80"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}