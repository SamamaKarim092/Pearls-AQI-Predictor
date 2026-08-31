import React, { useMemo } from 'react';
import { MapPin, Activity, TrendingUp, RefreshCw, CheckCircle2 } from 'lucide-react';
import { geoMercator, geoPath } from 'd3-geo';
import pakistanGeoJson from '../data/pakistan_provinces.json';

export default function RegionalMapSkeleton() {
  // D3 Projection: Render the exact, authentic GeoJSON Pakistan Map with a subtle atmospheric blur
  const { provincePaths, pinCoords, windVectors, mapBounds } = useMemo(() => {
    const width = 640;
    const height = 440;
    const projection = geoMercator().fitExtent(
      [[25, 20], [width - 25, height - 20]],
      pakistanGeoJson
    );
    const pathGen = geoPath().projection(projection);

    const paths = (pakistanGeoJson.features || []).map((feat, i) => ({
      id: feat.properties.name || `feat-${i}`,
      name: feat.properties.name || 'Province',
      d: pathGen(feat) || '',
    }));

    const gpsLocations = {
      Islamabad: [73.0479, 33.6844],
      Lahore: [74.3587, 31.5204],
      Karachi: [67.0011, 24.8607],
    };

    const pins = {};
    for (const [city, [lon, lat]] of Object.entries(gpsLocations)) {
      const pt = projection([lon, lat]);
      if (pt) {
        pins[city] = { x: pt[0], y: pt[1] };
      }
    }

    const windGps = [
      { lon: 63.5, lat: 28.0, rot: 35, length: 14 },
      { lon: 65.5, lat: 29.0, rot: 40, length: 16 },
      { lon: 67.5, lat: 30.0, rot: 45, length: 18 },
      { lon: 69.5, lat: 31.0, rot: 50, length: 16 },
      { lon: 71.5, lat: 32.0, rot: 55, length: 15 },
      { lon: 66.5, lat: 27.0, rot: 35, length: 18 },
      { lon: 68.5, lat: 28.0, rot: 42, length: 20 },
      { lon: 70.5, lat: 29.0, rot: 48, length: 18 },
      { lon: 67.0, lat: 25.0, rot: 80, length: 20 },
      { lon: 68.5, lat: 25.5, rot: 85, length: 22 },
      { lon: 72.0, lat: 33.5, rot: 60, length: 16 },
      { lon: 73.8, lat: 32.2, rot: 65, length: 16 },
    ];

    const vectors = windGps.map((w, idx) => {
      const pt = projection([w.lon, w.lat]);
      return pt ? { x: pt[0], y: pt[1], rot: w.rot, length: w.length, key: idx } : null;
    }).filter(Boolean);

    return { provincePaths: paths, pinCoords: pins, windVectors: vectors, mapBounds: { width, height } };
  }, []);

  return (
    <div className="w-full space-y-5 pb-8 animate-fadeIn select-none font-sans text-white">
      {/* =========================================================================
          TOP NATIONAL SUMMARY HEADER BAR SKELETON
         ========================================================================= */}
      <div className="w-full rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        {/* Ambient Glass Glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Left Title Placeholder */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-9 w-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.25)]">
            <Activity size={18} className="animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="h-5 w-44 rounded-lg bg-white/[0.09] border border-white/10 glass-shimmer" />
            <div className="h-3 w-72 sm:w-96 rounded bg-white/[0.04] glass-shimmer" />
          </div>
        </div>

        {/* Right Summary Badges Shimmer */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 relative z-10">
          {/* Cleanest City Pill Badge Shimmer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.12)]">
            <div className="h-3 w-28 rounded bg-white/[0.07] glass-shimmer" />
            <div className="h-5 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 glass-shimmer" />
          </div>

          {/* National Average Pill Badge Shimmer */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-teal-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(20,184,166,0.12)]">
            <div className="h-3 w-24 rounded bg-white/[0.07] glass-shimmer" />
            <div className="h-5 w-16 rounded-full bg-teal-500/20 border border-teal-500/30 glass-shimmer" />
          </div>

          {/* Most Polluted City Pill Badge Shimmer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-rose-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.12)]">
            <div className="h-3 w-28 rounded bg-white/[0.07] glass-shimmer" />
            <div className="h-5 w-16 rounded-full bg-rose-500/20 border border-rose-500/30 glass-shimmer" />
          </div>

          {/* Refresh Button Shimmer */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-slate-400">
            <RefreshCw size={14} className="animate-spin text-teal-300/60" style={{ animationDuration: '3s' }} />
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN GRID: AUTHENTIC BLURRED GEOJSON MAP + REGIONAL TABLE SKELETON
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ==================== LEFT: PAKISTAN GEOJSON ATMOSPHERIC MAP SKELETON ==================== */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between relative overflow-hidden min-h-[410px]">
          {/* Ambient Glows */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Map Top Header */}
          <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-teal-400/80 animate-pulse" />
              <div className="h-4 w-72 rounded bg-white/[0.08] border border-white/5 glass-shimmer" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-950/70 border border-teal-500/40 text-[10px] text-teal-300 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
              <span>Calibrating GeoJSON...</span>
            </div>
          </div>

          {/* Interactive Map Visual Container with Atmospheric Blur */}
          <div className="relative flex-1 flex items-center justify-center my-2 select-none overflow-hidden rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md min-h-[330px]">
            {/* Zoom Controls Skeleton */}
            <div className="absolute top-3 left-3 z-30 flex flex-col rounded-lg bg-slate-900/90 border border-white/15 backdrop-blur-md overflow-hidden shadow-lg p-1 space-y-1">
              <div className="h-5 w-5 rounded bg-white/[0.08] glass-shimmer" />
              <div className="h-[1px] bg-white/10" />
              <div className="h-5 w-5 rounded bg-white/[0.08] glass-shimmer" />
            </div>

            {/* Authentic Pakistan GeoJSON SVG Map with Atmospheric Blur Effect */}
            <div className="w-full h-full relative flex items-center justify-center filter blur-[3.5px] opacity-70 transition-all duration-500">
              <svg
                viewBox={`0 0 ${mapBounds.width} ${mapBounds.height}`}
                className="w-full h-full max-h-[340px] object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  <linearGradient id="skelProvinceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0d2433" />
                    <stop offset="50%" stopColor="#0a1c29" />
                    <stop offset="100%" stopColor="#071520" />
                  </linearGradient>

                  <filter id="skelNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <marker id="skelWindArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" opacity="0.8" />
                  </marker>
                </defs>

                {/* Coordinate Grid Lines */}
                <g stroke="#1a2d3f" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4">
                  <line x1="40" y1="100" x2="600" y2="100" />
                  <line x1="40" y1="200" x2="600" y2="200" />
                  <line x1="40" y1="300" x2="600" y2="300" />
                  <line x1="150" y1="40" x2="150" y2="400" />
                  <line x1="320" y1="40" x2="320" y2="400" />
                  <line x1="490" y1="40" x2="490" y2="400" />
                </g>

                {/* Official Pakistan Province Boundary Paths Projected from GeoJSON */}
                <g filter="url(#skelNeonGlow)">
                  {provincePaths.map((prov) => (
                    <path
                      key={prov.id}
                      d={prov.d}
                      fill="url(#skelProvinceGrad)"
                      stroke="#00f5c4"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ))}
                </g>

                {/* Animated Wind Vectors */}
                <g className="animate-pulse" style={{ animationDuration: '3s' }}>
                  {windVectors.map((arrow) => (
                    <g key={arrow.key} transform={`translate(${arrow.x}, ${arrow.y}) rotate(${arrow.rot})`}>
                      <line
                        x1={-arrow.length}
                        y1="0"
                        x2={arrow.length}
                        y2="0"
                        stroke="#38bdf8"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity={0.55}
                        markerEnd="url(#skelWindArrow)"
                      />
                    </g>
                  ))}
                </g>
              </svg>

              {/* Exact Station Pin Placeholders */}
              {/* 1. Islamabad Pin */}
              {pinCoords.Islamabad && (
                <div
                  style={{
                    left: `${(pinCoords.Islamabad.x / mapBounds.width) * 100}%`,
                    top: `${(pinCoords.Islamabad.y / mapBounds.height) * 100}%`,
                  }}
                  className="absolute -translate-x-[72%] -translate-y-[100%] flex items-center gap-1.5"
                >
                  <div className="h-3.5 w-14 rounded bg-white/[0.12] glass-shimmer" />
                  <div className="w-6 h-8 rounded-full bg-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
                </div>
              )}

              {/* 2. Lahore Pin */}
              {pinCoords.Lahore && (
                <div
                  style={{
                    left: `${(pinCoords.Lahore.x / mapBounds.width) * 100}%`,
                    top: `${(pinCoords.Lahore.y / mapBounds.height) * 100}%`,
                  }}
                  className="absolute -translate-x-[20%] -translate-y-[100%] flex items-center gap-1.5"
                >
                  <div className="w-6 h-8 rounded-full bg-rose-500/80 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse" />
                  <div className="h-3.5 w-12 rounded bg-white/[0.12] glass-shimmer" />
                </div>
              )}

              {/* 3. Karachi Pin */}
              {pinCoords.Karachi && (
                <div
                  style={{
                    left: `${(pinCoords.Karachi.x / mapBounds.width) * 100}%`,
                    top: `${(pinCoords.Karachi.y / mapBounds.height) * 100}%`,
                  }}
                  className="absolute -translate-x-[20%] -translate-y-[100%] flex items-center gap-1.5"
                >
                  <div className="w-6 h-8 rounded-full bg-amber-500/80 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse" />
                  <div className="h-3.5 w-12 rounded bg-white/[0.12] glass-shimmer" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== RIGHT: REGIONAL COMPARISON TABLE SKELETON ==================== */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between relative overflow-hidden min-h-[380px]">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Table Header Row */}
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="h-4 w-52 rounded bg-white/[0.09] border border-white/10 glass-shimmer" />
              <div className="h-3 w-28 rounded bg-white/[0.04] glass-shimmer" />
            </div>

            {/* Table Column Headers */}
            <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-slate-400 px-3 pb-2 select-none">
              <div className="col-span-3"><div className="h-3 w-12 rounded bg-white/[0.05]" /></div>
              <div className="col-span-2 flex justify-center"><div className="h-3 w-14 rounded bg-white/[0.05]" /></div>
              <div className="col-span-2 flex justify-center"><div className="h-3 w-16 rounded bg-white/[0.05]" /></div>
              <div className="col-span-2 flex justify-center"><div className="h-3 w-20 rounded bg-white/[0.05]" /></div>
              <div className="col-span-1 flex justify-center"><div className="h-3 w-12 rounded bg-white/[0.05]" /></div>
              <div className="col-span-2 flex justify-end"><div className="h-3 w-18 rounded bg-white/[0.05]" /></div>
            </div>

            {/* 3 Table Row Skeletons */}
            <div className="space-y-3 pt-1">
              {[
                { name: 'Islamabad', border: 'border-emerald-500/35', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]', dot: 'bg-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/30' },
                { name: 'Karachi', border: 'border-amber-500/35', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.1)]', dot: 'bg-amber-400', badge: 'bg-amber-500/20 border-amber-500/30' },
                { name: 'Lahore', border: 'border-rose-500/35', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]', dot: 'bg-rose-400', badge: 'bg-rose-500/20 border-rose-500/30' },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-12 gap-2 items-center px-3.5 py-3 rounded-xl border bg-slate-900/60 backdrop-blur-md ${row.border} ${row.glow}`}
                >
                  {/* City */}
                  <div className="col-span-3 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${row.dot} animate-pulse`} />
                    <div className="h-4 w-20 rounded bg-white/[0.1] glass-shimmer" />
                  </div>

                  {/* AQI Score */}
                  <div className="col-span-2 flex justify-center">
                    <div className="h-6 w-12 rounded-lg bg-white/[0.12] border border-white/10 glass-shimmer" />
                  </div>

                  {/* Health Status */}
                  <div className="col-span-2 flex justify-center">
                    <div className={`h-5 w-20 rounded-full ${row.badge} border glass-shimmer`} />
                  </div>

                  {/* Dominant Pollutant */}
                  <div className="col-span-2 flex justify-center">
                    <div className="h-3.5 w-12 rounded bg-white/[0.06] glass-shimmer" />
                  </div>

                  {/* Wind Speed */}
                  <div className="col-span-1 flex justify-center">
                    <div className="h-3.5 w-10 rounded bg-white/[0.06] glass-shimmer" />
                  </div>

                  {/* Cigarette Equivalence */}
                  <div className="col-span-2 flex justify-end">
                    <div className="h-4 w-14 rounded bg-white/[0.08] glass-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Bottom Helper Note Shimmer */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400/60" />
              <div className="h-3 w-64 rounded bg-white/[0.04] glass-shimmer" />
            </div>
            <div className="h-3 w-16 rounded bg-white/[0.04] glass-shimmer" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM PANEL: 24-HOUR DIURNAL TIME-SERIES CHART SKELETON
         ========================================================================= */}
      <div className="w-full rounded-2xl border border-white/10 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden space-y-3">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-amber-500/10 blur-3xl pointer-events-none" />

        {/* Chart Header & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-teal-400/80" />
              <div className="h-4.5 w-80 sm:w-96 rounded-lg bg-white/[0.09] border border-white/10 glass-shimmer" />
            </div>
            <div className="h-3 w-72 rounded bg-white/[0.04] glass-shimmer" />
          </div>

          {/* City Legend Indicators */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <span className="h-2 w-4 rounded-full bg-emerald-400/60 animate-pulse" />
              <div className="h-3 w-16 rounded bg-emerald-400/20" />
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <span className="h-2 w-4 rounded-full bg-amber-400/60 animate-pulse" />
              <div className="h-3 w-14 rounded bg-amber-400/20" />
            </div>
            <div className="flex items-center gap-1.5 text-rose-300">
              <span className="h-2 w-4 rounded-full bg-rose-400/60 animate-pulse" />
              <div className="h-3 w-14 rounded bg-rose-400/20" />
            </div>
          </div>
        </div>

        {/* SVG Multi-Line Chart Canvas Skeleton */}
        <div className="relative w-full h-[220px] bg-slate-950/60 rounded-xl border border-white/10 backdrop-blur-md overflow-hidden">
          <svg
            viewBox="0 0 1000 220"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible opacity-75"
          >
            {/* Horizontal Gridlines */}
            {[15, 65, 115, 165, 205].map((y, i) => (
              <g key={i}>
                <line x1="0" y1={y} x2="1000" y2={y} stroke="#1e293b" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.6" />
              </g>
            ))}

            {/* 3 Animated Shimmer Curves */}
            {/* Wave 1: Islamabad Green */}
            <path
              d="M 0 180 Q 250 200 500 160 T 1000 170"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="animate-pulse"
              opacity="0.8"
            />
            {/* Wave 2: Karachi Amber */}
            <path
              d="M 0 140 Q 250 170 500 110 T 1000 135"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="animate-pulse"
              opacity="0.8"
            />
            {/* Wave 3: Lahore Crimson */}
            <path
              d="M 0 90 Q 250 120 500 50 T 1000 80"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3"
              strokeDasharray="6 4"
              className="animate-pulse"
              opacity="0.8"
            />

            {/* Vertical Scrubber Cursor Wireframe */}
            <line x1="750" y1="5" x2="750" y2="220" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="750" cy="165" r="4" fill="#10b981" />
            <circle cx="750" cy="120" r="4" fill="#fbbf24" />
            <circle cx="750" cy="65" r="5" fill="#f43f5e" />
          </svg>
        </div>

        {/* Timeline Ticks Shimmer */}
        <div className="relative w-full h-6 select-none mt-1">
          {Array.from({ length: 13 }).map((_, i) => (
            <div
              key={i}
              style={{ left: `${(i / 12) * 100}%` }}
              className="absolute top-0 -translate-x-1/2 h-2.5 w-7 rounded bg-white/[0.04] glass-shimmer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
