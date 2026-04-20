# Polaris IQ for Baskin Robbins India

## 1. Product Vision

Build a planning and decision-intelligence platform for Baskin Robbins India that sits on top of
transactional systems such as SAP and unifies demand forecasting, inventory optimization,
production planning, markdowns, omnichannel fulfillment, and labor optimization.

This should not be a passive BI layer. It should act like an operational decision cockpit:

- predict demand at multiple granularities
- explain what changed and why
- recommend the next best action
- route exceptions to the right stakeholder
- learn from overrides and outcomes

## 2. Business Context

Based on Baskin Robbins India’s public site, the business has:

- more than `800+` parlours across `230+` Indian cities
- online ordering
- a rewards program
- multiple product forms including scoops, family packs, cakes, sundaes, shakes, toppings, and seasonal launches
- franchise-led store operations

This combination creates a hard planning problem:

- high SKU and assortment variability
- strong seasonality and weather sensitivity
- short shelf life for many prepared and frozen items
- urban, mall, tier-2, and delivery-heavy store behavior differences
- omnichannel demand patterns
- franchise decision inconsistency

## 3. Core Product Goals

- Increase sales via better availability and fewer stockouts
- Reduce spoilage and improve freshness
- Lower working capital and safety stock without damaging service levels
- Improve gross margin via smarter markdowns and transfer decisions
- Improve labor productivity through forecast-based staffing
- Improve plant, dispatch, and cold-chain utilization
- Give business leaders one trusted planning layer across stores, channels, and supply nodes

## 4. Primary Users

### Business Manager / Regional Manager

Pain points:

- sees lagging sales dashboards, not forward-looking actions
- spends time reconciling store excuses vs real demand changes
- cannot prioritize which stores need intervention first
- lacks one explanation tying weather, promo, channel shift, and stock decisions together

Needs:

- ranked exceptions
- forecast explanation
- impact-based action recommendations
- region-level what-if simulation

### Franchise Owner / Store Manager

Pain points:

- uncertain daily prep quantities by SKU and hour
- poor visibility into online + walk-in combined demand
- local staff scheduling based on intuition
- no confidence on whether to hold, transfer, or markdown aging stock

Needs:

- store brief for today and tomorrow
- hourly sales and prep forecast
- order recommendation with reason codes
- simple alerts for spoilage, stockout, and fulfillment risk

### Demand Planner

Pain points:

- forecasting in spreadsheets or overly rigid planning tools
- difficulty handling new launches, promotions, and cannibalization
- poor trust in black-box forecasts
- forecast accuracy measured globally but not at decision-relevant levels

Needs:

- SKU-store-channel forecasts
- baseline vs uplift decomposition
- forecast explainability
- backtesting by use case and aggregation level

### Supply / Factory / Dispatch Planner

Pain points:

- weak visibility from store/channel demand to production requirements
- late awareness of bottlenecks in cold storage, packaging, or dairy inputs
- inability to plan freshness-sensitive dispatches accurately

Needs:

- aggregated demand by plant and lane
- freshness-aware production sequencing
- dispatch and transfer planning
- capacity and bottleneck alerts

### Finance / Leadership

Pain points:

- forecast accuracy disconnected from inventory and margin outcomes
- no clear view of what operational decisions drive value

Needs:

- scenario ROI view
- impact tracking on sales, spoilage, service level, inventory turns, and labor cost

## 5. Why Existing ERP Alone Is Not Enough

If Baskin Robbins India is currently using SAP, the right strategy is not to replace SAP first.
Instead:

- keep SAP as system of record for master data, purchasing, inventory postings, and finance
- use Polaris IQ as the intelligence and decision layer
- push approved actions back into SAP or execution systems

Likely SAP gaps for this use case:

- limited day-to-day usability for franchise business users
- insufficient intraday store-level decisioning
- weak native experience for weather/event/promo/channel-rich explainability
- too much dependence on expert planners instead of guided workflows for non-specialists

