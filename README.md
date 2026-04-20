# Polaris IQ Prototype

This repo contains a research-backed interactive prototype for an inventory, demand forecasting,
and operations planning platform tailored to the ice cream industry, using Baskin Robbins India
as the reference business context.

## Files

- `index.html` - interactive prototype
- `styles.css` - visual system and layout
- `app.js` - scenario engine and dynamic planning logic
- `docs/product-blueprint.md` - PM blueprint with users, pain points, features, logic, flows, and roadmap
- `docs/research-sources.md` - source notes and links used in the blueprint

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## What this prototype demonstrates

- Multi-granularity forecasting logic
- Weather, promotion, event, channel, and supply-driver sensitivity
- Inventory and replenishment recommendations
- Markdown and spoilage prevention logic
- Labor and capacity planning signals
- AI copilot style explanation and exception handling

This is a frontend prototype, not a production backend. The AWS target architecture and product
scope are documented in `docs/product-blueprint.md`.
