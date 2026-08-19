import React from "react";
import { PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqData = [
  {
    question: "Apakah saya harus bisa koding untuk memakai satusitE Studio?",
    answer:
      "Sama sekali tidak. Anda cukup mengetikkan apa yang ingin Anda buat dalam kalimat biasa (misalnya: 'Buatkan landing page SaaS manajemen inventaris dengan pricing table dan form kontak'). AI Agent akan otomatis menyusun arsitektur, mendesain antarmuka, dan mengompilasi kode mandiri siap pakai.",
  },
  {
    question: "Bagaimana cara menggunakan file website setelah diunduh?",
    answer:
      "File yang diunduh berformat file HTML/CSS/JS mandiri (.html) atau arsip .zip lengkap. Anda cukup mengklik dua kali file tersebut di komputer untuk langsung membukanya di browser apa pun, atau mengunggahnya ke hosting modern seperti Vercel, Netlify, Cloudflare Pages, hingga cPanel.",
  },
  {
    question: "Apa perbedaan mode PRD, Frontend, dan Fullstack di Studio?",
    answer:
      "Mode PRD menyusun dokumen spesifikasi teknis dan blueprint arsitektur produk. Mode Frontend memfokuskan perancangan UI/UX interaktif responsif. Mode Fullstack menghubungkan frontend dengan mock backend database, REST API, dan serverless logic.",
  },
  {
    question: "Apakah saya bisa mengedit kodenya secara manual?",
    answer:
      "Tentu saja. Di dalam Studio Workspace disediakan Live Code Editor bawaan di mana Anda dapat memeriksa, mengedit, atau menyalin kode HTML, CSS, dan JavaScript secara langsung dengan pratinjau instan (real-time preview).",
  },
  {
    question: "Apakah website yang dihasilkan sudah responsif di smartphone?",
    answer:
      "Ya, seluruh antarmuka yang dihasilkan AI mengadopsi standar modern mobile-first Tailwind CSS sehingga otomatis tampil proporsional dan rapi di smartphone, tablet, maupun layar desktop.",
  },
  {
    question: "Apakah satusitE mendukung integrasi Git dan GitHub?",
    answer:
      "Ya, melalui menu GitHub Push Hub, Anda dapat langsung menghubungkan GitHub Personal Access Token (PAT) untuk membuat repositori baru atau sinkronisasi commit ke repositori yang sudah ada secara otomatis.",
  },
  {
    question: "Bagaimana cara kerja 1-Click Cloud Deployment?",
    answer:
      "Melalui fitur Deploy Hub, Anda dapat mempublikasikan proyek ke penyedia cloud terkemuka seperti Vercel, Netlify, atau Cloudflare Pages hanya dengan satu klik dan langsung mendapatkan domain produksi live aktif.",
  },
  {
    question: "Apa perbedaan paket Gratis, Pro, dan Max?",
    answer:
      "Paket Gratis dapat digunakan untuk eksplorasi dan preview studio di browser. Paket Pro (Rp 265.000) memungkinkan Anda merancang frontend, mengunduh file bundle mandiri, dan menyusun PRD. Paket Max (Rp 2.350.000) membuka Semua Fitur termasuk Fullstack Mock Database, 1-Click Deploy, GitHub Push, dan Testing QA Suite.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="w-full py-20 lg:py-32 border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column (Sticky Sidebar Header) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="flex flex-col gap-4">
              <div>
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-xs border-zinc-800 bg-zinc-900/80 text-zinc-300"
                >
                  FAQ
                </Badge>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
                  Pertanyaan yang Sering Diajukan
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-zinc-400">
                  Semua informasi penting seputar cara kerja AI Studio, kepemilikan kode, integrasi ekosistem, hingga opsi paket langganan.
                </p>
              </div>
              <div className="pt-2">
                <a href="/about#contact">
                  <Button
                    variant="outline"
                    className="gap-2.5 rounded-xl border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold px-4 py-2.5 h-auto transition-all cursor-pointer"
                  >
                    <span>Ada pertanyaan lain? Hubungi Kami</span>
                    <PhoneCall className="w-3.5 h-3.5 text-zinc-400" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (Accordion) */}
          <div className="lg:col-span-7">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-0"
              className="w-full"
            >
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={"item-" + index}
                  className="border-b border-zinc-800/70 py-1"
                >
                  <AccordionTrigger className="hover:no-underline text-left text-sm sm:text-base font-semibold text-zinc-100 hover:text-white py-4.5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-zinc-400 leading-relaxed pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
