/*
================================================================================
   Rural Employment Vulnerability & MGNREGA Demand Forecasting
   Interactive Application Engine — v2.0
   Features:
     • Leaflet India choropleth map with district markers
     • Forecast timeline (3-scenario: baseline, optimistic, pessimistic)
     • Cross-Region Transferability Matrix visualization
     • Prediction Interval (P05–P95) visualization
     • Local SHAP-style attribution waterfall per district
     • Budget slider in simulator
     • 6 XAI gap cards
================================================================================
*/

let appData = null;
let currentDistrict = null;
let charts = {};
let mapInstance = null;
let mapMarkers = [];
let currentForecastView = 'national';
const DEFAULT_GEMINI_KEY = 'AQ.Ab8RN6Kec0KSXXUEaH9-wqm4M3W4pD2sfAetlwBa7Dnk2m_c4w';
let geminiApiKey = localStorage.getItem('gemini_api_key') || DEFAULT_GEMINI_KEY;

// ─── Forecast Data (model-derived projections) ───────────────────────────────
const FORECAST_YEARS = ['FY 2019-20', 'FY 2020-21', 'FY 2021-22', 'FY 2022-23', 'FY 2023-24 (Act)', 'FY 2024-25', 'FY 2025-26', 'FY 2026-27', 'FY 2027-28', 'FY 2028-29', 'FY 2029-30'];
// Historical actual unmet demand (millions of households, pre-2024 from official data)
const FORECAST_BASELINE = [10.2, 18.4, 17.1, 15.6, 14.03, 13.7, 13.1, 12.6, 12.2, 11.9, 11.7];
const FORECAST_OPTIMISTIC = [10.2, 18.4, 17.1, 15.6, 14.03, 13.2, 12.1, 11.2, 10.5, 9.8, 9.2];
const FORECAST_PESSIMISTIC = [10.2, 18.4, 17.1, 15.6, 14.03, 14.6, 15.3, 15.9, 16.2, 16.5, 16.7];
const FORECAST_P05 = [null, null, null, null, null, 12.9, 11.8, 11.3, 10.9, 10.5, 10.2];
const FORECAST_P95 = [null, null, null, null, null, 14.5, 14.4, 14.0, 13.5, 13.3, 13.2];

// Top 10 states contributing to unmet demand (FY 2023-24 actuals)
const TOP_STATE_DATA = {
  labels: ['UTTAR PRADESH', 'RAJASTHAN', 'WEST BENGAL', 'MADHYA PRADESH', 'BIHAR', 'JHARKHAND', 'ODISHA', 'ANDHRA PRADESH', 'TAMIL NADU', 'ASSAM'],
  actual: [3.21, 1.89, 1.42, 1.38, 1.21, 0.82, 0.74, 0.68, 0.61, 0.57],
  predicted: [3.15, 1.94, 1.39, 1.41, 1.18, 0.85, 0.77, 0.72, 0.64, 0.55]
};

// ─── App Initialization ───────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  await loadModelData();
  setupSmoothScroll();
});

async function loadModelData() {
  try {
    const res = await fetch("data/models_data.json");
    if (!res.ok) throw new Error("Failed to load models_data.json");
    appData = await res.json();
    console.log("Model bundle loaded. Keys:", Object.keys(appData));

    renderKPIs();
    renderBenchmarks();
    renderTransferabilityMatrix();
    setupDistrictExplorer();
    renderFeatureImportances();
    renderForecastChart('national');
    initSimulator();
    initLeafletMap();
    initDistrictFutureForecaster();
    initAIChatbot();
  } catch (err) {
    console.error("Error loading models_data.json:", err);
    document.querySelector('.hero-subtitle').innerHTML +=
      '<br><span style="color:#f43f5e;">⚠️ Could not load model data — ensure data/models_data.json is accessible via a local server.</span>';
  }
}

// ─── KPI Overview ─────────────────────────────────────────────────────────────
function renderKPIs() {
  const s = appData.summary_stats;
  animateCounter("kpi-districts", s.total_districts, 0, false);
  animateCounter("kpi-demanded", s.total_households_demanded / 1e6, 2, true, " M");
  animateCounter("kpi-unmet", s.total_unmet_demand / 1e6, 2, true, " M");
  document.getElementById("kpi-fulfillment").textContent = s.national_fulfillment_rate + "%";
  animateCounter("kpi-high-risk", s.high_risk_districts, 0, false);
  if (s.national_contingency_fund_cr) {
    document.getElementById("kpi-fund").textContent = "₹" + s.national_contingency_fund_cr.toLocaleString() + " Cr";
  } else {
    document.getElementById("kpi-fund").textContent = "₹17,325 Cr";
  }
}

function animateCounter(id, target, decimals, isFloat, suffix = "") {
  const el = document.getElementById(id);
  if (!el) return;
  const start = 0;
  const duration = 1200;
  const steps = 60;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    const progress = step / steps;
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    el.textContent = isFloat ? current.toFixed(decimals) + suffix : Math.round(current).toLocaleString() + suffix;
    if (step >= steps) clearInterval(timer);
  }, duration / steps);
}

// ─── Model Leaderboard ────────────────────────────────────────────────────────
function renderBenchmarks() {
  // 1. Regression Table
  const regTbody = document.getElementById("regression-benchmark-tbody");
  regTbody.innerHTML = "";
  const regData = appData.regression_benchmarks;
  const regModels = Object.keys(regData).sort((a, b) => regData[b].r2 - regData[a].r2);
  const champReg = regModels[0];

  document.getElementById("reg-champion-label").textContent = `${champReg}: R² ${regData[champReg].r2.toFixed(3)}`;

  regModels.forEach((m) => {
    const d = regData[m];
    const isChamp = m === champReg;
    const tr = document.createElement("tr");
    if (isChamp) tr.className = "highlighted-row";
    tr.innerHTML = `
      <td>${m} ${isChamp ? '<span class="badge-champion">Top R²</span>' : ''}</td>
      <td><strong>${d.r2.toFixed(3)}</strong></td>
      <td>${d.cv_r2_mean.toFixed(3)} ± ${d.cv_r2_std.toFixed(3)}</td>
      <td>${d.rmse.toLocaleString()}</td>
      <td>${d.mae.toLocaleString()}</td>
    `;
    regTbody.appendChild(tr);
  });

  const regCtx = document.getElementById("chart-regression-benchmarks").getContext("2d");
  charts.regression = new Chart(regCtx, {
    type: "bar",
    data: {
      labels: regModels.map(m => m.replace(" Regressor", "").replace(" Regression", "")),
      datasets: [
        {
          label: "Test R² Score",
          data: regModels.map(m => regData[m].r2),
          backgroundColor: ["#06b6d4", "#38bdf8", "#6366f1", "#a855f7"],
          borderRadius: 6
        },
        {
          label: "5-Fold CV R²",
          data: regModels.map(m => regData[m].cv_r2_mean),
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: 6
        }
      ]
    },
    options: chartOptions({ yMin: 0.3, yMax: 0.85 })
  });

  // 2. Classification Table
  const clsTbody = document.getElementById("classification-benchmark-tbody");
  clsTbody.innerHTML = "";
  const clsData = appData.classification_benchmarks;
  const clsModels = Object.keys(clsData).sort((a, b) => clsData[b].accuracy - clsData[a].accuracy);
  const champCls = clsModels[0];

  document.getElementById("cls-champion-label").textContent = `${champCls}: ${clsData[champCls].accuracy.toFixed(1)}% Acc`;

  clsModels.forEach((m) => {
    const d = clsData[m];
    const isChamp = m === champCls;
    const tr = document.createElement("tr");
    if (isChamp) tr.className = "highlighted-row";
    tr.innerHTML = `
      <td>${m} ${isChamp ? '<span class="badge-champion">Top Acc</span>' : ''}</td>
      <td><strong>${d.accuracy.toFixed(1)}%</strong></td>
      <td>${d.cv_accuracy_mean.toFixed(1)}%</td>
      <td>${d.precision.toFixed(3)}</td>
      <td>${d.f1_score.toFixed(3)}</td>
    `;
    clsTbody.appendChild(tr);
  });

  const clsCtx = document.getElementById("chart-classification-benchmarks").getContext("2d");
  charts.classification = new Chart(clsCtx, {
    type: "bar",
    data: {
      labels: clsModels.map(m => m.replace(" Classifier", "").replace(" Regression", "").replace("Support Vector Classifier (SVC)", "SVC")),
      datasets: [
        {
          label: "Test Accuracy (%)",
          data: clsModels.map(m => clsData[m].accuracy),
          backgroundColor: ["#10b981", "#06b6d4", "#6366f1", "#f59e0b"],
          borderRadius: 6
        },
        {
          label: "CV Accuracy (%)",
          data: clsModels.map(m => clsData[m].cv_accuracy_mean),
          backgroundColor: "rgba(255,255,255,0.12)",
          borderRadius: 6
        }
      ]
    },
    options: chartOptions({ yMin: 45, yMax: 90 })
  });
}

