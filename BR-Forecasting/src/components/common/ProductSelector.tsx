import { dataApi } from "@/data";
import { useAppStore } from "@/store/useAppStore";

export default function ProductSelector() {
  const value = useAppStore((state) => state.activeProductId);
  const setValue = useAppStore((state) => state.setActiveProductId);
  return (
    <select className="rounded-2xl border border-brown/10 bg-white px-4 py-3 text-sm" value={value} onChange={(event) => setValue(event.target.value)}>
      {dataApi.products.map((product) => (
        <option key={product.id} value={product.id}>
          {product.name}
        </option>
      ))}
    </select>
  );
}
