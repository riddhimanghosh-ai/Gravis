import clsx from "clsx";
import type { ReactNode } from "react";

export interface InsightCardProps {
  icon: ReactNode;
  headline: string;
  metric: string;
  severity: "info" | "watch" | "critical";
  action: string;
}

export default function AIInsightCard({ icon, headline, metric, severity, action }: InsightCardProps) {
  return (
    <article
      className={clsx(
        "panel border-l-4 p-4",
        severity === "critical" && "border-l-rose-500",
        severity === "watch" && "border-l-amber-400",
        severity === "info" && "border-l-emerald-400"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={clsx(
            "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl",
            severity === "critical" && "bg-rose-100 text-rose-600",
            severity === "watch" && "bg-amber-100 text-amber-600",
            severity === "info" && "bg-emerald-100 text-emerald-600"
          )}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brown/50">{headline}</p>
          <p className="mt-0.5 text-base font-semibold text-brown">{metric}</p>
          <p className="subtle mt-1 text-xs">{action}</p>
        </div>
      </div>
    </article>
  );
}
