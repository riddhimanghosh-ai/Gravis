import { useState } from "react";
import { format, addDays } from "date-fns";
import { useAppStore } from "@/store/useAppStore";
import { useChatStore } from "@/store/useChatStore";
import { useAlertStore } from "@/store/useAlertStore";
import { dataApi } from "@/data";
import { rmIngredients } from "@/constants/rmIngredients";
import { warehouses } from "@/constants/warehouses";
import type { ChatMessage } from "@/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function buildLiveDataBlock(
  activeStoreId: string,
  activeProductId: string,
  criticalAlerts: ReturnType<typeof useAlertStore.getState>["alerts"],
): string {
  const store = dataApi.stores.find((s) => s.id === activeStoreId) ?? dataApi.stores[0];
  const product = dataApi.products.find((p) => p.id === activeProductId) ?? dataApi.products[0];

  // Store-level inventory snapshot for active store
  const storeInventory = dataApi.inventory
    .filter((i) => i.storeId === store.id)
    .sort((a, b) => a.daysOfStock - b.daysOfStock);

  const criticalSKUs = storeInventory.filter((i) => i.status === "critical").slice(0, 5);
  const excessSKUs = storeInventory.filter((i) => i.status === "excess").slice(0, 3);

  const criticalLines = criticalSKUs.map((i) => {
    const p = dataApi.products.find((p) => p.id === i.productId);
    return `  - ${p?.name ?? i.productId}: ${Math.round(i.quantityOnHand)} units on hand, ${Math.round(i.daysOfStock)}d cover, reorder point ${Math.round(i.reorderPoint)}`;
  });

  const excessLines = excessSKUs.map((i) => {
    const p = dataApi.products.find((p) => p.id === i.productId);
    return `  - ${p?.name ?? i.productId}: ${Math.round(i.quantityOnHand)} units (${Math.round(i.daysOfStock)}d cover, safety stock ${Math.round(i.safetyStockLevel)})`;
  });

  // Active product inventory detail
  const productInv = storeInventory.find((i) => i.productId === product.id);

  // Network-wide critical count
  const networkCritical = dataApi.inventory.filter((i) => i.status === "critical").length;
  const networkExcess = dataApi.inventory.filter((i) => i.status === "excess").length;

  // RM runway
  const rmLines = rmIngredients.map((ing) => {
    const dailyBurn = ing.forecastedDemandLiters / 30;
    const daysLeft = dailyBurn > 0 ? Math.floor(ing.currentStockKg / dailyBurn) : 999;
    const stockoutDate = daysLeft < 999 ? format(addDays(new Date(), daysLeft), "d MMM") : "N/A";
    const trend = ing.priceTrend30d === "up" ? `↑ +${ing.priceTrendPct}%` : ing.priceTrend30d === "down" ? `↓ ${ing.priceTrendPct}%` : "stable";
    return `  - ${ing.name}: ${ing.currentStockKg.toLocaleString()} kg stock · ${daysLeft}d runway · stockout ${stockoutDate} · ₹${ing.costPerKg}/kg (${trend})`;
  });

  // Warehouse status
  const breachWhs = warehouses.filter((w) => w.status === "breach");
  const warnWhs = warehouses.filter((w) => w.status === "warning");

  // Top alerts
  const alertLines = criticalAlerts.slice(0, 4).map(
    (a) => `  - [${a.severity.toUpperCase()}] ${a.title}: ${a.description} → ${a.recommendedAction}`
  );

  // Weather
  const weatherLines = Object.entries(dataApi.weatherByCity)
    .slice(0, 6)
    .map(([city, records]) => {
      const latest = records[records.length - 1];
      return latest
        ? `  - ${city}: ${Math.round(latest.temperatureC)}°C, humidity ${latest.humidityPct}%, rain ${latest.rainfallMm}mm`
        : `  - ${city}: no data`;
    });

  const today = format(new Date(), "d MMMM yyyy");

  return `
## Date
${today}

## Active Context
- Store: ${store.name}, ${store.city} (format: ${store.format}, online share: ${Math.round(store.onlineShare * 100)}%)
- SKU in focus: ${product.name} (₹${product.basePrice} base price, ₹${product.costPrice} cost, ${product.shelfLifeHours}h shelf life)${
    productInv
      ? `\n- ${product.name} stock here: ${Math.round(productInv.quantityOnHand)} units · ${Math.round(productInv.daysOfStock)}d cover · status: ${productInv.status}`
      : ""
  }

## ${store.name} — Inventory Alerts (${criticalSKUs.length} critical, ${excessSKUs.length} excess)
Critical SKUs (below reorder point):
${criticalLines.length > 0 ? criticalLines.join("\n") : "  None"}
Excess SKUs (overstock):
${excessLines.length > 0 ? excessLines.join("\n") : "  None"}

## Network-Wide Inventory
- ${networkCritical} critical SKUs across all 30 stores
- ${networkExcess} excess SKUs — rebalancing before reorder can save procurement cost

## Raw Material Status (Pune Factory)
${rmLines.join("\n")}

## Cold-Chain (Snowman — 18 warehouses)
- Temperature breaches: ${breachWhs.length > 0 ? breachWhs.map((w) => `${w.name} (${w.tempC}°C)`).join(", ") : "None"}
- Warnings: ${warnWhs.length > 0 ? warnWhs.map((w) => `${w.name} (${w.tempC}°C)`).join(", ") : "None"}

## Active Alerts
${alertLines.length > 0 ? alertLines.join("\n") : "  No critical alerts"}

## Current Weather
${weatherLines.join("\n")}
`.trim();
}

