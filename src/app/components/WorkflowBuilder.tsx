"use client";

import { useEffect, useRef, useState } from "react";

const NODES = [
  {
    id: 0, x: 80, y: 160, label: "Trigger", sublabel: "New Lead", icon: "⚡",
    color: "#a855f7", glow: "rgba(168,85,247,0.6)",
  },
  {
    id: 1, x: 280, y: 80, label: "CRM", sublabel: "HubSpot", icon: "🏢",
    color: "#22d3ee", glow: "rgba(34,211,238,0.6)",
  },
  {
    id: 2, x: 280, y: 240, label: "AI Qualify", sublabel: "GPT-4o", icon: "🤖",
    color: "#4ade80", glow: "rgba(74,222,128,0.6)",
  },
  {
    id: 3, x: 490, y: 80, label: "Email", sublabel: "Send Sequence", icon: "✉️",
    color: "#f59e0b", glow: "rgba(245,158,11,0.6)",
  },
  {
    id: 4, x: 490, y: 240, label: "WhatsApp", sublabel: "Auto Reply", icon: "💬",
    color: "#4ade80", glow: "rgba(74,222,128,0.6)",
  },
  {
    id: 5, x: 700, y: 160, label: "Analytics", sublabel: "Dashboard", icon: "📊",
    color: "#e879f9", glow: "rgba(232,121,249,0.6)",
  },
];

const EDGES = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 5 },
];

const NODE_W = 120;
const NODE_H = 56;

function getEdgePath(from: (typeof NODES)[0], to: (typeof NODES)[0]) {
  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y + NODE_H / 2;
  const cx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`;
}

export default function WorkflowBuilder() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const total = NODES.length + EDGES.length;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        let s = 0;
        const interval = setInterval(() => {
          setStep(s);
          s++;
          if (s >= total) clearInterval(interval);
        }, 280);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const nodeVisible = (i: number) => step >= i;
  const edgeVisible = (i: number) => step >= NODES.length + i;

  return (
    <section className="py-24 bg-grid relative overflow-hidden" id="workflow">
      {/* Section label */}
      <div className="text-center mb-16 px-6">
        <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">
          {"// automation_flow.n8n"}
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-white">
          Watch Your Automation{" "}
          <span className="grad-text">Come Alive</span>
        </h2>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto text-lg">
          Every lead is captured, qualified, nurtured and reported — entirely
          without human intervention.
        </p>
      </div>

      {/* Flow canvas */}
      <div ref={ref} className="relative mx-auto overflow-x-auto px-6" style={{ maxWidth: 900 }}>
        <svg
          viewBox="0 0 840 320"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ minWidth: 680, overflow: "visible" }}
        >
          <defs>
            <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#a855f7" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map((e, i) => {
            const fromNode = NODES[e.from];
            const toNode = NODES[e.to];
            const d = getEdgePath(fromNode, toNode);
            const len = 300;
            return (
              <path
                key={i}
                d={d}
                stroke={edgeVisible(i) ? "#a855f7" : "transparent"}
                strokeWidth={2}
                fill="none"
                strokeDasharray={len}
                strokeDashoffset={edgeVisible(i) ? 0 : len}
                markerEnd="url(#arrow)"
                filter="url(#glow-filter)"
                style={{
                  transition: edgeVisible(i) ? "stroke-dashoffset 0.7s ease" : "none",
                }}
              />
            );
          })}

          {/* Animated data packets on edges */}
          {EDGES.map((e, i) => {
            const fromNode = NODES[e.from];
            const toNode = NODES[e.to];
            const d = getEdgePath(fromNode, toNode);
            if (!edgeVisible(i)) return null;
            return (
              <circle key={`pkt-${i}`} r="4" fill="#22d3ee" filter="url(#glow-filter)">
                <animateMotion dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" path={d} />
              </circle>
            );
          })}

          {/* Nodes */}
          {NODES.map((node, i) => (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              style={{
                opacity: nodeVisible(i) ? 1 : 0,
                transform: `translate(${node.x}px, ${node.y}px) scale(${nodeVisible(i) ? 1 : 0.5})`,
                transformOrigin: `${node.x + NODE_W / 2}px ${node.y + NODE_H / 2}px`,
                transition: nodeVisible(i) ? "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)" : "none",
              }}
            >
              {/* Node bg */}
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={10}
                fill="#0f172a"
                stroke={node.color}
                strokeWidth={1.5}
                filter="url(#glow-filter)"
              />
              {/* Left accent bar */}
              <rect width={4} height={NODE_H} rx={2} fill={node.color} />
              {/* Icon */}
              <text x={18} y={34} fontSize={20} dominantBaseline="middle" textAnchor="middle">
                {node.icon}
              </text>
              {/* Label */}
              <text x={30} y={22} fill="white" fontSize={11} fontWeight="700" dominantBaseline="middle">
                {node.label}
              </text>
              <text x={30} y={38} fill="#94a3b8" fontSize={9} dominantBaseline="middle">
                {node.sublabel}
              </text>
              {/* Status dot */}
              <circle cx={NODE_W - 10} cy={10} r={4} fill="#4ade80">
                <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </svg>

        {/* Execution counter */}
        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          {[
            { label: "Triggered today", value: "12,480", color: "text-purple-400" },
            { label: "Avg. latency", value: "< 200ms", color: "text-cyan-400" },
            { label: "Success rate", value: "99.97%", color: "text-green-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl px-6 py-3 text-center">
              <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
