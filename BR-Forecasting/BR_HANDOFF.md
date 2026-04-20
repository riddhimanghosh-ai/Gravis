# BR Forecasting Handoff

## Location

- App path: `/Users/riddhiman/Documents/New project/BR-Forecasting`

## What is implemented

- Vite + React + TypeScript scaffold files
- Tailwind theme with Baskin Robbins-inspired pink / brown / cream palette
- Router with all requested top-level pages
- Shared app shell:
  - sidebar navigation
  - top bar with store / product / granularity controls
  - alerts banner
  - AI chatbot slide-out
- Domain types for products, stores, inventory, forecast, sales, weather, alerts, and chatbot
- Constants:
  - `35` SKU product catalog
  - `30` stores across `6` cities
  - festival calendar
  - planning thresholds
- Mock data layer:
  - weather generator
  - promotion generator
  - sales generator
  - inventory generator
  - in-memory `dataApi`
- Core algorithm files:
  - moving average
  - Holt-Winters
  - seasonal index
  - external factor overlay
  - ensemble demand forecast
  - safety stock
  - EOQ
  - reorder point
  - ABC classifier
  - elasticity
  - markdown optimizer
  - promotion impact
  - shift optimizer
  - z-score anomaly detection
- Zustand stores for app, forecast controls, inventory controls, chat, and alerts
- Hooks for demand forecast, inventory health, ABC, elasticity, chatbot, and weather factor
- Shared/common/chart components and first-cut page implementations

## What is still missing / rough

- Dependencies have not been installed yet in this environment
- The app has not been run through `vite` or `tsc` yet
- Charts and pages are first-pass functional views, not final product polish
- Some requested folders such as `components/modules/*` are not yet split out into finer-grained feature modules
- Mock data is realistic and typed, but still synthetic and in-memory
- Reports page is UI-only, with no CSV / print export implementation yet
- Chatbot is intent-matched local logic, not a full analytical reasoning engine

## Recommended next steps

1. Run `npm install`
2. Run `npm run dev`
3. Fix any TypeScript or import issues surfaced by the first compile
4. Break page logic into `components/modules/*`
5. Add richer what-if controls, cannibalization simulation, and store network visuals
6. Add export utilities and final responsive polish

## Notes

- This app was intentionally created as a separate project from the earlier HTML prototype
- The current build focuses on breadth first: all major modules exist in version one, with enough core logic to demonstrate the intended platform direction
