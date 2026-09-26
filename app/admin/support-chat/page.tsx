"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { connectToChat, disconnectChat, chatApiFetch, getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import type { Socket } from "socket.io-client";

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
    const { user } = useAuthStore();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isUserTyping, setIsUserTyping] = useState(false);

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
            // فشل تحميل القايمة، هتفضل فاضية لحد ما يوصل حدث جديد
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

        try {
            const { messages } = await chatApiFetch(`/messages/${conversationId}`);
            setMessages(messages);
        } catch {
            setMessages([]);
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
        <div className="flex h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]">
            <div className="flex w-80 shrink-0 flex-col border-r border-gray-100 bg-white">
                <div className="border-b border-gray-100 px-5 py-4">
                    <h2 className="text-lg font-extrabold text-black">Conversations</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="p-5 text-sm text-gray-400">No conversations yet.</p>
                    ) : (
                        conversations.map((c) => (
                            <button
                                key={c.conversationId}
                                onClick={() => openConversation(c.conversationId)}
                                className={`flex w-full flex-col gap-1 border-b border-gray-50 px-5 py-4 text-left transition ${
                                    activeId === c.conversationId ? "bg-gray-100" : "hover:bg-gray-50"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-black">
                                        {c.user?.name || "Unknown user"}
                                    </span>
                                    {c.unreadCount > 0 && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                            {c.unreadCount}
                                        </span>
                                    )}
                                </div>
                                <p className="truncate text-xs text-gray-500">{c.lastMessage}</p>
                                <span className="text-[10px] text-gray-400">
                                    {formatTime(c.lastMessageAt)}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col bg-gray-50/50">
                {!activeId ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-400">
                        <MessageCircle size={40} />
                        <p className="text-sm">Select a conversation to start</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
                            <span className="text-sm font-semibold text-black">
                                {activeConversation?.user?.name || "Unknown user"}
                            </span>
                        </div>

                        <div className="flex-1 space-y-2 overflow-y-auto p-5">
                            {messages.map((msg, i) => {
                                const isMine = msg.senderRole !== "user";
                                return (
                                    <div
                                        key={msg._id || i}
                                        className={`flex flex-col ${isMine ? "items-start" : "items-end"}`}
                                    >
                                        <div
                                            className={`max-w-[60%] rounded-2xl px-3 py-2 text-sm ${
                                                isMine ? "bg-gray-100 text-black" : "bg-black text-white"
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
                                <div className="flex items-end">
                                    <div className="rounded-2xl bg-gray-100 px-3 py-2 text-sm text-gray-400">
                                        بيكتب...
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
                            <input
                                value={input}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Type a reply..."
                                className="flex-1 rounded-xl bg-gray-50 px-3 py-2 text-sm outline-none"
                            />
                            <button
                                onClick={handleSend}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}