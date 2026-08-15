# 🗄️ 02. Why a Feature Store (and Hopsworks)?

Parent: [[00-Index]] | Previous: [[01-Project-Overview-and-Serverless-Stack]]

---

### 1. Who Does What? (The Kitchen Team Analogy)

To avoid confusion, here is the exact division of labor between our tools:

```
┌───────────────────────────┐
│   Open-Meteo (The Farm)   │ --> Supplies raw sensor numbers & 72h future weather
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│     Python (The Chef)     │ --> Washes data, fills missing values, calculates lags
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│   Hopsworks (The Pantry)  │ --> Stores, versions, and serves prepped features
└─────────────┬─────────────┘
              │
      ┌───────┴───────┐
      ▼               ▼
[ Training Script ]  [ Live Dashboard ]
```

* **Open-Meteo (The Raw Supplier)**: Free weather & pollution service (requires **zero API keys**).
* **Python Code (`src/features/`) (The Chef)**: Cleans missing values (`ffill`), calculates rolling averages, and builds lag features ($AQI_{t-1}$).
* **Hopsworks (The Feature Store Pantry)**: Secure cloud vault storing engineered features and trained models for serverless pipelines.

---

### 2. Why Not Just Save Data in a CSV or SQLite Database?

| Problem with Local CSV / SQLite | How a Feature Store (Hopsworks) Solves It |
| :--- | :--- |
| **Training-Serving Skew**: Your training script computes rolling averages one way, but your live website computes them differently, causing flawed predictions. | **Single Source of Truth**: Both the training script and live dashboard pull from identical pre-computed feature groups in Hopsworks. |
| **Data Leakage (Peeking into the Future)**: When creating historical training datasets, standard SQL easily mixes future records into past training points. | **Time-Travel (Point-in-Time Joins)**: Hopsworks knows what data was available at any specific timestamp, preventing future leakage. |
| **Serverless Access**: CSV files on your laptop cannot be reached by automated GitHub cloud workers running hourly scrapers. | **Cloud API**: Free cloud access with automated schema checks, accessible from anywhere. |

---

### 3. Related Code Files & Configuration

* **`src/config.py`**:
  * `HOPSWORKS_PROJECT_NAME`: Project namespace inside Hopsworks.
  * `FEATURE_GROUP_NAME`: `"aqi_weather_measurements"` (Version 1).
  * `FEATURE_VIEW_NAME`: `"aqi_forecast_features"` (Version 1).
  * `MODEL_NAME`: `"pearls_aqi_lightgbm_model"`.
* **`.env.example`**:
  * Template for `HOPSWORKS_API_KEY` loaded securely via `python-dotenv`.

---

### 4. The 2 Superpowers of Hopsworks in Our Project

1. **Feature Store (Data Vault)**:
   * Stores our historical 2-year hourly features for Karachi, Lahore, and Islamabad.
   * Continuously updated by our hourly automated GitHub Actions pipeline.
2. **Model Registry (Model Vault)**:
   * When we train our models (Baseline vs Ridge vs LightGBM), the winning model file (`.pkl` / `.joblib`) is saved and versioned directly inside Hopsworks.
   * Our Streamlit web app downloads the latest model directly from the registry at startup.

---

### Related Notes
* [[01-Project-Overview-and-Serverless-Stack]]
* [[03-Configuration-and-Multi-City-Setup]]
* [[01-Understanding-AQI-and-Data-Ingestion]]
