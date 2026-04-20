import AIInsightCard, { type InsightCardProps } from "./AIInsightCard";

interface Props {
  insights: InsightCardProps[];
}

export default function AIInsightCardGrid({ insights }: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {insights.map((insight, i) => (
        <AIInsightCard key={i} {...insight} />
      ))}
    </section>
  );
}
