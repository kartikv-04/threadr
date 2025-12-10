import { create } from "zustand";
import { api } from "@/lib/api";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  isEdited?: boolean;
}

interface MessageState {
  messages: Message[];

  fetchMessages: (channelId: string, page?: number) => Promise<void>;
  sendMessage: (channelId: string, content: string) => Promise<void>;
  addMessage: (msg: Message) => void;
  updateMessage: (messageId: string, content: string) => void;
  // deleteMessage: ( content : string) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],

  fetchMessages: async (channelId, page = 1) => {
    const res = await api.get(`/messages/channel/${channelId}?page=${page}`);
    set({ messages: res.data.data });
  },

  sendMessage: async (channelId, content) => {
    await api.post("/messages", { channelId, content });
    // Don't add to store here, let socket handle it to avoid duplicates
  },

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  updateMessage: (messageId, content) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === messageId ? { ...m, content, isEdited: true } : m
      ),
    }))
    
}));
