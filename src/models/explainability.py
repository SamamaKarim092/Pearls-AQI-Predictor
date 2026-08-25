"""Explainable AI (XAI) Module using SHAP (SHapley Additive exPlanations).

Provides:
1. Global feature importance analysis (TreeExplainer for LightGBM).
2. Local prediction explanations (waterfall / force plot data).
3. "What-If" scenario simulations for real-time dashboard interaction.
"""

from typing import Dict, List, Tuple, Any, Optional
from pathlib import Path
import logging
import joblib
import numpy as np
import pandas as pd
import shap

from src.config import BASE_DIR, DEFAULT_CITY

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

MODELS_DIR = BASE_DIR / "models"


def compute_shap_explainer(
    model: Any,
    X_sample: pd.DataFrame,
) -> shap.TreeExplainer:
    """Create a SHAP TreeExplainer for Tree-based models (e.g., LightGBM).

    Args:
        model: Trained tree-based model (LightGBM).
        X_sample: Representative sample of features for background baseline.

    Returns:
        Fitted shap.TreeExplainer.
    """
    logger.info("Initializing SHAP TreeExplainer...")
    # For LightGBM Regressor
    if hasattr(model, "booster_"):
        explainer = shap.TreeExplainer(model.booster_)
    elif hasattr(model, "predict"):
        explainer = shap.TreeExplainer(model)
    else:
        explainer = shap.Explainer(model, X_sample)

    return explainer


def get_global_feature_importance(
    explainer: shap.TreeExplainer,
    X: pd.DataFrame,
    top_n: int = 10,
) -> pd.DataFrame:
    """Compute mean absolute SHAP values across the dataset for global ranking.

    Args:
        explainer: Fitted SHAP TreeExplainer.
        X: Feature matrix to evaluate.
        top_n: Number of top features to return.

    Returns:
        DataFrame containing ranked features and their mean |SHAP| impact.
    """
    shap_values = explainer.shap_values(X)
    mean_abs_shap = np.abs(shap_values).mean(axis=0)

    importance_df = pd.DataFrame({
        "Feature": X.columns,
        "Mean_SHAP_Impact": mean_abs_shap,
    }).sort_values(by="Mean_SHAP_Impact", ascending=False).reset_index(drop=True)

    logger.info(f"Top {min(top_n, len(importance_df))} Most Influential Features:\n{importance_df.head(top_n)}")
    return importance_df.head(top_n)


def explain_single_prediction(
    explainer: shap.TreeExplainer,
    single_row: pd.DataFrame,
) -> Dict[str, Any]:
    """Explain an individual forecast breakdown (Base value + feature contributions).

    Args:
        explainer: Fitted SHAP TreeExplainer.
        single_row: Single-row DataFrame (shape (1, n_features)).

    Returns:
        Dictionary with base_value, predicted_value, and feature_contributions.
    """
    shap_values = explainer.shap_values(single_row)
    base_value = float(explainer.expected_value) if np.isscalar(explainer.expected_value) else float(explainer.expected_value[0])
    
    # Feature contributions for this specific prediction
    contributions = pd.DataFrame({
        "Feature": single_row.columns,
        "Feature_Value": single_row.values[0],
        "SHAP_Contribution": shap_values[0],
    }).sort_values(by="SHAP_Contribution", key=abs, ascending=False).reset_index(drop=True)

    predicted_value = base_value + float(shap_values[0].sum())

    return {
        "base_value": base_value,
        "predicted_value": predicted_value,
        "contributions": contributions,
    }


def simulate_what_if_scenario(
    model: Any,
    base_features: pd.DataFrame,
    overrides: Dict[str, float],
) -> Dict[str, Any]:
    """Simulate a 'What-If' scenario by modifying weather parameters and predicting impact.

    Example overrides: {'wind_speed_10m': 25.0, 'temperature_2m': 18.0}

    Returns:
        Comparison dictionary with original_prediction, simulated_prediction, and delta.
    """
    simulated_features = base_features.copy()

    for col, new_val in overrides.items():
        if col in simulated_features.columns:
            simulated_features[col] = new_val

    orig_pred = float(model.predict(base_features)[0])
    sim_pred = float(model.predict(simulated_features)[0])
    delta = sim_pred - orig_pred

    return {
        "original_prediction": orig_pred,
        "simulated_prediction": sim_pred,
        "delta": delta,
        "modified_features": overrides,
    }


if __name__ == "__main__":
    from src.features.data_fetcher import fetch_merged_city_data
    from src.features.feature_engineering import build_feature_pipeline
    from src.models.train import run_full_training_pipeline

    print(f"Running SHAP Explainability Demo for {DEFAULT_CITY}...")
    raw = fetch_merged_city_data(DEFAULT_CITY, past_days=60, forecast_days=1)
    feats = build_feature_pipeline(raw)
    leaderboard, model_path = run_full_training_pipeline(feats, city=DEFAULT_CITY)

    best_model = joblib.load(model_path)
    meta = joblib.load(MODELS_DIR / f"best_{DEFAULT_CITY.lower()}_meta.joblib")
    feature_names = meta["feature_names"]

    X = feats[feature_names].iloc[-50:]  # recent sample
    explainer = compute_shap_explainer(best_model, X)
    top_features = get_global_feature_importance(explainer, X, top_n=5)

    # Test single row explanation
    explanation = explain_single_prediction(explainer, X.iloc[[-1]])
    print(f"\nSingle Prediction Explanation:")
    print(f"Baseline: {explanation['base_value']:.1f} -> Predicted: {explanation['predicted_value']:.1f}")
    print(explanation["contributions"].head(5))

    # Test What-If simulation: What if wind speed doubles?
    current_wind = float(X.iloc[-1]["wind_speed_10m"]) if "wind_speed_10m" in X.columns else 5.0
    sim = simulate_what_if_scenario(best_model, X.iloc[[-1]], {"wind_speed_10m": current_wind + 15.0})
    print(f"\nWhat-If Simulation (Wind +15 km/h): Original={sim['original_prediction']:.1f}, New={sim['simulated_prediction']:.1f}, Delta={sim['delta']:.1f} AQI")
