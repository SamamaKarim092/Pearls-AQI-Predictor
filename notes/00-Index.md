# 🗺️ Pearls AQI Predictor - Knowledge Map

Welcome to your personal knowledge base for the **Pearls AQI Predictor** project! 

This vault is organized into connected, bite-sized notes written in plain, human-friendly English. Every note answers **What**, **Why**, and **How** so you always understand the architectural choices behind the code.

---

## 🧭 Topic Clusters

### 🏗️ 01. Architecture & Foundations
* [[01-Project-Overview-and-Serverless-Stack]] — What is this project and what does "Serverless ML" mean?
* [[02-Why-Feature-Store-and-Hopsworks]] — Why use a Feature Store instead of CSV files or SQL?
* [[03-Configuration-and-Multi-City-Setup]] — Karachi, Lahore, Islamabad coordinates & tracked variables.
* [[04-FastAPI-Bridge-and-React-Decoupling]] — How FastAPI translates Python ML models into JSON for React.

### 🔄 02. Data & Feature Pipeline
* [[01-Understanding-AQI-and-Data-Ingestion]] — Combining weather + air quality data across 3 cities.
* [[02-Lag-and-Rolling-Features]] — Why yesterday's air quality & cyclical clocks help predict tomorrow.
* [[03-Hopsworks-Cloud-Feature-Store-and-Registry]] — Feature Groups, Feature Views & Model Registry upload.

### 🤖 03. Machine Learning & Modeling
* [[01-Model-Tournament-Strategy]] — Baseline vs Ridge vs LightGBM: how we crown the winning model.
* [[02-Why-Time-Series-Needs-Chronological-Splits]] — The dangers of data leakage in forecasting.
* [[03-Cross-Validation-in-Time-Series]] — 4-Fold Walk-Forward Cross-Validation across seasons.
* [[04-Explainable-AI-with-SHAP]] — Feature importance & What-If scenario simulations.

### 🚀 04. Deployment & Automation
* [[01-Streamlit-Dashboard-and-Health-Advisories]] — Nordic Slate UI design, concentric rings, cigarette metric.
* [[02-Serverless-Automation-with-GitHub-Actions]] — Running hourly serverless scrapers for $0.

---

> [!TIP]
> **How to use this in Obsidian**:
> In Obsidian, click any `[[link]]` to navigate between notes, or press `Ctrl + G` to open the interactive **Graph View** and watch your knowledge network grow!