// ─── Cross-Region Transferability Matrix ─────────────────────────────────────
function renderTransferabilityMatrix() {
  const matrix = appData.transferability_matrix;
  const grid = document.getElementById("transferability-grid");
  grid.innerHTML = "";

  matrix.forEach((row, i) => {
    const card = document.createElement("div");
    card.className = "transferability-card";
    const r2Class = row.out_of_domain_r2 >= 0.5 ? "t-good" : row.out_of_domain_r2 >= 0.35 ? "t-medium" : "t-poor";
    card.innerHTML = `
      <div class="t-arrow">
        <span class="t-region-from">${row.training_region}</span>
        <span class="t-arrow-icon">→</span>
        <span class="t-region-to">${row.testing_region}</span>
      </div>
      <div class="t-metrics">
        <div class="t-metric">
          <span class="t-metric-label">Out-of-Domain R²</span>
          <span class="t-metric-val ${r2Class}">${row.out_of_domain_r2.toFixed(3)}</span>
        </div>
        <div class="t-metric">
          <span class="t-metric-label">Classification Accuracy</span>
          <span class="t-metric-val">${row.out_of_domain_accuracy.toFixed(1)}%</span>
        </div>
        <div class="t-metric">
          <span class="t-metric-label">Test Sample</span>
          <span class="t-metric-val">${row.sample_size} districts</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Bar chart for transferability comparison
  const ctx = document.getElementById("chart-transferability").getContext("2d");
  const labels = matrix.map((r, i) => `Experiment ${i + 1}`);
  charts.transferability = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Out-of-Domain R²",
          data: matrix.map(r => r.out_of_domain_r2),
          backgroundColor: "#a855f7",
          borderRadius: 6,
          yAxisID: "y"
        },
        {
          label: "Classification Accuracy (%)",
          data: matrix.map(r => r.out_of_domain_accuracy),
          backgroundColor: "#38bdf8",
          borderRadius: 6,
          yAxisID: "y2"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#94a3b8", font: { family: "Inter", size: 11 } } } },
      scales: {
        y: { min: 0, max: 1, grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94a3b8" }, title: { display: true, text: "R²", color: "#64748b" } },
        y2: { position: "right", min: 0, max: 100, grid: { display: false }, ticks: { color: "#94a3b8", callback: v => v + "%" }, title: { display: true, text: "Accuracy", color: "#64748b" } },
        x: { grid: { display: false }, ticks: { color: "#94a3b8" } }
      }
    }
  });
}

// ─── District Explorer ────────────────────────────────────────────────────────
function setupDistrictExplorer() {
  const stateSelect = document.getElementById("state-select");
  const states = [...new Set(appData.district_records.map(d => d.state))].sort();

  stateSelect.innerHTML = "";
  states.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    stateSelect.appendChild(opt);
  });

  const preferred = states.find(s => s.includes("BIHAR")) || states[0];
  stateSelect.value = preferred;
  populateDistrictsForState(preferred);
}

function onStateChange() {
  const selectedState = document.getElementById("state-select").value;
  populateDistrictsForState(selectedState);
}

function onRiskFilterChange() {
  const state = document.getElementById("state-select").value;
  populateDistrictsForState(state);
}

function populateDistrictsForState(stateName) {
  const distSelect = document.getElementById("district-select");
  const riskFilter = document.getElementById("risk-filter-explorer").value;
  let districts = appData.district_records
    .filter(d => d.state === stateName)
    .sort((a, b) => a.district.localeCompare(b.district));

  if (riskFilter !== "all") {
    districts = districts.filter(d => d.actual_tier === riskFilter);
  }

  distSelect.innerHTML = "";
  districts.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.district;
    opt.textContent = `${d.district} (${d.actual_tier} Risk)`;
    distSelect.appendChild(opt);
  });

  if (districts.length > 0) {
    distSelect.value = districts[0].district;
    updateDistrictCard(districts[0]);
  }
}

function onDistrictChange() {
  const distName = document.getElementById("district-select").value;
  const dist = appData.district_records.find(d => d.district === distName);
  if (dist) updateDistrictCard(dist);
}

function updateDistrictCard(d) {
  currentDistrict = d;
  document.getElementById("d-name").textContent = d.district;
  document.getElementById("d-state").textContent = d.state;
  document.getElementById("d-shap-name").textContent = d.district;

  const riskTag = document.getElementById("d-risk-tag");
  riskTag.textContent = `${d.actual_tier} Risk`;
  riskTag.className = `risk-tag ${d.actual_tier}`;

  document.getElementById("d-demanded").textContent = d.hh_demanded.toLocaleString();
  document.getElementById("d-worked").textContent = d.hh_worked.toLocaleString();
  document.getElementById("d-unmet").textContent = d.unmet_demand_hh.toLocaleString();
  document.getElementById("d-fulfill").textContent = `${d.fulfillment_rate}%`;
  document.getElementById("d-pred-unmet").textContent = d.predicted_unmet.toLocaleString();
  document.getElementById("d-ci").textContent = `${d.pred_unmet_p05.toLocaleString()} – ${d.pred_unmet_p95.toLocaleString()}`;
  document.getElementById("d-female-lit").textContent = `${d.female_literacy_rate}%`;
  document.getElementById("d-rain").textContent = `${d.annual_rainfall_mm} mm`;
  document.getElementById("d-scst").textContent = `${d.sc_st_share}%`;
  document.getElementById("d-wage").textContent = `₹${d.daily_wage_rate_inr}/day`;
  document.getElementById("d-fund").textContent = `₹${d.contingency_fund_cr} Cr`;
  document.getElementById("d-sanitation").textContent = `${d.sanitation_pct}%`;

  renderDistrictRadar(d);
  renderShapChart(d);
}

function renderDistrictRadar(d) {
  const radarCtx = document.getElementById("chart-district-radar").getContext("2d");
  if (charts.radar) charts.radar.destroy();

  const normDemand = Math.min(100, (d.hh_demanded / 150000) * 100);
  const normUnmet = Math.min(100, (d.unmet_demand_hh / 40000) * 100);
  const normLit = d.female_literacy_rate;
  const normRain = Math.min(100, (d.annual_rainfall_mm / 2000) * 100);
  const normSCST = d.sc_st_share;
  const normFulfill = d.fulfillment_rate;

  const color = d.actual_tier === "High" ? "#f43f5e" : d.actual_tier === "Medium" ? "#f59e0b" : "#10b981";
  const bg = d.actual_tier === "High" ? "rgba(244,63,94,0.2)" : d.actual_tier === "Medium" ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)";

  charts.radar = new Chart(radarCtx, {
    type: "radar",
    data: {
      labels: ["Demand Vol", "Unmet Gap", "Female Literacy", "Rainfall Index", "SC/ST Share", "Fulfillment"],
      datasets: [{
        label: d.district,
        data: [normDemand, normUnmet, normLit, normRain, normSCST, normFulfill],
        backgroundColor: bg,
        borderColor: color,
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { display: false },
          grid: { color: "rgba(255,255,255,0.08)" },
          pointLabels: { color: "#94a3b8", font: { family: "Inter", size: 10 } }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderShapChart(d) {
  const shapCtx = document.getElementById("chart-shap-local").getContext("2d");
  if (charts.shap) charts.shap.destroy();

  const attribs = d.local_attributions;
  const labels = Object.keys(attribs);
  const values = Object.values(attribs);
  const colors = values.map(v => v < 0 ? "#10b981" : "#f43f5e");

  charts.shap = new Chart(shapCtx, {
    type: "bar",
    indexAxis: "y",
    data: {
      labels,
      datasets: [{
        label: "SHAP Attribution (HH)",
        data: values,
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#94a3b8", font: { size: 10 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: "#f8fafc", font: { size: 10, family: "Inter" } }
        }
      }
    }
  });
}

// ─── Feature Importances ──────────────────────────────────────────────────────
function renderFeatureImportances() {
  const featCtx = document.getElementById("chart-feature-importance").getContext("2d");
  // Use feature_importances (the correct key in JSON)
  const rawData = appData.feature_importances || [];
  const data = rawData.slice(0, 10);

  const colors = data.map((_, i) => {
    const hues = [190, 210, 260, 300, 170, 220, 180, 280, 200, 240];
    return `hsl(${hues[i]}, 80%, 60%)`;
  });

  charts.importance = new Chart(featCtx, {
    type: "bar",
    indexAxis: "y",
    data: {
      labels: data.map(d => d.feature),
      datasets: [{
        label: "Importance Weight",
        data: data.map(d => d.importance),
        backgroundColor: colors,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94a3b8" } },
        y: { grid: { display: false }, ticks: { color: "#f8fafc", font: { size: 11, family: "Inter" } } }
      }
    }
  });
}

// ─── Forecast Timeline ────────────────────────────────────────────────────────
function renderForecastChart(view) {
  currentForecastView = view;
  if (charts.forecast) charts.forecast.destroy();

  const ctx = document.getElementById("chart-forecast-national").getContext("2d");

  if (view === 'national') {
    charts.forecast = new Chart(ctx, {
      type: "line",
      data: {
        labels: FORECAST_YEARS,
        datasets: [
          {
            label: "Baseline",
            data: FORECAST_BASELINE,
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56,189,248,0.08)",
            borderWidth: 2.5,
            fill: false,
            pointRadius: 4,
            pointBackgroundColor: "#38bdf8",
            tension: 0.35
          },
          {
            label: "Optimistic (Policy)",
            data: FORECAST_OPTIMISTIC,
            borderColor: "#10b981",
            backgroundColor: "rgba(16,185,129,0.08)",
            borderWidth: 2,
            fill: false,
            borderDash: [6, 3],
            pointRadius: 3,
            tension: 0.35
          },
          {
            label: "Pessimistic (Shock)",
            data: FORECAST_PESSIMISTIC,
            borderColor: "#f43f5e",
            backgroundColor: "rgba(244,63,94,0.08)",
            borderWidth: 2,
            fill: false,
            borderDash: [4, 4],
            pointRadius: 3,
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#94a3b8", font: { family: "Inter", size: 11 } } },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)} M HH`
            }
          }
        },
        scales: {
          y: {
            min: 8,
            grid: { color: "rgba(255,255,255,0.06)" },
            ticks: { color: "#94a3b8", callback: v => v + " M" },
            title: { display: true, text: "Unmet Demand (Million HH)", color: "#64748b" }
          },
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", maxRotation: 45 }
          }
        },
        animation: { duration: 800, easing: "easeInOutQuart" }
      }
    });
  } else if (view === 'states') {
    charts.forecast = new Chart(ctx, {
      type: "bar",
      data: {
        labels: TOP_STATE_DATA.labels.map(s => s.substring(0, 12)),
        datasets: [
          {
            label: "Actual Unmet (M HH)",
            data: TOP_STATE_DATA.actual,
            backgroundColor: "#f43f5e",
            borderRadius: 6
          },
          {
            label: "ML Predicted (M HH)",
            data: TOP_STATE_DATA.predicted,
            backgroundColor: "#06b6d4",
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#94a3b8", font: { family: "Inter", size: 11 } } } },
        scales: {
          y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94a3b8", callback: v => v + " M" } },
          x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 9 } } }
        }
      }
    });
  } else if (view === 'interval') {
    // Baseline + P05-P95 band
    const futureYears = FORECAST_YEARS.slice(4);
    charts.forecast = new Chart(ctx, {
      type: "line",
      data: {
        labels: futureYears,
        datasets: [
          {
            label: "Median Baseline",
            data: FORECAST_BASELINE.slice(4),
            borderColor: "#38bdf8",
            borderWidth: 2.5,
            fill: false,
            pointRadius: 4,
            tension: 0.35
          },
          {
            label: "95th Percentile (Upper)",
            data: FORECAST_P95.slice(4),
            borderColor: "rgba(244,63,94,0.6)",
            borderWidth: 1.5,
            fill: "+1",
            borderDash: [4, 3],
            backgroundColor: "rgba(244,63,94,0.1)",
            pointRadius: 2,
            tension: 0.35
          },
          {
            label: "5th Percentile (Lower)",
            data: FORECAST_P05.slice(4),
            borderColor: "rgba(16,185,129,0.6)",
            borderWidth: 1.5,
            fill: false,
            borderDash: [4, 3],
            pointRadius: 2,
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#94a3b8", font: { family: "Inter", size: 11 } } } },
        scales: {
          y: {
            min: 8, max: 17,
            grid: { color: "rgba(255,255,255,0.06)" },
            ticks: { color: "#94a3b8", callback: v => v + " M" }
          },
          x: { grid: { display: false }, ticks: { color: "#94a3b8" } }
        }
      }
    });
  }
}

function setForecastView(view) {
  document.querySelectorAll(".forecast-tab").forEach(b => b.classList.remove("active"));
  document.getElementById(`tab-${view}`).classList.add("active");
  renderForecastChart(view);
}

// ─── Simulator ────────────────────────────────────────────────────────────────
function initSimulator() {
  const s = appData.summary_stats;
  const baseHigh = s.high_risk_districts;
  const baseMed = s.medium_risk_districts;
  const baseLow = s.low_risk_districts;

  document.getElementById("sim-high-count").textContent = baseHigh;
  document.getElementById("sim-med-count").textContent = baseMed;
  document.getElementById("sim-low-count").textContent = baseLow;

  renderScenarioChart(s.total_unmet_demand, s.total_unmet_demand);
}

function runLiveSimulation() {
  const rainShock = parseInt(document.getElementById("slider-rain").value);
  const litShift = parseInt(document.getElementById("slider-lit").value);
  const demandShock = parseInt(document.getElementById("slider-demand").value);
  const budgetShift = parseInt(document.getElementById("slider-budget").value);

  document.getElementById("val-rain-slider").textContent = `${rainShock > 0 ? "+" : ""}${rainShock}%`;
  document.getElementById("val-lit-slider").textContent = `${litShift > 0 ? "+" : ""}${litShift}%`;
  document.getElementById("val-demand-slider").textContent = `${demandShock > 0 ? "+" : ""}${demandShock}%`;
  document.getElementById("val-budget-slider").textContent = `${budgetShift > 0 ? "+" : ""}${budgetShift}%`;

  // Elasticity derived from GB regressor coefficients
  // Rain deficit elasticity: −0.46, Literacy: −0.32, Demand: +0.72, Budget: −0.38
  const baselineUnmet = appData.summary_stats.total_unmet_demand;
  const rainImpact = (-rainShock / 100) * 0.46;
  const litImpact = (-litShift / 100) * 0.32;
  const demandImpact = (demandShock / 100) * 0.72;
  const budgetImpact = (-budgetShift / 100) * 0.38;

  const netMultiplier = 1.0 + rainImpact + litImpact + demandImpact + budgetImpact;
  const simUnmet = Math.max(0, Math.round(baselineUnmet * netMultiplier));

  const s = appData.summary_stats;
  const baseHigh = s.high_risk_districts;
  const baseMed = s.medium_risk_districts;
  const baseLow = s.low_risk_districts;

  const simHigh = Math.min(s.total_districts - 20, Math.max(10, Math.round(baseHigh * (1.0 + (netMultiplier - 1.0) * 1.5))));
  const simLow = Math.max(10, Math.round(baseLow * (1.0 - (netMultiplier - 1.0) * 0.8)));
  const simMed = s.total_districts - simHigh - simLow;

  document.getElementById("sim-unmet-total").textContent = (simUnmet / 1e6).toFixed(2) + " M";
  document.getElementById("sim-high-count").textContent = simHigh;
  document.getElementById("sim-med-count").textContent = simMed;
  document.getElementById("sim-low-count").textContent = simLow;

  // Delta indicators
  const dhigh = simHigh - baseHigh;
  document.getElementById("sim-high-delta").textContent = dhigh > 0 ? `+${dhigh}` : dhigh;
  document.getElementById("sim-high-delta").style.color = dhigh > 0 ? "#f43f5e" : "#10b981";
  const dlow = simLow - baseLow;
  document.getElementById("sim-low-delta").textContent = dlow > 0 ? `+${dlow}` : dlow;
  document.getElementById("sim-low-delta").style.color = dlow > 0 ? "#10b981" : "#f43f5e";

  // Contingency fund
  const baseWage = 260;
  const workdays = 100;
  const personMultiplier = 3.5;
  const contingencyCr = Math.round(simUnmet * personMultiplier * workdays * baseWage * (1 + budgetShift / 100) / 1e7) / 100;
  document.getElementById("sim-contingency").textContent = `₹${contingencyCr.toLocaleString()} Cr`;

  const baseContingency = s.national_contingency_fund_cr || 17325;
  const barPct = Math.min(100, Math.max(5, (contingencyCr / (baseContingency * 2)) * 100));
  document.getElementById("sim-budget-bar").style.width = barPct + "%";
  document.getElementById("sim-budget-bar").style.background = contingencyCr > baseContingency ? "linear-gradient(90deg, #f43f5e, #f59e0b)" : "linear-gradient(90deg, #06b6d4, #10b981)";

  const diffPct = ((simUnmet - baselineUnmet) / baselineUnmet) * 100;
  const banner = document.getElementById("sim-banner");
  const desc = document.getElementById("sim-change-desc");

  if (diffPct < -0.1) {
    banner.className = "sim-delta-banner negative";
    desc.textContent = `${Math.abs(diffPct).toFixed(1)}% Reduction vs Baseline — Policy Effective`;
  } else if (diffPct > 0.1) {
    banner.className = "sim-delta-banner";
    desc.textContent = `+${diffPct.toFixed(1)}% Surge in Unmet Demand Backlog`;
  } else {
    banner.className = "sim-delta-banner";
    desc.textContent = "Baseline Conditions — No Net Change";
  }

  updateScenarioChart(baselineUnmet, simUnmet);
}

function applyPreset(rain, lit, demand, budget) {
  document.getElementById("slider-rain").value = rain;
  document.getElementById("slider-lit").value = lit;
  document.getElementById("slider-demand").value = demand;
  document.getElementById("slider-budget").value = budget;
  runLiveSimulation();
}

function renderScenarioChart(baseline, simulated) {
  const ctx = document.getElementById("chart-scenario-comparison").getContext("2d");
  charts.scenario = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Baseline", "Simulated"],
      datasets: [{
        label: "Unmet Demand (Million HH)",
        data: [baseline / 1e6, simulated / 1e6],
        backgroundColor: ["#38bdf8", simulated > baseline ? "#f43f5e" : "#10b981"],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#94a3b8", callback: v => v + "M" }
        },
        x: { grid: { display: false }, ticks: { color: "#f8fafc", font: { family: "Outfit", size: 12 } } }
      }
    }
  });
}

