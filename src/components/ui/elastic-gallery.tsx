"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface ElasticItemProps {
  id: string;
  title: string;
  category: string;
  src: string;
  alt: string;
}

export function ElasticGallery() {
  const items: ElasticItemProps[] = [
    {
      id: "01",
      title: "Neon Cyber",
      category: "Photography",
      src: "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
      alt: "Neon lights",
    },
    {
      id: "02",
      title: "Urban Brutalism",
      category: "Architecture",
      src: "https://images.pexels.com/photos/2224424/pexels-photo-2224424.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
      alt: "Brutalist architecture",
    },
    {
      id: "03",
      title: "Abstract Fluid",
      category: "Design",
      src: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
      alt: "Abstract fluid art",
    },
    {
      id: "04",
      title: "Silent Nature",
      category: "Landscape",
      src: "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
      alt: "Misty forest",
    },
    {
      id: "05",
      title: "Future Tech",
      category: "Innovation",
      src: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
      alt: "Futuristic technology",
    },
  ];

  const [activeId, setActiveId] = useState<string | null>("01");
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-60px" });

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
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight font-sans">
            Contoh Template Siap Clone
          </h3>
        </div>
        <a
          href="/studio"
          className="group relative inline-flex items-center justify-center overflow-hidden px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-950 transition-all cursor-pointer select-none shadow-sm"
        >
          <span className="mr-5 transition-opacity duration-300 group-hover:opacity-0">
            Open Studio
          </span>
          <span className="absolute right-1 top-1 bottom-1 rounded-lg z-10 grid w-5 place-items-center transition-all duration-300 bg-zinc-950/10 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-zinc-950">
            <i className="fa-solid fa-chevron-right text-[9px]" aria-hidden="true"></i>
          </span>
        </a>
      </motion.div>

      {/* Container: Horizontal flex-row on all devices */}
      <div className="mx-auto flex h-[340px] sm:h-[440px] md:h-[540px] w-full flex-row gap-1.5 sm:gap-2 md:gap-3 overflow-hidden">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-950 transform-gpu",
                // Hardware accelerated flex transitions
                "transition-[flex] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                isActive ? "flex-[3.5] sm:flex-[4]" : "flex-[1]"
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
                    isActive ? "opacity-20" : "opacity-60 hover:opacity-40"
                  )}
                />

                {/* Gradient Overlay for Text Readability */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-300 pointer-events-none",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>

              {/* Content Container */}
              <div className="absolute bottom-0 left-0 right-0 flex h-full flex-col justify-end p-2.5 sm:p-4 md:p-6 pointer-events-none">
                {/* Active Content: Title & Button */}
                <div
                  className={cn(
                    "flex flex-col gap-1 sm:gap-2 transition-all duration-300 transform-gpu",
                    isActive
                      ? "translate-y-0 opacity-100 pointer-events-auto"
                      : "translate-y-6 opacity-0 pointer-events-none"
                  )}
                >
                  {/* Category Tag */}
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-black/60 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-medium uppercase tracking-wider text-white md:px-3 md:text-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-tight text-white font-sans tracking-tight truncate">
                    {item.title}
                  </h3>

                  {/* Call to Action */}
                  <a
                    href="/studio"
                    className="mt-1 sm:mt-2 inline-flex items-center gap-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-white/90 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Clone Template</span>
                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </a>
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
                  <span className="whitespace-nowrap text-[10px] sm:text-sm font-bold uppercase tracking-widest text-zinc-300 [writing-mode:vertical-rl] block">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ElasticGallery;

