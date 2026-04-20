import { useAlertStore } from "@/store/useAlertStore";

export default function AlertBanner() {
  const alerts = useAlertStore((state) => state.alerts.slice(0, 3));
  return (
    <div className="mb-6 grid gap-3 lg:grid-cols-3">
      {alerts.map((alert) => (
        <article key={alert.id} className={`panel p-4 ${alert.severity === "critical" ? "border-primary/30 bg-primary/5" : ""}`}>
          <p className="label">{alert.severity}</p>
          <h3 className="mt-1 font-semibold text-brown">{alert.title}</h3>
          <p className="subtle mt-2">{alert.description}</p>
          <p className="mt-2 text-sm font-medium text-primary-dark">{alert.recommendedAction}</p>
        </article>
      ))}
    </div>
  );
}
