import { MapPin } from "lucide-react";
import { CITIES, useAppStore, type City } from "@/store/useAppStore";

export default function CitySelector() {
  const activeCity = useAppStore((s) => s.activeCity);
  const setActiveCity = useAppStore((s) => s.setActiveCity);

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-brown/10 bg-white px-3 py-2.5 text-sm">
      <MapPin size={14} className="flex-shrink-0 text-primary" />
      <select
        value={activeCity}
        onChange={(e) => setActiveCity(e.target.value as City)}
        className="bg-transparent text-sm font-medium text-brown outline-none cursor-pointer"
      >
        {CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
}
