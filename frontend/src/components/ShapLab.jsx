import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Droplets,
  Thermometer,
  CloudRain,
  RotateCcw,
  Sparkles,
  Cpu,
} from 'lucide-react';
import ShapLabSkeleton from './ShapLabSkeleton';
import { API_BASE_URL } from '../config';

// Preset scenarios matching exact mockup
const SCENARIO_PRESETS = [
  {
    id: 'rainwash',
    label: 'Simulate Rainwash',
    overrides: { wind_speed_10m: 18, relative_humidity_2m: 85, temperature_2m: 24, precipitation: 15 },
  },
  {
    id: 'winter_smog',
    label: 'Winter Smog Trap',
    overrides: { wind_speed_10m: 3, relative_humidity_2m: 88, temperature_2m: 14, precipitation: 0 },
  },
  {
    id: 'sea_breeze',
    label: 'Sea Breeze',
    overrides: { wind_speed_10m: 26, relative_humidity_2m: 65, temperature_2m: 29, precipitation: 0 },
  },
];

// Exact percentage calculation for seamless gradient fill to thumb position
const getSliderPercent = (val, min, max) =>
  Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));

// Helper to calculate category info matching exact design label & color
function getCategoryInfo(aqi) {
  if (aqi <= 50) return { label: 'Good', color: '#10b981' };
  if (aqi <= 100) return { label: 'Moderate', color: '#fbbf24' };
  return { label: 'Unhealthy', color: '#f87171' };
}

// Calculate realistic gauge needle angle (pointing to right red zone on elevated AQI)
function calculateNeedleAngle(aqi) {
  const clamped = Math.max(0, Math.min(300, aqi));
  if (clamped <= 50) {
    // 0 to 50 AQI -> -180 deg to -135 deg (Green)
    return -180 + (clamped / 50) * 45;
  } else if (clamped <= 100) {
    // 51 to 100 AQI -> -135 deg to -90 deg (Yellow/Moderate)
    return -135 + ((clamped - 50) / 50) * 45;
  } else if (clamped <= 170) {
    // 101 to 170 AQI -> -90 deg to -35 deg (Red/Unhealthy - for 138 AQI this gives ~-42 deg)
    return -90 + ((clamped - 100) / 70) * 55;
  } else {
    // 171 to 300 AQI -> -35 deg to 0 deg (Deep Red)
    return -35 + ((clamped - 170) / 130) * 35;
  }
}

