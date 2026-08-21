"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Store, Code2, Check } from "lucide-react";

interface TimelineEntry {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  content: {
    description: string;
    features: {
      label: string;
      detail: string;
    }[];
  };
}

const timelineData: TimelineEntry[] = [
  {
    title: "Pemula & Pelaku Usaha",
    subtitle: "Kemudahan tanpa perlu belajar coding",
    icon: Store,
    content: {
      description:
        "Solusi instan bagi pemilik bisnis, UMKM, dan siapa saja yang ingin memiliki website profesional tanpa menyentuh satu baris kode pun.",
      features: [
        {
          label: "Pemesanan WhatsApp Otomatis",
          detail:
            "Tombol langsung terhubung ke nomor WhatsApp admin dengan template pesan siap kirim.",
        },
        {
          label: "Desain Rapi & Responsif",
          detail:
            "Tampilan otomatis menyesuaikan layar smartphone, tablet, dan laptop pelanggan.",
        },
        {
          label: "Revisi Lewat Chat",
          detail:
            "Mau ganti warna atau ubah tulisan? Cukup ketik permintaannya di chat asisten.",
        },
        {
          label: "Bebas Biaya Berlangganan Ekspor",
          detail:
            "File website bisa Anda download gratis dan menjadi milik Anda 100%.",
        },
      ],
    },
  },
  {
    title: "Developer & Tech Leads",
    subtitle: "Kecepatan prototyping dengan kode bersih",
    icon: Code2,
    content: {
      description:
        "Kanvas fleksibel berkecepatan tinggi untuk merancang prototipe, memvalidasi arsitektur, dan menghasilkan kode produksi dalam hitungan detik.",
      features: [
        {
          label: "Standard Clean HTML5 & Tailwind CSS",
          detail:
            "Struktur kode modern tanpa dependensi berat yang membingungkan.",
        },
        {
          label: "Live Code Editor",
          detail:
            "Edit kode secara langsung di tab Code dengan hot-reload pratinjau seketika.",
        },
        {
          label: "Mock Database JSON",
          detail:
            "Struktur data in-memory yang mudah di-mapping ke REST API atau backend SQL Anda.",
        },
        {
          label: "Single-File Portable Bundle",
          detail:
            "Mudah di-deploy ke Vercel, Netlify, cPanel, atau GitHub Pages dalam hitungan detik.",
        },
      ],
    },
  },
];

export default function ForWhoCards() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans" ref={containerRef}>
      <div ref={ref} className="relative">
        {timelineData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="flex justify-start pt-8 md:pt-28 md:gap-8"
            >
              {/* Left: Sticky dot + title (desktop) */}
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-28 self-start max-w-xs lg:max-w-sm md:w-full">
                {/* Timeline dot */}
                <div className="h-9 absolute left-3 md:left-3 w-9 rounded-full bg-zinc-950 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                  </div>
                </div>
                {/* Desktop title */}
                <h3 className="hidden md:block text-xl md:text-3xl lg:text-4xl font-bold text-zinc-500 md:pl-20 tracking-tight">
                  {item.title}
                </h3>
              </div>

              {/* Right: Content card */}
              <div className="relative pl-20 pr-0 md:pl-4 w-full">
                {/* Mobile title */}
                <h3 className="md:hidden block text-xl mb-4 text-left font-bold text-zinc-500 tracking-tight">
                  {item.title}
                </h3>

                {/* Content card */}
                <div className="bg-zinc-900/40 rounded-2xl p-5 sm:p-6 space-y-5 transition-colors hover:bg-zinc-900/60 group">
                  {/* Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/60">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 text-zinc-300 flex items-center justify-center group-hover:text-white transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[11px] font-medium">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {item.content.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {item.content.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800/80 mt-0.5 group-hover:bg-zinc-700/80 transition-colors">
                          <Check className="w-2.5 h-2.5 text-zinc-400" />
                        </div>
                        <span className="text-xs text-zinc-300 leading-relaxed">
                          <strong className="text-zinc-200 font-semibold">
                            {feature.label}
                          </strong>
                          : {feature.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}

        {/* Vertical progress line */}
        <div
          style={{ height: height + "px" }}
          className={cn(
            "absolute left-8 md:left-8 top-0 overflow-hidden w-[2px]",
            "bg-gradient-to-b from-transparent via-zinc-800 to-transparent",
            "[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          )}
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-zinc-400 via-zinc-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
