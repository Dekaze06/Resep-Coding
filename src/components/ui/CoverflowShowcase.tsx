"use client";

import React from "react";
import CoverflowCarousel, { CoverflowSlide } from "@/components/ui/coverflow-carousel";

const DEFAULT_SLIDES: CoverflowSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    alt: "AI Web Studio Design",
    title: "AI Studio Canvas",
    subtitle: "Generator Website & Aplikasi Real-Time",
  },
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    alt: "Analytics Dashboard UI",
    title: "Dashboard & Metrik",
    subtitle: "Analitik Data & Integrasi Database",
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    alt: "Clean Source Code",
    title: "Ekspor Kode Bersih",
    subtitle: "HTML5, CSS3, & Fullstack JavaScript",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    alt: "E-Commerce Storefront",
    title: "Toko Online & Checkout",
    subtitle: "Katalog Dinamis & WhatsApp Checkout",
  },
  {
    src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    alt: "Responsive Landing Page",
    title: "Landing Page Bisnis",
    subtitle: "Tampilan Profesional & Konversi Tinggi",
  },
];

export interface CoverflowShowcaseProps {
  slides?: CoverflowSlide[];
  className?: string;
  showCaption?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
}

export function CoverflowShowcase({
  slides = DEFAULT_SLIDES,
  className = "",
  showCaption = true,
  showNavigation = true,
  showPagination = true,
}: CoverflowShowcaseProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto py-2 ${className}`}>
      <CoverflowCarousel
        slides={slides}
        rotate={40}
        depth={0.55}
        perspective={2.8}
        falloff={0.55}
        cardWidth="clamp(160px, 20vw, 240px)"
        gap={0.06}
        loop={true}
        showCaption={showCaption}
        showNavigation={showNavigation}
        showPagination={showPagination}
        cardClassName="border border-zinc-800 shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
      />
    </div>
  );
}

export default CoverflowShowcase;
