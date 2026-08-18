import json
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go


# ── Shared layout ─────────────────────────────────────────────────────────────

DARK_LAYOUT = dict(
    template="plotly_dark",
    paper_bgcolor="#111620",
    plot_bgcolor="#111620",
    font_color="#e8edf5",
    margin=dict(l=40, r=40, t=50, b=40),
)

TEAL = "#00d4aa"


def _fig_to_json(fig) -> dict:
    fig.update_layout(**DARK_LAYOUT)
    return json.loads(fig.to_json())


def _pick_main_numeric(df: pd.DataFrame, numeric_cols: list) -> str:
    """Return the numeric column with the highest variance (most informative)."""
    return max(numeric_cols, key=lambda c: df[c].dropna().var() or 0)


def _pick_main_categorical(df: pd.DataFrame, categorical_cols: list) -> str | None:
    """Return the categorical column whose unique count is between 2 and 10."""
    candidates = [
        c for c in categorical_cols
        if 2 <= df[c].nunique() <= 10
    ]
    if candidates:
        return candidates[0]
    # Fallback: any categorical column
    return categorical_cols[0] if categorical_cols else None


# ── Individual chart builders ─────────────────────────────────────────────────

def _chart_distribution(df: pd.DataFrame, col: str) -> dict:
    series = df[col].dropna()
    counts, edges = np.histogram(series, bins=10)
    labels = [f"{edges[i]:.2f}–{edges[i+1]:.2f}" for i in range(len(counts))]

    fig = px.bar(
        x=labels,
        y=counts.tolist(),
        labels={"x": col, "y": "Count"},
        color_discrete_sequence=[TEAL],
    )
    fig.update_layout(xaxis_tickangle=-35)

    return {
        "id": "chart_1",
        "title": f"Distribution of {col}",
        "type": "histogram",
        "description": f"Shows how values in '{col}' are distributed across 10 equal-width buckets.",
        "figure": _fig_to_json(fig),
    }


def _chart_category_breakdown(df: pd.DataFrame, col: str) -> dict:
    vc = df[col].value_counts().reset_index()
    vc.columns = [col, "count"]
    total = vc["count"].sum()
    vc["percentage"] = (vc["count"] / total * 100).round(1)
    vc["label"] = vc["percentage"].astype(str) + "%"

    fig = px.bar(
        vc, x=col, y="count",
        text="label",
        labels={"count": "Count"},
        color_discrete_sequence=[TEAL],
    )
    fig.update_traces(textposition="outside")

    return {
        "id": "chart_2",
        "title": f"Breakdown by {col}",
        "type": "bar",
        "description": f"Shows the count and percentage share of each category in '{col}'.",
        "figure": _fig_to_json(fig),
    }


def _chart_time_series(df: pd.DataFrame, date_col: str, value_col: str) -> dict:
    ts = df[[date_col, value_col]].dropna().sort_values(date_col)
    ts = ts.groupby(date_col)[value_col].mean().reset_index()

    fig = px.line(
        ts, x=date_col, y=value_col,
        labels={date_col: "Date", value_col: value_col},
        color_discrete_sequence=[TEAL],
    )
    fig.update_traces(mode="lines+markers")

    return {
        "id": "chart_3",
        "title": f"{value_col} Over Time",
        "type": "line",
        "description": f"Tracks the average '{value_col}' across time using '{date_col}'.",
        "figure": _fig_to_json(fig),
    }


def _chart_top10_ranking(df: pd.DataFrame, cat_col: str, num_col: str) -> dict:
    grouped = (
        df.groupby(cat_col)[num_col]
        .sum()
        .reset_index()
        .sort_values(num_col, ascending=False)
        .head(10)
    )
    grouped = grouped.sort_values(num_col)  # ascending for horizontal bar

    fig = px.bar(
        grouped, x=num_col, y=cat_col,
        orientation="h",
        labels={num_col: f"Total {num_col}", cat_col: cat_col},
        color_discrete_sequence=[TEAL],
    )

    return {
        "id": "chart_4",
        "title": f"Top 10 {cat_col} by {num_col}",
        "type": "bar_horizontal",
        "description": f"Ranks the top 10 categories in '{cat_col}' by total '{num_col}'.",
        "figure": _fig_to_json(fig),
    }


