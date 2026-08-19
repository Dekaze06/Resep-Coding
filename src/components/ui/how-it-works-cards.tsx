"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "Tulis Keinginan Anda",
    description:
      "Cukup ketik jenis website, warna, dan fitur apa saja yang Anda butuhkan dengan bahasa sehari-hari.",
  },
  {
    number: "02",
    title: "AI Merancang & Build",
    description:
      "AI menyusun tata letak responsif, merangkai logika tombol dan form, lalu menyajikannya instan.",
  },
  {
    number: "03",
    title: "Pakai & Unduh File",
    description:
      "Uji coba tampilan di HP dan laptop. Unduh file HTML mandiri untuk diunggah ke hosting tanpa batasan.",
  },
];

const smoothEasing = [0.16, 1, 0.3, 1] as const;

export default function HowItWorksCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-60px" });

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {steps.map((step, index) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 28, filter: "blur(6px)", scale: 0.98 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
              : { opacity: 0, y: 28, filter: "blur(6px)", scale: 0.98 }
          }
          transition={{
            duration: 0.7,
            delay: index * 0.1,
            ease: smoothEasing,
          }}
          whileHover={{}}
          className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-zinc-700/90 transition-colors flex flex-col justify-between shadow-sm hover:bg-zinc-900/60"
        >
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 font-bold text-xs">
              {step.number}
            </div>
            <h4 className="text-sm font-semibold text-white font-sans">
              {step.title}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