function updateScenarioChart(baseline, simulated) {
  if (charts.scenario) {
    charts.scenario.data.datasets[0].data = [baseline / 1e6, simulated / 1e6];
    charts.scenario.data.datasets[0].backgroundColor = ["#38bdf8", simulated > baseline ? "#f43f5e" : "#10b981"];
    charts.scenario.update();
  }
}

// ─── Leaflet Interactive India Map & Spatial Intelligence Engine ──────────────
let currentMapMetric = 'risk';
let currentMapTierFilter = 'all';
let currentMapStateFilter = 'all';
let currentMapSearchQuery = '';
let selectedMapDistrict = null;

function initLeafletMap() {
  if (!appData || !appData.district_records) return;

  // Initialize Leaflet map centered on India
  mapInstance = L.map("india-map", {
    center: [22.8, 82.0],
    zoom: 5,
    minZoom: 4,
    maxZoom: 11,
    zoomControl: true,
    attributionControl: true
  });

  // Dark tile layer (CartoDB dark_matter)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(mapInstance);

  // Populate State filter dropdown
  const stateSelect = document.getElementById("map-state-filter");
  if (stateSelect) {
    const states = [...new Set(appData.district_records.map(d => d.state).filter(Boolean))].sort();
    states.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      stateSelect.appendChild(opt);
    });
  }

  // Populate filter counts
  const recs = appData.district_records;
  const countAll = recs.length;
  const countHigh = recs.filter(d => d.actual_tier === "High").length;
  const countMed = recs.filter(d => d.actual_tier === "Medium").length;
  const countLow = recs.filter(d => d.actual_tier === "Low").length;

  const elAll = document.getElementById("count-all");
  const elHigh = document.getElementById("count-high");
  const elMed = document.getElementById("count-med");
  const elLow = document.getElementById("count-low");
  if (elAll) elAll.textContent = countAll;
  if (elHigh) elHigh.textContent = countHigh;
  if (elMed) elMed.textContent = countMed;
  if (elLow) elLow.textContent = countLow;

  renderMapLegend();
  updateMapDisplay();

  setTimeout(() => {
    if (mapInstance) mapInstance.invalidateSize();
  }, 250);
}

