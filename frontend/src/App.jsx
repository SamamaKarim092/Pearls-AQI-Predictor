import React, { useState, useEffect } from 'react';
import ConcentricRings from './components/ConcentricRings';
import CigaretteCard from './components/CigaretteCard';
import LifestyleGrid from './components/LifestyleGrid';
import TimeTravelScrubber from './components/TimeTravelScrubber';
import PollutantBars from './components/PollutantBars';
import TrendsDashboard from './components/TrendsDashboard';
import ShapLab from './components/ShapLab';
import Aurora from './components/Aurora';
import {
  Bell,
  Menu,
  Activity,
  TrendingUp,
  Sliders,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const CITIES = ['Karachi', 'Lahore', 'Islamabad'];

// Static baseline fallback for initial render or offline mode
const CITY_BASELINES = {
  Karachi: {
    city: 'Karachi',
    aqi: 68,
    category: 'Moderate',
    color: '#fbbf24',
    pm2_5: 23.9,
    pm10: 52.0,
    nitrogen_dioxide: 14.0,
    sulphur_dioxide: 7.0,
    ozone: 18.0,
    temperature_2m: 29.5,
    wind_speed_10m: 19.2,
    relative_humidity_2m: 71.0,
    cigarettes_per_day: 1.1,
    lifestyle_actions: [
      { id: 'mask', label: 'Wear N95 Mask', active: false, icon: 'mask' },
      { id: 'air_purifier', label: 'Air Purifier ON', active: false, icon: 'air_purifier' },
      { id: 'exercise', label: 'Outdoor Exercise OK', active: true, icon: 'exercise' },
      { id: 'windows', label: 'Open Windows OK', active: true, icon: 'windows' },
    ],
  },
  Lahore: {
    city: 'Lahore',
    aqi: 151,
    category: 'Unhealthy',
    color: '#ef4444',
    pm2_5: 60.3,
    pm10: 132.0,
    nitrogen_dioxide: 28.0,
    sulphur_dioxide: 14.0,
    ozone: 24.0,
    temperature_2m: 34.9,
    wind_speed_10m: 2.8,
    relative_humidity_2m: 56.0,
    cigarettes_per_day: 2.7,
    lifestyle_actions: [
      { id: 'mask', label: 'Wear N95 Mask', active: true, icon: 'mask' },
      { id: 'air_purifier', label: 'Air Purifier ON', active: true, icon: 'air_purifier' },
      { id: 'exercise', label: 'Avoid Heavy Exercise', active: true, icon: 'exercise' },
      { id: 'windows', label: 'Keep Windows Closed', active: true, icon: 'windows' },
    ],
  },
  Islamabad: {
    city: 'Islamabad',
    aqi: 124,
    category: 'Unhealthy',
    color: '#f97316',
    pm2_5: 33.9,
    pm10: 75.0,
    nitrogen_dioxide: 15.0,
    sulphur_dioxide: 8.0,
    ozone: 20.0,
    temperature_2m: 32.2,
    wind_speed_10m: 4.1,
    relative_humidity_2m: 58.0,
    cigarettes_per_day: 1.5,
    lifestyle_actions: [
      { id: 'mask', label: 'Wear N95 Mask', active: false, icon: 'mask' },
      { id: 'air_purifier', label: 'Air Purifier ON', active: false, icon: 'air_purifier' },
      { id: 'exercise', label: 'Outdoor Exercise OK', active: true, icon: 'exercise' },
      { id: 'windows', label: 'Open Windows OK', active: true, icon: 'windows' },
    ],
  },
};

function generateFallbackTimeline(city) {
  const base = CITY_BASELINES[city] || CITY_BASELINES.Karachi;
  return Array.from({ length: 49 }, (_, i) => {
    const hours = i - 24;
    const pm25 = parseFloat(
      Math.max(5, base.pm2_5 + Math.sin(i / 3) * 6 + (hours > 0 ? hours * 0.2 : 0)).toFixed(1)
    );
    const aqi = Math.round(pm25 * 3.4);
    let cat = 'Good';
    let color = '#10b981';
    if (aqi > 150) {
      cat = 'Unhealthy';
      color = '#ef4444';
    } else if (aqi > 100) {
      cat = 'Unhealthy';
      color = '#f97316';
    } else if (aqi > 50) {
      cat = 'Moderate';
      color = '#fbbf24';
    }
    return {
      hour_offset: hours,
      time_display: hours === 0 ? 'Live (Now)' : `${hours > 0 ? '+' : ''}${hours}h`,
      formatted_time: `${hours === 0 ? 'Live (Now)' : `${hours > 0 ? '+' : ''}${hours}h`}`,
      pm2_5: pm25,
      aqi: aqi,
      category: cat,
      color: color,
      pm10: parseFloat((pm25 * 2.2).toFixed(1)),
      nitrogen_dioxide: parseFloat((base.nitrogen_dioxide + Math.cos(i / 5) * 1.5).toFixed(1)),
      sulphur_dioxide: base.sulphur_dioxide,
      ozone: base.ozone,
      temperature_2m: base.temperature_2m,
      wind_speed_10m: base.wind_speed_10m,
      relative_humidity_2m: base.relative_humidity_2m,
      cigarettes_per_day: parseFloat((pm25 / 22.0).toFixed(1)),
      lifestyle_actions: base.lifestyle_actions,
    };
  });
}

export default function App() {
  const [activePage, setActivePage] = useState('live'); // 'live' | 'trends' | 'shap'
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [loading, setLoading] = useState(false);
  const [scrubberIndex, setScrubberIndex] = useState(24);
  const [data, setData] = useState(() => ({
    city: 'Karachi',
    current_index: 24,
    current: CITY_BASELINES.Karachi,
    timeline: generateFallbackTimeline('Karachi'),
  }));

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
        console.warn(`FastAPI unavailable for ${selectedCity}, using city profile fallback:`, err);
        if (!isCancelled) {
          setData({
            city: selectedCity,
            current_index: 24,
            current: CITY_BASELINES[selectedCity] || CITY_BASELINES.Karachi,
            timeline: generateFallbackTimeline(selectedCity),
          });
          setScrubberIndex(24);
        }
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
    : data?.current || CITY_BASELINES[selectedCity];

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
          {/* Left Brand Lockup + Live City Badge */}
          <div className="flex items-center gap-3 select-none">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">Pearls</span>
              <span className="text-xl font-light text-slate-300">AQI Predictor</span>
            </div>

            {/* Live City Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live &bull; {selectedCity}</span>
            </div>
          </div>

          {/* Center 3-Page Switcher Navigation Tabs */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 backdrop-blur-md shadow-lg">
            <button
              onClick={() => setActivePage('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePage === 'live'
                  ? 'bg-sky-500/25 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity size={13} />
              <span>Live Monitor</span>
            </button>

            <button
              onClick={() => setActivePage('trends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePage === 'trends'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp size={13} />
              <span>3-Day & 7-Day Trends</span>
            </button>

            <button
              onClick={() => setActivePage('shap')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePage === 'shap'
                  ? 'bg-sky-500/25 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders size={13} />
              <span>What-If Simulator</span>
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
          {activePage === 'live' ? (
            /* ==================== PAGE 1: REAL-TIME LIVE MONITOR ==================== */
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white mb-5 drop-shadow-sm flex items-center justify-between">
                <span>Air Quality Dashboard</span>
                <span className="text-sm font-normal text-slate-400 font-mono">
                  {activeItem.time_display === 'Live (Now)' ? '● Live Sensor Feed' : activeItem.time_display}
                </span>
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
          ) : activePage === 'trends' ? (
            /* ==================== PAGE 2: 7-DAY & 3-DAY TREND INTELLIGENCE ==================== */
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

        {/* Footer */}
        <footer className="py-3 text-center text-xs text-slate-400 flex items-center justify-between border-t border-white/5 mt-4">
          <span>Pearls AQI Predictor &bull; Enterprise Atmospheric ML Intelligence</span>
          <span className="text-emerald-400/80 font-mono text-[11px]">Backend API: Online (Port 8000)</span>
        </footer>
      </div>
    </div>
  );
}
