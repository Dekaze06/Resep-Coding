"use client";

import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  tag?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  align?: "left" | "center";
  direction?: "left" | "right";
  className?: string;
  sticky?: boolean;
}

export default function SectionHeader({
  tag,
  title,
  description,
  ctaText,
  ctaHref,
  align = "left",
  direction,
  className = "",
  sticky = false,
}: SectionHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Spring-smoothed scroll progress for buttery liquid motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.2,
  });

  // Subtle opposing vertical parallax with smooth spring
  const yTag = useTransform(smoothProgress, [0, 1], [-8, 8]);
  const yHeading = useTransform(smoothProgress, [0, 1], [10, -10]);

  // Directional initial offset
  const initialX = direction === "right" ? 28 : direction === "left" ? -28 : 0;

  const smoothEasing = [0.16, 1, 0.3, 1] as const;

  return (
    <div
      ref={containerRef}
      className={cn(
        "space-y-4 text-left relative",
        align === "center" && "text-center mx-auto max-w-3xl",
        sticky && "lg:sticky lg:top-24",
        className
      )}
    >
      {/* 1. Tag / Badge */}
      {tag && (
        <motion.div
          style={{ y: yTag }}
          initial={{ opacity: 0, y: -16, filter: "blur(4px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: -16, filter: "blur(4px)" }}
          transition={{ duration: 0.7, ease: smoothEasing }}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800/90 text-[11px] font-medium text-zinc-400 backdrop-blur-md shadow-sm",
            align === "center" && "mx-auto"
          )}
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span>{tag}</span>
        </motion.div>
      )}

      {/* 2. Heading with smooth blur-fade and directional slide */}
      <div className="overflow-hidden">
        <motion.h2
          style={{ y: yHeading }}
          initial={{ opacity: 0, x: initialX, y: 24, filter: "blur(6px)" }}
          animate={
            isInView
              ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
              : { opacity: 0, x: initialX, y: 24, filter: "blur(6px)" }
          }
          transition={{ duration: 0.85, delay: 0.06, ease: smoothEasing }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight font-sans"
        >
          {title}
        </motion.h2>
      </div>

      {/* 3. Description with smooth blur-fade */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 18, filter: "blur(4px)" }}
          transition={{ duration: 0.75, delay: 0.15, ease: smoothEasing }}
          className={cn(
            "text-xs sm:text-sm text-zinc-400 leading-relaxed",
            align === "center" ? "max-w-2xl mx-auto" : "max-w-md"
          )}
        >
          {description}
        </motion.p>
      )}

      {/* 4. Optional CTA Button */}
      {ctaText && ctaHref && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.6, delay: 0.22, ease: smoothEasing }}
          className="pt-2"
        >
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-all shadow-sm group cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      )}
    </div>
  );
}
