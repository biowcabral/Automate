"use client";

import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    icon: "🤖",
    color: "from-purple-600 to-indigo-600",
    border: "border-purple-500/30",
    title: "AI-Powered Conversations",
    desc: "GPT-4o agents handle leads, answer questions, and close deals 24/7 — with human-level intelligence.",
    tags: ["NLP", "GPT-4o", "Voice"],
  },
  {
    icon: "⚡",
    color: "from-cyan-600 to-blue-600",
    border: "border-cyan-500/30",
    title: "Zero-Latency Triggers",
    desc: "React to every customer action in under 200ms. Webhooks, CRM events, form fills — all automated instantly.",
    tags: ["Webhooks", "Real-time", "REST API"],
  },
  {
    icon: "🔗",
    color: "from-green-600 to-teal-600",
    border: "border-green-500/30",
    title: "400+ Integrations",
    desc: "Connect your entire stack: HubSpot, Salesforce, Slack, WhatsApp, Stripe, Gmail, Notion and more.",
    tags: ["n8n", "Zapier", "Make"],
  },
  {
    icon: "📊",
    color: "from-amber-600 to-orange-600",
    border: "border-amber-500/30",
    title: "Live Analytics Dashboard",
    desc: "Track every workflow execution, monitor KPIs, and get AI-generated insights in real time.",
    tags: ["BI", "Metrics", "Reports"],
  },
  {
    icon: "🛡️",
    color: "from-rose-600 to-pink-600",
    border: "border-rose-500/30",
    title: "Enterprise-Grade Security",
    desc: "SOC 2, GDPR compliant. All data encrypted in transit and at rest. Role-based access control included.",
    tags: ["SOC 2", "GDPR", "Encryption"],
  },
  {
    icon: "🚀",
    color: "from-violet-600 to-purple-600",
    border: "border-violet-500/30",
    title: "Deploy in 48 Hours",
    desc: "Go from zero to fully automated in 2 days. Our engineers handle setup, testing, and go-live.",
    tags: ["Onboarding", "Support", "SLA"],
  },
];

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 px-6" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-green-400 font-mono text-sm tracking-widest uppercase">
            {"// capabilities.config"}
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-white">
            Built for{" "}
            <span className="grad-text">Serious Scale</span>
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`glass rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-300 cursor-default border ${f.border}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
              }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${f.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{f.desc}</p>
              <div className="flex flex-wrap gap-2">
                {f.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-slate-600 text-slate-400 font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
