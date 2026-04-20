const stores = {
  mumbai: [
    { id: "mumbai-bandra", name: "Bandra Linking Road", baseDemand: 480, cluster: "High footfall parlour", deliveryBias: 1.1, familyPackBias: 0.92 },
    { id: "mumbai-andheri", name: "Andheri Mall", baseDemand: 560, cluster: "Mall + cinema", deliveryBias: 1.18, familyPackBias: 0.88 },
    { id: "mumbai-powai", name: "Powai Hiranandani", baseDemand: 430, cluster: "Premium family", deliveryBias: 1.02, familyPackBias: 1.1 }
  ],
  bengaluru: [
    { id: "blr-indiranagar", name: "Indiranagar 100 Feet", baseDemand: 510, cluster: "Delivery dense", deliveryBias: 1.22, familyPackBias: 1.04 },
    { id: "blr-whitefield", name: "Whitefield Tech Park", baseDemand: 470, cluster: "Office + evening", deliveryBias: 1.16, familyPackBias: 0.95 },
    { id: "blr-jayanagar", name: "Jayanagar Family Hub", baseDemand: 390, cluster: "Family neighborhood", deliveryBias: 0.96, familyPackBias: 1.14 }
  ],
  delhi: [
    { id: "delhi-gk", name: "Greater Kailash", baseDemand: 445, cluster: "Premium urban", deliveryBias: 1.08, familyPackBias: 1.02 },
    { id: "delhi-noida", name: "Noida Sector 18", baseDemand: 535, cluster: "Mall + delivery", deliveryBias: 1.17, familyPackBias: 0.9 },
    { id: "delhi-gurgaon", name: "Gurgaon Galleria", baseDemand: 500, cluster: "High throughput", deliveryBias: 1.13, familyPackBias: 0.94 }
  ]
};