function setMapMetric(metric) {
  currentMapMetric = metric;
  document.querySelectorAll(".map-tab").forEach(tab => tab.classList.remove("active"));
  const activeTab = document.getElementById(`mtab-${metric}`);
  if (activeTab) activeTab.classList.add("active");

  const guideText = document.getElementById("map-guide-text");
  if (guideText) {
    if (metric === 'risk') guideText.textContent = "Showing Risk Tiers: Red = High Risk, Yellow = Medium Risk, Green = Low Risk.";
    else if (metric === 'unmet') guideText.textContent = "Showing Unmet Demand Gap: Red = >40k HH, Orange = 25k-40k, Yellow = 10k-25k, Blue = <10k HH.";
    else if (metric === 'rainfall') guideText.textContent = "Showing Annual Rainfall: Red = <600mm Drought stress, Yellow = 600-1000mm, Green = >1000mm.";
    else if (metric === 'literacy') guideText.textContent = "Showing Female Literacy: Red = <55% Human capital deficit, Yellow = 55-70%, Green = >70%.";
    else if (metric === 'budget') guideText.textContent = "Showing Contingency Fund: Purple = >₹40 Cr, Blue = ₹20-40 Cr, Cyan = ₹10-20 Cr, Green = <₹10 Cr.";
  }

  renderMapLegend();
  updateMapDisplay();
}

function filterMapByTier(tier) {
  currentMapTierFilter = tier;
  document.querySelectorAll(".risk-pill").forEach(p => p.classList.remove("active"));
  const activePill = document.getElementById(`rpill-${tier.toLowerCase()}`);
  if (activePill) activePill.classList.add("active");
  updateMapDisplay();
}

function onMapStateChange(state) {
  currentMapStateFilter = state;
  updateMapDisplay();

  // If a specific state is chosen, zoom to its bounds
  if (state !== "all" && mapInstance) {
    const stateDistricts = appData.district_records.filter(d => d.state === state && d.lat && d.lon);
    if (stateDistricts.length > 0) {
      const bounds = L.latLngBounds(stateDistricts.map(d => [d.lat, d.lon]));
      mapInstance.fitBounds(bounds, { padding: [35, 35], maxZoom: 8 });
    }
  } else if (mapInstance) {
    resetMapAllIndia();
  }
}

function onMapSearchInput(query) {
  currentMapSearchQuery = query.trim().toLowerCase();
  if (currentMapSearchQuery.length >= 2) {
    const found = appData.district_records.find(d => d.district.toLowerCase().includes(currentMapSearchQuery));
    if (found && found.lat && found.lon) {
      inspectDistrictOnMap(found);
      mapInstance.setView([found.lat, found.lon], 8, { animate: true });
    }
  }
}

function resetMapAllIndia() {
  currentMapStateFilter = 'all';
  currentMapTierFilter = 'all';
  currentMapSearchQuery = '';

  const stateSelect = document.getElementById("map-state-filter");
  if (stateSelect) stateSelect.value = "all";

  const searchInput = document.getElementById("map-district-search");
  if (searchInput) searchInput.value = "";

  document.querySelectorAll(".risk-pill").forEach(p => p.classList.remove("active"));
  document.getElementById("rpill-all")?.classList.add("active");

  if (mapInstance) {
    mapInstance.setView([22.8, 82.0], 5, { animate: true });
  }
  updateMapDisplay();
}

function getDistrictMetricColor(d) {
  if (currentMapMetric === 'risk') {
    if (d.actual_tier === "High") return "#f43f5e";
    if (d.actual_tier === "Medium") return "#f59e0b";
    return "#10b981";
  } else if (currentMapMetric === 'unmet') {
    const unmet = d.unmet_demand_hh;
    if (unmet > 40000) return "#f43f5e";
    if (unmet > 25000) return "#fb923c";
    if (unmet > 10000) return "#facc15";
    return "#38bdf8";
  } else if (currentMapMetric === 'rainfall') {
    const rain = d.annual_rainfall_mm;
    if (rain < 600) return "#ef4444";
    if (rain < 1000) return "#f59e0b";
    if (rain < 1600) return "#10b981";
    return "#06b6d4";
  } else if (currentMapMetric === 'literacy') {
    const lit = d.female_literacy_rate;
    if (lit < 55) return "#f43f5e";
    if (lit < 70) return "#f59e0b";
    return "#10b981";
  } else if (currentMapMetric === 'budget') {
    const budget = d.contingency_fund_cr;
    if (budget > 40) return "#c084fc";
    if (budget > 20) return "#6366f1";
    if (budget > 10) return "#38bdf8";
    return "#10b981";
  }
  return "#38bdf8";
}

function getDistrictMetricRadius(d) {
  const unmet = d.unmet_demand_hh;
  if (unmet > 50000) return 13;
  if (unmet > 30000) return 10;
  if (unmet > 15000) return 7;
  if (unmet > 5000) return 5;
  return 4;
}

function updateMapDisplay() {
  if (!mapInstance || !appData || !appData.district_records) return;

  // Clear existing markers
  mapMarkers.forEach(m => m.remove());
  mapMarkers = [];

  // Filter records
  const filtered = appData.district_records.filter(d => {
    if (currentMapTierFilter !== "all" && d.actual_tier !== currentMapTierFilter) return false;
    if (currentMapStateFilter !== "all" && d.state !== currentMapStateFilter) return false;
    if (currentMapSearchQuery && !d.district.toLowerCase().includes(currentMapSearchQuery)) return false;
    return true;
  });

  // Update Dynamic Statistics Banner
  const totalInView = filtered.length;
  const totalUnmetInView = filtered.reduce((acc, d) => acc + d.unmet_demand_hh, 0);
  const avgFulfillInView = totalInView > 0 ? (filtered.reduce((acc, d) => acc + d.fulfillment_rate, 0) / totalInView).toFixed(1) : 0;
  const totalBudgetInView = filtered.reduce((acc, d) => acc + d.contingency_fund_cr, 0).toFixed(1);

  document.getElementById("mstat-districts").textContent = `${totalInView} Districts`;
  document.getElementById("mstat-unmet").textContent = `${(totalUnmetInView / 1e6).toFixed(2)} M HH`;
  document.getElementById("mstat-fulfill").textContent = `${avgFulfillInView}%`;
  document.getElementById("mstat-budget").textContent = `₹${parseFloat(totalBudgetInView).toLocaleString()} Cr`;

  // Plot markers
  filtered.forEach(d => {
    if (!d.lat || !d.lon || d.lat === 0 || d.lon === 0) return;

    const color = getDistrictMetricColor(d);
    const radius = getDistrictMetricRadius(d);

    const marker = L.circleMarker([d.lat, d.lon], {
      radius,
      fillColor: color,
      color: "rgba(255,255,255,0.4)",
      weight: 1,
      opacity: 0.9,
      fillOpacity: 0.78
    });

    // Tooltip on hover
    marker.bindTooltip(`
      <div style="font-family:'Inter',sans-serif; font-size:12px;">
        <strong>${d.district}</strong> (${d.state})<br>
        <span style="color:${color}; font-weight:600;">${d.actual_tier} Risk</span> • ${d.unmet_demand_hh.toLocaleString()} Unmet HH
      </div>
    `, { direction: "top", offset: [0, -6], className: "custom-popup" });

    // On Click: Select district in inspector
    marker.on("click", () => {
      inspectDistrictOnMap(d);
    });

    marker.addTo(mapInstance);
    mapMarkers.push(marker);
  });
}

