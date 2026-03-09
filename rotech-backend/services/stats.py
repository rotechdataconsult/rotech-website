import pandas as pd
import numpy as np


def _to_native(val):
    """Convert numpy scalar to a Python native type for JSON serialisation."""
    if isinstance(val, (np.integer,)):
        return int(val)
    if isinstance(val, (np.floating,)):
        return float(val)
    if isinstance(val, (np.bool_,)):
        return bool(val)
    if pd.isna(val):
        return None
    return val


def generate_stats(df: pd.DataFrame) -> dict:
    numeric_cols     = df.select_dtypes(include="number").columns.tolist()
    categorical_cols = df.select_dtypes(exclude="number").columns.tolist()
    total_rows, total_cols = df.shape

    # ── 1. Overview ──────────────────────────────────────────────────────────
    overview = {
        "total_rows":               total_rows,
        "total_columns":            total_cols,
        "numeric_column_count":     len(numeric_cols),
        "categorical_column_count": len(categorical_cols),
        "memory_usage_kb":          round(df.memory_usage(deep=True).sum() / 1024, 2),
    }

    # ── 2. Numeric stats ─────────────────────────────────────────────────────
    numeric_stats = {}
    for col in numeric_cols:
        series = df[col].dropna()
        null_count = int(df[col].isna().sum())

        top5 = (
            df[col]
            .value_counts()
            .head(5)
            .reset_index()
            .rename(columns={col: "value", "count": "count"})
        )
        top5_list = [
            {"value": _to_native(row["value"]), "count": int(row["count"])}
            for _, row in top5.iterrows()
        ]

        numeric_stats[col] = {
            "min":             _to_native(series.min()),
            "max":             _to_native(series.max()),
            "mean":            round(_to_native(series.mean()), 4),
            "median":          _to_native(series.median()),
            "std":             round(_to_native(series.std()), 4),
            "p25":             _to_native(series.quantile(0.25)),
            "p75":             _to_native(series.quantile(0.75)),
            "null_count":      null_count,
            "null_percentage": round(null_count / total_rows * 100, 2) if total_rows else 0,
            "top_5_values":    top5_list,
        }

    # ── 3. Categorical stats ─────────────────────────────────────────────────
    categorical_stats = {}
    for col in categorical_cols:
        null_count = int(df[col].isna().sum())

        top10 = (
            df[col]
            .value_counts()
            .head(10)
            .reset_index()
            .rename(columns={col: "value", "count": "count"})
        )
        top10_list = [
            {"value": str(row["value"]), "count": int(row["count"])}
            for _, row in top10.iterrows()
        ]

        categorical_stats[col] = {
            "unique_count":    int(df[col].nunique()),
            "top_10_values":   top10_list,
            "null_count":      null_count,
            "null_percentage": round(null_count / total_rows * 100, 2) if total_rows else 0,
        }

    # ── 4. Correlations ──────────────────────────────────────────────────────
    correlations = {}
    if len(numeric_cols) >= 2:
        corr_matrix = df[numeric_cols].corr()

        for col_a in numeric_cols:
            for col_b in numeric_cols:
                if col_a >= col_b:          # upper triangle only, skip diagonal
                    continue
                val = _to_native(corr_matrix.loc[col_a, col_b])
                if val is None:
                    continue
                abs_val = abs(val)
                if abs_val <= 0.3:
                    continue

                if abs_val > 0.7:
                    strength = "strong"
                elif abs_val >= 0.4:
                    strength = "moderate"
                else:
                    strength = "weak"

                key = f"{col_a} × {col_b}"
                correlations[key] = {
                    "value":    round(val, 4),
                    "strength": strength,
                }

    # ── 5. Outliers (IQR method) ─────────────────────────────────────────────
    outliers = {}
    for col in numeric_cols:
        series = df[col].dropna()
        if series.empty:
            continue

        q1  = series.quantile(0.25)
        q3  = series.quantile(0.75)
        iqr = q3 - q1

        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr

        outlier_mask  = (series < lower) | (series > upper)
        outlier_vals  = series[outlier_mask]
        outlier_count = int(outlier_mask.sum())

        outliers[col] = {
            "outlier_count":      outlier_count,
            "outlier_percentage": round(outlier_count / len(series) * 100, 2),
            "min_outlier":        _to_native(outlier_vals.min()) if outlier_count else None,
            "max_outlier":        _to_native(outlier_vals.max()) if outlier_count else None,
        }

    return {
        "overview":           overview,
        "numeric_stats":      numeric_stats,
        "categorical_stats":  categorical_stats,
        "correlations":       correlations,
        "outliers":           outliers,
    }
