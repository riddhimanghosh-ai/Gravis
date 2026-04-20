import { addDays } from "date-fns";
import type { PromotionRecord } from "@/types";

export const generatePromotions = (productIds: string[]): PromotionRecord[] =>
  Array.from({ length: 18 }, (_, index) => ({
    id: `promo-${index + 1}`,
    name: index % 3 === 0 ? "Weekend Scoop Combo" : index % 3 === 1 ? "Family Pack Push" : "Shake Festival",
    startDate: addDays(new Date("2024-01-01"), index * 20),
    endDate: addDays(new Date("2024-01-01"), index * 20 + 4),
    discountPct: 10 + (index % 5) * 5,
    productIds: productIds.filter((_, productIndex) => productIndex % 3 === index % 3).slice(0, 6),
    channelBias: {
      "walk-in": 1.15,
      delivery: 1.12,
      online: 1.08,
    },
  }));
