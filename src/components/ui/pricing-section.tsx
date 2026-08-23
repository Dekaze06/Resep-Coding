"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, X, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  id: string;
  name: string;
  badge: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  featured?: boolean;
  popularBadge?: string;
  features: {
    text: string;
    included: boolean;
    highlight?: boolean;
  }[];
  ctaText: string;
  ctaHref: string;
}

const PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Gratis",
    badge: "Starter",
    description: "Eksplorasi & uji coba kemampuan AI Studio langsung di browser tanpa biaya.",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      { text: "Visual Preview Editor Interaktif di Browser", included: true },
      { text: "Generasi Desain Cepat Prompt AI", included: true },
      { text: "50 Token Kuota Generasi Harian", included: true },
      { text: "Akses Komunitas & Dokumentasi Dasar", included: true },
      { text: "Download Full Bundle Standalone", included: false },
      { text: "1-Click Cloud Deployment (Vercel)", included: false },
      { text: "Auto-Push Repositori GitHub", included: false },
    ],
    ctaText: "Mulai Coba Gratis",
    ctaHref: "/app",
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Creator & Dev",
    description: "Desain frontend UI/UX, download kode mandiri, dan penyusunan arsitektur PRD struktur.",
    monthlyPrice: 265000,
    annualPrice: 212000,
    featured: true,
    popularBadge: "Paling Populer",
    features: [
      { text: "Bisa Desain UI/UX Frontend & Landing Page", included: true, highlight: true },
      { text: "Bisa Download Full Bundle HTML/CSS/JS Standalone", included: true, highlight: true },
      { text: "Akses Arsitektur PRD & Mindmap Struktur Interaktif", included: true, highlight: true },
      { text: "1.500 Token AI Kuota Bulanan + Antrian Cepat", included: true },
      { text: "Ekspor Dokumentasi PRD (Markdown & PDF)", included: true },
      { text: "Bebas Watermark & Hak Cipta Kode 100%", included: true },
      { text: "Deployment Cloud & GitHub Push Unlimited", included: false },
    ],
    ctaText: "Pilih Paket Pro",
    ctaHref: "/app?tier=pro",
  },
  {
    id: "max",
    name: "Max",
    badge: "Enterprise & Agency",
    description: "Solusi all-in-one tanpa batas: Semua Fitur terbuka dengan kapasitas penuh.",
    monthlyPrice: 2350000,
    annualPrice: 1880000,
    features: [
      { text: "Generasi Fullstack AI (Database Mock CRUD In-Memory)", included: true, highlight: true },
      { text: "Download Source Code & Bundle Mandiri", included: true, highlight: true },
      { text: "Arsitektur PRD & Mindmap Struktur Komprehensif", included: true, highlight: true },
      { text: "1-Click Cloud Deploy (Vercel/Netlify) + Custom Domain", included: true, highlight: true },
      { text: "Sinkronisasi & Auto-Push ke Repositori GitHub", included: true, highlight: true },
      { text: "Testing & QA Suite (Lighthouse, A11y & Simulator)", included: true },
      { text: "Unlimited AI Token + High-Speed Autonomous Neural Engine", included: true },
      { text: "Dukungan Prioritas 24/7 & Dedicated Support", included: true },
    ],
    ctaText: "Pilih Paket Max",
    ctaHref: "/app?tier=max",
  },
];

