# Comprehensive Dataset Blueprint: District-Level Rural Employment Vulnerability & Unmet MGNREGA Demand Forecasting

This document details the exact, latest datasets required to build the integrated predictive machine learning framework across the 5 core pillars:
1. **MGNREGA Administrative & Demand-Supply Indicators**
2. **Labour Market & Unemployment Indicators**
3. **Education & Dynamic Literacy Indicators**
4. **Socioeconomic & Deprivation Indicators**
5. **Agro-Climatic & Environmental Shock Indicators**

It also provides the **District Harmonization Protocol (LGD mapping)** and the **Panel Data Schema**.

---

## 1. MGNREGA Administrative & Operational Indicators

*These provide the target variables (Unmet Demand, Employment Fulfillment Ratio) and core administrative features.*

| Attribute | Details |
|---|---|
| **Dataset Name** | Mahatma Gandhi NREGA District MIS Administrative Reports (Reports R1.1, R1.2, R2, R5) |
| **Source / Portal** | Ministry of Rural Development (MoRD) — [nrega.nic.in](https://nrega.nic.in) & [Open Government Data (data.gov.in)](https://data.gov.in) |
| **Latest Available Coverage** | **FY 2017–18 through FY 2024–25 (and ongoing FY 2025–26)** |
| **Temporal Granularity** | Monthly (aggregated from daily/weekly work demand records) |
| **Spatial Granularity** | District level (~730+ districts across 28 states and UTs) |
| **Key Variables to Extract** | - **Demand:** Total households demanding employment (`HH_demanded`), Total persons demanding employment (`Ind_demanded`)<br>- **Supply/Allocated:** Total households offered work (`HH_offered`), Total households worked (`HH_worked`)<br>- **Volume:** Total person-days generated (`Total_Persondays`), Women person-days generated (`Women_Persondays`)<br>- **Inclusion:** Scheduled Caste (SC) person-days, Scheduled Tribe (ST) person-days, Differently-abled person-days<br>- **Financial:** Total expenditure, Total wage payment, Average wage rate per day per person, Delayed wage compensation paid<br>- **Work Completion:** Total works taken up, Total works completed, Agricultural/water conservation works ratio |
| **Derived Target Variables** | 1. **Unmet Employment Demand:** `Unmet_Demand = HH_demanded - HH_worked`<br>2. **Fulfillment Ratio:** `Fulfillment_Rate = HH_worked / (HH_demanded + eps)`<br>3. **Vulnerability Risk Category:** Multi-class classification (Low: Fulfillment $\ge 90\%$, Medium: $75\% - 89\%$, High: $< 75\%$ or Unmet Demand $> \mu + 1.5\sigma$) |

---

## 2. Labour Market & Unemployment Indicators

*Captures broader rural economic health and private-sector distress.*

| Attribute | Details |
|---|---|
| **Primary Dataset** | Periodic Labour Force Survey (PLFS) — Annual Reports & Unit-Level Microdata |
| **Source / Portal** | National Sample Survey Office (NSSO), Ministry of Statistics and Programme Implementation (MoSPI) — [microdata.gov.in](https://microdata.gov.in) |
| **Latest Available Coverage** | **PLFS July 2023–June 2024 (Latest Annual Release)** + historical rounds back to 2017–18 |
| **Spatial Granularity** | NSS Region / District level (PLFS unit-level microdata has district codes; district-level aggregates can be calculated using Small Area Estimation (SAE) or NSS-region weight aggregation) |
| **Temporal Granularity** | Annual (for rural district estimation) & Quarterly bulletins (state/urban level for macroeconomic trends) |
| **Key Variables to Extract** | - **Unemployment Rate (UR):** Rural male UR, Rural female UR, Total rural UR (Usual Principal & Subsidiary Status - UPSS & Current Weekly Status - CWS)<br>- **Labour Force Participation Rate (LFPR):** Rural female LFPR, Rural male LFPR<br>- **Worker Population Ratio (WPR):** Proportion of working-age population employed<br>- **Status of Employment:** Percentage of casual labour vs self-employed vs regular wage earners in rural sector<br>- **Agricultural Wage Rate Index:** From Labour Bureau's Wage Rates in Rural India (WRRI) series |
| **Alternative High-Frequency Proxy** | **CMIE Consumer Pyramids Household Survey (CPHS) / Labour Market Survey** (if university/institutional subscription available): Monthly district/stratum unemployment and rural labour sentiment. |

---

## 3. Dynamic Education & Literacy Indicators

*Solves the limitation of relying on outdated Census 2011 literacy rates by using dynamic annual educational data.*

### A. UDISE+ (Unified District Information System for Education Plus)
| Attribute | Details |
|---|---|
| **Source / Portal** | Department of School Education & Literacy, Ministry of Education — [udiseplus.gov.in](https://udiseplus.gov.in) |
| **Latest Coverage** | **2021–22, 2022–23, and 2023–24 District Report Cards** |
| **Spatial Granularity** | District level (all 750+ recognized districts) |
| **Key Variables** | - **Gross Enrolment Ratio (GER) & Net Enrolment Ratio (NER):** Primary, Upper Primary, Secondary<br>- **Dropout Rates:** Secondary dropout rate (especially rural girls, a primary indicator of economic distress)<br>- **Gender Parity Index (GPI):** Across elementary and secondary levels<br>- **Transition Rate:** Primary to upper primary, upper primary to secondary |

### B. ASER (Annual Status of Education Report - Rural)
| Attribute | Details |
|---|---|
| **Source / Portal** | Pratham Foundation — [asercentre.org](https://www.asercentre.org) |
| **Latest Coverage** | **ASER 2022 / 2023 (Beyond Basics) & 2024** |
| **Spatial Granularity** | Almost all rural districts of India |
| **Key Variables** | - Foundational Reading / Arithmetic levels of children (Std III-V)<br>- Out-of-school children percentage (specifically age groups 11–14 and 15–16)<br>- Paid tuition / private school enrollment shifts (economic distress marker) |

### C. NFHS-5 (National Family Health Survey)
| Attribute | Details |
|---|---|
| **Source / Portal** | International Institute for Population Sciences (IIPS) & MoHFW — [rchiips.org/nfhs](https://rchiips.org/nfhs) |
| **Coverage** | 2019–21 (covers 707 districts) |
| **Key Variables** | - Percentage of women (15–49) literate (% completed 5+ years of schooling)<br>- Percentage of men (15–49) literate<br>- Median years of schooling completed by women |

---

## 4. Socioeconomic Deprivation & Demographics

*Establishes structural baseline vulnerability and social marginalization.*

### A. NITI Aayog National Multidimensional Poverty Index (MPI)
| Attribute | Details |
|---|---|
| **Source / Portal** | NITI Aayog — *National MPI: A Progress Review* ([niti.gov.in](https://www.niti.gov.in)) |
| **Latest Coverage** | **2023 Progress Review** (derived from NFHS-5, with baseline from NFHS-4) |
| **Spatial Granularity** | 707+ Districts |
| **Key Variables** | - **Headcount Ratio ($H$):** Percentage of population multi-dimensionally poor in the district<br>- **Intensity of Poverty ($A$):** Average deprivation score among poor<br>- **MPI Score ($MPI = H \times A$)**<br>- **Deprivation headcount across dimensions:** Nutrition, Child & Adolescent Mortality, Maternal Health, Years of Schooling, School Attendance, Cooking Fuel, Sanitation, Drinking Water, Housing, Electricity, Assets, Bank Account |

### B. Population & Social Composition
| Attribute | Details |
|---|---|
| **Source / Portal** | Census of India / MoHFW Technical Group on Population Projections (2011–2036) |
| **Variables** | - Projected rural population for target years<br>- SC / ST population percentage in rural areas<br>- Age Dependency Ratio (dependents $<15$ and $>65$ per 100 working-age population) |

---

## 5. Agro-Climatic & Environmental Shock Indicators

*Captures exogenous weather shocks that drive rural agricultural distress and trigger sudden surges in MGNREGA demand.*

### A. IMD High-Resolution Gridded Rainfall & Temperature
| Attribute | Details |
|---|---|
| **Source / Portal** | India Meteorological Department (IMD) Pune — [imdpune.gov.in](https://www.imdpune.gov.in) & IMD Hydromet Division |
| **Data Resolution** | 0.25° $\times$ 0.25° Daily Gridded Rainfall (1901–present) & 1.0° $\times$ 1.0° Temperature |
| **Latest Coverage** | **Daily / Monthly up to 2024 / 2025** |
| **Key Derived Indicators** | - **Rainfall Anomaly:** Percentage deviation from 30-year Long Period Average (LPA) during Kharif (June–Sept) and Rabi (Oct–Dec) seasons<br>- **Consecutive Dry Days (CDD):** Number of dry days during active sowing months<br>- **Standardized Precipitation Index (SPI):** 1-month, 3-month, and 6-month SPI to identify moderate/severe drought conditions |

### B. Satellite Vegetation Health (NDVI) & Drought Indices
| Attribute | Details |
|---|---|
| **Source / Portal** | Mahalanobis National Crop Forecast Centre (MNCFC) / NASA MODIS / Copernicus ERA5-Land (via Google Earth Engine) |
| **Variables** | - Normalized Difference Vegetation Index (NDVI) anomaly during crop growth cycle<br>- Soil Moisture Anomaly index (ERA5-Land 0.1° reanalysis) |

---

## 6. District Harmonization & Spatial Protocol

A critical methodological challenge in Indian district studies is that **district boundaries constantly change** (from 640 districts in Census 2011 to >760 districts in 2024/2025).

### Harmonization Rules:
1. **Local Government Directory (LGD) Codes:**
   - Adopt the Ministry of Panchayati Raj's **LGD District Code** as the primary master key across all tables.
   - Use the official mapping table from [lgdirectory.gov.in](https://lgdirectory.gov.in) to reconcile carved-out districts (e.g., bifurcated districts in Telangana, Andhra Pradesh, Chhattisgarh, and Assam).
2. **Spatial Shapefile:**
   - Use Survey of India (SOI) or GitHub open-source validated India District Shapefiles updated with LGD codes (e.g., DataMeet India Maps repository).
   - Compute spatial adjacency weight matrix ($W$) using `PySAL` / `GeoPandas` for spatial lag features:
     $$ \text{Lag\_Demand}_{i,t} = \sum_{j \in N(i)} w_{ij} \times \text{Demand}_{j,t} $$

---

## 7. Unified Panel Dataset Architecture

The unified training table will be structured as a **District-Month Panel**:

```
[District_LGD_Code, State, Year, Month] 
    ├── Target Variables (Lead t+1, t+3):
    │     ├── Target_Unmet_Demand (Continuous)
    │     ├── Target_Fulfillment_Rate (Bounded [0, 1])
    │     └── Target_Vulnerability_Tier (Class: Low / Med / High)
    │
    ├── Temporal MGNREGA History (Lags t-1, t-2, t-3, t-12):
    │     ├── Past Demanded, Worked, Persondays
    │     ├── Persondays per Worked Household
    │     ├── Women Persondays Share (%)
    │     └── Delayed Wage Payment Ratio
    │
    ├── Dynamic Human Capital & Education:
    │     ├── Female Literacy / Schooling Proxy (UDISE+ / NFHS)
    │     ├── Secondary Female Dropout Rate (UDISE+)
    │     └── Gender Parity Index
    │
    ├── Labour Market Signals:
    │     ├── Estimated District Rural Unemployment Rate (PLFS)
    │     ├── Rural LFPR (PLFS)
    │     └── Agricultural Wage Growth Rate
    │
    ├── Structural Deprivation:
    │     ├── Multidimensional Poverty Index (MPI Headcount & Intensity)
    │     ├── SC/ST Rural Population Share
    │     └── Age Dependency Ratio
    │
    ├── Agro-Climatic Shocks:
    │     ├── 3-Month Rainfall Deviation from LPA (%)
    │     ├── SPI-3 (Drought indicator)
    │     ├── Max Consecutive Dry Days in last 60 days
    │     └── NDVI Anomaly Score
    │
    └── Spatial Spillover Features:
          ├── Neighboring Districts Average Demand
          └── Neighboring Districts Rainfall Deficit
```

---

## 8. Step-by-Step Data Acquisition Plan

1. **Step 1 (MGNREGA Data):** Download state/district monthly reports from MoRD Public Data Portal (`nrega.nic.in/netnrega/homestciti.aspx` or `data.gov.in`) using automated Python scrapers or bulk CSV downloads for FY 2018–19 to 2024–25.
2. **Step 2 (Rainfall Data):** Retrieve IMD 0.25° gridded daily rainfall data or aggregate district rainfall summaries from IMD Hydromet portal. Compute SPI using `scikit-extremes` / `climate_indices` Python package.
3. **Step 3 (UDISE+ & MPI):** Download latest district tables for UDISE+ (2022-23 / 2023-24) and NITI Aayog National MPI Progress Report 2023 (Appendix tables for 707 districts).
4. **Step 4 (PLFS):** Extract rural worker/unemployment indicators using MoSPI microdata or state/regional level tables.
5. **Step 5 (LGD Merge & Panel Creation):** Merge all indicators via a standardized LGD District Master crosswalk table. Handle newly carved districts via parent-district assignment or proportional weighting.