def _chart_correlation_heatmap(df: pd.DataFrame, numeric_cols: list) -> dict:
    corr = df[numeric_cols].corr().round(2)

    fig = go.Figure(data=go.Heatmap(
        z=corr.values.tolist(),
        x=corr.columns.tolist(),
        y=corr.index.tolist(),
        colorscale="Teal",
        zmin=-1, zmax=1,
        text=corr.values.round(2).tolist(),
        texttemplate="%{text}",
        showscale=True,
    ))

    return {
        "id": "chart_5",
        "title": "Correlation Heatmap",
        "type": "heatmap",
        "description": "Shows pairwise correlation between all numeric columns. Values near 1 or -1 indicate strong relationships.",
        "figure": _fig_to_json(fig),
    }


def _chart_scatter(df: pd.DataFrame, col_x: str, col_y: str) -> dict:
    scatter_df = df[[col_x, col_y]].dropna()
    x = scatter_df[col_x].values
    y = scatter_df[col_y].values

    fig = px.scatter(
        scatter_df, x=col_x, y=col_y,
        labels={col_x: col_x, col_y: col_y},
        color_discrete_sequence=["#7c9cbf"],
        opacity=0.7,
    )

    # Add numpy trendline (no statsmodels/scipy needed)
    if len(x) >= 2:
        m, b = np.polyfit(x, y, 1)
        x_line = np.linspace(x.min(), x.max(), 100)
        y_line = m * x_line + b
        fig.add_trace(go.Scatter(
            x=x_line, y=y_line,
            mode="lines",
            line=dict(color=TEAL, width=2),
            name="Trend",
        ))

    return {
        "id": "chart_6",
        "title": f"{col_x} vs {col_y}",
        "type": "scatter",
        "description": f"Plots '{col_x}' against '{col_y}' to reveal any linear relationship between them.",
        "figure": _fig_to_json(fig),
    }


# ── Main entry point ──────────────────────────────────────────────────────────

def generate_charts(df: pd.DataFrame, domain: str = None) -> list | dict:
    if len(df) < 2:
        return {"message": "Not enough data to generate charts", "charts": []}

    numeric_cols  = df.select_dtypes(include="number").columns.tolist()
    date_cols     = df.select_dtypes(include=["datetime", "datetimetz"]).columns.tolist()
    categorical_cols = [c for c in df.columns if c not in numeric_cols and c not in date_cols]

    charts = []

    # Chart 1 — Distribution
    if numeric_cols:
        main_num = _pick_main_numeric(df, numeric_cols)
        charts.append(_chart_distribution(df, main_num))

    # Chart 2 — Category breakdown
    if categorical_cols:
        main_cat = _pick_main_categorical(df, categorical_cols)
        if main_cat:
            charts.append(_chart_category_breakdown(df, main_cat))

    # Chart 3 — Time series
    if date_cols and numeric_cols:
        main_num = _pick_main_numeric(df, numeric_cols)
        charts.append(_chart_time_series(df, date_cols[0], main_num))

    # Chart 4 — Top 10 ranking
    if categorical_cols and numeric_cols:
        main_cat = _pick_main_categorical(df, categorical_cols) or categorical_cols[0]
        main_num = _pick_main_numeric(df, numeric_cols)
        charts.append(_chart_top10_ranking(df, main_cat, main_num))

    # Chart 5 — Correlation heatmap
    if len(numeric_cols) >= 3:
        charts.append(_chart_correlation_heatmap(df, numeric_cols))

    # Chart 6 — Scatter (two most correlated numeric columns)
    if len(numeric_cols) >= 2:
        corr = df[numeric_cols].corr().abs()
        np.fill_diagonal(corr.values, 0)
        best = corr.stack().idxmax()
        charts.append(_chart_scatter(df, best[0], best[1]))

    return charts
