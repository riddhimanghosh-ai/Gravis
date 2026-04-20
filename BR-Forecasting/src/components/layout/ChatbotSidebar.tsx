import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useChatbot } from "@/hooks/useChatbot";
import { useGroqChat } from "@/hooks/useGroqChat";

const hasGroqKey = Boolean(import.meta.env.VITE_GROQ_API_KEY);

export default function ChatbotSidebar() {
  const isOpen = useChatStore((state) => state.isOpen);
  const toggle = useChatStore((state) => state.toggle);
  const [draft, setDraft] = useState("");

  const groq = useGroqChat();
  const legacy = useChatbot();

  const messages = groq.messages;
  const ask = hasGroqKey ? groq.ask : legacy.ask;
  const isLoading = hasGroqKey ? groq.isLoading : false;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim() || isLoading) return;
    ask(draft.trim());
    setDraft("");
  };

  return (
    <aside
      className={`fixed right-4 top-4 z-30 h-[calc(100vh-2rem)] w-[360px] rounded-3xl border border-brown/10 bg-white shadow-glass transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-[420px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brown/10 px-5 py-4">
        <div>
          <p className="label">AI Copilot</p>
          <h3 className="font-semibold text-brown">
            ScoopBot
            {hasGroqKey && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Groq · Llama 3.3</span>}
          </h3>
        </div>
        <button type="button" onClick={toggle} className="rounded-full p-1.5 transition hover:bg-brown/10">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex h-[calc(100%-148px)] flex-col gap-3 overflow-auto p-5">
        {messages.length === 0 && (
          <div className="rounded-2xl bg-surface px-4 py-3 text-sm text-brown">
            Hi! I'm ScoopBot. Ask me about stockouts, raw material prices, cold-chain breaches, demand forecasts, or procurement decisions.
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              message.role === "assistant" ? "bg-surface text-brown" : "bg-primary text-white"
            }`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 text-sm text-brown/60">
            <Loader2 size={14} className="animate-spin" />
            ScoopBot is thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <form className="border-t border-brown/10 p-4" onSubmit={handleSubmit}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={isLoading}
          className="h-20 w-full resize-none rounded-2xl border border-brown/10 p-3 text-sm outline-none focus:border-primary/40 disabled:opacity-50"
          placeholder="Ask about procurement, stockouts, forecast drivers, cold-chain..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !draft.trim()}
          className="mt-2.5 w-full rounded-2xl bg-brown px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-brown/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Thinking..." : "Ask ScoopBot"}
        </button>
      </form>
    </aside>
  );
}
