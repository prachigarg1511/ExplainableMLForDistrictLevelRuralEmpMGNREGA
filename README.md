# 🌾 Explainable ML for District-Level Rural Employment Vulnerability & Unmet MGNREGA Demand Forecasting

<p align="center">
  <a href="https://explainablemlfordistrictlevelemp.netlify.app/" target="_blank"><img src="https://img.shields.io/badge/Live%20Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python Version" />
  <img src="https://img.shields.io/badge/Coverage-745%20Districts-success?style=for-the-badge&logo=googlemaps&logoColor=white" alt="Districts Covered" />
  <img src="https://img.shields.io/badge/States%20%26%20UTs-34-orange?style=for-the-badge" alt="States Covered" />
  <img src="https://img.shields.io/badge/ML%20Engine-Quantile%20GBR%20%2B%20RF-blueviolet?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="ML Engine" />
  <img src="https://img.shields.io/badge/Explainability-SHAP%20Proxy%20Forces-06B6D4?style=for-the-badge" alt="XAI" />
  <img src="https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <b>A Multimodal Econometric & Explainable Machine Learning Framework for Asymmetric Labor Demand Prediction, Spatial Risk Profiling, and Contingency Fiscal Allocation across Rural India.</b>
</p>

<p align="center">
  <a href="https://explainablemlfordistrictlevelemp.netlify.app/" target="_blank"><b>🌐 Live Dashboard (Netlify)</b></a> •
  <a href="#-key-highlights--innovations">Key Highlights</a> •
  <a href="#-data-architecture--5-pillar-fusion">Data Fusion</a> •
  <a href="#-machine-learning-benchmarks">Model Benchmarks</a> •
  <a href="#-explainable-ai-xai--policy-signals">Explainability</a> •
  <a href="#-cross-region-transferability-experiment">Spatial Transferability</a> •
  <a href="#-interactive-web-decision-support-system">Web Dashboard</a> •
  <a href="#-team--contributors">Team</a> •
  <a href="#-quickstart--reproduction">Quickstart</a>
</p>

> [!TIP]
> 🌐 **Live Web Application**: Explore the interactive Decision-Support System with Leaflet maps, 90% quantile forecasting bands, and what-if policy simulators live at **[explainablemlfordistrictlevelemp.netlify.app](https://explainablemlfordistrictlevelemp.netlify.app/)**.

---

## 📌 Executive Summary

Under the **Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)**, over **83.8 million rural households** demand work annually. However, administrative capacity constraints, delayed funds, and localized climate shocks leave **over 14.02 million households with unmet employment demand** annually, leaving a national average fulfillment rate of **83.3%**.

This project develops an end-to-end, empirical **Explainable Machine Learning (XAI) Decision-Support System** trained on authentic government datasets across **745 districts** in **34 states and union territories**. It moves beyond conventional point estimates by formulating:
1. **Quantile Regression Ensembles ($P_{05}, P_{50}, P_{95}$)** for asymmetric safety-net budgeting.
2. **Multi-class Vulnerability Risk Classification** (High, Medium, Low risk tiers).
3. **Local Feature Force Attributions** explaining the exact root causes of vulnerability for every single district.
4. **State-specific Contingency Wage Budgeting** calculating district-level fiscal buffers in ₹ Crores.

