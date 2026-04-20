import { eachDayOfInterval, getDay, getMonth, isWeekend } from "date-fns";
import type { Product, SalesRecord, Store, WeatherRecord } from "@/types";
import type { FestivalEvent } from "@/constants/festivals";

const hourProfile = [0.01, 0.005, 0.005, 0.005, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.09, 0.1, 0.11, 0.1, 0.1, 0.09, 0.08, 0.06, 0.04, 0.025, 0.015, 0.01];
const dowIndex = [0.85, 0.9, 0.95, 1, 1.08, 1.25, 1.28];

const channelForStore = (store: Store, hour: number): SalesRecord["channel"] => {
  if (hour >= 17 && store.onlineShare > 0.28) return "delivery";
  if (hour <= 12) return "walk-in";
  if (store.format === "family") return "online";
  return "walk-in";
};

export const generateSalesSeries = (
  store: Store,
  products: Product[],
  weather: WeatherRecord[],
  festivals: FestivalEvent[],
): SalesRecord[] => {
  const festivalMap = new Map(festivals.map((festival) => [festival.date, festival.multiplier]));
  return weather.flatMap((weatherDay) => {
    const month = getMonth(weatherDay.date);
    const dayIndex = getDay(weatherDay.date);
    const festivalMultiplier = festivalMap.get(weatherDay.date.toISOString().slice(0, 10)) ?? 1;

    return products.flatMap((product) => {
      const baseDemand =
        18 *
        store.baseDemandMultiplier *
        product.seasonalMultipliers[month] *
        dowIndex[dayIndex] *
        weatherDay.weatherMultiplier *
        festivalMultiplier *
        (isWeekend(weatherDay.date) ? 1.08 : 1);

      return hourProfile.map((hourShare, hour) => {
        const noise = 1 + Math.sin(hour + month) * 0.08 + Math.cos(dayIndex + hour / 4) * 0.04;
        const units = Math.max(0, Math.round(baseDemand * hourShare * noise));
        return {
          storeId: store.id,
          productId: product.id,
          date: weatherDay.date,
          hour,
          units,
          revenue: units * product.basePrice,
          channel: channelForStore(store, hour),
        };
      });
    });
  });
};
