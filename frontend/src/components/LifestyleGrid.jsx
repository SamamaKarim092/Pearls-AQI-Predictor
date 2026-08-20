import React from 'react';

export default function LifestyleGrid({ actions }) {
  const cards = [
    {
      id: 'jogging',
      title: actions?.cardio?.status ?? 'Jogging Safe',
      src: '/jogging.svg',
      alt: 'Jogging Safe icon',
      sizeClass: 'w-12 h-12',
    },
    {
      id: 'windows',
      title: actions?.windows?.status ?? 'Open Windows',
      src: '/window.svg',
      alt: 'Open Windows icon',
      sizeClass: 'w-12 h-12',
    },
    {
      id: 'asthma',
      title: actions?.asthma?.status ?? 'Asthmatic Alert',
      src: '/lung.svg',
      alt: 'Asthmatic Alert icon',
      sizeClass: 'w-12 h-12',
    },
    {
      id: 'mask',
      title: actions?.mask?.status ?? 'Mask Advisory',
      src: '/mask.svg',
      alt: 'Mask Advisory icon',
      sizeClass: 'w-12 h-12',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 w-full h-full min-h-[310px]">
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-center backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-slate-900/60 group cursor-default select-none shadow-sm"
        >
          {/* SVG Icon Container */}
          <div className="flex h-16 w-16 items-center justify-center transition-all duration-300 group-hover:scale-105">
            <img
              src={card.src}
              alt={card.alt}
              className={`${card.sizeClass} object-contain transition-all duration-300 opacity-90 group-hover:opacity-100`}
              style={{
                filter: 'brightness(0) invert(1) drop-shadow(0 0 5px rgba(255,255,255,0.45))',
              }}
            />
          </div>
          <span className="mt-2 text-xs font-semibold tracking-wide text-slate-200 group-hover:text-white transition-colors duration-300">
            {card.title}
          </span>
        </div>
      ))}
    </div>
  );
}
