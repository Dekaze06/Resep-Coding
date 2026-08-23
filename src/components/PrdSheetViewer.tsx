import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { createPortal } from "react-dom"
import {
  FileText,
  Download,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  Palette,
  CheckCircle2,
  X,
  Code2,
  ArrowRight,
  Eye,
  Sliders
} from "lucide-react"

declare global {
  interface Window {
    getActiveProjectPrd?: () => string | null;
    updateActiveProjectPrd?: (content: string) => void;
    openFrontendCanvas?: (prompt?: string) => void;
  }
}

// Markdown renderer helper for PRD documents
function MarkdownDocumentView({ markdown }: { markdown: string }) {
  const lines = useMemo(() => markdown.split("\n"), [markdown])

  const renderLine = (line: string, idx: number) => {
    const trimmed = line.trim()

    // Horizontal rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      return <hr key={idx} className="my-6 border-zinc-800" />
    }

    // Heading 1
    if (line.startsWith("# ")) {
      const text = line.replace(/^#\s+/, "")
      return (
        <div key={idx} className="pt-2 pb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
            Product Requirement Document (.md)
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
            {text}
          </h1>
        </div>
      )
    }

    // Heading 2
    if (line.startsWith("## ")) {
      const text = line.replace(/^##\s+/, "")
      return (
        <h2
          key={idx}
          className="text-base sm:text-lg font-bold text-white tracking-tight mt-6 mb-3 pb-2 border-b border-zinc-800 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>{text}</span>
        </h2>
      )
    }

    // Heading 3
    if (line.startsWith("### ")) {
      const text = line.replace(/^###\s+/, "")
      return (
        <h3 key={idx} className="text-sm font-semibold text-zinc-200 mt-4 mb-2">
          {text}
        </h3>
      )
    }

    // Heading 4
    if (line.startsWith("#### ")) {
      const text = line.replace(/^####\s+/, "")
      return (
        <h4 key={idx} className="text-xs font-semibold text-zinc-300 mt-3 mb-1 uppercase tracking-wider">
          {text}
        </h4>
      )
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const text = line.replace(/^>\s+/, "")
      return (
        <blockquote
          key={idx}
          className="p-3 my-2 rounded-xl bg-amber-950/20 border-l-2 border-amber-500/60 text-xs text-amber-200/90 leading-relaxed font-sans"
        >
          {parseInlineFormatting(text)}
        </blockquote>
      )
    }

    // Checklist Item (Checked: - [x])
    if (/^[-*]\s*\[x\]/i.test(trimmed)) {
      const text = trimmed.replace(/^[-*]\s*\[x\]\s*/i, "")
      return (
        <div key={idx} className="flex items-start gap-2.5 py-1 text-xs text-zinc-300">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3 h-3" />
          </div>
          <span className="leading-snug">{parseInlineFormatting(text)}</span>
        </div>
      )
    }

    // Checklist Item (Unchecked: - [ ])
    if (/^[-*]\s*\[\s*\]/i.test(trimmed)) {
      const text = trimmed.replace(/^[-*]\s*\[\s*\]\s*/i, "")
      return (
        <div key={idx} className="flex items-start gap-2.5 py-1 text-xs text-zinc-400">
          <div className="w-4 h-4 rounded bg-zinc-900 border border-zinc-700 shrink-0 mt-0.5"></div>
          <span className="leading-snug">{parseInlineFormatting(text)}</span>
        </div>
      )
    }

    // Unordered list item (- or *)
    if (/^[-*•]\s+/.test(trimmed)) {
      const text = trimmed.replace(/^[-*•]\s+/, "")
      return (
        <div key={idx} className="flex items-start gap-2 py-0.5 text-xs text-zinc-300 ml-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5"></span>
          <span className="leading-relaxed">{parseInlineFormatting(text)}</span>
        </div>
      )
    }

    // Numbered list item (1. )
    if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)$/)
      if (match) {
        return (
          <div key={idx} className="flex items-start gap-2 py-1 text-xs text-zinc-300 ml-1">
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-amber-400 shrink-0">
              {match[1]}
            </span>
            <span className="leading-relaxed">{parseInlineFormatting(match[2])}</span>
          </div>
        )
      }
    }

    // Table row indicator (simple table line detection)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      // If header divider (|---|---|)
      if (/^\|[-|\s]+\|$/.test(trimmed)) {
        return null
      }
      const cells = trimmed.split("|").filter((c, i, arr) => i > 0 && i < arr.length - 1)
      return (
        <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60 my-1 text-xs font-mono">
          {cells.map((c, cIdx) => (
            <div key={cIdx} className="text-zinc-300 truncate">
              {parseInlineFormatting(c.trim())}
            </div>
          ))}
        </div>
      )
    }

    // Code line / inline block
    if (trimmed.startsWith("```")) {
      return null
    }

    // Empty line
    if (!trimmed) {
      return <div key={idx} className="h-2" />
    }

    // Regular paragraph
    return (
      <p key={idx} className="text-xs text-zinc-300 leading-relaxed my-1">
        {parseInlineFormatting(line)}
      </p>
    )
  }

  return <div className="space-y-1 font-sans">{lines.map((l, idx) => renderLine(l, idx))}</div>
}

