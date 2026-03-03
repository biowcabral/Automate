"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const FloatingAvatar = dynamic(() => import("./FloatingAvatar"), { ssr: false });

const NAV_LINKS = ["Features", "Workflow", "How It Works", "Contact"];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#070B12]" id="hero">
      {/* BG glow blobs */}
      <div className="absolute -top-40 -left-40 w-150 h-150 rounded-full bg-orange-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-125 h-125 rounded-full bg-blue-900/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-50 bg-orange-950/30 blur-[80px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        {/* Logo */}
        <a href="#hero" className="flex items-center">
          <Image src="/logo.png" alt="coding2u" width={160} height={40} priority className="h-10 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #F97316, #EA580C)", boxShadow: "0 0 20px rgba(249,115,22,0.45)" }}
        >
          Get Free Audit
        </a>
      </nav>

      {/* Hero content — centered full-width layout */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center gap-0 px-6 md:px-16 py-16">

        {/* Floating avatar — decorative, behind content */}
        <div className="absolute right-[6%] top-[12%] opacity-60 pointer-events-none select-none hidden lg:block">
          <FloatingAvatar />
        </div>
        <div className="absolute left-[6%] bottom-[10%] opacity-30 pointer-events-none select-none hidden xl:block scale-75">
          <FloatingAvatar />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 text-orange-300 text-xs font-mono mb-8">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          AI-Powered Business Automation
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 max-w-4xl">
          Automate Everything.{" "}
          <br />
          <span className="grad-text text-glow-orange">Scale Without Limits.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
          We build intelligent automation pipelines that eliminate manual
          work, handle customer interactions 24/7, and let your team focus on
          what actually matters &mdash; growth.
        </p>

        {/* Terminal snippet — centered, wider */}
        <div className="glass rounded-xl p-5 mb-10 font-mono text-sm w-full max-w-lg text-left">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 text-slate-500 text-xs">autoflow-cli</span>
          </div>
          <p className="text-slate-500">
            <span className="text-orange-400">$</span>{" "}
            <span className="text-blue-300">autoflow</span>{" "}
            <span className="text-green-400">deploy</span>{" "}
            <span className="text-slate-300">--workflow</span>{" "}
            <span className="text-orange-300">lead-pipeline</span>
          </p>
          <p className="text-slate-500 mt-1">
            <span className="text-green-400">✓</span>{" "}
            <span className="text-slate-300">12 nodes connected</span>
          </p>
          <p className="text-slate-500">
            <span className="text-green-400">✓</span>{" "}
            <span className="text-slate-300">AI agent trained (847 samples)</span>
          </p>
          <p className="text-slate-500">
            <span className="text-blue-400">⚡</span>{" "}
            <span className="text-white font-bold">Live in 0.3s</span>
            <span className="animate-blink text-orange-400 ml-1">█</span>
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="group relative flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #F97316, #EA580C)",
              boxShadow: "0 0 30px rgba(249,115,22,0.5)",
            }}
          >
            <span>Start Automating →</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="#workflow"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-slate-300 border border-slate-700 hover:border-orange-500 hover:text-white transition-all text-base"
          >
            ▶ Watch Demo
          </a>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="relative z-10 flex justify-center pb-8">
        <a href="#workflow" className="flex flex-col items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors animate-bounce">
          <span className="text-xs font-mono">scroll to explore</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
