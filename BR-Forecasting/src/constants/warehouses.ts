export type WarehouseStatus = "safe" | "warning" | "breach";

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  tempC: number;
  targetTempC: number;
  status: WarehouseStatus;
  capacityUsedPct: number;
}

export const warehouses: Warehouse[] = [
  // Mumbai
  { id: "wh-mum-01", name: "Bhiwandi Cold Hub", city: "Mumbai", latitude: 19.299, longitude: 73.058, tempC: -19.2, targetTempC: -18, status: "safe", capacityUsedPct: 72 },
  { id: "wh-mum-02", name: "Taloja Storage", city: "Mumbai", latitude: 19.008, longitude: 73.119, tempC: -18.5, targetTempC: -18, status: "safe", capacityUsedPct: 61 },
  { id: "wh-mum-03", name: "Turbhe Facility", city: "Mumbai", latitude: 19.076, longitude: 73.012, tempC: -17.1, targetTempC: -18, status: "warning", capacityUsedPct: 84 },

  // Delhi
  { id: "wh-del-01", name: "Manesar Hub", city: "Delhi", latitude: 28.358, longitude: 76.937, tempC: -19.4, targetTempC: -18, status: "safe", capacityUsedPct: 55 },
  { id: "wh-del-02", name: "Kundli Cold Store", city: "Delhi", latitude: 28.866, longitude: 77.019, tempC: -14.2, targetTempC: -18, status: "breach", capacityUsedPct: 78 },
  { id: "wh-del-03", name: "Faridabad Facility", city: "Delhi", latitude: 28.408, longitude: 77.313, tempC: -18.8, targetTempC: -18, status: "safe", capacityUsedPct: 49 },

  // Bengaluru
  { id: "wh-blr-01", name: "Bommasandra Hub", city: "Bengaluru", latitude: 12.826, longitude: 77.696, tempC: -19.6, targetTempC: -18, status: "safe", capacityUsedPct: 67 },
  { id: "wh-blr-02", name: "Whitefield Storage", city: "Bengaluru", latitude: 12.969, longitude: 77.749, tempC: -18.9, targetTempC: -18, status: "safe", capacityUsedPct: 53 },

  // Chennai
  { id: "wh-che-01", name: "Sriperumbudur Hub", city: "Chennai", latitude: 12.964, longitude: 79.946, tempC: -16.8, targetTempC: -18, status: "warning", capacityUsedPct: 91 },
  { id: "wh-che-02", name: "Ambattur Facility", city: "Chennai", latitude: 13.114, longitude: 80.155, tempC: -19.1, targetTempC: -18, status: "safe", capacityUsedPct: 62 },

  // Hyderabad
  { id: "wh-hyd-01", name: "Patancheru Cold Hub", city: "Hyderabad", latitude: 17.527, longitude: 78.265, tempC: -16.1, targetTempC: -18, status: "breach", capacityUsedPct: 88 },
  { id: "wh-hyd-02", name: "Jeedimetla Storage", city: "Hyderabad", latitude: 17.504, longitude: 78.436, tempC: -18.7, targetTempC: -18, status: "safe", capacityUsedPct: 44 },

  // Pune
  { id: "wh-pun-01", name: "Chakan Facility", city: "Pune", latitude: 18.762, longitude: 73.853, tempC: -19.3, targetTempC: -18, status: "safe", capacityUsedPct: 58 },
  { id: "wh-pun-02", name: "Ranjangaon Hub", city: "Pune", latitude: 18.773, longitude: 74.283, tempC: -18.4, targetTempC: -18, status: "safe", capacityUsedPct: 71 },

  // Ahmedabad (heatwave zone)
  { id: "wh-ahm-01", name: "Naroda Cold Store", city: "Ahmedabad", latitude: 23.069, longitude: 72.651, tempC: -15.3, targetTempC: -18, status: "breach", capacityUsedPct: 76 },
  { id: "wh-ahm-02", name: "Vatva Facility", city: "Ahmedabad", latitude: 22.980, longitude: 72.652, tempC: -17.4, targetTempC: -18, status: "warning", capacityUsedPct: 69 },

  // Kolkata
  { id: "wh-kol-01", name: "Dankuni Hub", city: "Kolkata", latitude: 22.681, longitude: 88.266, tempC: -19.0, targetTempC: -18, status: "safe", capacityUsedPct: 48 },
  { id: "wh-kol-02", name: "Uluberia Storage", city: "Kolkata", latitude: 22.469, longitude: 88.107, tempC: -18.6, targetTempC: -18, status: "safe", capacityUsedPct: 57 },
];
