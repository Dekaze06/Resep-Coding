"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, Layers, Download } from "lucide-react";

interface StepItem {
  number: string;
  title: string;
  description: string;
  benefits: string[];
  icon: React.ElementType;
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "Tulis Keinginan Anda",
    description:
      "Cukup ketik jenis website, warna, dan fitur apa saja yang Anda butuhkan dengan bahasa sehari-hari.",
    benefits: [
      "Mendukung bahasa Indonesia & Inggris",
      "Deteksi otomatis kategori bisnis",
      "Riwayat prompt tersimpan untuk akses cepat",
    ],
    icon: Sparkles,
  },
  {
    number: "02",
    title: "AI Merancang & Build",
    description:
      "AI menyusun tata letak responsif, merangkai logika tombol dan form, lalu menyajikannya instan.",
    benefits: [
      "Pemilihan palet warna kurasi modern",
      "Logika interaktif tombol, form & navigasi",
      "Preview langsung di desktop & mobile",
    ],
    icon: Layers,
  },
  {
    number: "03",
    title: "Pakai & Unduh File",
    description:
      "Uji coba tampilan di HP dan laptop. Unduh file HTML mandiri untuk diunggah ke hosting tanpa batasan.",
    benefits: [
      "File HTML/CSS/JS mandiri tanpa dependensi",
      "Deploy ke Vercel, Netlify, atau GitHub",
      "100% hak cipta milik Anda sepenuhnya",
    ],
    icon: Download,
  },
];

const smoothEasing = [0.16, 1, 0.3, 1] as const;

function StepCard({
  step,
  index,
  isInView,
}: {
  step: StepItem;
  index: number;
  isInView: boolean;
}) {
  const IconComponent = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(6px)", scale: 0.97 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
          : { opacity: 0, y: 28, filter: "blur(6px)", scale: 0.97 }
      }
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: smoothEasing,
      }}
      className={cn(
        "relative bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 flex flex-col justify-between",
        "min-w-[82vw] xs:min-w-[300px] sm:min-w-0 snap-center shrink-0 sm:shrink",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] sm:hover:scale-[1.03] hover:bg-zinc-900/70 hover:shadow-xl hover:shadow-zinc-950/60",
        "group"
      )}
    >
      {/* Icon & Mobile step badge */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 text-zinc-300 flex items-center justify-center group-hover:text-white transition-colors">
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="sm:hidden font-mono text-[11px] font-bold text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
            Langkah {step.number}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 sm:space-y-2">
          <h4 className="text-sm sm:text-base font-semibold text-white font-sans tracking-tight">
            {step.title}
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>

      {/* Benefits List */}
      <ul className="space-y-2 pt-2.5 sm:pt-3 border-t border-zinc-800/50">
        {step.benefits.map((benefit, bIdx) => (
          <li key={bIdx} className="flex items-center gap-2">
            <div className="flex h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700/50 group-hover:bg-zinc-600/60 transition-colors">
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 group-hover:bg-zinc-300 transition-colors" />
            </div>
            <span className="text-[10.5px] sm:text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors leading-snug">
              {benefit}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function HowItWorksCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-60px" });

  return (
    <div ref={containerRef} className="space-y-4 sm:space-y-5">
      {/* Step Number Indicators with Connecting Line (Desktop) */}
      <div className="hidden sm:block relative w-full max-w-full">
        {/* Connecting horizontal line */}
        <div
          aria-hidden="true"
          className="absolute left-[16.6667%] top-1/2 h-px w-[66.6667%] -translate-y-1/2 bg-zinc-800"
        />
        <div className="relative grid grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.6 }
              }
              transition={{
                duration: 0.5,
                delay: index * 0.12 + 0.1,
                ease: smoothEasing,
              }}
              className="flex items-center justify-center justify-self-center"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 font-mono font-semibold text-xs text-zinc-300 ring-4 ring-zinc-950">
                {step.number}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Step Cards: Horizontal Slide on Mobile, Grid on Tablet/Desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory pb-3 sm:pb-0 gap-3.5 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible scrollbar-none px-0.5">
        {steps.map((step, index) => (
          <StepCard
            key={step.number}
            step={step}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>
    </div>
  );
}
