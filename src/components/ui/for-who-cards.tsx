"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Store, Code2, Check } from "lucide-react";

const smoothEasing = [0.16, 1, 0.3, 1] as const;

export default function ForWhoCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-60px" });

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Card 1: For Laypersons / Business */}
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(6px)", scale: 0.98 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
            : { opacity: 0, y: 28, filter: "blur(6px)", scale: 0.98 }
        }
        transition={{ duration: 0.75, delay: 0.05, ease: smoothEasing }}
        whileHover={{}}
        className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-5 hover:border-zinc-700/90 transition-colors shadow-sm hover:bg-zinc-900/60"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-base font-sans">
              Untuk Pemula & Pelaku Usaha
            </h4>
            <p className="text-zinc-500 text-[11px]">
              Kemudahan tanpa perlu belajar coding
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-zinc-300">
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span>
              <strong>Pemesanan WhatsApp Otomatis</strong>: Tombol langsung terhubung ke nomor WhatsApp admin dengan template pesan siap kirim.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span>
              <strong>Desain Rapi & Responsif</strong>: Tampilan otomatis menyesuaikan layar smartphone, tablet, dan laptop pelanggan.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span>
              <strong>Revisi Lewat Chat</strong>: Mau ganti warna atau ubah tulisan? Cukup ketik permintaannya di chat asisten.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span>
              <strong>Bebas Biaya Berlangganan Ekspor</strong>: File website bisa Anda download gratis dan menjadi milik Anda 100%.
            </span>
          </li>
        </ul>
      </motion.div>

      {/* Card 2: For Developers */}
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(6px)", scale: 0.98 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
            : { opacity: 0, y: 28, filter: "blur(6px)", scale: 0.98 }
        }
        transition={{ duration: 0.75, delay: 0.15, ease: smoothEasing }}
        whileHover={{}}
        className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-5 hover:border-zinc-700/90 transition-colors shadow-sm hover:bg-zinc-900/80"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
          <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base font-sans">
              Untuk Developer & Tech Leads
            </h4>
            <p className="text-zinc-500 text-[11px]">
              Kecepatan prototyping dengan kode bersih
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-zinc-300">
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span>
              <strong>Standard Clean HTML5 & Tailwind CSS</strong>: Struktur kode modern tanpa dependensi berat yang membingungkan.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span>
              <strong>Live Code Editor</strong>: Edit kode secara langsung di tab Code dengan hot-reload pratinjau seketika.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span>
              <strong>Mock Database JSON</strong>: Struktur data in-memory yang mudah di-mapping ke REST API atau backend SQL Anda.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span>
              <strong>Single-File Portable Bundle</strong>: Mudah di-deploy ke Vercel, Netlify, cPanel, atau GitHub Pages dalam hitungan detik.
            </span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
