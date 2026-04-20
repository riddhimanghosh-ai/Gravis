export type SalesChannel = "walk-in" | "delivery" | "online" | "pre-order";

export interface SalesRecord {
  storeId: string;
  productId: string;
  date: Date;
  hour: number;
  units: number;
  revenue: number;
  channel: SalesChannel;
  promotionId?: string;
}

export interface PromotionRecord {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  discountPct: number;
  productIds: string[];
  channelBias: Partial<Record<SalesChannel, number>>;
}
