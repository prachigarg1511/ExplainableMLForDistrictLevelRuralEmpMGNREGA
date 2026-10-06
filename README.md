# District-Level Rural Employment Vulnerability & Unmet MGNREGA Demand Forecasting

This repository contains the authentic, official government datasets downloaded and curated for the project:
**"Explainable Machine Learning for District-Level Rural Employment Vulnerability and Unmet MGNREGA Demand Forecasting in India"**

---

## 📁 Repository & Dataset Structure

```
├── data/
│   ├── raw/
│   │   ├── mgnrega/
│   │   │   ├── mgnrega_r5_1_2024_raw.csv.gz           (9.98 MB: Full official MIS R5.1 raw administrative records)
│   │   │   └── mgnrega_district_employment_demand_official.csv (83.9 KB: 740 Districts aggregated metrics)
│   │   │
│   │   ├── education_udise/
│   │   │   ├── nfhs5_district_indicators_official.csv  (4.15 MB: Official NFHS-5 factsheet indicators)
│   │   │   └── nfhs5_district_literacy_schooling.csv   (23.3 KB: Curated female literacy & schooling rates)
│   │   │
│   │   ├── socioeconomic_mpi/
│   │   │   └── district_multidimensional_deprivation_official.csv (23.3 KB: MPI baseline deprivation indicators)
│   │   │
│   │   ├── climate_imd/
│   │   │   └── imd_district_monthly_rainfall_official.csv (68.6 KB: 641 Districts monthly rainfall Jan-Dec)
│   │   │
│   │   └── spatial_lgd/
│   │       └── lgd_district_master_official.csv        (26.1 KB: 763 Districts official LGD & Census codes)
│   │
│   └── processed/
│       └── india_district_rural_vulnerability_actual.csv (118.6 KB: Master merged multi-pillar dataset)
│
├── scripts/
│   ├── download_and_curate_real_datasets.py            (Automated data fetcher from open repositories)
│   └── build_real_district_panel.py                    (Merges raw tables into master district panel)
│
└── datasets_inventory_and_pipeline.md                  (Comprehensive academic blueprint & variable dictionary)
```

---

## 📊 Summary of Actual Datasets

| Dataset | File Path | Total Districts | Key Columns | Source |
|---|---|---|---|---|
| **MGNREGA Employment** | `data/raw/mgnrega/mgnrega_district_employment_demand_official.csv` | **740** | `hh_demanded`, `hh_worked`, `unmet_demand_hh`, `fulfillment_rate`, `total_persondays`, `vulnerability_tier`, `jobcards_sc`, `jobcards_st` | Ministry of Rural Development / Harvard Dataverse |
| **Literacy & Education** | `data/raw/education_udise/nfhs5_district_literacy_schooling.csv` | **341+** | `female_literacy_rate`, `female_school_attendance_pct`, `female_10plus_years_schooling_pct`, `sex_ratio` | MoHFW / IIPS (NFHS-5) |
| **Multidimensional Deprivation** | `data/raw/socioeconomic_mpi/district_multidimensional_deprivation_official.csv` | **341+** | `electricity_access_pct`, `clean_cooking_fuel_pct`, `improved_sanitation_pct`, `improved_water_access_pct`, `health_insurance_pct` | NITI Aayog / NFHS-5 |
| **IMD Rainfall** | `data/raw/climate_imd/imd_district_monthly_rainfall_official.csv` | **641** | `JAN` through `DEC`, `ANNUAL`, `Jun-Sep` (Monsoon), `Jan-Feb`, `Mar-May`, `Oct-Dec` | India Meteorological Department (IMD) |
| **LGD District Master** | `data/raw/spatial_lgd/lgd_district_master_official.csv` | **763** | `State Code`, `State Name`, `District Code` (LGD), `District Name`, `Census 2011 Code` | Ministry of Panchayati Raj |
| **Master Integrated Panel** | `data/processed/india_district_rural_vulnerability_actual.csv` | **745** | Merged features across MGNREGA, Literacy, Climate, and LGD codes | Derived |

---

## 🛠️ Reproduction Scripts

To re-run data ingestion and panel assembly:
```bash
# 1. Download and curate raw files
python scripts/download_and_curate_real_datasets.py

# 2. Build the master multi-pillar district dataset
python scripts/build_real_district_panel.py
```
