import { create } from "zustand";
import type { ChatMessage } from "@/types";

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  toggle: () => void;
  pushMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [
    {
      id: "welcome",
      role: "assistant",
      text: "Ask about forecast drivers, stock risk, markdowns, staffing, or anomalies.",
      timestamp: new Date(),
    },
  ],
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  pushMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));
