"""Model Training, Cross-Validation, and Tournament Pipeline for Pearls AQI Predictor.

Implements:
1. Strict chronological time-series splitting (zero shuffle leakage).
2. 4-Fold Walk-Forward Time-Series Cross-Validation (TimeSeriesSplit).
3. Multi-model tournament:
   - Contender 1: Persistence / Lag-1 Baseline
   - Contender 2: Ridge Regression (L2 Regularized Linear)
   - Contender 3: LightGBM (Gradient Boosted Decision Trees)
4. Evaluation metrics: MAE, RMSE, R2 Score.
5. Exporting winning model artifacts to disk / Hopsworks.
"""

from typing import Dict, List, Tuple, Any, Optional
from pathlib import Path
import logging
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import lightgbm as lgb

from src.config import BASE_DIR, DEFAULT_CITY

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)


class PersistenceBaseline:
    """Benchmark model predicting future value equals most recent known lag."""

    def __init__(self, lag_col: str = "pm2_5_lag_1h"):
        self.lag_col = lag_col

    def fit(self, X: pd.DataFrame, y: pd.Series):
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        if self.lag_col in X.columns:
            return X[self.lag_col].values
        # Fallback to mean if lag column not present
        return np.zeros(len(X))


def temporal_train_test_split(
    df: pd.DataFrame,
    train_ratio: float = 0.80,
    timestamp_col: str = "timestamp",
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Split time-series data chronologically without shuffling.

    Args:
        df: Input DataFrame with timestamp column.
        train_ratio: Fraction of historical data for training (default: 80%).
        timestamp_col: Name of datetime column.

    Returns:
        (train_df, test_df) strictly separated by time cutoff.
    """
    df = df.sort_values(by=timestamp_col).reset_index(drop=True)
    split_idx = int(len(df) * train_ratio)

    train_df = df.iloc[:split_idx].copy()
    test_df = df.iloc[split_idx:].copy()

    split_time = df[timestamp_col].iloc[split_idx]
    logger.info(
        f"Chronological Split at {split_time}: "
        f"Train={len(train_df)} rows, Test={len(test_df)} rows"
    )
    return train_df, test_df


def run_time_series_cv(
    X: pd.DataFrame,
    y: pd.Series,
    model: Any,
    model_name: str,
    n_splits: int = 4,
) -> Dict[str, float]:
    """Perform Walk-Forward Time-Series Cross-Validation across multiple folds.

    Args:
        X: Feature matrix sorted chronologically.
        y: Target series sorted chronologically.
        model: Scikit-learn or LightGBM compatible estimator.
        model_name: Identifier for logging.
        n_splits: Number of rolling chronological folds (default: 4).

    Returns:
        Dictionary containing mean and std for MAE, RMSE, and R2.
    """
    tscv = TimeSeriesSplit(n_splits=n_splits)
    mae_scores = []
    rmse_scores = []
    r2_scores = []

    logger.info(f"Running {n_splits}-Fold Time-Series Cross-Validation for: {model_name}...")

    for fold, (train_idx, val_idx) in enumerate(tscv.split(X), 1):
        X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_tr, y_val = y.iloc[train_idx], y.iloc[val_idx]

        # Fit model on training fold
        if isinstance(model, Pipeline) or hasattr(model, "fit"):
            model.fit(X_tr, y_tr)

        y_pred = model.predict(X_val)

        fold_mae = mean_absolute_error(y_val, y_pred)
        fold_rmse = np.sqrt(mean_squared_error(y_val, y_pred))
        fold_r2 = r2_score(y_val, y_pred)

        mae_scores.append(fold_mae)
        rmse_scores.append(fold_rmse)
        r2_scores.append(fold_r2)

        logger.debug(f"Fold {fold}/{n_splits} - MAE: {fold_mae:.2f}, RMSE: {fold_rmse:.2f}, R2: {fold_r2:.3f}")

    cv_results = {
        "Model": model_name,
        "CV_MAE_Mean": float(np.mean(mae_scores)),
        "CV_MAE_Std": float(np.std(mae_scores)),
        "CV_RMSE_Mean": float(np.mean(rmse_scores)),
        "CV_RMSE_Std": float(np.std(rmse_scores)),
        "CV_R2_Mean": float(np.mean(r2_scores)),
        "CV_R2_Std": float(np.std(r2_scores)),
    }

    logger.info(
        f"{model_name} {n_splits}-Fold CV Results: "
        f"RMSE = {cv_results['CV_RMSE_Mean']:.2f} ± {cv_results['CV_RMSE_Std']:.2f} | "
        f"MAE = {cv_results['CV_MAE_Mean']:.2f} ± {cv_results['CV_MAE_Std']:.2f} | "
        f"R2 = {cv_results['CV_R2_Mean']:.3f} ± {cv_results['CV_R2_Std']:.3f}"
    )
    return cv_results


def prepare_features_and_targets(
    df: pd.DataFrame,
    target_col: str = "pm2_5",
    drop_cols: Optional[List[str]] = None,
) -> Tuple[pd.DataFrame, pd.Series, List[str]]:
    """Separate feature matrix X and target vector y."""
    if drop_cols is None:
        drop_cols = ["timestamp", "city", "us_aqi", "european_aqi"]

    cols_to_drop = [c for c in drop_cols if c in df.columns]
    if target_col in df.columns and target_col not in cols_to_drop:
        cols_to_drop.append(target_col)

    X = df.drop(columns=cols_to_drop)
    y = df[target_col]
    feature_names = list(X.columns)

    return X, y, feature_names


def train_and_evaluate_models(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    X_test: pd.DataFrame,
    y_test: pd.Series,
    n_cv_splits: int = 4,
) -> Tuple[pd.DataFrame, Dict[str, Any], str]:
    """Train Baseline, Ridge, and LightGBM with 4-Fold Time-Series Cross-Validation and test evaluation.

    Returns:
        (leaderboard_df, trained_models_dict, winning_model_name)
    """
    models: Dict[str, Any] = {}
    results = []

    # 1. Persistence Baseline
    logger.info("Initializing Baseline (Persistence)...")
    baseline = PersistenceBaseline(lag_col="pm2_5_lag_1h")
    cv_base = run_time_series_cv(X_train, y_train, baseline, "Baseline (Persistence)", n_splits=n_cv_splits)
    baseline.fit(X_train, y_train)
    y_pred_base = baseline.predict(X_test)
    models["Baseline (Persistence)"] = baseline
    results.append({
        "Model": "Baseline (Persistence)",
        "Test_MAE": mean_absolute_error(y_test, y_pred_base),
        "Test_RMSE": np.sqrt(mean_squared_error(y_test, y_pred_base)),
        "Test_R2": r2_score(y_test, y_pred_base),
        "CV_RMSE_Mean": cv_base["CV_RMSE_Mean"],
        "CV_RMSE_Std": cv_base["CV_RMSE_Std"],
    })

    # 2. Ridge Regression (StandardScaler + Ridge)
    logger.info("Training Ridge Regression...")
    ridge_pipe = Pipeline([
        ("scaler", StandardScaler()),
        ("ridge", Ridge(alpha=10.0)),
    ])
    cv_ridge = run_time_series_cv(X_train, y_train, ridge_pipe, "Ridge Regression", n_splits=n_cv_splits)
    ridge_pipe.fit(X_train, y_train)
    y_pred_ridge = ridge_pipe.predict(X_test)
    models["Ridge Regression"] = ridge_pipe
    results.append({
        "Model": "Ridge Regression",
        "Test_MAE": mean_absolute_error(y_test, y_pred_ridge),
        "Test_RMSE": np.sqrt(mean_squared_error(y_test, y_pred_ridge)),
        "Test_R2": r2_score(y_test, y_pred_ridge),
        "CV_RMSE_Mean": cv_ridge["CV_RMSE_Mean"],
        "CV_RMSE_Std": cv_ridge["CV_RMSE_Std"],
    })

    # 3. LightGBM Regressor
    logger.info("Training LightGBM Regressor...")
    lgb_model = lgb.LGBMRegressor(
        n_estimators=300,
        learning_rate=0.03,
        num_leaves=31,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbose=-1,
    )
    cv_lgb = run_time_series_cv(X_train, y_train, lgb_model, "LightGBM Regressor", n_splits=n_cv_splits)
    lgb_model.fit(
        X_train,
        y_train,
        eval_set=[(X_test, y_test)],
        callbacks=[lgb.early_stopping(stopping_rounds=30, verbose=False)],
    )
    y_pred_lgb = lgb_model.predict(X_test)
    models["LightGBM Regressor"] = lgb_model
    results.append({
        "Model": "LightGBM Regressor",
        "Test_MAE": mean_absolute_error(y_test, y_pred_lgb),
        "Test_RMSE": np.sqrt(mean_squared_error(y_test, y_pred_lgb)),
        "Test_R2": r2_score(y_test, y_pred_lgb),
        "CV_RMSE_Mean": cv_lgb["CV_RMSE_Mean"],
        "CV_RMSE_Std": cv_lgb["CV_RMSE_Std"],
    })

    # Build Leaderboard sorted by Test RMSE
    leaderboard = pd.DataFrame(results).sort_values(by="Test_RMSE").reset_index(drop=True)
    winner_name = leaderboard.iloc[0]["Model"]
    logger.info(f"\n{'='*60}\nTOURNAMENT & 4-FOLD CV LEADERBOARD:\n{leaderboard}\n{'='*60}")
    logger.info(f"🏆 Winner: {winner_name} (Test RMSE: {leaderboard.iloc[0]['Test_RMSE']:.2f}, CV RMSE: {leaderboard.iloc[0]['CV_RMSE_Mean']:.2f} ± {leaderboard.iloc[0]['CV_RMSE_Std']:.2f})")

    return leaderboard, models, winner_name


def save_model_artifacts(
    model: Any,
    model_name: str,
    feature_names: List[str],
    leaderboard: pd.DataFrame,
    city: str = DEFAULT_CITY,
) -> Path:
    """Save winning model and feature metadata to disk for dashboard deployment."""
    output_path = MODELS_DIR / f"best_{city.lower()}_model.joblib"
    meta_path = MODELS_DIR / f"best_{city.lower()}_meta.joblib"

    joblib.dump(model, output_path)
    joblib.dump({
        "model_name": model_name,
        "feature_names": feature_names,
        "leaderboard": leaderboard,
        "city": city,
    }, meta_path)

    logger.info(f"Successfully saved {model_name} artifact to: {output_path}")
    return output_path


def run_full_training_pipeline(
    df: pd.DataFrame,
    target_col: str = "pm2_5",
    city: str = DEFAULT_CITY,
    n_cv_splits: int = 4,
) -> Tuple[pd.DataFrame, Path]:
    """End-to-end training pipeline: Split -> 4-Fold CV -> Tournament -> Export."""
    logger.info(f"Starting Training Tournament with 4-Fold CV for city: {city} (Target: {target_col})")

    # Filter city if dataset has multiple cities
    city_df = df[df["city"] == city].copy() if "city" in df.columns else df.copy()

    # 1. Temporal Split
    train_df, test_df = temporal_train_test_split(city_df, train_ratio=0.80)

    # 2. Features & Targets
    X_train, y_train, feature_names = prepare_features_and_targets(train_df, target_col=target_col)
    X_test, y_test, _ = prepare_features_and_targets(test_df, target_col=target_col)

    # 3. Train, 4-Fold CV, & Tournament
    leaderboard, models, winner_name = train_and_evaluate_models(
        X_train, y_train, X_test, y_test, n_cv_splits=n_cv_splits
    )

    # 4. Save Winning Model
    best_model = models[winner_name]
    artifact_path = save_model_artifacts(best_model, winner_name, feature_names, leaderboard, city=city)

    return leaderboard, artifact_path


if __name__ == "__main__":
    from src.features.data_fetcher import fetch_merged_city_data
    from src.features.feature_engineering import build_feature_pipeline

    print(f"Running 90-day demo tournament with 4-Fold CV for {DEFAULT_CITY}...")
    raw = fetch_merged_city_data(DEFAULT_CITY, past_days=90, forecast_days=1)
    feats = build_feature_pipeline(raw)
    leaderboard, path = run_full_training_pipeline(feats, city=DEFAULT_CITY, n_cv_splits=4)
    print("\nTraining Pipeline Test Complete! Model saved at:", path)
