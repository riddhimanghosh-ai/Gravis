export default function HeatmapCell({ value }: { value: number }) {
  const tone = value > 12 ? "bg-primary/20" : value > 5 ? "bg-accent/20" : "bg-brown/10";
  return <div className={`flex h-12 items-center justify-center rounded-xl text-sm font-medium text-brown ${tone}`}>{value.toFixed(1)}</div>;
}
