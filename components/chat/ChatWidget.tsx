"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { connectToChat, disconnectChat } from "@/lib/socket";
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

export default function ChatWidget() {
    const { user, isAuthenticated } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            });
        };

        setup();

        return () => {
            mounted = false;
            disconnectChat();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !socketRef.current || !user) return;

        socketRef.current.emit("chat message", {
            conversationId: user._id,
            content: input.trim(),
        });

        setInput("");
    };

    if (!isAuthenticated) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="flex h-96 w-80 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
                    <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
                        <span className="text-sm font-semibold">
                            {isConnected ? "Support Chat" : "Connecting..."}
                        </span>
                        <button onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto p-3">
                        {messages.map((msg, i) => (
                            <div
                                key={msg._id || i}
                                className={`flex ${
                                    msg.senderRole === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                                        msg.senderRole === "user"
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-black"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex items-center gap-2 border-t border-gray-100 p-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 rounded-xl bg-gray-50 px-3 py-2 text-sm outline-none"
                        />
                        <button
                            onClick={handleSend}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105"
                >
                    <MessageCircle size={24} />
                </button>
            )}
        </div>
    );
}