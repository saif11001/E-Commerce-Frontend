import api from "@/lib/axios";
import { io, Socket } from "socket.io-client";

const CHAT_SERVER_URL = "http://localhost:4000";

let socket: Socket | null = null;

export const connectToChat = async (): Promise<Socket | null> => {
    if (socket?.connected) return socket;

    try {
        const { data } = await api.get("/auth/chat-token");
        const chatToken = data.chatToken;

        socket = io(CHAT_SERVER_URL, {
            auth: {
                token: chatToken
            }
        });

        return socket;
    } catch (error) {
        console.error("Failed to connect to chat:", error);
        return null;
    }
};

export const getSocket = (): Socket | null => socket;

export const disconnectChat = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};