"use client";

import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  X,
  Download,
  ArrowRight
} from "lucide-react";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PRESET_TEMPLATES, type TemplateItem } from "@/data/presetTemplates";

export interface ElasticItemProps {
  id: string;
  templateId: string;
  title: string;
  category: string;
  description: string;
  src: string;
  alt: string;
}

export function ElasticGallery() {
  const items: ElasticItemProps[] = [
    {
      id: "01",
      templateId: "lumina-store",
      title: "Lumina Storefront",
      category: "E-Commerce",
      description: "Toko online minimalis modern dengan keranjang belanja interaktif dan checkout WhatsApp otomatis.",
      src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
      alt: "Lumina Storefront E-Commerce",
    },
    {
      id: "02",
      templateId: "omnipulse-saas",
      title: "OmniPulse Dashboard",
      category: "Dashboard SaaS",
      description: "Dashboard analitik enterprise dengan metrik KPI, grafik tren SVG interaktif, dan tabel pelanggan.",
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      alt: "OmniPulse Enterprise Analytics",
    },
    {
      id: "03",
      templateId: "gusto-bistro",
      title: "Gusto Artisan Bistro",
      category: "Restoran & Kafe",
      description: "Website kuliner estetik dengan katalog menu hidangan interaktif dan form reservasi meja tamu.",
      src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
      alt: "Gusto Artisan Bistro & Cafe",
    },
    {
      id: "04",
      templateId: "apex-agency",
      title: "Apex Creative Agency",
      category: "Landing Page",
      description: "Landing page agensi digital dengan portofolio proyek klien, paket harga transparan, dan formulir konsultasi.",
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      alt: "Apex Creative Studio",
    },
    {
      id: "05",
      templateId: "medika-clinic",
      title: "Medika Health Care",
      category: "Kesehatan",
      description: "Portal klinik terpadu dengan direktori dokter spesialis dan booking janji temu pasien instan.",
      src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
      alt: "Medika Health Care",
    },
  ];

  const [activeId, setActiveId] = useState<string | null>("01");
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<TemplateItem | null>(null);
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-60px" });

  const handleOpenPreview = (templateId: string) => {
    const target = PRESET_TEMPLATES.find((t) => t.id === templateId);
    if (target) {
      setActivePreviewTemplate(target);
    }
  };

  const handleCloneToStudio = (templateId: string) => {
    const target = PRESET_TEMPLATES.find((t) => t.id === templateId);
    if (target) {
      window.location.href = `/app?template=${encodeURIComponent(target.id)}&mode=frontend`;
    }
  };

  const handleCardClick = (item: ElasticItemProps) => {
    if (activeId === item.id) {
      handleOpenPreview(item.templateId);
    } else {
      setActiveId(item.id);
    }
  };

  return (
    <div className="w-full py-8 md:py-12">
      {/* Section Header with Scroll-Driven Reveal */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-left"
      >
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight font-sans">
            Contoh Template Siap Clone
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Klik kartu untuk melihat pratinjau live interaktif atau menduplikasi langsung ke Studio AI.
          </p>
        </div>
        <a
          href="/templates"
          className="group relative inline-flex items-center justify-center overflow-hidden px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-950 transition-all cursor-pointer select-none shadow-sm shrink-0"
        >
          <span className="mr-5 transition-opacity duration-300 group-hover:opacity-0">
            Semua Template
          </span>
          <span className="absolute right-1 top-1 bottom-1 rounded-lg z-10 grid w-5 place-items-center transition-all duration-300 bg-zinc-950/10 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-zinc-950">
            <i className="fa-solid fa-chevron-right text-[9px]" aria-hidden="true"></i>
          </span>
        </a>
      </motion.div>

      {/* Container: Horizontal flex-row on all devices */}
      <div className="mx-auto flex h-[360px] sm:h-[460px] md:h-[540px] w-full flex-row gap-1.5 sm:gap-2 md:gap-3 overflow-hidden">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onClick={() => handleCardClick(item)}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-950 transform-gpu",
                "transition-[flex] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                isActive ? "flex-[3.5] sm:flex-[4] border-zinc-700 shadow-2xl" : "flex-[1]"
              )}
            >
              {/* Background Image Layer */}
              <div className="absolute inset-0 h-full w-full overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "h-full w-full object-cover transform-gpu transition-transform duration-700 ease-out",
                    isActive ? "scale-100" : "scale-105"
                  )}
                />

                {/* Lightweight Darkening Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none",
                    isActive ? "opacity-35" : "opacity-65 hover:opacity-45"
                  )}
                />

                {/* Gradient Overlay for Text Readability */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 pointer-events-none",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>

              {/* Content Container */}
              <div className="absolute bottom-0 left-0 right-0 flex h-full flex-col justify-end p-3 sm:p-5 md:p-6 pointer-events-none">
                {/* Active Content: Title & Buttons */}
                <div
                  className={cn(
                    "flex flex-col gap-1.5 sm:gap-2 transition-all duration-300 transform-gpu",
                    isActive
                      ? "translate-y-0 opacity-100 pointer-events-auto"
                      : "translate-y-6 opacity-0 pointer-events-none"
                  )}
                >
                  {/* Category Tag */}
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {item.category}
                    </span>
                    <span className="text-[9px] text-zinc-400 hidden sm:inline-block">
                      Template Siap Pakai
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-2xl md:text-3xl font-black uppercase leading-tight text-white font-sans tracking-tight truncate">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed line-clamp-2 max-w-md hidden sm:block">
                    {item.description}
                  </p>

                  {/* Call to Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPreview(item.templateId);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white text-zinc-950 font-bold text-[10px] sm:text-xs shadow-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloneToStudio(item.templateId);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 text-blue-200 hover:text-white font-bold text-[10px] sm:text-xs transition-all cursor-pointer"
                    >
                      <span>Clone Template</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inactive Content: Vertical Title Label */}
                <div
                  className={cn(
                    "absolute transition-all duration-300",
                    "bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 md:bottom-8",
                    isActive
                      ? "opacity-0 scale-75 pointer-events-none"
                      : "opacity-100"
                  )}
                >
                  <span className="whitespace-nowrap text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-300 [writing-mode:vertical-rl] block drop-shadow-md">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULLSCREEN LIVE PREVIEW MODAL */}
      {activePreviewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          {/* Modal Top Bar */}
          <div className="h-14 bg-zinc-950 border-b border-zinc-800 px-4 sm:px-6 flex items-center justify-between shrink-0 gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="font-bold text-xs sm:text-sm text-white truncate">
                {activePreviewTemplate.title}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-medium">
                {activePreviewTemplate.category}
              </span>
            </div>

            {/* Viewport Selectors & Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewViewport("desktop")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewViewport === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewViewport("tablet")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewViewport === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewViewport("mobile")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewViewport === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Mobile View (390px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  const blob = new Blob([activePreviewTemplate.code], { type: "text/html" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${activePreviewTemplate.id}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Unduh File HTML"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unduh</span>
              </button>

              <button
                onClick={() => {
                  window.location.href = `/app?template=${encodeURIComponent(activePreviewTemplate.id)}&mode=frontend`;
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <span>Buka di Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActivePreviewTemplate(null)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
                title="Tutup Pratinjau"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="flex-1 bg-zinc-950 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
            <div
              className={`h-full bg-black rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300 ${
                previewViewport === "desktop"
                  ? "w-full"
                  : previewViewport === "tablet"
                  ? "w-[768px]"
                  : "w-[390px]"
              }`}
            >
              <iframe
                srcDoc={activePreviewTemplate.code}
                title={activePreviewTemplate.title}
                className="w-full h-full border-0 bg-zinc-950"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ElasticGallery;

