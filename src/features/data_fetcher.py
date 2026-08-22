"""Data Ingestion Module for Open-Meteo Air Quality & Weather APIs.

Fetches 2-year historical data for model training and real-time/forecast
data for live inference across Karachi, Lahore, and Islamabad.
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
import time
import logging
import requests
from requests.adapters import HTTPAdapter
from urllib3.util import Retry
import pandas as pd

from src.config import (
    CITIES,
    CityConfig,
    OPEN_METEO_AIR_QUALITY_URL,
    OPEN_METEO_WEATHER_URL,
    POLLUTANT_VARIABLES,
    WEATHER_VARIABLES,
    BACKFILL_DAYS,
    DEFAULT_CITY,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Global In-Memory Cache for Live Fetch (5-minute TTL per city)
_LIVE_CACHE: Dict[str, Dict] = {}


def get_retry_session(retries: int = 4, backoff_factor: float = 0.8) -> requests.Session:
    """Create a resilient requests session with automatic backoff retries."""
    session = requests.Session()
    retry_strategy = Retry(
        total=retries,
        backoff_factor=backoff_factor,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


SESSION = get_retry_session()


def fetch_air_quality_data(
    city_config: CityConfig,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    past_days: Optional[int] = None,
    forecast_days: int = 4,
) -> pd.DataFrame:
    """Fetch hourly air quality measurements from Open-Meteo Air Quality API."""
    params: Dict = {
        "latitude": city_config.latitude,
        "longitude": city_config.longitude,
        "hourly": ",".join(POLLUTANT_VARIABLES + ["us_aqi", "european_aqi"]),
        "timezone": city_config.timezone,
    }

    if start_date and end_date:
        params["start_date"] = start_date
        params["end_date"] = end_date
    elif past_days:
        params["past_days"] = past_days
        params["forecast_days"] = forecast_days

    logger.info(f"Fetching Air Quality data for {city_config.name}...")
    response = SESSION.get(OPEN_METEO_AIR_QUALITY_URL, params=params, timeout=30)
    response.raise_for_status()
    data = response.json()

    hourly = data.get("hourly", {})
    if not hourly or "time" not in hourly:
        raise ValueError(f"No hourly air quality data returned for {city_config.name}")

    df = pd.DataFrame(hourly)
    df["timestamp"] = pd.to_datetime(df["time"])
    df["city"] = city_config.name
    df = df.drop(columns=["time"])

    return df


def fetch_weather_data(
    city_config: CityConfig,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    past_days: Optional[int] = None,
    forecast_days: int = 4,
) -> pd.DataFrame:
    """Fetch hourly meteorological variables from Open-Meteo Weather API."""
    params: Dict = {
        "latitude": city_config.latitude,
        "longitude": city_config.longitude,
        "hourly": ",".join(WEATHER_VARIABLES),
        "timezone": city_config.timezone,
    }

    if start_date and end_date:
        params["start_date"] = start_date
        params["end_date"] = end_date
    elif past_days:
        params["past_days"] = past_days
        params["forecast_days"] = forecast_days

    logger.info(f"Fetching Weather data for {city_config.name}...")
    response = SESSION.get(OPEN_METEO_WEATHER_URL, params=params, timeout=30)
    response.raise_for_status()
    data = response.json()

    hourly = data.get("hourly", {})
    if not hourly or "time" not in hourly:
        raise ValueError(f"No hourly weather data returned for {city_config.name}")

    df = pd.DataFrame(hourly)
    df["timestamp"] = pd.to_datetime(df["time"])
    df["city"] = city_config.name
    df = df.drop(columns=["time"])

    return df


def fetch_merged_city_data(
    city_name: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    past_days: Optional[int] = None,
    forecast_days: int = 4,
) -> pd.DataFrame:
    """Fetch and align air quality and weather data on timestamp for a given city."""
    if city_name not in CITIES:
        raise ValueError(f"City '{city_name}' not recognized. Available: {list(CITIES.keys())}")

    city_config = CITIES[city_name]
    df_aq = fetch_air_quality_data(city_config, start_date, end_date, past_days, forecast_days)
    df_weather = fetch_weather_data(city_config, start_date, end_date, past_days, forecast_days)

    # Merge on timestamp and city
    merged = pd.merge(df_aq, df_weather, on=["timestamp", "city"], how="inner")
    merged = merged.sort_values(by="timestamp").reset_index(drop=True)

    # Sensor missing-value handling: Forward fill then backward fill for minor dropouts
    merged = merged.ffill().bfill()

    logger.info(f"Successfully merged {len(merged)} hourly rows for {city_name}.")
    return merged


def fetch_historical_backfill(
    city_names: Optional[List[str]] = None,
    days_back: int = BACKFILL_DAYS,
) -> pd.DataFrame:
    """Fetch 2-year historical backfill dataset for multiple cities."""
    if city_names is None:
        city_names = list(CITIES.keys())

    end_dt = datetime.now(timezone.utc) - timedelta(days=1)
    start_dt = end_dt - timedelta(days=days_back)

    start_str = start_dt.strftime("%Y-%m-%d")
    end_str = end_dt.strftime("%Y-%m-%d")

    logger.info(f"Starting {days_back}-day backfill ({start_str} to {end_str}) for: {city_names}")

    city_dfs = []
    for name in city_names:
        df = fetch_merged_city_data(name, start_date=start_str, end_date=end_str)
        city_dfs.append(df)

    combined_df = pd.concat(city_dfs, ignore_index=True)
    logger.info(f"Total backfill dataset complete: {len(combined_df)} total records.")
    return combined_df


def fetch_live_and_forecast_data(city_name: str = DEFAULT_CITY) -> pd.DataFrame:
    """Fetch recent live observations (past 48h) + upcoming 72h weather forecast with 5-minute caching."""
    now = time.time()
    cached = _LIVE_CACHE.get(city_name)
    if cached and (now - cached["time"] < 300):
        logger.info(f"Returning cached live data for {city_name} (age: {round(now - cached['time'], 1)}s)")
        return cached["data"].copy()

    df = fetch_merged_city_data(city_name, past_days=2, forecast_days=4)
    _LIVE_CACHE[city_name] = {"time": now, "data": df.copy()}
    return df


if __name__ == "__main__":
    print(f"Testing live fetch for {DEFAULT_CITY}...")
    sample_df = fetch_live_and_forecast_data(DEFAULT_CITY)
    print("Sample Output Shape:", sample_df.shape)
    print("Columns:", sample_df.columns.tolist())
    print("\nFirst 3 rows:")
    print(sample_df[["timestamp", "city", "pm2_5", "temperature_2m", "wind_speed_10m"]].head(3))
