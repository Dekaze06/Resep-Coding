"use client";

import React, { useState } from "react";
import {
  FileText,
  Layout,
  Database,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioItemConfig {
  id: string;
  icon: React.ComponentType<any>;
  name: string;
  label: string;
  tagline: string;
  href: string;
  description: string;
  accent: string;
}

const studioItems: StudioItemConfig[] = [
  {
    id: "01",
    icon: FileText,
    name: "Planning",
    label: "Planning",
    tagline: "Fungsi Membuat PRD",
    href: "/studio/prd",
    description: "Fungsi untuk membuat dokumen Product Requirement Document (PRD) komprehensif & hierarki arsitektur modul.",
    accent: "from-amber-400 to-orange-400",
  },
  {
    id: "02",
    icon: Database,
    name: "Build App",
    label: "Build App",
    tagline: "Fungsi Membuat Fullstack",
    href: "/studio/fullstack",
    description: "Fungsi untuk membuat aplikasi web fullstack lengkap dengan in-memory database, logika CRUD, dan panel admin.",
    accent: "from-indigo-400 to-purple-500",
  },
  {
    id: "03",
    icon: Layout,
    name: "Desain",
    label: "Desain",
    tagline: "Fitur Desain Seperti Figma",
    href: "/studio/frontend",
    description: "Fitur desain visual seperti Figma untuk merancang wireframe, mockup interaktif, styling CSS, dan prototipe kanvas.",
    accent: "from-sky-400 to-blue-500",
  },
];

interface HeroDockProps {
  className?: string;
}

export default function HeroDock({ className }: HeroDockProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeStudio = studioItems.find((s) => s.id === hoveredId);

  return (
    <div className={cn("relative w-full flex flex-col items-center justify-center select-none", className)}>
      {/* Floating Glass Dock Capsule */}
      <div className="relative flex items-center justify-center">
        {/* Subtle Ambient Glow Behind Dock */}
        <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-r from-sky-500/10 via-white/5 to-indigo-500/10 blur-xl opacity-50 -z-10 pointer-events-none" />

        <div className="relative flex items-center gap-2.5 sm:gap-4 p-2 sm:p-2.5 rounded-[26px] sm:rounded-[30px] bg-zinc-950/70 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)]">
          {studioItems.map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredId === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "group relative flex flex-col items-center justify-center w-[74px] h-[74px] sm:w-[86px] sm:h-[86px] rounded-2xl cursor-pointer",
                  "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
                  isHovered
                    ? "-translate-y-2 scale-[1.03] bg-zinc-800/90 border border-white/20 shadow-[0_16px_32px_-6px_rgba(0,0,0,0.7),0_0_20px_rgba(255,255,255,0.06)]"
                    : "bg-zinc-900/40 border border-white/[0.05] hover:bg-zinc-800/60 hover:border-white/10"
                )}
                aria-label={item.name}
              >
                {/* Icon */}
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={cn(
                      "w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300 group-hover:scale-110",
                      isHovered ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                    )}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Specific Studio Label */}
                <span
                  className={cn(
                    "text-[11px] sm:text-xs tracking-tight transition-all duration-200 mt-1.5",
                    isHovered ? "text-white font-semibold" : "text-zinc-400 font-medium group-hover:text-zinc-300"
                  )}
                >
                  {item.label}
                </span>

                {/* Smooth Lightweight Tooltip */}
                <div
                  className={cn(
                    "pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full",
                    "bg-zinc-900/95 border border-white/10 shadow-2xl backdrop-blur-xl whitespace-nowrap z-50",
                    "transition-all duration-200 ease-out",
                    isHovered
                      ? "opacity-100 -translate-y-1 scale-100"
                      : "opacity-0 translate-y-1 scale-95"
                  )}
                >
                  <span className="text-[11px] font-semibold text-white tracking-tight">
                    {item.name}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Smooth Lightweight Studio Preview Info (Zero Layout Shift) */}
      <div className="mt-8 sm:mt-10 h-16 w-full max-w-lg mx-auto flex items-center justify-center px-4 text-center">
        {activeStudio ? (
          <div className="flex flex-col items-center gap-1.5 animate-in fade-in duration-200">
            <div className="inline-flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-tight">
                {activeStudio.name}
              </span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-400">
                {activeStudio.tagline}
              </span>
              <a
                href={activeStudio.href}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-300 hover:text-white ml-1 px-2.5 py-0.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 transition-colors"
              >
                <span>Buka</span>
                <ArrowRight size={11} />
              </a>
            </div>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
              {activeStudio.description}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-zinc-500 transition-opacity duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 animate-pulse" />
            <span className="tracking-wide">Arahkan atau klik studio untuk membuka workspace</span>
          </div>
        )}
      </div>
    </div>
  );
}
