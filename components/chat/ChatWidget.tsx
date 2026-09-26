"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { connectToChat, disconnectChat, chatApiFetch } from "@/lib/socket";
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

type ChatWidgetProps = {
    variant?: "floating" | "inline";
    onCloseInline?: () => void;
};

const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function ChatWidget({ variant = "floating", onCloseInline }: ChatWidgetProps) {
    const { user, isAuthenticated } = useAuthStore();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(variant === "inline");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSupportTyping, setIsSupportTyping] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isOpenRef = useRef(isOpen);

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
        if (!isAuthenticated) return;

        let mounted = true;

        const setup = async () => {
            const socket = await connectToChat();
            if (!socket || !mounted) return;

            socketRef.current = socket;

            socket.on("connect", () => {
                setIsConnected(true);
            });

            socket.on("disconnect", () => {
                setIsConnected(false);
            });

            socket.on("chat message", (msg: Message) => {
                setMessages((prev) => [...prev, msg]);

                if (msg.senderRole !== "user" && !isOpenRef.current) {
                    setUnreadCount((prev) => prev + 1);
                }

                if (isOpenRef.current && msg.senderRole !== "user") {
                    socket.emit("mark read", { conversationId: user?._id });
                }
            });

            socket.on("typing", ({ role }: { role: string }) => {
                if (role !== "user") setIsSupportTyping(true);
            });

            socket.on("stop typing", ({ role }: { role: string }) => {
                if (role !== "user") setIsSupportTyping(false);
            });

            try {
                const { messages: history } = await chatApiFetch(`/messages/${user?._id}`);
                if (mounted) setMessages(history);
            } catch {
                // couldn't load history, chat just starts empty
            }
        };

        setup();

        return () => {
            mounted = false;
            disconnectChat();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    // Jump to the latest message whenever the chat is opened or messages change
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isSupportTyping]);

    useEffect(() => {
        if (isOpen && socketRef.current && user?._id) {
            setUnreadCount(0);
            socketRef.current.emit("mark read", { conversationId: user._id });
        }
    }, [isOpen, user?._id]);

    const handleInputChange = (value: string) => {
        setInput(value);
        if (!socketRef.current || !user) return;

        socketRef.current.emit("typing", { conversationId: user._id });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit("stop typing", { conversationId: user._id });
        }, 1500);
    };

    const handleSend = () => {
        if (!input.trim() || !socketRef.current || !user) return;

        socketRef.current.emit("chat message", {
            conversationId: user._id,
            content: input.trim(),
        });

        socketRef.current.emit("stop typing", { conversationId: user._id });
        setInput("");
    };

    const handleClose = () => {
        if (variant === "inline") {
            onCloseInline?.();
        } else {
            setIsOpen(false);
        }
    };

    if (variant === "floating" && pathname === "/contact") {
        return null;
    }

    const containerClass =
        variant === "floating"
            ? "flex h-125 w-80 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 sm:w-96"
            : "flex h-full w-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white";

    const chatBody = (
        <div className={containerClass}>
            <div className="flex items-center justify-between bg-linear-to-b from-gray-800 via-gray-700 to-black px-4 py-3 text-white">
                <span className="text-sm font-semibold">
                    {isAuthenticated ? (isConnected ? "Support Chat" : "Connecting...") : "Support Chat"}
                </span>
                <button onClick={handleClose}>
                    <X size={18} />
                </button>
            </div>

            {!isAuthenticated ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                    <p className="text-sm text-gray-500">
                        You need to log in first to chat with our support team.
                    </p>
                    <Link
                        href="/login"
                        onClick={handleClose}
                        className="rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Log In
                    </Link>
                </div>
            ) : (
                <>
                    <div className="flex-1 space-y-2 overflow-y-auto p-3">
                        {messages.map((msg, i) => {
                            const isMine = msg.senderRole === "user";
                            return (
                                <div
                                    key={msg._id || i}
                                    className={`flex flex-col ${isMine ? "items-start" : "items-end"}`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
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

                        {isSupportTyping && (
                            <div className="flex items-end">
                                <div className="rounded-2xl bg-gray-100 px-3 py-2 text-sm text-gray-400">
                                    Typing...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex items-center gap-2 border-t border-gray-100 p-2">
                        <input
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 rounded-xl bg-gray-50 px-3 py-2 text-sm outline-none"
                        />
                        <button
                            onClick={handleSend}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-white transition hover:opacity-90"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    if (variant === "inline") {
        return chatBody;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                chatBody
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-white shadow-lg transition hover:scale-105"
                >
                    <MessageCircle size={24} />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}