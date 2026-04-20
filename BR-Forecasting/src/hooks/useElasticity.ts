import { dataApi } from "@/data";
import { demandAtPrice, revenueAtPrice } from "@/algorithms/pricing/elasticity";
import { useAppStore } from "@/store/useAppStore";

export const useElasticity = () => {
  const productId = useAppStore((state) => state.activeProductId);
  const product = dataApi.products.find((item) => item.id === productId) ?? dataApi.products[0];
  const baseDemand = 120;

  return Array.from({ length: 11 }, (_, index) => {
    const discountPct = index * 5;
    const price = product.basePrice * (1 - discountPct / 100);
    return {
      discountPct,
      price,
      demand: demandAtPrice(baseDemand, product.basePrice, price, product.elasticity),
      revenue: revenueAtPrice(baseDemand, product.basePrice, price, product.elasticity),
    };
  });
};
