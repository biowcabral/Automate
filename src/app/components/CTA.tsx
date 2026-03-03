"use client";

export default function CTA() {
  return (
    <section className="py-28 px-6 relative overflow-hidden" id="contact">
      {/* BG glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-175 h-100 rounded-full bg-purple-700/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-100 h-75 rounded-full bg-cyan-700/10 blur-[80px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <span className="inline-block bg-purple-500/15 border border-purple-500/30 rounded-full px-5 py-1.5 text-purple-300 text-sm font-mono mb-8">
          {"// ready_to_scale.sh"}
        </span>
        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Stop Doing What{" "}
          <span className="grad-text">Machines Should Do</span>
        </h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
          Book a free 30-minute audit. We&rsquo;ll show you exactly which tasks in
          your business can be automated — and the ROI you&rsquo;ll get in 90 days.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="#"
            className="group relative px-10 py-4 rounded-xl font-bold text-lg text-white overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #a855f7, #6366f1)",
              boxShadow: "0 0 30px rgba(168,85,247,0.5)",
            }}
          >
            <span className="relative z-10">Book Free Audit →</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="#workflow"
            className="px-10 py-4 rounded-xl font-bold text-lg text-slate-300 border border-slate-600 hover:border-purple-500 hover:text-white transition-all"
          >
            See How It Works
          </a>
        </div>

        {/* Social proof strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
          <span className="flex items-center gap-2">
            <span className="text-green-400">✓</span> No commitment required
          </span>
          <span className="w-px h-4 bg-slate-700" />
          <span className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Results in 30 days
          </span>
          <span className="w-px h-4 bg-slate-700" />
          <span className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Dedicated engineer
          </span>
        </div>
      </div>
    </section>
  );
}
