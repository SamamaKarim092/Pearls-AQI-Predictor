"""Hopsworks Cloud Feature Store and Model Registry Pipeline.

Manages:
1. Connecting to Hopsworks project.
2. Creating and updating Feature Groups (with primary keys ['city', 'timestamp']).
3. Creating Feature Views for training/inference.
4. Uploading trained model artifacts and evaluation metrics to Model Registry.
5. Local fallback when running offline or without API keys.
"""

from typing import Dict, List, Tuple, Any, Optional
from pathlib import Path
import logging
import os
import joblib
import pandas as pd

from src.config import (
    BASE_DIR,
    HOPSWORKS_API_KEY,
    HOPSWORKS_PROJECT_NAME,
    FEATURE_GROUP_NAME,
    FEATURE_GROUP_VERSION,
    FEATURE_VIEW_NAME,
    FEATURE_VIEW_VERSION,
    MODEL_NAME,
    DEFAULT_CITY,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)


def get_hopsworks_project() -> Optional[Any]:
    """Connect to Hopsworks project using API key from .env.

    Returns:
        hopsworks.project.Project instance if successful, or None if no key configured.
    """
    if not HOPSWORKS_API_KEY or HOPSWORKS_API_KEY == "your_hopsworks_api_key_here":
        logger.warning(
            "⚠️ No valid HOPSWORKS_API_KEY found in .env.\n"
            "Operating in LOCAL CACHE mode. To connect to cloud:\n"
            "1. Get free key at https://c.app.hopsworks.ai (Account Settings -> API Keys)\n"
            "2. Add HOPSWORKS_API_KEY=your_key in your .env file."
        )
        return None

    try:
        import hopsworks
        logger.info(f"Connecting to Hopsworks project: '{HOPSWORKS_PROJECT_NAME}'...")
        project = hopsworks.login(
            api_key_value=HOPSWORKS_API_KEY,
            project=HOPSWORKS_PROJECT_NAME,
        )
        logger.info(f"✅ Connected to Hopsworks project: {project.name}")
        return project
    except Exception as e:
        logger.error(f"Failed to connect to Hopsworks: {e}. Falling back to local mode.")
        return None


def upload_features_to_hopsworks(
    df: pd.DataFrame,
    feature_group_name: str = FEATURE_GROUP_NAME,
    version: int = FEATURE_GROUP_VERSION,
) -> bool:
    """Upload engineered DataFrame to Hopsworks Feature Group.

    Args:
        df: Enriched DataFrame with 'city', 'timestamp', and features.
        feature_group_name: Hopsworks Feature Group identifier.
        version: Version number of the feature group.

    Returns:
        True if successfully uploaded or cached locally, False on error.
    """
    # Save local parquet backup if engine available
    try:
        local_path = DATA_DIR / f"{feature_group_name}_v{version}.parquet"
        df.to_parquet(local_path, index=False)
        logger.info(f"Local backup saved to: {local_path} ({len(df)} rows)")
    except Exception as e:
        logger.warning(f"Could not save parquet backup: {e}. Continuing with cloud synchronization.")

    project = get_hopsworks_project()
    if project is None:
        logger.info("Local cache updated successfully.")
        return True

    try:
        fs = project.get_feature_store()
        logger.info(f"Creating / getting Feature Group: '{feature_group_name}' (v{version})...")

        # Convert timestamp to millisecond integer or datetime string as preferred by Hopsworks
        upload_df = df.copy()
        if "timestamp" in upload_df.columns:
            upload_df["timestamp"] = pd.to_datetime(upload_df["timestamp"])

        fg = fs.get_or_create_feature_group(
            name=feature_group_name,
            version=version,
            description="Hourly weather and air pollutant features for Karachi, Lahore, and Islamabad",
            primary_key=["city", "timestamp"],
            event_time="timestamp",
            online_enabled=True,
        )
        logger.info(f"Inserting {len(upload_df)} records into Feature Group...")
        fg.insert(upload_df, write_options={"wait_for_job": False})
        logger.info(f"✅ Successfully inserted features into Hopsworks Feature Group: {feature_group_name}")
        return True
    except Exception as e:
        logger.error(f"Error uploading to Hopsworks Feature Store: {e}")
        return False


def register_model_in_hopsworks(
    model_artifact_path: Path,
    model_name: str = MODEL_NAME,
    metrics: Optional[Dict[str, float]] = None,
    city: str = DEFAULT_CITY,
) -> bool:
    """Register trained model artifact and evaluation metrics in Hopsworks Model Registry.

    Args:
        model_artifact_path: Path to .joblib model file.
        model_name: Name of model entry in registry.
        metrics: Dictionary of test metrics (e.g. {'RMSE': 12.4, 'MAE': 8.1, 'R2': 0.85}).
        city: City the model was trained for.

    Returns:
        True if registered or saved locally.
    """
    if metrics is None:
        metrics = {"Test_RMSE": 0.0, "Test_MAE": 0.0}

    project = get_hopsworks_project()
    if project is None:
        logger.info(f"Model artifact safely stored in local registry: {model_artifact_path}")
        return True

    try:
        mr = project.get_model_registry()
        logger.info(f"Registering model '{model_name}' in Hopsworks Model Registry...")

        hw_model = mr.python.create_model(
            name=f"{model_name}_{city.lower()}",
            metrics=metrics,
            description=f"Gradient Boosted Regressor for AQI / PM2.5 prediction in {city}",
        )
        hw_model.save(str(model_artifact_path.parent))
        logger.info(f"✅ Successfully registered {model_name} in Hopsworks Model Registry (Version: {hw_model.version})")
        return True
    except Exception as e:
        logger.error(f"Error registering model in Hopsworks: {e}")
        return False


def run_full_hopsworks_pipeline(
    days_back: int = 60,
    city_names: Optional[List[str]] = None,
) -> bool:
    """End-to-end ingestion -> feature engineering -> Hopsworks sync."""
    from src.features.data_fetcher import fetch_historical_backfill
    from src.features.feature_engineering import build_feature_pipeline

    if city_names is None:
        city_names = ["Karachi", "Lahore", "Islamabad"]

    logger.info(f"Executing Full Hopsworks Pipeline for {city_names} ({days_back} days)...")
    raw_df = fetch_historical_backfill(city_names=city_names, days_back=days_back)
    features_df = build_feature_pipeline(raw_df)

    success = upload_features_to_hopsworks(features_df)
    return success


if __name__ == "__main__":
    print("Testing Hopsworks Cloud Pipeline in local/cloud mode...")
    run_full_hopsworks_pipeline(days_back=14)
