export interface ExternalOverlayInput {
  weatherMultiplier: number;
  festivalMultiplier: number;
  eventMultiplier: number;
}

export const applyExternalOverlay = (forecast: number, overlay: ExternalOverlayInput) =>
  forecast * overlay.weatherMultiplier * overlay.festivalMultiplier * overlay.eventMultiplier;
