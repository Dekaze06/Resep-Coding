"use client";

import React from "react";
import ScrollRevealImageDemo from "@/components/ui/scroll-reveal-demo";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors">
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span className="text-xs font-mono uppercase tracking-widest">Kembali ke Beranda</span>
        </a>
        <span className="font-display font-bold uppercase tracking-[0.2em] text-sm text-zinc-300">
          Ruang Visual Studio
        </span>
        <div className="w-20"></div>
      </header>

      {/* Header Intro */}
      <div className="text-center pt-20 pb-8 px-6">
        <p className="text-amber-400/90 text-xs font-mono uppercase tracking-[0.3em] mb-3">
          Showcase Galeri Sinematik
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Karya Sinematik
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Scroll ke bawah untuk melihat transisi visual dinamis dan kedalaman gambar beresolusi tinggi.
        </p>
      </div>

      {/* Dynamic Scroll Reveal Component */}
      <ScrollRevealImageDemo
        fromWidth="45vw"
        toWidth="92vw"
        fromScale={1.5}
        toScale={1}
      />
    </div>
  );
}
