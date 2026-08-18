"use client";

import React, { useRef } from "react";
import ScrollRevealImage from "@/components/ui/scroll-reveal-image";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1707978813846-dbf6c4dfbbe3?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0",
    alt: "Landscape — wide cinematic shot",
    height: "85vh",
  },
  {
    src: "https://images.unsplash.com/photo-1759834857095-4e172a6d03f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0",
    alt: "Portrait — vertical composition",
    height: "90vh",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0",
    alt: "Panoramic — mountain range",
    height: "75vh",
  },
];

export function ScrollRevealImageDemo({
  fromWidth = "40vw",
  toWidth = "95vw",
  fromScale = 1.6,
  toScale = 1,
  fromRadius = "0px",
  toRadius = "22px",
  stiffness = 120,
  damping = 80,
}: {
  fromWidth?: string;
  toWidth?: string;
  fromScale?: number;
  toScale?: number;
  fromRadius?: string;
  toRadius?: string;
  stiffness?: number;
  damping?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="w-full relative">
      <div className="flex flex-col gap-24 py-16">
        {IMAGES.map((img) => (
          <ScrollRevealImage
            key={img.src}
            src={img.src}
            alt={img.alt}
            height={img.height}
            fromWidth={fromWidth}
            toWidth={toWidth}
            innerWidth="95vw"
            fromScale={fromScale}
            toScale={toScale}
            fromRadius={fromRadius}
            toRadius={toRadius}
            stiffness={stiffness}
            damping={damping}
          />
        ))}
      </div>
    </div>
  );
}

export default ScrollRevealImageDemo;
