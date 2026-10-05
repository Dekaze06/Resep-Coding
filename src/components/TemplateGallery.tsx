'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Eye,
  Code2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  X,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  ArrowLeft,
  FolderOpen,
  Share2,
  CheckCircle2
} from 'lucide-react';

export type { TemplateItem } from '../data/presetTemplates';
import { PRESET_TEMPLATES } from '../data/presetTemplates';

export function TemplateGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userTemplates, setUserTemplates] = useState<TemplateItem[]>([]);
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<TemplateItem | null>(null);
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  // Load User Generated Templates from LocalStorage
  useEffect(() => {
    try {
      const storeRaw =
        localStorage.getItem("satusite_projects_store") ||
        localStorage.getItem("emergent_projects_store") ||
        localStorage.getItem("webDevProjectsStore");
      if (storeRaw) {
        const parsed = JSON.parse(storeRaw);
        const projects = parsed.projects || {};
        const list: TemplateItem[] = Object.keys(projects).map((k) => {
          const p = projects[k];
          return {
            id: p.id || k,
            title: p.name || "Aplikasi Kustom",
            category: "Karya Anda",
            description: p.prompt || "Aplikasi web yang dibuat melalui AI Agent Studio.",
            tags: ["AI Generated", "Kustom", "HTML5"],
            rating: 5.0,
            downloads: 1,
            previewGradient: "from-blue-600/30 via-indigo-950/40 to-black",
            code: p.code || "",
            isUserGenerated: true,
          };
        }).filter(item => Boolean(item.code));
        setUserTemplates(list);
      }
    } catch (e) {
      console.error("Failed to load user templates:", e);
    }
  }, []);

  const allTemplates = useMemo(() => {
    return [...userTemplates, ...PRESET_TEMPLATES];
  }, [userTemplates]);

  const categories = useMemo(() => {
    const cats = new Set<string>(["Semua"]);
    if (userTemplates.length > 0) cats.add("Karya Anda");
    PRESET_TEMPLATES.forEach((t) => cats.add(t.category));
    return Array.from(cats);
  }, [userTemplates]);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      const matchesCat =
        selectedCategory === "Semua" || t.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCat && matchesSearch;
    });
  }, [allTemplates, selectedCategory, searchQuery]);

  const handleCopyCode = (template: TemplateItem) => {
    navigator.clipboard.writeText(template.code);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCode = (template: TemplateItem) => {
    const blob = new Blob([template.code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUseInStudio = (template: TemplateItem) => {
    window.location.href = `/app?template=${encodeURIComponent(template.id)}&mode=frontend`;
  };

  return (
    <div
      className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-blue-500/30 selection:text-blue-200"
      style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div className="flex items-center gap-2">
            <span className="font-agus text-sm font-normal tracking-[0.35em] text-white">
              satusitE
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              / Galeri Template
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/app"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <span>Buka Studio AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative px-6 pt-16 pb-12 max-w-6xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Pustaka Template Website Siap Pakai
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Pilih template mandiri beresolusi tinggi, buka pratinjau langsung, unduh file HTML mandiri, atau lanjutkan kustomisasi secara instan di Studio AI.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari template (contoh: Toko Online, Restoran, SaaS, Portofolio)..."
              className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-blue-500 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 p-1 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Template Grid */}
      <section className="px-6 pb-24 max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-500">
          <span>Menampilkan {filteredTemplates.length} Template</span>
          <span>Pratinjau & Unduh Instan</span>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border border-zinc-800/60 bg-zinc-950/40 space-y-3">
            <FolderOpen className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-zinc-300 font-semibold text-sm">Tidak ada template yang cocok</p>
            <p className="text-zinc-500 text-xs">Coba gunakan kata kunci pencarian yang berbeda atau reset filter kategori.</p>
            <button
              onClick={() => { setSelectedCategory("Semua"); setSearchQuery(""); }}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 text-xs text-white hover:bg-zinc-700 mt-2"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative rounded-xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950/70 hover:border-zinc-700 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl"
              >
                {/* Visual Thumbnail / Preview Area */}
                <div
                  onClick={() => setActivePreviewTemplate(template)}
                  className={`h-28 sm:h-48 w-full bg-gradient-to-br ${template.previewGradient} relative p-2.5 sm:p-4 flex flex-col justify-between cursor-pointer overflow-hidden border-b border-zinc-800/60`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-medium text-zinc-300">
                      {template.category}
                    </span>
                    {template.isUserGenerated && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] sm:text-[10px] font-medium">
                        Karya Anda
                      </span>
                    )}
                  </div>

                  {/* Simulated Card Content in Thumbnail */}
                  <div className="z-10 text-left space-y-0.5 sm:space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors drop-shadow-md line-clamp-1 sm:line-clamp-2">
                      {template.title}
                    </h4>
                  </div>

                  {/* Hover Overlay with Live Preview Button */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                    <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white text-zinc-950 font-bold text-[10px] sm:text-xs flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Live Preview</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {template.description}
                    </p>

                    {/* Tag Badges */}
                    <div className="hidden sm:flex flex-wrap gap-1.5 pt-1">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 sm:pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyCode(template)}
                        className="p-1.5 sm:p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Salin Kode HTML"
                      >
                        {copiedId === template.id ? (
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadCode(template)}
                        className="p-1.5 sm:p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Unduh File HTML"
                      >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleUseInStudio(template)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-[10px] sm:text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                      title="Buka di Studio"
                    >
                      <span className="hidden sm:inline">Buka Studio</span>
                      <span className="sm:hidden">Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FULLSCREEN LIVE PREVIEW MODAL */}
      {activePreviewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          {/* Modal Top Bar */}
          <div className="h-14 bg-zinc-950 border-b border-zinc-800 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-white truncate max-w-xs sm:max-w-md">
                {activePreviewTemplate.title}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-medium">
                {activePreviewTemplate.category}
              </span>
            </div>

            {/* Viewport & View Mode Selectors */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewViewport("desktop")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    previewViewport === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Desktop (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewViewport("tablet")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    previewViewport === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewViewport("mobile")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    previewViewport === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Mobile (390px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tab Switcher: Preview vs Code */}
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                    activeTab === "preview" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                    activeTab === "code" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  <span>Code</span>
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={() => handleUseInStudio(activePreviewTemplate)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
              >
                <span>Edit di Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => setActivePreviewTemplate(null)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Tutup Pratinjau"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="flex-1 bg-zinc-950 p-4 sm:p-6 overflow-hidden flex items-center justify-center">
            {activeTab === "preview" ? (
              <div
                className={`h-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300 ${
                  previewViewport === "mobile"
                    ? "w-[390px]"
                    : previewViewport === "tablet"
                    ? "w-[768px]"
                    : "w-full"
                }`}
              >
                <iframe
                  srcDoc={activePreviewTemplate.code}
                  title="Template Preview"
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
                />
              </div>
            ) : (
              <div className="w-full h-full max-w-5xl rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 overflow-auto font-mono text-xs text-zinc-300 leading-relaxed select-text">
                <pre className="whitespace-pre-wrap">{activePreviewTemplate.code}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateGallery;
