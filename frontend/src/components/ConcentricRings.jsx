import React, { useState } from 'react';
import { Info, X, Activity } from 'lucide-react';

export default function ConcentricRings({ current }) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [hoveredRing, setHoveredRing] = useState(null); // 'outer' | 'mid' | 'inner' | null

  const aqi = current?.aqi !== undefined ? Math.round(current.aqi) : 48;
  const rawCategory = current?.category || 'Good Air';
  const color = current?.color || '#10b981';

  // Format display category cleanly: On elevated levels, simply show "Unhealthy"
  const category = (() => {
    const lower = rawCategory.toLowerCase();
    if (lower.includes('very')) return 'Very Unhealthy';
    if (lower.includes('hazard')) return 'Hazardous';
    if (lower.includes('unhealthy')) return 'Unhealthy';
    if (lower.includes('mod')) return 'Moderate';
    if (lower.includes('good')) return 'Good Air';
    return rawCategory;
  })();

  const pm25 = current?.pm2_5 !== undefined ? current.pm2_5 : 11.2;
  const pm10 = current?.pm10 !== undefined ? current.pm10 : 28.4;
  const no2 = current?.nitrogen_dioxide !== undefined ? current.nitrogen_dioxide : 14.1;

  // Percentage calculations relative to standard safety thresholds
  const pOuter = Math.min(1.0, Math.max(0.18, pm25 / 45.0)); // PM2.5
  const pMid = Math.min(1.0, Math.max(0.22, pm10 / 80.0));   // PM10
  const pInner = Math.min(1.0, Math.max(0.25, no2 / 40.0));   // NO2

  // Geometry dimensions
  const size = 280;
  const center = size / 2;
  const strokeWidth = 10;

  const rOuter = 112;
  const rMid = 92;
  const rInner = 72;

  const circOuter = 2 * Math.PI * rOuter;
  const circMid = 2 * Math.PI * rMid;
  const circInner = 2 * Math.PI * rInner;

  const offsetOuter = circOuter * (1 - pOuter);
  const offsetMid = circMid * (1 - pMid);
  const offsetInner = circInner * (1 - pInner);

  // Dynamic status-based gradient colors
  const isGood = aqi <= 50;
  const isMod = aqi > 50 && aqi <= 100;

  const gradOuterStart = isGood ? '#10b981' : isMod ? '#f59e0b' : '#f43f5e';
  const gradOuterEnd = isGood ? '#2dd4bf' : isMod ? '#fbbf24' : '#fb7185';

  const gradMidStart = isGood ? '#059669' : isMod ? '#d97706' : '#e11d48';
  const gradMidEnd = isGood ? '#10b981' : isMod ? '#f59e0b' : '#f43f5e';

  const gradInnerStart = isGood ? '#34d399' : isMod ? '#fbbf24' : '#fda4af';
  const gradInnerEnd = isGood ? '#6ee7b7' : isMod ? '#fde047' : '#fecdd3';

  const centerTextColor = isGood ? '#34d399' : isMod ? '#fbbf24' : '#f87171';

  return (
    <>
      <div className="relative flex flex-col items-center justify-between w-full h-full min-h-[310px] rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-md">
        {/* Top Card Title & Info Trigger */}
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Atmospheric Gauge
          </span>
          <button
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-1 text-slate-400 hover:text-sky-300 transition-colors p-1 cursor-pointer"
            title="What do these 3 rings mean?"
          >
            <span className="text-[11px] font-medium hidden sm:inline">Ring Guide</span>
            <Info size={14} />
          </button>
        </div>

        {/* Center SVG Ring Widget */}
        <div className="relative flex items-center justify-center my-auto py-2">
          {/* Ambient Glow */}
          <div
            className="absolute w-52 h-52 rounded-full blur-3xl pointer-events-none transition-all duration-700"
            style={{
              backgroundColor: isGood ? '#10b981' : isMod ? '#f59e0b' : '#ef4444',
              opacity: isGood ? 0.28 : 0.38,
            }}
          />

          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 w-full max-w-[260px] sm:max-w-[280px] h-auto"
          >
            <defs>
              <filter id="arc-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <linearGradient id="ring-grad-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradOuterStart} />
                <stop offset="100%" stopColor={gradOuterEnd} />
              </linearGradient>

              <linearGradient id="ring-grad-mid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradMidStart} />
                <stop offset="100%" stopColor={gradMidEnd} />
              </linearGradient>

              <linearGradient id="ring-grad-inner" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradInnerStart} />
                <stop offset="100%" stopColor={gradInnerEnd} />
              </linearGradient>
            </defs>

            {/* 360-degree Background Tracks */}
            <circle
              cx={center}
              cy={center}
              r={rOuter}
              fill="none"
              stroke="rgba(16, 185, 129, 0.13)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={center}
              cy={center}
              r={rMid}
              fill="none"
              stroke="rgba(16, 185, 129, 0.13)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={center}
              cy={center}
              r={rInner}
              fill="none"
              stroke="rgba(16, 185, 129, 0.13)"
              strokeWidth={strokeWidth}
            />

            {/* Outer Ring: PM2.5 */}
            <circle
              cx={center}
              cy={center}
              r={rOuter}
              fill="none"
              stroke="url(#ring-grad-outer)"
              strokeWidth={hoveredRing === 'outer' ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={circOuter}
              strokeDashoffset={offsetOuter}
              strokeLinecap="round"
              className="cursor-pointer transition-[stroke-dashoffset,stroke-width] duration-500 ease-out"
              style={{ willChange: 'stroke-dashoffset', filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.3))' }}
              onMouseEnter={() => setHoveredRing('outer')}
              onMouseLeave={() => setHoveredRing(null)}
              onClick={() => setShowInfoModal(true)}
            />

            {/* Middle Ring: PM10 */}
            <circle
              cx={center}
              cy={center}
              r={rMid}
              fill="none"
              stroke="url(#ring-grad-mid)"
              strokeWidth={hoveredRing === 'mid' ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={circMid}
              strokeDashoffset={offsetMid}
              strokeLinecap="round"
              className="cursor-pointer transition-[stroke-dashoffset,stroke-width] duration-500 ease-out"
              style={{ willChange: 'stroke-dashoffset', filter: 'drop-shadow(0 0 6px rgba(45,212,191,0.3))' }}
              onMouseEnter={() => setHoveredRing('mid')}
              onMouseLeave={() => setHoveredRing(null)}
              onClick={() => setShowInfoModal(true)}
            />

            {/* Inner Ring: NO2 */}
            <circle
              cx={center}
              cy={center}
              r={rInner}
              fill="none"
              stroke="url(#ring-grad-inner)"
              strokeWidth={hoveredRing === 'inner' ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={circInner}
              strokeDashoffset={offsetInner}
              strokeLinecap="round"
              className="cursor-pointer transition-[stroke-dashoffset,stroke-width] duration-500 ease-out"
              style={{ willChange: 'stroke-dashoffset', filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.3))' }}
              onMouseEnter={() => setHoveredRing('inner')}
              onMouseLeave={() => setHoveredRing(null)}
              onClick={() => setShowInfoModal(true)}
            />
          </svg>

          {/* Center Metric Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-5xl font-bold tracking-tight text-white drop-shadow-md">
              {aqi}
            </span>
            <span
              className="text-sm font-semibold tracking-wide mt-1.5 transition-colors duration-500 drop-shadow-sm"
              style={{ color: centerTextColor }}
            >
              {category}
            </span>
          </div>
        </div>

        {/* Interactive Ring Legend Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 w-full pt-1 select-none">
          <button
            onMouseEnter={() => setHoveredRing('outer')}
            onMouseLeave={() => setHoveredRing(null)}
            onClick={() => setShowInfoModal(true)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
              hoveredRing === 'outer' ? 'bg-emerald-500/25 text-emerald-200 ring-1 ring-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>PM2.5: {pm25.toFixed(1)}</span>
          </button>

          <button
            onMouseEnter={() => setHoveredRing('mid')}
            onMouseLeave={() => setHoveredRing(null)}
            onClick={() => setShowInfoModal(true)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
              hoveredRing === 'mid' ? 'bg-teal-500/25 text-teal-200 ring-1 ring-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>PM10: {pm10.toFixed(1)}</span>
          </button>

          <button
            onMouseEnter={() => setHoveredRing('inner')}
            onMouseLeave={() => setHoveredRing(null)}
            onClick={() => setShowInfoModal(true)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
              hoveredRing === 'inner' ? 'bg-cyan-500/25 text-cyan-200 ring-1 ring-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-300" />
            <span>NO2: {no2.toFixed(1)}</span>
          </button>
        </div>
      </div>

      {/* Circle Info Guide Modal */}
      {showInfoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Activity size={16} className="text-emerald-400" />
                How to Read the Atmospheric Rings
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs text-slate-300 leading-relaxed">
              {/* Center AQI */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-white/5">
                <div className="font-semibold text-white text-sm flex items-center justify-between">
                  <span>🔢 Center Number: AQI Score</span>
                  <span className="font-mono text-emerald-400">{aqi} ({category})</span>
                </div>
                <p className="mt-1 text-slate-400">
                  The overall composite Air Quality Index. 0–50 is Good Air, 51–100 is Moderate, and 100+ is Unhealthy.
                </p>
              </div>

              {/* Ring 1 */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-emerald-500/20">
                <div className="font-semibold text-emerald-300 flex items-center justify-between">
                  <span>⭕ Outer Ring: PM2.5 (Fine Particles)</span>
                  <span className="font-mono text-white">{pm25.toFixed(1)} µg/m³</span>
                </div>
                <p className="mt-1 text-slate-400">
                  Microscopic soot, smoke, and combustion particles (&lt;2.5µm). Because they are so tiny, they penetrate deep into lung tissue and the bloodstream.
                </p>
              </div>

              {/* Ring 2 */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-teal-500/20">
                <div className="font-semibold text-teal-300 flex items-center justify-between">
                  <span>⭕ Middle Ring: PM10 (Coarse Dust)</span>
                  <span className="font-mono text-white">{pm10.toFixed(1)} µg/m³</span>
                </div>
                <p className="mt-1 text-slate-400">
                  Inhalable dust, construction sand, road debris, and pollen (&lt;10µm) that irritate upper respiratory airways.
                </p>
              </div>

              {/* Ring 3 */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-cyan-500/20">
                <div className="font-semibold text-cyan-300 flex items-center justify-between">
                  <span>⭕ Inner Ring: NO2 (Nitrogen Dioxide)</span>
                  <span className="font-mono text-white">{no2.toFixed(1)} µg/m³</span>
                </div>
                <p className="mt-1 text-slate-400">
                  Toxic acidic gas emitted by automobile traffic exhaust and power plants that inflames lung airways.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
