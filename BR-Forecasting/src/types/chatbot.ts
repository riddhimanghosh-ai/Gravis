export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export interface ChatIntent {
  intent: "forecast" | "inventory" | "pricing" | "alerts" | "staffing" | "generic";
  confidence: number;
}
