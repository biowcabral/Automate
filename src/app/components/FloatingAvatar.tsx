"use client";

import { useEffect, useRef } from "react";

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  delay: i * 0.7,
  duration: 4 + (i % 3),
  left: 10 + ((i * 37) % 80),
  size: 3 + (i % 3),
}));

export default function FloatingAvatar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple waveform animation on canvas (simulates voice activity)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let frame = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 28;
      const barW = canvas.width / (bars * 2);
      ctx.fillStyle = "#a855f7";

      for (let i = 0; i < bars; i++) {
        const noise = Math.sin(frame * 0.12 + i * 0.6) * 0.5 + 0.5;
        const h = 4 + noise * (canvas.height - 8);
        const x = i * barW * 2 + barW / 2;
        const y = (canvas.height - h) / 2;
        const radius = barW / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, h, radius);
        ctx.fill();
      }
      frame++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96">
      {/* Outer glow rings */}
      <span className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping-slower" />
      <span className="absolute inset-6 rounded-full bg-purple-500/15 animate-ping-slow" />

      {/* Orbit dots */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <span
          key={deg}
          className="absolute w-2 h-2 rounded-full bg-cyan-400"
          style={{
            top: "50%",
            left: "50%",
            transform: `rotate(${deg}deg) translateX(130px) translateY(-50%)`,
            boxShadow: "0 0 8px #22d3ee",
            animation: `spin ${14 + deg / 30}s linear infinite`,
          }}
        />
      ))}

      {/* Floating card */}
      <div className="animate-float relative z-10">
        {/* Avatar circle */}
        <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full glass glow-purple flex flex-col items-center justify-center overflow-hidden">
          {/* Scan line effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, rgba(168,85,247,0.08) 50%, transparent 60%)",
            }}
          />

          {/* AI face SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 mb-1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Head */}
            <circle cx="50" cy="42" r="26" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
            {/* Eyes */}
            <ellipse cx="40" cy="38" rx="5" ry="6" fill="#22d3ee" opacity="0.9" />
            <ellipse cx="60" cy="38" rx="5" ry="6" fill="#22d3ee" opacity="0.9" />
            {/* Iris glow */}
            <circle cx="40" cy="38" r="2.5" fill="#fff" />
            <circle cx="60" cy="38" r="2.5" fill="#fff" />
            {/* Mouth - smile */}
            <path d="M40 52 Q50 58 60 52" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Headset */}
            <path d="M24 42 Q24 20 50 20 Q76 20 76 42" stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="18" y="40" width="9" height="14" rx="4" fill="#4ade80" />
            <rect x="73" y="40" width="9" height="14" rx="4" fill="#4ade80" />
            {/* Mic */}
            <line x1="50" y1="68" x2="50" y2="76" stroke="#a855f7" strokeWidth="2" />
            <rect x="44" y="57" width="12" height="14" rx="6" stroke="#a855f7" strokeWidth="1.8" fill="none" />
            <line x1="44" y1="76" x2="56" y2="76" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" />
          </svg>

          {/* Waveform canvas */}
          <canvas
            ref={canvasRef}
            width={100}
            height={22}
            className="rounded-full opacity-80"
            style={{ width: 100, height: 22 }}
          />
        </div>

        {/* Live badge */}
        <div className="absolute -top-2 -right-2 flex items-center gap-1.5 bg-green-500/20 border border-green-400/40 rounded-full px-3 py-1 text-green-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          LIVE AI
        </div>

        {/* Call status badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap glass text-xs px-4 py-1.5 rounded-full text-purple-300 border border-purple-500/30">
          📞 Handling 847 calls simultaneously
        </div>
      </div>

      {/* Particle dots */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="particle absolute bottom-0 rounded-full bg-purple-400 opacity-0 pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: `0 0 ${p.size * 2}px #a855f7`,
          }}
        />
      ))}
    </div>
  );
}
