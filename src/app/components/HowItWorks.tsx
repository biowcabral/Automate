"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    num: "01",
    icon: "🔍",
    color: "border-orange-500 bg-orange-500/10",
    numColor: "text-orange-400",
    title: "Discovery Call",
    desc: "We map every manual task in your business — emails, follow-ups, reports, scheduling — and identify the highest-ROI automation opportunities.",
    detail: "Avg.: 2-hour session",
  },
  {
    num: "02",
    icon: "🗺️",
    color: "border-blue-500 bg-blue-500/10",
    numColor: "text-blue-400",
    title: "Blueprint & Architect",
    desc: "Our engineers design a custom automation architecture tailored to your tech stack, data flows, and compliance requirements.",
    detail: "Delivered in 24h",
  },
  {
    num: "03",
    icon: "⚙️",
    color: "border-white bg-white/5",
    numColor: "text-white",
    title: "Build & Integrate",
    desc: "We build n8n/Make workflows, connect APIs, fine-tune AI agents, and test every edge case before touching production.",
    detail: "Sprint: 3–5 days",
  },
  {
    num: "04",
    icon: "🚀",
    color: "border-orange-400 bg-orange-400/10",
    numColor: "text-orange-300",
    title: "Go Live & Monitor",
    desc: "Flip the switch. Your automations run 24/7 while we monitor, optimize, and alert you before any issues arise.",
    detail: "Live in 48h",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 bg-slate-950/60" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-400 font-mono text-sm tracking-widest uppercase">
            {"// process.timeline"}
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-white">
            From Idea to{" "}
            <span className="grad-text">Running in 48h</span>
          </h2>
        </div>

        <div ref={ref} className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-8 md:left-1/2 top-0 w-px bg-linear-to-b from-orange-500 via-blue-500 to-orange-300"
            style={{
              height: visible ? "100%" : "0%",
              transition: "height 1.5s ease",
              transform: "translateX(-50%)",
            }}
          />

          <div className="flex flex-col gap-12">
            {STEPS.map((step, i) => {
              const isRight = i % 2 === 1;
              return (
                <div
                  key={step.num}
                  className={`relative flex items-center gap-8 ${isRight ? "md:flex-row-reverse" : "md:flex-row"} flex-row`}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible
                      ? "translateX(0)"
                      : `translateX(${isRight ? "40px" : "-40px"})`,
                    transition: `opacity 0.6s ease ${i * 0.18}s, transform 0.6s ease ${i * 0.18}s`,
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 w-16 h-16 rounded-full border-2 ${step.color} flex items-center justify-center text-2xl shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2`}
                    style={{ boxShadow: `0 0 20px ${step.numColor.replace("text-", "").includes("purple") ? "rgba(168,85,247,0.4)" : "rgba(34,211,238,0.4)"}` }}
                  >
                    {step.icon}
                  </div>

                  {/* Card */}
                  <div className={`glass rounded-2xl p-6 flex-1 ${isRight ? "md:mr-[calc(50%+3rem)]" : "md:ml-[calc(50%+3rem)]"} ml-4`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`font-mono font-bold text-lg ${step.numColor}`}>{step.num}</span>
                      <h3 className="text-white font-bold text-xl">{step.title}</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                    <div className={`mt-3 text-xs font-mono ${step.numColor} opacity-70`}>→ {step.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
