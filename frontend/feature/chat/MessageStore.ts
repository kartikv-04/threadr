import { create } from "zustand";
import { Message } from "@/feature/chat/chat.type"; 

type MessageState = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  clearMessages: () => void;
};

export const useMessageStore = create<MessageState>()((set) => ({
  messages: [],
  
  // Used when switching channels to clear the buffer
  clearMessages: () => set({ messages: [] }),

  // (Optional) Used if to fetch initial messages manually
  setMessages: (messages) => set({ messages }),

  // Prevent duplicates when adding real-time messages
  addMessage: (newMsg) => set((state) => {
    // 1. Check if message already exists (by ID)
    const exists = state.messages.some((msg) => msg.messageId === newMsg.messageId);
    if (exists) return state;

    // 2. Add to end
    return { messages: [...state.messages, newMsg] };
  }),

  updateMessage: (updatedMsg) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.messageId === updatedMsg.messageId ? { ...msg, ...updatedMsg } : msg
    ),
  })),
}));
