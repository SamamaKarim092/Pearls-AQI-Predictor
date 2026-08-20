import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export default function PollutantBars({ current }) {
  const [activeModal, setActiveModal] = useState(null);

  const pm25 = current?.pm2_5 ?? 11.2;
  const pm10 = current?.pm10 ?? 28.4;
  const no2 = current?.nitrogen_dioxide ?? 14.1;
  const so2 = current?.sulphur_dioxide ?? 7.5;

  const pollutants = [
    {
      id: 'pm25',
      name: 'PM2.5',
      value: pm25,
      whoThreshold: 15.0,
      whoPos: 65, // % marker on bar
      fillPct: Math.min(100, Math.max(15, (pm25 / 25.0) * 100)),
      whoLabel: 'WHO guideline',
      fullName: 'Fine Particulate Matter (PM2.5)',
      description: 'Microscopic particles (<2.5 µm) that penetrate deep into lung alveoli and the bloodstream.',
    },
    {
      id: 'pm10',
      name: 'PM10',
      value: pm10,
      whoThreshold: 45.0,
      whoPos: 65,
      fillPct: Math.min(100, Math.max(15, (pm10 / 70.0) * 100)),
      whoLabel: 'WHO guideline',
      fullName: 'Coarse Particulate Matter (PM10)',
      description: 'Inhalable dust, pollen, and mold particles that irritate upper respiratory airways.',
    },
    {
      id: 'no2',
      name: 'NO2',
      value: no2,
      whoThreshold: 25.0,
      whoPos: 70,
      fillPct: Math.min(100, Math.max(15, (no2 / 40.0) * 100)),
      whoLabel: 'WHO',
      fullName: 'Nitrogen Dioxide (NO2)',
      description: 'Emissions from vehicular traffic and fossil fuel combustion causing airway inflammation.',
    },
    {
      id: 'so2',
      name: 'SO2',
      value: so2,
      whoThreshold: 40.0,
      whoPos: 55,
      fillPct: Math.min(100, Math.max(15, (so2 / 65.0) * 100)),
      whoLabel: 'WHO',
      fullName: 'Sulphur Dioxide (SO2)',
      description: 'Pungent gas emitted from heavy industrial power generation and fuel burning.',
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-between gap-3 w-full h-full min-h-[140px] rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-md">
        {pollutants.map((item) => (
          <div key={item.id} className="flex items-center gap-3 w-full">
            {/* Pollutant Name Label */}
            <span className="w-14 text-xs font-semibold text-slate-200 font-mono select-none">
              {item.name}
            </span>

            {/* Progress Bar Track with WHO Marker */}
            <div className="relative flex-1 h-2 rounded-full bg-slate-800/80 overflow-visible">
              {/* Active Gradient Fill Bar */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-500 shadow-[0_0_10px_rgba(45,212,191,0.35)]"
                style={{ width: `${item.fillPct}%` }}
              />

              {/* WHO Guideline Marker */}
              <div
                className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none"
                style={{ left: `${item.whoPos}%` }}
              >
                <span className="absolute -top-4 text-[9px] text-slate-400 whitespace-nowrap font-medium">
                  {item.whoLabel}
                </span>
                <span className="h-full w-[1.5px] bg-slate-400/80" />
              </div>
            </div>

            {/* Info Button */}
            <button
              onClick={() => setActiveModal(item)}
              className="text-slate-500 hover:text-sky-300 transition-colors p-1"
              title={`Details for ${item.name}`}
            >
              <Info size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Pollutant Detail Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-semibold text-white">{activeModal.fullName}</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 pt-3 text-xs text-slate-300">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-sky-400">
                  {typeof activeModal.value === 'number' ? activeModal.value.toFixed(1) : activeModal.value} µg/m³
                </span>
                <span className="text-slate-400">
                  WHO Limit: <b className="text-white">{activeModal.whoThreshold} µg/m³</b>
                </span>
              </div>
              <p className="leading-relaxed text-slate-300">{activeModal.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
