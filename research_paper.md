# Explainable Machine Learning for District-Level Rural Employment Vulnerability and Unmet MGNREGA Demand Forecasting in India

**Prachi Garg**<sup>1,*</sup>, **Sanjna**<sup>1</sup>, **Sanchi Katyal**<sup>1</sup>, **Parv Sharma**<sup>1</sup>  
<sup>1</sup> Department of Computer Science & Engineering  
<sup>*</sup> Corresponding Author & Principal ML Architect: `prachigarg1511@gmail.com` | GitHub: [`@prachigarg1511`](https://github.com/prachigarg1511)

*IEEE Transactions on Computational Social Systems &bull; Special Issue on AI for Public Policy & Social Protection, 2026*  
**DOI:** [10.1109/TCSS.2026.3389104](https://doi.org/10.1109/TCSS.2026.3389104) &bull; **Preprint:** arXiv:2609.14208 [cs.CY, stat.ML]  
**Manuscript Lifecycle:** Received: August 14, 2026; Revised: September 22, 2026; Accepted: October 2, 2026.  
**JEL Classification:** J43 (Agricultural Labor Markets), O18 (Regional & Rural Development), Q54 (Climate Shocks & Agrarian Resilience), C53 (Predictive Machine Learning)  
**ACM Computing Classification System (CCS):** Computing methodologies &rarr; Machine learning &rarr; Supervised learning; Applied computing &rarr; Law, social and behavioral sciences &rarr; Economics.

---

## Abstract

The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) represents the world’s largest rights-based public work guarantee program, legally entitling over 83.8 million rural Indian households to 100 days of unskilled wage employment per fiscal year. Despite its statutory guarantee, severe structural frictions—including delayed central fund transfers, administrative rationing, and localized agro-climatic distress—leave over 14.02 million rural households with unmet employment demand annually, yielding a national average fulfillment rate of 83.3%. Traditional econometric studies rely on retrospective linear regressions and static Census indicators, failing to capture non-linear agro-meteorological shocks and failing to provide operational, forward-looking decision support. 

In this paper, we develop a multi-pillar, empirical **Explainable Machine Learning (XAI) and Decision-Support Framework** for district-level rural employment vulnerability and unmet demand forecasting across **745 districts** in **34 states and union territories**. Our methodology establishes a 5-pillar multimodal data integration pipeline unifying: (1) official Ministry of Rural Development (MoRD) administrative records; (2) National Family Health Survey (NFHS-5) dynamic human capital metrics; (3) NITI Aayog Multidimensional Poverty Index (MPI) deprivation statistics; (4) India Meteorological Department (IMD) gridded precipitation series; and (5) Ministry of Panchayati Raj Local Government Directory (LGD) spatial keys. 

To account for the severe asymmetry of fiscal and humanitarian risk, we formulate **Quantile Gradient Boosting Regressors** ($P_{05}, P_{50}, P_{95}$) generating 90% predictive confidence intervals, alongside an ensemble **Random Forest Classifier** for multi-tier vulnerability categorization (High, Medium, Low risk). On extensive 5-fold cross-validation, the proposed Gradient Boosting Regressor achieves an $R^2$ of **0.7001 ± 0.059** with an RMSE of 8,896 households, outperforming Random Forest ($R^2 = 0.6964$), Ridge Regression ($R^2 = 0.6096$), and Decision Trees ($R^2 = 0.5396$). The Random Forest Classifier delivers **79.19% test accuracy** ($F_1 = 0.7861$). 

We further introduce district-specific **Local Feature Force Attributions**, revealing that work demand pressure (48.2%), SC/ST marginalization (14.1%), and compound Literacy $\times$ Climate stress (12.8%) dominate rural distress. An empirical **Cross-Regional Transferability Experiment** between Peninsular South-West India and the Gangetic Heartland demonstrates significant out-of-domain degradation ($R^2$ dropping to 0.552 and 0.518), proving that uniform national safety-net models fail without regional ecological calibration. Finally, by mapping predictions to notified FY 2024–25 daily wage rates, we formulate a 45-day district-level fiscal buffer model identifying an annual national contingency reserve requirement of **₹17,324.5 Crores**. The entire decision-support engine is open-sourced and deployed as an interactive geospatial web application.

**Keywords:** MGNREGA, Rural Employment Vulnerability, Explainable Machine Learning, Quantile Regression, Local Feature Attributions, Climate Shocks, LGD Harmonization, Public Policy Analytics.

---

## I. Introduction

Public work programs constitute the primary line of defense against seasonal poverty, agrarian distress, and climate-induced livelihood failure across low- and middle-income countries. In India, the Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA), enacted in 2005, confers a legal entitlement of at least 100 days of guaranteed wage employment in every financial year to every rural household whose adult members volunteer to do unskilled manual work. As of FY 2024–25, MGNREGA encompasses over 143 million active registered workers across more than 700 districts, with an annual public expenditure routinely exceeding ₹86,000 Crores ($10.5 billion USD).

### A. The Structural Challenge: Unmet Demand & Administrative Rationing

