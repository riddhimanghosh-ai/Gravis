export interface Store {
  id: string;
  name: string;
  city: string;
  region: string;
  format: "high-street" | "mall" | "delivery-heavy" | "family";
  latitude: number;
  longitude: number;
  onlineShare: number;
  baseDemandMultiplier: number;
}
