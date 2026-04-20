import { X, Download } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import type { PurchaseOrderLineItem } from "@/types/rmInventory";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lineItems: PurchaseOrderLineItem[];
}

export default function PurchaseOrderModal({ isOpen, onClose, lineItems }: Props) {
  if (!isOpen) return null;

  const totalValue = lineItems.reduce((sum, item) => sum + item.totalCostInr, 0);

  function handleExport() {
    const headers = ["Ingredient", "Qty (kg)", "Unit Cost (₹)", "Total (₹)", "Supplier", "Lead Days", "Urgency"];
    const rows = lineItems.map((item) => [
      item.ingredientName,
      item.quantityKg,
      item.unitCostInr,
      item.totalCostInr,
      item.suggestedSupplier,
      item.deliveryLeadDays,
      item.urgency,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GSI_PO_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-brown/10 px-6 py-5">
          <div>
            <p className="label">AI-Recommended</p>
            <h2 className="text-xl font-semibold text-brown">Purchase Order</h2>
            <p className="subtle mt-1">Generated for next 30-day production cycle based on forecasted demand.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-brown/10 transition">
            <X size={18} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto px-6 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brown/10">
                <th className="pb-3 text-left font-medium text-brown/60">Ingredient</th>
                <th className="pb-3 text-right font-medium text-brown/60">Qty (kg)</th>
                <th className="pb-3 text-right font-medium text-brown/60">Unit Cost</th>
                <th className="pb-3 text-right font-medium text-brown/60">Total</th>
                <th className="pb-3 text-left font-medium text-brown/60">Supplier</th>
                <th className="pb-3 text-center font-medium text-brown/60">Lead Days</th>
                <th className="pb-3 text-center font-medium text-brown/60">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.ingredientId} className="border-b border-brown/5">
                  <td className="py-3 font-medium text-brown">{item.ingredientName}</td>
                  <td className="py-3 text-right tabular-nums">{item.quantityKg.toLocaleString()}</td>
                  <td className="py-3 text-right tabular-nums">₹{item.unitCostInr.toLocaleString()}</td>
                  <td className="py-3 text-right tabular-nums font-semibold">₹{item.totalCostInr.toLocaleString()}</td>
                  <td className="py-3">{item.suggestedSupplier}</td>
                  <td className="py-3 text-center">{item.deliveryLeadDays}d</td>
                  <td className="py-3 text-center">
                    <StatusBadge status={item.urgency === "critical" ? "critical" : "healthy"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-brown/10 px-6 py-4">
          <div>
            <p className="subtle text-sm">Total PO Value</p>
            <p className="text-2xl font-semibold text-brown">₹{totalValue.toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-brown/20 px-5 py-2.5 text-sm font-medium text-brown transition hover:bg-brown/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 rounded-2xl bg-brown px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-brown/80"
            >
              <Download size={14} />
              Confirm & Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
