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
      { text: "Unlimited AI Token + Engine Gemini Pro & Claude", included: true },
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
    <div ref={containerRef} className={cn("max-w-7xl mx-auto space-y-12 relative z-10", className)}>
      {/* Header with Switcher */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight font-sans">
            Investasi Sesuai Kebutuhan Anda
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Mulai gratis tanpa komitmen atau tingkatkan ke paket Pro & Max untuk membuka akses unduh kode, arsitektur PRD, deploy cloud, dan integrasi GitHub.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer select-none",
                  !isAnnual ? "text-white bg-zinc-800 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer select-none",
                  isAnnual ? "text-white bg-zinc-800 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <span>Tahunan</span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-white border border-white/10 text-[10px] font-medium">
                  Hemat 20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
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
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={cn(
                "relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 group",
                plan.featured
                  ? "bg-zinc-900/90 border-2 border-zinc-500/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-zinc-500/20"
                  : "bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60 shadow-xl"
              )}
            >
              {/* Popular Pill Badge */}
              {plan.featured && plan.popularBadge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-zinc-950 font-bold text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-zinc-950 text-zinc-950" />
                  <span>{plan.popularBadge}</span>
                </div>
              )}

              {/* Card Header & Content */}
              <div className="space-y-6">
                {/* Category Badge & Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-medium border",
                        plan.featured
                          ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                      )}
                    >
                      {plan.badge}
                    </span>
                    {plan.featured && (
                      <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                        <Shield className="w-3 h-3 text-zinc-400" />
                        Garansi Aktif
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display with AnimatePresence */}
                <div className="pt-2 pb-4 border-b border-zinc-800/80">
                  <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans"
                      >
                        {formatIDR(price)}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-xs text-zinc-400">
                      {plan.monthlyPrice === 0 ? "/ selamanya" : "/ bulan"}
                    </span>
                  </div>
                  {isAnnual && plan.monthlyPrice > 0 && (
                    <p className="text-[10px] text-zinc-400 mt-1 font-mono">
                      Ditagih tahunan (Hemat {formatIDR((plan.monthlyPrice - plan.annualPrice) * 12)}/thn)
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 text-xs">
                  <p
                    className={cn(
                      "text-[11px] font-medium uppercase tracking-wider",
                      plan.featured ? "text-zinc-200" : "text-zinc-400"
                    )}
                  >
                    {plan.id === "starter"
                      ? "Fitur yang didapat:"
                      : plan.id === "pro"
                      ? "Semua fitur Gratis, ditambah:"
                      : "Semua Fitur Tanpa Batas:"}
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={cn(
                          "flex items-start gap-2.5 transition-colors",
                          !feature.included
                            ? "text-zinc-500"
                            : feature.highlight
                            ? "text-white font-medium"
                            : "text-zinc-300"
                        )}
                      >
                        {feature.included ? (
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                              plan.featured
                                ? "bg-white text-zinc-950"
                                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                            )}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-zinc-950 flex items-center justify-center shrink-0 mt-0.5 text-zinc-600 border border-zinc-800">
                            <X className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <span className={cn(!feature.included && "line-through")}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Action Button */}
              <div className="pt-6 mt-6 border-t border-zinc-800/80">
                <a
                  href={plan.ctaHref}
                  className={cn(
                    "w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none group/btn shadow-md",
                    plan.featured
                      ? "bg-white hover:bg-zinc-100 text-zinc-950 hover:shadow-white/10"
                      : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white"
                  )}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
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
