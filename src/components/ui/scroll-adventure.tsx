import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown, Sparkles, ArrowRight, ShieldCheck, Layers, Terminal, Rocket, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScrollAdventureSlide {
  id: string;
  tag: string;
  leftBgImage?: string | null;
  rightBgImage?: string | null;
  leftContent?: {
    iconName?: string;
    heading: string;
    description: string;
    bullets?: string[];
    ctaText?: string;
    ctaHref?: string;
  } | null;
  rightContent?: {
    iconName?: string;
    heading: string;
    description: string;
    bullets?: string[];
    ctaText?: string;
    ctaHref?: string;
  } | null;
}

const defaultSlides: ScrollAdventureSlide[] = [
  {
    id: "01",
    tag: "Fase 01 - Konseptualisasi",
    leftBgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: "Evolusi Prompt ke Arsitektur",
      description: "Tulis ide dan kebutuhan sistem Anda dalam bahasa natural. Mesin AI menganalisis kebutuhan fungsional dan merancang skema komponen visual instan.",
      bullets: [
        "Analisis semantik prompt bahasa Indonesia & Inggris",
        "Penyusunan wireframe & tata letak responsif",
        "Penentuan palet warna kurasi modern & dark mode",
      ],
      ctaText: "Mulai Rancang",
      ctaHref: "/app",
    },
  },
  {
    id: "02",
    tag: "Fase 02 - Logika & Data",
    leftBgImage: null,
    rightBgImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    leftContent: {
      heading: "In-Memory Mock CRUD Database",
      description: "Bukan sekadar mockup statis. Setiap tombol, formulir input, dan tabel terhubung ke database relasional berbasis browser dengan persistensi real-time.",
      bullets: [
        "Operasi Create, Read, Update, Delete tanpa backend eksternal",
        "Filter pencarian, paginasi, dan validasi form otomatis",
        "Struktur JSON bersih yang siap diekspor ke PostgreSQL/MySQL",
      ],
      ctaText: "Eksplorasi Fullstack",
      ctaHref: "/studio/fullstack",
    },
    rightContent: null,
  },
  {
    id: "03",
    tag: "Fase 03 - Blueprint Sistem",
    leftBgImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: "PRD & Mindmap Interaktif",
      description: "Hasilkan dokumen Product Requirement Document (PRD) berstandar industri lengkap dengan visualisasi diagram hierarki sistem yang dapat diedit langsung.",
      bullets: [
        "Spesifikasi arsitektur teknis dan flow pengguna",
        "Mindmap node interaktif dengan ekspor PDF & Markdown",
        "Sinkronisasi node PRD ke modul kode generator",
      ],
      ctaText: "Lihat Generator PRD",
      ctaHref: "/studio/prd",
    },
  },
  {
    id: "04",
    tag: "Fase 04 - Otomasi Cloud",
    leftBgImage: null,
    rightBgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    leftContent: {
      heading: "1-Click Multi-Cloud Deployment",
      description: "Rilis aplikasi web Anda langsung ke Edge Network global Vercel, Netlify, atau Cloudflare dengan alokasi SSL otomatis dan custom domain.",
      bullets: [
        "Integrasi deployment tanpa konfigurasi server rumit",
        "Live build logs & verifikasi sertifikat SSL gratis",
        "Koneksi domain kustom dengan panduan DNS otomatis",
      ],
      ctaText: "Buka Deploy Hub",
      ctaHref: "/deploy",
    },
    rightContent: null,
  },
  {
    id: "05",
    tag: "Fase 05 - Produksi & Kode Mandiri",
    leftBgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: "GitHub Sync & 100% Hak Cipta",
      description: "Push kode bersih langsung ke repositori GitHub pribadi Anda atau download ZIP mandiri tanpa dependensi tersembunyi. Kode milik Anda sepenuhnya.",
      bullets: [
        "Commit pesan otomatis berbasis AI",
        "Struktur file modular HTML5, Tailwind CSS, & TypeScript",
        "Bebas watermark dan tanpa lock-in platform",
      ],
      ctaText: "Akses GitHub Hub",
      ctaHref: "/github",
    },
  },
];

