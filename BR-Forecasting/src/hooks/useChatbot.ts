import { dataApi } from "@/data";
import { useAppStore } from "@/store/useAppStore";
import { useChatStore } from "@/store/useChatStore";
import type { ChatIntent } from "@/types";

const parseIntent = (text: string): ChatIntent => {
  const lower = text.toLowerCase();
  if (lower.includes("forecast") || lower.includes("demand")) return { intent: "forecast", confidence: 0.9 };
  if (lower.includes("inventory") || lower.includes("stock")) return { intent: "inventory", confidence: 0.88 };
  if (lower.includes("price") || lower.includes("markdown")) return { intent: "pricing", confidence: 0.85 };
  if (lower.includes("staff") || lower.includes("shift")) return { intent: "staffing", confidence: 0.82 };
  if (lower.includes("alert") || lower.includes("anomaly")) return { intent: "alerts", confidence: 0.84 };
  return { intent: "generic", confidence: 0.5 };
};

export const useChatbot = () => {
  const activeStoreId = useAppStore((state) => state.activeStoreId);
  const activeProductId = useAppStore((state) => state.activeProductId);
  const { messages, pushMessage } = useChatStore();

  const ask = (text: string) => {
    const store = dataApi.stores.find((item) => item.id === activeStoreId) ?? dataApi.stores[0];
    const product = dataApi.products.find((item) => item.id === activeProductId) ?? dataApi.products[0];
    const intent = parseIntent(text);
    const response =
      intent.intent === "forecast"
        ? `${store.name} is forecast to stay elevated for ${product.name} because weather and weekend patterns are both supportive.`
        : intent.intent === "inventory"
          ? `${product.name} should be monitored against reorder point and reserved online stock before approving transfers.`
          : intent.intent === "pricing"
            ? `${product.name} shows strong promo sensitivity, so use controlled markdowns rather than aggressive price drops.`
            : intent.intent === "staffing"
              ? `Evening staffing should scale with delivery demand and scoop throughput, especially in delivery-heavy stores.`
              : intent.intent === "alerts"
                ? `Recent alert logic is driven by stock status and 28-day z-score deviations in unit sales.`
                : `I can explain forecast, inventory, markdown, staffing, and anomaly logic for the selected store and SKU.`;

    pushMessage({ id: crypto.randomUUID(), role: "user", text, timestamp: new Date() });
    pushMessage({ id: crypto.randomUUID(), role: "assistant", text: response, timestamp: new Date() });
  };

  return { messages, ask };
};
