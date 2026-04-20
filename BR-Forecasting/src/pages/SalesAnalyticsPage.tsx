import ChannelWaterfall from "@/components/charts/ChannelWaterfall";
import PromotionLiftBar from "@/components/charts/PromotionLiftBar";

export default function SalesAnalyticsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChannelWaterfall
        data={[
          { channel: "Walk-in", value: 53 },
          { channel: "Delivery", value: 22 },
          { channel: "Online", value: 18 },
          { channel: "Pre-order", value: 7 },
        ]}
      />
      <PromotionLiftBar
        data={[
          { name: "Promo SKU", lift: 22 },
          { name: "Cannibalized SKU", lift: -8 },
          { name: "Halo SKU", lift: 6 },
          { name: "Base", lift: 0 },
        ]}
      />
    </div>
  );
}
