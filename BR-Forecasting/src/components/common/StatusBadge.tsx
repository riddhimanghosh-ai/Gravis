import clsx from "clsx";

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx("rounded-full px-3 py-1 text-xs font-semibold", {
        "bg-green-100 text-green-700": status === "healthy",
        "bg-amber-100 text-amber-700": status === "watch" || status === "excess",
        "bg-rose-100 text-rose-700": status === "critical",
      })}
    >
      {status}
    </span>
  );
}
