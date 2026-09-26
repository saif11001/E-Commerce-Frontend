"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
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

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeIdRef = useRef<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Click-and-drag scrolling for the conversations list (mouse only —
    // touch already scrolls natively, this just adds the same feel for mouse users).
    const listRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startScrollTop = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!listRef.current) return;
        isDragging.current = true;
        startY.current = e.pageY - listRef.current.offsetTop;
        startScrollTop.current = listRef.current.scrollTop;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !listRef.current) return;
        e.preventDefault();
        const y = e.pageY - listRef.current.offsetTop;
        const walk = y - startY.current;
        listRef.current.scrollTop = startScrollTop.current - walk;
    };

    const stopDragging = () => {
        isDragging.current = false;
    };

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
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isUserTyping]);

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
            <div>
                <h1 className="text-xl font-extrabold text-black sm:text-2xl">Support Chat</h1>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    View and reply to customer conversations.
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 items-start gap-6 sm:mt-8 lg:grid-cols-[380px_minmax(0,1fr)]">
                {/* Conversations list */}
                <div className="flex h-125 w-full min-w-0 flex-col self-start rounded-[28px] bg-white p-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:h-[70vh] sm:p-6">
                    <div className="flex shrink-0 items-center justify-between">
                        <h2 className="text-sm font-semibold text-black">Conversations</h2>
                        <span className="text-xs text-gray-400">{conversations.length} chats</span>
                    </div>

                    <div
                        ref={listRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={stopDragging}
                        onMouseLeave={stopDragging}
                        className="mt-4 min-h-0 flex-1 cursor-grab select-none overflow-y-auto [-ms-overflow-style:none] scrollbar-none active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
                    >
                        {isLoadingConversations ? (
                            <div className="flex h-full items-center justify-center">
                                <Loading />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-sm text-gray-400">No conversations yet.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {conversations.map((c) => {
                                    const isActive = activeId === c.conversationId;
                                    return (
                                        <button
                                            key={c.conversationId}
                                            onClick={() => openConversation(c.conversationId)}
                                            className={`flex w-full flex-col gap-1 rounded-2xl px-4 py-3 text-left transition ${
                                                isActive
                                                    ? "bg-linear-to-b from-gray-800 via-gray-700 to-black text-white shadow-md shadow-black/10"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span
                                                    className={`truncate text-sm font-semibold ${
                                                        isActive ? "text-white" : "text-black"
                                                    }`}
                                                >
                                                    {c.user?.name || "Unknown user"}
                                                </span>
                                                {c.unreadCount > 0 && !isActive && (
                                                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-1 text-[10px] font-bold text-white">
                                                        {c.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p
                                                className={`truncate text-xs ${
                                                    isActive ? "text-gray-200" : "text-gray-500"
                                                }`}
                                            >
                                                {c.lastMessage}
                                            </p>
                                            <span
                                                className={`text-[10px] ${
                                                    isActive ? "text-gray-300" : "text-gray-400"
                                                }`}
                                            >
                                                {formatTime(c.lastMessageAt)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active conversation */}
                <div className="flex h-125 min-w-0 flex-col rounded-[28px] bg-white p-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:h-[70vh] sm:p-6">
                    {!activeId ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                            <MessageCircle size={40} />
                            <p className="text-sm">Select a conversation to start</p>
                        </div>
                    ) : (
                        <div className="flex h-full min-h-0 flex-col">
                            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 pb-4">
                                <h2 className="text-sm font-semibold text-black">
                                    {activeConversation?.user?.name || "Unknown user"}
                                </h2>
                                <span className="text-xs text-gray-400">
                                    {activeConversation?.user?.email}
                                </span>
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
                                                        className={`max-w-[65%] rounded-2xl px-3 py-2 text-sm ${
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
                                    className="flex-1 rounded-xl bg-gray-50 px-3 py-2.5 text-sm outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-white transition hover:opacity-90"
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