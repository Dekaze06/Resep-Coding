"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TemplateCard {
  badge: string;
  title: string;
  description: string;
  tech: string;
  prompt: string;
}

const TEMPLATES: TemplateCard[] = [
  {
    badge: "SaaS & Analytics",
    title: "Nexus Suite",
    description: "Dashboard metrik pendapatan & grafik Chart.js.",
    tech: "Chart.js",
    prompt:
      "Buatkan dashboard analitik manajemen bisnis dengan grafik pendapatan bulanan Chart.js, tabel transaksi pelanggan, filter pencarian, dan tombol ekspor CSV.",
  },
  {
    badge: "Toko Online",
    title: "Aura Commerce",
    description: "Katalog produk modern & keranjang drawer.",
    tech: "Cart Drawer",
    prompt:
      "Buatkan toko online minimalis dengan grid produk, keranjang belanja interaktif, filter kategori harga, dan formulir checkout.",
  },
  {
    badge: "Produktivitas",
    title: "Vortex Kanban",
    description: "Papan kerja Kanban, modal detail, dan data lokal.",
    tech: "Local Storage",
    prompt:
      "Buatkan task management Kanban board dengan kolom (To Do, In Progress, Done), priority tags, task editor modal, dan JSON export.",
  },
];

function TemplateCardItem({
  card,
  index,
}: {
  card: TemplateCard;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 48, scale: 0.96 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`bg-zinc-900/40 border border-zinc-800/80 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition-colors ${
        index === 2 ? "col-span-2 md:col-span-1" : ""
      }`}
    >
      <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-2.5">
        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] sm:text-[10px] font-medium">
          {card.badge}
        </span>
        <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-zinc-200 transition-colors">
          {card.title}
        </h4>
        <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed line-clamp-2 sm:line-clamp-none">
          {card.description}
        </p>
      </div>
      <div className="p-2.5 sm:p-4 bg-zinc-950 border-t border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-2">
        <span className="text-[9px] sm:text-[11px] text-zinc-500 font-medium hidden sm:inline">
          {card.tech}
        </span>
        <button
          type="button"
          className="clone-showcase-btn px-2 sm:px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[10px] sm:text-xs font-medium text-zinc-200 transition-all flex items-center justify-center gap-1 border border-zinc-800 hover:border-zinc-700 cursor-pointer"
          data-prompt={card.prompt}
        >
          <i className="fa-solid fa-clone text-[9px] text-zinc-400"></i>
          <span>Gunakan</span>
        </button>
      </div>
    </motion.div>
  );
}

export function TemplateShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-40px" });

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto space-y-10">
      {/* Section Header with fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={
          headerInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 24 }
        }
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
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
          className="group relative inline-flex items-center justify-center overflow-hidden px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer select-none"
        >
          <span className="mr-5 transition-opacity duration-500 group-hover:opacity-0">
            Open Studio
          </span>
          <span className="absolute right-1 top-1 bottom-1 rounded-md z-10 grid w-5 place-items-center transition-all duration-500 bg-white/10 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-zinc-400 group-hover:text-white">
            <i
              className="fa-solid fa-chevron-right text-[9px]"
              aria-hidden="true"
            ></i>
          </span>
        </a>
      </motion.div>

      {/* Cards Grid with staggered scroll reveal */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-5">
        {TEMPLATES.map((card, i) => (
          <TemplateCardItem key={card.title} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}

export default TemplateShowcase;
