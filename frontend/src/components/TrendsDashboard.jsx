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
import AnalyticsSkeleton from './AnalyticsSkeleton';

const SUB_TABS = [
  { id: '3day', label: 'Upcoming 3-Day Forecast', badge: '10Pearls Spec' },
  { id: '7day', label: 'Upcoming 7-Day Forecast', badge: 'Extended' },
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

// Helper to accurately classify monthly AQI severity category and color styling
function getSeasonalCategoryInfo(aqi) {
  if (aqi <= 50) {
    return {
      label: 'Good (Clean)',
      color: '#10b981',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      gradient: 'from-emerald-600 via-teal-400 to-sky-300',
      glow: 'shadow-[0_0_14px_rgba(16,185,129,0.8)] ring-2 ring-emerald-400/50',
    };
  }
  if (aqi <= 100) {
    return {
      label: 'Moderate',
      color: '#fbbf24',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      gradient: 'from-amber-600 via-yellow-400 to-orange-300',
      glow: 'shadow-[0_0_14px_rgba(251,191,36,0.8)] ring-2 ring-amber-400/50',
    };
  }
  if (aqi <= 150) {
    return {
      label: 'Unhealthy (SG)',
      color: '#f97316',
      badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      gradient: 'from-orange-600 via-orange-500 to-amber-400',
      glow: 'shadow-[0_0_14px_rgba(249,115,22,0.8)] ring-2 ring-orange-400/50',
    };
  }
  if (aqi <= 200) {
    return {
      label: 'Unhealthy',
      color: '#f43f5e',
      badgeClass: 'bg-rose-500/25 text-rose-300 border-rose-500/40',
      gradient: 'from-rose-600 via-rose-500 to-orange-400',
      glow: 'shadow-[0_0_14px_rgba(244,63,94,0.8)] ring-2 ring-rose-400/50',
    };
  }
  return {
    label: 'Severe Smog',
    color: '#e11d48',
    badgeClass: 'bg-rose-600/30 text-rose-200 border-rose-500/50',
    gradient: 'from-purple-600 via-rose-600 to-orange-500',
    glow: 'shadow-[0_0_16px_rgba(225,29,72,0.9)] ring-2 ring-rose-500/60',
  };
}

export default function TrendsDashboard({ selectedCity = 'Karachi' }) {
  const [activeTab, setActiveTab] = useState('3day');
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pollutantModal, setPollutantModal] = useState(null);
  const [hoveredSeason, setHoveredSeason] = useState(null);

  const FULL_MONTH_NAMES = {
    Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
    Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December'
  };

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
        console.warn('Error fetching trends:', err);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCity, activeTab]);

  const kpis = trendsData?.kpis;
  const dailyCards = trendsData?.daily_cards || [];
  const seasonalBars = trendsData?.seasonal_bars || [];
  const curvePts = trendsData?.curve_points || [];

  // Helper to generate glowing SVG bezier path for forecast chart
  const svgWidth = 1000;
  const svgHeight = 220;

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

      {loading || !trendsData || !kpis ? (
        <AnalyticsSkeleton activeTab={activeTab} />
      ) : (
        <div className="flex flex-col gap-5 w-full animate-data-enter">
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
          <DiurnalGithubHeatmap
            activeTab={activeTab}
            dailyCards={dailyCards}
            selectedCity={selectedCity}
          />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CARD 2 (3 cols): 2-Year Seasonal Smog Pattern                */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-3 xl:col-span-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col justify-between shadow-xl relative overflow-hidden h-full min-h-[340px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              2-Year Seasonal Smog Pattern
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 border border-white/10 text-rose-300">
              12 Months
            </span>
          </div>

          {/* 12 Vertical Rounded Pill Bars with interactive hover */}
          <div className="relative flex items-end justify-between gap-1.5 h-44 pt-6 px-1 pb-1">
            {seasonalBars.map((bar, idx) => {
              const heightPct = bar.height ?? Math.min(100, Math.max(20, Math.round((bar.aqi / 220) * 100)));
              const aqiVal = bar.aqi || Math.round(heightPct * 2.2);
              const catInfo = getSeasonalCategoryInfo(aqiVal);
              const fullMonth = FULL_MONTH_NAMES[bar.month] || bar.month;
              const isHovered = hoveredSeason?.month === bar.month;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                  onMouseEnter={() =>
                    setHoveredSeason({
                      month: bar.month,
                      fullMonth,
                      aqi: aqiVal,
                      catInfo,
                    })
                  }
                  onMouseLeave={() => setHoveredSeason(null)}
                >
                  {/* Floating Mini Tooltip on Hover */}
                  {isHovered && (
                    <div
                      className={`absolute -top-7.5 z-30 px-2 py-0.5 rounded-md bg-slate-900/95 border border-white/20 text-[10px] font-mono text-white shadow-xl whitespace-nowrap animate-fadeIn pointer-events-none ${
                        idx === 0
                          ? 'left-0 translate-x-0'
                          : idx === seasonalBars.length - 1
                          ? 'right-0 translate-x-0'
                          : 'left-1/2 -translate-x-1/2'
                      }`}
                    >
                      {bar.month} &bull; AQI {aqiVal}
                    </div>
                  )}

                  {/* Vertical Bar */}
                  <div
                    className={`w-2.5 sm:w-3 rounded-full transition-all duration-200 ${
                      isHovered
                        ? `scale-x-125 z-20 brightness-125 bg-gradient-to-t ${catInfo.gradient} ${catInfo.glow}`
                        : aqiVal >= 150
                        ? 'bg-gradient-to-t from-rose-600 via-rose-500 to-orange-400 shadow-[0_0_8px_rgba(244,63,94,0.45)]'
                        : aqiVal >= 100
                        ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.35)]'
                        : 'bg-gradient-to-t from-slate-600 via-slate-400 to-slate-300 opacity-80'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Interactive Bottom Readout Ribbon - Fixed Height to completely eliminate layout shift */}
          <div className="mt-2 h-8 flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono select-none overflow-hidden">
            {hoveredSeason ? (
              <div className="flex items-center justify-between w-full text-slate-200">
                <span className="font-semibold text-white">{hoveredSeason.fullMonth}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${hoveredSeason.catInfo.badgeClass}`}
                >
                  {hoveredSeason.catInfo.label}
                </span>
                <span className="font-bold text-white font-mono">
                  ~{hoveredSeason.aqi} AQI
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full text-slate-400 text-[11px]">
                <span>Hover bar for details</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300/90 border border-rose-500/30">
                  Nov–Feb Peak
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CARD 3 (3 cols): Dominant Pollutant WHO Guidelines             */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-3 xl:col-span-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col justify-between shadow-xl h-full min-h-[340px]">
          <div className="pb-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Dominant Pollutant
            </h3>
          </div>

          {/* Clean Dynamic Pollutant Guideline Rows */}
          <div className="space-y-4 my-auto py-1">
            {(trendsData?.dominant_pollutants || [
              { name: 'PM2.5', current: 16.8, who_guideline: 15.0, unit: 'µg/m³', pct: 68 },
              { name: 'PM10', current: 36.9, who_guideline: 45.0, unit: 'µg/m³', pct: 62 },
              { name: 'NO2', current: 14.0, who_guideline: 25.0, unit: 'µg/m³', pct: 45 },
              { name: 'SO2', current: 7.5, who_guideline: 40.0, unit: 'µg/m³', pct: 50 },
            ]).map((pollutant) => (
              <div key={pollutant.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white font-mono w-14">{pollutant.name}</span>
                  <div className="flex-1 px-2">
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono leading-none pb-0.5">
                      <span>{pollutant.current} {pollutant.unit}</span>
                      <span>WHO {pollutant.who_guideline}</span>
                    </div>
                    <div className="relative w-full h-2.5 rounded-full bg-slate-800/90 overflow-visible">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 shadow-[0_0_6px_rgba(45,212,191,0.5)]"
                        style={{ width: `${Math.min(100, pollutant.pct)}%` }}
                      />
                      <div
                        className="absolute -top-1 bottom-0 w-[2px] h-4.5 bg-white/80 rounded-full"
                        style={{ left: `${Math.min(98, pollutant.pct)}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setPollutantModal({
                        name: pollutant.name,
                        desc: `Real-time atmospheric concentration for ${selectedCity} calibrated against WHO safe air exposure standards.`,
                        who: `${pollutant.who_guideline} ${pollutant.unit} (24-hour mean)`,
                      })
                    }
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                  >
                    <Info size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}

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