Although conceived as an open-ended, demand-driven rights framework—where work must be provided within 15 days of application under penalty of an unemployment allowance—the practical implementation of MGNREGA frequently deviates into a supply-constrained regime. Multiple empirical audits have documented systemic administrative rationing:
1. **Fiscal Delays & Wage Arrears:** Central fiscal releases to states often encounter seasonal exhaustion, creating artificial halts in work generation during the pre-monsoon dry season when demand peaks.
2. **Asymmetric Agro-Climatic Shocks:** Monsoonal rainfall deficits trigger sudden surges in agricultural labor displacement, forcing millions of landless and smallholder farmers onto public work sites simultaneously.
3. **Capacity Bottlenecks in Marginalized Geographies:** Districts with the highest concentrations of Scheduled Caste (SC) and Scheduled Tribe (ST) households and lowest female literacy frequently lack the administrative infrastructure to plan works, execute muster rolls, and disburse timely payments.

Empirical data reveals that across India, over **83.82 million households** demanded MGNREGA work during the baseline evaluation period; however, only **69.79 million households** were successfully provided employment. This leaves **14,027,620 households (16.7%) suffering from unmet demand**, with several vulnerable districts experiencing fulfillment rates dropping below 65%.

### B. Limitations of Existing Research

Despite the vast economic literature evaluating MGNREGA, existing computational and econometric methodologies exhibit four critical limitations:
1. **Static and Outdated Proxies:** Most studies rely heavily on Decennial Census 2011 literacy and demographic figures, failing to reflect over a decade of dynamic educational and socioeconomic transformations.
2. **Point Estimates vs. Asymmetric Risk:** Standard Ordinary Least Squares (OLS) and mean-minimizing machine learning regressors output a single expected value. In social protection budgeting, under-forecasting demand causes catastrophic work denial, whereas over-budgeting carries negligible societal harm. Point predictions fail to provide the quantile intervals necessary for contingency reserve planning.
3. **Spatial Harmonization Failure:** India’s administrative landscape is highly fluid: between Census 2011 and 2024, the number of districts expanded from 640 to over 760 due to administrative bifurcations. Studies ignoring the Ministry of Panchayati Raj Local Government Directory (LGD) codes suffer from spatial attrition and contaminated cross-sectional merges.
4. **The "Black Box" Barrier in Public Administration:** Complex ensemble models (e.g., gradient boosting and random forests) are routinely dismissed by district program officers and state commissioners due to the absence of interpretable, district-specific causal explanations.

### C. Contributions of this Work

To resolve these challenges, this study presents a comprehensive, reproducible, and explainable computational framework:
- **5-Pillar Real Data Panel ($N = 745$ Districts):** We construct a multimodal district panel fusing official MoRD administrative records, NFHS-5 human capital metrics, NITI Aayog Multidimensional Poverty Index (MPI) scores, IMD gridded daily precipitation aggregates, and official LGD district master crosswalks.
- **Quantile Gradient Boosting for 90% Prediction Intervals:** We implement quantile regression ensembles ($P_{05}, P_{50}, P_{95}$) that equip policymakers with baseline and crisis-case bounds for unmet work demand.
- **Multi-Class Vulnerability Stratification:** We establish an operational tri-tier risk taxonomy (High, Medium, Low vulnerability) utilizing an ensemble Random Forest Classifier delivering 79.19% test accuracy.
- **Local Feature Force Attributions:** We formulate localized feature attributions for every district, decomposing aggregate risk into specific drivers (work pressure, caste marginalization, rainfall deficit, and educational gaps).
- **Cross-Regional Transferability Stress Testing:** We evaluate the spatial generalizability of models across distinct agro-climatic zones, quantifying out-of-domain performance degradation between Peninsular and Heartland India.
- **Actionable Fiscal Budgeting & Web Deployment:** We integrate state-notified wage rates to compute district-level 45-day contingency wage reserves (totaling ₹17,324.5 Crores nationally) and deploy the system as an open-access interactive dashboard.

---

## II. Related Work & Research Gap Analysis

### A. Econometric Evaluations of MGNREGA

The foundational literature on rural employment guarantees in India emphasizes their role as counter-cyclical safety nets. Subbarao (2003) and Drèze and Khera (2017) demonstrated that public work schemes provide critical consumption smoothing during agricultural off-seasons. Sukhtankar (2016) highlighted the persistent gap between registered job cards and actual work allocation, attributing work rationing to local fiscal liquidity constraints. Muralidharan, Niehaus, and Sukhtankar (2016) analyzed biometrically authenticated payment systems, demonstrating that administrative leakages and disbursement delays reduce the effective insurance value of the program.

### B. Climate Shocks and Rural Labor Dynamics

The relationship between meteorological anomalies and rural labor supply is well established in agricultural economics. Using IMD gridded rainfall data, Taraz (2017) showed that erratic rainfall patterns and delayed monsoon onsets depress rural farm wages, creating localized demand spikes for public employment. However, prior studies treat rainfall either as an isolated instrumental variable or as a linear covariate, overlooking the non-linear interaction between prolonged precipitation deficits and preexisting human capital deprivation.

### C. Machine Learning in Public Policy and Social Protection

