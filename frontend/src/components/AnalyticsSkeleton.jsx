import React from 'react';
import { Cpu, Sparkles, TrendingUp, Sun, Wind, CloudRain, Activity } from 'lucide-react';

export default function AnalyticsSkeleton({ activeTab = '3day' }) {
  const cardCount = activeTab === '3day' ? 3 : 7;

  return (
    <div className="flex flex-col gap-5 w-full pb-10 select-none animate-fadeIn">
      {/* Row 1: 4 Glassy KPI Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Average AQI */}
        <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between min-h-[115px] overflow-hidden">
          <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-teal-500/15 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between pb-1">
            <div className="h-3.5 w-36 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-3.5 w-6 rounded bg-white/[0.05] glass-shimmer" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <div className="h-9 w-20 rounded-xl bg-white/[0.12] border border-white/10 glass-shimmer" />
            <div className="h-5 w-20 rounded-full bg-teal-500/15 border border-teal-500/30 glass-shimmer" />
          </div>
        </div>

        {/* KPI 2: Cleanest Day */}
        <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between min-h-[115px] overflow-hidden">
          <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between pb-1">
            <div className="h-3.5 w-28 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-3.5 w-6 rounded bg-white/[0.05] glass-shimmer" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <div className="h-8 w-16 rounded-lg bg-white/[0.08] glass-shimmer" />
            <div className="h-9 w-16 rounded-xl bg-emerald-500/15 border border-emerald-500/30 glass-shimmer" />
          </div>
        </div>

        {/* KPI 3: Peak Smog */}
        <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between min-h-[115px] overflow-hidden">
          <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-rose-500/15 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between pb-1">
            <div className="h-3.5 w-24 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-3.5 w-6 rounded bg-white/[0.05] glass-shimmer" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <div className="h-8 w-16 rounded-lg bg-white/[0.08] glass-shimmer" />
            <div className="h-9 w-16 rounded-xl bg-rose-500/15 border border-rose-500/30 glass-shimmer" />
          </div>
        </div>

        {/* KPI 4: Dominant Hazard */}
        <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between min-h-[115px] overflow-hidden">
          <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-sky-500/15 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between pb-1">
            <div className="h-3.5 w-32 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-3.5 w-6 rounded bg-white/[0.05] glass-shimmer" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <div className="h-8 w-16 rounded-lg bg-white/[0.12] border border-white/10 glass-shimmer" />
            <div className="h-5 w-20 rounded-full bg-sky-500/15 border border-sky-500/30 glass-shimmer" />
          </div>
        </div>
      </div>

      {/* Row 2: Glowing Forecast Curve Chart Skeleton */}
      <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-10 right-1/4 w-72 h-44 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        {/* Chart Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="h-4 w-44 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-4 w-20 rounded-full bg-teal-500/15 border border-teal-500/30 glass-shimmer" />
          </div>
          <div className="h-4 w-32 rounded-md bg-white/[0.06] glass-shimmer" />
        </div>

        {/* Chart Area Wave Canvas */}
        <div className="relative h-[220px] w-full my-4 flex flex-col justify-between overflow-hidden rounded-xl bg-slate-950/40 border border-white/5 p-4">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
            <div className="h-[1px] w-full bg-white/[0.04] border-dashed" />
            <div className="h-[1px] w-full bg-white/[0.04] border-dashed" />
            <div className="h-[1px] w-full bg-white/[0.04] border-dashed" />
            <div className="h-[1px] w-full bg-white/[0.04] border-dashed" />
          </div>

          {/* SVG Animated Glowing Curve Wireframe */}
          <svg className="w-full h-full overflow-visible">
            <path
              d="M 0 140 Q 250 60, 500 120 T 750 50 T 1000 90"
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="3"
              strokeDasharray="6 6"
              className="opacity-40 animate-pulse"
            />
            {/* Shimmering Peak Nodes */}
            <circle cx="250" cy="60" r="4" fill="#2dd4bf" className="animate-ping opacity-60" />
            <circle cx="750" cy="50" r="4" fill="#2dd4bf" className="animate-ping opacity-60" />
          </svg>

          {/* Center Informational Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-4 py-1.5 rounded-full bg-slate-900/80 border border-teal-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.15)] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-mono font-medium text-teal-300">
                Generating Multi-Horizon Forecast Trajectory...
              </span>
            </div>
          </div>
        </div>

        {/* X-Axis Timeline Labels Shimmer */}
        <div className="flex items-center justify-between px-2 pt-1">
          {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map((d, i) => (
            <div key={i} className="h-3 w-12 rounded bg-white/[0.06] glass-shimmer" />
          ))}
        </div>
      </div>

      {/* Row 3: Daily Forecast Cards Carousel (3 or 7 cards) */}
      <div
        className={`grid gap-3 ${
          activeTab === '3day' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-7'
        }`}
      >
        {Array.from({ length: cardCount }).map((_, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl border border-white/10 bg-slate-900/40 p-3.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between items-center text-center min-h-[145px] overflow-hidden"
          >
            {/* Top Date Bar */}
            <div className="w-full flex flex-col items-center gap-1 pb-1">
              <div className="h-3.5 w-12 rounded bg-white/[0.09] glass-shimmer" />
              <div className="h-2.5 w-10 rounded bg-white/[0.05] glass-shimmer" />
            </div>

            {/* Center Weather Icon Placeholder */}
            <div className="my-2 h-8 w-8 rounded-xl bg-white/[0.08] border border-white/5 glass-shimmer flex items-center justify-center" />

            {/* Bottom AQI Badge Placeholder */}
            <div className="w-full h-7 rounded-xl bg-teal-500/15 border border-teal-500/30 glass-shimmer" />
          </div>
        ))}
      </div>

      {/* Row 4: Deep Atmospheric Insights Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Card 1 (6 cols): Dedicated Diurnal Activity Heatmap Skeleton */}
        <div className="lg:col-span-6 xl:col-span-6 relative rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between min-h-[280px] overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute w-44 h-44 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="h-4 w-48 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-4 w-20 rounded-md bg-white/[0.05] glass-shimmer" />
          </div>

          {/* GitHub-Style Dynamic Row Matrix Cells Shimmer */}
          <div className="my-3 space-y-2">
            {(activeTab === '3day' ? ['Today', 'Sat', 'Sun', 'Mon'] : ['Today', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']).map((day, idx) => (
              <div key={day} className="flex items-center gap-2">
                <span className={`text-[10px] font-mono w-8 ${idx === 0 ? 'text-teal-300 font-bold' : 'text-slate-500'}`}>{day}</span>
                <div className="flex-1 grid grid-cols-12 gap-1.5">
                  {Array.from({ length: 12 }).map((_, c) => (
                    <div
                      key={c}
                      className="h-3.5 rounded-sm bg-white/[0.05] border border-white/5 glass-shimmer"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Time Marks */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>00:00 Night</span>
            <span>08:00 Rush</span>
            <span>14:00 Midday</span>
            <span>18:00 Rush</span>
            <span>23:00 Night</span>
          </div>
        </div>

        {/* Card 2 (3 cols): 2-Year Seasonal Smog Pattern Skeleton */}
        <div className="lg:col-span-3 xl:col-span-3 relative rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between min-h-[280px] overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute w-36 h-36 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="pb-2">
            <div className="h-4 w-40 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
          </div>

          {/* 12 Vertical Rounded Pill Bars matching exact mockup */}
          <div className="flex items-end justify-between gap-1.5 h-44 pt-3 px-1 pb-1">
            {[68, 58, 48, 64, 76, 78, 54, 42, 48, 70, 96, 74].map((h, idx) => {
              const isPeak = idx >= 9 || idx <= 1; // Nov, Dec, Jan, Feb
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className={`w-2.5 sm:w-3 rounded-full glass-shimmer ${
                      isPeak
                        ? 'bg-gradient-to-t from-rose-500/30 to-orange-400/40 border-t border-rose-400/50'
                        : 'bg-white/[0.08] border border-white/10'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Readout Placeholder Ribbon */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <div className="h-3 w-36 rounded bg-white/[0.05] glass-shimmer" />
            <div className="h-3 w-20 rounded bg-white/[0.05] glass-shimmer" />
          </div>
        </div>

        {/* Card 3 (3 cols): Dominant Pollutant WHO Guidelines Skeleton */}
        <div className="lg:col-span-3 xl:col-span-3 relative rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between min-h-[280px] overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute w-36 h-36 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="pb-2">
            <div className="h-4 w-36 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
          </div>

          {/* 4 Clean Pollutant Guideline Rows */}
          <div className="space-y-4 my-auto py-1">
            {[
              { name: 'PM2.5', w: '68%' },
              { name: 'PM10', w: '62%' },
              { name: 'NO2', w: '45%' },
              { name: 'SO2', w: '50%' },
            ].map((p, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/70 font-mono w-14">{p.name}</span>
                  <div className="flex-1 px-2">
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono leading-none pb-0.5">
                      <div className="h-2 w-10 rounded bg-white/[0.05]" />
                      <div className="h-2 w-10 rounded bg-white/[0.05]" />
                    </div>
                    <div className="relative w-full h-2.5 rounded-full bg-slate-800/90 overflow-visible">
                      <div
                        className="h-full rounded-full bg-teal-500/25 border-r border-teal-400/50 glass-shimmer"
                        style={{ width: p.w }}
                      />
                      <div
                        className="absolute -top-1 bottom-0 w-[2px] h-4.5 bg-white/80 rounded-full"
                        style={{ left: p.w }}
                      />
                    </div>
                  </div>
                  <div className="h-3.5 w-3.5 rounded bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
