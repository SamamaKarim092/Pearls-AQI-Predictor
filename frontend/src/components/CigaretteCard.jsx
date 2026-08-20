import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export default function CigaretteCard({ cigarettes = 0.5, pm25 = 11.2 }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="relative flex flex-col justify-between w-full h-full min-h-[290px] rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md">
        {/* Card Title */}
        <div className="text-sm font-medium tracking-wide text-slate-200">
          Cigarette Equivalent
        </div>

        {/* Center Visual: Lit Cigarette Graphic with Smoke */}
        <div className="relative flex flex-col items-center justify-center my-auto py-2">
          {/* Animated Rising Smoke */}
          <div className="absolute -top-12 left-10 w-24 h-20 pointer-events-none opacity-60">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-smoke-drift">
              <path
                d="M 35,90 Q 20,65 35,45 T 30,15 T 50,2"
                stroke="rgba(203, 213, 225, 0.55)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                style={{ filter: 'blur(3px)' }}
              />
            </svg>
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 animate-smoke-drift" style={{ animationDelay: '2s' }}>
              <path
                d="M 45,95 Q 60,70 42,48 T 52,18 T 38,5"
                stroke="rgba(148, 163, 184, 0.4)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                style={{ filter: 'blur(4px)' }}
              />
            </svg>
          </div>

          {/* Cigarette Vector Assembly */}
          <div className="relative flex items-center shadow-2xl">
            {/* Glowing Burning Ash Ember */}
            <div className="relative flex items-center justify-center w-4 h-5 rounded-l-sm bg-gradient-to-r from-neutral-800 to-neutral-700 border-r border-orange-500/40">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 blur-[1px] animate-pulse" />
              {/* Soft glow halo */}
              <div className="absolute -left-2 w-6 h-6 rounded-full bg-orange-500/40 blur-md pointer-events-none" />
            </div>

            {/* White Paper Cylinder */}
            <div className="w-28 h-5 bg-gradient-to-b from-slate-100 via-white to-slate-200 shadow-inner" />

            {/* Cork Filter */}
            <div className="w-14 h-5 rounded-r-sm bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 border-l border-amber-800/40" />
          </div>
        </div>

        {/* Bottom Numeric Metric & Info Trigger */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold tracking-tight text-white font-mono">
            {typeof cigarettes === 'number' ? cigarettes.toFixed(1) : cigarettes}
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 hover:text-sky-300 transition-colors group cursor-pointer"
          >
            <span>Cigarettes / Day</span>
            <Info size={13} className="text-slate-500 group-hover:text-sky-300 transition-colors" />
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Info size={16} className="text-sky-400" />
                Berkeley Earth Cigarette Rule
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 pt-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Calculated by physicists <b>Richard & Elizabeth Muller at Berkeley Earth</b>:
                Breathing <b>22 µg/m³ of PM2.5</b> over 24 hours equals the fine particulate mass inhaled from <b>1 smoked cigarette</b>.
              </p>
              <div className="rounded-lg bg-black/40 border border-white/5 p-3 text-center font-mono text-sky-300">
                Cigarettes / Day = PM2.5 (µg/m³) ÷ 22.0
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
