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
  accent: {
    text: string;
    iconBg: string;
    iconText: string;
    badge: string;
    btn: string;
    btnHover: string;
    btnText: string;
    btnArrowBg: string;
    btnArrowText: string;
    topStrip: string;
    borderActive: string;
  };
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
    iconType: "sparkles",
    accent: {
      text: "text-white",
      iconBg: "bg-zinc-900 border-zinc-800",
      iconText: "text-zinc-200",
      badge: "bg-zinc-800/90 text-zinc-200 border-zinc-700/60",
      btn: "bg-white hover:bg-zinc-100 border-zinc-200/80 text-zinc-950",
      btnHover: "hover:bg-zinc-100",
      btnText: "text-zinc-950 font-bold",
      btnArrowBg: "bg-zinc-950/10 group-hover/cta:bg-zinc-950/15",
      btnArrowText: "text-zinc-800 group-hover/cta:text-zinc-950",
      topStrip: "via-zinc-500/40",
      borderActive: "border-zinc-800"
    }
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
    iconType: "fileText",
    accent: {
      text: "text-white",
      iconBg: "bg-orange-500/15 border-orange-500/30",
      iconText: "text-orange-400",
      badge: "bg-zinc-800/90 text-zinc-200 border-zinc-700/60",
      btn: "bg-orange-500 hover:bg-orange-400 border-orange-400 text-zinc-950",
      btnHover: "hover:bg-orange-400",
      btnText: "text-zinc-950 font-bold",
      btnArrowBg: "bg-zinc-950/15 group-hover/cta:bg-zinc-950/20",
      btnArrowText: "text-zinc-950",
      topStrip: "via-orange-500/50",
      borderActive: "border-orange-500/30"
    }
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
    iconType: "layout",
    accent: {
      text: "text-white",
      iconBg: "bg-blue-500/15 border-blue-500/30",
      iconText: "text-blue-400",
      badge: "bg-zinc-800/90 text-zinc-200 border-zinc-700/60",
      btn: "bg-blue-500 hover:bg-blue-400 border-blue-400 text-zinc-950",
      btnHover: "hover:bg-blue-400",
      btnText: "text-zinc-950 font-bold",
      btnArrowBg: "bg-zinc-950/15 group-hover/cta:bg-zinc-950/20",
      btnArrowText: "text-zinc-950",
      topStrip: "via-blue-500/50",
      borderActive: "border-blue-500/30"
    }
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
    iconType: "database",
    accent: {
      text: "text-white",
      iconBg: "bg-purple-500/15 border-purple-500/30",
      iconText: "text-purple-400",
      badge: "bg-zinc-800/90 text-zinc-200 border-zinc-700/60",
      btn: "bg-purple-500 hover:bg-purple-400 border-purple-400 text-zinc-950",
      btnHover: "hover:bg-purple-400",
      btnText: "text-zinc-950 font-bold",
      btnArrowBg: "bg-zinc-950/15 group-hover/cta:bg-zinc-950/20",
      btnArrowText: "text-zinc-950",
      topStrip: "via-purple-500/50",
      borderActive: "border-purple-500/30"
    }
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
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:h-[540px] lg:h-[570px] w-full">
        {studioItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)}
              className={cn(
                // Minimalist clean styling
                "relative cursor-pointer overflow-hidden rounded-xl md:rounded-3xl border-0 bg-zinc-950 backdrop-blur-2xl select-none",
                // Hardware accelerated flex transition
                "transition-[flex,box-shadow,background-color,min-height] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                isActive
                  ? "md:flex-[3.5] lg:flex-[4] shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-zinc-900/80"
                  : "md:flex-[1] bg-zinc-950/90 hover:bg-zinc-900/40",
                // Mobile: compact collapsed (52px), compact active (auto-sized)
                isActive ? "md:min-h-0" : "h-[52px] md:h-auto"
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

                {/* Top Subtle Accent Light Strip */}
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent to-transparent transition-opacity duration-500",
                    item.accent.topStrip,
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>

              {/* CARD CONTENT LAYER */}
              <div className="relative z-10 h-full w-full overflow-hidden">
                
                {/* 1. ACTIVE STATE VIEW */}
                {isActive && (
                  <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between md:absolute md:inset-0 h-full">
                    {/* Responsive internal frame */}
                    <div className="w-full md:w-[460px] lg:w-[500px] shrink-0 h-full flex flex-col justify-between">
                      {/* Top Header Section */}
                      <div className="space-y-2.5 md:space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          {/* Index & Subtitle */}
                          <div>
                            <span className="text-[10px] md:text-[11px] font-mono font-semibold tracking-wider text-zinc-500">
                              {item.id} / 04
                            </span>
                            <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                              {item.subtitle}
                            </p>
                          </div>

                          {/* Badges: Clean Minimalist Monochrome */}
                          <div className="flex items-center gap-1 flex-wrap justify-end">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-mono font-bold tracking-wider uppercase border shadow-sm",
                              item.accent.badge
                            )}>
                              {item.badge}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-zinc-900/90 text-zinc-400 border border-zinc-800/60 text-[9px] md:text-[10px] font-medium hidden sm:inline-block">
                              {item.trialBadge}
                            </span>
                          </div>
                        </div>

                        {/* Title & Description: Clean Minimalist White & Zinc */}
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans break-words">
                            {item.title}
                          </h3>
                          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 leading-relaxed line-clamp-2 md:line-clamp-none">
                            {item.description}
                          </p>
                        </div>

                        {/* Checklist Features: Clean Minimalist Zinc Checkmarks */}
                        <div className="space-y-1.5 md:space-y-2 pt-2 md:pt-3 border-t border-zinc-800/60">
                          {item.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[11px] md:text-xs text-zinc-300">
                              <Check size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                              <span className="leading-snug">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Action CTA Button */}
                      <div className="pt-3 md:pt-4 mt-3 md:mt-4 border-t border-zinc-800/60 flex items-center justify-start">
                        <a
                          href={item.href}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "group/cta relative inline-flex items-center justify-center overflow-hidden rounded-lg md:rounded-xl border text-xs font-bold shadow-md transition-all duration-300 cursor-pointer select-none px-4 py-2 h-9 md:h-11 w-full sm:w-auto",
                            item.accent.btn,
                            item.accent.btnHover
                          )}
                        >
                          <span className={cn("mr-7 transition-opacity duration-500 group-hover/cta:opacity-0", item.accent.btnText)}>
                            {item.btnText}
                          </span>
                          <span className={cn(
                            "absolute right-1 top-1 bottom-1 rounded-lg z-10 grid w-7 place-items-center transition-all duration-500 group-hover/cta:w-[calc(100%-0.5rem)] group-active/cta:scale-95",
                            item.accent.btnArrowBg,
                            item.accent.btnArrowText
                          )}>
                            <ChevronRight size={14} strokeWidth={2.5} aria-hidden="true" />
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. INACTIVE / COLLAPSED STATE */}
                {!isActive && (
                  <div className="absolute inset-0 flex flex-col justify-between p-3 md:py-7 items-center">
                    {/* Desktop Vertical Layout */}
                    <div className="hidden md:flex flex-col justify-between items-center h-full w-full">
                      {/* Top: Number */}
                      <div className="flex flex-col items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-zinc-500">
                          {item.id}
                        </span>
                      </div>

                      {/* Middle: Rotated Title */}
                      <div className="py-4 flex items-center justify-center">
                        <span className={cn(
                          "whitespace-nowrap text-xs font-semibold uppercase tracking-widest [writing-mode:vertical-rl] transition-colors",
                          item.accent.iconText
                        )}>
                          {item.shortTitle}
                        </span>
                      </div>

                      {/* Bottom: Badge Pill */}
                      <div className="flex flex-col items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider border",
                          item.accent.badge
                        )}>
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Compact Strip Header */}
                    <div className="flex md:hidden items-center justify-between w-full h-full">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-zinc-500">{item.id}</span>
                          <span className={cn("text-[11px] font-bold", item.accent.iconText)}>{item.shortTitle}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[8px] font-mono font-semibold uppercase border",
                          item.accent.badge
                        )}>
                          {item.badge}
                        </span>
                        <ChevronRight size={14} className="text-zinc-600" />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default StudioElasticGallery;

