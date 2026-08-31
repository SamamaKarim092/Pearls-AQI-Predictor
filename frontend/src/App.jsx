import React, { useState, useEffect } from 'react';
import ConcentricRings from './components/ConcentricRings';
import CigaretteCard from './components/CigaretteCard';
import LifestyleGrid from './components/LifestyleGrid';
import TimeTravelScrubber from './components/TimeTravelScrubber';
import PollutantBars from './components/PollutantBars';
import TrendsDashboard from './components/TrendsDashboard';
import ShapLab from './components/ShapLab';
import ModelTournament from './components/ModelTournament';
import RegionalMap from './components/RegionalMap';
import OverviewSkeleton from './components/OverviewSkeleton';
import Aurora from './components/Aurora';
import {
  Bell,
  Menu,
  Activity,
  Trophy,
  TrendingUp,
  Sliders,
  MapPin,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const CITIES = ['Karachi', 'Lahore', 'Islamabad'];

export default function App() {
  const [activePage, setActivePage] = useState('live'); // 'live' | 'trends' | 'shap' | 'tournament' | 'regional'
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [loading, setLoading] = useState(true);
  const [scrubberIndex, setScrubberIndex] = useState(24);
  const [data, setData] = useState(null);

  // Fetch forecast data from FastAPI backend with seamless local fallback
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    fetch(`http://localhost:8000/api/forecast?city=${selectedCity}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!isCancelled && json && json.current) {
          setData(json);
          if (json.current_index !== undefined) {
            setScrubberIndex(json.current_index);
          }
        }
      })
      .catch((err) => {
        console.warn(`FastAPI unavailable for ${selectedCity}:`, err);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCity]);

  const activeItem = data?.timeline && data.timeline[scrubberIndex]
    ? data.timeline[scrubberIndex]
    : data?.current || null;

  return (
    <div className="relative min-h-screen w-full bg-[#050b14] text-white overflow-hidden font-sans">
      {/* Animated WebGL Aurora Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Aurora
          colorStops={["#98dff1", "#45e3ff", "#4886ea"]}
          amplitude={0.35}
          blend={0.65}
          speed={0.65}
        />
      </div>

      {/* Atmospheric Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,11,20,0.35)_85%,rgba(5,11,20,0.75)_100%)]" />

      {/* Main Content Layout */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1240px] flex-col justify-between px-4 sm:px-6 py-5 lg:px-8">
        {/* Top Navbar Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 backdrop-blur-[2px]">
          {/* Left Brand Lockup (Live Karachi badge removed as requested) */}
          <div className="flex items-center gap-3 select-none">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">Pearls</span>
              <span className="text-xl font-light text-slate-300">AQI Predictor</span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 backdrop-blur-md shadow-lg">
            {/* 1st: Overview */}
            <button
              onClick={() => setActivePage('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePage === 'live'
                  ? 'bg-sky-500/25 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity size={13} />
              <span>Overview</span>
            </button>

            {/* 2nd: Analytics */}
            <button
              onClick={() => setActivePage('trends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePage === 'trends'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp size={13} />
              <span>Analytics</span>
            </button>

            {/* 3rd: What-If Lab */}
            <button
              onClick={() => setActivePage('shap')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePage === 'shap'
                  ? 'bg-sky-500/25 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders size={13} />
              <span>What-If Lab</span>
            </button>

            {/* 4th: Model Tournament */}
            <button
              onClick={() => setActivePage('tournament')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePage === 'tournament'
                  ? 'bg-teal-500/25 text-teal-300 border border-teal-500/40 shadow-[0_0_12px_rgba(20,184,166,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy size={13} />
              <span>Model Tournament</span>
            </button>

            {/* 5th: Regional Map */}
            <button
              onClick={() => setActivePage('regional')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePage === 'regional'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin size={13} />
              <span>Regional Map</span>
            </button>
          </div>

          {/* Right City Selector Pill Tabs & Action Buttons */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-white/10 backdrop-blur-md">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    selectedCity === c
                      ? 'bg-sky-500/30 text-sky-300 font-semibold shadow-sm border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Right Action Buttons */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-slate-200 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/20 hover:text-white cursor-pointer"
              title="Air Quality Notifications"
            >
              <Bell size={16} />
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-slate-200 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/20 hover:text-white cursor-pointer"
              title="Menu & ML Intelligence"
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        {/* Main Content Layout (Conditional Page Rendering) */}
        <main className="flex-1 py-4">
          {activePage === 'regional' ? (
            /* ==================== PAGE 4: REGIONAL MAP & MULTI-CITY INTELLIGENCE ==================== */
            <RegionalMap />
          ) : activePage === 'tournament' ? (
            /* ==================== PAGE 0: MODEL TOURNAMENT & MLOPS LEADERBOARD ==================== */
            <ModelTournament selectedCity={selectedCity} />
          ) : activePage === 'live' ? (
            /* ==================== PAGE 1: REAL-TIME LIVE MONITOR / OVERVIEW ==================== */
            loading || !data || !data.current || !activeItem ? (
              <OverviewSkeleton selectedCity={selectedCity} />
            ) : (
              <div className="animate-data-enter">
                <h1 className="text-3xl font-semibold tracking-tight text-white mb-5 drop-shadow-sm flex items-center justify-between">
                  <span>Air Quality Dashboard</span>
                  {activeItem.time_display === 'Live (Now)' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-xs font-semibold text-emerald-400 font-mono shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Sensor Feed
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-slate-400 font-mono px-3 py-1 rounded-lg bg-slate-900/60 border border-white/10">
                      {activeItem.time_display}
                    </span>
                  )}
                </h1>

                {/* 3-Column Main Hero Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                  {/* Column 1: Concentric Activity Rings */}
                  <div>
                    <ConcentricRings current={activeItem} />
                  </div>

                  {/* Column 2: Cigarette Equivalent Card */}
                  <div>
                    <CigaretteCard
                      cigarettes={activeItem.cigarettes_per_day}
                      pm25={activeItem.pm2_5}
                    />
                  </div>

                  {/* Column 3: 2x2 Lifestyle Action Cards */}
                  <div>
                    <LifestyleGrid actions={activeItem.lifestyle_actions} />
                  </div>
                </div>

                {/* Bottom Controls Row: Timeline Scrubber & Pollutant Guideline Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 items-stretch">
                  {/* Left Side: Time-Travel Scrubber */}
                  <div>
                    <TimeTravelScrubber
                      timeline={data.timeline}
                      currentIndex={scrubberIndex}
                      onChangeIndex={setScrubberIndex}
                      selectedCity={selectedCity}
                      onSelectCity={setSelectedCity}
                      cities={CITIES}
                    />
                  </div>

                  {/* Right Side: WHO Pollutant Guideline Bars */}
                  <div>
                    <PollutantBars current={activeItem} />
                  </div>
                </div>
              </div>
            )
          ) : activePage === 'trends' ? (
            /* ==================== PAGE 2: 7-DAY & 3-DAY TREND INTELLIGENCE / ANALYTICS ==================== */
            <div>
              <TrendsDashboard selectedCity={selectedCity} />
            </div>
          ) : (
            /* ==================== PAGE 3: SHAP WHAT-IF LAB & EXPLAINABILITY SIMULATOR ==================== */
            <div>
              <ShapLab selectedCity={selectedCity} currentLive={activeItem} />
            </div>
          )}
        </main>

        {/* Enhanced Footer */}
        <footer className="mt-12 mb-4 pt-6 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 select-none">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-semibold text-slate-200">Pearls AQI Predictor</span>
            <span className="text-slate-600 hidden sm:inline">&bull;</span>
            <span className="text-slate-400">Enterprise Atmospheric ML Intelligence</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-sm">
            <span className="text-slate-400 text-[11px]">Created by</span>
            <span className="font-bold text-teal-300 tracking-tight">Samama Karim</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
