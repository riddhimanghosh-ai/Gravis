import { useForecastStore } from "@/store/useForecastStore";

export default function ExternalFactorsPanel() {
  const { weatherMultiplier, festivalMultiplier, eventMultiplier, setOverlay } = useForecastStore();
  const sliders = [
    ["weatherMultiplier", "Weather", weatherMultiplier],
    ["festivalMultiplier", "Festival", festivalMultiplier],
    ["eventMultiplier", "Event", eventMultiplier],
  ] as const;

  return (
    <div className="panel p-5">
      <p className="label">External factors</p>
      <div className="mt-4 space-y-4">
        {sliders.map(([key, label, value]) => (
          <label key={key} className="block">
            <div className="mb-1 flex items-center justify-between text-sm text-brown">
              <span>{label}</span>
              <span>{value.toFixed(2)}x</span>
            </div>
            <input
              className="w-full"
              type="range"
              min="0.7"
              max="1.6"
              step="0.01"
              value={value}
              onChange={(event) => setOverlay(key, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