const skuCatalog = [
  { name: "Vanilla Single Scoop", type: "Impulse scoop", baseShare: 0.043, perishability: "medium", weatherWeight: 0.9, promoWeight: 0.5, deliveryWeight: 0.25, eventWeight: 0.3 },
  { name: "Chocolate Single Scoop", type: "Impulse scoop", baseShare: 0.042, perishability: "medium", weatherWeight: 0.88, promoWeight: 0.5, deliveryWeight: 0.24, eventWeight: 0.28 },
  { name: "Strawberry Single Scoop", type: "Impulse scoop", baseShare: 0.03, perishability: "medium", weatherWeight: 0.84, promoWeight: 0.46, deliveryWeight: 0.22, eventWeight: 0.24 },
  { name: "Mango Single Scoop", type: "Seasonal scoop", baseShare: 0.031, perishability: "medium", weatherWeight: 0.96, promoWeight: 0.38, deliveryWeight: 0.2, eventWeight: 0.32 },
  { name: "Butterscotch Single Scoop", type: "Impulse scoop", baseShare: 0.034, perishability: "medium", weatherWeight: 0.86, promoWeight: 0.44, deliveryWeight: 0.22, eventWeight: 0.26 },
  { name: "Black Currant Single Scoop", type: "Impulse scoop", baseShare: 0.023, perishability: "medium", weatherWeight: 0.82, promoWeight: 0.41, deliveryWeight: 0.2, eventWeight: 0.21 },
  { name: "Cotton Candy Single Scoop", type: "Kids scoop", baseShare: 0.02, perishability: "medium", weatherWeight: 0.84, promoWeight: 0.58, deliveryWeight: 0.18, eventWeight: 0.33 },
  { name: "Mint Choco Chip Scoop", type: "Impulse scoop", baseShare: 0.018, perishability: "medium", weatherWeight: 0.8, promoWeight: 0.36, deliveryWeight: 0.19, eventWeight: 0.2 },
  { name: "Cookies n Cream Scoop", type: "Impulse scoop", baseShare: 0.027, perishability: "medium", weatherWeight: 0.79, promoWeight: 0.42, deliveryWeight: 0.2, eventWeight: 0.22 },
  { name: "Belgian Bliss Scoop", type: "Premium scoop", baseShare: 0.015, perishability: "medium", weatherWeight: 0.74, promoWeight: 0.29, deliveryWeight: 0.18, eventWeight: 0.26 },
  { name: "Vanilla Double Scoop", type: "Walk-in combo", baseShare: 0.021, perishability: "medium", weatherWeight: 0.92, promoWeight: 0.45, deliveryWeight: 0.18, eventWeight: 0.28 },
  { name: "Chocolate Double Scoop", type: "Walk-in combo", baseShare: 0.02, perishability: "medium", weatherWeight: 0.9, promoWeight: 0.45, deliveryWeight: 0.17, eventWeight: 0.26 },
  { name: "Hot Fudge Sundae", type: "Sundae", baseShare: 0.029, perishability: "high", weatherWeight: 0.7, promoWeight: 0.5, deliveryWeight: 0.14, eventWeight: 0.34 },
  { name: "Brownie Sundae", type: "Sundae", baseShare: 0.025, perishability: "high", weatherWeight: 0.72, promoWeight: 0.48, deliveryWeight: 0.15, eventWeight: 0.32 },
  { name: "Classic Banana Split", type: "Sundae", baseShare: 0.018, perishability: "high", weatherWeight: 0.76, promoWeight: 0.39, deliveryWeight: 0.1, eventWeight: 0.29 },
  { name: "Oreo Thick Shake", type: "Shake", baseShare: 0.028, perishability: "high", weatherWeight: 1.04, promoWeight: 0.43, deliveryWeight: 0.22, eventWeight: 0.22 },
  { name: "Cold Coffee Shake", type: "Shake", baseShare: 0.024, perishability: "high", weatherWeight: 1, promoWeight: 0.39, deliveryWeight: 0.21, eventWeight: 0.18 },
  { name: "Mango Shake", type: "Shake", baseShare: 0.018, perishability: "high", weatherWeight: 1.08, promoWeight: 0.34, deliveryWeight: 0.19, eventWeight: 0.2 },
  { name: "Vanilla 700ml Family Pack", type: "Family pack", baseShare: 0.03, perishability: "low", weatherWeight: 0.56, promoWeight: 0.92, deliveryWeight: 0.78, eventWeight: 0.41 },
  { name: "Chocolate 700ml Family Pack", type: "Family pack", baseShare: 0.031, perishability: "low", weatherWeight: 0.57, promoWeight: 0.9, deliveryWeight: 0.77, eventWeight: 0.42 },
  { name: "Butterscotch 700ml Family Pack", type: "Family pack", baseShare: 0.025, perishability: "low", weatherWeight: 0.54, promoWeight: 0.88, deliveryWeight: 0.74, eventWeight: 0.39 },
  { name: "Mango 700ml Family Pack", type: "Family pack", baseShare: 0.021, perishability: "low", weatherWeight: 0.64, promoWeight: 0.82, deliveryWeight: 0.72, eventWeight: 0.38 },
  { name: "Black Currant 700ml Family Pack", type: "Family pack", baseShare: 0.016, perishability: "low", weatherWeight: 0.51, promoWeight: 0.77, deliveryWeight: 0.68, eventWeight: 0.34 },
  { name: "Chocolate Mini Tub", type: "Take-home tub", baseShare: 0.022, perishability: "medium", weatherWeight: 0.6, promoWeight: 0.72, deliveryWeight: 0.66, eventWeight: 0.31 },
  { name: "Strawberry Mini Tub", type: "Take-home tub", baseShare: 0.018, perishability: "medium", weatherWeight: 0.58, promoWeight: 0.7, deliveryWeight: 0.64, eventWeight: 0.28 },
  { name: "Celebration Cake Small", type: "Ice cream cake", baseShare: 0.012, perishability: "high", weatherWeight: 0.28, promoWeight: 0.55, deliveryWeight: 0.46, eventWeight: 1.05 },
  { name: "Celebration Cake Large", type: "Ice cream cake", baseShare: 0.009, perishability: "high", weatherWeight: 0.22, promoWeight: 0.61, deliveryWeight: 0.48, eventWeight: 1.12 },
  { name: "Chocolate Truffle Cake", type: "Ice cream cake", baseShare: 0.011, perishability: "high", weatherWeight: 0.24, promoWeight: 0.64, deliveryWeight: 0.5, eventWeight: 1.08 },
  { name: "Waffle Cone", type: "Add-on", baseShare: 0.022, perishability: "low", weatherWeight: 0.72, promoWeight: 0.26, deliveryWeight: 0.08, eventWeight: 0.16 },
  { name: "Chocolate Brownie Topping", type: "Add-on", baseShare: 0.013, perishability: "low", weatherWeight: 0.34, promoWeight: 0.21, deliveryWeight: 0.11, eventWeight: 0.14 },
  { name: "Rainbow Sprinkles Topping", type: "Add-on", baseShare: 0.011, perishability: "low", weatherWeight: 0.31, promoWeight: 0.19, deliveryWeight: 0.09, eventWeight: 0.12 }
];

