"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";
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
      src: "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
      alt: "Neon lights",
    },
    {
      id: "02",
      title: "Urban Brutalism",
      category: "Architecture",
      src: "https://images.pexels.com/photos/2224424/pexels-photo-2224424.jpeg",
      alt: "Brutalist architecture",
    },
    {
      id: "03",
      title: "Abstract Fluid",
      category: "Design",
      src: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
      alt: "Abstract fluid art",
    },
    {
      id: "04",
      title: "Silent Nature",
      category: "Landscape",
      src: "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg",
      alt: "Misty forest",
    },
    {
      id: "05",
      title: "Future Tech",
      category: "Innovation",
      src: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
      alt: "Futuristic technology",
    },
  ];

  const [activeId, setActiveId] = useState<string | null>("03");
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: false, margin: "-60px" });

  return (
    <div className="w-full py-8 md:py-12">
      {/* Section Header with Scroll-Driven Reveal */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-left"
      >
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight font-sans">
            Contoh Template Siap Clone
          </h3>
        </div>
        <a
          href="/app"
          className="group relative inline-flex items-center justify-center overflow-hidden px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-950 transition-all cursor-pointer select-none shadow-sm"
        >
          <span className="mr-5 transition-opacity duration-500 group-hover:opacity-0">
            Open Studio
          </span>
          <span className="absolute right-1 top-1 bottom-1 rounded-lg z-10 grid w-5 place-items-center transition-all duration-500 bg-zinc-950/10 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-zinc-950">
            <i className="fa-solid fa-chevron-right text-[9px]" aria-hidden="true"></i>
          </span>
        </a>
      </motion.div>

      {/* Container: Fixed height on mobile/desktop to ensure animation stability */}
      <div className="mx-auto flex h-[500px] w-full flex-col gap-2 md:h-[580px] md:flex-row md:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={() => setActiveId(item.id)} // Touch support
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950",
              // Layout & Flex Transition
              "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
              // Flex Logic:
              // If active, take up 4 parts of space. If inactive, take 1 part.
              // This creates the "accordion" effect relative to siblings.
              activeId === item.id ? "flex-[4]" : "flex-[1]",
              // Brightness logic for focus
              activeId === item.id
                ? "brightness-100"
                : "brightness-50 hover:brightness-75"
            )}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 h-full w-full overflow-hidden">
              <img
                src={item.src}
                alt={item.alt}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-1000",
                  // Subtle zoom on active
                  activeId === item.id ? "scale-100" : "scale-110"
                )}
              />
              {/* Gradient Overlay for Text Readability */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500",
                  activeId === item.id ? "opacity-100" : "opacity-0"
                )}
              />
            </div>

            {/* --- Content Container --- */}
            <div className="absolute bottom-0 left-0 right-0 flex h-full flex-col justify-end p-4 md:p-8 pointer-events-none">
              {/* Active Content: Title & Button */}
              <div
                className={cn(
                  "flex flex-col gap-2 transition-all duration-500",
                  // Hide/Show based on active state with translation for smooth entry
                  activeId === item.id
                    ? "translate-y-0 opacity-100 delay-200 pointer-events-auto"
                    : "translate-y-12 opacity-0"
                )}
              >
                {/* Category Tag */}
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md md:px-3 md:text-xs">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black uppercase leading-none text-white md:text-4xl lg:text-5xl font-sans tracking-tight">
                  {item.title}
                </h3>

                {/* Call to Action */}
                <a
                  href="/app"
                  className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/90 hover:text-white md:mt-4 md:text-sm transition-colors cursor-pointer"
                >
                  View Project{" "}
                  <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
                </a>
              </div>

              {/* Inactive Content: Vertical Text (Desktop) / Short Label (Mobile) */}
              <div
                className={cn(
                  "absolute transition-all duration-500",
                  // Position logic
                  "bottom-4 left-1/2 -translate-x-1/2 md:bottom-8",
                  // Hide when active
                  activeId === item.id
                    ? "opacity-0 scale-50"
                    : "opacity-100 delay-500"
                )}
              >
                {/* Desktop: Vertical Text */}
                <span className="hidden whitespace-nowrap text-lg font-bold uppercase tracking-widest text-zinc-300 [writing-mode:vertical-rl] md:block">
                  {item.title}
                </span>

                {/* Mobile: Horizontal ID/Label */}
                <span className="block text-xs font-bold text-zinc-300 md:hidden">
                  {item.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ElasticGallery;
