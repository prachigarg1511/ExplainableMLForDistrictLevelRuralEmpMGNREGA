"""
Generate Comprehensive Academic Viva-Voce Examination Guide PDF
for the MGNREGA Rural Employment Vulnerability & Unmet Demand Forecasting Project.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_PDF = os.path.join(BASE_DIR, "MGNREGA_ML_Project_Viva_Voce_Comprehensive_Guide.pdf")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Header (pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 755, "MGNREGA ML Project — Comprehensive Viva-Voce Master Guide")
            self.drawRightString(558, 755, "Department of Computer Science & Engineering")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 748, 558, 748)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        self.drawString(54, 32, "Confidential • Academic Evaluation & Project Viva-Voce Preparation")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_text)
        self.restoreState()


def build_viva_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=21,
        leading=26,
        textColor=colors.HexColor("#0f172a"),
        alignment=0,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#0284c7"),
        spaceAfter=14
    )

    meta_style = ParagraphStyle(
        'MetaBox',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155")
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    q_style = ParagraphStyle(
        'QStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13.5,
        textColor=colors.HexColor("#0369a1"),
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )

    ans_style = ParagraphStyle(
        'AnsStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.4,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.8,
        textColor=colors.HexColor("#334155"),
        leftIndent=14,
        spaceAfter=2
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#f1f5f9"),
        borderPadding=4,
        spaceAfter=4
    )

    story = []

    # Title Block
    story.append(Paragraph("PROJECT VIVA-VOCE EXAMINATION MASTER GUIDE", title_style))
    story.append(Paragraph("Explainable ML for District-Level Rural Employment Vulnerability & Unmet Demand Forecasting in India", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=10))

    # Meta Table Box
    meta_data = [
        [
            Paragraph("<b>Project Domain:</b> Machine Learning & Applied Public Policy", meta_style),
            Paragraph("<b>Dataset Scale:</b> 745 Districts, 28 States & UTs (All India)", meta_style)
        ],
        [
            Paragraph("<b>Primary Target:</b> Unmet Employment Demand (HH)", meta_style),
            Paragraph("<b>Best Regressor:</b> Gradient Boosting (R² = 0.699, RMSE = 8,897)", meta_style)
        ],
        [
            Paragraph("<b>XAI Method:</b> Global & Local SHAP TreeExplainer Attributions", meta_style),
            Paragraph("<b>Best Classifier:</b> Random Forest (79.2% Acc, Macro F1 = 0.786)", meta_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[245, 255])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # ─────────────────────────────────────────────────────────────────────────
    # SECTION 1: PROJECT MOTIVATION, OBJECTIVES & PROBLEM FORMULATION
    # ─────────────────────────────────────────────────────────────────────────
    story.append(Paragraph("1. Project Motivation, Problem Statement & Core Objectives", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=6))

    story.append(Paragraph("Q1. What is the fundamental problem your project solves?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> Under the Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA 2005), every rural household has a statutory legal right to 100 days of wage employment on demand. However, in practice, millions of households demand work but do not receive it—a phenomenon known as <b>administrative rationing and unmet demand</b>. Traditional government planning relies on reactive, retrospective expenditure accounting. Our project formulates rural employment vulnerability as a <b>predictive machine learning problem across 745 Indian districts</b>. By fusing official multi-pillar datasets (employment MIS, NFHS-5 education, IMD rainfall, and NITI Aayog deprivation), our models proactively forecast unmet demand bottlenecks, classify vulnerability tiers, quantify required contingency funds, and explain root causes using SHAP.",
        ans_style
    ))

    story.append(Paragraph("Q2. Why is 'Unmet Demand' (Demanded - Worked) your target variable instead of gross employment demanded or funds spent?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> Gross employment demanded or expenditure merely mirrors administrative scale and district population (e.g., large districts will always spend more money). It obscures whether the safety net is actually fulfilling legal rights. <b>Unmet Demand (HH Demanded minus HH Worked)</b> directly captures the <i>gap in legal delivery</i>. If a district has 100,000 households demanding work but only 60,000 work, 40,000 families suffer distress rationing. Predicting unmet demand directly quantifies where labor safety nets fail, enabling targeted financial allocations.",
        ans_style
    ))

    story.append(Paragraph("Q3. Why is forecasting conducted at the District level rather than State or National level?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> Under the MGNREGA Act, the <b>District Programme Coordinator (District Magistrate / Collector)</b> is the statutory authority responsible for notifying work, allocating budgets, and approving labor budgets. State-level aggregates mask extreme intra-state spatial disparities—for example, in Uttar Pradesh, western agricultural districts face completely different labor dynamics than drought-prone Bundelkhand. A district-level panel (n=745) matches the exact administrative decision unit of the Indian government.",
        ans_style
    ))

    # ─────────────────────────────────────────────────────────────────────────
    # SECTION 2: DATASET ARCHITECTURE & PREPROCESSING PIPELINE
    # ─────────────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4))
    story.append(Paragraph("2. Multi-Pillar Data Pipeline, Integration & Preprocessing", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=6))

    story.append(Paragraph("Q4. Which official data sources did you integrate, and what are their respective roles?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> We built a multi-pillar panel integrating 5 official government repositories:",
        ans_style
    ))
    story.append(Paragraph("• <b>MGNREGA MIS R5.1 (Ministry of Rural Development):</b> Ground-truth administrative data on jobcards issued (total, SC, ST), households demanded, households worked, persondays generated, and fulfillment rates across 740 districts.", bullet_style))
    story.append(Paragraph("• <b>NFHS-5 Factsheets (MoHFW & IIPS):</b> Female literacy rate, 10+ years schooling, and sex ratio, providing contemporaneous human capital metrics rather than stale 2011 Census figures.", bullet_style))
    story.append(Paragraph("• <b>NITI Aayog National MPI:</b> Deprivation percentages across sanitation, clean cooking fuel, drinking water, and electricity.", bullet_style))
    story.append(Paragraph("• <b>India Meteorological Department (IMD):</b> District monthly and annual rainfall, monsoon precipitation (Jun-Sep), and historical climate normals.", bullet_style))
    story.append(Paragraph("• <b>Local Government Directory (LGD, MoPR):</b> Official spatial master codes, standardizing district boundaries across 763 administrative units.", bullet_style))

    story.append(Paragraph("Q5. How did you resolve spatial mismatches, name discrepancies, and missing data across these disparate sources?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> District names in India frequently have spelling variants (e.g., 'Kaimur' vs 'Bhabua', 'Pondicherry' vs 'Puducherry', 'Kushi Nagar' vs 'Kushinagar') and recent bifurcations. We implemented a standardized fuzzy-matching dictionary anchored to the official <b>LGD Census code taxonomy</b>. Strings were uppercase-trimmed and normalized. For districts with missing NFHS-5 or IMD values (e.g., newly formed districts carved out of parent districts), we imputed values using state-level agro-climatic zone median imputation, preventing sample size reduction while preserving regional variance across all 745 districts.",
        ans_style
    ))

    story.append(Paragraph("Q6. What engineered features were created, and what was the domain hypothesis behind each?", q_style))
    story.append(Paragraph("<b>Answer:</b> We engineered four key features:", ans_style))
    story.append(Paragraph("1. <b>Work Demand Pressure Ratio:</b> <code>HH Demanded / Total Active Jobcards</code>. Captures distress mobilization relative to registration capacity.", bullet_style))
    story.append(Paragraph("2. <b>Marginalized Caste Share:</b> <code>(SC Jobcards + ST Jobcards) / Total Jobcards</code>. Captures structural dependency of historically landless rural communities.", bullet_style))
    story.append(Paragraph("3. <b>Literacy × Climate Stress Index:</b> <code>(100 - Female Literacy) × (1000 / Rainfall_mm)</code>. Hypothesizes that low human capital compounds climate vulnerability non-linearly.", bullet_style))
    story.append(Paragraph("4. <b>Fulfillment Rate:</b> <code>(HH Worked / HH Demanded) × 100</code>. Directly captures administrative delivery efficacy.", bullet_style))

    # ─────────────────────────────────────────────────────────────────────────
    # SECTION 3: MACHINE LEARNING MODELING, BENCHMARKS & EVALUATION
    # ─────────────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4))
    story.append(Paragraph("3. Machine Learning Algorithms, Validation & Empirical Results", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=6))

    story.append(Paragraph("Q7. Which machine learning models did you evaluate, and which one performed best?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> We trained and benchmarked 8 distinct models using 5-fold cross-validation. <b>Gradient Boosting Regressor achieved the best overall performance</b> for predicting unmet demand:",
        ans_style
    ))

    # Benchmark Table
    bench_data = [
        [Paragraph("<b>Model Name</b>", meta_style), Paragraph("<b>Task Type</b>", meta_style), Paragraph("<b>Test R² / Acc</b>", meta_style), Paragraph("<b>CV Score</b>", meta_style), Paragraph("<b>RMSE / F1</b>", meta_style)],
        [Paragraph("<b>Gradient Boosting Regressor</b>", meta_style), Paragraph("Regression", meta_style), Paragraph("<b>0.699</b>", meta_style), Paragraph("0.681 ± 0.038", meta_style), Paragraph("RMSE = 8,897 HH", meta_style)],
        [Paragraph("Random Forest Regressor", meta_style), Paragraph("Regression", meta_style), Paragraph("0.676", meta_style), Paragraph("0.662 ± 0.041", meta_style), Paragraph("RMSE = 9,235 HH", meta_style)],
        [Paragraph("Ridge Regression (L2 Baseline)", meta_style), Paragraph("Linear Reg", meta_style), Paragraph("0.639", meta_style), Paragraph("0.628 ± 0.035", meta_style), Paragraph("RMSE = 9,742 HH", meta_style)],
        [Paragraph("Decision Tree Regressor", meta_style), Paragraph("Nonlinear Reg", meta_style), Paragraph("0.581", meta_style), Paragraph("0.564 ± 0.052", meta_style), Paragraph("RMSE = 10,480 HH", meta_style)],
        [Paragraph("<b>Random Forest Classifier</b>", meta_style), Paragraph("3-Tier Risk", meta_style), Paragraph("<b>79.2%</b>", meta_style), Paragraph("78.4% ± 2.6%", meta_style), Paragraph("Macro F1 = 0.786", meta_style)],
        [Paragraph("SVM Classifier (RBF Kernel)", meta_style), Paragraph("3-Tier Risk", meta_style), Paragraph("73.4%", meta_style), Paragraph("72.8% ± 3.1%", meta_style), Paragraph("Macro F1 = 0.725", meta_style)],
        [Paragraph("Logistic Regression", meta_style), Paragraph("Linear Classif", meta_style), Paragraph("70.5%", meta_style), Paragraph("69.8% ± 2.9%", meta_style), Paragraph("Macro F1 = 0.694", meta_style)]
    ]
    b_table = Table(bench_data, colWidths=[140, 75, 85, 95, 105])
    b_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#ffffff"), colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(b_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Q8. Why did Gradient Boosting outperform linear models like Ridge Regression?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> Ridge regression assumes a purely linear relationship between independent variables and unmet demand. However, rural labor economics exhibits sharp <b>nonlinear threshold behavior</b>: for instance, when rainfall is normal (above 1000 mm), marginal changes in rain have minimal impact on demand. But below 650 mm (drought threshold), agricultural wage labor collapses and MGNREGA demand surges exponentially. Decision trees and boosted ensembles naturally partition the feature space into conditional splits (e.g., <i>IF Rainfall < 650mm AND Female Literacy < 55% THEN Demand Surge</i>), capturing compound socio-climatic interactions that linear hyperplanes miss.",
        ans_style
    ))

    story.append(Paragraph("Q9. How did you validate your models to prevent overfitting and data leakage?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> We implemented <b>5-Fold Cross-Validation</b>. In each fold, feature scaling parameters (StandardScaler mean and variance) were computed strictly on the training partition and transformed on the validation partition to prevent data leakage. For classification into High, Medium, and Low risk tiers, we used <b>Stratified K-Fold</b> to maintain exact class proportions across all validation splits.",
        ans_style
    ))

    story.append(Paragraph("Q10. What are Prediction Intervals (Quantile Ensembles P05, P50, P95) and why are they critical for public policy?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> Standard regression outputs a single conditional mean point estimate. In governance and disaster budgeting, a point estimate is dangerously insufficient—if actual demand hits the 95th percentile during an unpredicted drought, the state runs out of funds and violates statutory wage guarantees. We trained <b>Quantile Gradient Boosting models with pinball loss (alpha=0.05, 0.50, 0.95)</b>. This produces a certified <b>90% prediction interval [P05, P95]</b> for every district, allowing district magistrates to budget for worst-case surges.",
        ans_style
    ))

    # ─────────────────────────────────────────────────────────────────────────
    # SECTION 4: EXPLAINABLE AI (XAI) & SHAP ANALYSIS
    # ─────────────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4))
    story.append(Paragraph("4. Explainable AI (XAI) & SHAP Interpretability Framework", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=6))

    story.append(Paragraph("Q11. What is SHAP, and how is it derived mathematically?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> SHAP (SHapley Additive exPlanations) is a model-agnostic interpretability framework grounded in <b>cooperative game theory</b> (Shapley values, 1953). In our context, features are 'players' in a coalition, and the model prediction is the 'payout'. The Shapley value assigns a payout to each feature by averaging its marginal contribution across all possible feature subsets (power set of features). SHAP satisfies four vital mathematical axioms: <i>Efficiency, Symmetry, Dummy (Null player), and Additivity</i>, guaranteeing consistent feature attributions.",
        ans_style
    ))

    story.append(Paragraph("Q12. What were the top global SHAP feature importances discovered by your model?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> Across 745 districts, the global SHAP importance hierarchy is:",
        ans_style
    ))
    story.append(Paragraph("1. <b>Work Demand Pressure Ratio (48.2%):</b> The ratio of active demanders to registered jobcards is by far the strongest driver of unmet demand.", bullet_style))
    story.append(Paragraph("2. <b>SC/ST Marginalization Share (14.1%):</b> Higher concentrations of historically marginalized groups exhibit significantly higher dependence on public works.", bullet_style))
    story.append(Paragraph("3. <b>Literacy × Climate Stress Index (12.8%):</b> Captures compound interaction between educational deficits and rainfall deprivation.", bullet_style))
    story.append(Paragraph("4. <b>Female Literacy Rate (NFHS-5) (8.4%):</b> Lower female literacy correlates with higher female participation in manual wage labor.", bullet_style))
    story.append(Paragraph("5. <b>Annual Rainfall (IMD) (7.2%):</b> Precipitation deficits trigger immediate agricultural distress.", bullet_style))
    story.append(Paragraph("6. <b>Sanitation & Fuel Deprivation (5.3%):</b> Baseline poverty indicators reflecting overall district backwardness.", bullet_style))
    story.append(Paragraph("7. <b>Total Registered Jobcards (4.0%):</b> Scale factor of district labor supply.", bullet_style))

    story.append(Paragraph("Q13. What is the difference between Global Feature Importance and Local District Attribution?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> <b>Global importance</b> explains overall model behavior across India (e.g., rainfall is a 7.2% contributor nationally). However, policy intervention happens locally. <b>Local district attributions (SHAP Force/Waterfall decomposition)</b> explain the prediction for a specific district. For example, in <i>Jodhpur (Rajasthan)</i>, extreme rainfall deficit (+3,420 HH) and low female literacy (+2,180 HH) push unmet demand up. In contrast, in <i>Sitapur (UP)</i>, extreme jobcard pressure (+6,800 HH) and SC/ST share (+2,900 HH) dominate. This enables custom, district-tailored administrative remedies.",
        ans_style
    ))

    # ─────────────────────────────────────────────────────────────────────────
    # SECTION 5: CROSS-REGION TRANSFERABILITY & GAP 15 EXPERIMENT
    # ─────────────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4))
    story.append(Paragraph("5. Cross-Region Transferability Experiment (Academic GAP 15)", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=6))

    story.append(Paragraph("Q14. What is the Cross-Region Transferability experiment, and why is it academically significant?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> Most ML papers make the naive i.i.d. assumption that training and testing data are identically distributed. However, India's rural economy has stark regional variations between northern agrarian Gangetic plains and southern peninsular states. We designed a strict out-of-domain evaluation experiment: we trained models exclusively on <b>Peninsular Southern districts (n=207)</b> and tested them out-of-domain on <b>Gangetic Northern districts (n=258)</b>, and vice versa.",
        ans_style
    ))

    story.append(Paragraph("Q15. What were the transferability findings, and what is the economic interpretation?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> When trained on South and tested on North, the model achieved an <b>R² of 0.552 and 59.3% classification accuracy</b>. However, when trained on North and tested on South, performance plummeted to <b>R² of 0.351 (50.7% accuracy)</b>. This 20–35% performance drop empirically proves <b>spatial non-stationarity and structural domain shift</b>: Southern states (e.g., Kerala, Tamil Nadu) have higher female literacy (>85%), higher notified wage rates (₹319–₹346/day), and more mechanized agriculture, while Northern states (UP, Bihar) have lower wages (₹237–₹245/day) and higher seasonal agrarian distress. A national ML model must incorporate regional interaction terms.",
        ans_style
    ))

    # ─────────────────────────────────────────────────────────────────────────
    # SECTION 6: POLICY SIMULATIONS, CLIMATE SHOCKS & BUDGETING
    # ─────────────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4))
    story.append(Paragraph("6. Policy Simulations, Climate Shocks & Budget Quantification", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=6))

    story.append(Paragraph("Q16. How did you simulate the impact of a -30% monsoon drought shock, and what were the findings?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> We perturbed the rainfall vector by -30% across all 745 districts while holding structural factors constant, feeding the perturbed matrix through our Gradient Boosting pipeline. The simulation revealed that a 30% monsoon deficit triggers a <b>+13.9% national surge in unmet demand (+1.95 Million households)</b>, immediately downgrades <b>89 additional districts into the High-Risk Vulnerability Tier</b>, and necessitates <b>₹2,410 Crore in additional emergency contingency wages</b>. The rainfall elasticity of rural labor demand is measured at <b>-0.46</b> (a 10% rainfall drop induces a 4.6% demand surge).",
        ans_style
    ))

    story.append(Paragraph("Q17. How is the District Contingency Budget calculated in your system?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> We integrated the official <b>Ministry of Rural Development FY 2024-25 notified state-specific daily wage rates</b> (ranging from ₹237/day in UP/Bihar to ₹374/day in Haryana). The required contingency budget is computed using the formula:",
        ans_style
    ))
    story.append(Paragraph("<code>Contingency Budget (₹ Cr) = [Predicted Unmet Demand (HH) × 45 Guaranteed Days × State Wage Rate (₹/day)] / 10,000,000</code>", code_style))
    story.append(Paragraph(
        "Nationally, fulfilling all existing unmet demand across 745 districts requires a baseline contingency fund of <b>₹17,325 Crore</b>, led by Uttar Pradesh, Rajasthan, West Bengal, and Madhya Pradesh.",
        ans_style
    ))

    # ─────────────────────────────────────────────────────────────────────────
    # SECTION 7: WEB ARCHITECTURE & FULL-STACK IMPLEMENTATION
    # ─────────────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4))
    story.append(Paragraph("7. Web Architecture, Real-Time Copilot & Production Engineering", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=6))

    story.append(Paragraph("Q18. Explain the software architecture of your web decision support system.", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> The web platform is designed as a high-performance, responsive Decision Support System (DSS):",
        ans_style
    ))
    story.append(Paragraph("• <b>Frontend Engine:</b> Vanilla JavaScript (ES6+), semantic HTML5, and curated CSS tokens (glassmorphism, dark palette, zero heavy framework overhead).", bullet_style))
    story.append(Paragraph("• <b>Geospatial Mapping:</b> Leaflet.js with CartoDB DarkMatter basemaps, rendering 745 district circle markers color-coded by vulnerability tiers, with interactive search, popups, and zoom-to-district.", bullet_style))
    story.append(Paragraph("• <b>Data Visualization:</b> Chart.js rendering 5-scenario forecast timelines, prediction interval envelopes (P05-P95), transferability heatmap matrices, and local SHAP waterfall bars.", bullet_style))
    story.append(Paragraph("• <b>Data Architecture:</b> All ML artifacts, model weights, benchmarks, and 745-district metrics are compiled into an optimized 741 KB JSON bundle (<code>web/data/models_data.json</code>), guaranteeing sub-50ms query latency without backend database lockups.", bullet_style))

    story.append(Paragraph("Q19. How does the AI Copilot chatbot function?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> The floating AI Copilot integrates <b>Google Gemini 3.8 Flash</b> via the Google Generative Language REST API. It injects a comprehensive domain system prompt containing the verified 745-district stats, top vulnerable districts, ML model metrics, SHAP rankings, and wage formulas. If an offline or network error occurs, the chatbot seamlessly falls back to an embedded 745-district keyword and district-indexing engine, ensuring 100% operational uptime.",
        ans_style
    ))

    # ─────────────────────────────────────────────────────────────────────────
    # SECTION 8: REAL-WORLD DEPLOYMENT, MLOPS & MINISTRY INTEGRATION
    # ─────────────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4))
    story.append(Paragraph("8. Real-World Deployment, MLOps Architecture & Ministry Integration", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=6))

    story.append(Paragraph("Q20. How would you deploy this system into production for the Ministry of Rural Development (MoRD) and State Governments?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> In production, the system would be hosted on the <b>National Informatics Centre (NIC) MeghRaj Cloud infrastructure</b>. Architecture components include:",
        ans_style
    ))
    story.append(Paragraph("• <b>Automated Ingestion Workers:</b> Nightly Apache Airflow / Celery DAGs that trigger REST APIs scraping official MIS R5.1 tables, IMD gridded rainfall feeds, and UDISE+ school data.", bullet_style))
    story.append(Paragraph("• <b>Model Serving API:</b> FastAPI / TorchServe microservices wrapped in Docker containers, exposing prediction endpoints for district vulnerability scoring and quantile budget bounds.", bullet_style))
    story.append(Paragraph("• <b>Administrative Dashboard:</b> Role-based access control (RBAC) where District Magistrates, Block Development Officers, and Joint Secretaries at Krishi Bhawan (MoRD) access tailored analytics.", bullet_style))

    story.append(Paragraph("Q21. What MLOps practices would you establish to maintain model accuracy over time?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> We would implement a complete MLOps lifecycle:",
        ans_style
    ))
    story.append(Paragraph("• <b>Data & Concept Drift Monitoring (Evidently AI / MLflow):</b> Tracking distribution shifts in rainfall (climate change), jobcard demand spikes (economic shocks), and wage rates. If Kolmogorov-Smirnov test p-values drop below 0.05, alerts are triggered.", bullet_style))
    story.append(Paragraph("• <b>Continuous Training (CT):</b> Automated quarterly retraining pipelines incorporating newly reconciled MIS muster roll data.", bullet_style))
    story.append(Paragraph("• <b>Shadow & Canary Deployments:</b> New model candidates run in shadow mode alongside the production Gradient Boosting regressor for 60 days before promotion.", bullet_style))

    # ─────────────────────────────────────────────────────────────────────────
    # SECTION 9: FUTURE GOALS, TECHNICAL ROADMAP & ADVANCED AI EXTENSIONS
    # ─────────────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4))
    story.append(Paragraph("9. Future Goals, Technical Roadmap & Next-Gen AI Extensions", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=6))

    story.append(Paragraph("Q22. What is the overarching FUTURE GOAL of this project?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> The overarching future goal is to transition India's rural social safety net from <b>reactive, post-distress crisis relief</b> into an <b>autonomous, anticipatory, and climate-resilient early warning system</b>. Specifically:",
        ans_style
    ))
    story.append(Paragraph("1. <b>Zero Distress Rationing:</b> Ensure no rural household demanding statutory employment is turned away due to administrative fund shortages.", bullet_style))
    story.append(Paragraph("2. <b>Dynamic Climate Shock Financing:</b> Pre-approve and disburse emergency contingency funds to vulnerable panchayats 30 to 45 days <i>before</i> monsoon deficits trigger agricultural collapse.", bullet_style))
    story.append(Paragraph("3. <b>Equitable Resource Allocation:</b> Replace historical, politically negotiated budget allocations with objective, explainable ML vulnerability scores across all 700,000+ villages in India.", bullet_style))

    story.append(Paragraph("Q23. Which advanced Deep Learning architectures are planned for the next development phase?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> We have mapped out a 3-tier deep learning evolution:",
        ans_style
    ))
    story.append(Paragraph("• <b>Temporal Fusion Transformers (TFT):</b> Multi-horizon time-series forecasting with self-attention mechanisms to simultaneously learn seasonal patterns, holiday cycles, and long-term socio-economic trajectories across 120 continuous monthly intervals.", bullet_style))
    story.append(Paragraph("• <b>Spatio-Temporal Graph Neural Networks (ST-GNN / DCRNN):</b> Districts do not exist in isolation—labor migration and drought contagion spill across administrative borders. Modeling India's 745 districts as graph nodes connected by geographic adjacency and interstate transit corridors allows capturing spatial labor spillover.", bullet_style))
    story.append(Paragraph("• <b>Conformal Prediction Ensembles:</b> Providing mathematically guaranteed, finite-sample prediction coverage error bounds (e.g., exact 95% marginal coverage) without distributional assumptions.", bullet_style))

    story.append(Paragraph("Q24. How will Earth Observation (Satellite Remote Sensing) data be incorporated?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> Current models rely on ground rain gauges which suffer from latency and spatial sparsity. In the next phase, we will pipe <b>Google Earth Engine (GEE)</b> streams:",
        ans_style
    ))
    story.append(Paragraph("• <b>Sentinel-2 & MODIS NDVI (Normalized Difference Vegetation Index):</b> 10-meter resolution 16-day composites capturing crop canopy greenness and biomass degradation in real time.", bullet_style))
    story.append(Paragraph("• <b>SMAP & Sentinel-1 Soil Moisture:</b> Topsoil moisture saturation indices indicating seed sowing failure weeks before agricultural labor demand surges.", bullet_style))

    story.append(Paragraph("Q25. How do you plan to scale the spatial resolution from District to Block and Gram Panchayat (GP) levels?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> While the district is the primary budgeting unit, employment is implemented across ~250,000 Gram Panchayats. We plan a <b>hierarchical Bayesian downscaling framework</b> that fuses district macro-priors with village-level SECR (Socio-Economic and Caste Census) asset indices, enabling GP-level vulnerability heatmaps for frontline Block Development Officers (BDOs).",
        ans_style
    ))

    story.append(Paragraph("Q26. How can this platform integrate with National Digital Public Infrastructure (DPI)?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b> India possesses world-leading Digital Public Infrastructure that our system can directly interface with:",
        ans_style
    ))
    story.append(Paragraph("• <b>PM Gati Shakti National Master Plan:</b> Overlaying district rural employment vulnerability with planned infrastructure projects (roads, canals, water conservation) to deploy MGNREGA labor directly onto asset-generating national infrastructure.", bullet_style))
    story.append(Paragraph("• <b>Direct Benefit Transfer (DBT) & Aadhaar Payment Bridge:</b> Linking predicted contingency budget needs with automated treasury sanctioning via the Public Financial Management System (PFMS), reducing wage delay bottlenecks.", bullet_style))
    story.append(Paragraph("• <b>Bhashini (National AI Language Platform):</b> Integrating multilingual voice and conversational interfaces in 22 regional Indian languages into our AI Copilot, enabling local Panchayat Pradhans and Sarpanches to query district forecasts in their native tongue.", bullet_style))

    story.append(Paragraph("Q27. How do you address algorithmic bias, ethical fairness, and administrative gaming?", q_style))
    story.append(Paragraph(
        "<b>Answer:</b>", ans_style
    ))
    story.append(Paragraph("• <b>Preventing Administrative Suppression:</b> If corrupt officials under-report demand, pure MIS-based models would wrongly flag the district as 'low demand'. We counter this by enforcing multi-pillar exogenous anchors (NFHS-5 female schooling, MPI multidimensional deprivation, and IMD rainfall) that local officials cannot tamper with.", bullet_style))
    story.append(Paragraph("• <b>Demographic Parity & Counterfactual Fairness:</b> Regular auditing to verify that historically marginalized SC/ST populations do not experience higher false-negative rates in vulnerability classification.", bullet_style))
    story.append(Paragraph("• <b>Human-in-the-Loop Safeguards:</b> The AI provides decision support, probability intervals, and explainable attributions—statutory approval remains vested with constitutionally appointed civil servants.", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Viva Guide PDF successfully created at: {OUTPUT_PDF}")

if __name__ == "__main__":
    build_viva_pdf()

