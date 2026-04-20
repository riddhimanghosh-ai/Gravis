export interface FestivalEvent {
  key: string;
  name: string;
  date: string;
  multiplier: number;
}

export const festivals: FestivalEvent[] = [
  { key: "holi-2024", name: "Holi", date: "2024-03-25", multiplier: 1.5 },
  { key: "eid-2024", name: "Eid", date: "2024-04-11", multiplier: 1.22 },
  { key: "summer-2024", name: "Summer Break", date: "2024-05-15", multiplier: 1.2 },
  { key: "rakhi-2024", name: "Raksha Bandhan", date: "2024-08-19", multiplier: 1.18 },
  { key: "diwali-2024", name: "Diwali", date: "2024-11-01", multiplier: 1.6 },
  { key: "christmas-2024", name: "Christmas", date: "2024-12-25", multiplier: 1.18 },
  { key: "holi-2025", name: "Holi", date: "2025-03-14", multiplier: 1.5 },
  { key: "eid-2025", name: "Eid", date: "2025-03-31", multiplier: 1.22 },
  { key: "summer-2025", name: "Summer Break", date: "2025-05-15", multiplier: 1.2 },
  { key: "diwali-2025", name: "Diwali", date: "2025-10-20", multiplier: 1.6 },
  { key: "christmas-2025", name: "Christmas", date: "2025-12-25", multiplier: 1.18 },
  { key: "holi-2026", name: "Holi", date: "2026-03-03", multiplier: 1.5 },
  { key: "eid-2026", name: "Eid", date: "2026-03-20", multiplier: 1.22 },
  { key: "summer-2026", name: "Summer Break", date: "2026-05-15", multiplier: 1.2 },
  { key: "diwali-2026", name: "Diwali", date: "2026-11-08", multiplier: 1.6 },
];