const aiQuestions = [
  "Which SKU will stock out first if the evening heat spike continues?",
  "How much of today’s uplift is weather versus promotion?",
  "Should we transfer cakes or mark them down in slower stores?",
  "Which stores need more labor in the 6 PM to 9 PM window?",
  "What is the expected delivery cannibalization on walk-in sundaes?",
  "How should production change if milk base is delayed tomorrow?"
];

const el = (id) => document.getElementById(id);

function formatNumber(value) {
  return Math.round(value).toLocaleString();
}

function updateRangeText() {
  el("temperatureValue").textContent = `${el("temperature").value}°C`;
  el("rainfallValue").textContent = `${el("rainfall").value} / 100`;
  el("promoValue").textContent = `${el("promoIntensity").value} / 100`;
  el("deliveryValue").textContent = `${el("deliveryShare").value}%`;
}

function populateStores() {
  const cluster = el("cityCluster").value;
  const select = el("storeSelect");
  const current = select.value;
  select.innerHTML = stores[cluster]
    .map((store) => `<option value="${store.id}">${store.name}</option>`)
    .join("");

  if ([...select.options].some((option) => option.value === current)) {
    select.value = current;
  }
}

function getScenario() {
  const cluster = el("cityCluster").value;
  const store = stores[cluster].find((item) => item.id === el("storeSelect").value) || stores[cluster][0];
  const temperature = Number(el("temperature").value);
  const rain = Number(el("rainfall").value);
  const promo = Number(el("promoIntensity").value);
  const delivery = Number(el("deliveryShare").value);
  const event = el("eventType").value;
  const supply = el("supplyStatus").value;
  const horizon = el("forecastHorizon").value;

  const heatLift = 1 + Math.max(0, temperature - 30) * 0.028;
  const rainEffect = 1 - rain * 0.0018;
  const promoLift = 1 + promo * 0.0042;
  const deliveryLift = 1 + Math.max(0, delivery - 20) * 0.005 * store.deliveryBias;
  const eventLift = { none: 1, weekend: 1.12, festival: 1.18, mall: 1.09 }[event];
  const horizonMultiplier = { hourly: 0.11, daily: 1, weekly: 6.6 }[horizon];
  const supplyPenalty = { normal: 0, milk: 0.08, freezer: 0.11, packaging: 0.05 }[supply];

  const totalDemand =
    store.baseDemand * heatLift * rainEffect * promoLift * deliveryLift * eventLift * horizonMultiplier;
  const accuracy = Math.max(68, Math.min(95, 88 + promo * 0.03 - rain * 0.07 - supplyPenalty * 100 * 0.45));
  const service = Math.max(83, Math.min(99, 96 - supplyPenalty * 36 - rain * 0.03 + promo * 0.01));
  const spoilage = Math.max(2.1, 5.2 + promo * 0.03 - delivery * 0.015 - temperature * 0.025 + (event === "none" ? 0.8 : -0.2));
  const weatherImpact = store.baseDemand * (heatLift * rainEffect - 1);
  const promoImpact = store.baseDemand * (promoLift - 1);
  const channelImpact = store.baseDemand * (deliveryLift - 1);

  return {
    cluster,
    store,
    temperature,
    rain,
    promo,
    delivery,
    event,
    supply,
    horizon,
    totalDemand,
    accuracy,
    service,
    spoilage,
    weatherImpact,
    promoImpact,
    channelImpact,
    supplyPenalty,
    modelName: "Gradient Boosted Ensemble",
    featureCount: 17
  };
}

