export type AlertSeverity = "info" | "watch" | "critical";

export interface AlertRecord {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  storeId?: string;
  productId?: string;
  createdAt: Date;
  recommendedAction: string;
}
