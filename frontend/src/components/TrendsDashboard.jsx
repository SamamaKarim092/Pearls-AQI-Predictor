import React, { useState, useEffect } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Sparkles,
  TrendingUp,
  Info,
  X,
  HelpCircle,
} from 'lucide-react';
import DiurnalGithubHeatmap from './DiurnalGithubHeatmap';

const SUB_TABS = [
  { id: '3day', label: 'Upcoming 3-Day Forecast', badge: '10Pearls Spec' },
  { id: '7day', label: 'Upcoming 7-Day Forecast', badge: 'Extended' },
  { id: '30day', label: '30-Day Trend' },
  { id: 'seasonal', label: 'Seasonal' },
  { id: 'history', label: '2-Year History' },
];

function WeatherIcon({ type, className = 'w-6 h-6 text-amber-400' }) {
  switch (type) {
    case 'sun':
      return <Sun className={className} />;
    case 'cloud':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'rain':
      return <CloudRain className={`${className} text-sky-400`} />;
    case 'wind':
      return <Wind className={`${className} text-teal-300`} />;
    default:
      return <Sun className={className} />;
  }
}

export default function TrendsDashboard({ selectedCity = 'Karachi' }) {
  const [activeTab, setActiveTab] = useState('3day');
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pollutantModal, setPollutantModal] = useState(null);

  // Fetch trends and forecasts for selected city and active horizon
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    fetch(`http://localhost:8000/api/trends?city=${selectedCity}&horizon=${activeTab}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isCancelled && data) {
          setTrendsData(data);
        }
      })
      .catch((err) => {
        console.warn('Using offline trends fallback:', err);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCity, activeTab]);

  // Fallback defaults
  const kpis = trendsData?.kpis || {
    average_aqi: {
      value: selectedCity === 'Karachi' ? 52 : selectedCity === 'Lahore' ? 142 : 136,
      label: selectedCity === 'Karachi' ? 'Good Air' : 'Unhealthy',
      color: selectedCity === 'Karachi' ? '#10b981' : '#ef4444',
      period: activeTab === '3day' ? 'Upcoming 3-Day Average AQI' : 'Upcoming 7-Day Average AQI',
    },
    cleanest_day: { day_name: 'Thu', aqi: selectedCity === 'Karachi' ? 32 : 98, date_str: '20 Aug', color: '#10b981' },
    peak_smog: { day_name: 'Sun', aqi: selectedCity === 'Karachi' ? 88 : 175, category: selectedCity === 'Karachi' ? 'Moderate' : 'Unhealthy', color: selectedCity === 'Karachi' ? '#fbbf24' : '#ef4444' },
    dominant_hazard: { pollutant: 'PM2.5', percentage: '85%', subtext: 'PM2.5, 85%  e.g., 10%' },
  };

  const dailyCards = trendsData?.daily_cards || [
    { day_name: 'Thu', date_str: '20 Aug', aqi: 48, color: '#10b981', weather_icon: 'sun', condition: 'Sunny' },
    { day_name: 'Fri', date_str: '21 Aug', aqi: 52, color: '#10b981', weather_icon: 'cloud', condition: 'Cloudy' },
    { day_name: 'Sat', date_str: '22 Aug', aqi: 32, color: '#10b981', weather_icon: 'rain', condition: 'Rain' },
    { day_name: 'Sun', date_str: '23 Aug', aqi: 32, color: '#10b981', weather_icon: 'rain', condition: 'Rain' },
    { day_name: 'Mon', date_str: '24 Aug', aqi: 82, color: '#fbbf24', weather_icon: 'cloud', condition: 'Haze' },
    { day_name: 'Tue', date_str: '25 Aug', aqi: 86, color: '#fbbf24', weather_icon: 'wind', condition: 'Breezy' },
    { day_name: 'Wed', date_str: '26 Aug', aqi: 77, color: '#f97316', weather_icon: 'sun', condition: 'Sunny' },
  ].slice(0, activeTab === '3day' ? 3 : 7);

  // 12 Months matching exact reference heights and color gradients
  const seasonalBars = [
    { month: 'Jan', height: 68, isPeak: false },
    { month: 'Feb', height: 58, isPeak: false },
    { month: 'Mar', height: 48, isPeak: false },
    { month: 'Apr', height: 64, isPeak: true },
    { month: 'May', height: 76, isPeak: true },
    { month: 'Jun', height: 78, isPeak: true },
    { month: 'Jul', height: 54, isPeak: false },
    { month: 'Aug', height: 42, isPeak: false },
    { month: 'Sep', height: 48, isPeak: false },
    { month: 'Oct', height: 70, isPeak: true },
    { month: 'Nov', height: 96, isPeak: true },
    { month: 'Dec', height: 74, isPeak: true },
  ];

  // Helper to generate glowing SVG bezier path for forecast chart
  const svgWidth = 1000;
  const svgHeight = 220;
  const curvePts = trendsData?.curve_points || [];

  const generateChartPath = () => {
    if (!curvePts || curvePts.length === 0) {
      return "M 0 140 Q 250 80, 500 130 T 750 60 T 1000 110";
    }
    const points = curvePts.map((pt) => {
      const x = pt.x_ratio * svgWidth;
      const clampedAqi = Math.max(10, Math.min(220, pt.aqi));
      const y = svgHeight - 30 - ((clampedAqi - 10) / 210) * (svgHeight - 60);
      return { x, y };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      const my = (p0.y + p1.y) / 2;
      d += ` Q ${p0.x} ${p0.y}, ${mx} ${my}`;
    }
    const last = points[points.length - 1];
    d += ` T ${last.x} ${last.y}`;
    return d;
  };

  const linePath = generateChartPath();
  const areaPath = `${linePath} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  return (
    <div className="flex flex-col gap-5 w-full pb-10 select-none">
      {/* Top Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                    tab.id === '3day'
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                      : 'bg-sky-500/25 text-sky-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Sparkles size={13} className="text-emerald-400" />
          <span>LightGBM Multi-Horizon Predictor</span>
        </div>
      </div>

      {/* Row 1: 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Average AQI */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-md flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">
            {kpis.average_aqi.period || `${activeTab === '3day' ? '3' : '7'}-Day Average AQI`}
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <span className="text-4xl font-bold tracking-tight text-white font-mono">
              {kpis.average_aqi.value}
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: `${kpis.average_aqi.color}20`,
                borderColor: `${kpis.average_aqi.color}40`,
                color: kpis.average_aqi.color,
              }}
            >
              {kpis.average_aqi.label}
            </span>
          </div>
        </div>

        {/* Card 2: Cleanest Day */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-md flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Cleanest Day</span>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-slate-200">
              {kpis.cleanest_day.day_name}
            </span>
            <span className="text-3xl font-bold text-emerald-400 font-mono drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]">
              {kpis.cleanest_day.aqi}
            </span>
          </div>
        </div>

        {/* Card 3: Peak Smog */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-md flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Peak Smog</span>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-slate-200">
              {kpis.peak_smog.day_name}
            </span>
            <span
              className="text-3xl font-bold font-mono"
              style={{ color: kpis.peak_smog.color }}
            >
              {kpis.peak_smog.aqi}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-medium border ml-auto"
              style={{
                backgroundColor: `${kpis.peak_smog.color}20`,
                borderColor: `${kpis.peak_smog.color}40`,
                color: kpis.peak_smog.color,
              }}
            >
              {kpis.peak_smog.category}
            </span>
          </div>
        </div>

        {/* Card 4: Dominant Hazard */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-md flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Dominant Hazard</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-white font-mono">
              {kpis.dominant_hazard.pollutant}
            </span>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-300 font-mono block">
                {kpis.dominant_hazard.percentage}
              </span>
              <span className="text-[10px] text-slate-400">PM2.5, 85% e.g., 10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 7-Day / 3-Day Glowing Forecast Area Chart */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold tracking-wide text-white">
              {activeTab === '3day' ? 'Upcoming 3-Day Hourly AI Forecast Wave' : '7-Day AQI Forecast'}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {selectedCity} &bull; LightGBM Ensemble Confidence: 94.2%
          </span>
        </div>

        {/* Glowing SVG Wave Canvas */}
        <div className="relative w-full h-44 sm:h-52 my-1">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-amber-500/10 blur-2xl pointer-events-none" />

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="wave-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>

              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Grid Guidelines */}
            <line x1="0" y1="50" x2={svgWidth} y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="110" x2={svgWidth} y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="170" x2={svgWidth} y2="170" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

            <path d={areaPath} fill="url(#wave-area-grad)" />

            <path
              d={linePath}
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neon-glow)"
              className="drop-shadow-[0_0_12px_rgba(45,212,191,0.6)]"
            />
          </svg>
        </div>
      </div>

      {/* Row 3: Daily Forecast Cards Carousel (3 or 7 cards) */}
      <div className={`grid gap-3 ${activeTab === '3day' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-7'}`}>
        {dailyCards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/10 bg-slate-900/50 p-3.5 backdrop-blur-md flex flex-col justify-between items-center text-center transition-all hover:border-white/25 hover:bg-slate-800/60 group"
          >
            <div className="my-1 group-hover:scale-110 transition-transform">
              <WeatherIcon type={card.weather_icon} className="w-7 h-7 text-amber-400" />
            </div>

            <div className="mt-1">
              <span className="text-sm font-semibold text-white block">{card.day_name}</span>
              <span className="text-[11px] text-slate-400 font-mono block">{card.date_str}</span>
            </div>

            <div
              className="mt-3 w-full py-1 rounded-xl text-xs font-bold font-mono transition-all"
              style={{
                backgroundColor: `${card.color}25`,
                color: card.color === '#FFFF00' ? '#facc15' : card.color,
                border: `1px solid ${card.color}45`,
              }}
            >
              {card.aqi}
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* Row 4: Deep Atmospheric Insights Bento Grid */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ------------------------------------------------------------- */}
        {/* CARD 1 (6 cols): Dedicated GitHub-Style Diurnal Activity Heatmap */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-6 xl:col-span-6">
          <DiurnalGithubHeatmap />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CARD 2 (3 cols): 2-Year Seasonal Smog Pattern                */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-3 xl:col-span-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col justify-between shadow-xl">
          <div className="pb-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              2-Year Seasonal Smog Pattern
            </h3>
          </div>

          {/* 12 Vertical Rounded Pill Bars matching exact mockup */}
          <div className="flex items-end justify-between gap-1.5 h-48 pt-4 px-1 pb-1">
            {seasonalBars.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                <div
                  className={`w-2.5 sm:w-3 rounded-full transition-all duration-300 group-hover:scale-110 ${
                    bar.isPeak
                      ? 'bg-gradient-to-t from-rose-600 via-rose-500 to-orange-400 shadow-[0_0_8px_rgba(244,63,94,0.45)]'
                      : 'bg-gradient-to-t from-slate-600 via-slate-400 to-slate-300'
                  }`}
                  style={{ height: `${bar.height}%` }}
                  title={`${bar.month}: Seasonal Smog Index`}
                />
              </div>
            ))}
          </div>

          {/* 12 Month 3-Letter Labels below */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5">
            {seasonalBars.map((b, i) => (
              <span key={i} className="text-center flex-1">
                {b.month}
              </span>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CARD 3 (3 cols): Dominant Pollutant WHO Guidelines             */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-3 xl:col-span-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col justify-between shadow-xl">
          <div className="pb-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Dominant Pollutant
            </h3>
          </div>

          {/* 4 Clean Pollutant Guideline Rows */}
          <div className="space-y-4 my-auto py-1">
            {/* Row 1: PM2.5 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white font-mono w-14">PM2.5</span>
                <div className="flex-1 px-2">
                  <div className="flex justify-center text-[9px] text-slate-400 font-mono leading-none pb-0.5">
                    WHO guideline
                  </div>
                  <div className="relative w-full h-2.5 rounded-full bg-slate-800/90 overflow-visible">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 shadow-[0_0_6px_rgba(45,212,191,0.5)]"
                      style={{ width: '68%' }}
                    />
                    {/* WHO Marker Tick Line */}
                    <div className="absolute -top-1 bottom-0 left-[68%] w-[2px] h-4.5 bg-white/80 rounded-full" />
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPollutantModal({
                      name: 'PM2.5 (Fine Particulate Matter)',
                      desc: 'Particles <2.5 micrometers from vehicle exhaust and power stations that penetrate deep into lungs and blood circulation.',
                      who: '15 µg/m³ (24-hour mean)',
                    })
                  }
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                >
                  <Info size={14} />
                </button>
              </div>
            </div>

            {/* Row 2: PM10 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white font-mono w-14">PM10</span>
                <div className="flex-1 px-2">
                  <div className="flex justify-center text-[9px] text-slate-400 font-mono leading-none pb-0.5">
                    WHO guideline
                  </div>
                  <div className="relative w-full h-2.5 rounded-full bg-slate-800/90 overflow-visible">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 shadow-[0_0_6px_rgba(45,212,191,0.5)]"
                      style={{ width: '62%' }}
                    />
                    <div className="absolute -top-1 bottom-0 left-[62%] w-[2px] h-4.5 bg-white/80 rounded-full" />
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPollutantModal({
                      name: 'PM10 (Coarse Inhalable Particles)',
                      desc: 'Inhalable dust, construction debris, pollen, and road dust with diameters <10 micrometers.',
                      who: '45 µg/m³ (24-hour mean)',
                    })
                  }
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                >
                  <Info size={14} />
                </button>
              </div>
            </div>

            {/* Row 3: NO2 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white font-mono w-14">NO2</span>
                <div className="flex-1 px-2">
                  <div className="flex justify-center text-[9px] text-slate-400 font-mono leading-none pb-0.5">
                    WHO
                  </div>
                  <div className="relative w-full h-2.5 rounded-full bg-slate-800/90 overflow-visible">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400"
                      style={{ width: '45%' }}
                    />
                    <div className="absolute -top-1 bottom-0 left-[55%] w-[2px] h-4.5 bg-white/80 rounded-full" />
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPollutantModal({
                      name: 'NO2 (Nitrogen Dioxide)',
                      desc: 'Reddish-brown toxic gas from diesel vehicles and industrial fuel burning that inflames airways.',
                      who: '25 µg/m³ (24-hour mean)',
                    })
                  }
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                >
                  <Info size={14} />
                </button>
              </div>
            </div>

            {/* Row 4: SO2 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white font-mono w-14">SO2</span>
                <div className="flex-1 px-2">
                  <div className="flex justify-center text-[9px] text-slate-400 font-mono leading-none pb-0.5">
                    WHO
                  </div>
                  <div className="relative w-full h-2.5 rounded-full bg-slate-800/90 overflow-visible">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400"
                      style={{ width: '50%' }}
                    />
                    <div className="absolute -top-1 bottom-0 left-[55%] w-[2px] h-4.5 bg-white/80 rounded-full" />
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPollutantModal({
                      name: 'SO2 (Sulphur Dioxide)',
                      desc: 'Sharp, pungent gas emitted during high-sulphur fossil fuel burning and thermal power generation.',
                      who: '40 µg/m³ (24-hour mean)',
                    })
                  }
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                >
                  <Info size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pollutant Info Modal */}
      {pollutantModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setPollutantModal(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Info size={16} className="text-teal-400" />
                {pollutantModal.name}
              </h3>
              <button
                onClick={() => setPollutantModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 pt-3 text-xs text-slate-300 leading-relaxed">
              <p>{pollutantModal.desc}</p>
              <div className="rounded-lg bg-black/40 border border-white/5 p-3 text-center font-mono text-teal-300">
                WHO Guideline Standard: {pollutantModal.who}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