function buildSkuRows(scenario) {
  const normalizedShare = skuCatalog.reduce((sum, sku) => sum + sku.baseShare, 0);
  const eventFactor = { none: 0.08, weekend: 0.18, festival: 0.28, mall: 0.14 }[scenario.event];
  const promoRate = scenario.promo / 100;
  const weatherRate = Math.max(0, scenario.temperature - 30) / 15 - scenario.rain / 180;
  const deliveryRate = Math.max(0, scenario.delivery - 20) / 50;

  const rows = skuCatalog.map((sku, index) => {
    const share = sku.baseShare / normalizedShare;
    const familyBoost = sku.type === "Family pack" || sku.type === "Take-home tub" ? scenario.store.familyPackBias : 1;
    const walkInPenalty = sku.type === "Sundae" || sku.type === "Impulse scoop" ? scenario.delivery * 0.0012 : 0;
    const weatherContribution = weatherRate * sku.weatherWeight;
    const promoContribution = promoRate * sku.promoWeight;
    const deliveryContribution = deliveryRate * sku.deliveryWeight * scenario.store.deliveryBias;
    const eventContribution = eventFactor * sku.eventWeight;
    const supplyContribution = -scenario.supplyPenalty * (sku.perishability === "high" ? 0.8 : 0.55);
    const mlMultiplier =
      1 +
      weatherContribution +
      promoContribution +
      deliveryContribution +
      eventContribution +
      supplyContribution -
      walkInPenalty;
    const baselineUnits = scenario.totalDemand * share;
    const units = Math.max(6, baselineUnits * familyBoost * mlMultiplier);
    const stock = Math.max(8, units * (0.92 + ((index % 5) - 2) * 0.11) * (1 - scenario.supplyPenalty * 0.46));
    const cover = stock / Math.max(units, 1);
    let risk = "Low";
    let action = "Hold";

    if (cover < 0.9) {
      risk = "High";
      action = sku.perishability === "high" ? "Rush replenish" : "Auto reorder";
    } else if (cover < 1.2) {
      risk = "Medium";
      action = sku.type === "Ice cream cake" ? "Transfer in" : "Monitor";
    } else if (cover > 1.8 && sku.perishability === "high") {
      risk = "Medium";
      action = "Target markdown";
    }

    const contributions = [
      { name: "Weather", value: weatherContribution },
      { name: "Promotion", value: promoContribution },
      { name: "Delivery", value: deliveryContribution },
      { name: "Event", value: eventContribution },
      { name: "Supply", value: supplyContribution }
    ];
    contributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    const topDriver = contributions[0].name;
    const confidence = Math.max(
      61,
      Math.min(
        96,
        92 -
          scenario.rain * 0.08 -
          scenario.supplyPenalty * 100 * 0.5 -
          (sku.perishability === "high" ? 4 : 0) +
          promoRate * 6 +
          (sku.type === "Family pack" ? 2 : 0)
      )
    );

    return {
      sku: sku.name,
      type: sku.type,
      units,
      stock,
      cover,
      confidence,
      topDriver,
      risk,
      action
    };
  });

  return rows.sort((a, b) => b.units - a.units);
}

