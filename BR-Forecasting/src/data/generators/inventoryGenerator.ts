import type { InventorySnapshot, Product, Store } from "@/types";
import { calculateEOQ } from "@/algorithms/inventory/eoq";
import { calculateReorderPoint } from "@/algorithms/inventory/reorderPoint";
import { calculateSafetyStock } from "@/algorithms/inventory/safetyStock";
import { thresholds } from "@/constants/thresholds";

export const generateInventory = (stores: Store[], products: Product[]): InventorySnapshot[] =>
  stores.flatMap((store, storeIndex) =>
    products.map((product, productIndex) => {
      const averageDailyDemand = 18 * store.baseDemandMultiplier * (1 + (productIndex % 5) * 0.06);
      const demandStdDev = averageDailyDemand * 0.22;
      const averageLeadTimeDays = product.category === "cakes" ? 2 : 4;
      const leadTimeStdDev = averageLeadTimeDays * 0.18;
      const safetyStock = calculateSafetyStock(
        thresholds.serviceLevelZScore,
        averageLeadTimeDays,
        demandStdDev,
        averageDailyDemand,
        leadTimeStdDev,
      );
      const reorderPoint = calculateReorderPoint(averageDailyDemand, averageLeadTimeDays, safetyStock);
      const eoqQuantity = calculateEOQ(averageDailyDemand * 365, 420, product.costPrice * 0.18, product.shelfLifeHours / 24, averageLeadTimeDays + 2);
      const quantityOnHand = reorderPoint * (0.75 + ((storeIndex + productIndex) % 4) * 0.28);
      const daysOfStock = quantityOnHand / Math.max(averageDailyDemand, 1);

      return {
        storeId: store.id,
        productId: product.id,
        timestamp: new Date(),
        quantityOnHand,
        quantityOnOrder: eoqQuantity * 0.35,
        quantityReservedOnline: quantityOnHand * store.onlineShare * 0.18,
        safetyStockLevel: safetyStock,
        reorderPoint,
        eoqQuantity,
        daysOfStock,
        status: daysOfStock < 2 ? "critical" : daysOfStock < 4 ? "watch" : daysOfStock > 12 ? "excess" : "healthy",
      };
    }),
  );
