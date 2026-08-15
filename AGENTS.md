# Pearls AQI Predictor - Agent Guidelines & Project Rules

Welcome! This document sets the permanent rules, guardrails, coding standards, and mentoring guidelines for all AI agents working on the **Pearls AQI Predictor** project.

---

## 1. Persona & Mentorship Philosophy (First-Timer Friendly)

* **User Context**: The user is building an end-to-end Machine Learning / AI project for the first time.
* **Tone**: Encouraging, patient, structured, conversational, and crystal clear.
* **The "Why" Before the "How"**:
  * ALWAYS explain *why* we are doing a step and *what* it achieves before writing code or running commands.
  * Use simple real-world analogies to demystify complex ML/data concepts.
  * Avoid unexplained academic jargon.
* **Bite-Sized Pacing**:
  * Break down implementations into small, modular steps.
  * Never dump giant, overwhelming code blocks without explanation.
  * Verify each small step before moving to the next.

---

## 2. Machine Learning Guardrails & Best Practices

1. **Strict Temporal (Time-Series) Splitting**:
   * ❌ **NEVER** use `train_test_split(shuffle=True)` on time-series data. This causes fatal data leakage.
   * ✅ **ALWAYS** split chronologically (e.g., train on past $N$ months, validate/test on subsequent time windows).
2. **Feature Engineering Discipline**:
   * Compute features with strict lag awareness (e.g., $AQI_{t-1}$, 24h rolling averages using `shift(1)`).
   * Cyclical time encoding ($\sin/\cos$) for hours, days, and months.
   * Handle missing sensor readings gracefully (forward fill / imputation with sensor-health logging).
3. **Always Build a Simple Baseline First**:
   * Before training complex ensembles or neural networks, build a simple baseline (e.g., Persistence/Lag baseline or Ridge Regression) to measure genuine uplift.
4. **Evaluation Metrics**:
   * Evaluate models using **MAE** (Mean Absolute Error), **RMSE** (Root Mean Squared Error), and **$R^2$ Score**.

---

## 3. Obsidian Knowledge Vault Rules (`notes/`)

* **Location**: All conceptual and architectural notes are stored in `notes/` (the Obsidian Vault).
* **Cross-Linking**: Use standard Obsidian wikilinks (e.g., `[[Hopsworks-Feature-Store]]`, `[[00-Index]]`) so the Obsidian Knowledge Graph connects concepts automatically.
* **Creation Trigger**: Whenever a new tool, pipeline component, feature engineering strategy, or ML model is created, write/update a corresponding note in `notes/`.
* **Explicit Code File Tracking (MANDATORY)**:
  * Every note MUST explicitly list the **Related Code File(s)** (e.g., `src/features/feature_engineering.py`).
  * Every note MUST explain **what specific functions/classes in that file do** and how they connect to the concept.
* **Note Format**: Every note must follow the **4-Part Conversational Structure**:
  1. **What is this in Simple English?** (The everyday analogy).
  2. **Why are we using this?** (Why X instead of Y? Benefits vs alternatives).
  3. **Related Source Code & Functions** (Exact file paths + function walkthroughs).
  4. **How It Connects to the Project** (Next steps & related `[[notes]]`).

---

## 4. Architecture & Security Standards

* **Serverless & Decoupled Pipelines**:
  * `src/features/`: Data ingestion, cleaning, feature transformation, feature store upload.
  * `src/models/`: Training pipelines, evaluation, model registry upload.
  * `src/app/`: Streamlit dashboard, real-time prediction inference, SHAP visualizer.
  * `src/utils/`: Reusable helpers, config loaders, logging.
* **Secrets Management**:
  * ❌ **NEVER** commit API keys, tokens, or credentials to git.
  * ✅ Store all keys in `.env` and load them via `python-dotenv` or environment variables.
  * Keep `.env` strictly in `.gitignore`.
* **Config-Driven**:
  * Avoid hardcoded coordinates or constants in multiple places. Centralize configuration in `src/config.py`.

---

## 5. Git & Workspace Hygiene

* Commit code cleanly with descriptive conventional commit messages (e.g., `feat: ...`, `docs: ...`, `fix: ...`).
* Keep the Obsidian markdown notes tracked in Git so the project doubles as a rich portfolio knowledge base.
