"use client";

import { useEffect, useRef, useState, useCallback } from "react";

//  Geometry helpers 
const CX = 500, CY = 370;
const R1 = 185; // sector ring
const R2 = 305; // tool ring

function radial(r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}
function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
function ease(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function local(progress: number, start: number, end: number) {
  return ease(clamp01((progress - start) / (end - start)));
}

//  Data 
const SECTORS = [
  { id: "crm",       label: "CRM",          sub: "Sales",       angle: 0,   color: "#60A5FA", icon: "👥" },
  { id: "finance",   label: "Finance",      sub: "Accounting",  angle: 45,  color: "#34D399", icon: "💰" },
  { id: "ecomm",     label: "E-commerce",   sub: "Orders",      angle: 90,  color: "#F472B6", icon: "🛒" },
  { id: "inventory", label: "Inventory",     sub: "Stock & WMS", angle: 135, color: "#A78BFA", icon: "📦" },
  { id: "posvendas", label: "After-Sales",   sub: "Support",     angle: 180, color: "#FB923C", icon: "⭐" },
  { id: "marketing", label: "Marketing",     sub: "Campaigns",   angle: 225, color: "#38BDF8", icon: "📢" },
  { id: "admin",     label: "Admin",         sub: "Operations",  angle: 270, color: "#FCD34D", icon: "🏢" },
  { id: "hr",        label: "HR & People",   sub: "Workforce",   angle: 315, color: "#86EFAC", icon: "👤" },
].map((s) => ({ ...s, ...radial(R1, s.angle) }));

const TOOLS = [
  { id: "crm_cloud",  label: "CRM Cloud",    sub: "Pipeline",  sector: "crm",       angle: 0   },
  { id: "accounting", label: "Accounting",   sub: "Invoicing", sector: "finance",   angle: 45  },
  { id: "storefront", label: "Storefront",   sub: "Checkout",  sector: "ecomm",     angle: 90  },
  { id: "erp",        label: "ERP System",   sub: "WMS",       sector: "inventory", angle: 135 },
  { id: "helpdesk",   label: "Help Desk",    sub: "Tickets",   sector: "posvendas", angle: 180 },
  { id: "emailmkt",   label: "Email Mktg",   sub: "Sequences", sector: "marketing", angle: 225 },
  { id: "workspace",  label: "Workspace",    sub: "Docs & Ops",sector: "admin",     angle: 270 },
  { id: "hrsys",      label: "HR System",    sub: "Payroll",   sector: "hr",        angle: 315 },
].map((t) => ({ ...t, ...radial(R2, t.angle) }));

const CROSS = [
  { from: "crm",       to: "finance"    },
  { from: "crm",       to: "marketing"  },
  { from: "crm",       to: "posvendas"  },
  { from: "finance",   to: "inventory"  },
  { from: "finance",   to: "admin"      },
  { from: "inventory", to: "ecomm"      },
  { from: "ecomm",     to: "posvendas"  },
  { from: "marketing", to: "hr"         },
  { from: "admin",     to: "hr"         },
  { from: "posvendas", to: "crm"        },
];

const sectorMap = Object.fromEntries(SECTORS.map((s) => [s.id, s]));

const P = {
  HUB_IN:           [0.00, 0.12] as [number, number],
  SPOKE_START:       0.12,
  SPOKE_STRIDE:      0.035,
  SECTOR_DELAY:      0.05,
  TOOL_START:        0.55,
  TOOL_STRIDE:       0.025,
  CROSS_START:       0.74,
  CROSS_STRIDE:      0.025,
  PACKETS_THRESHOLD: 0.88,
};

const LARGE = 900;
function strokeDash(t: number) {
  return { strokeDasharray: LARGE, strokeDashoffset: LARGE * (1 - t) };
}

const CROSS_LABELS: Record<string, string> = {
  "crmfinance":       "Invoice trigger",
  "crmmarketing":     "Lead sync",
  "crmposvendas":     "Support open",
  "financeinventory": "PO auto",
  "financeadmin":     "Expense report",
  "inventoryecomm":   "Stock sync",
  "ecommposvendas":   "Order fulfilled",
  "marketinghr":      "Headcount req.",
  "adminhr":          "Onboarding",
  "posvendascrm":     "Re-engage",
};

export default function WorkflowBuilder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const stickyHeight = el.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    setProgress(clamp01(scrolled / stickyHeight));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const hubT           = local(progress, ...P.HUB_IN);
  const packetsActive  = progress >= P.PACKETS_THRESHOLD;
  const showLabel      = progress >= 0.28;

  function spokeT(i: number)    { const s = P.SPOKE_START + i * P.SPOKE_STRIDE;     return local(progress, s, s + 0.12); }
  function sectorT(i: number)   { const s = P.SPOKE_START + i * P.SPOKE_STRIDE + P.SECTOR_DELAY; return local(progress, s, s + 0.1); }
  function toolT(i: number)     { const s = P.TOOL_START  + i * P.TOOL_STRIDE;      return local(progress, s, s + 0.1); }
  function toolEdgeT(i: number) { const s = P.TOOL_START  + i * P.TOOL_STRIDE + 0.02; return local(progress, s, s + 0.1); }
  function crossT(i: number)    { const s = P.CROSS_START + i * P.CROSS_STRIDE;     return local(progress, s, s + 0.08); }

  return (
    <section
      id="workflow"
      ref={sectionRef}
      style={{ height: "420vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #070B12, #0a1220)",
        }}
        className="bg-grid"
      >
        {/* Header */}
        <div className="text-center px-6 mb-2" style={{ flexShrink: 0 }}>
          <span className="text-orange-400 font-mono text-xs tracking-widest uppercase">
            {"// enterprise_automation.n8n"}
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Every Department.{" "}
            <span className="grad-text">One Automation Hub.</span>
          </h2>
          <p className="mt-2 text-slate-400 max-w-lg mx-auto text-sm">
            Watch your company connect in real time  CRM, Finance, Inventory, Marketing and more, all talking to each other automatically.
          </p>
        </div>

        {/* SVG canvas */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
          <svg
            viewBox="60 30 880 680"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%", maxHeight: "calc(100vh - 170px)", overflow: "visible" }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="wf-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="wf-glow-sm" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <radialGradient id="hub-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#F97316" stopOpacity="0.95"/>
                <stop offset="100%" stopColor="#c2410c" stopOpacity="1"/>
              </radialGradient>
              <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(249,115,22,0.7)"/>
              </marker>
            </defs>

            {/* Ambient glow rings */}
            <circle cx={CX} cy={CY} r={R2+30} fill="none" stroke="rgba(249,115,22,0.03)" strokeWidth={55} style={{ opacity: hubT }}/>
            <circle cx={CX} cy={CY} r={R1+22} fill="none" stroke="rgba(96,165,250,0.04)" strokeWidth={40} style={{ opacity: hubT }}/>

            {/* Hub  sector spokes */}
            {SECTORS.map((s, i) => {
              const t = spokeT(i);
              if (t === 0) return null;
              return (
                <line key={`spoke-${s.id}`}
                  x1={CX} y1={CY} x2={s.x} y2={s.y}
                  stroke={s.color} strokeWidth={1.2} strokeOpacity={0.3}
                  style={strokeDash(t)}
                />
              );
            })}

            {/* Sector  tool dashed edges */}
            {TOOLS.map((tool, i) => {
              const t = toolEdgeT(i);
              if (t === 0) return null;
              const sec = sectorMap[tool.sector];
              return (
                <line key={`te-${tool.id}`}
                  x1={sec.x} y1={sec.y} x2={tool.x} y2={tool.y}
                  stroke={sec.color} strokeWidth={1} strokeOpacity={0.25}
                  strokeDasharray="4 4"
                  style={{ opacity: t }}
                />
              );
            })}

            {/* Cross-edges between sectors */}
            {CROSS.map((c, i) => {
              const t = crossT(i);
              if (t === 0) return null;
              const a = sectorMap[c.from];
              const b = sectorMap[c.to];
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const bx = (mx + CX) / 2;
              const by = (my + CY) / 2;
              const d = `M ${a.x} ${a.y} Q ${bx} ${by} ${b.x} ${b.y}`;
              return (
                <path key={`cross-${i}`} d={d}
                  fill="none"
                  stroke="rgba(249,115,22,0.55)"
                  strokeWidth={1.6}
                  markerEnd="url(#arr)"
                  style={{ ...strokeDash(t), filter: "url(#wf-glow-sm)" }}
                />
              );
            })}

            {/* Data packets on spokes */}
            {packetsActive && SECTORS.map((s, i) => (
              <circle key={`pkt-${s.id}`} r="3.5" fill={s.color} filter="url(#wf-glow-sm)" opacity="0.9">
                <animateMotion dur={`${1.4 + i * 0.18}s`} repeatCount="indefinite" path={`M ${CX} ${CY} L ${s.x} ${s.y}`}/>
              </circle>
            ))}

            {/* Data packets on cross-edges */}
            {packetsActive && CROSS.map((c, i) => {
              const a = sectorMap[c.from];
              const b = sectorMap[c.to];
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const bx = (mx + CX) / 2;
              const by = (my + CY) / 2;
              return (
                <circle key={`cpkt-${i}`} r="2.5" fill="#F97316" opacity="0.7" filter="url(#wf-glow-sm)">
                  <animateMotion dur={`${2 + i * 0.22}s`} repeatCount="indefinite" path={`M ${a.x} ${a.y} Q ${bx} ${by} ${b.x} ${b.y}`}/>
                </circle>
              );
            })}

            {/* Tool nodes */}
            {TOOLS.map((tool, i) => {
              const t = toolT(i);
              if (t === 0) return null;
              const sec = sectorMap[tool.sector];
              return (
                <g key={`tool-${tool.id}`} style={{ opacity: t, transform: `scale(${0.5 + 0.5 * t})`, transformOrigin: `${tool.x}px ${tool.y}px` }}>
                  <circle cx={tool.x} cy={tool.y} r={26} fill="#0D1B31" stroke={sec.color} strokeWidth={1} strokeOpacity={0.45}/>
                  <text x={tool.x} y={tool.y - 5} textAnchor="middle" fill="white" fontSize={9} fontWeight="600" dominantBaseline="middle">{tool.label}</text>
                  <text x={tool.x} y={tool.y + 7} textAnchor="middle" fill="#64748b" fontSize={7} dominantBaseline="middle">{tool.sub}</text>
                </g>
              );
            })}

            {/* Sector nodes */}
            {SECTORS.map((s, i) => {
              const t = sectorT(i);
              if (t === 0) return null;
              const r = 38;
              return (
                <g key={`sec-${s.id}`} style={{ opacity: t, transform: `scale(${0.4 + 0.6 * t})`, transformOrigin: `${s.x}px ${s.y}px` }}>
                  <circle cx={s.x} cy={s.y} r={r + 8} fill={s.color} opacity={0.07}/>
                  <circle cx={s.x} cy={s.y} r={r} fill="#0E1C30" stroke={s.color} strokeWidth={2} filter="url(#wf-glow-sm)"/>
                  <text x={s.x} y={s.y - 9} textAnchor="middle" fontSize={18} dominantBaseline="middle">{s.icon}</text>
                  {showLabel && <>
                    <text x={s.x} y={s.y + 10} textAnchor="middle" fill="white" fontSize={9.5} fontWeight="700" dominantBaseline="middle">{s.label}</text>
                    <text x={s.x} y={s.y + 21} textAnchor="middle" fill="#64748b" fontSize={7.5} dominantBaseline="middle">{s.sub}</text>
                  </>}
                  {packetsActive && (
                    <circle cx={s.x} cy={s.y} r={r} fill="none" stroke={s.color} strokeWidth={2} opacity={0.35}>
                      <animate attributeName="r" values={`${r};${r+14};${r}`} dur={`${2+i*0.25}s`} repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.35;0;0.35" dur={`${2+i*0.25}s`} repeatCount="indefinite"/>
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Cross-edge labels */}
            {progress >= P.CROSS_START + 0.12 && CROSS.map((c, i) => {
              const t = crossT(i);
              if (t < 0.7) return null;
              const a = sectorMap[c.from];
              const b = sectorMap[c.to];
              const lx = ((a.x + b.x) / 2 + CX) / 2;
              const ly = ((a.y + b.y) / 2 + CY) / 2;
              const lbl = CROSS_LABELS[`${c.from}${c.to}`] ?? "";
              return (
                <g key={`clbl-${i}`} style={{ opacity: (t - 0.7) * 3.3 }}>
                  <rect x={lx - 33} y={ly - 8} width={66} height={14} rx={5} fill="rgba(7,11,18,0.88)" stroke="rgba(249,115,22,0.2)" strokeWidth={0.8}/>
                  <text x={lx} y={ly + 0.5} textAnchor="middle" fill="#94a3b8" fontSize={6.5} dominantBaseline="middle">{lbl}</text>
                </g>
              );
            })}

            {/* Central AI Hub */}
            <g style={{ opacity: hubT, transform: `scale(${0.3 + 0.7 * hubT})`, transformOrigin: `${CX}px ${CY}px` }}>
              <circle cx={CX} cy={CY} r={56} fill="rgba(249,115,22,0.06)" stroke="#F97316" strokeWidth={1} opacity={0.25}/>
              <circle cx={CX} cy={CY} r={70} fill="none" stroke="#F97316" strokeWidth={1.5} opacity={0.1}>
                <animate attributeName="r" values="56;80;56" dur="3.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.18;0;0.18" dur="3.2s" repeatCount="indefinite"/>
              </circle>
              <circle cx={CX} cy={CY} r={46} fill="url(#hub-grad)" filter="url(#wf-glow)"/>
              <text x={CX} y={CY - 10} textAnchor="middle" fontSize={24} dominantBaseline="middle"></text>
              <text x={CX} y={CY + 14} textAnchor="middle" fill="white" fontSize={10} fontWeight="800" letterSpacing="1" dominantBaseline="middle">AI HUB</text>
              <text x={CX} y={CY + 26} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize={7.5} dominantBaseline="middle">coding2u</text>
              <circle r="4" fill="#60A5FA" opacity="0.9" filter="url(#wf-glow-sm)">
                <animateMotion dur="4s" repeatCount="indefinite"
                  path={`M ${CX} ${CY - 54} A 54 54 0 1 1 ${CX - 0.001} ${CY - 54}`}/>
              </circle>
              <circle r="3" fill="#34D399" opacity="0.8" filter="url(#wf-glow-sm)">
                <animateMotion dur="7s" repeatCount="indefinite"
                  path={`M ${CX} ${CY - 62} A 62 62 0 1 0 ${CX - 0.001} ${CY - 62}`}/>
              </circle>
            </g>
          </svg>
        </div>

        {/* Stats row + scroll hint */}
        <div className="flex flex-col items-center gap-2 pb-3 px-6" style={{ flexShrink: 0 }}>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { label: "Departments",   value: "8+",     color: "text-orange-400" },
              { label: "Automations",   value: "2,400+", color: "text-blue-400"   },
              { label: "Tasks / month", value: "14M+",   color: "text-white"      },
              { label: "Avg. ROI",      value: "847%",   color: "text-green-400"  },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl px-4 py-2 text-center">
                <p className={`text-base font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          {progress < 0.94 && (
            <div style={{ opacity: Math.max(0, 1 - progress * 1.5) }} className="flex flex-col items-center gap-1">
              <p className="text-slate-600 text-xs font-mono">scroll to build the network</p>
              <div style={{ width: 110, height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(90deg,#F97316,#60A5FA)", borderRadius: 999 }}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
