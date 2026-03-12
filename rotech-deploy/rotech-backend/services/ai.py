import os
import json
from openai import OpenAI

_client = None

def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client

FALLBACK = {
    "insights": [
        {
            "title": "Analysis Unavailable",
            "finding": "AI insights could not be generated. Please check your API key.",
            "significance": "low",
        }
    ],
    "recommendations": [],
    "data_quality_notes": [],
    "summary": "AI analysis unavailable.",
}


# ── Helper: build a compact text summary from stats dict ─────────────────────

def build_data_summary(stats: dict, domain: str, filename: str) -> str:
    overview = stats.get("overview", {})
    numeric  = stats.get("numeric_stats", {})
    categ    = stats.get("categorical_stats", {})
    corrs    = stats.get("correlations", {})
    outliers = stats.get("outliers", {})

    lines = [
        f"Dataset: {filename}",
        f"Domain: {domain}",
        f"Rows: {overview.get('total_rows')} | Columns: {overview.get('total_columns')}",
        f"Numeric columns: {overview.get('numeric_column_count')} | "
        f"Categorical columns: {overview.get('categorical_column_count')}",
        f"Memory: {overview.get('memory_usage_kb')} KB",
        "",
    ]

    # Top numeric columns (max 4)
    if numeric:
        lines.append("── Numeric Column Statistics ──")
        for col, s in list(numeric.items())[:4]:
            lines.append(
                f"  {col}: mean={s['mean']}, min={s['min']}, max={s['max']}, "
                f"std={s['std']}, nulls={s['null_percentage']}%"
            )
        lines.append("")

    # Top categorical columns (max 3, top 5 values each)
    if categ:
        lines.append("── Categorical Column Distributions ──")
        for col, s in list(categ.items())[:3]:
            top = ", ".join(
                f"{v['value']}({v['count']})"
                for v in s.get("top_10_values", [])[:5]
            )
            lines.append(
                f"  {col}: {s['unique_count']} unique values | top: {top} | "
                f"nulls={s['null_percentage']}%"
            )
        lines.append("")

    # Outliers (only columns that have any)
    notable_outliers = {
        col: v for col, v in outliers.items() if v.get("outlier_count", 0) > 0
    }
    if notable_outliers:
        lines.append("── Outliers Detected ──")
        for col, v in list(notable_outliers.items())[:4]:
            lines.append(
                f"  {col}: {v['outlier_count']} outliers ({v['outlier_percentage']}%) | "
                f"range: {v['min_outlier']} – {v['max_outlier']}"
            )
        lines.append("")

    # Correlations
    if corrs:
        lines.append("── Notable Correlations ──")
        for pair, v in list(corrs.items())[:5]:
            lines.append(f"  {pair}: r={v['value']} ({v['strength']})")
        lines.append("")

    return "\n".join(lines)


# ── Main function ─────────────────────────────────────────────────────────────

def generate_insights(stats: dict, domain: str, filename: str) -> dict:
    summary = build_data_summary(stats, domain, filename)

    system_message = (
        f"You are a senior data analyst specializing in {domain} analytics "
        "in Africa and globally. You give specific, actionable insights based "
        "on real data patterns. You never give generic advice. Every insight "
        "must reference specific numbers from the data summary provided."
    )

    user_message = (
        f"{summary}\n\n"
        "Based on this dataset summary, provide a JSON response with exactly:\n"
        "{\n"
        '  "insights": [\n'
        '    { "title": str, "finding": str, "significance": "high/medium/low" }\n'
        "    -- exactly 4 insights, each referencing specific numbers\n"
        "  ],\n"
        '  "recommendations": [\n'
        '    { "action": str, "rationale": str, "priority": "high/medium/low" }\n'
        "    -- exactly 3 recommendations, each starting with an action verb\n"
        "  ],\n"
        '  "data_quality_notes": [str, str],\n'
        "    -- 2 notes about data quality or completeness\n"
        '  "summary": str\n'
        "    -- one paragraph executive summary of the dataset\n"
        "}\n"
        "Return only valid JSON with no markdown or code fences."
    )

    try:
        response = _get_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user",   "content": user_message},
            ],
            temperature=0.4,
            max_tokens=1200,
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown code fences if the model includes them anyway
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        return json.loads(raw)

    except Exception:
        return FALLBACK
