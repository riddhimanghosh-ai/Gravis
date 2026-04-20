export default function ReportsPage() {
  return (
    <div className="panel p-6">
      <p className="label">Reports</p>
      <h2 className="mt-2 text-2xl font-semibold text-brown">Export-ready views</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          "Forecast Accuracy Pack",
          "Inventory Health Report",
          "Markdown Opportunity Report",
          "Regional Store Performance",
          "AI Exception Summary",
          "Executive Weekly Review",
        ].map((name) => (
          <button key={name} type="button" className="rounded-2xl border border-brown/10 bg-white p-5 text-left transition hover:border-primary/40 hover:bg-primary/5">
            <h3 className="font-semibold text-brown">{name}</h3>
            <p className="subtle mt-2">Prepared for CSV / print style export in a later pass.</p>
          </button>
        ))}
      </div>
    </div>
  );
}