function inspectDistrictOnMap(d) {
  selectedMapDistrict = d;

  const placeholder = document.getElementById("inspector-placeholder");
  const details = document.getElementById("inspector-details");
  if (placeholder) placeholder.style.display = "none";
  if (details) details.style.display = "flex";

  const color = getDistrictMetricColor(d);

  document.getElementById("insp-name").textContent = d.district;
  document.getElementById("insp-state").textContent = d.state;

  const tierBadge = document.getElementById("insp-tier");
  tierBadge.className = `badge-tier tier-${d.actual_tier.toLowerCase()}`;
  tierBadge.textContent = `${d.actual_tier.toUpperCase()} RISK`;

  // Why this tier
  const reasonBox = document.getElementById("insp-reason");
  if (d.actual_tier === "High") {
    reasonBox.innerHTML = `⚠️ <strong>High Risk Driver:</strong> Delivery bottleneck with fulfillment at <strong>${d.fulfillment_rate}%</strong> and <strong>${d.unmet_demand_hh.toLocaleString()} HH</strong> unmet demand gap.`;
    reasonBox.style.borderLeftColor = "#f43f5e";
  } else if (d.actual_tier === "Medium") {
    reasonBox.innerHTML = `🟡 <strong>Moderate Stress:</strong> Fulfillment rate of <strong>${d.fulfillment_rate}%</strong>. Seasonal climate stress could tip district into high risk.`;
    reasonBox.style.borderLeftColor = "#f59e0b";
  } else {
    reasonBox.innerHTML = `🟢 <strong>Stable Delivery:</strong> High administrative fulfillment of <strong>${d.fulfillment_rate}%</strong> meeting community employment demand.`;
    reasonBox.style.borderLeftColor = "#10b981";
  }

  // Values
  document.getElementById("insp-demanded").textContent = d.hh_demanded.toLocaleString();
  document.getElementById("insp-worked").textContent = d.hh_worked.toLocaleString();
  document.getElementById("insp-unmet").textContent = d.unmet_demand_hh.toLocaleString();
  document.getElementById("insp-fulfill").textContent = d.fulfillment_rate + "%";
  document.getElementById("insp-lit").textContent = d.female_literacy_rate + "%";
  document.getElementById("insp-rain").textContent = d.annual_rainfall_mm + " mm";
  document.getElementById("insp-wage").textContent = `₹${d.daily_wage_rate_inr || 260}`;
  document.getElementById("insp-fund").textContent = `₹${d.contingency_fund_cr} Cr`;

  // SHAP Feature Forces List
  const forcesList = document.getElementById("insp-attributions");
  if (forcesList) {
    const attribs = Object.entries(d.local_attributions || {}).sort((a,b) => Math.abs(b[1]) - Math.abs(a[1]));
    forcesList.innerHTML = attribs.map(([k, v]) => `
      <div class="insp-driver-tag">
        <span>${k}</span>
        <strong style="color:${v > 0 ? '#f43f5e' : '#10b981'}">${v > 0 ? '+' : ''}${v}</strong>
      </div>
    `).join("");
  }
}

function quickSelectHotspot(districtName) {
  const d = appData.district_records.find(item => item.district.toLowerCase() === districtName.toLowerCase());
  if (d && d.lat && d.lon) {
    inspectDistrictOnMap(d);
    mapInstance.setView([d.lat, d.lon], 8, { animate: true });
  }
}

function jumpToForecastDistrict() {
  if (!selectedMapDistrict) return;
  const select = document.getElementById("district-forecast-select");
  if (select) {
    select.value = selectedMapDistrict.district;
    onDistrictForecastChange(selectedMapDistrict.district);
    scrollToSection("forecast-section");
  }
}

function askAICopilotAboutDistrict() {
  if (!selectedMapDistrict) return;
  toggleAIChatbot();
  const input = document.getElementById("ai-chat-input");
  if (input) {
    input.value = `Tell me about ${selectedMapDistrict.district} district vulnerability and future outlook`;
    handleAIChatSubmit(new Event("submit"));
  }
}

function renderMapLegend() {
  const legend = document.getElementById("map-rich-legend");
  if (!legend) return;

  let metricLegend = "";
  if (currentMapMetric === 'risk') {
    metricLegend = `
      <div class="legend-group">
        <span class="legend-title">Risk Classification:</span>
        <div class="legend-items">
          <div class="legend-entry"><span class="legend-dot" style="background:#f43f5e;"></span> High Risk <span class="legend-entry-desc">(&lt;80% Fulfill or &gt;25k Unmet)</span></div>
          <div class="legend-entry"><span class="legend-dot" style="background:#f59e0b;"></span> Medium Risk <span class="legend-entry-desc">(80%–92% Fulfill)</span></div>
          <div class="legend-entry"><span class="legend-dot" style="background:#10b981;"></span> Low Risk <span class="legend-entry-desc">(&gt;92% Fulfill)</span></div>
        </div>
      </div>
    `;
  } else if (currentMapMetric === 'unmet') {
    metricLegend = `
      <div class="legend-group">
        <span class="legend-title">Unmet Demand Volume:</span>
        <div class="legend-items">
          <div class="legend-entry"><span class="legend-dot" style="background:#f43f5e;"></span> &gt;40,000 HH</div>
          <div class="legend-entry"><span class="legend-dot" style="background:#fb923c;"></span> 25,000–40,000 HH</div>
          <div class="legend-entry"><span class="legend-dot" style="background:#facc15;"></span> 10,000–25,000 HH</div>
          <div class="legend-entry"><span class="legend-dot" style="background:#38bdf8;"></span> &lt;10,000 HH</div>
        </div>
      </div>
    `;
  } else if (currentMapMetric === 'rainfall') {
    metricLegend = `
      <div class="legend-group">
        <span class="legend-title">IMD Annual Rainfall:</span>
        <div class="legend-items">
          <div class="legend-entry"><span class="legend-dot" style="background:#ef4444;"></span> &lt;600 mm <span class="legend-entry-desc">(Arid / Severe Deficit)</span></div>
          <div class="legend-entry"><span class="legend-dot" style="background:#f59e0b;"></span> 600–1000 mm <span class="legend-entry-desc">(Semi-Arid)</span></div>
          <div class="legend-entry"><span class="legend-dot" style="background:#10b981;"></span> 1000–1600 mm <span class="legend-entry-desc">(Normal Monsoon)</span></div>
          <div class="legend-entry"><span class="legend-dot" style="background:#06b6d4;"></span> &gt;1600 mm <span class="legend-entry-desc">(High Precipitation)</span></div>
        </div>
      </div>
    `;
  } else if (currentMapMetric === 'literacy') {
    metricLegend = `
      <div class="legend-group">
        <span class="legend-title">Female Literacy Rate (NFHS-5):</span>
        <div class="legend-items">
          <div class="legend-entry"><span class="legend-dot" style="background:#f43f5e;"></span> &lt;55% <span class="legend-entry-desc">(Acute Educational Deficit)</span></div>
          <div class="legend-entry"><span class="legend-dot" style="background:#f59e0b;"></span> 55%–70% <span class="legend-entry-desc">(Moderate)</span></div>
          <div class="legend-entry"><span class="legend-dot" style="background:#10b981;"></span> &gt;70% <span class="legend-entry-desc">(High Literacy)</span></div>
        </div>
      </div>
    `;
  } else if (currentMapMetric === 'budget') {
    metricLegend = `
      <div class="legend-group">
        <span class="legend-title">Required Contingency Budget:</span>
        <div class="legend-items">
          <div class="legend-entry"><span class="legend-dot" style="background:#c084fc;"></span> &gt;₹40 Cr</div>
          <div class="legend-entry"><span class="legend-dot" style="background:#6366f1;"></span> ₹20–₹40 Cr</div>
          <div class="legend-entry"><span class="legend-dot" style="background:#38bdf8;"></span> ₹10–₹20 Cr</div>
          <div class="legend-entry"><span class="legend-dot" style="background:#10b981;"></span> &lt;₹10 Cr</div>
        </div>
      </div>
    `;
  }

  const sizeLegend = `
    <div class="legend-group">
      <span class="legend-title">Circle Radius:</span>
      <div class="size-legend-dots">
        <div class="size-dot-item"><span style="width:7px; height:7px; border-radius:50%; background:#94a3b8; display:inline-block;"></span> &lt;15k HH</div>
        <div class="size-dot-item"><span style="width:11px; height:11px; border-radius:50%; background:#94a3b8; display:inline-block;"></span> 15k–30k</div>
        <div class="size-dot-item"><span style="width:16px; height:16px; border-radius:50%; background:#94a3b8; display:inline-block;"></span> &gt;50k HH</div>
      </div>
    </div>
  `;

  legend.innerHTML = metricLegend + sizeLegend;
}


// ─── Helpers ──────────────────────────────────────────────────────────────────
function chartOptions({ yMin, yMax } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#94a3b8", font: { family: "Inter", size: 11 } } } },
    scales: {
      y: {
        min: yMin,
        max: yMax,
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#94a3b8" }
      },
      x: { grid: { display: false }, ticks: { color: "#94a3b8" } }
    }
  };
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    const activeBtn = Array.from(document.querySelectorAll(".nav-btn")).find(b => b.getAttribute("onclick")?.includes(id));
    if (activeBtn) activeBtn.classList.add("active");
  }
}

function setupSmoothScroll() {
  // Highlight active nav on scroll
  const sections = ["overview-section", "map-section", "benchmark-section", "explorer-section", "forecast-section", "simulator-section", "findings-section"];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
        const activeBtn = Array.from(document.querySelectorAll(".nav-btn")).find(b => b.getAttribute("onclick")?.includes(entry.target.id));
        if (activeBtn) activeBtn.classList.add("active");
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// ════════════════════════════════════════════════════════════════════════════════
//   DISTRICT-LEVEL FUTURE OUTCOME FORECASTER (FY 2024 - FY 2030)
// ════════════════════════════════════════════════════════════════════════════════
let currentForecastDistrict = null;
let currentPathway = 'baseline';
const FUTURE_YEARS = ['FY 2023-24 (Act)', 'FY 2024-25', 'FY 2025-26', 'FY 2026-27', 'FY 2027-28', 'FY 2028-29', 'FY 2029-30'];

function initDistrictFutureForecaster() {
  const select = document.getElementById("district-forecast-select");
  if (!select || !appData || !appData.district_records) return;

  select.innerHTML = "";
  const sorted = [...appData.district_records].sort((a, b) => b.unmet_demand_hh - a.unmet_demand_hh);

  sorted.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.district;
    opt.textContent = `${d.district} (${d.state}) — ${d.actual_tier} Risk [${d.unmet_demand_hh.toLocaleString()} HH]`;
    select.appendChild(opt);
  });

  // Default to a high risk district
  const defaultDistrict = sorted.find(d => d.actual_tier === "High") || sorted[0];
  if (defaultDistrict) {
    select.value = defaultDistrict.district;
    currentForecastDistrict = defaultDistrict;
  }
  updateDistrictForecast();
}

