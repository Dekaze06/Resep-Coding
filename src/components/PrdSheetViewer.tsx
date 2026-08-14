import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { createPortal } from "react-dom"
import {
  Lightbulb,
  Download,
  Copy,
  Check,
  ArrowRight,
  ChevronRight,
  FileText,
  Sparkles,
  Layers,
  Palette,
  CheckCircle2,
  ListTodo,
  ExternalLink,
  Code2
} from "lucide-react"

declare global {
  interface Window {
    getActiveProjectPrd?: () => string | null;
    updateActiveProjectPrd?: (content: string) => void;
    openFrontendCanvas?: (prompt?: string) => void;
  }
}

export default function PrdSheetViewer() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false) // controls DOM mount
  const [content, setContent] = useState("")
  const [activeTab, setActiveTab] = useState<"visual" | "text">("visual")
  const [copied, setCopied] = useState(false)

  // Resizing state
  const [width, setWidth] = useState(650)
  const isResizing = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef(content)
  contentRef.current = content

  // Set initial width responsively
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWidth(window.innerWidth)
      } else {
        const idealWidth = Math.min(720, Math.max(560, window.innerWidth * 0.48))
        setWidth(idealWidth)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-save on close
  const handleClose = useCallback(() => {
    if (window.updateActiveProjectPrd) {
      window.updateActiveProjectPrd(contentRef.current)
    }
    setOpen(false)
    document.body.style.overflow = ""
    setTimeout(() => setVisible(false), 350)
  }, [])

  useEffect(() => {
    const handleOpenPrd = (e: any) => {
      setContent(e.detail?.markdown || "")
      setVisible(true)
      setActiveTab("visual")
      document.body.style.overflow = "hidden"
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOpen(true)
        })
      })
    }

    const handleClosePrd = () => {
      handleClose()
    }

    window.addEventListener("open-prd-sheet", handleOpenPrd)
    window.addEventListener("close-prd-sheet", handleClosePrd)

    return () => {
      window.removeEventListener("open-prd-sheet", handleOpenPrd)
      window.removeEventListener("close-prd-sheet", handleClosePrd)
    }
  }, [handleClose])

  // Resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return
      e.preventDefault()
      let newWidth = window.innerWidth - e.clientX
      if (newWidth < 350) newWidth = 350
      if (newWidth > window.innerWidth) newWidth = window.innerWidth
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "planning-blueprint.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Seamless jump to Web Canvas
  const handleLaunchCanvas = () => {
    if (window.updateActiveProjectPrd) {
      window.updateActiveProjectPrd(contentRef.current)
    }
    handleClose()

    setTimeout(() => {
      // Advance to Front-End slide (Slide index 1)
      const nextBtn = document.getElementById("btn-slide-next")
      if (nextBtn && !(nextBtn as HTMLButtonElement).disabled) {
        nextBtn.click()
      }

      // Open Canvas Studio
      setTimeout(() => {
        if (window.openFrontendCanvas) {
          window.openFrontendCanvas("Buatkan website lengkap dan profesional sesuai Planning Blueprint yang baru saja dibuat.")
        }
      }, 400)
    }, 350)
  }

  // Simple parser to extract visual summary points from the generated markdown
  const parsedBlueprint = useMemo(() => {
    if (!content) return null

    // Extract title
    const titleMatch = content.match(/#\s*(?:Planning Blueprint:?|PRD:?|Rencana:?)\s*([^\r\n]+)/i)
    const title = titleMatch ? titleMatch[1].trim() : "Rencana Website"

    // Extract tagline & category
    const taglineMatch = content.match(/\*\*Tagline[^*]*\*\*:\s*([^\r\n>]+)/i)
    const categoryMatch = content.match(/\*\*Kategori\*\*:\s*([^|>\r\n]+)/i)
    const targetMatch = content.match(/\*\*Target Pengunjung\*\*:\s*([^\r\n>]+)/i)

    // Extract sections
    const getSection = (headingRegex: RegExp) => {
      const match = content.match(headingRegex)
      return match ? match[1].trim() : ""
    }

    const conceptText = getSection(/##\s*1\.\s*[^\r\n]*Ringkasan[^\r\n]*\n([\s\S]*?)(?=##\s*2\.|$)/i)
    const sitemapText = getSection(/##\s*2\.\s*[^\r\n]*Peta Halaman[^\r\n]*\n([\s\S]*?)(?=##\s*3\.|$)/i)
    const featuresText = getSection(/##\s*3\.\s*[^\r\n]*Fitur Utama[^\r\n]*\n([\s\S]*?)(?=##\s*4\.|$)/i)
    const designText = getSection(/##\s*4\.\s*[^\r\n]*Rekomendasi Desain[^\r\n]*\n([\s\S]*?)(?=##\s*5\.|$)/i)

    // Parse bullet points
    const parseBullets = (text: string) => {
      if (!text) return []
      return text
        .split("\n")
        .map((line) => line.replace(/^[-*•]\s*(\[x\]|\[ \])?\s*/i, "").trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"))
    }

    return {
      title,
      tagline: taglineMatch ? taglineMatch[1].trim() : "Website Modern & Responsif",
      category: categoryMatch ? categoryMatch[1].trim() : "Bisnis / Portofolio",
      target: targetMatch ? targetMatch[1].trim() : "Pengunjung & Pelanggan Potensial",
      concept: conceptText,
      sitemap: parseBullets(sitemapText),
      features: parseBullets(featuresText),
      designNotes: designText,
    }
  }, [content])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, handleClose])

  if (!visible) return null

  return createPortal(
    <>
      {/* Dark Backdrop Overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleClose}
        style={{
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "opacity",
        }}
      />

      {/* Drawer Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 z-50 flex flex-col border-l border-t border-b border-white/10 rounded-l-2xl shadow-2xl"
        style={{
          top: "60px",
          bottom: "60px",
          width: `${width}px`,
          maxWidth: "100vw",
          background: "rgba(24, 24, 28, 0.98)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          opacity: open ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform, opacity",
          boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Left Resize Edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize z-50 hover:bg-cyan-500/30 active:bg-cyan-500/50"
          style={{ transition: "background 0.15s ease" }}
          onMouseDown={startResizing}
        />

        {/* Center-left Close Toggle Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute z-50 flex items-center justify-center text-neutral-400 hover:text-white"
          title="Tutup Panel Planning"
          style={{
            left: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "20px",
            height: "56px",
            background: "rgba(24, 24, 28, 0.98)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRight: "none",
            borderRadius: "8px 0 0 8px",
            cursor: "pointer",
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0 bg-[#16161a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white text-sm font-bold tracking-tight block">Planning & Blueprint</span>
              <span className="text-[11px] text-neutral-400">Cetak Biru Rencana Website</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Visual vs Text */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("visual")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  activeTab === "visual" ? "bg-cyan-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Visual Blueprint
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  activeTab === "text" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Dokumen Teks
              </button>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
              title="Salin Dokumen"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
              title="Unduh File Planning Markdown"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto prd-scroll-area p-5 space-y-5">
          
          {/* TAB 1: VISUAL BLUEPRINT CARD VIEW */}
          {activeTab === "visual" && parsedBlueprint && (
            <div className="space-y-4 text-xs">
              
              {/* Identity Header Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-neutral-900 to-blue-950/30 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      <Sparkles className="w-3 h-3" /> {parsedBlueprint.category}
                    </div>
                    <h2 className="text-lg font-extrabold text-white tracking-tight">{parsedBlueprint.title}</h2>
                    <p className="text-xs text-neutral-300 italic mt-0.5">"{parsedBlueprint.tagline}"</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2 text-[11px] text-neutral-400">
                  <span className="font-semibold text-neutral-300">Target Audiens:</span>
                  <span>{parsedBlueprint.target}</span>
                </div>
              </div>

              {/* Sitemap / Page Breakdown Card */}
              {parsedBlueprint.sitemap.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#1d1d22] border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Peta Halaman (Sitemap)</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {parsedBlueprint.sitemap.map((page, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="text-[11px] text-neutral-200 leading-snug">
                          {page}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Pill Cards */}
              {parsedBlueprint.features.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#1d1d22] border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fitur Utama & Interaktivitas</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parsedBlueprint.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Design Recommendations Card */}
              <div className="p-4 rounded-2xl bg-[#1d1d22] border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Rekomendasi Desain & Gaya</h3>
                </div>
                <div className="whitespace-pre-wrap text-neutral-300 leading-relaxed text-[11px] bg-black/20 p-3 rounded-xl border border-white/5">
                  {parsedBlueprint.designNotes || "Gaya Modern & Responsif, tipografi Plus Jakarta Sans, palet warna elegan."}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RAW TEXT / EDITOR VIEW */}
          {activeTab === "text" && (
            <div className="flex-1 flex flex-col min-h-0 h-full">
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  if (window.updateActiveProjectPrd) window.updateActiveProjectPrd(e.target.value)
                }}
                className="w-full h-full min-h-[400px] bg-[#121215] border border-white/10 rounded-xl p-4 text-xs text-neutral-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-400/40 resize-none prd-scroll-area"
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* Footer Bar with Action CTA */}
        <div className="p-4 border-t border-white/10 bg-[#16161a] shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-400 text-center sm:text-left">
            Siap melihat website ini dalam bentuk nyata?
          </div>

          <button
            type="button"
            onClick={handleLaunchCanvas}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
            <span>Mulai Bangun di Web Canvas ➜</span>
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}
