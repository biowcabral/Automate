"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 2400, suffix: "+", label: "Automations Deployed", color: "text-purple-400" },
  { value: 99.97, suffix: "%", label: "Uptime SLA", color: "text-green-400", decimal: true },
  { value: 14, suffix: "M+", label: "Tasks Automated / mo", color: "text-cyan-400" },
  { value: 48, suffix: "h", label: "Time to Go Live", color: "text-amber-400" },
];

function useCountUp(target: number, active: boolean, decimal = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); return; }
      setVal(parseFloat(start.toFixed(decimal ? 2 : 0)));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, decimal]);
  return val;
}

function CountStat({ value, suffix, label, color, decimal = false }: (typeof STATS)[0] & { decimal?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, active, decimal);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center p-6">
      <p className={`text-4xl md:text-5xl font-extrabold ${color}`}>
        {decimal ? count.toFixed(2) : count.toLocaleString()}{suffix}
      </p>
      <p className="text-slate-400 text-sm mt-2 font-medium">{label}</p>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="py-8 border-y border-slate-800">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-800">
        {STATS.map((s) => (
          <CountStat key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
