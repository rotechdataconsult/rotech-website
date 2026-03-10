-- ═══════════════════════════════════════════════════════════════════════════
-- ROTECH LMS — CURRICULUM SEED
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run: uses ON CONFLICT DO NOTHING for domains/modules
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── 1. DOMAINS ──────────────────────────────────────────────────────────────

INSERT INTO domains (id, title, icon, description, is_active) VALUES

  ('d0000001-0000-0000-0000-000000000001',
   'Fintech Analytics', '💰',
   'Apply data analytics to financial services, banking, and investment. Analyse transactions, detect fraud, build dashboards, and automate financial reporting using Excel, SQL, Power BI, and Python.',
   true),

  ('d0000001-0000-0000-0000-000000000002',
   'Healthcare Analytics', '🏥',
   'Harness patient data, clinical records, and operational metrics to drive better health outcomes. Build dashboards for hospital performance, patient flow, and clinical research using real datasets.',
   true),

  ('d0000001-0000-0000-0000-000000000003',
   'E-commerce Analytics', '🛒',
   'Decode customer behaviour, optimise conversion funnels, and grow revenue using data from online retail platforms. Learn cohort analysis, product performance tracking, and customer segmentation.',
   true),

  ('d0000001-0000-0000-0000-000000000004',
   'Supply Chain Analytics', '🚚',
   'Optimise inventory, logistics, and procurement using data-driven insights. Analyse supplier performance, demand forecasting, and delivery metrics across the full supply chain lifecycle.',
   true),

  ('d0000001-0000-0000-0000-000000000005',
   'Climate & Energy Analytics', '🌱',
   'Analyse energy consumption, carbon footprints, and climate datasets to support sustainable business decisions. Build energy audit tools and environmental reporting dashboards.',
   true)

ON CONFLICT (id) DO NOTHING;


-- ─── 2. MODULES ──────────────────────────────────────────────────────────────
-- 5 modules per domain = 25 total
-- Progression: Excel → SQL → Power BI → Python → Capstone

-- ── Fintech ──────────────────────────────────────────────────────────────────
INSERT INTO modules (id, domain_id, title, description, tool, order_index) VALUES

  ('m0000001-0000-0000-0000-000000000001',
   'd0000001-0000-0000-0000-000000000001',
   'Financial Data Fundamentals with Excel',
   'Master Excel for financial data cleaning, pivot tables, and building summary reports from transaction records.',
   'Excel', 1),

  ('m0000001-0000-0000-0000-000000000002',
   'd0000001-0000-0000-0000-000000000001',
   'Querying Financial Databases with SQL',
   'Extract and aggregate financial data from relational databases. Write queries to analyse revenue, expenses, and customer transactions.',
   'SQL', 2),

  ('m0000001-0000-0000-0000-000000000003',
   'd0000001-0000-0000-0000-000000000001',
   'Financial Dashboards with Power BI',
   'Build executive-level financial dashboards with KPI cards, trend charts, and drill-through reports.',
   'Power BI', 3),

  ('m0000001-0000-0000-0000-000000000004',
   'd0000001-0000-0000-0000-000000000001',
   'Automated Financial Analysis with Python',
   'Use pandas, matplotlib, and numpy to automate financial reporting, detect anomalies, and model cash flow.',
   'Python', 4),

  ('m0000001-0000-0000-0000-000000000005',
   'd0000001-0000-0000-0000-000000000001',
   'Fintech Capstone Project',
   'End-to-end case study: analyse a real fintech dataset using all four tools to produce a business intelligence report.',
   'Capstone', 5)

ON CONFLICT (id) DO NOTHING;

-- ── Healthcare ────────────────────────────────────────────────────────────────
INSERT INTO modules (id, domain_id, title, description, tool, order_index) VALUES

  ('m0000002-0000-0000-0000-000000000001',
   'd0000001-0000-0000-0000-000000000002',
   'Healthcare Data Management with Excel',
   'Organise and clean patient records, appointment data, and clinical spreadsheets. Use formulas for KPI tracking.',
   'Excel', 1),

  ('m0000002-0000-0000-0000-000000000002',
   'd0000001-0000-0000-0000-000000000002',
   'Clinical Data Queries with SQL',
   'Query hospital databases to extract patient demographics, diagnosis codes, and treatment outcomes.',
   'SQL', 2),

  ('m0000002-0000-0000-0000-000000000003',
   'd0000001-0000-0000-0000-000000000002',
   'Healthcare Dashboards with Power BI',
   'Visualise patient flow, bed occupancy, readmission rates, and clinical KPIs in interactive dashboards.',
   'Power BI', 3),

  ('m0000002-0000-0000-0000-000000000004',
   'd0000001-0000-0000-0000-000000000002',
   'Predictive Health Analytics with Python',
   'Apply statistical models and machine learning to predict patient outcomes, flag risks, and optimise resources.',
   'Python', 4),

  ('m0000002-0000-0000-0000-000000000005',
   'd0000001-0000-0000-0000-000000000002',
   'Healthcare Capstone Project',
   'Analyse a real hospital dataset end-to-end: cleaning, querying, visualising, and presenting key insights.',
   'Capstone', 5)

