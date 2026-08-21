"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Database, LayoutTemplate, Network, Rocket, GitBranch, ShieldCheck, ArrowRight, Check } from "lucide-react";

interface ServiceItem {
  icon: React.ElementType;
  title: string;
  description: string;
  bullets: string[];
  ctaText: string;
  ctaHref: string;
  imageSrc: string;
}

const services: ServiceItem[] = [
  {
    icon: Database,
    title: "Fullstack AI",
    description: "Sistem web lengkap skema data relasional, CRUD, & storage browser.",
    bullets: ["Mock DB JSON", "Logika Bisnis"],
    ctaText: "Coba Fullstack",
    ctaHref: "/studio/fullstack",
    imageSrc:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=75",
  },
  {
    icon: LayoutTemplate,
    title: "Desain UI/UX",
    description: "Antarmuka modern responsif, animasi halus, & tombol WhatsApp.",
    bullets: ["Kurasi Tipografi", "Integrasi WA"],
    ctaText: "Rancang UI",
    ctaHref: "/studio/frontend",
    imageSrc:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=75",
  },
  {
    icon: Network,
    title: "Arsitektur PRD",
    description: "Dokumen kebutuhan produk komprehensif & mindmap interaktif.",
    bullets: ["Graph Tree Node", "Sync Kode AI"],
    ctaText: "Buat PRD",
    ctaHref: "/studio/prd",
    imageSrc:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=75",
  },
  {
    icon: Rocket,
    title: "Cloud Deploy",
    description: "Publikasi instan ke Vercel, Netlify, & Cloudflare dengan SSL.",
    bullets: ["Custom Domain", "Live Build Log"],
    ctaText: "Deploy Hub",
    ctaHref: "/deploy",
    imageSrc:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=75",
  },
  {
    icon: GitBranch,
    title: "Push GitHub",
    description: "Push bundle kode HTML/CSS/JS mandiri ke repositori GitHub.",
    bullets: ["AI Commit Msg", "Staging Tree"],
    ctaText: "GitHub Hub",
    ctaHref: "/github",
    imageSrc:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=75",
  },
  {
    icon: ShieldCheck,
    title: "Testing & QA",
    description: "Audit performa Core Web Vitals & kepatuhan aksesibilitas A11y.",
    bullets: ["Lighthouse Real-time", "0 Console Error"],
    ctaText: "Uji QA",
    ctaHref: "/testing",
    imageSrc:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=75",
  },
];

const smoothEasing = [0.16, 1, 0.3, 1] as const;

export default function ServicesGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-60px" });

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
      {services.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)", scale: 0.98 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
                : { opacity: 0, y: 24, filter: "blur(6px)", scale: 0.98 }
            }
            transition={{
              duration: 0.65,
              delay: index * 0.05,
              ease: smoothEasing,
            }}
            className="bg-zinc-900/40 rounded-xl overflow-hidden space-y-0 transition-colors hover:bg-zinc-900/70 group flex flex-col justify-between shadow-sm"
          >
            {/* Image Area */}
            <div className="relative w-full h-28 sm:h-32 overflow-hidden">
              <img
                src={item.imageSrc}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/50 to-transparent" />
              {/* Icon badge overlaid on image */}
              <div className="absolute bottom-2.5 left-3 w-7 h-7 rounded-lg bg-zinc-950/80 backdrop-blur-md text-zinc-300 flex items-center justify-center text-xs group-hover:text-white transition-colors">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Content Area */}
            <div className="p-3.5 sm:p-4 space-y-3 flex flex-col flex-1 justify-between">
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-zinc-200 transition-colors font-sans">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2.5 border-t border-zinc-800/60">
                <ul className="text-[11px] text-zinc-400 space-y-1">
                  {item.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-0.5">
                  <a
                    href={item.ctaHref}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-[11px] font-semibold transition-all inline-flex items-center justify-between shadow-sm group/btn cursor-pointer"
                  >
                    <span>{item.ctaText}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-500 group-hover/btn:text-zinc-200 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
