import { dataApi } from "@/data";

export default function SupplyChainPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="panel p-5">
        <p className="label">Store network</p>
        <div className="mt-4 grid gap-3">
          {dataApi.stores.slice(0, 10).map((store) => (
            <div key={store.id} className="rounded-2xl border border-brown/10 bg-white p-4">
              <h3 className="font-semibold text-brown">{store.name}</h3>
              <p className="subtle mt-1">{store.city} · {store.format} · online share {Math.round(store.onlineShare * 100)}%</p>
            </div>
          ))}
        </div>
      </section>
      <section className="panel p-5">
        <p className="label">Fulfillment guidance</p>
        <ul className="mt-4 space-y-3 text-sm text-brown/80">
          <li>Ringfence family packs for online promises in delivery-heavy stores.</li>
          <li>Prioritize cake replenishment ahead of festival weekends.</li>
          <li>Use transfer-first logic for excess tubs before markdowning high-velocity items.</li>
          <li>Escalate cold-chain capacity risks in Mumbai and Delhi clusters during summer peaks.</li>
        </ul>
      </section>
    </div>
  );
}