export interface ScrollAdventureProps {
  slides?: ScrollAdventureSlide[];
  className?: string;
  height?: string;
}

export default function ScrollAdventure({
  slides = defaultSlides,
  className = "",
  height = "h-[640px] sm:h-[720px]",
}: ScrollAdventureProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const numOfPages = slides.length;
  const animTime = 850;
  const isScrolling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigateUp = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const navigateDown = () => {
    if (currentPage < numOfPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goToSlide = (pageIndex: number) => {
    if (pageIndex >= 1 && pageIndex <= numOfPages && !isScrolling.current) {
      isScrolling.current = true;
      setCurrentPage(pageIndex);
      setTimeout(() => {
        isScrolling.current = false;
      }, animTime);
    }
  };

  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Local wheel handler on container to prevent hijacking whole page when not focused
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isScrolling.current) return;

    // Only intercept if within boundary limits or user intentionally scrolling inside
    if (e.deltaY > 15 && currentPage < numOfPages) {
      e.preventDefault();
      isScrolling.current = true;
      navigateDown();
      setTimeout(() => {
        isScrolling.current = false;
      }, animTime);
    } else if (e.deltaY < -15 && currentPage > 1) {
      e.preventDefault();
      isScrolling.current = true;
      navigateUp();
      setTimeout(() => {
        isScrolling.current = false;
      }, animTime);
    }
  };

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null || touchStartX.current === null || isScrolling.current) return;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY.current - touchEndY;
    const diffX = touchStartX.current - touchEndX;

    // Detect vertical or horizontal swipe
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 40) {
      if (diffY > 0 && currentPage < numOfPages) {
        isScrolling.current = true;
        navigateDown();
        setTimeout(() => { isScrolling.current = false; }, animTime);
      } else if (diffY < 0 && currentPage > 1) {
        isScrolling.current = true;
        navigateUp();
        setTimeout(() => { isScrolling.current = false; }, animTime);
      }
    } else if (Math.abs(diffX) > 40) {
      if (diffX > 0 && currentPage < numOfPages) {
        isScrolling.current = true;
        navigateDown();
        setTimeout(() => { isScrolling.current = false; }, animTime);
      } else if (diffX < 0 && currentPage > 1) {
        isScrolling.current = true;
        navigateUp();
        setTimeout(() => { isScrolling.current = false; }, animTime);
      }
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  // Keyboard navigation when container is focused
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isScrolling.current) return;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      isScrolling.current = true;
      navigateUp();
      setTimeout(() => {
        isScrolling.current = false;
      }, animTime);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      isScrolling.current = true;
      navigateDown();
      setTimeout(() => {
        isScrolling.current = false;
      }, animTime);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-zinc-800 bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.8)] focus:outline-none focus:ring-1 focus:ring-zinc-700 select-none",
        height,
        className
      )}
      aria-label="Split Scroll Section Showcase"
    >
      {slides.map((slide, i) => {
        const idx = i + 1;
        const isActive = currentPage === idx;
        const isPast = currentPage > idx;

        // Opposing vertical split transition
        const leftTrans = isActive
          ? "translateY(0%)"
          : isPast
          ? "translateY(-100%)"
          : "translateY(100%)";

        const rightTrans = isActive
          ? "translateY(0%)"
          : isPast
          ? "translateY(100%)"
          : "translateY(-100%)";

        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 pointer-events-none transition-opacity duration-500",
              isActive ? "opacity-100 pointer-events-auto z-10" : "opacity-0 z-0"
            )}
          >
            {/* Left Half Curtain */}
            <div
              className="absolute top-0 left-0 w-full md:w-1/2 h-1/2 md:h-full transition-transform duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden"
              style={{ transform: leftTrans }}
            >
              {slide.leftBgImage ? (
                <div
                  className="w-full h-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${slide.leftBgImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent" />
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 backdrop-blur-md text-[11px] font-mono text-zinc-300">
                    {slide.tag}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 sm:p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-zinc-800/80 overflow-y-auto md:overflow-hidden">
                  <div className="space-y-3 sm:space-y-4 max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{slide.tag}</span>
                    </div>
                    {slide.leftContent && (
                      <>
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                          {slide.leftContent.heading}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                          {slide.leftContent.description}
                        </p>

                        {slide.leftContent.bullets && (
                          <ul className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2 text-xs text-zinc-300">
                            {slide.leftContent.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {slide.leftContent.ctaText && (
                          <div className="pt-2 sm:pt-3">
                            <a
                              href={slide.leftContent.ctaHref || "#"}
                              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-white transition-all shadow-sm group cursor-pointer"
                            >
                              <span>{slide.leftContent.ctaText}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Half Curtain */}
            <div
              className="absolute top-1/2 md:top-0 left-0 md:left-1/2 w-full md:w-1/2 h-1/2 md:h-full transition-transform duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden"
              style={{ transform: rightTrans }}
            >
              {slide.rightBgImage ? (
                <div
                  className="w-full h-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${slide.rightBgImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-l from-zinc-950/90 via-zinc-950/40 to-transparent" />
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 backdrop-blur-md text-[11px] font-mono text-zinc-300">
                    {slide.tag}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-bl from-zinc-900 via-zinc-950 to-black p-5 sm:p-8 md:p-12 flex flex-col justify-center overflow-y-auto md:overflow-hidden">
                  <div className="space-y-3 sm:space-y-4 max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{slide.tag}</span>
                    </div>
                    {slide.rightContent && (
                      <>
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                          {slide.rightContent.heading}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                          {slide.rightContent.description}
                        </p>

                        {slide.rightContent.bullets && (
                          <ul className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2 text-xs text-zinc-300">
                            {slide.rightContent.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {slide.rightContent.ctaText && (
                          <div className="pt-2 sm:pt-3">
                            <a
                              href={slide.rightContent.ctaHref || "#"}
                              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-white transition-all shadow-sm group cursor-pointer"
                            >
                              <span>{slide.rightContent.ctaText}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Floating Interactive Controls (Dots & Arrows) */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 bg-zinc-950/80 border border-zinc-800/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl">
        <button
          type="button"
          onClick={navigateUp}
          disabled={currentPage <= 1}
          className={cn(
            "w-7 h-7 rounded-xl flex items-center justify-center text-zinc-400 transition-all",
            currentPage > 1
              ? "hover:text-white hover:bg-zinc-800 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          )}
          title="Slide Sebelumnya"
          aria-label="Slide Sebelumnya"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-1.5 py-1">
          {slides.map((_, i) => {
            const idx = i + 1;
            const isActive = currentPage === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={cn(
                  "transition-all duration-300 rounded-full cursor-pointer",
                  isActive
                    ? "w-2 h-6 bg-white"
                    : "w-2 h-2 bg-zinc-700 hover:bg-zinc-500"
                )}
                title={`Ke Slide ${idx}`}
                aria-label={`Ke Slide ${idx}`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={navigateDown}
          disabled={currentPage >= numOfPages}
          className={cn(
            "w-7 h-7 rounded-xl flex items-center justify-center text-zinc-400 transition-all",
            currentPage < numOfPages
              ? "hover:text-white hover:bg-zinc-800 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          )}
          title="Slide Berikutnya"
          aria-label="Slide Berikutnya"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Counter Footer */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800/90 backdrop-blur-md text-[11px] font-mono text-zinc-400">
        <span className="text-white font-semibold">{String(currentPage).padStart(2, "0")}</span>
        <span className="text-zinc-600">/</span>
        <span>{String(numOfPages).padStart(2, "0")}</span>
        <span className="ml-2 pl-2 border-l border-zinc-800 text-[10px] text-zinc-500 hidden sm:inline">
          Gunakan scroll / panah keyboard
        </span>
      </div>
    </div>
  );
}