// Inline formatting helper (Bold, Italic, Code)
function parseInlineFormatting(text: string): React.ReactNode {
  if (!text) return ""

  // Split by bold (**...**), inline code (`...`), and plain text
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g)

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-amber-300"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-zinc-300">
          {part.slice(1, -1)}
        </em>
      )
    }
    return part
  })
}

export default function PrdSheetViewer() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState("")
  const [activeTab, setActiveTab] = useState<"rendered" | "raw" | "visual">("rendered")
  const [copied, setCopied] = useState(false)

  // Resizing state
  const [width, setWidth] = useState(680)
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
        const idealWidth = Math.min(840, Math.max(620, window.innerWidth * 0.52))
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
      const md = e.detail?.markdown || e.detail?.prd || ""
      setContent(md)
      setVisible(true)
      setActiveTab("rendered")
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

  // Mouse drag resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return
      e.preventDefault()
      let newWidth = window.innerWidth - e.clientX
      if (newWidth < 380) newWidth = 380
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
    const titleMatch = content.match(/#\s*(?:Planning Blueprint:?|PRD:?|Rencana:?)\s*([^\r\n]+)/i)
    const rawTitle = titleMatch ? titleMatch[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") : "product-requirement-document"
    const filename = `${rawTitle || "planning-blueprint"}.md`

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Seamless jump to Studio App / Canvas
  const handleLaunchCanvas = () => {
    handleClose()
    setTimeout(() => {
      const titleMatch = content.match(/#\s*(?:Planning Blueprint:?|PRD:?|Rencana:?)\s*([^\r\n]+)/i)
      const title = titleMatch ? titleMatch[1].trim() : "Aplikasi PRD"
      window.location.href = `/app?prompt=${encodeURIComponent(`Bangun aplikasi lengkap berdasarkan dokumen PRD: ${title}`)}&mode=fullstack`
    }, 300)
  }

  // Parse summary points for Visual tab
  const parsedBlueprint = useMemo(() => {
    if (!content) return null

    const titleMatch = content.match(/#\s*(?:Planning Blueprint:?|PRD:?|Rencana:?)\s*([^\r\n]+)/i)
    const title = titleMatch ? titleMatch[1].trim() : "Rencana Aplikasi"

    const taglineMatch = content.match(/\*\*Tagline[^*]*\*\*:\s*([^\r\n>]+)/i)
    const categoryMatch = content.match(/\*\*Kategori\*\*:\s*([^|>\r\n]+)/i)
    const targetMatch = content.match(/\*\*Target Pengunjung\*\*:\s*([^\r\n>]+)/i)

    const getSection = (headingRegex: RegExp) => {
      const match = content.match(headingRegex)
      return match ? match[1].trim() : ""
    }

    const conceptText = getSection(/##\s*1\.\s*[^\r\n]*Ringkasan[^\r\n]*\n([\s\S]*?)(?=##\s*2\.|$)/i)
    const sitemapText = getSection(/##\s*2\.\s*[^\r\n]*Peta Halaman[^\r\n]*\n([\s\S]*?)(?=##\s*3\.|$)/i)
    const featuresText = getSection(/##\s*3\.\s*[^\r\n]*Matriks Prioritas[^\r\n]*\n([\s\S]*?)(?=##\s*4\.|$)/i)
    const designText = getSection(/##\s*6\.\s*[^\r\n]*Rekomendasi Desain[^\r\n]*\n([\s\S]*?)(?=##\s*7\.|$)/i)

    const parseBullets = (text: string) => {
      if (!text) return []
      return text
        .split("\n")
        .map((line) => line.replace(/^[-*•]\s*(\[x\]|\[ \])?\s*/i, "").trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"))
    }

    return {
      title,
      tagline: taglineMatch ? taglineMatch[1].trim() : "Solusi Digital Terintegrasi",
      category: categoryMatch ? categoryMatch[1].trim() : "Bisnis & Layanan",
      target: targetMatch ? targetMatch[1].trim() : "Pengguna Utama & Admin",
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
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleClose}
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Slide-over Drawer Panel from the Right */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col border-l border-zinc-800/90 shadow-2xl bg-zinc-950/95 backdrop-blur-2xl"
        style={{
          width: `${width}px`,
          maxWidth: "100vw",
          transform: open ? "translateX(0)" : "translateX(100%)",
          opacity: open ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out",
          boxShadow: "-24px 0 80px rgba(0, 0, 0, 0.85)",
        }}
      >
        {/* Left Resize Edge Drag Handle */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize z-50 hover:bg-amber-500/40 active:bg-amber-500/60 transition-colors"
          title="Tarik untuk mengubah lebar panel"
          onMouseDown={startResizing}
        />

        {/* Center-left Close Toggle Tab */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute z-50 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 border-r-0 rounded-l-xl cursor-pointer transition-colors shadow-lg"
          title="Tutup Panel PRD"
          style={{
            left: "-28px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "28px",
            height: "64px",
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 shrink-0 bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white text-xs sm:text-sm font-bold tracking-tight">Dokumen PRD & Blueprint</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  .md format
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">Hasil Blueprint Spesifikasi Teknis</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Rendered vs Raw vs Visual */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab("rendered")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "rendered"
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                title="Lihat Pratinjau Dokumen PRD"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">Pratinjau</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("raw")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "raw"
                    ? "bg-white/15 text-white font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                title="Lihat Sumber Markdown .md Mentah"
              >
                <Code2 className="w-3 h-3" />
                <span>.md Mentah</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("visual")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "visual"
                    ? "bg-white/15 text-white font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                title="Ringkasan Visual"
              >
                <Sliders className="w-3 h-3" />
                <span className="hidden sm:inline">Visual</span>
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              title="Salin Isi Dokumen Markdown (.md)"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px] font-medium hidden sm:inline">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium hidden sm:inline">Salin .md</span>
                </>
              )}
            </button>

            {/* Download .md Button */}
            <button
              onClick={handleDownload}
              className="px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              title="Unduh File .md"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden sm:inline">Unduh .md</span>
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: RENDERED MARKDOWN DOCUMENT VIEW */}
          {activeTab === "rendered" && (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3 shadow-inner">
              <MarkdownDocumentView markdown={content} />
            </div>
          )}

          {/* TAB 2: RAW TEXT / .MD EDITOR VIEW */}
          {activeTab === "raw" && (
            <div className="flex-1 flex flex-col min-h-0 h-full space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                <span>Markdown Source Editor (.md)</span>
                <span>{content.length} karakter • {content.split("\n").length} baris</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  if (window.updateActiveProjectPrd) window.updateActiveProjectPrd(e.target.value)
                }}
                className="w-full h-full min-h-[460px] bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 rounded-xl p-4 text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none resize-none"
                spellCheck={false}
              />
            </div>
          )}

          {/* TAB 3: VISUAL BLUEPRINT CARDS VIEW */}
          {activeTab === "visual" && parsedBlueprint && (
            <div className="space-y-4 text-xs">
              {/* Identity Header Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/20 via-zinc-900 to-zinc-900 border border-amber-500/30 shadow-lg">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3 h-3" /> {parsedBlueprint.category}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{parsedBlueprint.title}</h2>
                <p className="text-xs text-zinc-300 italic mt-0.5">"{parsedBlueprint.tagline}"</p>

                <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center gap-2 text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-300">Target Audiens:</span>
                  <span>{parsedBlueprint.target}</span>
                </div>
              </div>

              {/* Sitemap / Page Breakdown Card */}
              {parsedBlueprint.sitemap.length > 0 && (
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Peta Halaman (Sitemap)</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {parsedBlueprint.sitemap.map((page, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="text-[11px] text-zinc-200 leading-snug">{page}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Pill Cards */}
              {parsedBlueprint.features.length > 0 && (
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fitur Utama & Scope</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parsedBlueprint.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Design Recommendations Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Rekomendasi Desain & Gaya</h3>
                </div>
                <div className="text-zinc-300 leading-relaxed text-[11px] bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                  {parsedBlueprint.designNotes || "Gaya modern responsif, tipografi bersih, palet warna harmonis."}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar with Action Buttons */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Dokumen (.md)</span>
          </button>

          <button
            type="button"
            onClick={handleLaunchCanvas}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
            <span>Lanjut Bangun Aplikasi di Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}