```
                                  DATA FUSION ENGINE
┌─────────────────────────┐   ┌──────────────────────────┐   ┌─────────────────────────┐
│     MGNREGA MIS         │   │   NFHS-5 Human Capital   │   │  IMD Gridded Rainfall   │
│  740 Districts Official │   │ Female Literacy, School  │   │  Jan-Dec & Monsoon Precip│
└────────────┬────────────┘   └─────────────┬────────────┘   └────────────┬────────────┘
             │                              │                             │
             └──────────────────────┐       │       ┌─────────────────────┘
                                    ▼       ▼       ▼
                               ┌─────────────────────────┐
                               │  LGD Master Crosswalk   │
                               │  745 Districts Unified  │
                               └────────────┬────────────┘
                                            │
                                            ▼
                                PREDICTIVE & XAI ENGINE
              ┌─────────────────────────────┴─────────────────────────────┐
              ▼                                                           ▼
 ┌───────────────────────────┐                               ┌───────────────────────────┐
 │ Quantile GBR (P05/P50/P95)│                               │ Random Forest Classifier  │
 │ Unmet Demand Forecasting  │                               │ Vulnerability Risk Tiers  │
 │ R² = 0.700 | RMSE = 8,896 │                               │ Accuracy = 79.2% | F1=0.79│
 └─────────────┬─────────────┘                               └─────────────┬─────────────┘
               │                                                           │
               └────────────────────────────┬──────────────────────────────┘
                                            │
                                            ▼
 ┌───────────────────────────────────────────────────────────────────────────────────────┐
 │                     EXPLAINABLE DECISION SUPPORT DASHBOARD                            │
 │  • Interactive India Leaflet Map   • SHAP Local Forces   • 45-day Contingency Budgets │
 └───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Highlights & Innovations

- **🛡️ 90% Prediction Intervals (Quantile GBR)**: Replaces single-number forecasts with lower ($P_{05}$), median ($P_{50}$), and upper-bound crisis ($P_{95}$) predictions to prevent under-allocation in severe drought years.
- **🔍 Granular Explainability (XAI)**: Generates district-specific force attributions across Work Demand Pressure, SC/ST Marginalization, Rainfall Deficits, and Female Literacy Gaps.
- **🔄 Cross-Regional Transferability (Out-of-Domain Gap 15)**: Empirically stress-tests models trained on Peninsular India (South & West) when transferred to Gangetic/Arid belts (North & Central) and vice versa.
- **💰 Fiscal Policy & Contingency Wage Estimation**: Connects machine learning outputs directly with Ministry of Rural Development notified FY 2024–25 daily wage rates (ranging from ₹237 in UP to ₹374 in Haryana) to forecast a **₹17,324.5 Crore** national contingency reserve requirement.
- **🗺️ Spatial Harmonization**: Solves district boundary splits using official Ministry of Panchayati Raj **Local Government Directory (LGD)** keys.

---

## 📊 Data Architecture & 5-Pillar Fusion

The integrated panel spans **745 districts** fused across five authentic administrative and meteorological pillars:

| Pillar | Dataset Source | Granularity | Key Features Extracted |
| :--- | :--- | :---: | :--- |
| **1. MGNREGA Demand & Supply** | Ministry of Rural Development (MoRD) / Harvard Dataverse | 740 Districts | `hh_demanded`, `hh_worked`, `unmet_demand_hh`, `fulfillment_rate`, `jobcards_total`, `jobcards_sc`, `jobcards_st` |
| **2. Human Capital & Literacy** | MoHFW / IIPS National Family Health Survey (NFHS-5) | 707+ Districts | `female_literacy_rate`, `female_school_attendance_pct`, `female_10plus_years_schooling_pct` |
| **3. Socioeconomic Deprivation** | NITI Aayog National Multidimensional Poverty Index (MPI) | 707+ Districts | `electricity_access_pct`, `improved_sanitation_pct`, `clean_cooking_fuel_pct` |
| **4. Agro-Climatic Shocks** | India Meteorological Department (IMD) Pune | 641 Districts | `annual_rainfall_mm`, `monsoon_rainfall_mm` (Jun-Sep), Winter/Post-Monsoon anomalies |
| **5. Spatial & Governance** | Ministry of Panchayati Raj Local Government Directory (LGD) | 763 Districts | Official `lgd_district_code`, `census_2011_code`, GIS Latitude & Longitude centroids |

### Engineered Analytical Features
- **Work Demand Pressure Ratio**: $\frac{\text{HH Demanded}}{\text{Registered Jobcards} + 1}$
- **SC/ST Marginalization Share**: $\frac{\text{Jobcards}_{SC} + \text{Jobcards}_{ST}}{\text{Jobcards}_{Total} + 1}$
- **Literacy $\times$ Climate Stress Index**: $\frac{(100 - \text{Female Literacy}) \times 100}{\text{Annual Rainfall (mm)} + 50}$
- **Human Capital Deprivation Index**: $0.40(100 - \text{Literacy}) + 0.30(100 - \text{Sanitation}) + 0.30(100 - \text{Clean Fuel})$

---

## 🏆 Machine Learning Benchmarks

### 1. Regression: Unmet Household Demand (`unmet_demand_hh`)
Evaluated via 5-Fold Cross Validation on 745 districts:

| Model | $R^2$ Score | 5-Fold CV $R^2$ ($\mu \pm \sigma$) | RMSE (HH) | MAE (HH) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Gradient Boosting Regressor (GBR)** | **0.6988** | **0.7001 ± 0.059** | **8,896.8** | **5,519.2** | ⭐ **Best Regressor** |
| **Random Forest Regressor** | 0.6940 | 0.6964 ± 0.036 | 8,967.5 | 5,484.2 | Robust Ensemble |
| **Ridge Regression (L2)** | 0.6394 | 0.6096 ± 0.048 | 9,735.6 | 7,000.3 | Linear Baseline |
| **Decision Tree Regressor** | 0.5948 | 0.5396 ± 0.154 | 10,320.1 | 6,540.5 | Baseline |

### 2. Multi-Tier Classification: Employment Vulnerability Tier
Classes: **High Risk** (Fulfillment $< 80\%$ or Unmet $> 25\text{k}$), **Medium Risk** ($80\% - 92\%$), **Low Risk** ($\ge 92\%$):

| Model | Test Accuracy | 5-Fold CV Acc ($\mu \pm \sigma$) | Precision | F1-Score | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Classifier** | **79.19%** | **72.89% ± 2.8%** | **0.7912** | **0.7861** | ⭐ **Best Classifier** |
| **Support Vector Classifier (SVC)** | 77.18% | 71.28% ± 3.1% | 0.7710 | 0.7687 | Non-linear Kernel |
| **Gradient Boosting Classifier** | 76.51% | 73.29% ± 2.9% | 0.7645 | 0.7637 | High Generalization |
| **Logistic Regression** | 69.13% | 68.46% ± 3.4% | 0.6850 | 0.6803 | Baseline |

---

## 💡 Explainable AI (XAI) & Policy Signals

### Global Feature Importance Hierarchy

```
Work Demand Pressure Ratio    ████████████████████████ 48.2%
SC/ST Marginalization Share   ███████ 14.1%
Literacy × Climate Stress     ██████ 12.8%
Female Literacy Rate (NFHS-5) ████ 8.4%
Annual Rainfall (IMD)         ████ 7.2%
Sanitation & Fuel Deprivation ███ 5.3%
Total Registered Jobcards     ██ 4.0%
```

### Local SHAP Force Decompositions
For every district, the model decomposes prediction forces into positive push factors (worsening distress) and negative buffer factors (resilience):
- **Work Demand Outstripping Absorption**: Explains $\approx 48\%$ of high unmet demand in Eastern Uttar Pradesh, Northern Bihar, and Southern Rajasthan.
- **Compounding Climate-Human Capital Shocks**: In drought-prone districts with low female literacy (e.g., Bundelkhand and Marathwada), unmet demand surges disproportionately, proving that climate shocks hit educationally marginalized rural economies hardest.

---

## 🌐 Cross-Region Transferability Experiment

To test whether models trained in one agro-ecological zone can generalize to structurally distinct economies, India was partitioned into macro-regions:
- **South & West (Peninsular)**: Maharashtra, Gujarat, Karnataka, Tamil Nadu, Andhra Pradesh, Telangana, Kerala
- **North & Central (Heartland)**: Uttar Pradesh, Bihar, Madhya Pradesh, Rajasthan, Chhattisgarh, Jharkhand

| Training Domain | Target Testing Domain | Out-of-Domain $R^2$ | Out-of-Domain Accuracy | Key Economic Finding |
| :--- | :--- | :---: | :---: | :--- |
| **South & West** | **North & Central** | **0.552** | **59.3%** | South-West models underestimate high-volume seasonal distress in Gangetic floodplains. |
| **North & Central** | **South & West** | **0.518** | **61.4%** | Northern models overpredict unmet demand in peninsular states with diversified non-farm work. |

*Conclusion: National uniform policies fail; regional calibrators are essential for state-level MGNREGA planning.*

---

## 🗺️ Interactive Web Decision Support System

> 🚀 **Live Production Deployment**: **[https://explainablemlfordistrictlevelemp.netlify.app/](https://explainablemlfordistrictlevelemp.netlify.app/)**
>
> *Hosted live on Netlify for seamless public access, real-time spatial exploration of all 745 districts, and instantaneous what-if policy simulations without needing local python setup.*

The repository includes a production-ready, zero-dependency web dashboard located in [`web/`](./web):

```
web/
├── index.html       # Full responsive decision-support cockpit (HTML5, Vanilla CSS)
├── style.css        # Premium dark glassmorphism design system
├── app.js           # Interactive state manager, Leaflet geospatial renderer, Chart.js engine
└── data/
    └── models_data.json  # Serialized 745 district profiles, quantiles, and SHAP forces
