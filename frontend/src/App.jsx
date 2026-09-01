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
import { API_BASE_URL } from './config';
import {
  Bell,
  Menu,
  X,
  Activity,
  Trophy,
  TrendingUp,
  Sliders,
  MapPin,
  ChevronDown,
  Sparkles,
  Layers,
} from 'lucide-react';

const CITIES = ['Karachi', 'Lahore', 'Islamabad'];

export default function App() {
  const [activePage, setActivePage] = useState('live'); // 'live' | 'trends' | 'shap' | 'tournament' | 'regional'
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [loading, setLoading] = useState(true);
  const [scrubberIndex, setScrubberIndex] = useState(24);
  const [data, setData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch forecast data from FastAPI backend with seamless local fallback
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    fetch(`${API_BASE_URL}/api/forecast?city=${selectedCity}`)
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

      {/* Mobile Navigation Sidebar Drawer Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar Container */}
          <div className="relative w-[300px] max-w-[85vw] h-full bg-[#091322]/95 border-l border-white/15 p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between z-10 animate-slide-in-right overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Top Header: Logo + Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 select-none">
                  <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">Pearls</span>
                  <span className="text-lg font-light text-slate-300">AQI Predictor</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                  title="Close Menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* City Selection in Mobile Drawer */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono block">
                  Select Monitoring City
                </span>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCity(c);
                        setMobileMenuOpen(false);
                      }}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all text-center cursor-pointer ${
                        selectedCity === c
                          ? 'bg-sky-500/30 text-sky-300 font-semibold shadow-sm border border-sky-500/50'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Pages List in Mobile Drawer */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono block">
                  Dashboard Views
                </span>
                <div className="space-y-1.5">
                  {/* 1. Overview */}
                  <button
                    onClick={() => {
                      setActivePage('live');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activePage === 'live'
                        ? 'bg-sky-500/25 text-sky-300 border border-sky-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Activity size={16} />
                      <span>Overview</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live
                    </span>
                  </button>

                  {/* 2. Analytics */}
                  <button
                    onClick={() => {
                      setActivePage('trends');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activePage === 'trends'
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <TrendingUp size={16} />
                      <span>Analytics</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-white/10">
                      3-Day / 7-Day
                    </span>
                  </button>

                  {/* 3. What-If Lab */}
                  <button
                    onClick={() => {
                      setActivePage('shap');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activePage === 'shap'
                        ? 'bg-sky-500/25 text-sky-300 border border-sky-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders size={16} />
                      <span>What-If Lab</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      SHAP AI
                    </span>
                  </button>

                  {/* 4. Model Tournament */}
                  <button
                    onClick={() => {
                      setActivePage('tournament');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activePage === 'tournament'
                        ? 'bg-teal-500/25 text-teal-300 border border-teal-500/40 shadow-[0_0_12px_rgba(20,184,166,0.3)]'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy size={16} />
                      <span>Model Tournament</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      MLOps
                    </span>
                  </button>

                  {/* 5. Regional Map */}
                  <button
                    onClick={() => {
                      setActivePage('regional');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activePage === 'regional'
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin size={16} />
                      <span>Regional Map</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Pakistan
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Drawer Footer Status */}
            <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Render API • 24/7 Serverless</span>
              </div>
              <div className="text-slate-500 text-[10px]">
                LightGBM TreeExplainer • Hopsworks Live
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1240px] flex-col justify-between px-4 sm:px-6 py-4 sm:py-5 lg:px-8">
        {/* Top Navbar Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 border-b border-white/10 pb-3.5 sm:pb-4 backdrop-blur-[2px]">
          {/* Row 1 on Mobile / Left Brand on Desktop: Pearls AQI Predictor on the same line */}
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-2.5 select-none">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm whitespace-nowrap">Pearls</span>
              <span className="text-xl font-light text-slate-300 whitespace-nowrap">AQI Predictor</span>
            </div>
            <span className="inline-flex md:hidden h-2 w-2 rounded-full bg-emerald-400 animate-pulse" title="System Live" />
          </div>

          {/* Desktop-only Center Navigation Tabs */}
          <div className="hidden md:flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 backdrop-blur-md shadow-lg">
            {/* 1st: Overview */}
            <button
              onClick={() => setActivePage('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activePage === 'regional'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin size={13} />
              <span>Regional Map</span>
            </button>
          </div>

          {/* Row 2 on Mobile (City change on left, sidebar button on right) / Right Section on Desktop */}
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2">
            {/* City Selector Pill Tabs */}
            <div className="flex items-center bg-slate-900/75 p-1 rounded-xl border border-white/10 backdrop-blur-md">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    selectedCity === c
                      ? 'bg-sky-500/30 text-sky-300 font-semibold shadow-sm border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Desktop-only Bell */}
            <button
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-slate-200 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/20 hover:text-white cursor-pointer"
              title="Air Quality Notifications"
            >
              <Bell size={16} />
            </button>

            {/* Mobile Sidebar Button on the forward/right of city selector */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/10 text-slate-200 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/20 hover:text-white cursor-pointer shadow-sm"
              title="Open Navigation Menu"
            >
              <Menu size={16} />
              <span className="text-xs font-medium">Pages</span>
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
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-4 sm:mb-5 drop-shadow-sm flex flex-wrap items-center justify-between gap-2.5">
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

                {/* Unified Responsive Grid (Mobile: Circle -> Slider -> Cigarette -> Lifestyle -> Pollutants; Desktop: 3-Col Top + 2-Col Bottom) */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-5 items-stretch">
                  {/* 1. Concentric Activity Rings: Mobile Order 1, Desktop Col-Span 2 (1/3 top row) */}
                  <div className="order-1 md:order-1 md:col-span-2">
                    <ConcentricRings current={activeItem} />
                  </div>

                  {/* 2. Time-Travel Scrubber: Mobile Order 2 (Directly below Circle, above Cigarette!), Desktop Order 4 Col-Span 3 (1/2 bottom row) */}
                  <div className="order-2 md:order-4 md:col-span-3">
                    <TimeTravelScrubber
                      timeline={data.timeline}
                      currentIndex={scrubberIndex}
                      onChangeIndex={setScrubberIndex}
                      selectedCity={selectedCity}
                      onSelectCity={setSelectedCity}
                      cities={CITIES}
                    />
                  </div>

                  {/* 3. Cigarette Equivalent Card: Mobile Order 3, Desktop Order 2 Col-Span 2 (1/3 top row) */}
                  <div className="order-3 md:order-2 md:col-span-2">
                    <CigaretteCard
                      cigarettes={activeItem.cigarettes_per_day}
                      pm25={activeItem.pm2_5}
                    />
                  </div>

                  {/* 4. Lifestyle Action Cards: Mobile Order 4, Desktop Order 3 Col-Span 2 (1/3 top row) */}
                  <div className="order-4 md:order-3 md:col-span-2">
                    <LifestyleGrid actions={activeItem.lifestyle_actions} />
                  </div>

                  {/* 5. WHO Pollutant Guideline Bars: Mobile Order 5, Desktop Order 5 Col-Span 3 (1/2 bottom row) */}
                  <div className="order-5 md:order-5 md:col-span-3">
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
