import { dataApi } from "@/data";
import { classifyAbc } from "@/algorithms/inventory/abcClassifier";

export const useABCAnalysis = () =>
  classifyAbc(
    dataApi.products.map((product) => {
      const sales = dataApi.sales.filter((record) => record.productId === product.id);
      const annualRevenue = sales.reduce((sum, record) => sum + record.revenue, 0) / 2;
      const annualUnits = sales.reduce((sum, record) => sum + record.units, 0) / 2;
      return { productId: product.id, annualRevenue, annualUnits };
    }),
  );
