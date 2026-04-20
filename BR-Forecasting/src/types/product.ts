export type ProductCategory =
  | "scoops"
  | "family-packs"
  | "cakes"
  | "sundaes"
  | "shakes"
  | "tubs"
  | "toppings";

export type AbcClass = "A" | "B" | "C";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  basePrice: number;
  costPrice: number;
  shelfLifeHours: number;
  elasticity: number;
  substitutes: string[];
  seasonalMultipliers: Record<number, number>;
  festivalMultipliers: Record<string, number>;
  abcClass?: AbcClass;
}