This is an inference based on typical ERP deployments plus SAP’s documented strengths around
planning and optimization, not a claim about Baskin Robbins India’s exact implementation.

## 6. Planning Logic the Product Must Support

### 6.1 Multi-granularity forecasting

The same forecasting engine must serve multiple horizons:

- hourly: prep, staffing, delivery promise windows
- daily: store replenishment, spoilage prevention, transfers
- weekly: factory production, dispatch, labor bands, vendor planning
- monthly and seasonal: S&OP, capacity, launches, budgets

Critical rule:

Do not build separate disconnected forecasting systems for each horizon. Build one model layer that
forecasts at the most granular usable level and aggregates upward with flexible pooling across:

- product
- store
- region
- channel
- time horizon

### 6.2 Forecast components

Forecast output should explicitly separate:

- baseline demand
- seasonality and weekday pattern
- weather effect
- holiday or local event effect
- promotion uplift
- display / visibility uplift
- price elasticity
- cannibalization and halo effects
- stockout suppression recovery
- online vs offline channel effect
- launch lifecycle effect

### 6.3 Inventory logic

Inventory decisions should not use one blanket rule. They should vary by product type:

- scoops / parlour service items: high intraday sensitivity
- family packs / take-home tubs: more delivery-sensitive and promo-sensitive
- cakes / celebration items: pre-order and event-driven, high spoilage risk
- toppings / cones / dry add-ons: longer shelf life, lower urgency
- vegan / specialty SKUs: lower history, niche elasticity, launch risk

The engine should combine:

- service-level targets by category
- shelf-life constraints
- minimum display requirements
- lead time and lead time variability
- freezer capacity constraints
- transfer feasibility
- order multiples / MOQ
- safety stock rules
- freshness-first markdown policy

### 6.4 Core formulas

Classical formulas still matter and should be embedded as transparent guardrails:

- Safety stock = `(Max daily use x Max lead time) - (Avg daily use x Avg lead time)`
- Reorder point = `(Avg daily use x Avg lead time) + Safety stock`
- EOQ = demand-order-holding cost optimization for stable, non-highly-perishable items

But for ice cream retail, these should be dynamically adjusted by:

- weather forecast
- channel split
- event calendar
- promo intensity
- store cluster behavior
- shelf life remaining

### 6.5 Omnichannel planning

Forecasts must be separate by fulfillment channel:

- walk-in store demand
- aggregator delivery demand
- own-app or own-site demand
- pre-order cake or party demand

Then linked back to the fulfillment node:

- local store
- dark freezer / hub
- distributor / DC

This enables virtual ringfencing so digital demand does not starve store traffic and vice versa.

### 6.6 Exception-based operating model

The platform should not force users to analyze every SKU-store pair manually. It should:

1. score risk and opportunity
2. rank exceptions by commercial impact
3. suggest actions
4. allow approval, rejection, or override with reason
5. learn from outcomes

## 7. Key Pain Points the Product Must Solve

- Forecasts are not trusted because they are unexplained
- Forecasts are too aggregated for perishables
- Teams react after a stockout or spoilage event instead of before it
- Promotions are modeled only for promoted SKUs, not cannibalized ones
- Store managers do not see online demand mapped to their true fulfillment burden
- Regional leaders cannot tell whether poor sales were caused by low demand, stockouts, or poor execution
- New product launches have weak forecasting due to limited history
- Labor planning is disconnected from transaction forecasts
- Capacity constraints surface too late
- Different stakeholders live in different systems and spreadsheets

## 8. Product Modules

### 8.1 Demand Control Tower

- live demand forecast by SKU-store-channel
- forecast decomposition and explainability
- confidence bands and anomaly detection
- backtest and model comparison
- override workflow with learning loop

### 8.2 Inventory Intelligence

- dynamic reorder point recommendations
- safety stock recommendations by freshness class
- expiry-aware stock allocation
- inter-store transfer recommendations
- stockout risk and spoilage risk scoring
- ABC and velocity segmentation

