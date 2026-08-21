"use client";

import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  FileText,
  Layout,
  Database,
  ArrowRight,
  ChevronRight,
  Check
} from "lucide-react";

export interface StudioItemProps {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  mode: "ai-recommended" | "prd" | "frontend" | "fullstack";
  href: string;
  badge: string;
  trialBadge: string;
  description: string;
  features: string[];
  imageSrc: string;
  btnText: string;
  iconType: "sparkles" | "fileText" | "layout" | "database";
}

const studioItems: StudioItemProps[] = [
  {
    id: "01",
    title: "AI Recommended Studio",
    shortTitle: "AI Recommended",
    subtitle: "Auto",
    mode: "ai-recommended",
    href: "/app?mode=ai-recommended",
    badge: "AUTO",
    trialBadge: "Coba 1x Gratis",
    description:
      "Panduan konfigurasi otomatis mudah 7 langkah. Tentukan nama website, kategori bisnis, gaya desain, target audiens, dan fitur utama secara terstruktur.",
    features: [
      "Wizard 7 langkah otomatis ramah pemula",
      "Preset tema warna, tipografi & audiens bisnis",
      "Akses coba 1x gratis dengan hasil instan"
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=75",
    btnText: "Buka AI Recommended",
    iconType: "sparkles"
  },
  {
    id: "02",
    title: "Studio PRD & Arsitektur",
    shortTitle: "Studio PRD",
    subtitle: "Blueprint & Spesifikasi",
    mode: "prd",
    href: "/studio/prd",
    badge: "PRO",
    trialBadge: "Coba 1x Gratis",
    description:
      "Kolom chat AI Agent khusus perancangan dokumen Product Requirement Document (PRD), spesifikasi modul teknis, dan diagram hierarki arsitektur.",
    features: [
      "Analisis kebutuhan sistem & user stories",
      "Visualisasi pohon hierarki modul arsitektur",
      "Tersedia untuk tier PRO (Coba 1x gratis)"
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=75",
    btnText: "Buka Studio PRD",
    iconType: "fileText"
  },
  {
    id: "03",
    title: "Studio Frontend UI/UX",
    shortTitle: "Studio Frontend",
    subtitle: "Desain Visual Responsif",
    mode: "frontend",
    href: "/studio/frontend",
    badge: "PRO",
    trialBadge: "Coba 1x Gratis",
    description:
      "Kolom chat AI Agent khusus perancangan estetika visual, komponen responsif multi-device, micro-interactions, dan styling CSS modern.",
    features: [
      "Prompt builder visual UI/UX & layout responsif",
      "Pratinjau langsung mobile, tablet, dan desktop",
      "Tersedia untuk tier PRO (Coba 1x gratis)"
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=75",
    btnText: "Buka Studio Frontend",
    iconType: "layout"
  },
  {
    id: "04",
    title: "Studio Fullstack App",
    shortTitle: "Studio Fullstack",
    subtitle: "Database & Logika End-to-End",
    mode: "fullstack",
    href: "/studio/fullstack",
    badge: "MAX",
    trialBadge: "Tier MAX",
    description:
      "Kolom chat AI Agent khusus pengembangan aplikasi lengkap dengan database in-memory, logika aksi CRUD, manipulasi state, dan panel admin.",
    features: [
      "Logika data, manipulasi state & CRUD terintegrasi",
      "Penyimpanan data lokal, pencarian & export data",
      "Fitur mutakhir khusus paket MAX"
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=75",
    btnText: "Buka Studio Fullstack",
    iconType: "database"
  }
];

export function StudioElasticGallery() {
  const [activeId, setActiveId] = useState<string>("01");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  const renderIcon = (type: StudioItemProps["iconType"], className = "w-5 h-5") => {
    switch (type) {
      case "sparkles":
        return <Sparkles className={className} />;
      case "fileText":
        return <FileText className={className} />;
      case "layout":
        return <Layout className={className} />;
      case "database":
        return <Database className={className} />;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Elastic Expanding Studio Cards Container */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:h-[540px] lg:h-[570px] w-full">
        {studioItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)}
              className={cn(
                // Minimalist clean styling without rainbow colors
                "relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl border-0 bg-zinc-950 backdrop-blur-2xl select-none",
                // Hardware accelerated flex transition
                "transition-[flex,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                isActive
                  ? "md:flex-[3.5] lg:flex-[4] shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-zinc-900/80"
                  : "md:flex-[1] bg-zinc-950/90 hover:bg-zinc-900/40",
                // Mobile dynamic sizing
                isActive ? "min-h-[460px] sm:min-h-[440px]" : "min-h-[74px] md:min-h-0"
              )}
            >
              {/* Background Art Image Layer */}
              <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-700 ease-out",
                    isActive ? "scale-100 opacity-20" : "scale-105 opacity-10"
                  )}
                />

                {/* Darkening Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent transition-opacity duration-500",
                    isActive ? "opacity-95" : "opacity-90"
                  )}
                />

                {/* Top Subtle Neutral Light Strip */}
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/40 to-transparent transition-opacity duration-500",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>

              {/* CARD CONTENT LAYER */}
              <div className="relative z-10 h-full w-full overflow-hidden">
                
                {/* 1. ACTIVE STATE VIEW (Fixed width frame to ensure zero text line reflow) */}
                <div
                  className={cn(
                    "absolute inset-0 p-5 sm:p-7 md:p-6 lg:p-8 flex flex-col justify-between overflow-hidden transition-opacity duration-300 ease-in-out",
                    isActive
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  )}
                >
                  {/* Responsive internal frame: Prevents text wrapping changes during card expansion */}
                  <div className="w-full max-w-[320px] sm:max-w-[420px] md:w-[460px] lg:w-[500px] shrink-0 h-full flex flex-col justify-between">
                    {/* Top Header Section inside Card */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        {/* Icon & Index Number */}
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 shadow-sm">
                            {renderIcon(item.iconType, "w-5 h-5")}
                          </div>
                          <div>
                            <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-500">
                              {item.id} / 04
                            </span>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Badges: Clean Minimalist Monochrome */}
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-zinc-800/90 text-zinc-200 border border-zinc-700/60 shadow-sm">
                            {item.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-zinc-900/90 text-zinc-400 border border-zinc-800/60 text-[10px] font-medium">
                            {item.trialBadge}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5 pt-1">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans break-words sm:whitespace-nowrap">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
                          {item.description}
                        </p>
                      </div>

                      {/* Checklist Features */}
                      <div className="space-y-2 pt-3 border-t border-zinc-800/60">
                        {item.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                            <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-zinc-400">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action CTA Button (compact width with animated expanding pill) */}
                    <div className="pt-4 mt-3 border-t border-zinc-800/60 flex items-center justify-start">
                      <a
                        href={item.href}
                        className="group/cta relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200/80 text-zinc-950 text-xs sm:text-sm font-bold shadow-md shadow-white/5 transition-all duration-300 cursor-pointer select-none px-5 py-2.5 h-10 sm:h-11"
                      >
                        <span className="mr-7 transition-opacity duration-500 group-hover/cta:opacity-0">
                          {item.btnText}
                        </span>
                        <span className="absolute right-1 top-1 bottom-1 rounded-lg z-10 grid w-7 sm:w-8 place-items-center transition-all duration-500 bg-zinc-950/10 group-hover/cta:bg-zinc-950/15 group-hover/cta:w-[calc(100%-0.5rem)] group-active/cta:scale-95 text-zinc-800 group-hover/cta:text-zinc-950">
                          <ChevronRight size={15} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. INACTIVE / COLLAPSED STATE (Minimalist Neutral) */}
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col justify-between p-4 md:py-7 items-center transition-opacity duration-200 ease-in-out",
                    isActive
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100 pointer-events-auto"
                  )}
                >
                  {/* Desktop Vertical Layout */}
                  <div className="hidden md:flex flex-col justify-between items-center h-full w-full">
                    {/* Top: Number & Icon */}
                    <div className="flex flex-col items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-zinc-500">
                        {item.id}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 shadow-sm">
                        {renderIcon(item.iconType, "w-4 h-4")}
                      </div>
                    </div>

                    {/* Middle: Rotated Title */}
                    <div className="py-4 flex items-center justify-center">
                      <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-zinc-400 [writing-mode:vertical-rl]">
                        {item.shortTitle}
                      </span>
                    </div>

                    {/* Bottom: Badge Pill */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Compact Strip Header */}
                  <div className="flex md:hidden items-center justify-between w-full h-full">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                        {renderIcon(item.iconType, "w-4 h-4")}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 mr-2">{item.id}</span>
                        <span className="text-xs font-bold text-zinc-200">{item.shortTitle}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {item.badge}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default StudioElasticGallery;