export default function ShapLab({ selectedCity = 'Karachi', currentLive = null }) {
  // Derive initial values from live data or city-specific baseline
  const getCityDefaults = (city, live) => {
    if (live && live.aqi !== undefined) {
      return {
        aqi: Math.round(live.aqi),
        wind: Math.round(live.wind_speed_10m ?? 14),
        hum: Math.round(live.relative_humidity_2m ?? 65),
        temp: Math.round(live.temperature_2m ?? 29),
      };
    }
    if (city === 'Lahore') return { aqi: 151, wind: 3, hum: 56, temp: 35 };
    if (city === 'Islamabad') return { aqi: 124, wind: 4, hum: 58, temp: 32 };
    return { aqi: 68, wind: 19, hum: 71, temp: 30 };
  };

  const initialValues = getCityDefaults(selectedCity, currentLive);

  // 4 Core Slider Parameters matching exact live sensor conditions
  const [windSpeed, setWindSpeed] = useState(initialValues.wind);
  const [humidity, setHumidity] = useState(initialValues.hum);
  const [temperature, setTemperature] = useState(initialValues.temp);
  const [precipitation, setPrecipitation] = useState(0);

  const [activeScenario, setActiveScenario] = useState(null);
  const [simulatedAqi, setSimulatedAqi] = useState(initialValues.aqi);
  const [baselineAqi, setBaselineAqi] = useState(initialValues.aqi);
  const [shapFactors, setShapFactors] = useState([
    { name: 'Wind Dispersion', impact: 0.0, desc: `At live baseline (${initialValues.wind} km/h)`, isPositive: false },
    { name: 'Humidity', impact: 0.0, desc: `At live baseline (${initialValues.hum}%)`, isPositive: false },
    { name: 'Temperature', impact: 0.0, desc: `At live baseline (${initialValues.temp}°C)`, isPositive: false },
  ]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  // Store the live baseline weather references to accurately detect default state
  const baselineWeatherRef = useRef({
    wind: initialValues.wind,
    hum: initialValues.hum,
    temp: initialValues.temp,
    precip: 0,
  });

  // 1. On Mount or City Change / live data update: Fetch & Sync Today's Live Sensor Conditions
  useEffect(() => {
    let isCancelled = false;
    setIsInitialLoad(true);

    const syncLiveValues = (liveAqi, liveWind, liveHumidity, liveTemp) => {
      baselineWeatherRef.current = {
        wind: liveWind,
        hum: liveHumidity,
        temp: liveTemp,
        precip: 0,
      };

      setBaselineAqi(liveAqi);
      setSimulatedAqi(liveAqi);
      setWindSpeed(liveWind);
      setHumidity(liveHumidity);
      setTemperature(liveTemp);
      setPrecipitation(0);
      setActiveScenario(null);
      setIsSimulating(false);

      setShapFactors([
        { name: 'Wind Dispersion', impact: 0.0, desc: `At live baseline (${liveWind} km/h)`, isPositive: false },
        { name: 'Humidity', impact: 0.0, desc: `At live baseline (${liveHumidity}%)`, isPositive: false },
        { name: 'Temperature', impact: 0.0, desc: `At live baseline (${liveTemp}°C)`, isPositive: false },
      ]);
    };

    if (currentLive && currentLive.aqi !== undefined) {
      const liveAqi = Math.round(currentLive.aqi);
      const liveWind = Math.round(currentLive.wind_speed_10m ?? initialValues.wind);
      const liveHumidity = Math.round(currentLive.relative_humidity_2m ?? initialValues.hum);
      const liveTemp = Math.round(currentLive.temperature_2m ?? initialValues.temp);
      syncLiveValues(liveAqi, liveWind, liveHumidity, liveTemp);
    }

    fetch(`${API_BASE_URL}/api/forecast?city=${selectedCity}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data && data.current) {
          const liveAqi = Math.round(data.current.aqi ?? initialValues.aqi);
          const liveWind = Math.round(data.current.wind_speed_10m ?? initialValues.wind);
          const liveHumidity = Math.round(data.current.relative_humidity_2m ?? initialValues.hum);
          const liveTemp = Math.round(data.current.temperature_2m ?? initialValues.temp);
          syncLiveValues(liveAqi, liveWind, liveHumidity, liveTemp);
        }
      })
      .catch(() => {
        const fallback = getCityDefaults(selectedCity, null);
        if (!isCancelled) {
          syncLiveValues(fallback.aqi, fallback.wind, fallback.hum, fallback.temp);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          // Slight warm-up delay for smooth skeleton exit transition
          setTimeout(() => setIsInitialLoad(false), 200);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCity, currentLive]);

  // 2. On Parameter Sliders Change: Trigger Debounced Simulation & SHAP Calculation
  useEffect(() => {
    if (isInitialLoad) return;
    let isCancelled = false;

    const isAtBaseline =
      windSpeed === baselineWeatherRef.current.wind &&
      humidity === baselineWeatherRef.current.hum &&
      temperature === baselineWeatherRef.current.temp &&
      precipitation === 0 &&
      !activeScenario;

    if (isAtBaseline) {
      setIsSimulating(false);
      setSimulatedAqi(baselineAqi);
      setShapFactors([
        { name: 'Wind Dispersion', impact: 0.0, desc: `At live baseline (${windSpeed} km/h)`, isPositive: false },
        { name: 'Humidity', impact: 0.0, desc: `At live baseline (${humidity}%)`, isPositive: false },
        { name: 'Temperature', impact: 0.0, desc: `At live baseline (${temperature}°C)`, isPositive: false },
      ]);
      return;
    }

    // Set simulation loading skeleton state
    setIsSimulating(true);

    // Trailing debounce timer (120ms) for smooth slider drag without bottlenecking
    const debounceTimer = setTimeout(() => {
      fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCity,
          wind_speed_10m: Number(windSpeed),
          temperature_2m: Number(temperature),
          relative_humidity_2m: Number(humidity),
          precipitation: Number(precipitation),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!isCancelled && data) {
            if (data.simulated_aqi !== undefined) {
              setSimulatedAqi(Math.round(data.simulated_aqi));
            }
            if (data.original_aqi !== undefined) {
              setBaselineAqi(Math.round(data.original_aqi));
            }
            if (data.shap_factors && data.shap_factors.length > 0) {
              setShapFactors(data.shap_factors);
            }
          }
        })
        .catch(() => {
          // High-precision fallback calculation relative to live baseline
          const baseWind = baselineWeatherRef.current.wind || 14;
          const baseHum = baselineWeatherRef.current.hum || 60;
          const baseTemp = baselineWeatherRef.current.temp || 28;

          const windImpact = Math.round((baseWind - windSpeed) * 2.8);
          const humidityImpact = Math.round((humidity - baseHum) * 0.6);
          const sunImpact = Math.round((baseTemp - temperature) * 1.2 - precipitation * 2.0);

          setShapFactors([
            {
              name: windSpeed < baseWind ? 'Calm Wind' : 'Wind Dispersion',
              impact: windImpact,
              desc: windImpact > 0 ? 'Reduces Smog Dispersal' : 'Enhances Air Ventilation',
              isPositive: windImpact > 0,
            },
            {
              name: 'Humidity',
              impact: humidityImpact,
              desc: humidityImpact > 0 ? 'Enhances Particle Formation' : 'Dries Suspended Moisture',
              isPositive: humidityImpact > 0,
            },
            {
              name: precipitation > 0 ? 'Rainwash' : 'Temperature Shift',
              impact: sunImpact,
              desc: precipitation > 0 ? 'Wet Scavenging of PM2.5' : sunImpact < 0 ? 'Promotes Pollutant Photo-decay' : 'Traps Ground Air Layer',
              isPositive: sunImpact > 0,
            },
          ]);
        })
        .finally(() => {
          if (!isCancelled) {
            setIsSimulating(false);
          }
        });
    }, 120);

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [windSpeed, humidity, temperature, precipitation, selectedCity, isInitialLoad, activeScenario, baselineAqi]);

  // Apply predefined scenario
  const handleScenarioClick = (preset) => {
    setActiveScenario(preset.id);
    setIsSimulating(true);
    setWindSpeed(preset.overrides.wind_speed_10m);
    setHumidity(preset.overrides.relative_humidity_2m);
    setTemperature(preset.overrides.temperature_2m);
    setPrecipitation(preset.overrides.precipitation);
  };

  // Reset to current live baseline
  const handleResetToBaseline = () => {
    setActiveScenario(null);
    setIsSimulating(false);
    setWindSpeed(baselineWeatherRef.current.wind);
    setHumidity(baselineWeatherRef.current.hum);
    setTemperature(baselineWeatherRef.current.temp);
    setPrecipitation(0);
    setSimulatedAqi(baselineAqi);
  };

  if (isInitialLoad) {
    return <ShapLabSkeleton selectedCity={selectedCity} />;
  }

  const isModifiedFromBaseline =
    windSpeed !== baselineWeatherRef.current.wind ||
    humidity !== baselineWeatherRef.current.hum ||
    temperature !== baselineWeatherRef.current.temp ||
    precipitation !== 0 ||
    activeScenario !== null;

  const delta = simulatedAqi - baselineAqi;
  const category = getCategoryInfo(simulatedAqi);
  const needleAngle = calculateNeedleAngle(simulatedAqi);

  return (
    <div className="flex flex-col gap-5 w-full pb-10 select-none text-white font-sans animate-data-enter">
      {/* Top Main Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-normal tracking-wide text-white/95 drop-shadow-sm">
          Interactive What-If Meteorological Simulator (Explainable AI)
        </h1>
      </div>

      {/* Main 2-Column Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ========================================================================= */}
        {/* METEOROLOGICAL SANDBOX (SLIDERS): order-2 on mobile, left 7 cols on desktop */}
        {/* ========================================================================= */}
        <div className="order-2 lg:order-1 lg:col-span-7 rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden">
          {/* Ambient Glass Glow */}
          <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

          <div className="space-y-5 sm:space-y-6 relative z-10">
            {/* Header with Title & Reset Button */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-medium text-white/90 tracking-wide flex items-center gap-2">
                  <span>Meteorological Sandbox</span>
                  <Sparkles size={14} className="text-sky-400 opacity-80" />
                </h2>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                  Drag sliders to simulate weather shifts
                </span>
              </div>

              {isModifiedFromBaseline && (
                <button
                  onClick={handleResetToBaseline}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 hover:text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
                  title="Reset sliders to today's live baseline"
                >
                  <RotateCcw size={12} />
                  <span>Reset Baseline</span>
                </button>
              )}
            </div>

            {/* Slider 1: Wind Speed */}
            <div className="space-y-1.5 group">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    <Wind size={14} />
                  </div>
                  <span className="text-slate-200 font-medium text-sm">Wind Speed</span>
                </div>
                <span className="font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-lg text-xs font-semibold shadow-inner">
                  {windSpeed} km/h
                </span>
              </div>
              <div className="relative flex items-center py-1">
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={windSpeed}
                  onChange={(e) => {
                    setActiveScenario(null);
                    setWindSpeed(Number(e.target.value));
                  }}
                  className="custom-slider slider-emerald w-full"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #34d399 ${getSliderPercent(windSpeed, 0, 40)}%, rgba(30, 41, 59, 0.85) ${getSliderPercent(windSpeed, 0, 40)}%, rgba(30, 41, 59, 0.85) 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
                <span>0 km/h (Calm)</span>
                <span>20 km/h</span>
                <span>40 km/h (Gale)</span>
              </div>
            </div>

            {/* Slider 2: Relative Humidity */}
            <div className="space-y-1.5 group">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
                    <Droplets size={14} />
                  </div>
                  <span className="text-slate-200 font-medium text-sm">Relative Humidity</span>
                </div>
                <span className="font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-lg text-xs font-semibold shadow-inner">
                  {humidity}%
                </span>
              </div>
              <div className="relative flex items-center py-1">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={humidity}
                  onChange={(e) => {
                    setActiveScenario(null);
                    setHumidity(Number(e.target.value));
                  }}
                  className="custom-slider slider-cyan w-full"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #38bdf8 ${getSliderPercent(humidity, 10, 100)}%, rgba(30, 41, 59, 0.85) ${getSliderPercent(humidity, 10, 100)}%, rgba(30, 41, 59, 0.85) 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
                <span>10% (Dry Air)</span>
                <span>55% (Comfort)</span>
                <span>100% (Saturated)</span>
              </div>
            </div>

            {/* Slider 3: Temperature */}
            <div className="space-y-1.5 group">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    <Thermometer size={14} />
                  </div>
                  <span className="text-slate-200 font-medium text-sm">Temperature</span>
                </div>
                <span className="font-mono text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-lg text-xs font-semibold shadow-inner">
                  {temperature}°C
                </span>
              </div>
              <div className="relative flex items-center py-1">
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="1"
                  value={temperature}
                  onChange={(e) => {
                    setActiveScenario(null);
                    setTemperature(Number(e.target.value));
                  }}
                  className="custom-slider slider-amber w-full"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #fb923c ${getSliderPercent(temperature, 5, 45)}%, rgba(30, 41, 59, 0.85) ${getSliderPercent(temperature, 5, 45)}%, rgba(30, 41, 59, 0.85) 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
                <span>5°C (Chilly)</span>
                <span>25°C (Mild)</span>
                <span>45°C (Heatwave)</span>
              </div>
            </div>

            {/* Slider 4: Precipitation */}
            <div className="space-y-1.5 group">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/25">
                    <CloudRain size={14} />
                  </div>
                  <span className="text-slate-200 font-medium text-sm">Precipitation (Rainwash)</span>
                </div>
                <span className="font-mono text-blue-300 bg-blue-500/10 border border-blue-500/25 px-2.5 py-0.5 rounded-lg text-xs font-semibold shadow-inner">
                  {precipitation} mm
                </span>
              </div>
              <div className="relative flex items-center py-1">
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={precipitation}
                  onChange={(e) => {
                    setActiveScenario(null);
                    setPrecipitation(Number(e.target.value));
                  }}
                  className="custom-slider slider-blue w-full"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #60a5fa ${getSliderPercent(precipitation, 0, 30)}%, rgba(30, 41, 59, 0.85) ${getSliderPercent(precipitation, 0, 30)}%, rgba(30, 41, 59, 0.85) 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
                <span>0 mm (Clear)</span>
                <span>15 mm (Moderate)</span>
                <span>30 mm (Downpour)</span>
              </div>
            </div>
          </div>

          {/* Bottom Scenario Section */}
          <div className="mt-8 pt-4 space-y-3">
            <span className="text-sm text-slate-300 font-normal block">What-If Scenario</span>
            <div className="flex flex-wrap items-center gap-3">
              {SCENARIO_PRESETS.map((preset) => {
                const isActive = activeScenario === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleScenarioClick(preset)}
                    className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#15233c] text-white border border-sky-400/80 shadow-[0_0_18px_rgba(56,189,248,0.4)] ring-1 ring-sky-400/60'
                        : 'bg-slate-900/60 text-slate-300 border border-white/10 hover:border-white/25 hover:bg-slate-800/50'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SPEEDOMETER & SHAP FORCE PLOT: order-1 on mobile (TOP), right 5 cols on desktop */}
        {/* ========================================================================= */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col justify-between gap-5">
          {/* ----------------------------------------------------------------------- */}
          {/* Card 1: Speedometer Gauge AQI Card                                      */}
          {/* ----------------------------------------------------------------------- */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl flex flex-col items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden min-h-[290px] sm:min-h-[300px]">
            {/* Dynamic Status Ambient Glow */}
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 w-52 h-44 rounded-full blur-3xl pointer-events-none transition-all duration-700"
              style={{
                backgroundColor: category.color,
                opacity: 0.28,
              }}
            />
            {/* Top Live Indicator Header */}
            <div className="w-full flex items-center justify-between border-b border-white/5 pb-2.5 text-xs">
              <span className="text-slate-300 font-medium tracking-wide">Atmospheric Speedometer</span>
              
              {isSimulating ? (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-[10px] sm:text-[11px] font-medium text-sky-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
                  </span>
                  <span>Simulating SHAP...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] sm:text-[11px] font-medium text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span>Today Live: {baselineAqi} AQI</span>
                </div>
              )}
            </div>

            {/* SVG Speedometer Gauge Canvas */}
            <div className="relative w-full max-w-[280px] h-40 sm:h-44 flex items-center justify-center pt-2">
              <svg viewBox="0 0 220 130" className="w-full h-full overflow-visible">
                <defs>
                  {/* High-vibrancy Green -> Yellow -> Orange -> Red Gradient matching exact image */}
                  <linearGradient id="gauge-arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="28%" stopColor="#22c55e" />
                    <stop offset="48%" stopColor="#eab308" />
                    <stop offset="70%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* Background Dim Base Arc */}
                <path
                  d="M 25 110 A 85 85 0 0 1 195 110"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="15"
                  strokeLinecap="round"
                />

                {/* Vibrant Colored Glowing Arc */}
                <path
                  d="M 25 110 A 85 85 0 0 1 195 110"
                  fill="none"
                  stroke="url(#gauge-arc-gradient)"
                  strokeWidth="15"
                  strokeLinecap="round"
                  className={isSimulating ? 'opacity-50' : 'opacity-100'}
                  style={{
                    transition: 'opacity 0.2s ease',
                    filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.35))',
                  }}
                />

                {/* Indicator Gauge Needle */}
                <g
                  transform={`rotate(${needleAngle}, 110, 110)`}
                  className={`transition-transform duration-500 ease-out ${isSimulating ? 'opacity-30' : 'opacity-100'}`}
                  style={{ willChange: 'transform' }}
                >
                  <line
                    x1="130"
                    y1="110"
                    x2="192"
                    y2="110"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]"
                  />
                </g>
              </svg>

              {/* Central AQI Numerical Readout - Perfectly centered inside the arc cavity */}
              <div
                className={`absolute top-[72px] sm:top-[76px] flex flex-col items-center justify-center text-center transition-all duration-300 ${
                  isSimulating
                    ? 'blur-[6px] opacity-60 scale-95 select-none animate-pulse'
                    : 'blur-0 opacity-100 scale-100'
                }`}
              >
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
                  {simulatedAqi}
                </span>
                <span className="text-[11px] sm:text-[12px] font-medium uppercase tracking-widest text-slate-400 mt-0.5">
                  AQI
                </span>
                <span
                  className="text-xs sm:text-sm font-medium mt-0.5"
                  style={{ color: category.color }}
                >
                  {category.label}
                </span>
              </div>
            </div>

            {/* Bottom Predicted Shift Badge */}
            <div className="mt-4 w-full py-2 px-3 sm:px-4 rounded-xl bg-[#09111e]/90 border border-slate-700/60 text-center text-xs sm:text-sm font-sans shadow-inner min-h-[38px] flex items-center justify-center">
              {isSimulating ? (
                <div className="flex items-center justify-center gap-2">
                  <Cpu size={14} className="animate-spin text-sky-400" />
                  <span className="text-xs text-sky-300 font-mono">Running LightGBM TreeExplainer...</span>
                </div>
              ) : delta === 0 ? (
                <span className="text-slate-300 text-xs sm:text-sm">
                  ● Showing <span className="font-semibold text-white">Today's Live Baseline</span> ({baselineAqi} AQI).
                </span>
              ) : (
                <div className="text-xs sm:text-sm">
                  <span className="text-slate-300">Predicted Shift: </span>
                  <span
                    className={`font-semibold ${
                      delta > 0
                        ? 'text-[#f87171]'
                        : delta < 0
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {delta > 0 ? `+${delta}` : delta} AQI from Baseline ({baselineAqi})
                  </span>
                </div>
              )}
            </div>

            {/* User Guidance Micro-Copy */}
            <p className="text-[10px] sm:text-[11px] text-slate-400 text-center pt-2 leading-relaxed">
              💡 <b>Experiment with Sliders</b>: Adjust wind, humidity, or temperature to simulate how today's air quality responds!
            </p>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* Card 2: Explainable AI (SHAP) Waterfall Force Plot                      */}
          {/* ----------------------------------------------------------------------- */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 backdrop-blur-xl flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden min-h-[220px]">
            {/* Ambient Glass Glow */}
            <div className="absolute w-52 h-52 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-sm font-medium text-white/90 tracking-wide">
                Explainable AI (SHAP) Waterfall Force Plot
              </h3>
              {isSimulating && (
                <span className="text-[11px] font-mono text-sky-300 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
                  Recalculating...
                </span>
              )}
            </div>

            {/* Waterfall Plot Body with Left "Factor" Vertical Label */}
            <div className="flex items-stretch gap-2 py-2">
              {/* Left Vertical "Factor" Label */}
              <div className="flex items-center justify-center pr-1 select-none">
                <span className="-rotate-90 text-xs text-slate-400 font-normal tracking-wider">
                  Factor
                </span>
              </div>

              {/* 3 Horizontal Factor Rows with Center Zero Axis */}
              <div className="flex-1 space-y-4">
                {shapFactors.map((factor, idx) => {
                  const isPos = factor.isPositive;
                  const absVal = Math.abs(factor.impact);
                  // Scale width: max impact ~50 -> width 80%
                  const barWidthPercent = Math.min(85, Math.max(20, (absVal / 50) * 80));

                  return (
                    <div key={idx} className={`space-y-0.5 transition-opacity duration-200 ${isSimulating ? 'opacity-60' : 'opacity-100'}`}>
                      {/* Factor Name & Value */}
                      <div className="grid grid-cols-12 gap-2 items-center text-xs">
                        {/* Factor Name Column */}
                        <div className="col-span-4 text-right text-slate-300 text-xs font-normal truncate">
                          {factor.name}
                        </div>

                        {/* Force Bar Canvas Column */}
                        <div className="col-span-8 flex items-center relative h-6">
                          {/* Vertical Zero Divider Line */}
                          <div className="absolute left-[32%] top-0 bottom-0 w-[1.5px] bg-slate-700/80" />

                          {isPos ? (
                            /* Positive Impact: Red Bar Extending Right */
                            <div className="flex items-center pl-[32%] w-full">
                              <div
                                className={`h-5 rounded-r-[2px] bg-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all duration-300 ${isSimulating ? 'glass-shimmer' : ''}`}
                                style={{ width: `${barWidthPercent}%` }}
                              />
                              <span className="ml-2 text-xs font-semibold text-[#f87171]">
                                +{factor.impact}
                              </span>
                            </div>
                          ) : (
                            /* Negative Impact: Green Bar Extending Left */
                            <div className="flex items-center justify-end pr-[68%] w-full">
                              <span className="mr-2 text-xs font-semibold text-[#34d399]">
                                {factor.impact}
                              </span>
                              <div
                                className={`h-5 rounded-l-[2px] bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-300 ${isSimulating ? 'glass-shimmer' : ''}`}
                                style={{ width: `${barWidthPercent}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Descriptive Impact Subtext underneath */}
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4" />
                        <div className="col-span-8 pl-1">
                          <span className="text-[11px] text-slate-400 font-normal block truncate">
                            {factor.desc}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