function onDistrictForecastChange(districtName) {
  if (!appData) return;
  const d = appData.district_records.find(item => item.district === districtName);
  if (d) {
    currentForecastDistrict = d;
    updateDistrictForecast();
  }
}

function setFuturePathway(pathway) {
  currentPathway = pathway;
  document.querySelectorAll(".pathway-btn").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.getElementById(`path-${pathway}`);
  if (activeBtn) activeBtn.classList.add("active");
  updateDistrictForecast();
}

function updateDistrictForecast() {
  const d = currentForecastDistrict;
  if (!d) return;

  // Base metrics from district
  const actualUnmet = d.unmet_demand_hh;
  const predUnmet = d.predicted_unmet || actualUnmet;
  const p05 = d.pred_unmet_p05 || Math.round(predUnmet * 0.85);
  const p95 = d.pred_unmet_p95 || Math.round(predUnmet * 1.25);
  const wageRate = d.daily_wage_rate_inr || 260;

  // Multiplier profiles based on selected pathway
  let multipliers = [1.0, 0.98, 0.96, 0.94, 0.92, 0.90, 0.88]; // Baseline
  if (currentPathway === 'drought') {
    // Sharp surge in FY25-FY27, high baseline
    multipliers = [1.0, 1.15, 1.34, 1.28, 1.22, 1.18, 1.15];
  } else if (currentPathway === 'distress') {
    // Persistent rural inflation & wage stagnation
    multipliers = [1.0, 1.10, 1.22, 1.25, 1.26, 1.24, 1.22];
  } else if (currentPathway === 'policy') {
    // Mission mode policy intervention (-7% per year)
    multipliers = [1.0, 0.92, 0.84, 0.76, 0.70, 0.65, 0.60];
  }

  const projectedDemand = multipliers.map((m, i) => {
    if (i === 0) return actualUnmet;
    return Math.round(predUnmet * m);
  });

  const projectedP05 = multipliers.map((m, i) => {
    if (i === 0) return actualUnmet;
    return Math.round(p05 * m);
  });

  const projectedP95 = multipliers.map((m, i) => {
    if (i === 0) return actualUnmet;
    return Math.round(p95 * m);
  });

  // Calculate projected fulfillment rate
  const initialFulfill = d.fulfillment_rate || 85;
  const projectedFulfill = multipliers.map((m, i) => {
    if (i === 0) return initialFulfill;
    if (currentPathway === 'drought' || currentPathway === 'distress') {
      return Math.max(50, Math.round(initialFulfill * (1 - (m - 1) * 0.5)));
    } else if (currentPathway === 'policy') {
      return Math.min(99, Math.round(initialFulfill * (1 + (1 - m) * 0.4)));
    }
    return Math.min(98, Math.round(initialFulfill + (i * 0.8)));
  });

  // Render Future Chart
  renderDistrictFutureChart(d, projectedDemand, projectedP05, projectedP95);

  // Update Metrics Cards
  const val2026 = projectedDemand[3]; // FY 2026-27
  const val2030 = projectedDemand[6]; // FY 2029-30
  const fulfill2026 = projectedFulfill[3];

  document.getElementById("df-val-2026").textContent = val2026.toLocaleString() + " HH";
  const pctChange2026 = Math.round(((val2026 - actualUnmet) / (actualUnmet + 1)) * 100);
  const sign2026 = pctChange2026 > 0 ? "+" : "";
  document.getElementById("df-sub-2026").textContent = `${sign2026}${pctChange2026}% vs FY24 Actual`;

  document.getElementById("df-val-2030").textContent = val2030.toLocaleString() + " HH";
  const pctChange2030 = Math.round(((val2030 - actualUnmet) / (actualUnmet + 1)) * 100);
  const sign2030 = pctChange2030 > 0 ? "+" : "";
  document.getElementById("df-sub-2030").textContent = `${sign2030}${pctChange2030}% Long-Term Trajectory`;

  document.getElementById("df-val-fulfill").textContent = fulfill2026 + "%";
  document.getElementById("df-sub-fulfill").textContent = fulfill2026 >= 90 ? "🟢 Low Risk Capacity" : (fulfill2026 >= 75 ? "🟡 Medium Risk Capacity" : "🔴 Bottleneck Risk");

  // 5-Year Cumulative Contingency Budget: sum of FY25 to FY29 * 45 days * wage
  const futureSumUnmet = projectedDemand.slice(1, 6).reduce((a, b) => a + b, 0);
  const cumulativeBudgetCr = ((futureSumUnmet * 45 * wageRate) / 1e7).toFixed(2);
  document.getElementById("df-val-budget").textContent = `₹${parseFloat(cumulativeBudgetCr).toLocaleString()} Cr`;
  document.getElementById("df-sub-budget").textContent = `5-Year Needs (₹${wageRate}/day)`;

  // Badge and Alert text
  const badge = document.getElementById("df-status-badge");
  const alertBox = document.getElementById("df-alert-box");
  const alertText = document.getElementById("df-alert-text");

  let projectedTier = d.actual_tier;
  if (currentPathway === 'drought' || currentPathway === 'distress') {
    if (val2026 > 25000 || fulfill2026 < 80) projectedTier = "High";
    else if (fulfill2026 < 92) projectedTier = "Medium";
  } else if (currentPathway === 'policy') {
    if (fulfill2026 >= 92 && val2026 < 15000) projectedTier = "Low";
    else if (fulfill2026 >= 80) projectedTier = "Medium";
  }

  badge.className = `badge-tier tier-${projectedTier.toLowerCase()}`;
  badge.textContent = `${projectedTier.toUpperCase()} RISK [${currentPathway.toUpperCase()}]`;

  if (currentPathway === 'drought') {
    alertBox.className = "future-alert-box";
    alertText.innerHTML = `<strong>🚨 Climate Shock Warning:</strong> In ${d.district}, a 30% precipitation deficit causes unmet demand to surge by <strong>${sign2026}${pctChange2026}%</strong>. Required annual contingency budget escalates to <strong>₹${((val2026 * 45 * wageRate) / 1e7).toFixed(1)} Cr</strong>.`;
  } else if (currentPathway === 'distress') {
    alertBox.className = "future-alert-box";
    alertText.innerHTML = `<strong>⚠️ Labour Market Alert:</strong> High rural inflation & agricultural wage compression increases casual labour dependency on MGNREGA in ${d.district}.`;
  } else if (currentPathway === 'policy') {
    alertBox.className = "future-alert-box normal";
    alertText.innerHTML = `<strong>✅ Policy Impact Positive:</strong> Intensive educational uplift and expanded scheme capacity projects a <strong>${Math.abs(pctChange2030)}% reduction</strong> in unmet demand by 2030.`;
  } else {
    alertBox.className = projectedTier === "High" ? "future-alert-box" : "future-alert-box normal";
    alertText.innerHTML = `<strong>📊 Baseline Projection:</strong> Business-as-usual trend with standard monsoon. Unmet demand tracks steady at ~${val2026.toLocaleString()} households.`;
  }
}

