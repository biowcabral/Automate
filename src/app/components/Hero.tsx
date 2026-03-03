"use client";

import { SectionProps } from "./types";

export default function Hero({ className = "" }: SectionProps) {
  return (
    <section
      className={`min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white ${className}`}
    >
      <p className="text-purple-400 font-semibold tracking-widest uppercase text-sm mb-4">
        Automação Inteligente
      </p>
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl mb-6">
        Automatize seu negócio e{" "}
        <span className="text-purple-400">escale sem limites</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10">
        Soluções de automação personalizadas para empresas que querem crescer
        mais rápido, atender melhor e trabalhar com eficiência máxima.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#contato"
          className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-lg transition-all"
        >
          Quero automatizar agora
        </a>
        <a
          href="#como-funciona"
          className="px-8 py-4 border border-purple-400 hover:bg-purple-900/40 rounded-xl font-bold text-lg transition-all"
        >
          Como funciona
        </a>
      </div>
    </section>
  );
}
