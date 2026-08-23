# ⚙️ 03. Configuration and Multi-City Setup

Parent: [[00-Index]] | Previous: [[02-Why-Feature-Store-and-Hopsworks]]

---

### 1. What is this in Simple English? (The Remote Control Analogy)

Imagine you buy a universal TV remote:
* Instead of soldering the buttons permanently to one specific TV model, the remote has a **settings profile**.
* If you move from the living room TV to the bedroom TV, you simply switch profiles without rebuilding the remote from scratch.

In our code:
* **`src/config.py`** is the master remote control.
* It stores coordinates, API endpoints, feature lists, and health category thresholds in **one centralized place**.
* If we ever want to add a 4th city (e.g., Peshawar or Multan) or change the rolling window from 24h to 48h, we edit **1 single line in `config.py`** instead of digging through 20 different Python scripts.

---

### 2. The 3-City Profile Breakdown

Our project targets 3 distinct climate and urban ecosystems in Pakistan:

| City | Coordinates | Climate & Pollution Character |
| :--- | :--- | :--- |
| **Karachi** | Lat `24.8607`, Lon `67.0011` | **Coastal Marine Layer**: High humidity, sea breeze dispersion, coastal traffic density. |
| **Lahore** | Lat `31.5204`, Lon `74.3587` | **Inland Agricultural & Industrial**: Severe winter smog, crop residue burning, strong thermal inversions. |
| **Islamabad** | Lat `33.6844`, Lon `73.0479` | **Sub-Himalayan Foothills**: Mountain wind corridors, lower baseline pollution, cooler temperatures. |

---

### 3. Related Code Files & Structures

#### 📄 **`src/config.py`**
* **`CityConfig` (Dataclass)**: Defines immutable schema for city metadata (`name`, `latitude`, `longitude`, `timezone`, `country`).
* **`CITIES` (Dictionary)**: Stores the configuration instances for Karachi, Lahore, and Islamabad.
* **`POLLUTANT_VARIABLES` & `WEATHER_VARIABLES`**: Constants specifying the exact columns extracted from Open-Meteo.
* **`AQI_CATEGORIES` (List of Dictionaries)**: Maps EPA breakpoints ($0-500$) to color codes and health safety precautions.

---

### 4. Tracked Variables in Code

* **🌫️ Pollutants**: $\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{O}_3, \text{SO}_2, \text{CO}$.
* **🌦️ Weather**: `temperature_2m`, `relative_humidity_2m`, `precipitation`, `surface_pressure`, `wind_speed_10m`, `wind_direction_10m`.

---

### Related Notes
* [[01-Project-Overview-and-Serverless-Stack]]
* [[02-Why-Feature-Store-and-Hopsworks]]
* [[01-Understanding-AQI-and-Data-Ingestion]]
