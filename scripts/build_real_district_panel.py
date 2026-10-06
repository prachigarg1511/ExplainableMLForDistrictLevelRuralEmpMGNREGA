"""
Merge authentic real datasets across pillars:
- MGNREGA official district employment demand & fulfillment (740 districts)
- NFHS-5 official female literacy and schooling indicators
- IMD official district monthly precipitation
- Local Government Directory (LGD) district master codes
Outputs: data/processed/india_district_rural_vulnerability_actual.csv
"""

import os
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data", "raw")
OUT_DIR = os.path.join(BASE_DIR, "data", "processed")

def build_merged_real_dataset():
    # 1. Load MGNREGA
    mgnrega_path = os.path.join(DATA_DIR, "mgnrega", "mgnrega_district_employment_demand_official.csv")
    df_mgnrega = pd.read_csv(mgnrega_path)
    print(f"Loaded MGNREGA: {df_mgnrega.shape[0]} districts")
    df_mgnrega["district_clean"] = df_mgnrega["district_name"].str.strip().str.upper()
    df_mgnrega["state_clean"] = df_mgnrega["state_name"].str.strip().str.upper()

    # 2. Load Education & Literacy (NFHS-5)
    edu_path = os.path.join(DATA_DIR, "education_udise", "nfhs5_district_literacy_schooling.csv")
    df_edu = pd.read_csv(edu_path)
    print(f"Loaded Literacy & Education: {df_edu.shape[0]} districts")
    df_edu["district_clean"] = df_edu["District"].str.strip().str.upper()
    df_edu["state_clean"] = df_edu["State"].str.strip().str.upper()

    # 3. Load IMD Rainfall
    rain_path = os.path.join(DATA_DIR, "climate_imd", "imd_district_monthly_rainfall_official.csv")
    df_rain = pd.read_csv(rain_path)
    print(f"Loaded IMD Rainfall: {df_rain.shape[0]} districts")
    df_rain["district_clean"] = df_rain["DISTRICT"].str.strip().str.upper()
    df_rain["state_clean"] = df_rain["STATE_UT_NAME"].str.strip().str.upper()

    # 4. Load LGD District Master
    lgd_path = os.path.join(DATA_DIR, "spatial_lgd", "lgd_district_master_official.csv")
    df_lgd = pd.read_csv(lgd_path)
    print(f"Loaded LGD Master: {df_lgd.shape[0]} districts")
    df_lgd["district_clean"] = df_lgd["District Name"].str.strip().str.upper()

    # Merge on cleaned district names
    merged = pd.merge(df_mgnrega, df_edu[["district_clean", "female_literacy_rate", "female_school_attendance_pct", "female_10plus_years_schooling_pct", "electricity_access_pct", "improved_sanitation_pct", "clean_cooking_fuel_pct"]], on="district_clean", how="left")
    
    # Merge rainfall
    merged = pd.merge(merged, df_rain[["district_clean", "ANNUAL", "Jun-Sep", "Jan-Feb", "Mar-May", "Oct-Dec"]], on="district_clean", how="left")
    merged.rename(columns={"ANNUAL": "annual_rainfall_mm", "Jun-Sep": "monsoon_rainfall_mm"}, inplace=True)

    # Merge LGD codes
    merged = pd.merge(merged, df_lgd[["district_clean", "District Code", "Census 2011 Code"]].drop_duplicates("district_clean"), on="district_clean", how="left")
    merged.rename(columns={"District Code": "lgd_district_code", "Census 2011 Code": "census_2011_code"}, inplace=True)

    # Remove temporary columns
    merged.drop(columns=["district_clean", "state_clean"], inplace=True, errors="ignore")

    out_file = os.path.join(OUT_DIR, "india_district_rural_vulnerability_actual.csv")
    merged.to_csv(out_file, index=False)
    print(f"\nCreated Integrated Master Panel: {merged.shape[0]} districts, {merged.shape[1]} features.")
    print(f"Saved to: {out_file}")
    print("\nSummary of Key Real Columns:")
    print(merged[["state_name", "district_name", "hh_demanded", "hh_worked", "unmet_demand_hh", "fulfillment_rate", "vulnerability_tier", "female_literacy_rate", "annual_rainfall_mm"]].head(10))

if __name__ == "__main__":
    build_merged_real_dataset()
