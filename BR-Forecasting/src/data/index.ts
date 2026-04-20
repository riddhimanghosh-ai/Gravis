import { subDays } from "date-fns";
import { festivals } from "@/constants/festivals";
import { products } from "@/constants/products";
import { stores } from "@/constants/stores";
import { generateInventory } from "./generators/inventoryGenerator";
import { generatePromotions } from "./generators/promotionGenerator";
import { generateSalesSeries } from "./generators/salesGenerator";
import { generateWeatherSeries } from "./generators/weatherGenerator";

const start = subDays(new Date(), 730);
const end = new Date();

const weatherByCity = Object.fromEntries(
  [...new Set(stores.map((store) => store.city))].map((city) => [city, generateWeatherSeries(city, start, end)]),
);

export const dataApi = {
  products,
  stores,
  festivals,
  promotions: generatePromotions(products.map((product) => product.id)),
  weatherByCity,
  inventory: generateInventory(stores, products),
  sales: stores.flatMap((store) => generateSalesSeries(store, products, weatherByCity[store.city], festivals)),
};
