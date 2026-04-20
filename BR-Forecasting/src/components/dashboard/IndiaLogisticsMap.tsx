import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import worldTopoJson from "@/assets/world-110m.json";
import type { Store } from "@/types";
import type { Warehouse, WarehouseStatus } from "@/constants/warehouses";

interface Props {
  stores: Store[];
  warehouses: Warehouse[];
}

const STATUS_COLOR: Record<WarehouseStatus, string> = {
  safe: "#22c55e",
  warning: "#f59e0b",
  breach: "#ef4444",
};

export default function IndiaLogisticsMap({ stores, warehouses }: Props) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  const breachCount = warehouses.filter((w) => w.status === "breach").length;
  const warningCount = warehouses.filter((w) => w.status === "warning").length;

  return (
    <div>
      {/* Legend */}
      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          Safe ({warehouses.filter((w) => w.status === "safe").length})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          Warning ({warningCount})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          Breach ({breachCount})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          BR Stores ({stores.length})
        </span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="mb-2 inline-block rounded-xl border border-brown/10 bg-white px-3 py-2 text-xs text-brown shadow-sm">
          {tooltip}
        </div>
      )}

      {/* Map */}
      <div className="overflow-hidden rounded-2xl bg-[#ddeef5]" style={{ height: 420 }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [80, 23], scale: 900 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup center={[80, 22]} zoom={1} minZoom={1} maxZoom={6}>
            {/* Country fills */}
            <Geographies geography={worldTopoJson}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isIndia = String(geo.id) === "356";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isIndia ? "#f5ece5" : "#c8dfc8"}
                      stroke={isIndia ? "#c4a882" : "#a8c8a8"}
                      strokeWidth={isIndia ? 1.2 : 0.4}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: isIndia ? "#ede0d5" : "#b8d0b8" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Store pins (small pink dots) */}
            {stores.map((store) => (
              <Marker
                key={store.id}
                coordinates={[store.longitude, store.latitude]}
                onMouseEnter={() => setTooltip(`${store.name} — ${store.city}`)}
                onMouseLeave={() => setTooltip(null)}
              >
                <circle r={3} fill="#E91E8C" fillOpacity={0.75} stroke="#fff" strokeWidth={0.6} style={{ cursor: "pointer" }} />
              </Marker>
            ))}

            {/* Warehouse pins (larger colored dots) */}
            {warehouses.map((wh) => (
              <Marker
                key={wh.id}
                coordinates={[wh.longitude, wh.latitude]}
                onMouseEnter={() =>
                  setTooltip(`${wh.name} | ${wh.tempC}°C (${wh.status.toUpperCase()}) · ${wh.capacityUsedPct}% capacity`)
                }
                onMouseLeave={() => setTooltip(null)}
              >
                <circle
                  r={7}
                  fill={STATUS_COLOR[wh.status]}
                  fillOpacity={0.88}
                  stroke="#fff"
                  strokeWidth={1.5}
                  style={{ cursor: "pointer" }}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}
