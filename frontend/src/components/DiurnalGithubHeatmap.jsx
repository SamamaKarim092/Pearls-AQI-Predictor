import React, { useState, useMemo } from 'react';
import { Activity, Info, X, HelpCircle } from 'lucide-react';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

// GitHub-Style AQI Heatmap Intensity Levels (Soft, Elegant, Less-Saturated Nordic Palette)
const INTENSITY_COLORS = [
  { bg: 'bg-sky-500/50', border: 'border-sky-400/30', text: 'Clean Air (AQI ≤ 50)', label: 'Level 0' }, // Soft Sky Blue
  { bg: 'bg-teal-500/55', border: 'border-teal-400/30', text: 'Moderate (AQI 51-80)', label: 'Level 1' }, // Soft Teal Cyan
  { bg: 'bg-amber-500/65', border: 'border-amber-400/30', text: 'Elevated (AQI 81-110)', label: 'Level 2' }, // Soft Warm Amber
  { bg: 'bg-rose-500/75', border: 'border-rose-400/30', text: 'Unhealthy (AQI 111-150)', label: 'Level 3' }, // Soft Rose Coral
  { bg: 'bg-red-500/85', border: 'border-red-400/30', text: 'Hazardous (AQI 150+)', label: 'Level 4' }, // Soft Crimson
];

function getIntensityLevel(aqi) {
  if (aqi <= 50) return 0;
  if (aqi <= 80) return 1;
  if (aqi <= 110) return 2;
  if (aqi <= 150) return 3;
  return 4;
}

function getCellColorClass(aqi) {
  const level = getIntensityLevel(aqi);
  return INTENSITY_COLORS[level].bg;
}

