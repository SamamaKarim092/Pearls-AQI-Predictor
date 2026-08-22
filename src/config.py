"""Central Configuration Module for Pearls AQI Predictor.

This module centralizes all coordinates, API endpoints, feature groups,
and model training hyperparameters so no settings are hardcoded.
"""

from dataclasses import dataclass
from typing import Dict, List
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


@dataclass(frozen=True)
class CityConfig:
    name: str
    latitude: float
    longitude: float
    timezone: str
    country: str = "Pakistan"


# 3-City Configurations
CITIES: Dict[str, CityConfig] = {
    "Karachi": CityConfig(
        name="Karachi",
        latitude=24.8607,
        longitude=67.0011,
        timezone="Asia/Karachi",
    ),
    "Lahore": CityConfig(
        name="Lahore",
        latitude=31.5204,
        longitude=74.3587,
        timezone="Asia/Karachi",
    ),
    "Islamabad": CityConfig(
        name="Islamabad",
        latitude=33.6844,
        longitude=73.0479,
        timezone="Asia/Karachi",
    ),
}

DEFAULT_CITY = "Karachi"

# API Endpoints (Open-Meteo provides free historical & forecast air quality + weather data)
OPEN_METEO_AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
OPEN_METEO_WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
OPEN_METEO_HISTORICAL_WEATHER_URL = "https://archive-api.open-meteo.com/v1/archive"

# Pollutant & Meteorological Features to extract
POLLUTANT_VARIABLES: List[str] = [
    "pm2_5",
    "pm10",
    "nitrogen_dioxide",
    "ozone",
    "sulphur_dioxide",
    "carbon_monoxide",
]

WEATHER_VARIABLES: List[str] = [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "surface_pressure",
    "wind_speed_10m",
    "wind_direction_10m",
]

# Historical Backfill Configuration
BACKFILL_DAYS = 730  # 2 full years (365 * 2)

# Time Series Lag & Rolling Feature Parameters
LAG_HOURS: List[int] = [1, 2, 3, 6, 12, 24, 48, 72]
ROLLING_WINDOWS: List[int] = [6, 12, 24, 72]

# Forecast Horizons
SHORT_TERM_FORECAST_HOURS = 72  # 3 days hourly
LONG_TERM_FORECAST_DAYS = 7     # 7 days trend

# Hopsworks Feature Store Configuration
HOPSWORKS_API_KEY = os.getenv("HOPSWORKS_API_KEY", "")
HOPSWORKS_PROJECT_NAME = os.getenv("HOPSWORKS_PROJECT_NAME", "pearls_aqi_predictor")
FEATURE_GROUP_NAME = "aqi_weather_measurements"
FEATURE_GROUP_VERSION = 1
FEATURE_VIEW_NAME = "aqi_forecast_features"
FEATURE_VIEW_VERSION = 1
MODEL_NAME = "pearls_aqi_lightgbm_model"

# WHO / US-EPA AQI Breakpoints for PM2.5 (Standard US EPA Index with concise clean labels)
AQI_CATEGORIES = [
    {"max": 50, "label": "Good Air", "color": "#10b981", "advice": "Air quality is satisfactory. Ideal for outdoor activities."},
    {"max": 100, "label": "Moderate", "color": "#fbbf24", "advice": "Air quality is acceptable. Sensitive individuals should consider limiting heavy outdoor exertion."},
    {"max": 150, "label": "Unhealthy", "color": "#f97316", "advice": "Members of sensitive groups (children, asthma patients) may experience health effects. Limit prolonged outdoor exertion."},
    {"max": 200, "label": "Unhealthy", "color": "#ef4444", "advice": "Everyone may begin to experience health effects. Wear a mask (N95) and reduce intense outdoor workouts."},
    {"max": 300, "label": "Very Unhealthy", "color": "#8F3F97", "advice": "Health alert: The risk of health effects is increased for everyone. Keep windows closed and run air purifiers."},
    {"max": 500, "label": "Hazardous", "color": "#7E0023", "advice": "Health warning of emergency conditions. Entire population is likely to be affected. Avoid all outdoor activities."},
]
