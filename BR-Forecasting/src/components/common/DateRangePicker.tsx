import { addDays } from "date-fns";
import { useAppStore } from "@/store/useAppStore";

export default function DateRangePicker() {
  const startDate = useAppStore((state) => state.startDate);
  const endDate = useAppStore((state) => state.endDate);
  const setDateRange = useAppStore((state) => state.setDateRange);

  return (
    <div className="flex items-center gap-2">
      <button className="rounded-2xl border border-brown/10 px-4 py-3 text-sm" type="button" onClick={() => setDateRange(new Date(), addDays(new Date(), 14))}>
        14D
      </button>
      <button className="rounded-2xl border border-brown/10 px-4 py-3 text-sm" type="button" onClick={() => setDateRange(new Date(), addDays(new Date(), 30))}>
        30D
      </button>
      <span className="subtle">
        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
      </span>
    </div>
  );
}