ON CONFLICT (id) DO NOTHING;

-- ── E-commerce ────────────────────────────────────────────────────────────────
INSERT INTO modules (id, domain_id, title, description, tool, order_index) VALUES

  ('m0000003-0000-0000-0000-000000000001',
   'd0000001-0000-0000-0000-000000000003',
   'E-commerce Data with Excel',
   'Analyse product sales, returns, and customer orders using pivot tables, VLOOKUP, and trend analysis.',
   'Excel', 1),

  ('m0000003-0000-0000-0000-000000000002',
   'd0000001-0000-0000-0000-000000000003',
   'Customer & Sales Queries with SQL',
   'Mine order databases to segment customers, track product performance, and calculate conversion metrics.',
   'SQL', 2),

  ('m0000003-0000-0000-0000-000000000003',
   'd0000001-0000-0000-0000-000000000003',
   'Retail Dashboards with Power BI',
   'Build sales performance, funnel analysis, and customer behaviour dashboards with real e-commerce data.',
   'Power BI', 3),

  ('m0000003-0000-0000-0000-000000000004',
   'd0000001-0000-0000-0000-000000000003',
   'Customer Analytics with Python',
   'Perform RFM analysis, cohort tracking, churn prediction, and recommendation modelling with Python.',
   'Python', 4),

  ('m0000003-0000-0000-0000-000000000005',
   'd0000001-0000-0000-0000-000000000003',
   'E-commerce Capstone Project',
   'Full analysis of an e-commerce dataset: from data cleaning to insight storytelling and executive presentation.',
   'Capstone', 5)

ON CONFLICT (id) DO NOTHING;

-- ── Supply Chain ──────────────────────────────────────────────────────────────
INSERT INTO modules (id, domain_id, title, description, tool, order_index) VALUES

  ('m0000004-0000-0000-0000-000000000001',
   'd0000001-0000-0000-0000-000000000004',
   'Supply Chain Data with Excel',
   'Track inventory levels, purchase orders, and supplier data using Excel formulas and pivot analysis.',
   'Excel', 1),

  ('m0000004-0000-0000-0000-000000000002',
   'd0000001-0000-0000-0000-000000000004',
   'Logistics & Inventory Queries with SQL',
   'Query warehouse and logistics databases to analyse stock movements, lead times, and order fulfilment.',
   'SQL', 2),

  ('m0000004-0000-0000-0000-000000000003',
   'd0000001-0000-0000-0000-000000000004',
   'Supply Chain Dashboards with Power BI',
   'Build real-time inventory, supplier performance, and delivery SLA dashboards using Power BI.',
   'Power BI', 3),

  ('m0000004-0000-0000-0000-000000000004',
   'd0000001-0000-0000-0000-000000000004',
   'Demand Forecasting with Python',
   'Use time-series analysis and forecasting models to predict demand, reduce stockouts, and cut excess inventory.',
   'Python', 4),

  ('m0000004-0000-0000-0000-000000000005',
   'd0000001-0000-0000-0000-000000000004',
   'Supply Chain Capstone Project',
   'End-to-end supply chain analysis project covering procurement efficiency, logistics optimisation, and reporting.',
   'Capstone', 5)

ON CONFLICT (id) DO NOTHING;

-- ── Climate & Energy ──────────────────────────────────────────────────────────
INSERT INTO modules (id, domain_id, title, description, tool, order_index) VALUES

  ('m0000005-0000-0000-0000-000000000001',
   'd0000001-0000-0000-0000-000000000005',
   'Energy Data Management with Excel',
   'Organise and analyse energy consumption records, utility bills, and emissions data in Excel.',
   'Excel', 1),

  ('m0000005-0000-0000-0000-000000000002',
   'd0000001-0000-0000-0000-000000000005',
   'Climate Data Queries with SQL',
   'Query energy and environmental databases to track usage patterns, source breakdowns, and carbon metrics.',
   'SQL', 2),

  ('m0000005-0000-0000-0000-000000000003',
   'd0000001-0000-0000-0000-000000000005',
   'Sustainability Dashboards with Power BI',
   'Build ESG reporting dashboards showing energy efficiency, carbon emissions, and renewable usage trends.',
   'Power BI', 3),

  ('m0000005-0000-0000-0000-000000000004',
   'd0000001-0000-0000-0000-000000000005',
   'Climate Modelling with Python',
   'Analyse climate datasets, model energy demand forecasts, and build carbon footprint calculators in Python.',
   'Python', 4),

  ('m0000005-0000-0000-0000-000000000005',
   'd0000001-0000-0000-0000-000000000005',
   'Climate & Energy Capstone Project',
   'Develop a complete sustainability analytics report for a company using real energy and emissions data.',
   'Capstone', 5)

