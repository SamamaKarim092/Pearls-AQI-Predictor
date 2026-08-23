# ⏱️ 02. Lag, Rolling, and Cyclical Features

Parent: [[00-Index]] | Topic: Data & Feature Pipeline

---

### 1. What is this in Simple English? (The Rearview Mirror Analogy)

When driving a car, you don't just stare at the current speedometer reading; you also check:
* **The Rearview Mirror (Lag Features)**: *"Where were we 10 minutes ago?"*
* **The Trend (Rolling Averages)**: *"Have we been accelerating uphill or cruising smoothly over the last hour?"*
* **The Clock (Cyclical Time)**: *"Is it rush hour or late midnight?"*

In Machine Learning for Air Quality, we give our AI model the exact same contextual awareness.

---

### 2. The 4 Feature Families We Engineered

```
[ Raw Time & Sensor Data ]
           │
           ├───► 1. Lag Features (Memory): AQI(t-1), AQI(t-24)
           │
           ├───► 2. Rolling Averages (Trends): 6h, 12h, 24h Mean & Std
           │
           ├───► 3. Rate of Change (Momentum): AQI(t-1) - AQI(t-2)
           │
           └───► 4. Cyclical Clock: Hour & Month Sin/Cos encodings
```

#### ⏳ 1. Lag Features (Memory)
* **Definition**: Past observations shifted backward in time ($t-1, t-2, t-3, t-6, t-12, t-24, t-48, t-72$).
* **Why it matters**: Air pollution has high **inertia**. If $\text{PM}_{2.5}$ was high 1 hour ago, it will likely still be high now unless strong winds blow it away.
* **Why 24h & 48h lags?** Traffic and factory emissions repeat on a 24-hour daily cycle (diurnal pattern).

#### 📈 2. Rolling Window Averages & Standard Deviations
* **Definition**: Moving averages computed over $6, 12, 24,$ and $72$-hour windows.
* **Why it matters**: Filters out random sensor noise (like a single truck passing by) and captures the true multi-day smog accumulation trend.

#### 🚀 3. Rate of Change / Velocity (Momentum)
* **Definition**: Difference between the last two readings ($\text{PM2.5}_{t-1} - \text{PM2.5}_{t-2}$).
* **Why it matters**: Tells the model if pollution is actively spiking upwards (morning rush hour starting) or dropping downwards (afternoon sea breeze arriving).

#### ⏰ 4. Cyclical Time Encodings ($\sin$ and $\cos$)
* **The Problem**: A linear computer thinks $23:00$ ($11\text{ PM}$) and $00:00$ ($12\text{ AM}$) are $23$ units apart.
* **The Fix**: We map 24 hours around a circle using Trigonometry ($\sin$ and $\cos$).
  $$\text{hour\_sin} = \sin\left(\frac{2\pi \cdot \text{hour}}{24}\right), \quad \text{hour\_cos} = \cos\left(\frac{2\pi \cdot \text{hour}}{24}\right)$$
  * Now, $11\text{ PM}$ and $12\text{ AM}$ are right next to each other on the circle, allowing the AI to smoothly learn overnight pollution cycles.

---

### 3. Avoiding Data Leakage (Strict Rule)

> [!IMPORTANT]
> When creating rolling averages or lags, we **always shift by at least 1 step (`shift(1)`)**.
> We never include the current time step's target when computing past rolling stats. Peeking at the current target during feature creation is a fatal bug called **Data Leakage**.

---

### 4. Related Source Code & Functions Walkthrough

#### 📄 **`src/features/feature_engineering.py`**

Here is how each function in our feature engineering pipeline implements the concepts above:

* **`add_cyclical_time_features(df, timestamp_col)`**:
  * Uses numpy trigonometric formulas to create `hour_sin`, `hour_cos`, `dayofweek_sin`, `dayofweek_cos`, `dayofyear_sin`, and `dayofyear_cos`.
  * Computes the `is_weekend` binary indicator.
* **`add_lag_features(df, target_cols, lags, group_col)`**:
  * Groups by `city` to prevent cross-city lag contamination.
  * Calls `.shift(lag)` across all specified hourly intervals ($1\text{h}$ to $72\text{h}$).
* **`add_rolling_features(df, target_cols, windows, group_col)`**:
  * Groups by `city`, applies `.shift(1)` to avoid leakage, then calculates rolling `.mean()` and `.std()` across $6\text{h}, 12\text{h}, 24\text{h}, 72\text{h}$ windows.
* **`add_momentum_features(df, target_cols, group_col)`**:
  * Calculates the 1-hour and 24-hour rate of change: `df[f"{col}_diff_1h"]` and `df[f"{col}_diff_24h"]`.
* **`build_feature_pipeline(df, pollutants_to_lag, drop_na)`**:
  * Master entry point that runs the above steps sequentially and cleans initial warm-up NaNs.

---

### Related Notes
* [[01-Understanding-AQI-and-Data-Ingestion]]
* [[01-Model-Tournament-Strategy]]
* `[[01-Why-Time-Series-Needs-Chronological-Splits]]`