```

### Dashboard Capabilities:
- 🗺️ **Geospatial Risk Map**: Color-coded district markers with interactive popups showing actual vs. predicted unmet demand, fulfillment rate, rainfall, and wage rates.
- 📈 **Quantile Interval Viewer**: Shows 90% confidence bands ($P_{05} \leftrightarrow P_{95}$) for each district.
- 🔮 **What-If Policy Simulator**: Sliders to simulate rainfall deficits ($-10\%$ to $-40\%$) or female literacy gains and watch real-time adjustments to projected unmet demand.
- 🤖 **Interactive AI Policy Copilot**: District deep-dive assistant answering inquiries regarding fiscal allocations and priority intervention needs.

---

## 📁 Repository Structure

```
ExplainableMLForDistrictLevelRuralEmpMGNREGA/
├── data/
│   ├── raw/
│   │   ├── mgnrega/
│   │   │   ├── mgnrega_district_employment_demand_official.csv  # 740 districts administrative metrics
│   │   │   └── mgnrega_r5_1_2024_raw.csv.gz                    # Raw MIS R5.1 download records
│   │   ├── education_udise/
│   │   │   ├── nfhs5_district_indicators_official.csv           # NFHS-5 factsheet indicators
│   │   │   └── nfhs5_district_literacy_schooling.csv            # Female literacy & schooling rates
│   │   ├── socioeconomic_mpi/
│   │   │   └── district_multidimensional_deprivation_official.csv # NITI Aayog MPI indicators
│   │   ├── climate_imd/
│   │   │   └── imd_district_monthly_rainfall_official.csv       # IMD monthly & monsoon rainfall
│   │   └── spatial_lgd/
│   │       ├── lgd_district_master_official.csv                 # Official LGD crosswalk codes
│   │       └── district_coordinates.csv                         # Lat/Lon centroids for mapping
│   └── processed/
│       └── india_district_rural_vulnerability_actual.csv        # Master merged 745-district panel
│
├── scripts/
│   ├── download_and_curate_real_datasets.py                     # Ingestion pipeline from public portals
│   ├── build_real_district_panel.py                             # Multi-pillar LGD harmonization script
│   ├── train_and_evaluate_models.py                             # ML training, quantiles, XAI, and evaluation
│   └── generate_viva_pdf.py                                     # Academic viva-voce PDF report generator
│
├── web/                                                         # Interactive Decision Support System
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── data/
│       └── models_data.json
│
├── datasets_inventory_and_pipeline.md                           # Research blueprint & variable dictionary
├── MGNREGA_ML_Project_Viva_Voce_Comprehensive_Guide.pdf         # Comprehensive viva-voce defense manual
├── mgnrega-web-deploy.zip                                       # Portable deployment archive
└── README.md                                                    # Project documentation
```

---

## 🛠️ Quickstart & Reproduction

### 1. Clone the Repository
```bash
git clone https://github.com/prachigarg1511/ExplainableMLForDistrictLevelRuralEmpMGNREGA.git
cd ExplainableMLForDistrictLevelRuralEmpMGNREGA
```

### 2. Install Dependencies
```bash
pip install numpy pandas scikit-learn requests reportlab
```

### 3. Rebuild Data Panel & Retrain Models
```bash
# 1. Download & curate raw sources
python scripts/download_and_curate_real_datasets.py