ON CONFLICT (id) DO NOTHING;


-- ─── 3. SAMPLE LESSONS — Fintech Module 1 (Excel) ────────────────────────────
-- These show the format. Replace/extend with your PDF content via /admin/lessons

INSERT INTO lessons (id, module_id, title, content, type, order_index) VALUES

  ('l0000001-0000-0000-0000-000000000001',
   'm0000001-0000-0000-0000-000000000001',
   'What is Financial Data?',
   E'## What is Financial Data?\n\nFinancial data is any quantitative information used to evaluate the financial health, performance, or position of an individual, organisation, or market.\n\n### Why it matters\n\nData analysts working in fintech need to understand **what** the data represents before they can clean, query, or visualise it. A number without context is noise — with context, it becomes insight.\n\n### Core types of financial data\n\n| Type | Examples | Common Source |\n|------|----------|---------------|\n| **Transactional** | Payments, transfers, purchases | Core banking systems, POS |\n| **Market** | Stock prices, exchange rates | Bloomberg, Reuters |\n| **Accounting** | Revenue, expenses, profit | ERP systems, QuickBooks |\n| **Customer** | Balances, credit scores | CRM, credit bureaus |\n\n### Key characteristics\n\n- **High volume** — financial systems generate millions of records daily\n- **Time-sensitive** — prices and balances change in real time\n- **Regulated** — must comply with GDPR, IFRS, and local financial laws\n- **Structured** — mostly tabular, making it ideal for SQL and Excel\n\n### What analysts do with it\n\n1. **Clean** raw data (remove duplicates, fix formats)\n2. **Aggregate** it (totals, averages, percentages)\n3. **Visualise** it (charts, dashboards)\n4. **Model** it (forecasts, risk scores)\n\n> **Key takeaway:** Understanding the business context of financial data is just as important as knowing the technical tools.\n\n### Reflection question\n\nBefore the next lesson, think about a financial decision you or your organisation makes regularly. What data would help make that decision better?',
   'reading', 1),

  ('l0000001-0000-0000-0000-000000000002',
   'm0000001-0000-0000-0000-000000000001',
   'Excel for Financial Data — Core Skills',
   E'## Excel for Financial Data — Core Skills\n\nExcel remains the most widely used tool in financial analysis globally. In this lesson we cover the functions every financial data analyst must know.\n\n### Setting up your workbook\n\nBefore entering data, always:\n1. Name your sheets clearly (`Raw Data`, `Analysis`, `Dashboard`)\n2. Freeze the header row (`View → Freeze Panes`)\n3. Format numbers as **Currency** or **Number** with 2 decimal places\n4. Save as `.xlsx` (not `.xls`)\n\n### Essential functions\n\n#### SUM & SUMIF\n```\n=SUM(B2:B100)                          — total of a column\n=SUMIF(A2:A100,"Income",B2:B100)       — sum where category = Income\n=SUMIFS(B2:B100,A2:A100,"Income",C2:C100,"Jan")  — multiple conditions\n```\n\n#### VLOOKUP\n```\n=VLOOKUP(A2, ProductTable, 3, FALSE)   — find product name from ID\n```\n\n#### IF statements\n```\n=IF(B2>0,"Profit","Loss")\n=IF(B2>=1000000,"High Value",IF(B2>=100000,"Medium","Low"))\n```\n\n#### TEXT and DATE functions\n```\n=TEXT(A2,"YYYY-MM")          — extract year-month from date\n=MONTH(A2)                   — extract month number\n=YEAR(A2)                    — extract year\n=DATEDIF(A2,B2,"D")         — days between two dates\n```\n\n### Pivot Tables for financial summaries\n\n1. Select your data range\n2. Insert → PivotTable\n3. Drag **Date** to Rows (group by Month)\n4. Drag **Amount** to Values (Sum)\n5. Drag **Category** to Columns\n\nThis instantly gives you a monthly income/expense breakdown.\n\n### Practice task\n\nDownload the sample transaction dataset (link below). Create a PivotTable that shows:\n- Monthly total by transaction type\n- Top 5 spending categories\n- Running balance column',
   'exercise', 2),

  ('l0000001-0000-0000-0000-000000000003',
   'm0000001-0000-0000-0000-000000000001',
   'Building a Financial Summary Report',
   E'## Building a Financial Summary Report\n\nIn this project lesson, you will build a complete one-page financial summary report in Excel — the kind used in real analyst roles.\n\n### What you will build\n\nA **Monthly P&L Summary** (Profit & Loss) with:\n- Revenue vs Expense comparison\n- Net profit trend chart\n- Top 10 transactions table\n- Colour-coded KPI indicators\n\n### Step 1 — Prepare the data\n\n1. Load the transaction dataset into Sheet 1 (`Raw Data`)\n2. Add a `Month` column: `=TEXT(A2,"MMM-YYYY")`\n3. Add a `Type` column using SUMIF logic to tag Debit/Credit\n4. Remove blank rows and fix date formats\n\n### Step 2 — Build the summary table\n\nOn Sheet 2 (`Summary`), create this layout:\n\n| Month | Revenue | Expenses | Net Profit | Margin % |\n|-------|---------|----------|------------|----------|\n| Jan   | =SUMIFS(...)  | =SUMIFS(...)  | =B2-C2 | =D2/B2 |\n\nUse `SUMIFS` to pull totals from Sheet 1 by month and type.\n\n### Step 3 — Add a chart\n\n1. Select the Month + Net Profit columns\n2. Insert → Line Chart\n3. Add a secondary axis for Margin %\n4. Format with your brand colours\n\n### Step 4 — KPI indicators\n\nUse conditional formatting to colour cells:\n- **Green** — profit > previous month\n- **Red** — profit < previous month\n- **Amber** — within 5% of previous month\n\n### Submission checklist\n\n- [ ] Data cleaned with no blanks or errors\n- [ ] Summary table with 12 months of data\n- [ ] Trend chart formatted and labelled\n- [ ] KPI colours applied\n- [ ] File saved as `[YourName]_FinancialReport.xlsx`\n\n> **Pro tip:** Real analysts always include a **notes section** explaining any anomalies in the data — this shows business thinking, not just technical skill.',
   'project', 3)