function renderHeader(scenario) {
  el("toplineStore").textContent = `${scenario.store.name} Forecast Workspace`;
  el("headlineDemand").textContent = `${formatNumber(scenario.totalDemand)} units`;
  el("headlineAccuracy").textContent = `${Math.round(scenario.accuracy)}%`;
  el("headlineService").textContent = `${Math.round(scenario.service)}%`;
  el("headlineSpoilage").textContent = `${scenario.spoilage.toFixed(1)}%`;

  el("baseDemand").textContent = `${formatNumber(scenario.store.baseDemand)} units`;
  el("weatherImpact").textContent = `${scenario.weatherImpact >= 0 ? "+" : ""}${formatNumber(scenario.weatherImpact)}`;
  el("promoImpact").textContent = `${scenario.promoImpact >= 0 ? "+" : ""}${formatNumber(scenario.promoImpact)}`;
  el("channelImpact").textContent = `${scenario.channelImpact >= 0 ? "+" : ""}${formatNumber(scenario.channelImpact)}`;

  el("forecastNarrative").innerHTML =
    `This ${scenario.horizon} forecast for <strong>${scenario.store.name}</strong> is being shaped primarily by ` +
    `${scenario.temperature}°C weather, promo intensity of ${scenario.promo}, and a delivery mix of ${scenario.delivery}%. ` +
    `The ML engine scores all 31 SKUs separately using base velocity, weather sensitivity, promo response, channel preference, event uplift, and supply constraints.`;
  el("modelName").textContent = scenario.modelName;
  el("featureCount").textContent = `${scenario.featureCount} features`;
}

function renderExceptions(scenario, rows) {
  const exceptions = [];
  rows.forEach((row) => {
    if (row.risk === "High") {
      exceptions.push({
        title: `${row.sku} at risk of stockout`,
        detail: `${row.sku} has only ${row.cover.toFixed(1)} days of cover against forecast demand.`,
        level: "High",
        owner: "Store + planner",
        action: row.action
      });
    }
    if (row.action === "Target markdown") {
      exceptions.push({
        title: `${row.sku} freshness risk`,
        detail: `Inventory is heavy relative to forecast. Markdown or transfer before spoilage rises.`,
        level: "Medium",
        owner: "Store manager",
        action: row.action
      });
    }
  });

  if (scenario.supply !== "normal") {
    exceptions.push({
      title: `${scenario.supply} constraint affecting tomorrow's plan`,
      detail: "Adjust replenishment and prioritize top sellers while protecting service levels.",
      level: "High",
      owner: "Supply planner",
      action: "Constrain plan"
    });
  }

  el("exceptionCount").textContent = `${exceptions.length} critical items`;
  el("exceptionQueue").innerHTML = exceptions
    .map(
      (item) => `
        <article class="exception-item">
          <div class="exception-top">
            <strong>${item.title}</strong>
            <span class="risk-pill ${item.level === "High" ? "risk-high" : "risk-medium"}">${item.level}</span>
          </div>
          <p>${item.detail}</p>
          <div class="risk-pill-row">
            <span class="hint">Owner: ${item.owner}</span>
            <span class="action-tag">${item.action}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function renderSkuTable(rows) {
  const avgConfidence = rows.reduce((sum, row) => sum + row.confidence, 0) / rows.length;
  el("avgSkuConfidence").textContent = `${Math.round(avgConfidence)}%`;
  el("skuTable").innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td><strong>${row.sku}</strong></td>
          <td>${row.type}</td>
          <td>${formatNumber(row.units)}</td>
          <td>${formatNumber(row.stock)}</td>
          <td>${row.cover.toFixed(1)} days</td>
          <td>${Math.round(row.confidence)}%</td>
          <td>${row.topDriver}</td>
          <td><span class="risk-pill ${row.risk === "High" ? "risk-high" : row.risk === "Medium" ? "risk-medium" : "risk-low"}">${row.risk}</span></td>
          <td><span class="action-tag">${row.action}</span></td>
        </tr>
      `
    )
    .join("");
}