function formatIDR(amount: number): string {
  if (amount === 0) return "Rp 0";
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatCompactPrice(amount: number): string {
  if (amount === 0) return "Rp 0";
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(2).replace(".00", "")}jt`;
  if (amount >= 1000) return `Rp ${Math.round(amount / 1000)}rb`;
  return `Rp ${amount}`;
}

export function PricingSection({
  showHeader = true,
  className = "",
}: {
  showHeader?: boolean;
  className?: string;
}) {
  const [isAnnual, setIsAnnual] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  return (
    <div ref={containerRef} className={cn("max-w-7xl mx-auto space-y-8 sm:space-y-12 relative z-10", className)}>
      {/* Header with Switcher */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight font-sans">
            Investasi Sesuai Kebutuhan Anda
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Mulai gratis tanpa komitmen atau tingkatkan ke paket Pro & Max untuk membuka akses unduh kode, arsitektur PRD, deploy cloud, dan integrasi GitHub.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="pt-2 sm:pt-4 flex items-center justify-center">
            <div className="p-1 rounded-xl sm:rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold transition-all duration-300 cursor-pointer select-none",
                  !isAnnual ? "text-white bg-zinc-800 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-1.5 cursor-pointer select-none",
                  isAnnual ? "text-white bg-zinc-800 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <span>Tahunan</span>
                <span className="px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded bg-white/10 text-white border border-white/10 text-[8px] sm:text-[10px] font-medium">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pricing Cards Grid (3 Columns on Mobile & Desktop) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 lg:gap-8 items-stretch">
        {PLANS.map((plan, index) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 36 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className={cn(
                "relative rounded-xl sm:rounded-3xl p-2.5 sm:p-5 lg:p-7 flex flex-col justify-between transition-all duration-300 group",
                plan.featured
                  ? "bg-zinc-900/90 border-2 border-zinc-500/80 shadow-[0_15px_40px_rgba(0,0,0,0.85)] ring-1 ring-zinc-500/20"
                  : "bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60 shadow-xl"
              )}
            >
              {/* Popular Pill Badge */}
              {plan.featured && plan.popularBadge && (
                <div className="absolute -top-2.5 sm:-top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 sm:px-4 sm:py-1 rounded-full bg-white text-zinc-950 font-bold text-[7px] sm:text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1 whitespace-nowrap">
                  <Zap className="w-2 h-2 sm:w-3 sm:h-3 fill-zinc-950 text-zinc-950" />
                  <span>{plan.popularBadge}</span>
                </div>
              )}

              {/* Card Header & Content */}
              <div className="space-y-2.5 sm:space-y-5">
                {/* Category Badge & Title */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={cn(
                        "px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded text-[8px] sm:text-[11px] font-medium border truncate",
                        plan.featured
                          ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                      )}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-xl lg:text-2xl font-bold text-white tracking-tight truncate">
                    {plan.name}
                  </h3>
                  <p className="text-[9px] sm:text-xs text-zinc-400 leading-tight line-clamp-2 sm:line-clamp-none min-h-0 sm:min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display with AnimatePresence */}
                <div className="pt-1 pb-2 sm:pt-2 sm:pb-4 border-b border-zinc-800/80">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={price}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="sm:hidden text-xs font-extrabold text-white tracking-tight font-sans block">
                          {formatCompactPrice(price)}
                        </span>
                        <span className="hidden sm:inline text-xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight font-sans">
                          {formatIDR(price)}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                    <span className="text-[8px] sm:text-xs text-zinc-400">
                      {plan.monthlyPrice === 0 ? "/ gratis" : "/ bln"}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-1.5 sm:space-y-3 text-xs">
                  <p
                    className={cn(
                      "text-[8px] sm:text-[11px] font-medium uppercase tracking-wider truncate",
                      plan.featured ? "text-zinc-200" : "text-zinc-400"
                    )}
                  >
                    {plan.id === "starter"
                      ? "Fitur dasar:"
                      : plan.id === "pro"
                      ? "Semua fitur Pro:"
                      : "Fitur Max:"}
                  </p>
                  <ul className="space-y-1.5 sm:space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={cn(
                          "flex items-start gap-1 sm:gap-2.5 transition-colors",
                          !feature.included
                            ? "text-zinc-600"
                            : feature.highlight
                            ? "text-white font-medium"
                            : "text-zinc-300"
                        )}
                      >
                        {feature.included ? (
                          <div
                            className={cn(
                              "w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                              plan.featured
                                ? "bg-white text-zinc-950"
                                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                            )}
                          >
                            <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-zinc-950 flex items-center justify-center shrink-0 mt-0.5 text-zinc-600 border border-zinc-800">
                            <X className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                          </div>
                        )}
                        <span className={cn("text-[8px] sm:text-xs leading-tight line-clamp-2 sm:line-clamp-none", !feature.included && "line-through opacity-70")}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Action Button */}
              <div className="pt-2.5 sm:pt-6 mt-2.5 sm:mt-6 border-t border-zinc-800/80">
                <a
                  href={plan.ctaHref}
                  className={cn(
                    "w-full py-1.5 sm:py-3 px-1.5 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-[9px] sm:text-xs transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer select-none group/btn shadow-md",
                    plan.featured
                      ? "bg-white hover:bg-zinc-100 text-zinc-950 hover:shadow-white/10"
                      : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white"
                  )}
                >
                  <span className="truncate">{plan.ctaText}</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 shrink-0" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default PricingSection;
