import React from 'react';
import { Wind, Droplets, Thermometer, CloudRain, Sparkles, RotateCcw } from 'lucide-react';

export default function ShapLabSkeleton({ selectedCity = 'Karachi' }) {
  return (
    <div className="flex flex-col gap-5 w-full pb-10 select-none animate-fadeIn text-white font-sans">
      {/* Top Header Shimmer Bar matching exact title layout */}
      <div className="space-y-2">
        <div className="h-8 sm:h-9 w-72 sm:w-[480px] rounded-xl bg-white/[0.08] border border-white/10 glass-shimmer" />
        <div className="h-3.5 w-44 rounded-lg bg-white/[0.04] glass-shimmer" />
      </div>

      {/* Main 2-Column Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ========================================================================= */}
        {/* LEFT COLUMN (7 cols): Meteorological Sandbox Skeleton                     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden min-h-[500px]">
          {/* Ambient Glow */}
          <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-teal-500/15 blur-3xl pointer-events-none animate-pulse" />

          <div className="space-y-6">
            {/* Header with Title & Reset Button Placeholder */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-4.5 w-44 rounded-lg bg-white/[0.1] border border-white/10 glass-shimmer" />
                  <Sparkles size={13} className="text-sky-400/50 animate-pulse" />
                </div>
                <div className="h-3 w-56 rounded bg-white/[0.04] glass-shimmer" />
              </div>
              <div className="h-7 w-28 rounded-xl bg-sky-500/10 border border-sky-500/20 glass-shimmer flex items-center justify-center gap-1.5 px-2.5">
                <RotateCcw size={11} className="text-sky-400/60" />
                <div className="h-2.5 w-16 rounded bg-sky-400/30" />
              </div>
            </div>

            {/* Slider 1: Wind Speed Skeleton */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    <Wind size={14} className="animate-pulse" />
                  </div>
                  <div className="h-4 w-24 rounded bg-white/[0.08] glass-shimmer" />
                </div>
                <div className="h-6 w-20 rounded-lg bg-emerald-500/15 border border-emerald-500/30 glass-shimmer shadow-inner flex items-center justify-center">
                  <div className="h-3 w-12 rounded bg-emerald-400/40" />
                </div>
              </div>
              {/* Realistic Glowing Slider Track */}
              <div className="relative flex items-center py-1.5">
                <div className="h-[7px] w-full rounded-full bg-slate-800/90 relative overflow-visible border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500/50 to-emerald-400/80 glass-shimmer shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    style={{ width: '45%' }}
                  />
                  {/* Glowing Thumb Indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -mt-[0px] w-4.5 h-4.5 rounded-full bg-white border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.85)] animate-pulse"
                    style={{ left: 'calc(45% - 9px)' }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <div className="h-2.5 w-16 rounded bg-white/[0.04]" />
                <div className="h-2.5 w-12 rounded bg-white/[0.04]" />
                <div className="h-2.5 w-16 rounded bg-white/[0.04]" />
              </div>
            </div>

            {/* Slider 2: Relative Humidity Skeleton */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                    <Droplets size={14} className="animate-pulse" />
                  </div>
                  <div className="h-4 w-32 rounded bg-white/[0.08] glass-shimmer" />
                </div>
                <div className="h-6 w-16 rounded-lg bg-cyan-500/15 border border-cyan-500/30 glass-shimmer shadow-inner flex items-center justify-center">
                  <div className="h-3 w-10 rounded bg-cyan-400/40" />
                </div>
              </div>
              {/* Realistic Glowing Slider Track */}
              <div className="relative flex items-center py-1.5">
                <div className="h-[7px] w-full rounded-full bg-slate-800/90 relative overflow-visible border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500/50 to-cyan-400/80 glass-shimmer shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    style={{ width: '65%' }}
                  />
                  {/* Glowing Thumb Indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -mt-[0px] w-4.5 h-4.5 rounded-full bg-white border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.85)] animate-pulse"
                    style={{ left: 'calc(65% - 9px)' }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <div className="h-2.5 w-16 rounded bg-white/[0.04]" />
                <div className="h-2.5 w-12 rounded bg-white/[0.04]" />
                <div className="h-2.5 w-16 rounded bg-white/[0.04]" />
              </div>
            </div>

            {/* Slider 3: Temperature Skeleton */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                    <Thermometer size={14} className="animate-pulse" />
                  </div>
                  <div className="h-4 w-24 rounded bg-white/[0.08] glass-shimmer" />
                </div>
                <div className="h-6 w-16 rounded-lg bg-amber-500/15 border border-amber-500/30 glass-shimmer shadow-inner flex items-center justify-center">
                  <div className="h-3 w-10 rounded bg-amber-400/40" />
                </div>
              </div>
              {/* Realistic Glowing Slider Track */}
              <div className="relative flex items-center py-1.5">
                <div className="h-[7px] w-full rounded-full bg-slate-800/90 relative overflow-visible border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500/50 to-amber-400/80 glass-shimmer shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                    style={{ width: '55%' }}
                  />
                  {/* Glowing Thumb Indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -mt-[0px] w-4.5 h-4.5 rounded-full bg-white border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.85)] animate-pulse"
                    style={{ left: 'calc(55% - 9px)' }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <div className="h-2.5 w-16 rounded bg-white/[0.04]" />
                <div className="h-2.5 w-12 rounded bg-white/[0.04]" />
                <div className="h-2.5 w-16 rounded bg-white/[0.04]" />
              </div>
            </div>

            {/* Slider 4: Precipitation Skeleton */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                    <CloudRain size={14} className="animate-pulse" />
                  </div>
                  <div className="h-4 w-40 rounded bg-white/[0.08] glass-shimmer" />
                </div>
                <div className="h-6 w-16 rounded-lg bg-blue-500/15 border border-blue-500/30 glass-shimmer shadow-inner flex items-center justify-center">
                  <div className="h-3 w-10 rounded bg-blue-400/40" />
                </div>
              </div>
              {/* Realistic Glowing Slider Track */}
              <div className="relative flex items-center py-1.5">
                <div className="h-[7px] w-full rounded-full bg-slate-800/90 relative overflow-visible border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500/50 to-blue-400/80 glass-shimmer shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                    style={{ width: '8%' }}
                  />
                  {/* Glowing Thumb Indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -mt-[0px] w-4.5 h-4.5 rounded-full bg-white border-2 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.85)] animate-pulse"
                    style={{ left: 'calc(8% - 9px)' }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <div className="h-2.5 w-16 rounded bg-white/[0.04]" />
                <div className="h-2.5 w-12 rounded bg-white/[0.04]" />
                <div className="h-2.5 w-16 rounded bg-white/[0.04]" />
              </div>
            </div>
          </div>

          {/* Bottom Scenario Presets Skeleton */}
          <div className="mt-8 pt-4 space-y-3 border-t border-white/5">
            <div className="h-3.5 w-28 rounded bg-white/[0.08] glass-shimmer" />
            <div className="flex flex-wrap items-center gap-3">
              {[
                { name: 'Simulate Rainwash', active: true },
                { name: 'Winter Smog Trap', active: false },
                { name: 'Sea Breeze', active: false },
              ].map((btn, idx) => (
                <div
                  key={idx}
                  className={`h-8 px-5 rounded-full flex items-center justify-center transition-all ${
                    btn.active
                      ? 'bg-[#15233c] border border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.3)] glass-shimmer'
                      : 'bg-slate-900/60 border border-white/10 glass-shimmer'
                  }`}
                >
                  <div className={`h-3 w-24 rounded ${btn.active ? 'bg-sky-300/40' : 'bg-white/[0.06]'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (5 cols): Speedometer Gauge & SHAP Waterfall Skeletons       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          {/* ----------------------------------------------------------------------- */}
          {/* Card 1: Speedometer Gauge AQI Card Skeleton                             */}
          {/* ----------------------------------------------------------------------- */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl flex flex-col items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden min-h-[300px]">
            {/* Ambient Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-52 h-44 rounded-full bg-sky-500/15 blur-3xl pointer-events-none animate-pulse" />

            {/* Top Live Indicator Header */}
            <div className="w-full flex items-center justify-between border-b border-white/5 pb-2.5 text-xs">
              <div className="h-4 w-36 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <div className="h-2.5 w-20 rounded bg-emerald-400/40 glass-shimmer" />
              </div>
            </div>

            {/* SVG Speedometer Gauge Canvas Skeleton */}
            <div className="relative w-72 h-44 flex items-center justify-center pt-2">
              <svg viewBox="0 0 220 130" className="w-full h-full overflow-visible">
                <defs>
                  {/* Subtle Multi-Stop Ambient Gradient for Arc Wireframe */}
                  <linearGradient id="skeleton-gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                    <stop offset="30%" stopColor="#22c55e" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#eab308" stopOpacity="0.45" />
                    <stop offset="75%" stopColor="#f97316" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.45" />
                  </linearGradient>

                  <filter id="skeleton-gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background Dim Base Arc */}
                <path
                  d="M 25 110 A 85 85 0 0 1 195 110"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="15"
                  strokeLinecap="round"
                />

                {/* Animated Gradient Wireframe Arc */}
                <path
                  d="M 25 110 A 85 85 0 0 1 195 110"
                  fill="none"
                  stroke="url(#skeleton-gauge-gradient)"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                  filter="url(#skeleton-gauge-glow)"
                  className="animate-pulse"
                />

                {/* Subtle Needle Silhouette */}
                <g transform="rotate(-65, 110, 110)" className="opacity-40">
                  <line
                    x1="130"
                    y1="110"
                    x2="192"
                    y2="110"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  />
                </g>
              </svg>

              {/* Central AQI Numerical Readout Placeholder Halo */}
              <div className="absolute top-13 flex flex-col items-center justify-center text-center space-y-1.5">
                <div className="h-11 w-20 rounded-2xl bg-white/[0.12] border border-white/10 glass-shimmer shadow-lg" />
                <div className="h-2.5 w-8 rounded bg-white/[0.08] glass-shimmer" />
                <div className="h-4.5 w-18 rounded-full bg-emerald-500/20 border border-emerald-500/30 glass-shimmer shadow-sm" />
              </div>
            </div>

            {/* Bottom Predicted Shift Badge Shimmer */}
            <div className="mt-4 w-full py-2 px-4 rounded-xl bg-[#09111e]/90 border border-slate-700/60 shadow-inner flex items-center justify-center gap-2 min-h-[38px]">
              <span className="h-2 w-2 rounded-full bg-sky-400/80 animate-pulse" />
              <div className="h-3 w-56 rounded bg-white/[0.07] glass-shimmer" />
            </div>

            {/* User Guidance Micro-Copy Shimmer */}
            <div className="w-full pt-2 flex justify-center">
              <div className="h-2.5 w-72 rounded bg-white/[0.04] glass-shimmer" />
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* Card 2: SHAP Waterfall Force Plot Skeleton                             */}
          {/* ----------------------------------------------------------------------- */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden min-h-[220px]">
            {/* Ambient Glow */}
            <div className="absolute w-52 h-52 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="h-4 w-56 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
              <div className="h-4 w-16 rounded-md bg-white/[0.05] glass-shimmer" />
            </div>

            {/* Waterfall Plot Body with Left "Factor" Vertical Label */}
            <div className="flex items-stretch gap-2 py-2 my-auto">
              {/* Left Vertical "Factor" Label */}
              <div className="flex items-center justify-center pr-1 select-none">
                <span className="-rotate-90 text-[10px] font-mono text-slate-500 tracking-wider">
                  Factor
                </span>
              </div>

              {/* 3 Horizontal Factor Rows Shimmer */}
              <div className="flex-1 space-y-4">
                {[
                  { nameW: 'w-24', barW: '60%', isPos: false, color: 'bg-emerald-500/35 border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]', valColor: 'bg-emerald-500/25 border-emerald-500/40' },
                  { nameW: 'w-16', barW: '45%', isPos: true, color: 'bg-rose-500/35 border-rose-400/60 shadow-[0_0_10px_rgba(239,68,68,0.3)]', valColor: 'bg-rose-500/25 border-rose-500/40' },
                  { nameW: 'w-20', barW: '50%', isPos: false, color: 'bg-emerald-500/35 border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]', valColor: 'bg-emerald-500/25 border-emerald-500/40' },
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="grid grid-cols-12 gap-2 items-center text-xs">
                      {/* Factor Name Column */}
                      <div className="col-span-4 flex justify-end">
                        <div className={`h-3.5 ${row.nameW} rounded bg-white/[0.08] glass-shimmer`} />
                      </div>

                      {/* Force Bar Column */}
                      <div className="col-span-8 flex items-center relative h-6">
                        {/* Vertical Zero Axis Line */}
                        <div className="absolute left-[32%] top-0 bottom-0 w-[1.5px] bg-slate-700/80" />

                        {row.isPos ? (
                          <div className="flex items-center pl-[32%] w-full">
                            <div
                              className={`h-5 rounded-r-[2px] ${row.color} border-y border-r glass-shimmer transition-all`}
                              style={{ width: row.barW }}
                            />
                            <div className={`ml-2 h-4 w-10 rounded border ${row.valColor} glass-shimmer`} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-end pr-[68%] w-full">
                            <div className={`mr-2 h-4 w-10 rounded border ${row.valColor} glass-shimmer`} />
                            <div
                              className={`h-5 rounded-l-[2px] ${row.color} border-y border-l glass-shimmer transition-all`}
                              style={{ width: row.barW }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subtext description line */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4" />
                      <div className="col-span-8 pl-1">
                        <div className="h-2.5 w-44 rounded bg-white/[0.04] glass-shimmer" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