### 8.3 Production and Cold-Chain Planning

- plant-level demand rollup
- freshness-aware production plan
- packaging and dairy material requirement view
- dispatch prioritization
- lane and freezer utilization alerts
- bottleneck simulation

### 8.4 Promotion and Markdown Optimizer

- pre-promo demand simulation
- uplift, cannibalization, and halo modeling
- price elasticity modeling
- post-promo washout estimation
- expiry-led markdown recommendations
- margin-aware markdown laddering

### 8.5 Omnichannel Fulfillment Planner

- channel-separated demand
- virtual ringfencing
- promised service level monitoring
- delivery surge alerts
- pre-order inventory reservation

### 8.6 Workforce Optimizer

- hourly demand to staffing conversion
- prep load forecasting
- picker load for digital orders
- shift templates and staffing recommendations
- compliance with local labor rules and franchise constraints

### 8.7 AI Analytics and Copilot

- natural language Q&A
- root-cause summaries
- scenario simulation assistant
- “what changed since last plan?” explanations
- action recommendation with rationale and confidence
- meeting-note style summaries for leadership

## 9. Decision Logic Examples

### Example A: Heatwave in Mumbai West

Inputs:

- high temperature
- weekend
- strong aggregator demand
- active promo on family packs

System actions:

- lift hourly walk-in and delivery forecasts
- ringfence top-selling SKUs for digital promises
- recommend extra staff in evening peak
- trigger replenishment from nearby low-risk stores
- increase plant dispatch priority for fast movers

### Example B: Rainy weekday in Tier-2 city

Inputs:

- rain suppression for walk-in
- moderate own-app demand
- aging cake inventory

System actions:

- reduce scoop prep
- shift fulfillment focus to take-home products
- mark selected cakes for limited markdown
- lower next replenishment order
- protect margin by avoiding broad markdowns

### Example C: New vegan launch

Inputs:

- limited history
- influencer campaign
- selected store rollout

System actions:

- use analogous product references
- estimate launch curve with store cluster modifiers
- cap early replenishment to avoid write-offs
- learn quickly from first-week sell-through

## 10. User Flows

### Regional Manager Flow

1. Open morning exception inbox
2. See top 10 risks ranked by lost sales or spoilage value
3. Click an exception to view forecast driver decomposition
4. Review system-recommended actions and estimated business impact
5. Approve, modify, or assign actions
6. Track execution and end-of-day result

### Franchise Store Flow

1. Open today’s store brief
2. See hourly demand, prep plan, top SKUs, and staffing guidance
3. Review low-stock and aging-stock alerts
4. Accept replenishment or markdown recommendations
5. End day with actuals, wastage, and reason code capture

### Demand Planner Flow

1. Review model performance by category, region, and use case
2. Investigate anomalies, new launches, promo effects, and cannibalization
3. Run what-if scenarios
4. Lock forecast and publish plan
5. Monitor overrides and model drift

### Supply Planner Flow

1. Review approved demand rollup
2. Convert to production and dispatch plan
3. Check bottlenecks across raw materials, packaging, cold-chain, and lanes
4. Simulate alternatives
5. Publish final supply plan

## 11. Metrics and KPI Framework

Track metrics at the level where decisions happen, not only in aggregate.

Forecast metrics:

- WAPE / MAPE by SKU-store-day
- bias by region and channel
- promo forecast error
- launch forecast error
- hourly accuracy for high-velocity stores

Business metrics:

- on-shelf availability / service level
- stockout event count
- spoilage and markdown loss
- inventory turns
- days of supply
- GMROI
- forecast override rate
- labor cost per order / transaction
- fulfillment SLA by channel

## 12. Recommended Product Principles

- Explain before you ask users to trust
- Rank actions by money, not by count of alerts
- Use one operating model across all stakeholders, with role-specific views
- Separate demand sensing from decision execution
- Treat freshness as a first-class constraint
- Make every override teach the model
- Keep the UI action-oriented, not report-oriented