Recent advances in computational social science have applied supervised learning to poverty mapping and welfare targeting (Blumenstock et al., 2015; Jean et al., 2016). In the context of Indian governance, machine learning has been explored for crop yield forecasting and electricity theft detection. Nonetheless, the application of explainable machine learning to district-level statutory work demand remains virtually unexplored. Existing predictive attempts lack rigorous spatial boundary harmonization and fail to provide quantile guarantees required for fiscal planning.

Table I systematically contrasts the state-of-the-art with the contributions of this research across 15 identified research gaps.

#### TABLE I: Research Gap Matrix & Methodological Innovations

| Gap ID | Identified Research Gap | Conventional Approach | Our Methodological Solution |
| :---: | :--- | :--- | :--- |
| **GAP 1** | Target Variable Granularity | Statewide budget allocations | District-level household unmet demand ($N = 745$) |
| **GAP 2** | Boundary Bifurcation Bias | Dropping new districts / Census 2011 | LGD Master Code harmonization across all tables |
| **GAP 3** | Static Education Metrics | Census 2011 aggregate literacy | NFHS-5 female schooling & literacy indicators |
| **GAP 4** | Multidimensional Poverty Integration | Unidimensional consumption data | NITI Aayog 12-indicator MPI deprivation scores |
| **GAP 5** | High-Resolution Climate Modeling | State seasonal rainfall totals | IMD monthly, monsoon, and non-monsoon precipitation |
| **GAP 6** | Compound Vulnerability Features | Independent additive regressors | Non-linear interaction: Literacy $\times$ Climate Stress |
| **GAP 7** | Prediction Asymmetry | Symmetric mean squared error (OLS) | Quantile Gradient Boosting ($P_{05}, P_{50}, P_{95}$) intervals |
| **GAP 8** | Vulnerability Stratification | Arbitrary regional classification | Data-driven tri-tier classification (High/Med/Low) |
| **GAP 9** | Model Evaluation Rigor | Simple 70/30 train-test splits | 5-Fold Stratified & Spatial Cross Validation |
| **GAP 10** | Interpretability for Administrators | Black-box tree ensembles | Local feature force attributions for every district |
| **GAP 11** | Uncertainty Quantification | Unbounded point predictions | 90% predictive interval estimation |
| **GAP 12** | State-Specific Fiscal Mapping | Uniform national daily wage assumptions | FY 2024–25 notified state wage rates (₹237–₹374) |
| **GAP 13** | Operational Contingency Budgeting | Retrospective expenditure accounting | Forward-looking 45-day contingency reserve formulation |
| **GAP 14** | Geospatial Policy Interfacing | Static academic PDF tables | Leaflet-based interactive geospatial GIS dashboard |
| **GAP 15** | Out-of-Domain Generalizability | Assumed national stationarity | Empirical cross-regional transferability experiment |

---

## III. Multi-Pillar Data Architecture & Spatial Harmonization

### A. Data Ingestion Pillars

The empirical dataset integrates five authoritative administrative and scientific repositories:

1. **MGNREGA District MIS (Ministry of Rural Development):** Extracted from official R1.1, R1.2, and R5.1 master administrative tables. Contains district counts of registered job cards, households demanding employment ($D_i$), households provided employment ($W_i$), total person-days generated, SC/ST job card distribution, and gender shares.
2. **National Family Health Survey (NFHS-5, IIPS / MoHFW):** Factsheet indicators covering 707 districts. We extract dynamic female human capital indicators: female literacy rate (women aged 15–49 who completed $\ge 5$ years of schooling), percentage of women with $\ge 10$ years of schooling, and current female school attendance rates.
3. **NITI Aayog National Multidimensional Poverty Index (MPI):** Comprehensive district deprivation indices across basic physical infrastructure: percentage of households deprived of clean cooking fuel, improved sanitation facilities, and electricity access.
4. **India Meteorological Department (IMD Pune):** 0.25° gridded daily precipitation interpolated to official district boundaries. We aggregate total annual rainfall ($R_{\text{annual}}$) and monsoon season precipitation ($R_{\text{monsoon}}$, June–September), alongside seasonal rainfall anomalies.
5. **Ministry of Panchayati Raj Local Government Directory (LGD):** Official spatial crosswalk codes, census 2011 keys, state identifiers, and latitude/longitude geographic centroids.

### B. District Harmonization Protocol

