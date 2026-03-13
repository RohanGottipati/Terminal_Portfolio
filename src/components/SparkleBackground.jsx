import React, { useMemo, useRef } from 'react';

const SPARKLE_COUNT = 48;
const COLORS = [
  'rgba(167, 243, 208, 0.7)',  // greenish-white
  'rgba(196, 181, 253, 0.7)',  // purple
  'rgba(254, 202, 202, 0.6)',  // pink
  'rgba(191, 219, 254, 0.7)',  // blue
];

const SparkleBackground = ({ className = '', mouse = { x: 0.5, y: 0.5 } }) => {
  const containerRef = useRef(null);

  const sparkles = useMemo(() => {
    return Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      color: COLORS[i % COLORS.length],
    }));
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden
    >
      {/* Base gradient — dark indigo/blue */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(49, 46, 129, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 60% 80% at 80% 80%, rgba(30, 58, 95, 0.2) 0%, transparent 50%),
            linear-gradient(180deg, #1e1b4b 0%, #0f172a 40%, #020617 100%)
          `,
        }}
      />

      {/* Subtle noise grain */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Interactive sparkles */}
      {sparkles.map((s) => {
        const dx = (mouse.x - 0.5) * 20;
        const dy = (mouse.y - 0.5) * 20;
        const dist = Math.hypot(s.x / 100 - mouse.x, s.y / 100 - mouse.y);
        const pull = Math.max(0, 1 - dist * 2) * 8;

        return (
          <div
            key={s.id}
            className="absolute rounded-full animate-sparkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              background: s.color,
              boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
              transform: `translate(${dx * pull}px, ${dy * pull}px) scale(1)`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default SparkleBackground;