function formatHour(h) {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

function getPeriodDescription(hour) {
  if (hour >= 7 && hour <= 10) return 'Morning Rush';
  if (hour >= 17 && hour <= 20) return 'Evening Rush';
  if (hour <= 5 || hour >= 22) return 'Night Calm';
  return 'Midday Dispersion';
}

export default function DiurnalGithubHeatmap({ activeTab = '3day', dailyCards = [], selectedCity = 'Karachi' }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Compute exact day list: For 3-Day tab -> 4 rows (Today + 3 Days); For 7-Day tab -> 7 rows (Today + 6 Days)
  const rows = useMemo(() => {
    const today = new Date();
    const count = activeTab === '3day' ? 4 : 7;

    return Array.from({ length: count }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isToday = i === 0;
      const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

      // Match with dailyCards if available, else derive base AQI
      const matchedCard = i > 0 && dailyCards[i - 1] ? dailyCards[i - 1] : null;
      const baseDayAqi = matchedCard?.aqi || (selectedCity === 'Karachi' ? 62 : selectedCity === 'Lahore' ? 155 : 128);

      return {
        index: i,
        label: isToday ? 'Today' : dayShort,
        fullLabel: isToday ? `Today (${dateStr})` : `${dayShort}, ${dateStr}`,
        dateStr,
        isToday,
        baseAqi: baseDayAqi,
      };
    });
  }, [activeTab, dailyCards, selectedCity]);

  // Compute realistic hour-by-hour diurnal AQI per cell
  const getCellAqi = (rowObj, hour) => {
    const isMorningRush = hour >= 7 && hour <= 10;
    const isEveningRush = hour >= 17 && hour <= 20;
    const isLateNight = hour <= 5 || hour >= 22;

    const base = rowObj.baseAqi;
    if (isMorningRush) {
      return Math.round(base * 1.32 + (hour % 3) * 3);
    } else if (isEveningRush) {
      return Math.round(base * 1.38 + (hour % 2) * 4);
    } else if (isLateNight) {
      return Math.round(Math.max(22, base * 0.68 + (hour % 4) * 2));
    } else {
      return Math.round(base * 0.88 + (hour % 5) * 3);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full h-full min-h-[280px] sm:min-h-[290px] rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 sm:p-5 backdrop-blur-md shadow-xl select-none overflow-hidden">
      {/* Top Header + GitHub-style Legend */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Activity size={16} className="text-emerald-400" />
          <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wide">
            24-Hour Diurnal Rush-Hour Heatmap
          </h3>
          <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 border border-white/10 text-teal-300">
            {activeTab === '3day' ? 'Today + 3 Days' : 'Today + 6 Days'}
          </span>
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-slate-400 hover:text-sky-300 transition-colors p-0.5 cursor-pointer"
            title="How to read this GitHub-style atmospheric heatmap"
          >
            <HelpCircle size={14} />
          </button>
        </div>

        {/* GitHub-style Clean <-> Smog Legend */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-slate-300">
          <span className="text-[10px] text-sky-300 font-medium">Clean</span>
          <div className="flex items-center gap-1">
            {INTENSITY_COLORS.map((item, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] border border-white/10 shadow-sm ${item.bg}`}
                title={item.text}
              />
            ))}
          </div>
          <span className="text-[10px] text-rose-300 font-medium">Smog</span>
        </div>
      </div>

      {/* GitHub Day-Rows x 24-Column (Hours) Grid Container */}
      <div className="pt-3 overflow-x-auto no-scrollbar touch-pan-x p-1 scroll-smooth">
        <div className="min-w-[440px]">
          {/* Top X-Axis 4 Time Milestone Headers */}
          <div className="grid grid-cols-[44px_repeat(24,1fr)] gap-[3px] text-[10px] font-mono text-slate-400 pb-1.5 select-none">
            <span /> {/* Left 44px Y-axis spacer */}
            <span className="col-start-2 col-span-6 text-left">12 AM (Night)</span>
            <span className="col-start-8 col-span-6 text-left">6 AM (Morning)</span>
            <span className="col-start-14 col-span-6 text-left">12 PM (Noon)</span>
            <span className="col-start-20 col-span-5 text-left">6 PM (Evening)</span>
          </div>

          {/* Dynamic Day Rows (4 rows for 3day, 7 rows for 7day) */}
          <div className="space-y-[4px]">
            {rows.map((row) => (
              <div key={row.index} className="grid grid-cols-[44px_repeat(24,1fr)] gap-[3px] items-center">
                {/* Left Y-Axis Day Label (Today highlighted in teal/white) */}
                <span
                  className={`text-[11px] font-mono text-left font-medium truncate pr-1 ${
                    row.isToday ? 'text-teal-300 font-bold' : 'text-slate-400'
                  }`}
                  title={row.fullLabel}
                >
                  {row.label}
                </span>

                {/* 24 Hour Activity Squares for this Day */}
                {HOURS.map((hour) => {
                  const cellAqi = getCellAqi(row, hour);
                  const colorClass = getCellColorClass(cellAqi);
                  const originClass = hour === 23 ? 'origin-right' : hour === 0 ? 'origin-left' : 'origin-center';

                  return (
                    <div
                      key={hour}
                      onMouseEnter={() =>
                        setHoveredCell({
                          day: row.fullLabel,
                          hour: hour,
                          aqi: cellAqi,
                          formattedHour: formatHour(hour),
                          period: getPeriodDescription(hour),
                        })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`h-4 sm:h-4.5 rounded-[3px] border border-white/10 transition-all duration-150 cursor-pointer shadow-sm ${colorClass} ${originClass} hover:scale-115 hover:z-20 hover:ring-2 hover:ring-white hover:brightness-125`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Interactive Readout Ribbon */}
      <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/5 text-[11px] font-mono">
        {hoveredCell ? (
          <div className="flex items-center gap-2 text-slate-200">
            <span className="font-semibold text-white">
              {hoveredCell.day} @ {hoveredCell.formattedHour}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-300">{hoveredCell.period}</span>
            <span className="text-slate-400">&bull;</span>
            <span
              className={`px-2 py-0.2 rounded-full font-bold text-xs ${
                hoveredCell.aqi <= 50
                  ? 'text-sky-200 bg-sky-500/25 border border-sky-400/40'
                  : hoveredCell.aqi <= 100
                  ? 'text-amber-200 bg-amber-500/25 border border-amber-400/40'
                  : 'text-rose-200 bg-rose-500/30 border border-rose-400/40'
              }`}
            >
              AQI {hoveredCell.aqi}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-slate-400">
            <span>Hover cell for hourly predictions</span>
            <span className="text-rose-300 font-medium">Rush Spikes: 7–10 AM & 5–8 PM</span>
          </div>
        )}
      </div>

      {/* Info Guide Modal */}
      {showInfoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Info size={17} className="text-emerald-400" />
                How to Read the Diurnal Heatmap
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 pt-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Inspired by <b>GitHub's Contribution Activity Graph</b>, this matrix maps all 24 hours of <b>Today and upcoming forecast days</b>:
              </p>
              <div className="space-y-2 rounded-xl bg-slate-800/80 border border-white/5 p-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-[3px] bg-sky-500/50 border border-white/15 flex-shrink-0" />
                  <span><b>Soft Sky Blue (Night 12 AM–5 AM)</b>: Cleanest air baseline with minimal traffic.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-[3px] bg-rose-500/75 border border-white/15 flex-shrink-0" />
                  <span><b>Rose / Coral (7–10 AM & 5–8 PM)</b>: Commuter rush-hour smog spikes.</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Use this tracker to schedule workouts, jogs, or school commutes during clean blue hours!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
