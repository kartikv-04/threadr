import { create } from "zustand";
import { Message } from "@/feature/chat/type";

type MessageState = {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    clearMessages: () => void;
};

export const useMessageStore = create<MessageState>()((set) => ({
    messages: [],
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    clearMessages: () => set({ messages: [] }),
}));
