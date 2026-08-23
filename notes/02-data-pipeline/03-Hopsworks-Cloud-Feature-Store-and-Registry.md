# ☁️ 03. Hopsworks Cloud Feature Store and Model Registry

Parent: [[00-Index]] | Topic: Data & Feature Pipeline

---

### 1. What is this in Simple English? (The Supermarket Central Depot Analogy)

Imagine you own 3 restaurants in **Karachi, Lahore, and Islamabad**:
* If you keep the fresh vegetables in your personal home refrigerator (your laptop), the restaurants cannot cook when you are asleep or when your laptop is turned off.
* Instead, you establish a **Central Cloud Depot (Hopsworks)**.
* Now:
  1. An automated delivery truck (**GitHub Actions**) drops off fresh hourly sensor data into the depot every 60 minutes.
  2. The restaurant menu display (**Streamlit Web Dashboard**) pulls fresh ingredients directly from the depot 24/7, even when your personal computer is turned off!

---

### 2. The 3 Cloud Components We Manage in Hopsworks

```
┌────────────────────────────────────────────────────────────┐
│                    Hopsworks Cloud                         │
│                                                            │
│   1. Feature Group: 'aqi_weather_measurements'             │
│      - Primary Keys: ['city', 'timestamp']                 │
│      - Event Time: 'timestamp'                             │
│      - Holds 2 years of engineered hourly records          │
│                                                            │
│   2. Feature View: 'aqi_forecast_features'                 │
│      - Serves features to training & live inference        │
│                                                            │
│   3. Model Registry: 'pearls_aqi_lightgbm_model'           │
│      - Stores winning model artifact (.joblib) & metrics   │
└────────────────────────────────────────────────────────────┘
```

1. **Feature Group (`aqi_weather_measurements`)**:
   * The actual cloud database table.
   * We set `primary_key=["city", "timestamp"]` so duplicate measurements are automatically merged or prevented.
   * `online_enabled=True` allows our live Streamlit dashboard to retrieve the latest row in $< 10\text{ ms}$.
2. **Feature View (`aqi_forecast_features`)**:
   * A logical lens defining which columns are inputs ($X$) vs targets ($y$).
   * Enables reproducible point-in-time training datasets without future leakage.
3. **Model Registry (`pearls_aqi_lightgbm_model`)**:
   * The secure warehouse storing model weights (`.joblib`), configuration parameters, and benchmark scores (RMSE, MAE, $R^2$).

---

### 3. Model Versioning & Experiment Tracking (The Video Game Patch Analogy)

Why is the Model Registry a game-changer when we retrain models or add new features?

Think of the Model Registry like **GitHub for AI models** (or an App Store where software gets version updates like `v1.0`, `v1.1`, `v2.0`):

```
┌────────────────────────────────────────────────────────┐
│               Hopsworks Model Registry                 │
│                                                        │
│   🏷️ pearls_aqi_lightgbm_model                         │
│   ├── 📦 Version 1 (Trained Aug 15) -> RMSE: 12.4      │
│   ├── 📦 Version 2 (Trained Aug 22) -> RMSE: 10.1      │
│   └── 📦 Version 3 (Current Champion) -> RMSE: 8.9 🏆  │
└────────────────────────────────────────────────────────┘
```

#### The 3 Superpowers of Automatic Model Versioning:

1. **Instant "Rollback" (The Undo Button)**:
   * If you train a new model next week (**v2**), but it suddenly makes erratic predictions during an unexpected heatwave, you don't panic or rewrite code.
   * You simply tell the dashboard: `load_model(version=1)` and your live system is instantly restored to the proven baseline!
2. **"Champion vs. Challenger" Testing**:
   * You keep **v1** as the active "Champion" serving users on your website, while testing **v2** (the "Challenger") quietly in the background.
   * Only when v2 proves it genuinely beats v1 across multiple seasons is it promoted to the new production champion.
3. **Complete Experiment Audit Trail**:
   * Every version saved in Hopsworks permanently preserves:
     * The serialized `.joblib` model binary.
     * Exact evaluation metrics (MAE, RMSE, $R^2$).
     * The input feature schema and training date.
     * This creates a rich history of your model's evolution over time.

---

### 4. Graceful Local Mode (Dual-Mode Design)

Our pipeline includes a **smart fallback mechanism**:
* **Cloud Mode**: If `HOPSWORKS_API_KEY` is present in `.env`, features and models sync directly to Hopsworks.
* **Local Mode**: If running offline or before entering an API key, the script saves parquet backups to `data/` and model files to `models/`, allowing you to develop and run the dashboard completely offline without interruptions!

---

### 5. Related Source Code & Functions Walkthrough

#### 📄 **`src/features/hopsworks_pipeline.py`**

Here is how each function in our cloud pipeline module works:

| Function | What it Does in Simple English |
| :--- | :--- |
| **`get_hopsworks_project()`** | Authenticates to the Hopsworks cloud using `HOPSWORKS_API_KEY`. If no key is configured, prints helpful setup instructions and switches to local mode. |
| **`upload_features_to_hopsworks(df, ...)`** | Saves a local parquet backup to `data/`, connects to the Hopsworks Feature Store, creates the feature group with `['city', 'timestamp']` keys, and inserts the data. |
| **`register_model_in_hopsworks(artifact_path, metrics, city)`** | Uploads the winning model artifact and evaluation metrics to the Hopsworks Model Registry under a clean versioned namespace (`v1`, `v2`, etc.). |
| **`run_full_hopsworks_pipeline(days_back, city_names)`** | End-to-end master runner: fetches raw backfill $\rightarrow$ builds engineered features $\rightarrow$ uploads to cloud. |

---

### Related Notes
* [[02-Why-Feature-Store-and-Hopsworks]]
* [[01-Understanding-AQI-and-Data-Ingestion]]
* [[02-Lag-and-Rolling-Features]]
* [[01-Model-Tournament-Strategy]]
