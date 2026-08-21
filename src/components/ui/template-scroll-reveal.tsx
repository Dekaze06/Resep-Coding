"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, ArrowUpRight, Layers } from "lucide-react";

export interface TemplateItem {
  badge: string;
  title: string;
  subtitle: string;
  tech: string;
  prompt: string;
  image: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    badge: "SaaS & Analytics",
    title: "Nexus Suite",
    subtitle: "Dashboard metrik pendapatan & grafik Chart.js dengan filter real-time",
    tech: "Chart.js",
    prompt:
      "Buatkan dashboard analitik manajemen bisnis dengan grafik pendapatan bulanan Chart.js, tabel transaksi pelanggan, filter pencarian, dan tombol ekspor CSV.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop",
  },
  {
    badge: "Toko Online",
    title: "Aura Commerce",
    subtitle: "Katalog produk minimalis, drawer keranjang belanja interaktif, & checkout",
    tech: "Cart Drawer",
    prompt:
      "Buatkan toko online minimalis dengan grid produk, keranjang belanja interaktif, filter kategori harga, dan formulir checkout.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop",
  },
  {
    badge: "Produktivitas",
    title: "Vortex Kanban",
    subtitle: "Papan kerja Kanban, status workflow, modal detail, dan sinkronisasi lokal",
    tech: "Local Storage",
    prompt:
      "Buatkan task management Kanban board dengan kolom (To Do, In Progress, Done), priority tags, task editor modal, dan JSON export.",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1920&auto=format&fit=crop",
  },
];

function RevealCard({ item }: { item: TemplateItem }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const width = useTransform(scrollYProgress, [0, 1], ["75%", "100%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const radius = useTransform(scrollYProgress, [0.3, 1], ["32px", "16px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.4, 1]);

  const smoothWidth = useSpring(width, { stiffness: 120, damping: 80 });
  const smoothScale = useSpring(scale, { stiffness: 120, damping: 80 });
  const smoothRadius = useSpring(radius, { stiffness: 120, damping: 80 });

  return (
    <motion.div
      ref={containerRef}
      style={{
        width: smoothWidth,
        borderRadius: smoothRadius,
        opacity,
      }}
      className="relative h-[320px] sm:h-[380px] md:h-[440px] overflow-hidden mx-auto border border-zinc-800/80 bg-zinc-950 shadow-2xl group cursor-pointer select-none transition-colors hover:border-zinc-700"
    >
      {/* Background Image with Zoom on Scroll */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          scale: smoothScale,
          originX: 0.5,
          originY: 0.5,
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover brightness-75 contrast-110 group-hover:scale-105 transition-transform duration-700"
        />
      </motion.div>

      {/* Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent pointer-events-none" />

      {/* Top Left Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-xs font-medium text-zinc-200">
        <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
        <span>{item.badge}</span>
      </div>

      {/* Top Right Action Icon */}
      <div className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-zinc-300 group-hover:text-white group-hover:border-zinc-700 transition-all">
        <ArrowUpRight className="w-4 h-4" />
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-4 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800/90">
        <div className="space-y-1 text-left max-w-xl">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {item.title}
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
              {item.tech}
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {item.subtitle}
          </p>
        </div>

        <button
          type="button"
          className="clone-showcase-btn shrink-0 px-4 py-2 rounded-lg bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-950 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          data-prompt={item.prompt}
        >
          <span>Gunakan Template</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export function TemplateScrollReveal() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
            Galeri Inspirasi
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Contoh Template Siap Clone
          </h3>
        </div>
        <a
          href="/studio"
          className="group relative inline-flex items-center justify-center overflow-hidden px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-950 transition-all cursor-pointer select-none"
        >
          <span className="mr-5 transition-opacity duration-500 group-hover:opacity-0">
            Open Studio
          </span>
          <span className="absolute right-1 top-1 bottom-1 rounded-md z-10 grid w-5 place-items-center transition-all duration-500 bg-zinc-950/10 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-zinc-950">
            <i className="fa-solid fa-chevron-right text-[9px]" aria-hidden="true"></i>
          </span>
        </a>
      </div>

      {/* Vertical Stack of Scroll Reveal Cards */}
      <div className="flex flex-col gap-10">
        {TEMPLATES.map((item) => (
          <RevealCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}

export default TemplateScrollReveal;
