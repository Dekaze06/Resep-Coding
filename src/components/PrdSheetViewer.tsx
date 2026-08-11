import React, { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { FileText, Download, ArrowRight, ChevronRight } from "lucide-react"

declare global {
  interface Window {
    getActiveProjectPrd?: () => string | null;
    updateActiveProjectPrd?: (content: string) => void;
  }
}

export default function PrdSheetViewer() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false) // controls DOM mount
  const [content, setContent] = useState("")
  const [offsetTop, setOffsetTop] = useState(100)

  // Resizing state
  const [width, setWidth] = useState(600)
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
        // Melebar sekitar 45% dari layar
        const idealWidth = window.innerWidth * 0.45
        setWidth(idealWidth)
      }
    }

    // Set initially
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-save on close
  const handleClose = useCallback(() => {
    if (window.updateActiveProjectPrd) {
      window.updateActiveProjectPrd(contentRef.current)
    }
    setOpen(false)
    // Unlock scroll halaman utama
    document.body.style.overflow = ''
    // Wait for exit animation to finish before unmounting
    setTimeout(() => setVisible(false), 350)
  }, [])

  useEffect(() => {
    const handleOpenPrd = (e: any) => {
      setOffsetTop(window.scrollY + 100)
      setContent(e.detail.markdown || "")
      setVisible(true)
      // Lock scroll halaman utama
      document.body.style.overflow = 'hidden'
      // Small delay to allow DOM mount before triggering animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOpen(true)
        })
      })
    }

    const handleClosePrd = () => {
      handleClose()
    }

    window.addEventListener('open-prd-sheet', handleOpenPrd)
    window.addEventListener('close-prd-sheet', handleClosePrd)

    return () => {
      window.removeEventListener('open-prd-sheet', handleOpenPrd)
      window.removeEventListener('close-prd-sheet', handleClosePrd)
    }
  }, [handleClose])

  // Resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return
      e.preventDefault()
      let newWidth = window.innerWidth - e.clientX
      // Set a smaller minimum width for responsiveness
      if (newWidth < 300) newWidth = 300
      if (newWidth > window.innerWidth) newWidth = window.innerWidth
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prd.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleNext = () => {
    handleClose()
    setTimeout(() => {
      const nextBtn = document.getElementById('btn-slide-next')
      if (nextBtn && !(nextBtn as HTMLButtonElement).disabled) {
        nextBtn.click()
      }
    }, 400)
  }

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, handleClose])

  if (!visible) return null

  return createPortal(
    <>
      {/* Overlay - Tetap fixed agar background selalu tertutup gelap saat PRD terbuka */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleClose}
        style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'opacity',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 z-50 flex flex-col border-l border-t border-b border-white/10 rounded-l-2xl"
        style={{
          top: '70px',
          bottom: '70px',
          width: `${width}px`,
          maxWidth: '100vw',
          background: 'rgba(37, 37, 37, 0.97)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          opacity: open ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform, opacity',
          boxShadow: '-20px 0 60px rgba(15, 15, 15, 0.5)',
        }}
      >

        {/* Resize edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize z-50 hover:bg-white/10 active:bg-white/15"
          style={{ transition: 'background 0.15s ease' }}
          onMouseDown={startResizing}
        />

        {/* Close button — center-left edge */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute z-50 flex items-center justify-center"
          title="Tutup PRD"
          style={{
            left: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '56px',
            background: 'rgba(37, 37, 37, 0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRight: 'none',
            borderRadius: '8px 0 0 8px',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(55, 55, 55, 1)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(37, 37, 37, 0.97)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0" style={{ background: 'rgba(22, 22, 22, 0.95)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <FileText className="w-4 h-4 text-white/80" />
            </div>
            <span className="text-white/90 text-sm font-semibold tracking-tight">PRD Viewer & Editor</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8"
              style={{ transition: 'all 0.15s ease', border: '1px solid rgba(0, 0, 0, 0.08)' }}
              title="Download PRD"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="h-8 px-3 rounded-lg flex items-center justify-center gap-1.5 text-black font-semibold text-xs bg-white hover:bg-gray-200"
              style={{ transition: 'all 0.15s ease' }}
              title="Lanjut ke langkah berikutnya"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content area with custom dark scrollbar */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <style>{`
            .prd-scroll-area::-webkit-scrollbar {
              width: 6px;
            }
            .prd-scroll-area::-webkit-scrollbar-track {
              background: transparent;
            }
            .prd-scroll-area::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }
            .prd-scroll-area::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
            .prd-scroll-area {
              scrollbar-width: thin;
              scrollbar-color: rgba(255,255,255,0.1) transparent;
            }
          `}</style>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              if (window.updateActiveProjectPrd) window.updateActiveProjectPrd(e.target.value)
            }}
            className="flex-1 w-full bg-transparent border-0 p-5 text-sm text-gray-200 leading-relaxed focus:outline-none focus:ring-0 resize-none prd-scroll-area"
            style={{
              fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
              letterSpacing: '0.01em',
              lineHeight: '1.8',
            }}
            spellCheck={false}
          />
        </div>
      </div>
    </>,
    document.body
  )
}