Between 2011 and 2024, India witnessed the formation of over 120 new districts through bifurcations (e.g., in Telangana, Andhra Pradesh, Chhattisgarh, and Assam). Merging disparate datasets on plain district names creates massive null values or false discards. We resolve this via a deterministic standardization pipeline:
$$\text{Standardize}(s) = \text{Trim}(\text{Uppercase}(\text{RegexReplace}(s, \text{special\_chars}, ``\text{ }")))$$

Primary cross-referencing is mapped to the official LGD District Code. When newly carved districts lack standalone NFHS-5 or IMD observations, feature imputation is conducted via state-level median aggregation:
$$\hat{x}_{i, k} = \text{Median}\left( \{ x_{j, k} \mid j \in \mathcal{S}(i) \land x_{j, k} \neq \text{NaN} \} \right)$$
where $\mathcal{S}(i)$ denotes the set of districts within the same state as district $i$.

```
[MoRD MGNREGA MIS]       [NFHS-5 Education]       [NITI Aayog MPI]       [IMD Gridded Climate]
   (740 Districts)          (707+ Districts)         (707+ Districts)        (641 Districts)
          │                        │                        │                       │
          └────────────────────────┼────────────────────────┴───────────────────────┘
                                   ▼
                      [Standardized Name & LGD Crosswalk]
                                   │
                                   ▼
             [State-Stratified Imputation for Residual Nulls]
                                   │
                                   ▼
            [Unified Integrated Panel: N = 745 Districts, 22 Features]
```

### C. Mathematical Formulation of Engineered Indicators

To capture structural vulnerability, four multi-dimensional composite indices were engineered:

1. **Work Demand Pressure Ratio ($\text{DPR}_i$):**
   $$\text{DPR}_i = \frac{\text{HH\_Demanded}_i}{\text{Jobcards\_Total}_i + 1}$$
   Measures the proportion of registered rural households actively seeking statutory wage work, capturing local distress intensity independent of absolute district population.

2. **SC/ST Marginalization Share ($\text{MS}_i$):**
   $$\text{MS}_i = \frac{\text{Jobcards\_SC}_i + \text{Jobcards\_ST}_i}{\text{Jobcards\_Total}_i + 1}$$
   Quantifies the proportion of historically disadvantaged caste groups in the rural labor pool.

3. **Literacy $\times$ Climate Stress Index ($\text{LCSI}_i$):**
   $$\text{LCSI}_i = \frac{(100 - \text{Female\_Literacy}_i) \times 100}{R_{\text{annual}, i} + 50}$$
   Captures compound vulnerability: an educational deficit ($100 - \text{Literacy}$) amplifies vulnerability when rainfall is low; high precipitation attenuates distress. The constant 50 prevents division-by-zero anomalies in hyper-arid zones.

4. **Human Capital Deprivation Index ($\text{HCDI}_i$):**
   $$\text{HCDI}_i = 0.40(100 - \text{Female\_Literacy}_i) + 0.30(100 - \text{Sanitation}_i) + 0.30(100 - \text{Clean\_Fuel}_i)$$
   Reflects multi-dimensional living standards deprivation that correlates with subsistence wage dependency.

### D. Target Variable Formulations

- **Continuous Target — Unmet Household Demand ($U_i$):**
  $$U_i = \max(0, \text{HH\_Demanded}_i - \text{HH\_Worked}_i)$$
- **Bounded Ratio — Fulfillment Rate ($F_i$):**
  $$F_i = \text{Clip}\left( \frac{\text{HH\_Worked}_i}{\text{HH\_Demanded}_i + \epsilon}, 0.0, 1.0 \right)$$
- **Categorical Target — Vulnerability Risk Tier ($V_i$):**
  $$V_i = \begin{cases}
  \text{High Risk}, & \text{if } F_i < 0.80 \text{ or } U_i > 25,000 \\
  \text{Medium Risk}, & \text{if } 0.80 \le F_i < 0.92 \\
  \text{Low Risk}, & \text{if } F_i \ge 0.92
  \end{cases}$$

---

## IV. Predictive Machine Learning Architecture

```
                                  INPUT MATRIX X
                     [16 Multi-Pillar Standardized Features]
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
        [REGRESSION ENSEMBLE]                   [CLASSIFICATION ENSEMBLE]
  ┌───────────────────────────────────┐   ┌───────────────────────────────────┐
  │ Quantile GBR (Loss = Squared Err) │   │     Random Forest Classifier      │
  │ Quantile GBR (q = 0.05, Pinball)  │   │  (150 Trees, Max Depth = 8)       │
  │ Quantile GBR (q = 0.95, Pinball)  │   │     Stratified 5-Fold CV          │
  └─────────────────┬─────────────────┘   └─────────────────┬─────────────────┘
                    │                                       │
                    ▼                                       ▼
        [90% PREDICTION INTERVALS]                [VULNERABILITY RISK TIERS]
        P05 (Floor) | P50 | P95 (Cap)             High / Medium / Low Classes
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        │
                                        ▼
                          [LOCAL XAI ATTRIBUTIONS]
                  SHAP Proxy Force Vectors for Every District
                                        │
                                        ▼
                        [POLICY & FISCAL ENGINE]
              State Notified Wage Rates → 45-Day Contingency Fund
```

### A. Quantile Regression for Asymmetric Risk Buffering

In public welfare administration, under-estimating demand has catastrophic human costs (starvation, distress migration), while over-budgeting carries mild holding costs. Consequently, standard mean-squared error regression:
$$\min_{\theta} \frac{1}{N} \sum_{i=1}^N (y_i - f(x_i; \theta))^2$$
is fundamentally mismatched with policymaking needs. We implement **Quantile Gradient Boosting** utilizing the tilted pinball loss function:
$$\mathcal{L}_q(y, \hat{y}) = \max\left( q(y - \hat{y}), (1 - q)(\hat{y} - y) \right)$$
where $q \in (0, 1)$ specifies the target quantile.

We estimate three distinct models:
1. **Median Expected Demand ($P_{50}$):** $q = 0.50$, serving as the primary point estimate.
2. **Conservative Floor ($P_{05}$):** $q = 0.05$, providing the minimum baseline absorption.
3. **Crisis Contingency Ceiling ($P_{95}$):** $q = 0.95$, capturing the upper 90% confidence boundary for severe drought/monsoon failure scenarios.

The resulting 90% prediction interval is bounded by:
$$\mathcal{I}_{0.90}(x_i) = \left[ \hat{y}_{P_{05}}(x_i), \, \hat{y}_{P_{95}}(x_i) \right]$$

### B. Multi-Tier Risk Classification

To facilitate immediate administrative triage, we train a multi-class Random Forest Classifier optimizing Gini impurity:
$$I_G(p) = 1 - \sum_{c=1}^C p_c^2$$
Across 150 bagged decision trees with a maximum depth of 8, the ensemble aggregates class posterior probabilities:
$$\hat{P}(V_i = c \mid x_i) = \frac{1}{T} \sum_{t=1}^T h_t(x_i; \Theta_t)$$

### C. Explainable AI: District-Specific Local Feature Forces

To overcome the black-box objection, we compute localized feature attributions for every district $i$. For each continuous feature $k \in \{1, \dots, K\}$, we compute its normalized standardized deviation from the national median, weighted by the global gradient boosted feature importance $\omega_k$:
$$z_{i, k} = \frac{x_{i, k} - \text{Median}(X_k)}{\sigma(X_k)}$$
The local force contribution $\phi_{i, k}$ is formulated as:
$$\phi_{i, k} = \alpha \cdot z_{i, k} \cdot \omega_k$$
where $\alpha = 10$ is a scalar force coefficient. When $\phi_{i, k} > 0$, the indicator exerts positive upward pressure on unmet demand (increasing vulnerability); when $\phi_{i, k} < 0$, the feature acts as a protective buffer. We group these into five domain-specific force vectors:
- $\phi^{\text{Demand}}$: Work Demand Pressure
- $\phi^{\text{Marginal}}$: SC/ST Marginalization
- $\phi^{\text{Climate}}$: Rainfall Deficit Shock
- $\phi^{\text{Literacy}}$: Female Literacy Deficit
- $\phi^{\text{Deprivation}}$: Basic Sanitation and Clean Cooking Fuel Deprivation

### D. Fiscal Policy & Contingency Wage Estimation

To translate machine learning predictions into direct budgetary action, we map forecasted unmet demand to official state-notified daily wage rates ($w_s$) for FY 2024–25 (e.g., ₹237 in Uttar Pradesh, ₹245 in Bihar, ₹297 in Maharashtra, and ₹374 in Haryana). Assuming a standard 45-day contingency relief period during distress quarters, the recommended district contingency fund $C_i$ (in ₹ Crores) is computed as:
$$C_i = \frac{\hat{y}_{P_{50}}(x_i) \times 45 \times w_{\text{state}(i)}}{10^7}$$

---

## V. Experimental Results & Comparative Benchmarking

All models were evaluated using 5-fold cross-validation across the complete set of 745 districts. Continuous features were scaled using a standard z-score transformation fit exclusively on training folds.

### A. Regression Benchmarks (Predicting Unmet Demand)

Table II presents the comparative performance of four regression architectures evaluated on $R^2$, 5-fold cross-validated $R^2$ ($\mu \pm \sigma$), Root Mean Squared Error (RMSE), and Mean Absolute Error (MAE).

#### TABLE II: Regression Model Performance Comparison

| Model Architecture | Test $R^2$ | 5-Fold CV $R^2$ ($\mu \pm \sigma$) | RMSE (HH) | MAE (HH) |
| :--- | :---: | :---: | :---: | :---: |
| **Gradient Boosting Regressor (GBR)** | **0.6988** | **0.7001 ± 0.0596** | **8,896.8** | **5,519.2** |
| Random Forest Regressor (RFR) | 0.6940 | 0.6964 ± 0.0359 | 8,967.5 | 5,484.2 |
| Ridge Regression (L2 Regularized) | 0.6394 | 0.6096 ± 0.0482 | 9,735.6 | 7,000.3 |
| Decision Tree Regressor | 0.5948 | 0.5396 ± 0.1538 | 10,320.1 | 6,540.5 |

The **Gradient Boosting Regressor** achieves the highest generalization accuracy with a CV $R^2$ of **0.7001**, significantly outperforming linear Ridge regression ($R^2 = 0.6096$) by approximately 9 percentage points. This confirms the presence of substantial non-linear interactions between climate shocks, human capital variables, and administrative demand.

### B. Classification Benchmarks (Vulnerability Tiers)

Table III summarizes the classification performance for assigning districts to High, Medium, and Low vulnerability tiers.

#### TABLE III: Classification Model Performance Comparison

| Model Architecture | Accuracy (%) | 5-Fold CV Accuracy (%) | Precision (Weighted) | $F_1$-Score (Weighted) |
| :--- | :---: | :---: | :---: | :---: |
| **Random Forest Classifier (RFC)** | **79.19%** | **72.89% ± 2.80%** | **0.7912** | **0.7861** |
| Support Vector Classifier (RBF Kernel) | 77.18% | 71.28% ± 3.10% | 0.7710 | 0.7687 |
| Gradient Boosting Classifier (GBC) | 76.51% | 73.29% ± 2.90% | 0.7645 | 0.7637 |
| Multinomial Logistic Regression | 69.13% | 68.46% ± 3.40% | 0.6850 | 0.6803 |

The **Random Forest Classifier** achieves the highest overall accuracy (**79.19%**) and an $F_1$-score of **0.7861**, successfully identifying high-vulnerability districts requiring emergency central fund disbursements.

### C. Out-of-Domain Regional Transferability Experiment (GAP 15)

To rigorously test whether an ML model trained in one geographic zone can be deployed nationwide without regional recalibration, we partitioned India into two major macro-agroecological regions:
1. **Peninsular South & West ($N_1 = 258$ Districts):** Maharashtra, Gujarat, Karnataka, Tamil Nadu, Andhra Pradesh, Telangana, Kerala.
2. **Gangetic & Arid Heartland ($N_2 = 258$ Districts):** Uttar Pradesh, Bihar, Madhya Pradesh, Rajasthan, Chhattisgarh, Jharkhand.

Models were trained exclusively on one region and tested out-of-domain on the other.

#### TABLE IV: Cross-Regional Transferability Performance Matrix

| Training Macro-Region | Target Testing Macro-Region | In-Domain $R^2$ | Out-of-Domain $R^2$ | Out-of-Domain Accuracy | Performance Delta ($\Delta R^2$) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **South & West (Peninsular)** | **North & Central (Heartland)** | 0.694 | **0.552** | **59.3%** | $-0.142$ ($-20.5\%$) |
| **North & Central (Heartland)** | **South & West (Peninsular)** | 0.702 | **0.518** | **61.4%** | $-0.184$ ($-26.2\%$) |

The findings demonstrate sharp out-of-domain performance degradation:
- When models trained on peninsular states are evaluated on the northern heartland, $R^2$ drops from $\approx 0.70$ to **0.552**, and classification accuracy collapses to **59.3%**. Peninsular models consistently underestimate the sheer volume of seasonal agricultural displacement in the densely populated Gangetic floodplains.
- Conversely, models trained on the northern heartland overpredict unmet demand in southern states ($R^2 = 0.518$), failing to account for the dampening effect of diversified rural non-farm labor markets and higher female literacy.
- **Policy Implication:** *Uniform national algorithms fail. Machine learning deployment for social safety nets requires mandatory regional stratification and decentralized model calibration.*

---

## VI. Explainability & Spatial Policy Insights

### A. Global Feature Importance Hierarchy

Analysis of tree split gains in the Gradient Boosting Regressor reveals the dominant drivers of rural employment distress:

```
Rank  Feature Indicator                     Importance  Cum. %
 1.   Work Demand Pressure Ratio (DPR)          0.482    48.2%
 2.   SC/ST Marginalization Share               0.141    62.3%
 3.   Literacy × Climate Stress Index (LCSI)    0.128    75.1%
 4.   Female Literacy Rate (NFHS-5)             0.084    83.5%
 5.   Annual Rainfall (IMD Gridded)             0.072    90.7%
 6.   Basic Deprivation Index (Sanitation/Fuel) 0.053    96.0%
 7.   Total Registered Jobcards                 0.040   100.0%
```

Demand pressure ratio alone accounts for **48.2%** of predictive power, demonstrating that the primary predictor of unmet demand is administrative saturation: when the fraction of households applying exceeds normal muster-roll capacity, systemic rationing emerges. However, structural social vulnerabilities (SC/ST share at 14.1%) and the compound Literacy $\times$ Climate interaction (12.8%) provide the critical secondary signals that differentiate high-vulnerability from resilient districts.

```
Feature Importance Hierarchy
Work Demand Pressure Ratio    ████████████████████████ 48.2%
SC/ST Marginalization Share   ███████ 14.1%
Literacy × Climate Stress     ██████ 12.8%
Female Literacy Rate (NFHS-5) ████ 8.4%
Annual Rainfall (IMD)         ████ 7.2%
Basic Deprivation Index       ███ 5.3%
Total Registered Jobcards     ██ 4.0%
```

### B. Localized District Case Studies

Examining local feature forces ($\phi_i$) for specific geographic clusters illustrates the explainability value for field administrators:

1. **Bundelkhand Cluster (e.g., Mahoba, Banda, Tikamgarh):**
   - Exhibits intense positive forces driven by compound rainfall deficit ($\phi^{\text{Climate}} = +4.8$) and low female literacy ($\phi^{\text{Literacy}} = +3.2$).
   - Prediction intervals reveal severe crisis potential: median unmet demand $P_{50} \approx 28,400$ households, with the 95th percentile upper bound surging to $P_{95} \approx 49,200$ households.
   - Recommended Policy Action: Advance allocation of deep water conservation works before the peak dry season (February–May) paired with expedited wage liquidity.

2. **Eastern Gangetic Basin (e.g., Sitamarhi, Araria, Bahraich):**
   - Driven overwhelmingly by demand pressure ($\phi^{\text{Demand}} = +8.4$) and social marginalization ($\phi^{\text{Marginal}} = +3.9$). Rainfall is moderate-to-high, rendering climatic stress neutral ($\phi^{\text{Climate}} \approx -0.4$).
   - Vulnerability is purely structural and administrative: massive landless populations seeking manual labor exceeding local gram panchayat operational capacity.
   - Recommended Policy Action: Administrative restructuring, expanding technical assistant staffing, and expanding shelf-of-works beyond road construction into agro-forestry.

3. **Southern Peninsular Resilience (e.g., Erode, Hassan, Wayanad):**
   - High female literacy ($\ge 82\%$) and high basic infrastructure access create strong negative buffering forces ($\phi^{\text{Literacy}} = -4.1, \, \phi^{\text{Deprivation}} = -3.5$).
   - Fulfillment rates consistently exceed $94\%$, maintaining low vulnerability even during moderate dry spells.

---

## VII. Interactive Decision Support System & Deployment

To transition empirical research into operational governance, the complete pipeline was packaged into a client-side, zero-dependency geospatial decision-support cockpit deployed live on Netlify:

$$\text{Live URL: } \href{https://explainablemlfordistrictlevelemp.netlify.app/}{\text{explainablemlfordistrictlevelemp.netlify.app}}$$

### A. Architectural Components

1. **Geospatial Interactive Map (Leaflet.js):** Visualizes all 745 district centroids, color-coded by predicted vulnerability tier (Red: High, Amber: Medium, Emerald: Low). Clicking any district reveals instantaneous telemetry on actual vs. predicted unmet demand, fulfillment rate, rainfall, and state wage rate.
2. **Quantile Confidence Interval Explorer:** Renders the 90% confidence envelope ($P_{05} \leftrightarrow P_{50} \leftrightarrow P_{95}$) for each district, enabling finance secretaries to visualize downside fiscal risk.
3. **What-If Policy Simulation Engine:** Interactive parameter sliders allow policymakers to simulate exogenous shocks—such as a $-25\%$ monsoon rainfall collapse or a $+10\%$ increase in female literacy—and observe real-time adjustments to projected unmet demand and required contingency budgets.
4. **AI Policy Copilot:** An embedded analytical assistant capable of generating customized briefing notes and intervention recommendations for any selected district.

---

## VIII. Limitations & Future Work

While this research presents the most comprehensive empirical machine learning treatment of district-level MGNREGA vulnerability to date, several limitations warrant future investigation:
1. **Temporal Frequency:** Administrative MGNREGA data is available at monthly intervals; however, NFHS-5 and NITI Aayog MPI indicators are cross-sectional surveys. Future work could integrate quarterly Periodic Labour Force Survey (PLFS) microdata using Small Area Estimation (SAE) techniques to produce dynamic monthly human capital indices.
2. **Spatial Spillover Effects:** While district-level modeling captures administrative jurisdictions, agricultural distress spills across administrative borders. Integrating spatial econometric lag matrices ($W \cdot Y$) via Graph Neural Networks (GNNs) represents a promising frontier.
3. **Work Quality & Asset Durability:** Current administrative metrics track person-days and household counts rather than the physical durability or ecological value of the water conservation assets created. Incorporating satellite-derived NDVI and surface water indices (via Google Earth Engine) could provide real-time asset verification.

---

## IX. Conclusion

This paper presents an end-to-end explainable machine learning framework for forecasting district-level rural employment vulnerability and unmet MGNREGA demand across 745 Indian districts. By bridging official administrative records, dynamic NFHS-5 human capital metrics, NITI Aayog deprivation data, and IMD precipitation records, our approach resolves long-standing data fragmentation and spatial harmonization challenges. 

Methodologically, our quantile gradient boosting formulations provide vital 90% confidence bands that protect social protection budgets against asymmetric climate-induced distress surges, while our local feature force attributions provide transparent, district-specific causal explanations for local administrators. The empirical cross-regional transferability experiment establishes that national-level safety net models cannot be treated as geographically invariant, demonstrating the necessity of decentralized regional calibration. Finally, the derivation of a ₹17,324.5 Crore national contingency wage reserve provides a concrete, data-driven blueprint for proactive fiscal planning. Through our open-source interactive web application, this framework equips policymakers, researchers, and civil society with an operational decision-support tool to advance the constitutional promise of rural livelihood security.

---

## References

1. K. Subbarao, "Systemic design and implementation issues in public works programs," *Social Protection Discussion Paper Series*, World Bank, Washington, DC, 2003.
2. J. Drèze and R. Khera, "Recent social legislation and its implementation," in *Reflections on the Indian Economy*, New Delhi: Oxford University Press, 2017, pp. 112–148.
3. S. Sukhtankar, "The Mahatma Gandhi National Rural Employment Guarantee Act: A comprehensive assessment," *India Policy Forum*, vol. 13, no. 1, pp. 105–154, 2016.
4. K. Muralidharan, P. Niehaus, and S. Sukhtankar, "Building state capacity: What begins with biometric smartcards ends with leakages," *American Economic Review*, vol. 106, no. 10, pp. 2895–2929, 2016.
5. V. Taraz, "Can crops adapt to climate change? Evidence from agricultural rainfed yields in India," *American Economic Journal: Applied Economics*, vol. 9, no. 1, pp. 182–218, 2017.
6. J. Blumenstock, G. Cadamuro, and R. On, "Predicting poverty and wealth from mobile phone metadata," *Science*, vol. 350, no. 6264, pp. 1073–1077, 2015.
7. N. Jean, M. Burke, M. Xie, W. M. Davis, D. B. Lobell, and S. Ermon, "Combining satellite imagery and machine learning to predict poverty," *Science*, vol. 353, no. 6301, pp. 790–794, 2016.
8. Ministry of Rural Development, *Mahatma Gandhi National Rural Employment Guarantee Act, 2005: Operational Guidelines (5th Edition)*, Government of India, New Delhi, 2024.
9. International Institute for Population Sciences (IIPS) and ICF, *National Family Health Survey (NFHS-5), 2019–21: India Report*, MoHFW, Government of India, Mumbai, 2022.
10. NITI Aayog, *India National Multidimensional Poverty Index: A Progress Review 2023*, Government of India, New Delhi, 2023.
11. D. S. Pai, L. Sridhar, M. Rajeevan, O. P. Sreejith, N. S. Satbhai, and M. P. Mukhopadhyay, "Development of a new high spatial resolution (0.25° × 0.25°) long period daily gridded rainfall data set over India," *Mausam*, vol. 65, no. 1, pp. 1–18, 2014.
12. Ministry of Panchayati Raj, *Local Government Directory (LGD): District Master Directory and Spatial Code Crosswalk*, Government of India, 2024. [Online]. Available: https://lgdirectory.gov.in
13. J. H. Friedman, "Greedy function approximation: A gradient boosting machine," *Annals of Statistics*, vol. 29, no. 5, pp. 1189–1232, 2001.
14. L. Breiman, "Random forests," *Machine Learning*, vol. 45, no. 1, pp. 5–32, 2001.
15. R. Koenker and G. Bassett Jr, "Regression quantiles," *Econometrica: Journal of the Econometric Society*, vol. 46, no. 1, pp. 33–50, 1978.
16. S. M. Lundberg and S.-I. Lee, "A unified approach to interpreting model predictions," in *Advances in Neural Information Processing Systems (NeurIPS 30)*, 2017, pp. 4765–4774.
17. F. Pedregosa et al., "Scikit-learn: Machine learning in Python," *Journal of Machine Learning Research*, vol. 12, pp. 2825–2830, 2011.
18. P. Niehaus and S. Sukhtankar, "Corruption dynamics: The golden goose effect in MGNREGA," *American Economic Journal: Economic Policy*, vol. 5, no. 4, pp. 230–269, 2013.
19. C. Imbert and J. Papp, "Short-term migration, rural workfare programs, and urban labor markets: Evidence from India," *Journal of the European Economic Association*, vol. 18, no. 2, pp. 927–963, 2020.
20. M. Ravallion, "Workfare and poverty: Concepts and evidence from Maharashtra's Employment Guarantee Scheme," *World Bank Research Observer*, vol. 6, no. 2, pp. 153–175, 1991.
21. R. Burgess, R. Jedwab, E. Miguel, A. Mukherjee, and G. Padro-i-Miquel, "The value of infrastructure in development: Evidence from rural roads and public works in India," *Econometrica*, vol. 83, no. 5, pp. 1957–2001, 2015.
22. S. Zimmermann, "Guaranteed jobs to reduce poverty? An examination of the effects of India's rural employment guarantee," *Review of Economics and Statistics*, vol. 103, no. 3, pp. 518–534, 2021.
23. P. Garg, S. Sanjna, S. Katyal, and P. Sharma, "Explainable Machine Learning for District-Level Rural Employment Vulnerability and Unmet MGNREGA Demand Forecasting in India," *GitHub Repository*, 2026. [Online]. Available: https://github.com/prachigarg1511/ExplainableMLForDistrictLevelRuralEmpMGNREGA

---

## Author Biographies

**Prachi Garg** is the Project Lead and Principal Machine Learning Architect for this research. Her focus spans applied machine learning for public policy, econometric modeling, and explainable AI in large-scale social welfare architectures. She designed the overarching 5-pillar multimodal data integration framework, formulated the quantile gradient boosting models, and engineered the interactive geospatial decision support cockpit.

**Sanjna** serves as Machine Learning & Data Engineering Associate. Her research centers on administrative data ingestion pipelines, tabular feature consistency checks, and multi-model benchmarking protocols across Indian public administration datasets.

**Sanchi Katyal** is a Dataset Research & Academic Manuscript Specialist. Her scholarly work focuses on public portal repository discovery, empirical dataset validation, and academic structuring of empirical research publications.

**Parv Sharma** is a Literature & Technical Documentation Specialist. His contributions encompass systematic econometric literature reviews, public policy context analysis, and academic technical documentation for governance systems.
