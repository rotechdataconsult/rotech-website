import re
import pandas as pd
import numpy as np


def clean_dataset(df: pd.DataFrame) -> dict:
    df = df.copy()
    report = {
        "original_rows": int(df.shape[0]),
        "original_columns": int(df.shape[1]),
        "duplicates_removed": 0,
        "columns_dropped": [],
        "missing_values_filled": {},
        "type_conversions": [],
        "quality_score": 100,
    }

    # 1. Remove rows where >70% of values are missing
    threshold = 0.7
    min_non_null = int(np.ceil(df.shape[1] * (1 - threshold)))
    df = df.dropna(thresh=min_non_null)

    # 2. Remove completely empty columns
    empty_cols = [col for col in df.columns if df[col].isna().all()]
    if empty_cols:
        df = df.drop(columns=empty_cols)
        report["columns_dropped"].extend(empty_cols)

    # 3. Clean column names
    def clean_col_name(name: str) -> str:
        name = str(name).strip()
        name = name.lower()
        name = re.sub(r"[^a-z0-9]+", "_", name)
        name = name.strip("_")
        return name or "column"

    df.columns = [clean_col_name(c) for c in df.columns]

    # 4. Remove duplicate rows
    before = len(df)
    df = df.drop_duplicates()
    report["duplicates_removed"] = before - len(df)

    # 5. Fix data types — try date and numeric conversions before filling
    for col in df.columns:
        if df[col].dtype == object:
            # Try datetime
            try:
                converted = pd.to_datetime(df[col], infer_datetime_format=True, errors="raise")
                df[col] = converted
                report["type_conversions"].append(f"'{col}': string → datetime")
                continue
            except Exception:
                pass

            # Try numeric
            try:
                converted = pd.to_numeric(df[col], errors="raise")
                df[col] = converted
                report["type_conversions"].append(f"'{col}': string → numeric")
            except Exception:
                pass

    # 6. Handle missing values
    for col in df.columns:
        missing = int(df[col].isna().sum())
        if missing == 0:
            continue

        report["missing_values_filled"][col] = missing

        if pd.api.types.is_numeric_dtype(df[col]):
            df[col] = df[col].fillna(df[col].median())
        elif pd.api.types.is_datetime64_any_dtype(df[col]):
            df[col] = df[col].fillna(method="ffill").fillna(method="bfill")
        else:
            df[col] = df[col].fillna("Unknown")

    # 7. Quality score
    original_rows = report["original_rows"]
    score = 100

    score -= 5 * len(report["missing_values_filled"])

    if original_rows > 0 and report["duplicates_removed"] / original_rows > 0.05:
        score -= 10

    rows_with_any_missing = int(
        df.apply(lambda row: row.isna().any(), axis=1).sum()
    )
    if len(df) > 0 and rows_with_any_missing / len(df) > 0.20:
        score -= 10

    report["quality_score"] = max(0, score)

    # 8. Final shape
    report["final_rows"] = int(df.shape[0])
    report["final_columns"] = int(df.shape[1])

    return {"cleaned_df": df, "report": report}


def get_column_summary(df: pd.DataFrame) -> dict:
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    date_cols = df.select_dtypes(include=["datetime", "datetimetz"]).columns.tolist()
    categorical_cols = [
        col for col in df.columns
        if col not in numeric_cols and col not in date_cols
    ]

    return {
        "numeric_columns": numeric_cols,
        "categorical_columns": categorical_cols,
        "date_columns": date_cols,
        "total_columns": int(df.shape[1]),
        "total_rows": int(df.shape[0]),
    }
