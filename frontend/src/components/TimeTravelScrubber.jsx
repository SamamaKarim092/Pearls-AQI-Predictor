import React, { useState, useRef } from 'react';
import { ChevronDown, MapPin, Clock, RotateCcw } from 'lucide-react';

export default function TimeTravelScrubber({
  timeline = [],
  currentIndex = 24,
  onChangeIndex,
  selectedCity = 'Karachi',
  onSelectCity,
  cities = ['Karachi', 'Lahore', 'Islamabad'],
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trackRef = useRef(null);

  const totalPoints = timeline.length > 0 ? timeline.length : 49;
  const maxVal = totalPoints - 1;
  const clampedIndex = Math.max(0, Math.min(maxVal, currentIndex));

  // Current item being scrubbed
  const currentItem = timeline[clampedIndex] || {
    hour_offset: 0,
    time_display: 'Live (Now)',
  };

  const hourOffset = currentItem.hour_offset ?? (clampedIndex - 24);

  // Formatted tooltip text matching user's request: present, back (past), and forward (forecast)
  const getTooltipText = () => {
    if (hourOffset === 0) {
      return 'Live (Now)';
    }
    if (hourOffset < 0) {
      return `${Math.abs(hourOffset)}h ago (Past)`;
    }
    return `+${hourOffset}h (Forecast)`;
  };

  // Percentage for tooltip and thumb positioning (0% to 100%)
  const percentage = maxVal > 0 ? (clampedIndex / maxVal) * 100 : 50;

  // 5 Major tick milestone labels across the 72h window
  const milestones = [
    { label: 'Past -24h', shortLabel: '-24h', pos: 0 },
    { label: 'Past -12h', shortLabel: '-12h', pos: Math.round(maxVal * 0.25) },
    { label: 'Live Now', shortLabel: 'Live', pos: Math.round(maxVal * 0.5) },
    { label: '+12h Next', shortLabel: '+12h', pos: Math.round(maxVal * 0.75) },
    { label: '+24h Next', shortLabel: '+24h', pos: maxVal },
  ];

  return (
    <div className="relative flex flex-col justify-between w-full h-full min-h-[175px] rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-md">
      {/* Top Header Row with Floating-aligned Tooltip and Date | Time Button */}
      <div className="relative flex items-center justify-between min-h-[38px]">
        {/* Left spacer / Reset to Now shortcut */}
        <div className="flex items-center gap-2">
          {hourOffset !== 0 && (
            <button
              onClick={() => onChangeIndex && onChangeIndex(Math.round(maxVal / 2))}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-[11px] font-medium text-sky-300 hover:bg-sky-500/25 transition-all cursor-pointer"
              title="Reset slider to Live Right Now"
            >
              <RotateCcw size={12} />
              <span>Reset to Now</span>
            </button>
          )}
        </div>

        {/* City | Time Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-white/10 text-xs font-medium text-slate-200 hover:text-white hover:border-white/20 transition-all cursor-pointer shadow-sm"
          >
            <span>City | Time</span>
            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* City / Time Selector Dropdown Popup */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/15 bg-slate-900/95 p-2.5 shadow-2xl backdrop-blur-xl z-30">
              <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <MapPin size={12} className="text-sky-400" />
                Select City
              </div>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    if (onSelectCity) onSelectCity(city);
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between w-full rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                    selectedCity === city
                      ? 'bg-sky-500/20 text-sky-300 font-semibold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{city}</span>
                  {selectedCity === city && <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />}
                </button>
              ))}

              <div className="my-1.5 border-t border-white/10" />

              <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <Clock size={12} className="text-emerald-400" />
                Time Jump
              </div>
              <button
                onClick={() => {
                  if (onChangeIndex) onChangeIndex(Math.round(maxVal / 2));
                  setDropdownOpen(false);
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-xs text-left text-emerald-300 hover:bg-emerald-500/15 transition-colors"
              >
                ● Jump to Live (Now)
              </button>
              <button
                onClick={() => {
                  if (onChangeIndex) onChangeIndex(maxVal);
                  setDropdownOpen(false);
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-xs text-left text-sky-300 hover:bg-sky-500/15 transition-colors"
              >
                ⏱️ Jump to +24h Forecast
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scrubber Slider Area with Floating Tooltip matching Reference Screenshot */}
      <div className="relative mt-5 pt-6 pb-2" ref={trackRef}>
        {/* Floating Tooltip Bubble following Thumb */}
        <div
          className="absolute -top-3 -translate-x-1/2 pointer-events-none transition-all duration-75 z-20"
          style={{ left: `${percentage}%` }}
        >
          <div className="relative px-2.5 sm:px-3 py-1 rounded-lg bg-slate-800/95 border border-white/15 text-[10px] sm:text-[11px] font-medium text-slate-100 whitespace-nowrap shadow-lg select-none">
            {getTooltipText()}
            {/* Tooltip Downward Caret Arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800/95" />
          </div>
        </div>

        {/* Custom Timeline Slider Track */}
        <div className="relative flex items-center w-full h-3">
          {/* Base Inactive Track */}
          <div className="absolute inset-x-0 h-2 rounded-full bg-slate-800/90 border border-white/5" />

          {/* Active Highlight Fill Track (from 0 to current thumb) */}
          <div
            className="absolute left-0 h-2 rounded-full bg-gradient-to-r from-slate-600 via-sky-500/60 to-sky-400"
            style={{ width: `${percentage}%` }}
          />

          {/* HTML5 Range Input (invisible native track, handles drag & touch smoothly) */}
          <input
            type="range"
            min={0}
            max={maxVal}
            value={clampedIndex}
            onChange={(e) => onChangeIndex && onChangeIndex(parseInt(e.target.value))}
            className="relative z-10 w-full h-3 opacity-0 cursor-pointer"
          />

          {/* Styled Glowing Hollow Circular Thumb */}
          <div
            className="absolute -translate-x-1/2 pointer-events-none z-10 flex items-center justify-center"
            style={{ left: `${percentage}%` }}
          >
            {/* Outer Radial Glow Halo */}
            <div className="absolute w-8 h-8 rounded-full bg-sky-400/35 blur-md" />
            {/* Hollow White Circle Thumb with Slate Inner */}
            <div className="w-4 h-4 rounded-full border-2 border-white bg-slate-900 shadow-md" />
          </div>
        </div>

        {/* Timeline Tick Markers (Aligned under slider track) */}
        <div className="relative flex justify-between w-full px-0.5 mt-2.5 pointer-events-none select-none">
          {Array.from({ length: 25 }).map((_, i) => {
            const isMajor = i % 6 === 0;
            return (
              <div
                key={i}
                className={`w-[1px] ${
                  isMajor ? 'h-3 bg-slate-400/80' : 'h-1.5 bg-slate-700/70'
                }`}
              />
            );
          })}
        </div>

        {/* Milestone Labels */}
        <div className="relative flex justify-between w-full mt-1.5 text-[9px] sm:text-[11px] text-slate-400 font-mono select-none">
          {milestones.map((m, idx) => {
            const isActive = Math.abs(clampedIndex - m.pos) < 3;
            return (
              <span
                key={idx}
                className={`cursor-pointer transition-colors ${
                  isActive ? 'text-white font-semibold drop-shadow-sm' : 'text-slate-400 hover:text-slate-300'
                }`}
                onClick={() => onChangeIndex && onChangeIndex(m.pos)}
              >
                <span className="sm:hidden">{m.shortLabel}</span>
                <span className="hidden sm:inline">{m.label}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