function renderHourly(scenario) {
  const basePattern = [
    ["12 PM", 0.08],
    ["1 PM", 0.12],
    ["2 PM", 0.11],
    ["3 PM", 0.1],
    ["4 PM", 0.12],
    ["5 PM", 0.14],
    ["6 PM", 0.15],
    ["7 PM", 0.1],
    ["8 PM", 0.08]
  ];
  const maxUnits = scenario.totalDemand * 0.16;
  el("hourlyBars").innerHTML = basePattern
    .map(([hour, share]) => {
      const eventBoost = hour === "6 PM" || hour === "7 PM" ? (scenario.event !== "none" ? 1.18 : 1.06) : 1;
      const units = scenario.totalDemand * share * eventBoost * (scenario.horizon === "hourly" ? 1.9 : 0.9);
      const width = Math.min(100, (units / maxUnits) * 100);
      return `
        <div class="hour-row">
          <span>${hour}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
          <strong>${Math.round(units)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderDecisions(scenario, rows) {
  const topRisk = rows.find((row) => row.risk === "High");
  const cakeRow = rows.find((row) => row.type === "Ice cream cake");
  const familyPacks = rows.find((row) => row.type === "Family pack");
  const topSku = rows[0];

  const decisions = [
    `Replenish ${topRisk ? topRisk.sku : "top-moving SKUs"} immediately for ${scenario.store.name} to protect evening service.`,
    `Set delivery ringfence at ${Math.round(scenario.delivery * 0.45)}% of family-pack and take-home inventory.`,
    `Raise production requirement for tomorrow by ${Math.round((scenario.totalDemand / scenario.store.baseDemand - 1) * 100)}% versus baseline for this store cluster.`,
    `${cakeRow && cakeRow.action === "Target markdown" ? "Apply controlled cake markdowns in the last 6 selling hours." : "Keep cake inventory protected for pre-orders and celebration demand."}`,
    `${scenario.supply === "normal" ? "Use standard reorder policy with dynamic safety stock." : `Trigger constrained planning due to ${scenario.supply} issue and prioritize core sellers.`}`,
    `${familyPacks ? `Labor plan should add ${Math.max(4, Math.round(scenario.delivery / 7))} extra picking/prep hours because delivery-heavy SKUs are rising.` : "Keep labor on standard template."}`,
    `Watch ${topSku.sku} closely because it is currently the highest-velocity SKU in the ML forecast.`
  ];

  el("decisionList").innerHTML = decisions.map((item) => `<li>${item}</li>`).join("");
}

function renderCopilot(scenario, rows) {
  const highRisks = rows.filter((row) => row.risk === "High").length;
  const markdowns = rows.filter((row) => row.action === "Target markdown").length;
  const topThree = rows
    .slice(0, 3)
    .map((row) => row.sku)
    .join(", ");
  el("copilotSummary").innerHTML =
    `<strong>Manager summary:</strong><br />` +
    `${scenario.store.name} is forecasting <strong>${formatNumber(scenario.totalDemand)} units</strong> for the selected horizon with ` +
    `<strong>${Math.round(scenario.accuracy)}%</strong> confidence. Heat and promotions are pushing demand above baseline, while delivery now accounts for ` +
    `<strong>${scenario.delivery}%</strong> of expected demand. There are <strong>${highRisks}</strong> SKU-level stockout risks and ` +
    `<strong>${markdowns}</strong> markdown-driven freshness risks. The current top ML forecast SKUs are <strong>${topThree}</strong>. ` +
    `The best next move is to approve replenishment for fast movers, ringfence digital inventory, and adjust labor around the evening peak rather than raising blanket safety stock.`;
}

function renderAiQuestions() {
  el("aiQuestions").innerHTML = aiQuestions.map((item) => `<li>${item}</li>`).join("");
}

function render() {
  updateRangeText();
  const scenario = getScenario();
  const rows = buildSkuRows(scenario);
  renderHeader(scenario);
  renderExceptions(scenario, rows);
  renderSkuTable(rows);
  renderHourly(scenario);
  renderDecisions(scenario, rows);
  renderCopilot(scenario, rows);
}

function wireInputs() {
  [
    "cityCluster",
    "storeSelect",
    "forecastHorizon",
    "temperature",
    "rainfall",
    "promoIntensity",
    "deliveryShare",
    "eventType",
    "supplyStatus"
  ].forEach((id) => {
    el(id).addEventListener("input", () => {
      if (id === "cityCluster") {
        populateStores();
      }
      render();
    });
    el(id).addEventListener("change", () => {
      if (id === "cityCluster") {
        populateStores();
      }
      render();
    });
  });
}

populateStores();
renderAiQuestions();
wireInputs();
render();