# 2. Merge into unified master district panel
python scripts/build_real_district_panel.py

# 3. Train models, compute quantiles, SHAP attributions & export JSON
python scripts/train_and_evaluate_models.py
```

### 4. Launch the Web Dashboard Locally
You can launch the dashboard with any static server:
```bash
# Using Python built-in HTTP server:
cd web
python -m http.server 8000
```
Open **`http://localhost:8000`** in your browser.

---

## 👥 Research & Development Team

<table align="center" width="100%">
  <tr>
    <td align="center" width="25%" valign="top">
      <a href="https://github.com/prachigarg1511">
        <img src="https://github.com/prachigarg1511.png?size=140" width="95px;" alt="Prachi Garg" style="border-radius:50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"/><br />
        <br /><b>Prachi Garg</b>
      </a>
      <br />
      <span style="display:inline-block; margin-top:4px; font-size:0.78rem; padding:2px 8px; border-radius:12px; background:rgba(6,182,212,0.15); color:#06b6d4; font-weight:600;"> Project Lead & Principal ML Architect</span>
      <br />
      <a href="https://github.com/prachigarg1511"><code>@prachigarg1511</code></a>
      <br /><br />
      <div align="left" style="font-size:0.78rem; line-height:1.4;">
        • Overarching system architecture & research direction<br/>
        • End-to-end ML modeling (Quantile GBR, RF, XAI forces)<br/>
        • 5-Pillar multimodal data fusion & LGD harmonization<br/>
        • Cross-regional transferability experiment (GAP 15)<br/>
        • Interactive Web Decision Support System & Netlify deployment
      </div>
    </td>
    <td align="center" width="25%" valign="top">
      <a href="https://github.com/Sanjna05x">
        <img src="https://github.com/Sanjna05x.png?size=140" width="95px;" alt="Sanjna" style="border-radius:50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"/><br />
        <br /><b>Sanjna</b>
      </a>
      <br />
      <span style="display:inline-block; margin-top:4px; font-size:0.78rem; padding:2px 8px; border-radius:12px; background:rgba(56,189,248,0.15); color:#38bdf8; font-weight:600;">⚙️ ML & Data Engineering Associate</span>
      <br />
      <a href="https://github.com/Sanjna05x"><code>@Sanjna05x</code></a>
      <br /><br />
      <div align="left" style="font-size:0.78rem; line-height:1.4;">
        • Dataset curation, cleaning & ingestion pipelines<br/>
        • Feature engineering validation & consistency checks<br/>
        • Model evaluation benchmarking & test support<br/>
        • Pipeline testing and technical verification
      </div>
    </td>
    <td align="center" width="25%" valign="top">
      <a href="https://github.com/sanchi2559">
        <img src="https://github.com/sanchi2559.png?size=140" width="95px;" alt="Sanchi Katyal" style="border-radius:50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"/><br />
        <br /><b>Sanchi Katyal</b>
      </a>
      <br />
      <span style="display:inline-block; margin-top:4px; font-size:0.78rem; padding:2px 8px; border-radius:12px; background:rgba(168,85,247,0.15); color:#c084fc; font-weight:600;">📝 Research & Documentation Specialist</span>
      <br />
      <a href="https://github.com/sanchi2559"><code>@sanchi2559</code></a>
      <br /><br />
      <div align="left" style="font-size:0.78rem; line-height:1.4;">
        • Academic paper compilation & research manuscript editing<br/>
        • Project synopsis preparation & thesis alignment<br/>
        • Comprehensive project reporting and documentation<br/>
        • Viva-voce guide contribution and content review
      </div>
    </td>
    <td align="center" width="25%" valign="top">
      <a href="https://github.com/parvsharma1892007-ai">
        <img src="https://github.com/parvsharma1892007-ai.png?size=140" width="95px;" alt="Parv Sharma" style="border-radius:50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"/><br />
        <br /><b>Parv Sharma</b>
      </a>
      <br />
      <span style="display:inline-block; margin-top:4px; font-size:0.78rem; padding:2px 8px; border-radius:12px; background:rgba(168,85,247,0.15); color:#c084fc; font-weight:600;">📝 Research & Documentation Specialist</span>
      <br />
      <a href="https://github.com/parvsharma1892007-ai"><code>@parvsharma1892007-ai</code></a>
      <br /><br />
      <div align="left" style="font-size:0.78rem; line-height:1.4;">
        • Research paper manuscript drafting & literature review<br/>
        • Project synopsis creation & academic report structuring<br/>
        • Rural policy context & MGNREGA governance synthesis<br/>
        • Technical documentation and academic formatting
      </div>
    </td>
  </tr>
</table>

---

## 📜 Citation & Academic Use

If you utilize this pipeline, dataset panel, or model architecture in your research, please cite:

```bibtex
@misc{garg2026mgnrega,
  author = {Prachi Garg},
  title = {Explainable Machine Learning for District-Level Rural Employment Vulnerability and Unmet MGNREGA Demand Forecasting in India},
  year = {2026},
  publisher = {GitHub},
  journal = {GitHub repository},
  howpublished = {\url{https://github.com/prachigarg1511/ExplainableMLForDistrictLevelRuralEmpMGNREGA}}
}
```

---

## 📄 License

This project is open-source and distributed under the **MIT License**. Official government datasets are sourced from open data portals ([data.gov.in](https://data.gov.in), [nrega.nic.in](https://nrega.nic.in), [imdpune.gov.in](https://imdpune.gov.in), and [rchiips.org](https://rchiips.org/nfhs)) under the National Data Sharing and Accessibility Policy (NDSAP).