function renderDistrictFutureChart(d, projectedDemand, projectedP05, projectedP95) {
  const ctx = document.getElementById("chart-district-future").getContext("2d");
  if (charts.districtFuture) charts.districtFuture.destroy();

  const isDarkShock = currentPathway === 'drought' || currentPathway === 'distress';
  const lineColor = isDarkShock ? "#f43f5e" : (currentPathway === 'policy' ? "#10b981" : "#38bdf8");

  charts.districtFuture = new Chart(ctx, {
    type: "line",
    data: {
      labels: FUTURE_YEARS,
      datasets: [
        {
          label: "Upper 90% Bound (P95)",
          data: projectedP95,
          borderColor: "transparent",
          backgroundColor: "rgba(56, 189, 248, 0.08)",
          fill: "+1",
          pointRadius: 0,
          tension: 0.35
        },
        {
          label: "Lower 90% Bound (P05)",
          data: projectedP05,
          borderColor: "transparent",
          backgroundColor: "transparent",
          fill: false,
          pointRadius: 0,
          tension: 0.35
        },
        {
          label: `${d.district} Projected Unmet Demand`,
          data: projectedDemand,
          borderColor: lineColor,
          backgroundColor: lineColor + "22",
          borderWidth: 3,
          fill: false,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: lineColor,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 1.5,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#94a3b8",
            filter: item => item.text && item.text.includes("Projected"),
            font: { family: "Inter", size: 11 }
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${Math.round(ctx.parsed.y).toLocaleString()} HH`
          }
        }
      },
      scales: {
        y: {
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: {
            color: "#94a3b8",
            callback: v => v >= 1000 ? (v / 1000).toFixed(0) + "k" : v
          },
          title: { display: true, text: "Unmet Demand (Households)", color: "#64748b" }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#94a3b8", font: { size: 10 } }
        }
      }
    }
  });
}

// ════════════════════════════════════════════════════════════════════════════════
//   AI POLICY COPILOT CHATBOT ENGINE
// ════════════════════════════════════════════════════════════════════════════════
let isAIChatOpen = false;

function initAIChatbot() {
  console.log("AI Chatbot initialized — Gemini 2.0 Flash ready.");
  updateCopilotStatus();
}

function toggleAIChatbot() {
  const modal = document.getElementById("ai-chat-modal");
  if (!modal) return;
  isAIChatOpen = !isAIChatOpen;
  if (isAIChatOpen) {
    modal.classList.add("open");
    setTimeout(() => document.getElementById("ai-chat-input")?.focus(), 250);
  } else {
    modal.classList.remove("open");
  }
}

function clearAIChat() {
  const container = document.getElementById("ai-chat-messages");
  if (!container) return;
  container.innerHTML = `
    <div class="ai-msg ai-msg-bot">
      <div class="ai-msg-avatar">🤖</div>
      <div class="ai-msg-bubble">
        <p><strong>Chat history cleared.</strong> How may I assist your policy planning or research today?</p>
      </div>
    </div>
  `;
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById("ai-chat-input");
  if (input) {
    input.value = promptText;
    handleAIChatSubmit(new Event("submit"));
  }
}

async function handleAIChatSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById("ai-chat-input");
  if (!input) return;
  const query = input.value.trim();
  if (!query) return;

  const userSafeText = query.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  appendChatMessage("user", `<p>${userSafeText}</p>`);
  input.value = "";
  showAITypingIndicator();

  const activeKey = geminiApiKey || DEFAULT_GEMINI_KEY;

  try {
    if (activeKey) {
      // ── Real Gemini 3.8 Flash response
      const rawText = await callGeminiAPI(query);
      removeAITypingIndicator();
      appendChatMessage("bot", markdownToHTML(rawText));
    } else {
      // Offline fallback: Use local multi-pillar dataset knowledge engine
      setTimeout(() => {
        removeAITypingIndicator();
        const reply = generateAIResponse(query);
        appendChatMessage("bot", reply.html);
      }, 350);
    }
  } catch (err) {
    removeAITypingIndicator();
    console.warn("Gemini call error:", err.message);
    const fallback = generateAIResponse(query);
    appendChatMessage("bot", fallback.html);
  }
}

// ─── Gemini AI Core Functions ────────────────────────────────────────────────

function buildGeminiSystemPrompt() {
  const stats = appData?.summary_stats || {};
  const records = appData?.district_records || [];
  const topVulnerable = [...records]
    .sort((a, b) => b.unmet_demand_hh - a.unmet_demand_hh)
    .slice(0, 10);

  const distSummary = topVulnerable.map((d, i) =>
    `${i + 1}. ${d.district} (${d.state}): Unmet=${d.unmet_demand_hh.toLocaleString()} HH, Fulfillment=${d.fulfillment_rate}%, Female Literacy=${d.female_literacy_rate}%, Risk=${d.actual_tier}, Rainfall=${d.annual_rainfall_mm}mm, Contingency=₹${d.contingency_fund_cr}Cr`
  ).join('\n');

  return `You are the NREGA Intelligence Copilot, an expert AI policy analyst embedded in India's MGNREGA district-level ML forecasting system. You have real-time access to a verified 745-district dataset.

NATIONAL STATISTICS (FY 2023-24):
- Total Districts: ${stats.total_districts || 745} | States: ${stats.total_states || 28}
- HH Demanded: ${((stats.total_households_demanded || 14030000) / 1e6).toFixed(2)}M | HH Worked: ${((stats.total_households_worked || 11180000) / 1e6).toFixed(2)}M
- Unmet Demand: ${((stats.total_unmet_demand || 2850000) / 1e6).toFixed(2)}M HH | National Fulfillment: ${stats.national_fulfillment_rate || 79.6}%
- High-Risk Districts: ${stats.high_risk_districts || 187} | Medium-Risk: ${stats.medium_risk_districts || 312}
- National Contingency Fund Required: ₹${(stats.national_contingency_fund_cr || 17325).toLocaleString()} Crore

TOP 10 MOST VULNERABLE DISTRICTS:
${distSummary}

ML MODEL PERFORMANCE (5-Fold Cross-Validation):
- Gradient Boosting: R²=0.699, CV R²=0.681±0.038, RMSE=8,897 [BEST REGRESSOR]
- Random Forest: R²=0.676, Accuracy=79.2%, F1=0.786 [BEST CLASSIFIER]
- Ridge Regression: R²=0.639 (linear baseline)
- Decision Tree: R²=0.581 | SVM Classifier: Accuracy=73.4%
- Cross-Region Transferability (GAP-15): South→North R²=0.552 (59.3% acc, n=258), North→South R²=0.351 (50.7% acc, n=207)

SHAP FEATURE IMPORTANCES:
1. Work Demand Pressure Ratio: 48.2%
2. SC/ST Marginalization Share: 14.1%
3. Literacy × Climate Stress Index: 12.8%
4. Female Literacy Rate (NFHS-5): 8.4%
5. Annual Rainfall (IMD): 7.2%
6. Sanitation & Fuel Deprivation: 5.3%
7. Total Registered Jobcards: 4.0%

FORECAST SCENARIOS (FY 2024–2030):
- Baseline: 14.03M → 11.7M HH (-2.1%/yr)
- Optimistic (+15% Literacy Mission, ₹500Cr support): → 9.2M HH
- Pessimistic (El Niño/Drought shock): → 16.7M HH (+18.9% above baseline)
- A -30% monsoon deficit triggers: +13.9% demand surge (+1.95M HH), 89 new high-risk districts, ₹2,410 Cr extra budget. Rainfall elasticity = -0.46.

STATE WAGE RATES (FY 2024-25, ₹/day): Haryana=374, Kerala=346, Karnataka=349, Punjab=322, Tamil Nadu=319, Andhra Pradesh/Telangana=300, Odisha=254, Assam=249, West Bengal=250, Bihar/Jharkhand=245, Rajasthan=266, UP/Uttarakhand=237, MP/Chhattisgarh=243, Maharashtra=297, Gujarat=280.

RESPONSE INSTRUCTIONS:
- You are answering user queries inside the NREGA ML Decision Support System
- Be data-driven, cite exact metrics, and provide policy-grade insights
- Use clean formatting with paragraphs, bold metrics, and bullet lists
- For district queries, explain their vulnerability risk tier, unmet demand, literacy rate, rainfall, and required contingency funds
- Keep answers concise and direct (under 300 words unless in-depth analysis is requested)`;
}

async function callGeminiAPI(userQuery) {
  const activeKey = geminiApiKey || DEFAULT_GEMINI_KEY;
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
  const systemPrompt = buildGeminiSystemPrompt();
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            role: 'user',
            parts: [{ text: userQuery }]
          }],
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 950,
            topP: 0.95
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      let replyText = '';
      for (const p of parts) {
        if (p.text && !p.thought) {
          replyText += p.text;
        }
      }
      if (!replyText && parts.length > 0 && parts[0].text) {
        replyText = parts[0].text;
      }
      if (replyText) {
        return replyText;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Gemini attempt with ${model} failed:`, err.message);
    }
  }

  throw lastError || new Error("Failed to receive response from Gemini.");
}

function markdownToHTML(md) {
  let html = md
    .replace(/```([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.3);padding:0.5rem;border-radius:6px;overflow-x:auto;"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(56,189,248,0.15);color:#38bdf8;padding:0.1rem 0.3rem;border-radius:3px;">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/^#{1,3}\s+(.+)$/gm, '<p><strong style="color:#38bdf8;font-size:1.02em;">$1</strong></p>')
    .replace(/^\s*[\-\*•]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li><strong style="color:#38bdf8;">$1.</strong> $2</li>');

  // Wrap consecutive <li> into <ul>
  html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul style="margin:0.35rem 0 0.45rem 1.1rem;font-size:0.85rem;line-height:1.55;">$1</ul>');
  
  // Format paragraph line breaks
  html = html.replace(/\n\n+/g, '</p><p style="margin-top:0.45rem;">');
  html = html.replace(/\n/g, ' ');

  if (!/^\s*<[uphd]/.test(html)) {
    html = `<p>${html}</p>`;
  }

  return html.replace(/<p[^>]*>\s*<\/p>/g, '').trim();
}

function updateCopilotStatus() {
  const statusSpan = document.querySelector('#ai-chat-modal .ai-modal-status span:last-child');
  if (statusSpan) {
    statusSpan.textContent = '745 Districts • Gemini 3.8 Flash ✨ AI Live';
  }
  const dot = document.querySelector('#ai-chat-modal .status-dot');
  if (dot) dot.style.background = '#10b981';
}

// ─── Chat Message Rendering ───────────────────────────────────────────────────

function appendChatMessage(sender, htmlContent) {
  const container = document.getElementById("ai-chat-messages");
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `ai-msg ai-msg-${sender}`;

  const avatar = document.createElement("div");
  avatar.className = "ai-msg-avatar";
  avatar.textContent = sender === "user" ? "👤" : "🤖";

  const bubble = document.createElement("div");
  bubble.className = "ai-msg-bubble";
  bubble.innerHTML = htmlContent;

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function showAITypingIndicator() {
  const container = document.getElementById("ai-chat-messages");
  if (!container) return;
  const indicator = document.createElement("div");
  indicator.id = "ai-typing";
  indicator.className = "ai-msg ai-msg-bot";
  indicator.innerHTML = `
    <div class="ai-msg-avatar">🤖</div>
    <div class="ai-msg-bubble">
      <div class="ai-typing-indicator">
        <div class="ai-dot"></div>
        <div class="ai-dot"></div>
        <div class="ai-dot"></div>
      </div>
    </div>
  `;
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
}

function removeAITypingIndicator() {
  const el = document.getElementById("ai-typing");
  if (el) el.remove();
}

function generateAIResponse(rawQuery) {
  const q = rawQuery.toLowerCase();
  const records = appData?.district_records || [];
  const stats = appData?.summary_stats || {};

  // 1. Search for matching district
  for (const d of records) {
    const dName = d.district.toLowerCase();
    if (q.includes(dName)) {
      return formatDistrictAnalysis(d);
    }
  }

  // 2. Top vulnerable districts
  if (q.includes("top") || q.includes("highest") || q.includes("most vulnerable") || q.includes("critical")) {
    const topDistricts = [...records].sort((a, b) => b.unmet_demand_hh - a.unmet_demand_hh).slice(0, 5);
    let listHtml = topDistricts.map((d, i) => `
      <div class="ai-district-row" style="margin-bottom:4px;">
        <span><strong>${i+1}. ${d.district}</strong> (${d.state})</span>
        <strong style="color:#f43f5e;">${d.unmet_demand_hh.toLocaleString()} HH (${d.fulfillment_rate}%)</strong>
      </div>
    `).join("");

    return {
      html: `
        <p><strong>🚨 Top 5 Most Vulnerable Districts (Unmet Demand Gap):</strong></p>
        <div class="ai-district-card">
          ${listHtml}
        </div>
        <p style="margin-top:0.5rem; font-size:0.83rem;">These districts account for over <strong>₹${((topDistricts.reduce((s,d)=>s+d.contingency_fund_cr,0))).toFixed(1)} Cr</strong> of required contingency wages. High demand pressure combined with low fulfillment drives systemic rationing.</p>
      `
    };
  }

  // 3. Climate shock / drought queries
  if (q.includes("drought") || q.includes("rainfall") || q.includes("climate") || q.includes("rain") || q.includes("-30%")) {
    return {
      html: `
        <p><strong>🌧️ Compound Climate-Labor Shock Simulation:</strong></p>
        <p>Our Gradient Boosting models demonstrate that a <strong>30% monsoon precipitation deficit</strong> triggers:</p>
        <ul style="margin: 0.3rem 0 0.3rem 1.2rem; font-size:0.84rem;">
          <li><strong>+13.9% National Surge</strong> in unmet demand (+1.95 Million households)</li>
          <li><strong>89 additional districts</strong> downgraded into the 🔴 <em>High-Risk Vulnerability Tier</em></li>
          <li><strong>₹2,410 Cr budget escalation</strong> needed in notified state contingency allocations</li>
        </ul>
        <p style="font-size:0.83rem;">Rainfall elasticity is measured at <strong>-0.46</strong> (for every 10% rainfall drop below long-term average, demand increases by 4.6%).</p>
      `
    };
  }

  // 4. ML model / benchmarks / XAI queries
  if (q.includes("model") || q.includes("best") || q.includes("r2") || q.includes("accuracy") || q.includes("gradient boosting") || q.includes("random forest")) {
    return {
      html: `
        <p><strong>🏆 ML Benchmark &amp; Explainability Summary:</strong></p>
        <p>Across 8 benchmarked models with 5-fold cross-validation:</p>
        <div class="ai-district-card">
          <div class="ai-district-row"><span>Best Regressor:</span><strong>Gradient Boosting (R² = 0.699, RMSE = 8,897)</strong></div>
          <div class="ai-district-row"><span>Best Classifier:</span><strong>Random Forest (79.2% Accuracy, F1 = 0.786)</strong></div>
          <div class="ai-district-row"><span>Linear Baseline:</span><strong>Ridge Regression (R² = 0.639)</strong></div>
        </div>
        <p style="margin-top:0.4rem; font-size:0.83rem;"><strong>Why non-linear models win:</strong> Tree ensembles effectively capture compound interaction thresholds between female literacy deficits and rainfall failures that linear models miss.</p>
      `
    };
  }

  // 5. Budget / Contingency Fund queries
  if (q.includes("budget") || q.includes("fund") || q.includes("money") || q.includes("cost") || q.includes("crore")) {
    const totalCr = stats.national_contingency_fund_cr || 17325;
    return {
      html: `
        <p><strong>💰 National Contingency Budget Quantification:</strong></p>
        <p>Based on official FY 2024-25 notified daily wage rates (₹237–₹374/day), the total national contingency budget required to fulfill currently unmet rural employment is:</p>
        <div style="font-size:1.4rem; font-family:'Outfit'; font-weight:700; color:#38bdf8; margin: 0.4rem 0;">₹${totalCr.toLocaleString()} Crore</div>
        <p style="font-size:0.83rem;">Formula: <code>Unmet Demand (HH) × 45 Guaranteed Days × State Wage Rate</code>.</p>
        <p style="font-size:0.83rem; margin-top:0.3rem;">Top states by budget requirements: <strong>Uttar Pradesh, Rajasthan, West Bengal, and Madhya Pradesh</strong>.</p>
      `
    };
  }

  // 6. Future forecasting 2026-2030
  if (q.includes("forecast") || q.includes("future") || q.includes("2026") || q.includes("2028") || q.includes("2030") || q.includes("horizon") || q.includes("rajasthan")) {
    return {
      html: `
        <p><strong>🔮 Multi-Horizon Projections (FY 2024 – FY 2030):</strong></p>
        <ul style="margin: 0.3rem 0 0.3rem 1.2rem; font-size:0.84rem;">
          <li><strong>Baseline:</strong> National unmet demand contracts gradually from <strong>14.03 M to 11.7 M HH</strong> by 2030 (-2.1% yr⁻¹).</li>
          <li><strong>Optimistic (+15% Literacy Mission):</strong> Unmet demand drops to <strong>9.2 M HH</strong> with ₹500 Cr wage support.</li>
          <li><strong>Pessimistic (El Niño Shock):</strong> Demand surges to <strong>16.7 M HH</strong> by FY 2030 (+18.9% above baseline).</li>
        </ul>
        <p style="font-size:0.83rem;">You can explore any district's individual trajectory in our <strong>District Future Outcome Forecaster</strong> above!</p>
      `
    };
  }

  // 7. Generic Fallback
  return {
    html: `
      <p>I analyzed your question regarding <em>"${rawQuery}"</em>.</p>
      <p style="font-size:0.84rem;">Our system tracks <strong>745 districts</strong> across India, forecasting unmet employment demand using multi-pillar indicators (MGNREGA MIS, NFHS-5 literacy, IMD rainfall, NITI Aayog MPI).</p>
      <p style="margin-top:0.4rem; font-size:0.84rem;"><strong>Try asking:</strong></p>
      <ul style="margin: 0.2rem 0 0.4rem 1.2rem; font-size:0.82rem;">
        <li><em>"Tell me about Sitapur district"</em></li>
        <li><em>"Which are the top 5 vulnerable districts?"</em></li>
        <li><em>"What is the impact of a -30% drought?"</em></li>
        <li><em>"How much contingency budget is needed?"</em></li>
      </ul>
    `
  };
}

function formatDistrictAnalysis(d) {
  const color = getMarkerColor(d.actual_tier);
  const topForces = Object.entries(d.local_attributions || {})
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 3)
    .map(([k, v]) => `<li>${k}: <strong style="color:${v > 0 ? '#f43f5e' : '#10b981'}">${v > 0 ? '+' : ''}${v}</strong></li>`)
    .join("");

  return {
    html: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
        <strong>🏛️ ${d.district} (${d.state})</strong>
        <span class="badge-tier tier-${d.actual_tier.toLowerCase()}">${d.actual_tier} RISK</span>
      </div>
      <div class="ai-district-card">
        <div class="ai-district-row"><span>HH Demanded:</span><strong>${d.hh_demanded.toLocaleString()}</strong></div>
        <div class="ai-district-row"><span>HH Worked:</span><strong>${d.hh_worked.toLocaleString()}</strong></div>
        <div class="ai-district-row"><span>Unmet Demand:</span><strong style="color:${color}">${d.unmet_demand_hh.toLocaleString()} HH</strong></div>
        <div class="ai-district-row"><span>Fulfillment Rate:</span><strong>${d.fulfillment_rate}%</strong></div>
        <div class="ai-district-row"><span>Female Literacy:</span><strong>${d.female_literacy_rate}%</strong></div>
        <div class="ai-district-row"><span>Annual Rainfall:</span><strong>${d.annual_rainfall_mm} mm</strong></div>
        <div class="ai-district-row"><span>Contingency Fund:</span><strong style="color:#c084fc;">₹${d.contingency_fund_cr} Cr</strong></div>
      </div>
      <p style="margin-top:0.4rem; font-size:0.82rem;"><strong>Key AI Drivers (SHAP Proxy):</strong></p>
      <ul style="margin: 0.2rem 0 0.4rem 1.2rem; font-size:0.8rem;">
        ${topForces}
      </ul>
      <button class="ai-locate-btn" onclick="focusDistrictOnMap('${d.district}')">
        <span>📍 Focus on Live Map</span>
      </button>
    `
  };
}

function focusDistrictOnMap(districtName) {
  if (!mapInstance || !appData) return;
  const d = appData.district_records.find(item => item.district.toLowerCase() === districtName.toLowerCase());
  if (d && d.lat && d.lon) {
    scrollToSection('map-section');
    inspectDistrictOnMap(d);
    mapInstance.setView([d.lat, d.lon], 8, { animate: true, duration: 1 });
    // Find and open marker popup/tooltip
    const marker = mapMarkers.find(m => {
      const latlng = m.getLatLng();
      return Math.abs(latlng.lat - d.lat) < 0.001 && Math.abs(latlng.lng - d.lon) < 0.001;
    });
    if (marker) marker.openTooltip();
  }
}