ON CONFLICT (id) DO NOTHING;


-- ─── 4. SAMPLE QUIZ — Fintech Module 1 ───────────────────────────────────────

INSERT INTO quizzes (id, module_id, title, time_limit_mins, pass_mark) VALUES
  ('q0000001-0000-0000-0000-000000000001',
   'm0000001-0000-0000-0000-000000000001',
   'Module 1 Assessment — Financial Data & Excel',
   15, 70)
ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index) VALUES

  ('q0000001-0000-0000-0000-000000000001',
   'Which Excel function would you use to sum transaction amounts where the category is "Revenue"?',
   '["SUM", "SUMIF", "COUNTIF", "VLOOKUP"]',
   'SUMIF',
   'SUMIF allows you to sum a range based on a single condition. SUMIFS is used for multiple conditions.',
   1),

  ('q0000001-0000-0000-0000-000000000001',
   'A financial dataset has 50,000 rows with columns: Date, Description, Amount, Category. Which tool gives you the fastest monthly breakdown by category?',
   '["IF statement", "VLOOKUP", "Pivot Table", "COUNTIF"]',
   'Pivot Table',
   'Pivot Tables are designed for exactly this — rapidly summarising large datasets by grouping and aggregating.',
   2),

  ('q0000001-0000-0000-0000-000000000001',
   'What does a negative value in a Net Profit column indicate?',
   '["Data entry error", "A loss — expenses exceeded revenue", "The data needs cleaning", "Currency conversion issue"]',
   'A loss — expenses exceeded revenue',
   'Net Profit = Revenue - Expenses. A negative result means expenses exceeded revenue in that period.',
   3),

  ('q0000001-0000-0000-0000-000000000001',
   'Which Excel function extracts the year from a date cell?',
   '["DATE()", "MONTH()", "YEAR()", "TEXT()"]',
   'YEAR()',
   'YEAR(date) returns the 4-digit year from a date value. TEXT(date,"YYYY") also works but returns text, not a number.',
   4),

  ('q0000001-0000-0000-0000-000000000001',
   'Before sharing a financial report, what should you always do?',
   '["Delete the raw data tab", "Remove all formulas", "Check for blanks, errors, and unusual outliers", "Convert to CSV format"]',
   'Check for blanks, errors, and unusual outliers',
   'Data quality checks are a non-negotiable step before presenting any analysis. Errors in a financial report can have serious consequences.',
   5)

ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════════════════════════
-- DONE.
-- Next steps:
-- 1. Go to /admin/lessons to add lesson content for the remaining 22 modules
-- 2. Go to /admin/quizzes to add quizzes for the other modules
-- 3. Go to /admin/exam to add final exam questions for each domain
-- ═══════════════════════════════════════════════════════════════════════════════
