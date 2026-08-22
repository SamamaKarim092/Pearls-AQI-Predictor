"""Feature Engineering Module for Pearls AQI Predictor.

Transforms raw meteorological and air pollutant time series into engineered features:
- Multi-step time lags (1h, 2h, 3h, 6h, 12h, 24h, 48h, 72h)
- Rolling window statistics (6h, 12h, 24h, 72h means and std deviations)
- Rate of change / momentum features
- Cyclical time encodings (sin/cos for hour, day of week, day of year)
- Target creation for multi-horizon forecasting (e.g. 1h to 72h ahead)
"""

from typing import List, Optional
import logging
import numpy as np
import pandas as pd

from src.config import LAG_HOURS, ROLLING_WINDOWS

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def add_cyclical_time_features(df: pd.DataFrame, timestamp_col: str = "timestamp") -> pd.DataFrame:
    """Encode time variables as cyclical sine and cosine waves.

    Prevents boundary discontinuity between 23:00 (11 PM) and 00:00 (midnight),
    and between December (month 12) and January (month 1).
    """
    df = df.copy()
    dt = pd.to_datetime(df[timestamp_col])

    # Hour of day (0 to 23 -> period 24)
    df["hour_sin"] = np.sin(2 * np.pi * dt.dt.hour / 24.0)
    df["hour_cos"] = np.cos(2 * np.pi * dt.dt.hour / 24.0)

    # Day of week (0 to 6 -> period 7)
    df["dayofweek_sin"] = np.sin(2 * np.pi * dt.dt.dayofweek / 7.0)
    df["dayofweek_cos"] = np.cos(2 * np.pi * dt.dt.dayofweek / 7.0)

    # Day of year / Seasonality (1 to 365 -> period 365.25)
    df["dayofyear_sin"] = np.sin(2 * np.pi * dt.dt.dayofyear / 365.25)
    df["dayofyear_cos"] = np.cos(2 * np.pi * dt.dt.dayofyear / 365.25)

    # Is weekend flag (Human activity / traffic proxy)
    df["is_weekend"] = (dt.dt.dayofweek >= 5).astype(int)

    return df


def add_lag_features(
    df: pd.DataFrame,
    target_cols: List[str],
    lags: List[int] = LAG_HOURS,
    group_col: str = "city",
) -> pd.DataFrame:
    """Compute past time-lag features per city without future data leakage.

    Args:
        df: Input sorted DataFrame.
        target_cols: Columns to compute lags for (e.g., ['pm2_5', 'us_aqi']).
        lags: List of hourly lag intervals.
        group_col: Column to group by to prevent cross-city lag bleeding.
    """
    df = df.copy()

    for col in target_cols:
        if col not in df.columns:
            continue
        for lag in lags:
            df[f"{col}_lag_{lag}h"] = df.groupby(group_col)[col].shift(lag)

    return df


def add_rolling_features(
    df: pd.DataFrame,
    target_cols: List[str],
    windows: List[int] = ROLLING_WINDOWS,
    group_col: str = "city",
) -> pd.DataFrame:
    """Compute rolling window means and standard deviations per city.

    Uses .shift(1) before rolling to guarantee no current-step target leakage.
    """
    df = df.copy()

    for col in target_cols:
        if col not in df.columns:
            continue
        for window in windows:
            # Shift 1 to only use strictly past observations
            shifted = df.groupby(group_col)[col].shift(1)
            df[f"{col}_rolling_mean_{window}h"] = (
                shifted.groupby(df[group_col])
                .rolling(window=window, min_periods=max(1, window // 4))
                .mean()
                .reset_index(level=0, drop=True)
            )
            df[f"{col}_rolling_std_{window}h"] = (
                shifted.groupby(df[group_col])
                .rolling(window=window, min_periods=max(1, window // 4))
                .std()
                .reset_index(level=0, drop=True)
            )

    return df


def add_momentum_features(
    df: pd.DataFrame,
    target_cols: List[str],
    group_col: str = "city",
) -> pd.DataFrame:
    """Compute rates of change (velocity / momentum) in pollutants."""
    df = df.copy()

    for col in target_cols:
        if col not in df.columns:
            continue
        lag_1 = df.groupby(group_col)[col].shift(1)
        lag_24 = df.groupby(group_col)[col].shift(24)

        df[f"{col}_diff_1h"] = lag_1 - df.groupby(group_col)[col].shift(2)
        df[f"{col}_diff_24h"] = lag_1 - lag_24

    return df


def build_feature_pipeline(
    df: pd.DataFrame,
    pollutants_to_lag: Optional[List[str]] = None,
    drop_na: bool = True,
) -> pd.DataFrame:
    """Execute the complete feature engineering pipeline on merged data.

    Args:
        df: Merged dataframe with timestamp, city, weather, and pollutants.
        pollutants_to_lag: List of pollutant columns to generate lags/rolling for.
        drop_na: Whether to drop initial warm-up rows containing NaNs from lags.

    Returns:
        Fully enriched DataFrame ready for Feature Store or Model Training.
    """
    if pollutants_to_lag is None:
        pollutants_to_lag = ["pm2_5", "pm10", "us_aqi", "temperature_2m", "wind_speed_10m"]

    logger.info("Executing Feature Engineering Pipeline...")
    df = df.sort_values(by=["city", "timestamp"]).reset_index(drop=True)

    # 1. Cyclical Time Encodings
    df = add_cyclical_time_features(df)

    # 2. Lag Features
    df = add_lag_features(df, target_cols=pollutants_to_lag)

    # 3. Rolling Window Statistics
    df = add_rolling_features(df, target_cols=pollutants_to_lag)

    # 4. Momentum / Diff Features
    df = add_momentum_features(df, target_cols=["pm2_5", "us_aqi"])

    if drop_na:
        initial_len = len(df)
        df = df.dropna().reset_index(drop=True)
        logger.info(f"Dropped {initial_len - len(df)} warm-up rows with lag NaNs. Final rows: {len(df)}")

    return df


if __name__ == "__main__":
    from src.features.data_fetcher import fetch_live_and_forecast_data
    from src.config import DEFAULT_CITY

    print(f"Testing feature pipeline on recent data for {DEFAULT_CITY}...")
    raw_df = fetch_live_and_forecast_data(DEFAULT_CITY)
    features_df = build_feature_pipeline(raw_df, drop_na=False)
    print(f"Features created successfully! Shape: {features_df.shape}")
    print("Engineered Columns Sample:", [c for c in features_df.columns if "lag" in c or "sin" in c or "rolling" in c][:8])
