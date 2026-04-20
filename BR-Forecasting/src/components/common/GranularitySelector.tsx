import { useAppStore } from "@/store/useAppStore";

export default function GranularitySelector() {
  const granularity = useAppStore((state) => state.granularity);
  const setGranularity = useAppStore((state) => state.setGranularity);

  return (
    <select className="rounded-2xl border border-brown/10 bg-white px-4 py-3 text-sm" value={granularity} onChange={(event) => setGranularity(event.target.value as typeof granularity)}>
      <option value="hourly">Hourly</option>
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </select>
  );
}
