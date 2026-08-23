"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, ArrowUpRight, Layers } from "lucide-react";

export interface CardScrollRevealProps {
  src?: string;
  alt?: string;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  height?: string;
  fromWidth?: string;
  toWidth?: string;
  fromRadius?: string;
  toRadius?: string;
  fromScale?: number;
  toScale?: number;
  className?: string;
  isStudio?: boolean;
}

export function CardScrollReveal({
  src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop",
  alt = "AI Agent Canvas Preview",
  badgeText = "AI Agent Studio",
  title = "Generasi Website & Aplikasi Real-Time",
  subtitle = "AI Agent merancang UI, kode HTML/CSS/JS mandiri, dan integrasi data otomatis",
  height = "240px",
  className = "",
  isStudio = false,
}: CardScrollRevealProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      <div
        className="w-full relative rounded-2xl sm:rounded-[26px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#07040d] overflow-hidden group cursor-pointer select-none transition-all duration-300 hover:border-purple-500/40"
        style={{
          height: isStudio ? "190px" : height,
          margin: "0 auto",
        }}
      >
        {/* Background Zoom Image (Purple / Magenta Fluid Waves Wallpaper) */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover opacity-90 brightness-95 contrast-110 transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Ambient Purple/Magenta Fluid Mesh Gradients */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 85% 20%, rgba(168, 85, 247, 0.45) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 15% 85%, rgba(6, 182, 212, 0.3) 0%, transparent 55%),
              radial-gradient(ellipse 80% 50% at 50% 100%, rgba(88, 28, 135, 0.55) 0%, transparent 65%),
              linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.4) 100%)
            `,
          }}
        />

        {/* Top Left Badge: Capsule Pill */}
        <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-lg transition-transform group-hover:scale-105">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="tracking-tight font-medium">{badgeText}</span>
        </div>

        {/* Top Right Floating Arrow Icon */}
        <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-white group-hover:bg-purple-600/40 group-hover:border-purple-400/50 group-hover:scale-110 transition-all shadow-lg">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* Bottom Left Content Info */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 z-10 text-left space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-md">
              {title}
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed drop-shadow pl-7.5">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CardScrollReveal;