## 13. Suggested MVP

### MVP scope

- daily and weekly forecasts at SKU-store-channel level
- weather, promo, holiday, and event drivers
- demand decomposition and explainability
- inventory recommendation engine
- transfer suggestions
- spoilage and stockout exception queue
- simple labor forecast by daypart
- AI copilot for summary and root cause
- SAP integration for master data and approved action sync

### Phase 2

- hourly forecasting for priority stores
- markdown optimization
- price elasticity and cannibalization optimization
- production scheduling integration
- franchise benchmarking and incentives layer
- finance scenario planning

### Phase 3

- reinforcement-learning style action optimization
- closed-loop autonomous planning for low-risk categories
- computer vision or IoT freezer telemetry
- competitor pricing and digital share-of-search signals

## 14. AWS Hosting and Technical Architecture

### Recommended architecture

- Frontend: React or Next.js on AWS Amplify or S3 + CloudFront
- APIs: API Gateway + Lambda or containerized services on ECS / EKS
- Core app services: forecasting, replenishment, pricing, labor, copilot, workflow
- Data lake: S3
- Data processing: Glue / EMR / dbt / Athena depending on team preference
- Warehouse / marts: Redshift
- Real-time events: EventBridge / Kinesis
- ML platform: SageMaker for custom models, feature store, retraining, explainability
- Planning accelerators: evaluate AWS Supply Chain where useful, but keep custom logic for franchise/perishable specificity
- Search / copilot retrieval: OpenSearch or Aurora pgvector
- Identity: Cognito or enterprise SSO
- Observability: CloudWatch + OpenTelemetry-compatible monitoring

### System integration

- SAP for product master, vendors, POs, inventory movements, finance
- POS and online ordering systems for transactions
- Swiggy / Zomato / own-app order feeds
- Weather API
- Local events calendar
- Rewards / CRM
- Marketing campaign calendar

### Architecture principle

Do not over-customize around one vendor module. Build a modular decision engine so forecasting,
inventory, promo, and labor logic can evolve independently.

## 15. Data Model Requirements

Minimum entities:

- SKU
- product family
- store / parlour
- city cluster
- channel
- time bucket
- transaction
- inventory snapshot
- inbound order / transfer
- lead time
- shelf life remaining
- price / promo / display
- weather
- event
- labor schedule

Important derived features:

- rolling sales velocity
- stockout flags
- weather sensitivity score
- promo response curve
- price elasticity
- cross-SKU cannibalization graph
- launch analog mapping
- store cluster archetype
- channel substitution score

## 16. UX Requirements

- opening screen must be an exception queue, not a chart wall
- every recommendation must include reason, expected impact, confidence, and action owner
- every number should be drillable from network to region to store to SKU
- users should move from signal to action in under three clicks
- business users should be able to simulate scenarios without analyst support

## 17. Differentiators

- purpose-built for perishable, franchise-led, weather-sensitive retail
- integrates forecasting, inventory, markdowns, labor, and fulfillment in one decision layer
- supports channel-aware and freshness-aware planning
- designed for non-technical business users, not just planners
- creates a closed learning loop from user overrides and execution outcomes

## 18. Key Risks

- poor data quality from POS, inventory counts, and franchise compliance
- fragmented execution systems
- user distrust if explainability is weak
- over-automation before process discipline exists
- trying to solve hourly forecasting everywhere before the base data is stable

## 19. Recommended Implementation Sequence

1. Data foundation and integration
2. Forecasting and explainability
3. Inventory and exception workflow
4. Omnichannel and transfer planning
5. Labor and markdown optimization
6. Advanced pricing, capacity, and autonomous decisioning

## 20. Bottom Line

The winning product for Baskin Robbins India is not “better reporting.” It is a dynamic planning
system that continuously senses demand, predicts outcomes at the right granularity, recommends
the next best action, and coordinates execution across franchise stores, planners, supply teams,
and leadership.
