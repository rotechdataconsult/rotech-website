"""
End-to-end test for the Rotech upload API.

Usage:
    python test_api.py

Requires the FastAPI server to be running:
    uvicorn main:app --reload
"""

import json
import random
import string

import numpy as np
import pandas as pd
import requests

API_URL = "http://localhost:8000/api/upload"
CSV_PATH = "test_data.csv"

random.seed(42)
np.random.seed(42)

# ── 1. Build sample fintech DataFrame ─────────────────────────────────────────

N = 100

transaction_types = ["transfer", "payment", "withdrawal", "deposit", "refund"]
regions = ["Lagos", "Nairobi", "Accra", "Johannesburg", "Cairo", "Kampala"]
channels = ["mobile", "web", "ATM", "branch", "USSD"]


def random_date(n: int) -> list:
    base = pd.Timestamp("2024-01-01")
    offsets = pd.to_timedelta(np.random.randint(0, 365, n), unit="D")
    return [(base + o).strftime("%Y-%m-%d") for o in offsets]


data = {
    "transaction_id": [f"TXN-{''.join(random.choices(string.digits, k=8))}" for _ in range(N)],
    "date":           random_date(N),
    "amount":         [round(random.uniform(10, 50_000), 2) for _ in range(N)],
    "transaction_type": [random.choice(transaction_types) for _ in range(N)],
    "region":         [random.choice(regions) for _ in range(N)],
    "customer_age":   [random.randint(18, 75) for _ in range(N)],
    "is_fraud":       [random.choices([0, 1], weights=[0.95, 0.05])[0] for _ in range(N)],
    "channel":        [random.choice(channels) for _ in range(N)],
}

df = pd.DataFrame(data)

# Convert amount to string (to simulate real-world dirty data)
df["amount"] = df["amount"].astype(str)

# Intentional data quality issue 1: "N/A" strings in amount (rows 0-4)
for i in range(5):
    df.at[i, "amount"] = "N/A"

# Intentional data quality issue 2: missing values scattered across rows 10-19
missing_cols = ["region", "customer_age", "transaction_type", "channel", "date"]
for idx, col in enumerate(missing_cols * 2):        # 10 cells total
    df.at[10 + idx, col] = np.nan

# Intentional data quality issue 3: 5 duplicate rows (copy rows 20-24)
duplicates = df.iloc[20:25].copy()
df = pd.concat([df, duplicates], ignore_index=True)

print(f"DataFrame shape before save: {df.shape}")
print(f"  Null values  : {df.isna().sum().sum()}")
print(f"  Duplicate rows: {df.duplicated().sum()}")
print(f"  'N/A' amounts : {(df['amount'] == 'N/A').sum()}")

# ── 2. Save to CSV ─────────────────────────────────────────────────────────────

df.to_csv(CSV_PATH, index=False)
print(f"\nSaved to {CSV_PATH}\n")

# ── 3. POST to /api/upload ─────────────────────────────────────────────────────

print(f"Posting to {API_URL} ...")

with open(CSV_PATH, "rb") as f:
    response = requests.post(
        API_URL,
        files={"file": (CSV_PATH, f, "text/csv")},
        data={"domain": "fintech", "user_id": "test-user-001"},
        timeout=120,
    )

# ── 4. Print response ──────────────────────────────────────────────────────────

print(f"Status code: {response.status_code}\n")

try:
    body = response.json()
except Exception:
    print("Could not parse JSON response:")
    print(response.text)
    raise SystemExit(1)

if response.status_code != 200:
    print("ERROR RESPONSE:")
    print(json.dumps(body, indent=2))
    raise SystemExit(1)

# Pretty-print top-level keys first, then nested sections
print("=" * 60)
print("UPLOAD RESPONSE SUMMARY")
print("=" * 60)

print(f"\nanalysis_id : {body.get('analysis_id')}")
print(f"filename    : {body.get('filename')}")
print(f"domain      : {body.get('domain')}")
print(f"status      : {body.get('status')}")

# Cleaning report
cr = body.get("cleaning_report", {})
print("\n── Cleaning Report ──")
print(json.dumps({k: v for k, v in cr.items() if k != "cleaned_df"}, indent=2))

# Stats overview
stats = body.get("stats", {})
print("\n── Stats Overview ──")
print(json.dumps(stats.get("overview", {}), indent=2))

# Charts
charts = body.get("charts", [])
print(f"\n── Charts Generated: {len(charts)} ──")
for c in charts:
    print(f"  [{c.get('id')}] {c.get('title')} ({c.get('type')})")

# Insights
insights = body.get("insights", {})
print("\n── AI Insights ──")
print(f"Summary: {insights.get('summary', 'N/A')}\n")

for i, insight in enumerate(insights.get("insights", []), 1):
    print(f"  Insight {i} [{insight.get('significance', '').upper()}]: {insight.get('title')}")
    print(f"    {insight.get('finding')}\n")

print("── Recommendations ──")
for r in insights.get("recommendations", []):
    print(f"  [{r.get('priority', '').upper()}] {r.get('action')}")
    print(f"    Rationale: {r.get('rationale')}\n")

print("── Data Quality Notes ──")
for note in insights.get("data_quality_notes", []):
    print(f"  • {note}")

print("\n" + "=" * 60)
print("Full raw response written to: response_dump.json")
with open("response_dump.json", "w") as out:
    json.dump(body, out, indent=2, default=str)
