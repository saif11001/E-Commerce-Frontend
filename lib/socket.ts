import api from "@/lib/axios";
import { io, Socket } from "socket.io-client";

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || "http://localhost:4000";

let socket: Socket | null = null;
let chatToken: string | null = null;

export const connectToChat = async (): Promise<Socket | null> => {
    if (socket?.connected) return socket;

    try {
        const { data } = await api.get("/auth/chat-token");
        chatToken = data.chatToken;

        socket = io(CHAT_SERVER_URL, {
            auth: {
                token: chatToken,
            },
        });

        return socket;
    } catch (error) {
        console.error("Failed to connect to chat:", error);
        return null;
    }
};

export const getSocket = (): Socket | null => socket;

export const getChatToken = (): string | null => chatToken;

export const chatApiFetch = async (path: string) => {
    if (!chatToken) throw new Error("Not connected to chat");

    const res = await fetch(`${CHAT_SERVER_URL}${path}`, {
        headers: {
            Authorization: `Bearer ${chatToken}`,
        },
    });

    if (!res.ok) throw new Error("Chat request failed");
    return res.json();
};

export const disconnectChat = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    chatToken = null;
};