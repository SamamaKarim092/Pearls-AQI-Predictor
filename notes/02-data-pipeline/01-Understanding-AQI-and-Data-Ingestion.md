# 📡 01. Understanding AQI and Data Ingestion

Parent: [[00-Index]] | Topic: Data & Feature Pipeline

---

### 1. What is this in Simple English? (The Weather Drone Analogy)

Imagine sending an automated drone over **Karachi, Lahore, and Islamabad**:
* It doesn't just measure air pollution particles (like $\text{PM}_{2.5}$).
* At the exact same second, it records the **weather** (wind speed, humidity, temperature, rain).

**Why do we need BOTH weather and pollutants?**
Pollutants never exist in a vacuum:
1. **Wind Speed**: High wind blows smog away; still air traps pollution.
2. **Humidity & Temperature**: Cold, humid air traps smoke close to the ground (called a *temperature inversion* — very common in Lahore winters).
3. **Rain**: Raindrops physically scrub particulate matter out of the air (wet deposition).

By merging both datasets on timestamp, our machine learning models learn the true physical cause-and-effect of air quality.

---

### 2. The 2 Operational Modes

Our data ingestion pipeline operates in two distinct modes:

```
                      ┌──────────────────────────────────────────────┐
                      │              Open-Meteo APIs                 │
                      │  (Air Quality API + Weather Archive/Forecast)│
                      └──────────────────────┬───────────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
       ┌───────────────────────────────┐           ┌───────────────────────────────┐
       │   Mode A: 2-Year Backfill     │           │   Mode B: Live & Forecast     │
       │   - Fetches past 730 days     │           │   - Fetches past 48 hours     │
       │   - ~17,500 hourly rows/city  │           │   - Fetches next 72h weather  │
       │   - Used for Model Training   │           │   - Used for Live Prediction  │
       └───────────────────────────────┘           └───────────────────────────────┘
```

1. **Mode A: Historical Backfill (The Memory)**:
   * Pulls 2 full years of hourly records for Karachi, Lahore, and Islamabad.
   * Merges pollutant data + weather data on timestamp.
   * This forms our gold-standard training dataset (~17,500 hourly samples per city).
2. **Mode B: Real-Time & Forecast (The Live Feed)**:
   * Pulls the past 48 hours of recent observations (so the model knows current air quality).
   * Pulls the **future 72-hour weather forecast** (future wind, future temperature).
   * Feeds this into our trained model to output the 3-day AQI prediction.

---

### 3. How We Handle Missing Sensor Data (Forward Fill / Backward Fill)

Sensors occasionally drop out for an hour due to Wi-Fi glitches or electrical resets.
* **The Trap**: If we drop rows with missing values, we break our continuous 1-hour time-series interval!
* **The Solution**: We use **Forward Fill (`ffill`)**:
  * If the 3:00 PM reading is missing, we assume it is equal to the 2:00 PM reading.
  * For any remaining gaps at the beginning, we use **Backward Fill (`bfill`)**.
  * This preserves our continuous hourly time grid without hallucinating fake numbers.

---

### 4. Tracked Pollutants Explained Simply

| Pollutant | What is it? | Why it matters |
| :--- | :--- | :--- |
| **$\text{PM}_{2.5}$** | Tiny particles $< 2.5$ microns (dust, combustion smoke) | Penetrates deep into the lungs; primary driver of the US EPA AQI. |
| **$\text{PM}_{10}$** | Larger dust and road particles | Irritates eyes, nose, and throat. |
| **$\text{NO}_2$** | Nitrogen Dioxide (from vehicle exhaust) | Causes respiratory inflammation and creates ozone in sunlight. |
| **$\text{O}_3$** | Ground-level Ozone (sunlight + exhaust) | Harsh summer pollutant that triggers asthma. |
| **$\text{SO}_2$** | Sulphur Dioxide (industrial burning & fuel) | Forms acid rain and causes throat irritation. |
| **$\text{CO}$** | Carbon Monoxide (incomplete combustion) | Reduces oxygen delivery to the body's organs. |

---

### 5. Related Source Code & Functions Walkthrough

#### 📄 **`src/features/data_fetcher.py`**

Here is how each function in our data ingestion script implements the concepts above:

* **`fetch_air_quality_data(city_config, ...)`**:
  * Connects to Open-Meteo Air Quality endpoint.
  * Extracts hourly $\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{O}_3, \text{SO}_2, \text{CO}$, and US AQI.
* **`fetch_weather_data(city_config, ...)`**:
  * Connects to Open-Meteo Weather endpoint.
  * Extracts hourly `temperature_2m`, `relative_humidity_2m`, `precipitation`, `surface_pressure`, and `wind_speed_10m`.
* **`fetch_merged_city_data(city_name, ...)`**:
  * Joins the air quality and weather tables on `['timestamp', 'city']`.
  * Runs `.ffill().bfill()` to ensure zero missing sensor holes.
* **`fetch_historical_backfill(city_names, days_back)`**:
  * Orchestrates the 2-year backfill (730 days) across Karachi, Lahore, and Islamabad for model training.
* **`fetch_live_and_forecast_data(city_name)`**:
  * Fetches past 48 hours + upcoming 72-hour future weather forecast for real-time live inference in the dashboard.

---

### Related Notes
* [[01-Project-Overview-and-Serverless-Stack]]
* [[03-Configuration-and-Multi-City-Setup]]
* [[02-Lag-and-Rolling-Features]]
