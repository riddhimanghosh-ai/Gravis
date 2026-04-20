export default function ConfidenceBand({ lower, upper }: { lower: number; upper: number }) {
  return <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-dark">{Math.round(lower)} - {Math.round(upper)}</span>;
}
