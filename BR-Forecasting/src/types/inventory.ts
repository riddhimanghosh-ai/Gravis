export type StockStatus = "healthy" | "watch" | "critical" | "excess";

export interface InventorySnapshot {
  storeId: string;
  productId: string;
  timestamp: Date;
  quantityOnHand: number;
  quantityOnOrder: number;
  quantityReservedOnline: number;
  safetyStockLevel: number;
  reorderPoint: number;
  eoqQuantity: number;
  daysOfStock: number;
  status: StockStatus;
}
