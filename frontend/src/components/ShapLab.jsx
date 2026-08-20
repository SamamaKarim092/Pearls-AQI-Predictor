import React, { useState, useEffect, useId } from 'react';

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

// Helper to calculate category info from AQI
function getCategoryInfo(aqi) {
  if (aqi <= 50) return { label: 'Good', color: '#10b981' };
  if (aqi <= 100) return { label: 'Moderate', color: '#fbbf24' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#f97316' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#a855f7' };
  return { label: 'Hazardous', color: '#881337' };
}

export default function ShapLab({ selectedCity = 'Karachi' }) {
  // 4 Core Slider Parameters matching exact mockup
  const [windSpeed, setWindSpeed] = useState(12);
  const [humidity, setHumidity] = useState(78);
  const [temperature, setTemperature] = useState(31);
  const [precipitation, setPrecipitation] = useState(0);

  const [activeScenario, setActiveScenario] = useState('rainwash');
  const [simulatedAqi, setSimulatedAqi] = useState(138);
  const [baselineAqi, setBaselineAqi] = useState(62);
  const [shapFactors, setShapFactors] = useState([]);

  // Fetch live baseline when city changes
  useEffect(() => {
    fetch(`http://localhost:8000/api/forecast?city=${selectedCity}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.current && data.current.aqi) {
          setBaselineAqi(Math.round(data.current.aqi));
        }
      })
      .catch(() => {
        setBaselineAqi(selectedCity === 'Karachi' ? 62 : selectedCity === 'Lahore' ? 152 : 98);
      });
  }, [selectedCity]);

  // Compute simulation & SHAP breakdown on parameter change
  useEffect(() => {
    let isCancelled = false;

    fetch('http://localhost:8000/api/simulate', {
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
      .catch((err) => {
        console.warn('Using client-side SHAP model:', err);
        // Fallback SHAP factors if backend is offline
        const windImpact = Math.round((14 - windSpeed) * 2.8);
        const humidityImpact = Math.round((humidity - 50) * 0.7);
        const tempImpact = Math.round((28 - temperature) * 1.4);
        const rainImpact = Math.round(-precipitation * 2.2);

        setShapFactors([
          {
            name: windSpeed < 10 ? 'Calm Wind' : 'Wind Dispersion',
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
            name: precipitation > 0 ? 'Rainwash' : 'Sunlight / Temp',
            impact: precipitation > 0 ? rainImpact : tempImpact,
            desc: precipitation > 0 ? 'Wet Scavenging of PM2.5' : tempImpact < 0 ? 'Promotes Pollutant Photo-decay' : 'Traps Ground Air Layer',
            isPositive: (precipitation > 0 ? rainImpact : tempImpact) > 0,
          },
        ]);
      });

    return () => {
      isCancelled = true;
    };
  }, [windSpeed, humidity, temperature, precipitation, selectedCity]);

  // Apply predefined scenario
  const handleScenarioClick = (preset) => {
    setActiveScenario(preset.id);
    setWindSpeed(preset.overrides.wind_speed_10m);
    setHumidity(preset.overrides.relative_humidity_2m);
    setTemperature(preset.overrides.temperature_2m);
    setPrecipitation(preset.overrides.precipitation);
  };

  const delta = simulatedAqi - baselineAqi;
  const category = getCategoryInfo(simulatedAqi);

  // Speedometer calculation
  // AQI range: 0 to 300 -> angle: -180 deg to 0 deg
  const clampedAqi = Math.max(0, Math.min(300, simulatedAqi));
  const needleAngle = -180 + (clampedAqi / 300) * 180; // from -180 (left) to 0 (right)

  return (
    <div className="flex flex-col gap-5 w-full pb-10 select-none text-white font-sans">
      {/* Top Main Heading matching exact image */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/95 drop-shadow-sm">
          Interactive What-If Meteorological Simulator (Explainable AI)
        </h1>
      </div>

      {/* Main 2-Column Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ========================================================================= */}
        {/* LEFT CARD (7 cols): Meteorological Sandbox                                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0d1626]/75 p-6 backdrop-blur-md flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-white/90 tracking-wide">
              Meteorological Sandbox
            </h2>

            {/* Slider 1: Wind Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-normal">Wind Speed</span>
                <span className="font-mono text-slate-200 text-sm">{windSpeed} km/h</span>
              </div>
              <div className="relative flex items-center">
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
                  className="w-full h-[6px] rounded-lg appearance-none cursor-pointer bg-slate-800/80"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #34d399 ${(windSpeed / 40) * 100}%, rgba(30, 41, 59, 0.8) ${(windSpeed / 40) * 100}%, rgba(30, 41, 59, 0.8) 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Slider 2: Relative Humidity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-normal">Relative Humidity</span>
                <span className="font-mono text-slate-200 text-sm">{humidity}%</span>
              </div>
              <div className="relative flex items-center">
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
                  className="w-full h-[6px] rounded-lg appearance-none cursor-pointer bg-slate-800/80"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #38bdf8 ${(humidity / 100) * 100}%, rgba(30, 41, 59, 0.8) ${(humidity / 100) * 100}%, rgba(30, 41, 59, 0.8) 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Slider 3: Temperature */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-normal">Temperature</span>
                <span className="font-mono text-slate-200 text-sm">{temperature}°C</span>
              </div>
              <div className="relative flex items-center">
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
                  className="w-full h-[6px] rounded-lg appearance-none cursor-pointer bg-slate-800/80"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #fb923c ${((temperature - 5) / 40) * 100}%, rgba(30, 41, 59, 0.8) ${((temperature - 5) / 40) * 100}%, rgba(30, 41, 59, 0.8) 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Slider 4: Precipitation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-normal">Precipitation</span>
                <span className="font-mono text-slate-200 text-sm">{precipitation} mm</span>
              </div>
              <div className="relative flex items-center">
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
                  className="w-full h-[6px] rounded-lg appearance-none cursor-pointer bg-slate-800/80"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #60a5fa ${(precipitation / 30) * 100}%, rgba(30, 41, 59, 0.8) ${(precipitation / 30) * 100}%, rgba(30, 41, 59, 0.8) 100%)`,
                  }}
                />
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
                        ? 'bg-slate-800/90 text-white border border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.35)] ring-1 ring-sky-400/50'
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
        {/* RIGHT COLUMN (5 cols): Gauge Speedometer & SHAP Waterfall Force Plot      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          {/* ----------------------------------------------------------------------- */}
          {/* Card 1: Speedometer Gauge AQI Card (EXACT MOCKUP)                       */}
          {/* ----------------------------------------------------------------------- */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1626]/75 p-6 backdrop-blur-md flex flex-col items-center justify-between shadow-2xl relative">
            {/* SVG Speedometer Gauge Canvas */}
            <div className="relative w-64 h-36 flex items-center justify-center mt-2">
              <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
                <defs>
                  {/* Gauge Arc Gradient from Green -> Yellow -> Red */}
                  <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="45%" stopColor="#fbbf24" />
                    <stop offset="80%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>

                  <filter id="glow-arc" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background Dim Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />

                {/* Active Colored Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#gauge-gradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  filter="url(#glow-arc)"
                />

                {/* Dial Center Pivot Point */}
                <circle cx="100" cy="100" r="4" fill="#ffffff" />

                {/* White Pointer Needle */}
                <line
                  x1="100"
                  y1="100"
                  x2="160"
                  y2="100"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform={`rotate(${needleAngle}, 100, 100)`}
                  className="transition-transform duration-500 ease-out drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
              </svg>

              {/* Central AQI Numerical Readout */}
              <div className="absolute top-12 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold font-mono tracking-tight text-white">
                  {simulatedAqi}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  AQI
                </span>
                <span
                  className="text-xs font-semibold mt-0.5"
                  style={{ color: category.color }}
                >
                  {category.label}
                </span>
              </div>
            </div>

            {/* Bottom Predicted Shift Badge */}
            <div className="mt-4 w-full py-1.5 px-4 rounded-xl bg-slate-900/80 border border-white/5 text-center text-xs font-mono">
              <span className="text-slate-400">Predicted Shift: </span>
              <span
                className={`font-bold ${
                  delta > 0
                    ? 'text-rose-400'
                    : delta < 0
                    ? 'text-emerald-400'
                    : 'text-slate-300'
                }`}
              >
                {delta > 0 ? `+${delta}` : delta} AQI from Baseline
              </span>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* Card 2: Explainable AI (SHAP) Waterfall Force Plot (EXACT MOCKUP)       */}
          {/* ----------------------------------------------------------------------- */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1626]/75 p-5 backdrop-blur-md flex flex-col justify-between shadow-2xl">
            <h3 className="text-sm font-semibold text-white/90 tracking-wide pb-3">
              Explainable AI (SHAP) Waterfall Force Plot
            </h3>

            {/* Waterfall Plot Body with Left "Factor" Vertical Label */}
            <div className="flex items-stretch gap-2 py-2">
              {/* Left Vertical "Factor" Label */}
              <div className="flex items-center justify-center pr-1 select-none">
                <span className="-rotate-90 text-[11px] text-slate-400 font-medium tracking-wider">
                  Factor
                </span>
              </div>

              {/* 3 Horizontal Factor Rows with Center Zero Axis */}
              <div className="flex-1 space-y-3.5">
                {shapFactors.map((factor, idx) => {
                  const isPos = factor.isPositive;
                  const absVal = Math.abs(factor.impact);
                  // Scale width: max impact ~50 -> width 90%
                  const barWidthPercent = Math.min(90, Math.max(15, (absVal / 50) * 90));

                  return (
                    <div key={idx} className="space-y-0.5">
                      {/* Factor Name & Value */}
                      <div className="grid grid-cols-12 gap-2 items-center text-xs">
                        {/* Factor Name Column */}
                        <div className="col-span-4 text-right text-slate-300 font-mono text-[11px] truncate">
                          {factor.name}
                        </div>

                        {/* Force Bar Canvas Column */}
                        <div className="col-span-8 flex items-center relative h-6">
                          {/* Vertical Zero Divider Line */}
                          <div className="absolute left-[30%] top-0 bottom-0 w-[1.5px] bg-slate-700/80" />

                          {isPos ? (
                            /* Positive Impact: Red Bar Extending Right */
                            <div className="flex items-center pl-[30%] w-full">
                              <div
                                className="h-4 rounded-r-sm bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-300"
                                style={{ width: `${barWidthPercent}%` }}
                              />
                              <span className="ml-1.5 text-[11px] font-mono font-bold text-rose-400">
                                +{factor.impact}
                              </span>
                            </div>
                          ) : (
                            /* Negative Impact: Green Bar Extending Left */
                            <div className="flex items-center justify-end pr-[70%] w-full">
                              <span className="mr-1.5 text-[11px] font-mono font-bold text-emerald-400">
                                {factor.impact}
                              </span>
                              <div
                                className="h-4 rounded-l-sm bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-300"
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
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
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
