"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CX = 500, CY = 390;
const R_AI   = 105;  // AI/ML core ring
const R_DATA = 195;  // Data pipeline ring
const R_BIZ  = 290;  // Business sectors ring
const R_TOOL = 390;  // External tools ring

function radial(r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}
function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
function ease(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function local(progress: number, start: number, end: number) {
  return ease(clamp01((progress - start) / (end - start)));
}

// Layer 1  AI / ML Core (4 nodes, inner ring)
const AI_NODES = [
  { id: "llm",    label: "LLM Engine",   sub: "GPT / Claude",  angle: 0,   color: "#F97316", icon: "" },
  { id: "mlpred", label: "ML Predictor", sub: "Scoring",       angle: 90,  color: "#A78BFA", icon: "" },
  { id: "nlp",    label: "NLP Parser",   sub: "Intent & NER",  angle: 180, color: "#38BDF8", icon: "" },
  { id: "vision", label: "Vision AI",    sub: "OCR & Image",   angle: 270, color: "#34D399", icon: "" },
].map(n => ({ ...n, ...radial(R_AI, n.angle) }));

// Layer 2  Data & Integration Pipeline (8 nodes)
const DATA_NODES = [
  { id: "ingest",    label: "Data Ingest",    sub: "ETL / CDC",      angle: 0,   color: "#60A5FA", icon: "" },
  { id: "stream",    label: "Event Stream",   sub: "Kafka / Queue",  angle: 45,  color: "#F472B6", icon: "" },
  { id: "vectordb",  label: "Vector DB",      sub: "Embeddings",     angle: 90,  color: "#A78BFA", icon: "" },
  { id: "featstore", label: "Feature Store",  sub: "ML Features",    angle: 135, color: "#FCD34D", icon: "" },
  { id: "modelreg",  label: "Model Registry", sub: "Versioning",     angle: 180, color: "#34D399", icon: "" },
  { id: "inferapi",  label: "Inference API",  sub: "REST / gRPC",    angle: 225, color: "#F97316", icon: "" },
  { id: "monitor",   label: "AI Monitor",     sub: "Drift & Alerts", angle: 270, color: "#FB923C", icon: "" },
  { id: "feedback",  label: "Feedback Loop",  sub: "RLHF / Retrain", angle: 315, color: "#86EFAC", icon: "" },
].map(n => ({ ...n, ...radial(R_DATA, n.angle) }));

// Layer 3  Business Sectors
const SECTORS = [
  { id: "crm",       label: "CRM",         sub: "Sales",       angle: 0,   color: "#60A5FA", icon: "" },
  { id: "finance",   label: "Finance",     sub: "Accounting",  angle: 45,  color: "#34D399", icon: "" },
  { id: "ecomm",     label: "E-commerce",  sub: "Orders",      angle: 90,  color: "#F472B6", icon: "" },
  { id: "inventory", label: "Inventory",   sub: "Stock & WMS", angle: 135, color: "#A78BFA", icon: "" },
  { id: "postsales", label: "After-Sales", sub: "Support",     angle: 180, color: "#FB923C", icon: "" },
  { id: "marketing", label: "Marketing",   sub: "Campaigns",   angle: 225, color: "#38BDF8", icon: "" },
  { id: "admin",     label: "Admin",       sub: "Operations",  angle: 270, color: "#FCD34D", icon: "" },
  { id: "hr",        label: "HR & People", sub: "Workforce",   angle: 315, color: "#86EFAC", icon: "" },
].map(s => ({ ...s, ...radial(R_BIZ, s.angle) }));

// Layer 4  External tools (outermost)
const TOOLS = [
  { id: "crm_cloud",  label: "CRM Cloud",  sub: "Pipeline",   sector: "crm",       angle: 0   },
  { id: "accounting", label: "Accounting", sub: "Invoicing",  sector: "finance",   angle: 45  },
  { id: "storefront", label: "Storefront", sub: "Checkout",   sector: "ecomm",     angle: 90  },
  { id: "erp",        label: "ERP System", sub: "WMS",        sector: "inventory", angle: 135 },
  { id: "helpdesk",   label: "Help Desk",  sub: "Tickets",    sector: "postsales", angle: 180 },
  { id: "emailmkt",   label: "Email Mktg", sub: "Sequences",  sector: "marketing", angle: 225 },
  { id: "workspace",  label: "Workspace",  sub: "Docs & Ops", sector: "admin",     angle: 270 },
  { id: "hrsys",      label: "HR System",  sub: "Payroll",    sector: "hr",        angle: 315 },
].map(t => ({ ...t, ...radial(R_TOOL, t.angle) }));

// AI nodes -> relevant business sectors (semantic cross connections)
const AI_BIZ_CROSS = [
  { from: "llm",    to: "crm",       label: "Lead scoring"  },
  { from: "llm",    to: "marketing", label: "Copy gen"       },
  { from: "mlpred", to: "finance",   label: "Forecast"       },
  { from: "mlpred", to: "inventory", label: "Demand ML"      },
  { from: "nlp",    to: "postsales", label: "Sentiment"      },
  { from: "vision", to: "ecomm",     label: "Visual search"  },
];

// Data nodes -> AI nodes (data feeds AI)
const DATA_AI_CROSS = [
  { from: "vectordb",  to: "llm"     },
  { from: "featstore", to: "mlpred"  },
  { from: "stream",    to: "nlp"     },
  { from: "ingest",    to: "vision"  },
  { from: "inferapi",  to: "llm"     },
  { from: "feedback",  to: "mlpred"  },
  { from: "monitor",   to: "llm"     },
];

// Sector cross-connections
const SEC_CROSS = [
  { from: "crm",       to: "finance",   label: "Invoice trigger" },
  { from: "crm",       to: "marketing", label: "Lead sync"       },
  { from: "inventory", to: "ecomm",     label: "Stock sync"      },
  { from: "ecomm",     to: "postsales", label: "Order fulfilled" },
  { from: "postsales", to: "crm",       label: "Re-engage"       },
  { from: "finance",   to: "admin",     label: "Expense report"  },
  { from: "marketing", to: "hr",        label: "Headcount req."  },
];

const aiMap   = Object.fromEntries(AI_NODES.map(n => [n.id, n]));
const dataMap = Object.fromEntries(DATA_NODES.map(n => [n.id, n]));
const secMap  = Object.fromEntries(SECTORS.map(s => [s.id, s]));

// Timeline progress thresholds
const P = {
  HUB_IN:              [0.00, 0.09] as [number, number],
  AI_SPOKE_START:       0.09,
  AI_SPOKE_STRIDE:      0.04,
  AI_NODE_DELAY:        0.04,
  DATA_START:           0.33,
  DATA_STRIDE:          0.027,
  DATA_AI_CROSS_START:  0.46,
  DATA_AI_CROSS_STRIDE: 0.025,
  SECTOR_START:         0.56,
  SECTOR_STRIDE:        0.024,
  AI_BIZ_START:         0.66,
  AI_BIZ_STRIDE:        0.025,
  TOOL_START:           0.76,
  TOOL_STRIDE:          0.019,
  SEC_CROSS_START:      0.86,
  SEC_CROSS_STRIDE:     0.019,
  PACKETS:              0.93,
};

const LARGE = 900;
function sd(t: number) {
  return { strokeDasharray: LARGE, strokeDashoffset: LARGE * (1 - t) };
}

export default function WorkflowBuilder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setProgress(clamp01(-rect.top / (el.offsetHeight - window.innerHeight)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const hubT    = local(progress, ...P.HUB_IN);
  const pkts    = progress >= P.PACKETS;

  // Scroll-driven zoom: diagram starts small and grows as if jumping out of the screen
  const zoom = 0.36 + ease(progress) * 0.90; // 0.36 → 1.26
  // Subtle vertical drift toward viewer (pushes up slightly as it grows)
  const driftY = (1 - zoom) * 18;

  function aiSpokeT(i: number)    { const s = P.AI_SPOKE_START    + i * P.AI_SPOKE_STRIDE;      return local(progress, s, s + 0.10); }
  function aiNodeT(i: number)     { const s = P.AI_SPOKE_START    + i * P.AI_SPOKE_STRIDE + P.AI_NODE_DELAY; return local(progress, s, s + 0.10); }
  function dataSpokeT(i: number)  { const s = P.DATA_START        + i * P.DATA_STRIDE - 0.02;   return local(progress, s, s + 0.10); }
  function dataNodeT(i: number)   { const s = P.DATA_START        + i * P.DATA_STRIDE;           return local(progress, s, s + 0.10); }
  function dataAiT(i: number)     { const s = P.DATA_AI_CROSS_START + i * P.DATA_AI_CROSS_STRIDE;return local(progress, s, s + 0.09); }
  function secSpokeT(i: number)   { const s = P.SECTOR_START      + i * P.SECTOR_STRIDE - 0.02; return local(progress, s, s + 0.10); }
  function secNodeT(i: number)    { const s = P.SECTOR_START      + i * P.SECTOR_STRIDE;         return local(progress, s, s + 0.10); }
  function aiBizT(i: number)      { const s = P.AI_BIZ_START      + i * P.AI_BIZ_STRIDE;        return local(progress, s, s + 0.08); }
  function toolT(i: number)       { const s = P.TOOL_START        + i * P.TOOL_STRIDE;           return local(progress, s, s + 0.08); }
  function secCrossT(i: number)   { const s = P.SEC_CROSS_START   + i * P.SEC_CROSS_STRIDE;      return local(progress, s, s + 0.08); }

  // Find nearest node in a layer by angle
  function nearestByAngle<T extends { angle: number }>(nodes: T[], targetAngle: number): T {
    return nodes.reduce((best, n) => {
      const diff = Math.abs(((targetAngle - n.angle + 180) % 360) - 180);
      const bdiff = Math.abs(((targetAngle - best.angle + 180) % 360) - 180);
      return diff < bdiff ? n : best;
    });
  }

  const showAiLabels  = progress >= 0.20;
  const showDataLabels = progress >= 0.40;
  const showSecLabels  = progress >= 0.62;

  return (
    <section id="workflow" ref={sectionRef} style={{ height: "540vh", position: "relative" }}>
      <div
        style={{
          position: "sticky", top: 0, height: "100vh", overflow: "hidden",
          display: "flex", flexDirection: "column",
          background: "linear-gradient(to bottom, #070B12, #0a1220)",
        }}
        className="bg-grid"
      >
        {/* Header */}
        <div className="text-center px-6 pt-5" style={{ flexShrink: 0 }}>
          <span className="text-orange-400 font-mono text-xs tracking-widest uppercase">
            {"// enterprise_ai_fabric.n8n"}
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-white leading-tight">
            AI at the Core.{" "}
            <span className="grad-text">Automation at Scale.</span>
          </h2>
          <p className="mt-1 text-slate-400 max-w-lg mx-auto text-sm">
            ML models, LLMs, and data pipelines connecting every department  from raw signal to real business action.
          </p>
        </div>

        {/* SVG canvas */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${zoom}) translateY(${driftY}px)`,
            transformOrigin: "center center",
            willChange: "transform",
          }}>
          <svg
            viewBox="55 -15 890 800"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%", maxHeight: "calc(100vh - 150px)", overflow: "visible" }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="wf-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="wf-glow-sm" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <radialGradient id="hub-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.95"/>
                <stop offset="100%" stopColor="#c2410c" stopOpacity="1"/>
              </radialGradient>
              <marker id="arr-o" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(249,115,22,0.8)"/>
              </marker>
              <marker id="arr-v" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(167,139,250,0.8)"/>
              </marker>
              <marker id="arr-b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(96,165,250,0.8)"/>
              </marker>
            </defs>

            {/* Ambient concentric glow rings */}
            <circle cx={CX} cy={CY} r={R_TOOL+34} fill="none" stroke="rgba(249,115,22,0.025)" strokeWidth={64} style={{ opacity: hubT }}/>
            <circle cx={CX} cy={CY} r={R_BIZ+22}  fill="none" stroke="rgba(96,165,250,0.03)"  strokeWidth={44} style={{ opacity: hubT }}/>
            <circle cx={CX} cy={CY} r={R_DATA+14} fill="none" stroke="rgba(167,139,250,0.05)" strokeWidth={26} style={{ opacity: hubT }}/>
            <circle cx={CX} cy={CY} r={R_AI+10}   fill="none" stroke="rgba(249,115,22,0.07)"  strokeWidth={18} style={{ opacity: hubT }}/>

            {/* === SPOKES: Hub  AI ring === */}
            {AI_NODES.map((n, i) => {
              const t = aiSpokeT(i);
              if (t === 0) return null;
              return <line key={`as-${n.id}`} x1={CX} y1={CY} x2={n.x} y2={n.y}
                stroke={n.color} strokeWidth={1.5} strokeOpacity={0.55} style={sd(t)}/>;
            })}

            {/* === SPOKES: AI ring  Data ring (nearest angle) === */}
            {DATA_NODES.map((n, i) => {
              const t = dataSpokeT(i);
              if (t === 0) return null;
              const src = nearestByAngle(AI_NODES, n.angle);
              return <line key={`ds-${n.id}`} x1={src.x} y1={src.y} x2={n.x} y2={n.y}
                stroke={n.color} strokeWidth={1} strokeOpacity={0.28} style={sd(t)}/>;
            })}

            {/* === SPOKES: Data ring  Sector ring (nearest angle) === */}
            {SECTORS.map((s, i) => {
              const t = secSpokeT(i);
              if (t === 0) return null;
              const src = nearestByAngle(DATA_NODES, s.angle);
              return <line key={`ss-${s.id}`} x1={src.x} y1={src.y} x2={s.x} y2={s.y}
                stroke={s.color} strokeWidth={1} strokeOpacity={0.25} style={sd(t)}/>;
            })}

            {/* === EDGES: Sector  Tool (dashed) === */}
            {TOOLS.map((tool, i) => {
              const t = toolT(i);
              if (t === 0) return null;
              const sec = secMap[tool.sector];
              return <line key={`te-${tool.id}`} x1={sec.x} y1={sec.y} x2={tool.x} y2={tool.y}
                stroke={sec.color} strokeWidth={0.8} strokeOpacity={0.2} strokeDasharray="4 4" style={{ opacity: t }}/>;
            })}

            {/* === DATA  AI cross connections (curved, purple) === */}
            {DATA_AI_CROSS.map((c, i) => {
              const t = dataAiT(i);
              if (t === 0) return null;
              const d = dataMap[c.from];
              const a = aiMap[c.to];
              const bx = (d.x + a.x) / 2 + (CX - (d.x + a.x) / 2) * 0.15;
              const by = (d.y + a.y) / 2 + (CY - (d.y + a.y) / 2) * 0.15;
              return (
                <path key={`dac-${i}`}
                  d={`M ${d.x} ${d.y} Q ${bx} ${by} ${a.x} ${a.y}`}
                  fill="none" stroke="rgba(167,139,250,0.55)" strokeWidth={1.3}
                  markerEnd="url(#arr-v)"
                  style={{ ...sd(t), filter: "url(#wf-glow-sm)" }}
                />
              );
            })}

            {/* === AI  Business cross connections (orange, with label) === */}
            {AI_BIZ_CROSS.map((c, i) => {
              const t = aiBizT(i);
              if (t === 0) return null;
              const a = aiMap[c.from];
              const b = secMap[c.to];
              const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
              const dx = mx - CX, dy = my - CY;
              const len = Math.hypot(dx, dy) || 1;
              const bx = mx + (dx / len) * 28, by2 = my + (dy / len) * 28;
              return (
                <g key={`abc-${i}`}>
                  <path d={`M ${a.x} ${a.y} Q ${bx} ${by2} ${b.x} ${b.y}`}
                    fill="none" stroke="rgba(249,115,22,0.6)" strokeWidth={1.5}
                    markerEnd="url(#arr-o)"
                    style={{ ...sd(t), filter: "url(#wf-glow-sm)" }}
                  />
                  {t > 0.72 && (
                    <g style={{ opacity: (t - 0.72) * 3.6 }}>
                      <rect x={bx - 28} y={by2 - 8} width={56} height={14} rx={5}
                        fill="rgba(7,11,18,0.9)" stroke="rgba(249,115,22,0.3)" strokeWidth={0.8}/>
                      <text x={bx} y={by2 + 0.5} textAnchor="middle" fill="#94a3b8" fontSize={6.5} dominantBaseline="middle">{c.label}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* === Sector cross-connections (blue) === */}
            {SEC_CROSS.map((c, i) => {
              const t = secCrossT(i);
              if (t === 0) return null;
              const a = secMap[c.from];
              const b = secMap[c.to];
              const bx = ((a.x + b.x) / 2 + CX) / 2;
              const by = ((a.y + b.y) / 2 + CY) / 2;
              return (
                <g key={`sc-${i}`}>
                  <path d={`M ${a.x} ${a.y} Q ${bx} ${by} ${b.x} ${b.y}`}
                    fill="none" stroke="rgba(96,165,250,0.45)" strokeWidth={1.3}
                    markerEnd="url(#arr-b)"
                    style={{ ...sd(t), filter: "url(#wf-glow-sm)" }}
                  />
                  {t > 0.72 && (
                    <g style={{ opacity: (t - 0.72) * 3.6 }}>
                      <rect x={bx - 26} y={by - 7} width={52} height={13} rx={4}
                        fill="rgba(7,11,18,0.9)" stroke="rgba(96,165,250,0.2)" strokeWidth={0.7}/>
                      <text x={bx} y={by + 0.5} textAnchor="middle" fill="#64748b" fontSize={6} dominantBaseline="middle">{c.label}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* === DATA PACKETS === */}
            {pkts && AI_NODES.map((n, i) => (
              <circle key={`pk-ai-${n.id}`} r="2.5" fill={n.color} opacity={0.9} filter="url(#wf-glow-sm)">
                <animateMotion dur={`${1.2 + i * 0.18}s`} repeatCount="indefinite" path={`M ${CX} ${CY} L ${n.x} ${n.y}`}/>
              </circle>
            ))}
            {pkts && DATA_NODES.map((n, i) => {
              const src = nearestByAngle(AI_NODES, n.angle);
              return (
                <circle key={`pk-data-${n.id}`} r="2" fill={n.color} opacity={0.75} filter="url(#wf-glow-sm)">
                  <animateMotion dur={`${1.7 + i * 0.14}s`} repeatCount="indefinite" path={`M ${src.x} ${src.y} L ${n.x} ${n.y}`}/>
                </circle>
              );
            })}
            {pkts && AI_BIZ_CROSS.map((c, i) => {
              const a = aiMap[c.from];
              const b = secMap[c.to];
              return (
                <circle key={`pk-abc-${i}`} r="2" fill="#F97316" opacity={0.7} filter="url(#wf-glow-sm)">
                  <animateMotion dur={`${2.4 + i * 0.22}s`} repeatCount="indefinite" path={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}/>
                </circle>
              );
            })}

            {/* === TOOL NODES (outermost) === */}
            {TOOLS.map((tool, i) => {
              const t = toolT(i);
              if (t === 0) return null;
              const sec = secMap[tool.sector];
              return (
                <g key={`tool-${tool.id}`} style={{ opacity: t, transform: `scale(${0.5 + 0.5 * t})`, transformOrigin: `${tool.x}px ${tool.y}px` }}>
                  <circle cx={tool.x} cy={tool.y} r={24} fill="#0D1B31" stroke={sec.color} strokeWidth={0.8} strokeOpacity={0.35}/>
                  <text x={tool.x} y={tool.y - 4} textAnchor="middle" fill="white" fontSize={8.5} fontWeight="600" dominantBaseline="middle">{tool.label}</text>
                  <text x={tool.x} y={tool.y + 7} textAnchor="middle" fill="#475569" fontSize={7} dominantBaseline="middle">{tool.sub}</text>
                </g>
              );
            })}

            {/* === SECTOR NODES (business layer) === */}
            {SECTORS.map((s, i) => {
              const t = secNodeT(i);
              if (t === 0) return null;
              const r = 32;
              return (
                <g key={`sec-${s.id}`} style={{ opacity: t, transform: `scale(${0.4 + 0.6 * t})`, transformOrigin: `${s.x}px ${s.y}px` }}>
                  <circle cx={s.x} cy={s.y} r={r + 7} fill={s.color} opacity={0.06}/>
                  <circle cx={s.x} cy={s.y} r={r} fill="#0E1C30" stroke={s.color} strokeWidth={1.8} filter="url(#wf-glow-sm)"/>
                  <text x={s.x} y={s.y - 7} textAnchor="middle" fontSize={15} dominantBaseline="middle">{s.icon}</text>
                  {showSecLabels && <>
                    <text x={s.x} y={s.y + 8}  textAnchor="middle" fill="white"   fontSize={9}   fontWeight="700" dominantBaseline="middle">{s.label}</text>
                    <text x={s.x} y={s.y + 18} textAnchor="middle" fill="#64748b" fontSize={7}   dominantBaseline="middle">{s.sub}</text>
                  </>}
                  {pkts && (
                    <circle cx={s.x} cy={s.y} r={r} fill="none" stroke={s.color} strokeWidth={1.5} opacity={0.28}>
                      <animate attributeName="r" values={`${r};${r + 11};${r}`} dur={`${2.2 + i * 0.22}s`} repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.28;0;0.28" dur={`${2.2 + i * 0.22}s`} repeatCount="indefinite"/>
                    </circle>
                  )}
                </g>
              );
            })}

            {/* === DATA PIPELINE NODES (middle ring, dashed border) === */}
            {DATA_NODES.map((n, i) => {
              const t = dataNodeT(i);
              if (t === 0) return null;
              const r = 27;
              return (
                <g key={`data-${n.id}`} style={{ opacity: t, transform: `scale(${0.4 + 0.6 * t})`, transformOrigin: `${n.x}px ${n.y}px` }}>
                  <circle cx={n.x} cy={n.y} r={r + 5} fill={n.color} opacity={0.06}/>
                  <circle cx={n.x} cy={n.y} r={r} fill="#0B172A" stroke={n.color} strokeWidth={1.4} strokeDasharray="3 2"/>
                  <text x={n.x} y={n.y - 5} textAnchor="middle" fontSize={13} dominantBaseline="middle">{n.icon}</text>
                  {showDataLabels && <>
                    <text x={n.x} y={n.y + 7}  textAnchor="middle" fill="white"   fontSize={7.5} fontWeight="600" dominantBaseline="middle">{n.label}</text>
                    <text x={n.x} y={n.y + 16} textAnchor="middle" fill="#475569" fontSize={6.5} dominantBaseline="middle">{n.sub}</text>
                  </>}
                </g>
              );
            })}

            {/* === AI / ML CORE NODES (inner ring, glowing) === */}
            {AI_NODES.map((n, i) => {
              const t = aiNodeT(i);
              if (t === 0) return null;
              const r = 32;
              return (
                <g key={`ai-${n.id}`} style={{ opacity: t, transform: `scale(${0.3 + 0.7 * t})`, transformOrigin: `${n.x}px ${n.y}px` }}>
                  <circle cx={n.x} cy={n.y} r={r + 10} fill={n.color} opacity={0.1} filter="url(#wf-glow)"/>
                  <circle cx={n.x} cy={n.y} r={r} fill="#0A1525" stroke={n.color} strokeWidth={2} filter="url(#wf-glow-sm)"/>
                  <text x={n.x} y={n.y - 7} textAnchor="middle" fontSize={15} dominantBaseline="middle">{n.icon}</text>
                  {showAiLabels && <>
                    <text x={n.x} y={n.y + 8}  textAnchor="middle" fill="white"  fontSize={8.5} fontWeight="700" dominantBaseline="middle">{n.label}</text>
                    <text x={n.x} y={n.y + 18} textAnchor="middle" fill={n.color} fontSize={6.5} fontWeight="500" dominantBaseline="middle" opacity={0.85}>{n.sub}</text>
                  </>}
                  {/* Spinning dashed ring */}
                  {pkts && (
                    <circle cx={n.x} cy={n.y} r={r + 6} fill="none" stroke={n.color} strokeWidth={1} strokeDasharray="5 4" opacity={0.35}>
                      <animateTransform attributeName="transform" type="rotate"
                        from={`0 ${n.x} ${n.y}`} to={`${i % 2 === 0 ? 360 : -360} ${n.x} ${n.y}`}
                        dur={`${4.5 + i * 0.8}s`} repeatCount="indefinite"/>
                    </circle>
                  )}
                </g>
              );
            })}

            {/* === CENTRAL AI HUB === */}
            <g style={{ opacity: hubT, transform: `scale(${0.3 + 0.7 * hubT})`, transformOrigin: `${CX}px ${CY}px` }}>
              {/* Outer pulse ring */}
              <circle cx={CX} cy={CY} r={72} fill="none" stroke="#F97316" strokeWidth={1.5} opacity={0.1}>
                <animate attributeName="r" values="58;84;58" dur="3.4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0;0.2" dur="3.4s" repeatCount="indefinite"/>
              </circle>
              {/* Static glow */}
              <circle cx={CX} cy={CY} r={58} fill="rgba(249,115,22,0.06)" stroke="#F97316" strokeWidth={1} opacity={0.25}/>
              {/* Rotating dashed ring */}
              <circle cx={CX} cy={CY} r={52} fill="none" stroke="#F97316" strokeWidth={1} strokeDasharray="6 3" opacity={0.2}>
                <animateTransform attributeName="transform" type="rotate"
                  from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="14s" repeatCount="indefinite"/>
              </circle>
              {/* Core */}
              <circle cx={CX} cy={CY} r={46} fill="url(#hub-grad)" filter="url(#wf-glow)"/>
              <text x={CX} y={CY - 10} textAnchor="middle" fontSize={22} dominantBaseline="middle"></text>
              <text x={CX} y={CY + 12} textAnchor="middle" fill="white" fontSize={9.5} fontWeight="800" letterSpacing="1" dominantBaseline="middle">AI HUB</text>
              <text x={CX} y={CY + 24} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={7} dominantBaseline="middle">coding2u</text>
              {/* Orbiting dots */}
              <circle r="4" fill="#60A5FA" opacity="0.9" filter="url(#wf-glow-sm)">
                <animateMotion dur="4s" repeatCount="indefinite" path={`M ${CX} ${CY - 54} A 54 54 0 1 1 ${CX - 0.001} ${CY - 54}`}/>
              </circle>
              <circle r="3" fill="#34D399" opacity="0.8" filter="url(#wf-glow-sm)">
                <animateMotion dur="7s" repeatCount="indefinite" path={`M ${CX} ${CY - 63} A 63 63 0 1 0 ${CX - 0.001} ${CY - 63}`}/>
              </circle>
            </g>
          </svg>
          </div>
        </div>

        {/* Stats + scroll progress */}
        <div className="flex flex-col items-center gap-2 pb-3 px-6" style={{ flexShrink: 0 }}>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { label: "AI / ML Models",   value: "12+",    color: "text-orange-400" },
              { label: "Data Pipelines",   value: "8",      color: "text-purple-400" },
              { label: "Departments",      value: "8",      color: "text-blue-400"   },
              { label: "Tasks / month",    value: "14M+",   color: "text-green-400"  },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl px-4 py-2 text-center">
                <p className={`text-base font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          {progress < 0.95 && (
            <div style={{ opacity: Math.max(0, 1 - progress * 1.4) }} className="flex flex-col items-center gap-1">
              <p className="text-slate-600 text-xs font-mono">scroll to build the AI network</p>
              <div style={{ width: 110, height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(90deg,#F97316,#A78BFA,#60A5FA)", borderRadius: 999 }}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
