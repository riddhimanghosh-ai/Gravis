import type { AbcClass } from "@/types";

export interface AbcInput {
  productId: string;
  annualRevenue: number;
  annualUnits: number;
}

export interface AbcResult extends AbcInput {
  cumulativeShare: number;
  abcClass: AbcClass;
  velocityBand: "high" | "medium" | "low";
}

export const classifyAbc = (records: AbcInput[]): AbcResult[] => {
  const sorted = [...records].sort((a, b) => b.annualRevenue - a.annualRevenue);
  const total = sorted.reduce((sum, record) => sum + record.annualRevenue, 0);
  let cumulative = 0;

  return sorted.map((record) => {
    cumulative += record.annualRevenue;
    const share = cumulative / Math.max(total, 1);
    return {
      ...record,
      cumulativeShare: share,
      abcClass: share <= 0.8 ? "A" : share <= 0.95 ? "B" : "C",
      velocityBand: record.annualUnits > 5000 ? "high" : record.annualUnits > 2500 ? "medium" : "low",
    };
  });
};
