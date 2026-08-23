# 🌉 04. The FastAPI Bridge & React Decoupling

Parent: [[00-Index]] | Topic: Architecture & Foundations

---

### 1. What is this in Simple English? (The Bilingual Translator Analogy)

Imagine you have two talented friends:
* **Friend A (React Frontend)**: Speaks only **JavaScript**. Lives in the user's web browser. It is a visual master that knows how to draw glowing concentric rings, 60 FPS slider animations, and smoke effects. But it knows **zero Python or Machine Learning**.
* **Friend B (Python ML Core)**: Speaks only **Python / C++**. Lives on the server. It knows how to compute time lags, run LightGBM decision trees, and calculate SHAP values. But it cannot run natively inside a web browser.

**FastAPI** is the **Bilingual Translator & Waiter**:
1. When a user drags the time slider in React, React sends a request over the internet: `GET /api/forecast?city=Karachi`.
2. FastAPI receives this message, asks the Python ML model to make a prediction, and gets the result ($AQI = 48, \text{PM}_{2.5} = 11.2$).
3. FastAPI translates the Python result into **JSON (JavaScript Object Notation)** — the universal language of the web.
4. React reads the JSON in milliseconds and renders the pixel-perfect glowing dials!

---

### 2. The Complete Request-Response Flow

```
┌──────────────────────────────────────────────┐
│          1. USER IN BROWSER (React)          │
│   User drags Time-Travel Scrubber to +24h    │
└──────────────────────┬───────────────────────┘
                       │
                       │ 🌐 2. Sends HTTP Request: "GET /api/forecast?city=Karachi"
                       ▼
┌──────────────────────────────────────────────┐
│        3. THE TRANSLATOR (FastAPI)           │
│   - Receives the request in Python           │
│   - Calls the Python ML Model                │
└──────────────────────┬───────────────────────┘
                       │
                       │ 🧠 4. Runs LightGBM & Feature Lags
                       ▼
┌──────────────────────────────────────────────┐
│        5. THE MASTER CHEF (Python ML)        │
│   - Calculates: PM2.5 = 11.2, AQI = 48       │
│   - Computes Berkeley Cigarettes = 0.5       │
└──────────────────────┬───────────────────────┘
                       │
                       │ 📦 6. FastAPI packages data into JSON format
                       ▼
┌──────────────────────────────────────────────┐
│        7. JSON SENT BACK TO BROWSER          │
│   { "aqi": 48, "pm2_5": 11.2, "cigs": 0.5 }  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│       8. REACT PAINTS THE SCREEN             │
│   - Animates the concentric green rings      │
│   - Lights up the cigarette ember            │
│   - Sets action tile to "🟢 Safe for Cardio" │
└──────────────────────────────────────────────┘
```

---

### 3. The 3 Core API Endpoints (The Menu)

| Endpoint | Method | Input | What it Returns (JSON) |
| :--- | :--- | :--- | :--- |
| **`/api/forecast`** | `GET` | `city=Karachi` | Current live readings, concentric ring percentages, Berkeley cigarette count, 2x2 lifestyle action states, and full 72h forecast array. |
| **`/api/simulate`** | `POST` | `{"wind_speed": 25.0, "humidity": 45.0}` | Real-time SHAP simulated AQI change and revised health category. |
| **`/api/leaderboard`** | `GET` | `city=Karachi` | 4-Fold Cross-Validation scores (MAE, RMSE, $R^2$) for Baseline, Ridge, and LightGBM. |

---

### 4. Why Decoupling is the Industry Standard

1. **Zero Coupling**: You can redesign or animate the React UI without touching a single line of ML code. You can retrain your model with new features in Python without touching React.
2. **High Performance**: FastAPI is built on asynchronous Python (`asyncio` / `uvicorn`), allowing it to serve thousands of predictions per second with $< 15\text{ ms}$ latency.
3. **Cross-Platform Ready**: The exact same FastAPI backend can serve a React web dashboard, a mobile iOS/Android app, or automated alerts.

---

### Related Notes
* [[01-Project-Overview-and-Serverless-Stack]]
* [[01-Model-Tournament-Strategy]]
* [[04-Explainable-AI-with-SHAP]]
* [[01-Streamlit-Dashboard-and-Health-Advisories]]