function buildSystemPrompt(liveData: string): string {
  return `You are ScoopBot, the AI supply chain copilot for Baskin Robbins India's Graviss Supply Intelligence (GSI) platform.

## Your Role
You help procurement managers, plant managers, and logistics leads make data-driven decisions across 30 stores in 6 Indian cities (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Pune). You have access to live inventory, raw material levels, warehouse temperatures, sales forecasts, and pricing data.

## Live Operational Data
${liveData}

## How to Answer
- Be specific: name stores, SKUs, quantities, dates, and ₹ values
- Always quantify the financial impact of a problem or recommendation
- For procurement questions: state quantity, cost, supplier, lead time
- For stock questions: state exact units, days of cover, and the action required by when
- For warehouse questions: state which facilities are affected and what to move
- Keep responses under 200 words unless a detailed breakdown is requested
- Use bullet points for multi-step recommendations
- If the data shows no issue, say so clearly`;
}

export function useGroqChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GroqMessage[]>([]);

  const activeStoreId = useAppStore((s) => s.activeStoreId);
  const activeProductId = useAppStore((s) => s.activeProductId);
  const alerts = useAlertStore((s) => s.alerts);
  const { messages, pushMessage } = useChatStore();

  const ask = async (text: string) => {
    pushMessage({ id: crypto.randomUUID(), role: "user", text, timestamp: new Date() });

    const criticalAlerts = alerts.filter((a) => a.severity === "critical");
    const liveData = buildLiveDataBlock(activeStoreId, activeProductId, criticalAlerts);
    const systemPrompt = buildSystemPrompt(liveData);

    const newHistory: GroqMessage[] = [...history, { role: "user", content: text }];

    setIsLoading(true);
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: systemPrompt }, ...newHistory],
          max_tokens: 500,
          temperature: 0.35,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json() as { choices: { message: { content: string } }[] };
      const reply = data.choices[0]?.message?.content ?? "I couldn't generate a response. Please try again.";

      setHistory([...newHistory, { role: "assistant" as const, content: reply }].slice(-20));
      pushMessage({ id: crypto.randomUUID(), role: "assistant", text: reply, timestamp: new Date() });
    } catch (err) {
      const msg = err instanceof Error
        ? err.message.includes("401") ? "Invalid API key. Add VITE_GROQ_API_KEY to your .env.local file."
        : err.message.includes("429") ? "Rate limit hit. Please wait a moment and try again."
        : `Error: ${err.message}`
        : "Unknown error. Please try again.";
      pushMessage({ id: crypto.randomUUID(), role: "assistant", text: msg, timestamp: new Date() });
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, ask, isLoading };
}
