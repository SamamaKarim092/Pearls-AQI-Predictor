import React from 'react';
import { Cpu, Sparkles, Activity } from 'lucide-react';

export default function OverviewSkeleton({ selectedCity = 'Karachi' }) {
  return (
    <div className="w-full space-y-5 animate-fadeIn select-none">
      {/* Top Header Shimmer Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="space-y-2">
          <div className="h-9 w-64 rounded-xl bg-white/[0.08] border border-white/10 glass-shimmer" />
          <div className="h-4 w-44 rounded-lg bg-white/[0.05] border border-white/5 glass-shimmer" />
        </div>

        {/* Live AI Telemetry Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/60 border border-teal-500/40 backdrop-blur-xl shadow-[0_0_20px_rgba(20,184,166,0.2)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400" />
          </span>
          <span className="text-xs font-mono font-bold text-teal-300 flex items-center gap-2">
            <Cpu size={14} className="animate-spin text-teal-300" style={{ animationDuration: '3s' }} />
            <span>Computing 72h LightGBM Forecast for {selectedCity}...</span>
          </span>
        </div>
      </div>

      {/* 3-Column Glassy Hero Bento Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        
        {/* Column 1: Concentric Activity Rings Skeleton */}
        <div className="relative flex flex-col items-center justify-between w-full h-full min-h-[340px] rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute w-52 h-52 rounded-full bg-teal-500/15 blur-3xl pointer-events-none animate-pulse" />

          {/* Top Title Bar */}
          <div className="flex items-center justify-between w-full pb-2 border-b border-white/5">
            <div className="h-4 w-36 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-4 w-16 rounded-md bg-white/[0.05] border border-white/5 glass-shimmer" />
          </div>

          {/* Central Concentric Glass Rings Placeholder */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Outer Ring */}
            <div
              className="w-48 h-48 rounded-full border-2 border-teal-500/25 border-dashed animate-spin flex items-center justify-center"
              style={{ animationDuration: '14s' }}
            >
              {/* Middle Ring */}
              <div className="w-36 h-36 rounded-full border-2 border-sky-400/30 flex items-center justify-center animate-pulse">
                {/* Center Core */}
                <div className="w-24 h-24 rounded-full bg-slate-900/80 border border-white/15 flex flex-col items-center justify-center p-2 backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.15)]">
                  <div className="h-7 w-12 rounded-lg bg-white/[0.12] border border-white/10 glass-shimmer mb-1" />
                  <div className="h-3 w-8 rounded bg-white/[0.08] glass-shimmer" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Category Status Pill */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-white/5">
            <div className="h-5 w-28 rounded-full bg-teal-500/15 border border-teal-500/30 glass-shimmer" />
            <div className="h-4 w-20 rounded-md bg-white/[0.06] glass-shimmer" />
          </div>
        </div>

        {/* Column 2: Cigarette Equivalent Card Skeleton */}
        <div className="relative flex flex-col justify-between w-full h-full min-h-[340px] rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Top Title Bar */}
          <div className="flex items-center justify-between w-full pb-2 border-b border-white/5">
            <div className="h-4 w-36 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-6 w-6 rounded-lg bg-white/[0.06] border border-white/5 glass-shimmer" />
          </div>

          {/* Cigarette Pack Center Graphic */}
          <div className="my-auto flex flex-col items-center text-center space-y-3 py-3">
            <div className="h-12 w-28 rounded-2xl bg-white/[0.1] border border-white/10 glass-shimmer shadow-lg" />
            <div className="h-4 w-44 rounded-lg bg-white/[0.06] border border-white/5 glass-shimmer" />
            <div className="h-3 w-32 rounded-md bg-white/[0.04] glass-shimmer" />
          </div>

          {/* Health Impact Disclaimer */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <div className="h-3 w-full rounded bg-white/[0.06] glass-shimmer" />
            <div className="h-3 w-4/5 rounded bg-white/[0.04] glass-shimmer" />
          </div>
        </div>

        {/* Column 3: 2x2 Lifestyle Action Cards Skeleton */}
        <div className="relative flex flex-col justify-between w-full h-full min-h-[340px] rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute w-44 h-44 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

          {/* Top Title Bar */}
          <div className="flex items-center justify-between w-full pb-2 border-b border-white/5">
            <div className="h-4 w-32 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-4 w-20 rounded-md bg-white/[0.05] border border-white/5 glass-shimmer" />
          </div>

          {/* 2x2 Action Cards Shimmer */}
          <div className="grid grid-cols-2 gap-3 my-2 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-slate-900/60 border border-white/10 p-3 flex flex-col justify-between min-h-[95px] backdrop-blur-md glass-shimmer"
              >
                <div className="h-6 w-6 rounded-lg bg-white/[0.1] border border-white/5 mb-2" />
                <div className="space-y-1.5">
                  <div className="h-3 w-16 rounded bg-white/[0.08]" />
                  <div className="h-2.5 w-20 rounded bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5">
            <div className="h-3 w-48 rounded bg-white/[0.05] glass-shimmer" />
          </div>
        </div>
      </div>

      {/* Bottom Controls Row: Timeline Scrubber & Pollutant Guideline Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 items-stretch">
        
        {/* Left Side: Time-Travel Scrubber Skeleton */}
        <div className="relative flex flex-col justify-between w-full h-full min-h-[170px] rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="h-4 w-40 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-4 w-24 rounded-md bg-white/[0.05] border border-white/5 glass-shimmer" />
          </div>

          {/* Scrubber Slider Bar Shimmer */}
          <div className="my-4 space-y-2">
            <div className="h-3 w-full rounded-full bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="flex justify-between">
              <div className="h-2.5 w-12 rounded bg-white/[0.05]" />
              <div className="h-2.5 w-16 rounded bg-white/[0.07]" />
              <div className="h-2.5 w-12 rounded bg-white/[0.05]" />
            </div>
          </div>

          {/* City Pill Chips */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <div className="h-6 w-20 rounded-lg bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-6 w-20 rounded-lg bg-white/[0.05] border border-white/5 glass-shimmer" />
            <div className="h-6 w-20 rounded-lg bg-white/[0.05] border border-white/5 glass-shimmer" />
          </div>
        </div>

        {/* Right Side: WHO Pollutant Guideline Bars Skeleton */}
        <div className="relative flex flex-col justify-between w-full h-full min-h-[170px] rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="h-4 w-48 rounded-md bg-white/[0.08] border border-white/5 glass-shimmer" />
            <div className="h-4 w-20 rounded-md bg-white/[0.05] border border-white/5 glass-shimmer" />
          </div>

          {/* 5 Pollutant Track Shimmers */}
          <div className="space-y-2.5 my-2">
            {[
              { w: '70%', label: 'w-10' },
              { w: '55%', label: 'w-12' },
              { w: '40%', label: 'w-8' },
              { w: '30%', label: 'w-8' },
            ].map((bar, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`h-3 ${bar.label} rounded bg-white/[0.07]`} />
                <div className="flex-1 h-2.5 rounded-full bg-white/[0.04] overflow-hidden relative border border-white/5">
                  <div
                    className="h-full rounded-full bg-teal-500/25 border-r border-teal-400/50 glass-shimmer"
                    style={{ width: bar.w }}
                  />
                </div>
                <div className="h-3 w-8 rounded bg-white/[0.06]" />
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5">
            <div className="h-3 w-40 rounded bg-white/[0.05] glass-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
