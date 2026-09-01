import React, { useState, useMemo } from 'react';
import {
  Database,
  Box,
  Timer,
  GitBranch,
  Settings,
  Sparkles,
} from 'lucide-react';

export default function ModelTournament({ selectedCity = 'Karachi' }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // 4-Fold Seasonal Cross-Validation Dataset matching reference image
  const seasonalData = [
    {
      season: 'Spring',
      bars: [
        { label: 'Fold 1 (Spring Early)', value: 48, color: '#34d399', mae: '3.4 µg/m³' },
        { label: 'Fold 2 (Spring Mid)', value: 54, color: '#22d3ee', mae: '3.9 µg/m³' },
        { label: 'Fold 3 (Spring Late)', value: 45, color: '#0ea5e9', mae: '3.2 µg/m³' },
        { label: 'Fold 4 (Spring Trans)', value: 45, color: '#94a3b8', mae: '3.3 µg/m³' },
      ],
    },
    {
      season: 'Summer',
      bars: [
        { label: 'Fold 1 (Summer Monsoon Early)', value: 64, color: '#34d399', mae: '4.6 µg/m³' },
        { label: 'Fold 2 (Summer Heatwave)', value: 63, color: '#22d3ee', mae: '4.5 µg/m³' },
        { label: 'Fold 3 (Summer Monsoon Peak)', value: 52, color: '#0ea5e9', mae: '3.8 µg/m³' },
        { label: 'Fold 4 (Summer Late)', value: 62, color: '#94a3b8', mae: '4.4 µg/m³' },
      ],
    },
    {
      season: 'Autumn',
      bars: [
        { label: 'Fold 1 (Autumn Trans)', value: 47, color: '#34d399', mae: '3.5 µg/m³' },
        { label: 'Fold 2 (Autumn Mid)', value: 40, color: '#22d3ee', mae: '3.0 µg/m³' },
        { label: 'Fold 3 (Autumn Harvest Smog)', value: 32, color: '#0ea5e9', mae: '2.5 µg/m³' },
        { label: 'Fold 4 (Autumn Late)', value: 34, color: '#94a3b8', mae: '2.6 µg/m³' },
      ],
    },
    {
      season: 'Winter',
      bars: [
        { label: 'Fold 1 (Winter Inversion Early)', value: 42, color: '#34d399', mae: '3.1 µg/m³' },
        { label: 'Fold 2 (Winter Peak Smog)', value: 46, color: '#22d3ee', mae: '3.4 µg/m³' },
        { label: 'Fold 3 (Winter Fog)', value: 42, color: '#0ea5e9', mae: '3.1 µg/m³' },
        { label: 'Fold 4 (Winter Late)', value: 43, color: '#94a3b8', mae: '3.2 µg/m³' },
      ],
    },
  ];

  // Procedural point cloud for Actual vs Predicted calibration chart with realistic Gaussian clustering
  const scatterPoints = useMemo(() => {
    const points = [];
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Generate ~1100 points clustering along 45-degree identity line
    for (let i = 0; i < 1100; i++) {
      const u1 = Math.max(1e-5, pseudoRandom());
      const u2 = Math.max(1e-5, pseudoRandom());
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      const baseVal = Math.pow(pseudoRandom(), 1.35) * 760 + 15;
      const sigma = 8 + (baseVal / 760) * 28;
      const noise = z * sigma;
      const predictedVal = Math.max(5, Math.min(790, baseVal + noise));

      const err = Math.abs(noise);
      const isHighAccuracy = err < 12;

      points.push({
        x: baseVal,
        y: predictedVal,
        err: Math.round(noise),
        color: isHighAccuracy ? 'rgba(215, 245, 255, 0.85)' : 'rgba(100, 210, 240, 0.45)',
        size: isHighAccuracy ? 1.4 : 1.1,
      });
    }
    return points;
  }, []);

  return (
    <div className="w-full space-y-7 pb-8 animate-data-enter">
      {/* Top Main Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-semibold tracking-tight text-white drop-shadow-sm flex items-center gap-2.5">
          <span>Model Tournament & MLOps Leaderboard (AI Transparency)</span>
        </h1>
      </div>

      {/* =========================================================================
          SECTION 1: 3-D PODIUM STAGE WITH OVERLAPPING CYLINDERS & CHAMPION CARDS
         ========================================================================= */}
      <div className="relative pt-4 pb-0 max-w-[1140px] mx-auto select-none">
        <div className="flex flex-col md:flex-row items-end justify-center -space-y-4 md:space-y-0">
          
          {/* ==================== 2ND PLACE: SILVER (LEFT CYLINDER) ==================== */}
          <div className="flex flex-col items-center w-full md:w-[335px] lg:w-[355px] md:-mr-5 z-10 order-2 md:order-1 animate-podium-silver">
            {/* Silver Card (Floating above cylinder with Silver metallic shine) */}
            <div className="w-full max-w-[305px] rounded-2xl bg-[#0c1926]/95 border-2 border-[#94a3b8] p-4 sm:p-5 backdrop-blur-2xl shadow-[0_0_30px_rgba(148,163,184,0.3),0_18px_45px_rgba(0,0,0,0.85)] mb-3.5 sm:mb-4 z-10 transition-all duration-300 hover:shadow-[0_0_45px_rgba(203,213,225,0.45),0_20px_50px_rgba(0,0,0,0.95)] hover:-translate-y-1.5 relative">
              {/* Subtle ambient silver blur behind */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-400/20 to-sky-400/20 rounded-2xl blur-sm -z-10 pointer-events-none" />

              <div className="text-center space-y-1.5">
                <span className="text-xs font-semibold tracking-wide text-slate-300">
                  Silver Card
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Ridge Regression
                </h3>
                <div className="text-xs text-slate-300 font-mono pt-0.5">
                  MAE: <span className="text-slate-100 font-semibold">5.41 µg/m³</span> &nbsp;|&nbsp; R²: <span className="text-slate-100 font-semibold">0.781</span>
                </div>
              </div>
            </div>

            {/* 3D Solid Silver Cylinder Pedestal */}
            <div className="w-full relative">
              <svg viewBox="0 0 340 100" className="w-full h-auto overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]">
                <defs>
                  {/* Silver Body Cylinder Lighting */}
                  <linearGradient id="silverBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0d1720" />
                    <stop offset="15%" stopColor="#1a2d3e" />
                    <stop offset="45%" stopColor="#2c445a" />
                    <stop offset="75%" stopColor="#1d2e3f" />
                    <stop offset="90%" stopColor="#121e2a" />
                    <stop offset="100%" stopColor="#081017" />
                  </linearGradient>
                  {/* Silver Top Ellipse Cap */}
                  <radialGradient id="silverTopGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#273e54" />
                    <stop offset="60%" stopColor="#192a39" />
                    <stop offset="100%" stopColor="#0e1923" />
                  </radialGradient>
                  {/* Silver Top Metallic Rim */}
                  <linearGradient id="silverRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="45%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                </defs>

                {/* Cylinder Front Wall */}
                <path
                  d="M 2 18 A 168 18 0 0 0 338 18 L 338 100 L 2 100 Z"
                  fill="url(#silverBodyGrad)"
                  stroke="#334155"
                  strokeWidth="0.5"
                />

                {/* Cylinder Top Ellipse Cap */}
                <ellipse
                  cx="170"
                  cy="18"
                  rx="168"
                  ry="18"
                  fill="url(#silverTopGrad)"
                  stroke="url(#silverRimGrad)"
                  strokeWidth="2.5"
                />

                {/* Laurel Emblem with 2nd on Front Cylinder Wall (Centered in Wreath & Scaled Down) */}
                <g transform="translate(170, 68) scale(0.72)" className="select-none">
                  {/* Left Laurel Branch (Outside radius 16) */}
                  <g fill="#cbd5e1" opacity="0.95" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
                    <path d="M -16 14 C -28 10, -32 -2, -26 -14 C -22 -20, -17 -24, -12 -26" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                    <path d="M -16 12 C -23 14, -28 10, -28 6 C -25 4, -20 6, -16 12 Z" />
                    <path d="M -24 6 C -32 6, -35 0, -34 -4 C -30 -3, -25 0, -24 6 Z" />
                    <path d="M -27 -4 C -35 -5, -36 -12, -34 -16 C -30 -14, -26 -9, -27 -4 Z" />
                    <path d="M -24 -14 C -31 -18, -30 -25, -26 -28 C -23 -24, -21 -18, -24 -14 Z" />
                    <path d="M -17 -22 C -22 -27, -19 -33, -13 -35 C -12 -30, -13 -25, -17 -22 Z" />
                    <path d="M -11 -27 C -14 -33, -9 -38, -3 -39 C -3 -34, -6 -29, -11 -27 Z" />
                  </g>

                  {/* Right Laurel Branch (Outside radius 16) */}
                  <g transform="scale(-1, 1)" fill="#cbd5e1" opacity="0.95" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
                    <path d="M -16 14 C -28 10, -32 -2, -26 -14 C -22 -20, -17 -24, -12 -26" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                    <path d="M -16 12 C -23 14, -28 10, -28 6 C -25 4, -20 6, -16 12 Z" />
                    <path d="M -24 6 C -32 6, -35 0, -34 -4 C -30 -3, -25 0, -24 6 Z" />
                    <path d="M -27 -4 C -35 -5, -36 -12, -34 -16 C -30 -14, -26 -9, -27 -4 Z" />
                    <path d="M -24 -14 C -31 -18, -30 -25, -26 -28 C -23 -24, -21 -18, -24 -14 Z" />
                    <path d="M -17 -22 C -22 -27, -19 -33, -13 -35 C -12 -30, -13 -25, -17 -22 Z" />
                    <path d="M -11 -27 C -14 -33, -9 -38, -3 -39 C -3 -34, -6 -29, -11 -27 Z" />
                  </g>

                  {/* High-Contrast Bold Text 2nd in Exact Center of Laurel Ring */}
                  <text
                    x="0"
                    y="-11"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="20"
                    fontWeight="900"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fill="#ffffff"
                    stroke="#0a121a"
                    strokeWidth="3.2"
                    paintOrder="stroke fill"
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.9))"
                  >
                    2nd
                  </text>
                  {/* Base Underline */}
                  <path d="M -11 13 L 11 13" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                </g>
              </svg>
            </div>
          </div>

          {/* ==================== 1ST PLACE: GOLD CHAMPION (CENTER CYLINDER) ==================== */}
          <div className="flex flex-col items-center w-full md:w-[380px] lg:w-[415px] z-20 order-1 md:order-2 animate-podium-gold">
            {/* Gold Champion Card (Floating above cylinder with Emerald/Mint shine) */}
            <div className="w-full max-w-[340px] rounded-2xl bg-[#081b24]/95 border-2 border-[#00f5c4] p-4 sm:p-5 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,245,196,0.35),0_18px_45px_rgba(0,0,0,0.9)] mb-3.5 sm:mb-4 z-20 transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,245,196,0.5),0_20px_50px_rgba(0,0,0,0.95)] hover:-translate-y-1.5 relative animate-gold-card-float animate-gold-glow">
              {/* Subtle ambient emerald blur behind */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-sm -z-10 pointer-events-none" />

              <div className="text-center space-y-1.5">
                <span className="text-xs font-semibold tracking-wide text-amber-300">
                  Gold Champion Card
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  LightGBM Ensemble
                </h3>
                <div className="text-xs text-slate-200 font-mono pt-0.5">
                  MAE: <span className="text-emerald-300 font-bold">3.82 µg/m³</span> &nbsp;|&nbsp; R²: <span className="text-emerald-300 font-bold">0.892</span>
                </div>

                {/* Active in Production Pill */}
                <div className="pt-1.5 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/50 text-xs font-medium text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active in Production</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 3D Solid Gold Champion Cylinder Pedestal (Tallest, Overlapping) */}
            <div className="w-full relative">
              <svg viewBox="0 0 390 145" className="w-full h-auto overflow-visible filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]">
                <defs>
                  {/* Teal/Emerald Body Cylinder Lighting */}
                  <linearGradient id="goldBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#05181b" />
                    <stop offset="15%" stopColor="#0c3238" />
                    <stop offset="42%" stopColor="#154f59" />
                    <stop offset="72%" stopColor="#0e3a42" />
                    <stop offset="90%" stopColor="#082327" />
                    <stop offset="100%" stopColor="#031113" />
                  </linearGradient>
                  {/* Top Ellipse Cap */}
                  <radialGradient id="goldTopGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#17535e" />
                    <stop offset="65%" stopColor="#0e373f" />
                    <stop offset="100%" stopColor="#061e23" />
                  </radialGradient>
                  {/* Radiant Neon Mint Top Rim */}
                  <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f5c4" />
                    <stop offset="45%" stopColor="#5eead4" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                </defs>

                {/* Cylinder Front Wall */}
                <path
                  d="M 3 24 A 192 24 0 0 0 387 24 L 387 145 L 3 145 Z"
                  fill="url(#goldBodyGrad)"
                  stroke="#115e59"
                  strokeWidth="0.5"
                />

                {/* Cylinder Top Ellipse Cap */}
                <ellipse
                  cx="195"
                  cy="24"
                  rx="192"
                  ry="24"
                  fill="url(#goldTopGrad)"
                  stroke="url(#goldRimGrad)"
                  strokeWidth="3"
                />

                {/* Laurel Emblem with 1st on Front Cylinder Wall (Centered in Wreath & Scaled Down) */}
                <g transform="translate(195, 96) scale(0.78)" className="select-none">
                  {/* Left Laurel Branch (Outside radius 17) */}
                  <g fill="#facc15" opacity="0.98" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.85))">
                    <path d="M -17 15 C -30 11, -34 -2, -28 -15 C -24 -21, -18 -26, -13 -28" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M -17 13 C -24 15, -30 11, -30 7 C -27 5, -21 7, -17 13 Z" />
                    <path d="M -26 7 C -34 7, -37 1, -36 -3 C -32 -2, -27 1, -26 7 Z" />
                    <path d="M -29 -3 C -37 -4, -38 -12, -36 -17 C -32 -15, -28 -9, -29 -3 Z" />
                    <path d="M -26 -14 C -33 -19, -32 -26, -28 -30 C -25 -25, -23 -19, -26 -14 Z" />
                    <path d="M -18 -23 C -24 -28, -21 -35, -14 -37 C -13 -32, -14 -26, -18 -23 Z" />
                    <path d="M -12 -28 C -15 -35, -10 -40, -3 -42 C -3 -36, -7 -31, -12 -28 Z" />
                  </g>

                  {/* Right Laurel Branch (Outside radius 17) */}
                  <g transform="scale(-1, 1)" fill="#facc15" opacity="0.98" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.85))">
                    <path d="M -17 15 C -30 11, -34 -2, -28 -15 C -24 -21, -18 -26, -13 -28" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M -17 13 C -24 15, -30 11, -30 7 C -27 5, -21 7, -17 13 Z" />
                    <path d="M -26 7 C -34 7, -37 1, -36 -3 C -32 -2, -27 1, -26 7 Z" />
                    <path d="M -29 -3 C -37 -4, -38 -12, -36 -17 C -32 -15, -28 -9, -29 -3 Z" />
                    <path d="M -26 -14 C -33 -19, -32 -26, -28 -30 C -25 -25, -23 -19, -26 -14 Z" />
                    <path d="M -18 -23 C -24 -28, -21 -35, -14 -37 C -13 -32, -14 -26, -18 -23 Z" />
                    <path d="M -12 -28 C -15 -35, -10 -40, -3 -42 C -3 -36, -7 -31, -12 -28 Z" />
                  </g>

                  {/* High-Contrast Bold Text 1st in Exact Center of Laurel Ring */}
                  <text
                    x="0"
                    y="-11"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="22"
                    fontWeight="900"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fill="#fef08a"
                    stroke="#04181c"
                    strokeWidth="3.5"
                    paintOrder="stroke fill"
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.95))"
                  >
                    1st
                  </text>
                  {/* Base Underline */}
                  <path d="M -12 14 L 12 14" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          </div>

          {/* ==================== 3RD PLACE: BRONZE (RIGHT CYLINDER) ==================== */}
          <div className="flex flex-col items-center w-full md:w-[335px] lg:w-[355px] md:-ml-5 z-10 order-3 animate-podium-bronze">
            {/* Bronze Card (Floating above cylinder with Bronze/Amber shine) */}
            <div className="w-full max-w-[305px] rounded-2xl bg-[#181210]/95 border-2 border-[#d97706] p-4 sm:p-5 backdrop-blur-2xl shadow-[0_0_30px_rgba(217,119,6,0.3),0_18px_45px_rgba(0,0,0,0.85)] mb-3.5 sm:mb-4 z-10 transition-all duration-300 hover:shadow-[0_0_45px_rgba(245,158,11,0.45),0_20px_50px_rgba(0,0,0,0.95)] hover:-translate-y-1.5 relative">
              {/* Subtle ambient bronze/amber blur behind */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/25 to-yellow-600/20 rounded-2xl blur-sm -z-10 pointer-events-none" />

              <div className="text-center space-y-1.5">
                <span className="text-xs font-semibold tracking-wide text-amber-400/90">
                  Bronze Card
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Persistence Baseline
                </h3>
                <div className="text-xs text-slate-300 font-mono pt-0.5">
                  MAE: <span className="text-amber-200 font-semibold">8.95 µg/m³</span> &nbsp;|&nbsp; R²: <span className="text-amber-200 font-semibold">0.612</span>
                </div>
              </div>
            </div>

            {/* 3D Solid Bronze Cylinder Pedestal */}
            <div className="w-full relative">
              <svg viewBox="0 0 340 95" className="w-full h-auto overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]">
                <defs>
                  {/* Bronze Body Cylinder Lighting */}
                  <linearGradient id="bronzeBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#140b08" />
                    <stop offset="15%" stopColor="#291812" />
                    <stop offset="45%" stopColor="#45271d" />
                    <stop offset="75%" stopColor="#2e1a13" />
                    <stop offset="90%" stopColor="#1c0f0a" />
                    <stop offset="100%" stopColor="#0b0604" />
                  </linearGradient>
                  {/* Bronze Top Ellipse Cap */}
                  <radialGradient id="bronzeTopGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3d241a" />
                    <stop offset="60%" stopColor="#281711" />
                    <stop offset="100%" stopColor="#150b07" />
                  </radialGradient>
                  {/* Bronze Metallic Top Rim */}
                  <linearGradient id="bronzeRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="45%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                </defs>

                {/* Cylinder Front Wall */}
                <path
                  d="M 2 18 A 168 18 0 0 0 338 18 L 338 95 L 2 95 Z"
                  fill="url(#bronzeBodyGrad)"
                  stroke="#78350f"
                  strokeWidth="0.5"
                />

                {/* Cylinder Top Ellipse Cap */}
                <ellipse
                  cx="170"
                  cy="18"
                  rx="168"
                  ry="18"
                  fill="url(#bronzeTopGrad)"
                  stroke="url(#bronzeRimGrad)"
                  strokeWidth="2.5"
                />

                {/* Laurel Emblem with 3rd on Front Cylinder Wall (Centered in Wreath & Scaled Down) */}
                <g transform="translate(170, 66) scale(0.72)" className="select-none">
                  {/* Left Laurel Branch (Outside radius 16) */}
                  <g fill="#f59e0b" opacity="0.95" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
                    <path d="M -16 14 C -28 10, -32 -2, -26 -14 C -22 -20, -17 -24, -12 -26" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    <path d="M -16 12 C -23 14, -28 10, -28 6 C -25 4, -20 6, -16 12 Z" />
                    <path d="M -24 6 C -32 6, -35 0, -34 -4 C -30 -3, -25 0, -24 6 Z" />
                    <path d="M -27 -4 C -35 -5, -36 -12, -34 -16 C -30 -14, -26 -9, -27 -4 Z" />
                    <path d="M -24 -14 C -31 -18, -30 -25, -26 -28 C -23 -24, -21 -18, -24 -14 Z" />
                    <path d="M -17 -22 C -22 -27, -19 -33, -13 -35 C -12 -30, -13 -25, -17 -22 Z" />
                    <path d="M -11 -27 C -14 -33, -9 -38, -3 -39 C -3 -34, -6 -29, -11 -27 Z" />
                  </g>

                  {/* Right Laurel Branch (Outside radius 16) */}
                  <g transform="scale(-1, 1)" fill="#f59e0b" opacity="0.95" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
                    <path d="M -16 14 C -28 10, -32 -2, -26 -14 C -22 -20, -17 -24, -12 -26" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    <path d="M -16 12 C -23 14, -28 10, -28 6 C -25 4, -20 6, -16 12 Z" />
                    <path d="M -24 6 C -32 6, -35 0, -34 -4 C -30 -3, -25 0, -24 6 Z" />
                    <path d="M -27 -4 C -35 -5, -36 -12, -34 -16 C -30 -14, -26 -9, -27 -4 Z" />
                    <path d="M -24 -14 C -31 -18, -30 -25, -26 -28 C -23 -24, -21 -18, -24 -14 Z" />
                    <path d="M -17 -22 C -22 -27, -19 -33, -13 -35 C -12 -30, -13 -25, -17 -22 Z" />
                    <path d="M -11 -27 C -14 -33, -9 -38, -3 -39 C -3 -34, -6 -29, -11 -27 Z" />
                  </g>

                  {/* High-Contrast Bold Text 3rd in Exact Center of Laurel Ring */}
                  <text
                    x="0"
                    y="-11"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="20"
                    fontWeight="900"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fill="#fef3c7"
                    stroke="#140703"
                    strokeWidth="3.2"
                    paintOrder="stroke fill"
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.9))"
                  >
                    3rd
                  </text>
                  {/* Base Underline */}
                  <path d="M -11 13 L 11 13" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 4-FOLD SEASONAL CV & ACTUAL VS PREDICTED CALIBRATION
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* ==================== LEFT CHART: 4-FOLD SEASONAL CROSS-VALIDATION ==================== */}
        <div className="rounded-2xl bg-[#091522]/80 border border-white/10 p-5 backdrop-blur-md flex flex-col justify-between shadow-xl animate-card-rise-1 transition-all duration-300 hover:border-white/20">
          {/* Card Header & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
            <h2 className="text-base font-semibold text-white tracking-tight">
              4-Fold Seasonal Cross-Validation
            </h2>

            {/* Legend matching design */}
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="text-slate-400 font-medium text-[11px]">Mode</span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#34d399]" />
                <span>Spring</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#22d3ee]" />
                <span>Summer</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0ea5e9]" />
                <span>Autumn</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#94a3b8]" />
                <span>Winter</span>
              </div>
            </div>
          </div>

          {/* SVG Grouped Bar Chart */}
          <div className="relative pt-5 pb-2 h-[220px] w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Horizontal Gridlines & Y-Axis Labels (0, 20, 40, 60, 80) */}
              {[80, 60, 40, 20, 0].map((val, idx) => {
                const yPos = 15 + idx * 38;
                return (
                  <g key={val}>
                    <line
                      x1="30"
                      y1={yPos}
                      x2="485"
                      y2={yPos}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray={val === 0 ? '0' : '2,2'}
                    />
                    <text
                      x="22"
                      y={yPos + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="rgba(148, 163, 184, 0.7)"
                      fontFamily="monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Grouped Bars for 4 Seasons */}
              {seasonalData.map((group, gIdx) => {
                const groupStartX = 45 + gIdx * 112;
                return (
                  <g key={group.season}>
                    {/* 4 Bars within group */}
                    {group.bars.map((bar, bIdx) => {
                      const barX = groupStartX + bIdx * 20;
                      const barH = (bar.value / 80) * 152;
                      const barY = 167 - barH;
                      const isHovered = hoveredBar?.g === gIdx && hoveredBar?.b === bIdx;

                      return (
                        <g key={bar.label}>
                          <rect
                            x={barX}
                            y={barY}
                            width="16"
                            height={barH}
                            rx="3"
                            fill={bar.color}
                            opacity={isHovered ? 1 : 0.88}
                            className="cursor-pointer transition-all duration-200"
                            style={{
                              filter: isHovered ? `drop-shadow(0 0 8px ${bar.color})` : 'none',
                            }}
                            onMouseEnter={() => setHoveredBar({ g: gIdx, b: bIdx, ...bar, season: group.season })}
                            onMouseLeave={() => setHoveredBar(null)}
                          />
                        </g>
                      );
                    })}

                    {/* Season X-Axis Label */}
                    <text
                      x={groupStartX + 35}
                      y="185"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#cbd5e1"
                      fontWeight="500"
                    >
                      {group.season}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip for Bar Chart */}
            {hoveredBar && (
              <div className="absolute top-2 right-4 bg-slate-900/95 border border-sky-400/40 px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md pointer-events-none text-xs text-white space-y-0.5 animate-fadeIn">
                <div className="font-semibold text-sky-300">{hoveredBar.season} - {hoveredBar.label}</div>
                <div className="text-slate-300">
                  Validation AQI: <span className="font-mono font-bold text-white">{hoveredBar.value}</span> | Error: <span className="font-mono text-emerald-300">{hoveredBar.mae}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== RIGHT CHART: ACTUAL VS PREDICTED CALIBRATION ==================== */}
        <div className="rounded-2xl bg-[#091522]/80 border border-white/10 p-5 backdrop-blur-md flex flex-col justify-between shadow-xl animate-card-rise-2 transition-all duration-300 hover:border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h2 className="text-base font-semibold text-white tracking-tight">
              Actual vs Predicted calibration
            </h2>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
              R² = 0.892 (Optimal 45°)
            </span>
          </div>

          {/* Scatter Calibration Plot */}
          <div className="relative pt-5 pb-2 h-[220px] w-full">
            <svg
              viewBox="0 0 500 200"
              className="w-full h-full overflow-visible cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const normX = Math.max(0, Math.min(800, ((mouseX - 35) / (rect.width - 45)) * 800));
                setHoveredPoint({ actual: Math.round(normX), predicted: Math.round(normX * 0.99 + (Math.random() * 8 - 4)) });
              }}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Grid Lines */}
              {[800, 600, 400, 200, 0].map((val, idx) => {
                const yPos = 15 + idx * 37;
                return (
                  <g key={`y-${val}`}>
                    <line x1="35" y1={yPos} x2="485" y2={yPos} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                    <text x="27" y={yPos + 4} textAnchor="end" fontSize="10" fill="rgba(148, 163, 184, 0.7)" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                );
              })}

              {[0, 200, 400, 700, 800].map((val) => {
                const xPos = 35 + (val / 800) * 450;
                return (
                  <g key={`x-${val}`}>
                    <line x1={xPos} y1="15" x2={xPos} y2="163" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                    <text x={xPos} y="180" textAnchor="middle" fontSize="10" fill="rgba(148, 163, 184, 0.7)" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Y-Axis Label: Predicted */}
              <text
                x="-89"
                y="12"
                transform="rotate(-90)"
                fontSize="10"
                fill="rgba(148, 163, 184, 0.85)"
                textAnchor="middle"
              >
                Predicted
              </text>

              {/* X-Axis Label: Predicted */}
              <text
                x="260"
                y="196"
                fontSize="10"
                fill="rgba(148, 163, 184, 0.85)"
                textAnchor="middle"
              >
                Predicted
              </text>

              {/* Dense Scatter Point Cloud */}
              {scatterPoints.map((pt, idx) => {
                const cx = 35 + (pt.x / 800) * 450;
                const cy = 163 - (pt.y / 800) * 148;
                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r={pt.size}
                    fill={pt.color}
                  />
                );
              })}

              {/* Glowing 45° Ideal Calibration Line */}
              <line
                x1="35"
                y1="163"
                x2="485"
                y2="15"
                stroke="#00f5c4"
                strokeWidth="2"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_6px_#00f5c4]"
              />

              {/* 45° Degree Indicator Label */}
              <text
                x="70"
                y="152"
                fontSize="11"
                fill="#00f5c4"
                fontWeight="bold"
                className="filter drop-shadow-[0_0_4px_#00f5c4]"
              >
                45°
              </text>
            </svg>

            {/* Interactive Crosshair Tooltip */}
            {hoveredPoint && (
              <div className="absolute top-2 right-4 bg-slate-900/95 border border-emerald-400/40 px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md pointer-events-none text-xs text-white space-y-0.5 animate-fadeIn">
                <div className="text-emerald-300 font-semibold">Sensor Calibration Inspector</div>
                <div className="text-slate-300">
                  Actual: <span className="font-mono text-white">{hoveredPoint.actual}</span> | Predicted: <span className="font-mono text-cyan-300">{hoveredPoint.predicted}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: HOPSWORKS MLOPS TELEMETRY
         ========================================================================= */}
      <div className="space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <span>Hopsworks MLOps Telemetry</span>
          </h2>
          <button
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
            title="MLOps Telemetry Settings & Sync"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* 4 Telemetry Metric Cards Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: 17,520 Training Samples */}
          <div className="rounded-2xl bg-[#0a1824]/90 border border-teal-500/60 p-4 backdrop-blur-md flex items-center gap-3.5 shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-all hover:border-teal-400 hover:shadow-[0_0_25px_rgba(20,184,166,0.25)] animate-telemetry-stagger-1">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/40 text-teal-300">
              <Database size={20} />
            </div>
            <div>
              <div className="text-xl font-bold text-white tracking-tight font-mono">
                17,520
              </div>
              <div className="text-xs text-slate-400">
                Training Samples
              </div>
            </div>
          </div>

          {/* Card 2: Hopsworks Model Registry v2.1 */}
          <div className="rounded-2xl bg-[#0a1824]/90 border border-teal-500/60 p-4 backdrop-blur-md flex items-center gap-3.5 shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-all hover:border-teal-400 hover:shadow-[0_0_25px_rgba(20,184,166,0.25)] animate-telemetry-stagger-2">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/40 text-teal-300">
              <Box size={20} />
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-tight">
                Hopsworks
              </div>
              <div className="text-xs text-slate-400">
                Model Registry v2.1
              </div>
            </div>
          </div>

          {/* Card 3: Inference Latency: 12ms */}
          <div className="rounded-2xl bg-[#0a1824]/90 border border-teal-500/60 p-4 backdrop-blur-md flex items-center gap-3.5 shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-all hover:border-teal-400 hover:shadow-[0_0_25px_rgba(20,184,166,0.25)] animate-telemetry-stagger-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/40 text-teal-300">
              <Timer size={20} />
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-tight">
                Inference
              </div>
              <div className="text-xs text-slate-300">
                Latency: <span className="font-mono text-emerald-300 font-semibold">12ms</span>
              </div>
            </div>
          </div>

          {/* Card 4: GitHub Actions Serverless Cron: Active */}
          <div className="rounded-2xl bg-[#0a1824]/90 border border-teal-500/60 p-4 backdrop-blur-md flex items-center gap-3.5 shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-all hover:border-teal-400 hover:shadow-[0_0_25px_rgba(20,184,166,0.25)] animate-telemetry-stagger-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
              <GitBranch size={20} />
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-tight">
                GitHub Actions
              </div>
              <div className="text-xs text-emerald-300 flex items-center gap-1 font-medium">
                <span>Serverless Cron: Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
