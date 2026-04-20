import { eachDayOfInterval, getMonth } from "date-fns";
import type { WeatherRecord } from "@/types";

export const generateWeatherSeries = (city: string, start: Date, end: Date): WeatherRecord[] =>
  eachDayOfInterval({ start, end }).map((date, index) => {
    const month = getMonth(date);
    const seasonalTemp = [22, 24, 28, 31, 34, 33, 29, 28, 29, 27, 24, 22][month];
    const rainfall = [1, 1, 2, 5, 18, 75, 120, 110, 70, 16, 6, 2][month];
    const temperatureC = seasonalTemp + Math.sin(index / 5) * 2;
    const rainfallMm = Math.max(0, rainfall + Math.cos(index / 3) * 12);
    return {
      city,
      date,
      temperatureC,
      rainfallMm,
      humidityPct: 45 + rainfallMm / 3,
      weatherMultiplier: Math.max(0.65, 1 + (temperatureC - 28) * 0.025 - rainfallMm * 0.002),
    };
  });
