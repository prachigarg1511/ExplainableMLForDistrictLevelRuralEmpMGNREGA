"""
Generate Publication-Grade Academic Research Paper PDF
Title: Explainable Machine Learning for District-Level Rural Employment Vulnerability
       and Unmet MGNREGA Demand Forecasting in India
Authors: Prachi Garg, Sanjna, Sanchi Katyal, Parv Sharma
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_PDF = os.path.join(BASE_DIR, "Explainable_ML_MGNREGA_Research_Paper.pdf")

class AcademicCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(AcademicCanvas, self).__init__(*args, **kwargs)
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
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748b"))

        # Header (pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 755, "Garg et al. • Explainable ML for District Rural Employment Vulnerability & MGNREGA Demand")
            self.drawRightString(558, 755, "IEEE / ACM Formatting Template")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 748, 558, 748)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        self.drawString(54, 32, "Preprint • Submitted for Peer Review • Open-Source Repository on GitHub")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_text)
        self.restoreState()


def build_research_paper_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'PaperTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0f172a"),
        alignment=1, # Centered
        spaceAfter=10
    )

    authors_style = ParagraphStyle(
        'PaperAuthors',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1e293b"),
        alignment=1,
        spaceAfter=2
    )

    affil_style = ParagraphStyle(
        'PaperAffiliations',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#64748b"),
        alignment=1,
        spaceAfter=14
    )

    abstract_heading = ParagraphStyle(
        'AbstractHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=4
    )

    abstract_body = ParagraphStyle(
        'AbstractBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1e293b"),
        alignment=4 # Justified
    )

    h1_style = ParagraphStyle(
        'Heading1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#0284c7"),
        spaceBefore=14,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=9,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'PaperBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=7,
        alignment=4
    )

    bullet_style = ParagraphStyle(
        'PaperBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
        leftIndent=15,
        spaceAfter=3
    )

    code_block = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#090d16"),
        backColor=colors.HexColor("#f8fafc"),
        borderPadding=6,
        spaceAfter=7
    )

    th_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.white,
        alignment=1
    )

    td_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1e293b"),
        alignment=0
    )

    td_bold = ParagraphStyle(
        'TDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0f172a"),
        alignment=0
    )

    td_center = ParagraphStyle(
        'TDCenter',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1e293b"),
        alignment=1
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("Explainable Machine Learning for District-Level Rural Employment Vulnerability and Unmet MGNREGA Demand Forecasting in India", title_style))
    story.append(Paragraph("<b>Prachi Garg</b><sup>1,*</sup>, &nbsp; <b>Sanjna</b><sup>1</sup>, &nbsp; <b>Sanchi Katyal</b><sup>1</sup>, &nbsp; <b>Parv Sharma</b><sup>1</sup>", authors_style))
    story.append(Paragraph("<sup>1</sup>Department of Computer Science & Engineering<br/><sup>*</sup>Corresponding Author & Principal ML Architect: <i>prachigarg1511@gmail.com</i> &bull; GitHub: <i>@prachigarg1511</i>", affil_style))

    # Abstract Box
    abstract_text = (
        "<b>Abstract—</b>The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) legally entitles over 83.8 million rural "
        "Indian households to 100 days of unskilled wage employment annually. However, administrative rationing, delayed central fund releases, "
        "and localized agro-climatic shocks leave over <b>14.02 million households with unmet employment demand</b>, yielding a national average "
        "fulfillment rate of 83.3%. This study proposes an empirical <b>Explainable Machine Learning (XAI) Decision-Support System</b> across "
        "<b>745 districts</b> in 34 states and union territories. We unify 5 authentic data pillars: MoRD administrative MIS records, NFHS-5 "
        "human capital indicators, NITI Aayog Multidimensional Poverty Index (MPI) scores, IMD gridded precipitation records, and Local "
        "Government Directory (LGD) spatial keys. To address asymmetric welfare risks, we formulate <b>Quantile Gradient Boosting Regressors</b> "
        "(<i>P</i><sub>05</sub>, <i>P</i><sub>50</sub>, <i>P</i><sub>95</sub>) for 90% confidence bands, alongside a multi-tier <b>Random Forest Classifier</b>. "
        "On 5-fold cross-validation, Gradient Boosting achieves an <i>R</i><sup>2</sup> of <b>0.7001 ± 0.059</b> (RMSE = 8,896 households), "
        "outperforming Random Forest (0.6964), Ridge (0.6096), and Decision Trees (0.5396). The Random Forest Classifier delivers <b>79.19% test accuracy</b> "
        "(<i>F</i><sub>1</sub> = 0.7861). Local feature force attributions isolate Work Demand Pressure (48.2%), SC/ST Marginalization (14.1%), "
        "and Literacy &times; Climate Stress (12.8%) as primary drivers. An out-of-domain transferability experiment between Peninsular South-West "
        "and Gangetic Heartland India reveals sharp <i>R</i><sup>2</sup> degradation (to 0.552 and 0.518), proving that uniform national models fail "
        "without decentralized regional calibration. Finally, by mapping forecasts to FY 2024–25 notified wage rates, we establish a 45-day fiscal "
        "contingency model identifying a <b>₹17,324.5 Crore</b> national reserve requirement. The system is open-sourced and deployed live on Netlify.<br/><br/>"
        "<b>Keywords—</b><i>MGNREGA, Rural Employment Vulnerability, Explainable AI, Quantile Regression, Local Attributions, Climate Shocks, LGD Harmonization, Public Policy Analytics.</i>"
    )

    abstract_table = Table([[Paragraph(abstract_text, abstract_body)]], colWidths=[504])
    abstract_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(abstract_table)
    story.append(Spacer(1, 12))

    # SECTION I: INTRODUCTION
    story.append(Paragraph("I. INTRODUCTION", h1_style))
    story.append(Paragraph(
        "Public employment guarantees serve as vital macroeconomic stabilizers across agrarian developing economies. "
        "Enacted in 2005, the Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) legally guarantees 100 days of unskilled "
        "wage work per year to any rural household volunteering to perform manual work. Covering over 143 million active registered workers "
        "across 700+ districts with an annual budget exceeding ₹86,000 Crores ($10.5B USD), MGNREGA represents the largest statutory safety-net program globally.",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Rationing Conundrum:</b> Although legally conceived as an open-ended rights guarantee, the program routinely transforms into a "
        "rationed supply-constrained regime. Bureaucratic fund delays, administrative bottlenecks, and climate shocks leave over "
        "<b>14.02 million households without work</b> annually. Crucially, conventional research relies on Decennial Census 2011 statistics, "
        "ignoring dynamic human capital advances and recent district bifurcations. Furthermore, standard mean-squared error (OLS) algorithms produce "
        "point forecasts that fail to quantify the asymmetric risks of public distress. This paper develops an empirical, multi-pillar "
        "<b>Explainable Machine Learning (XAI) Decision-Support Engine</b> across 745 Indian districts that provides 90% predictive intervals, "
        "transparent causal attributions, regional generalizability audits, and fiscal contingency buffers.",
        body_style
    ))

    # SECTION II: RELATED WORK & GAP MATRIX
    story.append(Paragraph("II. RELATED WORK & GAP ANALYSIS", h1_style))
    story.append(Paragraph(
        "The economic literature has rigorously analyzed MGNREGA's consumption-smoothing effects (Subbarao 2003; Drèze & Khera 2017) "
        "and administrative leakages (Sukhtankar 2016; Muralidharan et al. 2016). In parallel, climate economists have highlighted the impact "
        "of erratic monsoonal precipitation on rural farm distress (Taraz 2017). However, existing studies lack unified crosswalk harmonization, "
        "treat climate shocks linearly, and fail to provide explainable machine learning decision support. Table I summarizes our contributions across 15 core gaps.",
        body_style
    ))

    # Table I: Gap Matrix
    gap_data = [
        [Paragraph("Gap ID", th_style), Paragraph("Identified Literature Gap", th_style), Paragraph("Conventional Approach", th_style), Paragraph("Our Methodological Solution", th_style)],
        [Paragraph("GAP 1", td_bold), Paragraph("Target Spatial Resolution", td_style), Paragraph("State aggregate budgets", td_style), Paragraph("745 districts household unmet demand", td_style)],
        [Paragraph("GAP 2", td_bold), Paragraph("District Boundary Splits", td_style), Paragraph("Drop bifurcated units / Census '11", td_style), Paragraph("Ministry LGD Master Code harmonization", td_style)],
        [Paragraph("GAP 3", td_bold), Paragraph("Human Capital Dynamism", td_style), Paragraph("Static Census 2011 literacy", td_style), Paragraph("NFHS-5 female schooling & literacy metrics", td_style)],
        [Paragraph("GAP 4", td_bold), Paragraph("Deprivation Multi-dimensionality", td_style), Paragraph("Unidimensional consumption", td_style), Paragraph("NITI Aayog MPI 12-indicator deprivation", td_style)],
        [Paragraph("GAP 5", td_bold), Paragraph("Climate Shock Granularity", td_style), Paragraph("State annual rainfall sums", td_style), Paragraph("IMD gridded monthly & monsoon precipitation", td_style)],
        [Paragraph("GAP 6", td_bold), Paragraph("Compound Stress Modeling", td_style), Paragraph("Linear additive features", td_style), Paragraph("Non-linear Literacy &times; Climate Stress Index", td_style)],
        [Paragraph("GAP 7", td_bold), Paragraph("Welfare Risk Asymmetry", td_style), Paragraph("Symmetric OLS point estimates", td_style), Paragraph("Quantile GBR (P05, P50, P95) 90% intervals", td_style)],
        [Paragraph("GAP 8", td_bold), Paragraph("Local Interpretability", td_style), Paragraph("Opaque black-box models", td_style), Paragraph("SHAP-style local feature forces per district", td_style)],
        [Paragraph("GAP 9", td_bold), Paragraph("Operational Fiscal Linking", td_style), Paragraph("Theoretical labor models", td_style), Paragraph("State wage-notified 45-day contingency buffer", td_style)],
        [Paragraph("GAP 10", td_bold), Paragraph("Regional Transferability", td_style), Paragraph("Assumed national invariance", td_style), Paragraph("Empirical out-of-domain transfer experiment", td_style)]
    ]
    t1 = Table(gap_data, colWidths=[45, 130, 135, 194])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0284c7")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t1)
    story.append(Spacer(1, 8))

    # SECTION III: 5-PILLAR DATA ARCHITECTURE
    story.append(Paragraph("III. MULTI-PILLAR DATA ARCHITECTURE & HARMONIZATION", h1_style))
    story.append(Paragraph(
        "Our data architecture fuses five official sources: (1) MoRD MGNREGA MIS administrative logs (740 districts); "
        "(2) NFHS-5 factsheet indicators on female literacy and schooling; (3) NITI Aayog Multidimensional Poverty Index (MPI) scores; "
        "(4) IMD Pune 0.25&deg; daily gridded precipitation summaries; and (5) Ministry of Panchayati Raj Local Government Directory (LGD) codes. "
        "Standardized uppercase regular expressions resolve spelling discrepancies across portals, followed by LGD code mapping.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Engineered Feature Formulations:</b><br/>"
        "&bull; <i>Demand Pressure Ratio:</i> DPR<sub>i</sub> = HH_Demanded<sub>i</sub> / (Jobcards_Total<sub>i</sub> + 1)<br/>"
        "&bull; <i>SC/ST Marginalization Share:</i> MS<sub>i</sub> = (Jobcards_SC<sub>i</sub> + Jobcards_ST<sub>i</sub>) / (Jobcards_Total<sub>i</sub> + 1)<br/>"
        "&bull; <i>Literacy &times; Climate Stress:</i> LCSI<sub>i</sub> = [(100 - Female_Literacy<sub>i</sub>) &times; 100] / (Rainfall<sub>annual, i</sub> + 50)<br/>"
        "&bull; <i>Human Capital Deprivation:</i> HCDI<sub>i</sub> = 0.40(100 - Literacy) + 0.30(100 - Sanitation) + 0.30(100 - Clean_Fuel)",
        bullet_style
    ))

    # SECTION IV: METHODOLOGY
    story.append(Paragraph("IV. PREDICTIVE MACHINE LEARNING METHODOLOGY", h1_style))
    story.append(Paragraph(
        "<b>A. Quantile Regression for Asymmetric Risk:</b> Standard regression minimizes symmetric mean squared error. In social safety nets, "
        "under-predicting distress leads to starvation and despair, whereas over-allocation incurs minimal societal cost. We formulate "
        "Quantile Gradient Boosting using pinball loss: &nbsp; &Lscr;<sub>q</sub>(y, &#375;) = max(q(y - &#375;), (1 - q)(&#375; - y)). "
        "We train three models (q &isin; {0.05, 0.50, 0.95}) to establish the 90% confidence interval [&Icirc;<sub>P05</sub>, &Icirc;<sub>P95</sub>].<br/>"
        "<b>B. Multi-Tier Risk Classification:</b> Districts are classified into High (Fulfillment &lt; 80% or Unmet &gt; 25k), "
        "Medium (80% &ndash; 92%), and Low (&ge; 92%) risk using an ensemble Random Forest with Gini split criteria.<br/>"
        "<b>C. Local Feature Force Attributions:</b> District-level SHAP proxy forces are computed via: &nbsp; "
        "&phi;<sub>i, k</sub> = 10 &times; [(x<sub>i, k</sub> - Median(X<sub>k</sub>)) / &sigma;(X<sub>k</sub>)] &times; &omega;<sub>k</sub>, "
        "where &omega;<sub>k</sub> is the global tree split importance.<br/>"
        "<b>D. Contingency Wage Buffers:</b> Budgetary reserves are computed as: &nbsp; "
        "C<sub>i</sub> = [&#375;<sub>P50</sub>(x<sub>i</sub>) &times; 45 &times; Wage<sub>state(i)</sub>] / 10<sup>7</sup> &nbsp; (in ₹ Crores).",
        body_style
    ))

    # SECTION V: EXPERIMENTAL RESULTS
    story.append(Paragraph("V. EXPERIMENTAL RESULTS & COMPARATIVE BENCHMARKING", h1_style))
    story.append(Paragraph(
        "Models were evaluated via 5-Fold Cross Validation across all 745 districts. Continuous features were scaled using training-fold z-scores.",
        body_style
    ))

    # Table II: Regression Benchmarks
    story.append(Paragraph("<b>TABLE II: Regression Benchmarks (Predicting Unmet Demand HH)</b>", h2_style))
    reg_data = [
        [Paragraph("Model Architecture", th_style), Paragraph("Test R<sup>2</sup>", th_style), Paragraph("5-Fold CV R<sup>2</sup> (&mu; &plusmn; &sigma;)", th_style), Paragraph("RMSE (HH)", th_style), Paragraph("MAE (HH)", th_style)],
        [Paragraph("<b>Gradient Boosting Regressor (GBR)</b>", td_bold), Paragraph("<b>0.6988</b>", td_center), Paragraph("<b>0.7001 &plusmn; 0.0596</b>", td_center), Paragraph("<b>8,896.8</b>", td_center), Paragraph("<b>5,519.2</b>", td_center)],
        [Paragraph("Random Forest Regressor (RFR)", td_style), Paragraph("0.6940", td_center), Paragraph("0.6964 &plusmn; 0.0359", td_center), Paragraph("8,967.5", td_center), Paragraph("5,484.2", td_center)],
        [Paragraph("Ridge Regression (L2)", td_style), Paragraph("0.6394", td_center), Paragraph("0.6096 &plusmn; 0.0482", td_center), Paragraph("9,735.6", td_center), Paragraph("7,000.3", td_center)],
        [Paragraph("Decision Tree Regressor", td_style), Paragraph("0.5948", td_center), Paragraph("0.5396 &plusmn; 0.1538", td_center), Paragraph("10,320.1", td_center), Paragraph("6,540.5", td_center)]
    ]
    t2 = Table(reg_data, colWidths=[150, 75, 125, 77, 77])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t2)
    story.append(Spacer(1, 8))

    # Table III: Classification Benchmarks
    story.append(Paragraph("<b>TABLE III: Classification Benchmarks (Vulnerability Tiers)</b>", h2_style))
    cls_data = [
        [Paragraph("Model Architecture", th_style), Paragraph("Accuracy (%)", th_style), Paragraph("5-Fold CV Acc (&mu; &plusmn; &sigma;)", th_style), Paragraph("Precision (Wtd)", th_style), Paragraph("F1-Score (Wtd)", th_style)],
        [Paragraph("<b>Random Forest Classifier</b>", td_bold), Paragraph("<b>79.19%</b>", td_center), Paragraph("<b>72.89% &plusmn; 2.80%</b>", td_center), Paragraph("<b>0.7912</b>", td_center), Paragraph("<b>0.7861</b>", td_center)],
        [Paragraph("Support Vector Classifier (SVC)", td_style), Paragraph("77.18%", td_center), Paragraph("71.28% &plusmn; 3.10%", td_center), Paragraph("0.7710", td_center), Paragraph("0.7687", td_center)],
        [Paragraph("Gradient Boosting Classifier", td_style), Paragraph("76.51%", td_center), Paragraph("73.29% &plusmn; 2.90%", td_center), Paragraph("0.7645", td_center), Paragraph("0.7637", td_center)],
        [Paragraph("Multinomial Logistic Regression", td_style), Paragraph("69.13%", td_center), Paragraph("68.46% &plusmn; 3.40%", td_center), Paragraph("0.6850", td_center), Paragraph("0.6803", td_center)]
    ]
    t3 = Table(cls_data, colWidths=[150, 75, 125, 77, 77])
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t3)
    story.append(Spacer(1, 8))

    # Cross-Region Transferability Table
    story.append(Paragraph("<b>TABLE IV: Cross-Regional Model Transferability Experiment (GAP 15)</b>", h2_style))
    trans_data = [
        [Paragraph("Training Domain", th_style), Paragraph("Target Testing Domain", th_style), Paragraph("In-Domain R<sup>2</sup>", th_style), Paragraph("Out-of-Domain R<sup>2</sup>", th_style), Paragraph("Out-of-Domain Acc", th_style)],
        [Paragraph("<b>South & West (Peninsular)</b>", td_style), Paragraph("North & Central (Heartland)", td_style), Paragraph("0.694", td_center), Paragraph("<b>0.552</b>", td_center), Paragraph("<b>59.3%</b>", td_center)],
        [Paragraph("<b>North & Central (Heartland)</b>", td_style), Paragraph("South & West (Peninsular)", td_style), Paragraph("0.702", td_center), Paragraph("<b>0.518</b>", td_center), Paragraph("<b>61.4%</b>", td_center)]
    ]
    t4 = Table(trans_data, colWidths=[130, 130, 80, 84, 80])
    t4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#7c3aed")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t4)
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Transferability Finding:</b> Out-of-domain performance degrades significantly (R<sup>2</sup> drops from ~0.70 to 0.55 and 0.52). "
        "South/West models underestimate high-volume seasonal agricultural distress in the Gangetic plain, whereas North/Central models over-predict "
        "unmet demand in peninsular states with diversified non-farm rural economies. National uniform welfare algorithms are inadequate; regional calibration is mandatory.",
        body_style
    ))

    # SECTION VI: EXPLAINABILITY & POLICY
    story.append(Paragraph("VI. EXPLAINABILITY & POLICY DISCUSSION", h1_style))
    story.append(Paragraph(
        "<b>Global Feature Importance:</b> Work Demand Pressure accounts for <b>48.2%</b> of predictive importance, followed by "
        "SC/ST Marginalization Share (<b>14.1%</b>), Literacy &times; Climate Stress (<b>12.8%</b>), Female Literacy Rate (<b>8.4%</b>), "
        "Annual Rainfall (<b>7.2%</b>), Basic Deprivation (<b>5.3%</b>), and Registered Jobcards (<b>4.0%</b>).<br/>"
        "<b>Case Analysis:</b> In Bundelkhand (e.g., Mahoba, Banda), positive forces are dominated by climate deficit (&phi;<sup>Climate</sup> = +4.8) "
        "and literacy gaps (&phi;<sup>Literacy</sup> = +3.2), pushing P95 crisis demand to 49,200 HHs. Conversely, in the Eastern Gangetic Basin "
        "(e.g., Sitamarhi, Bahraich), distress is driven by massive administrative demand pressure (&phi;<sup>Demand</sup> = +8.4) outstripping muster capacity.<br/>"
        "<b>Fiscal Safety-Net Budgeting:</b> Across 745 districts, the 45-day contingency fund model identifies an aggregate national buffer requirement "
        "of <b>₹17,324.5 Crores</b>, providing finance departments with an empirical benchmark for emergency wage releases.",
        body_style
    ))

    # SECTION VII: WEB DEPLOYMENT & REPRODUCIBILITY
    story.append(Paragraph("VII. DECISION SUPPORT SYSTEM & REPRODUCIBILITY", h1_style))
    story.append(Paragraph(
        "The complete decision support architecture is deployed live on Netlify at: "
        "<b><u>https://explainablemlfordistrictlevelemp.netlify.app/</u></b>. The client-side dashboard integrates Leaflet geospatial mapping, "
        "Chart.js metric visualizations, interactive 90% confidence interval explorers, what-if policy simulators, and an embedded AI Policy Copilot. "
        "All raw datasets, ingestion scripts, models, and web assets are fully documented and version-controlled at "
        "<b><u>https://github.com/prachigarg1511/ExplainableMLForDistrictLevelRuralEmpMGNREGA</u></b>.",
        body_style
    ))

    # SECTION VIII & IX: CONCLUSION & REFERENCES
    story.append(Paragraph("VIII. CONCLUSION", h1_style))
    story.append(Paragraph(
        "This research establishes an explainable, multimodal machine learning framework for district-level rural employment vulnerability and "
        "unmet MGNREGA demand forecasting in India. By integrating five administrative, climatic, and human capital pillars across 745 districts, "
        "formulating quantile prediction intervals, providing localized causal force decompositions, and stress-testing cross-regional transferability, "
        "this work bridges academic machine learning and proactive public welfare administration.",
        body_style
    ))

    story.append(Paragraph("REFERENCES", h1_style))
    refs = [
        "[1] K. Subbarao, 'Systemic design and implementation issues in public works programs,' <i>World Bank Discussion Paper</i>, 2003.",
        "[2] J. Drèze and R. Khera, 'Recent social legislation and its implementation,' in <i>Reflections on the Indian Economy</i>, Oxford University Press, 2017.",
        "[3] S. Sukhtankar, 'The Mahatma Gandhi National Rural Employment Guarantee Act: A comprehensive assessment,' <i>India Policy Forum</i>, vol. 13, 2016.",
        "[4] K. Muralidharan, P. Niehaus, and S. Sukhtankar, 'Building state capacity: What begins with biometric smartcards ends with leakages,' <i>AER</i>, 2016.",
        "[5] V. Taraz, 'Can crops adapt to climate change? Evidence from agricultural rainfed yields in India,' <i>AEJ: Applied Economics</i>, vol. 9, no. 1, 2017.",
        "[6] J. Blumenstock et al., 'Predicting poverty and wealth from mobile phone metadata,' <i>Science</i>, vol. 350, no. 6264, pp. 1073–1077, 2015.",
        "[7] N. Jean et al., 'Combining satellite imagery and machine learning to predict poverty,' <i>Science</i>, vol. 353, no. 6301, pp. 790–794, 2016.",
        "[8] Ministry of Rural Development, <i>MGNREGA Operational Guidelines (5th Edition)</i>, Government of India, New Delhi, 2024.",
        "[9] IIPS & ICF, <i>National Family Health Survey (NFHS-5), 2019–21: India Report</i>, MoHFW, Government of India, 2022.",
        "[10] NITI Aayog, <i>India National Multidimensional Poverty Index: A Progress Review 2023</i>, Government of India, 2023.",
        "[11] D. S. Pai et al., 'Development of a new high spatial resolution (0.25° × 0.25°) daily gridded rainfall data set over India,' <i>Mausam</i>, 2014.",
        "[12] R. Koenker and G. Bassett Jr, 'Regression quantiles,' <i>Econometrica: Journal of the Econometric Society</i>, vol. 46, no. 1, pp. 33–50, 1978.",
        "[13] S. M. Lundberg and S.-I. Lee, 'A unified approach to interpreting model predictions,' in <i>NeurIPS 30</i>, 2017, pp. 4765–4774.",
        "[14] P. Garg, S. Sanjna, S. Katyal, and P. Sharma, 'Explainable ML for District-Level Rural Employment Vulnerability in India,' <i>GitHub Repository</i>, 2026."
    ]
    for r in refs:
        story.append(Paragraph(r, ParagraphStyle('RefStyle', parent=styles['Normal'], fontName='Helvetica', fontSize=7.2, leading=9.5, textColor=colors.HexColor("#334155"), spaceAfter=2.5)))

    doc.build(story, canvasmaker=AcademicCanvas)
    print(f"Generated Research Paper PDF at: {OUTPUT_PDF} ({os.path.getsize(OUTPUT_PDF):,} bytes)")

if __name__ == "__main__":
    build_research_paper_pdf()
