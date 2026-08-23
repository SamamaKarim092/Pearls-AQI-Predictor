# 🏆 01. The Machine Learning Model Tournament

Parent: [[00-Index]] | Topic: Machine Learning & Modeling

---

### 1. What is this in Simple English? (The Everyday Analogy)

Imagine you are auditioning singers for a choir:
* You don't just pick the first person who walks through the door and declare them the lead singer.
* You hold an **audition (tournament)** where everyone sings the exact same song under the exact same conditions.
* The singer with the best pitch, consistency, and control gets the spot.

In Machine Learning, we do the exact same thing:
We take multiple algorithms — from dead simple to state-of-the-art — and let them compete on the **exact same 2-year air quality dataset**. The one that predicts future air quality with the lowest error wins the crown and gets deployed to our live website!

---

### 2. The Tournament Lineup

```
   Level 1: The Benchmark (Persistence Baseline)
   "Tomorrow at 9 AM = Today at 9 AM"
                     │
                     ▼  (Can simple math beat basic persistence?)
   Level 2: The Fast Linear Model (Ridge Regression)
   "Draws straight relationships with L2 penalty to prevent overfitting"
                     │
                     ▼  (Can decision trees find complex weather thresholds?)
   Level 3: The Tabular Champion (LightGBM / Random Forest)
   "Hundreds of smart decision trees capturing non-linear weather combos"
                     │
                     ▼
       Winner Saved to Hopsworks Model Registry 🚀
```

---

### 3. Detailed Breakdown of the Contenders

#### 🥉 Contender 1: Persistence / Lag-1 Baseline
* **How it works**: Simply predicts that future AQI will match the most recent known reading ($y_{t+h} = y_t$).
* **Why we use it**: It is our **sanity check**. If an advanced AI model cannot beat this basic assumption, the model is useless. Every real-world ML project must beat a simple baseline to prove genuine value.

#### 🥈 Contender 2: Ridge Regression (L2 Regularized Linear Model)
* **How it works**: Calculates direct linear relationships (e.g., higher wind speed $\rightarrow$ lower pollution).
* **Why we use it**: It is blazing fast and uses **L2 Regularization** (a mathematical penalty that shrinks overly large weights), stopping any single noisy sensor from throwing off the entire forecast.

#### 🥇 Contender 3: LightGBM / Random Forest (Gradient Boosted Trees)
* **How it works**: Builds an ensemble of hundreds of decision trees that learn sequentially from each other's mistakes.
* **Why we use it**: Weather and pollution are **non-linear**:
  * *Smog only spikes if:* Wind is $< 5\text{ km/h}$ **AND** Humidity is $> 75\%$ **AND** Hour is $8\text{ AM}$ (morning rush hour).
  * Decision trees excel at capturing these complex "AND / OR" conditions that linear models miss.
  * In Kaggle and industry, LightGBM is the undisputed champion for structured tabular data.

---

### 4. How Do We Score the Tournament?

All models are judged on **unseen future test data** using 3 standard metrics:

| Metric | What it Measures (In Simple English) | Ideal Value |
| :--- | :--- | :--- |
| **MAE** (Mean Absolute Error) | On average, how many AQI points was the model off by? (e.g. off by $\pm 6$ points). | Lower is better ($0$) |
| **RMSE** (Root Mean Squared Error) | Similar to MAE, but heavily penalizes rare, giant mistakes. | Lower is better ($0$) |
| **$R^2$ Score** (Coefficient of Determination) | What percentage of the air quality variation did the model explain? | Closer to $1.0$ ($100\%$) |

---

### 5. Why Not Deep Learning (TensorFlow / LSTM) by Default?

* Deep learning requires massive compute, extra dependencies, and is prone to overfitting on tabular sensor features.
* Gradient Boosted Trees (LightGBM) train in seconds, use tiny memory, support instant **SHAP explainability**, and routinely outperform Neural Networks on tabular data.
* We can still benchmark a lightweight neural net if we want to compare it!

---

### 6. Related Source Code & Functions Walkthrough

#### 📄 **`src/models/train.py`** *(Phase 4)*

Our training pipeline orchestrates the tournament with the following core functions:

* **`temporal_train_test_split(df, train_ratio)`**:
  * Splits the 2-year dataset chronologically (e.g., past 20 months for training, recent 4 months for testing) with **zero shuffling** to prevent future data leakage.
* **`BaselineModel`**:
  * Calculates the Persistence benchmark: predicts future AQI equals current AQI ($y_{t+h} = y_t$).
* **`train_ridge_model(X_train, y_train, ...)`**:
  * Fits an L2 regularized linear model to capture straight-line physical trends without overfitting.
* **`train_lightgbm_model(X_train, y_train, ...)`**:
  * Trains an ensemble of gradient-boosted decision trees to capture non-linear weather thresholds.
* **`evaluate_model(model, X_test, y_test)`**:
  * Computes MAE, RMSE, and $R^2$ scores across all models on unseen test data.
* **`run_tournament(df, ...)`**:
  * Runs the full competition, ranks contenders on a leaderboard, and exports the winning model to disk / Hopsworks.

---

### Related Notes
* [[01-Project-Overview-and-Serverless-Stack]]
* [[02-Why-Feature-Store-and-Hopsworks]]
* [[02-Lag-and-Rolling-Features]]
