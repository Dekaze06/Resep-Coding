import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { PrdSheetViewer } from "./PrdSheetViewer";
import {
  Sparkles,
  Send,
  Code2,
  Eye,
  Download,
  Copy,
  Check,
  Undo2,
  Redo2,
  ExternalLink,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Monitor,
  X,
  FileText,
  Loader2,
  Wand2,
  Palette,
  PlusCircle,
  Edit3,
  ChevronDown,
  MessageSquare,
  Paperclip
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: string;
  hasCodeUpdate?: boolean;
}

declare global {
  interface Window {
    openFrontendCanvas?: (prompt?: string) => void;
    closeFrontendCanvas?: () => void;
    getActiveProjectPrd?: () => string | null;
    getActiveProjectName?: () => string;
    getActiveProjectCanvasState?: () => { code: string; messages: ChatMessage[]; title: string } | null;
    updateActiveProjectCanvasState?: (state: { code: string; messages: ChatMessage[]; title: string }) => void;
  }
}

const DEFAULT_SAMPLE_HTML = `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frontend Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              400: '#22d3ee',
              500: '#06b6d4',
              600: '#0891b2',
            }
          }
        }
      }
    }
  </script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Geist', sans-serif; scroll-behavior: smooth; }
    .glass-card { background: rgba(255, 255, 255, 0.04); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); }
  </style>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col justify-between">
  <!-- Header -->
  <header class="border-b border-white/10 glass-card sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold">
          <i class="fa-solid fa-code"></i>
        </span>
        <span class="font-bold text-lg tracking-tight">Web Canvas <span class="text-cyan-400 font-semibold">Live</span></span>
      </div>
      <nav class="hidden md:flex items-center gap-6 text-sm text-neutral-400">
        <a href="#fitur" class="hover:text-cyan-400 transition-colors">Fitur</a>
        <a href="#demo" class="hover:text-cyan-400 transition-colors">Demo</a>
        <a href="#kontak" class="hover:text-cyan-400 transition-colors">Kontak</a>
      </nav>
      <button class="px-4 py-2 text-xs font-semibold rounded-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        Mulai Sekarang
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="max-w-6xl mx-auto px-6 py-20 text-center flex-1 flex flex-col items-center justify-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-cyan-400 mb-6">
      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
      AI-Powered Frontend Canvas
    </div>
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
      Bangun & Tinjau Web Impian <br/>
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">Secara Instan & Interaktif</span>
    </h1>
    <p class="max-w-2xl text-neutral-400 text-base md:text-lg mb-10 leading-relaxed">
      Gunakan Chat Assistant di panel kiri untuk meminta AI membuatkan antarmuka web, landing page, atau berdiskusi seputar ide & desain website Anda.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4">
      <button onclick="alert('Halo! Kode ini sepenuhnya interaktif.')" class="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-sm transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2">
        <i class="fa-solid fa-play text-xs"></i> Coba Interaktivitas
      </button>
      <button onclick="document.getElementById('demo-card').classList.toggle('hidden')" class="px-6 py-3 rounded-xl glass-card hover:bg-white/10 text-neutral-200 font-semibold text-sm transition-all border-white/15">
        Toggle Demo Card
      </button>
    </div>

    <!-- Dynamic Card Demo -->
    <div id="demo-card" class="mt-12 p-6 rounded-2xl glass-card max-w-md w-full text-left transition-all animate-fade-in">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <div>
          <h3 class="font-bold text-sm text-neutral-100">Komponen Siap Kustomisasi</h3>
          <p class="text-xs text-neutral-400">Tulis prompt di samping untuk mengubah tampilan atau berdiskusi</p>
        </div>
      </div>
      <p class="text-xs text-neutral-300 leading-relaxed">
        Preview ini mendukung Tailwind CSS, Vanilla JS, Font Awesome, dan Google Fonts. Semua perubahan kode akan langsung terlihat di sini!
      </p>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-white/5 py-6 text-center text-xs text-neutral-500">
    Dibuat dengan Satusite Studio & AI Agent
  </footer>
</body>
</html>`;

// Quick Block Presets for 1-Click Insertion
const QUICK_BLOCK_PRESETS = [
  {
    id: "wa",
    label: "WhatsApp Melayang",
    icon: "fa-brands fa-whatsapp",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    prompt: "Sisipkan tombol chat WhatsApp melayang (Floating WhatsApp Button) di pojok kanan bawah dengan animasi pulse halus, nomor wa.me/628123456789, dan popup bubble sapaan otomatis saat diklik.",
  },
  {
    id: "gallery",
    label: "Galeri Foto Grid",
    icon: "fa-solid fa-images",
    badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    prompt: "Sisipkan bagian Galeri Foto & Showcase Produk dengan layout responsive grid (3-4 kolom), filter kategori tab, efek hover zoom, dan lightbox preview gambar saat diklik.",
  },
  {
    id: "pricing",
    label: "Daftar Harga & Paket",
    icon: "fa-solid fa-tags",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    prompt: "Sisipkan bagian Tabel Harga & Paket Layanan (Pricing Table) dengan 3 kartu paket (Starter, Pro Populer, Enterprise), badge 'Paling Populer', daftar centang fitur, dan tombol 'Pesan Sekarang'.",
  },
  {
    id: "booking",
    label: "Form Booking / Pesan",
    icon: "fa-solid fa-calendar-check",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    prompt: "Sisipkan formulir Booking / Reservasi / Kontak interaktif dengan input Nama, No. WhatsApp, Pilihan Layanan, Pilihan Tanggal & Jam, serta tombol submit konfirmasi dengan notifikasi sukses.",
  },
  {
    id: "maps",
    label: "Peta & Jam Buka",
    icon: "fa-solid fa-map-location-dot",
    badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    prompt: "Sisipkan bagian Lokasi & Jam Operasional dengan kartu alamat lengkap, embed Google Maps responsif, daftar hari & jam buka, dan tombol petunjuk arah (Google Maps Link).",
  },
  {
    id: "reviews",
    label: "Ulasan Testimoni",
    icon: "fa-solid fa-star",
    badgeColor: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    prompt: "Sisipkan bagian Testimoni & Ulasan Pelanggan bintang 5 dengan kartu testimoni estetik, rating 5 bintang emas, kutipan kepuasan pelanggan, nama, dan foto profil avatar.",
  },
  {
    id: "faq",
    label: "FAQ Tanya Jawab",
    icon: "fa-solid fa-circle-question",
    badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    prompt: "Sisipkan bagian FAQ (Tanya Jawab Populer) dengan 4-5 pertanyaan umum dan accordion interaktif yang bisa diklik untuk buka-tutup jawaban secara mulus.",
  },
];

// Theme Switcher Presets
const cleanHtmlCode = (raw: string): string => {
  if (!raw) return raw;
  let cleaned = raw;
  const docTypeIdx = cleaned.indexOf("<!DOCTYPE html>");
  const htmlIdx = cleaned.indexOf("<html");
  const startIdx = docTypeIdx !== -1 ? docTypeIdx : htmlIdx;
  if (startIdx > 0) {
    cleaned = cleaned.slice(startIdx);
  }
  cleaned = cleaned.replace(/```(?:html|HTML)?/gi, "").replace(/```\s*$/g, "").trim();
  return cleaned;
};

const THEME_PRESETS = [
  {
    id: "dark_luxury",
    name: "Dark Minimalist",
    desc: "Hitam pekat, sleek zinc borders & emerald glow",
    prompt: "Ubah seluruh gaya tema visual dan palet warna website menjadi tema 'Dark Minimalist': background #09090b pekat, teks putih bersih, kartu sleek zinc modern, dan aksen warna emerald #10b981 yang elegan tanpa menghapus konten yang ada.",
  },
  {
    id: "clean_light",
    name: "Clean Minimalist Light",
    desc: "Putih bersih, abu-abu modern & royal blue",
    prompt: "Ubah seluruh gaya tema visual dan palet warna website menjadi tema 'Clean Minimalist Light': background putih bersih #ffffff / neutral-50, teks gelap kontras #0f172a, kartu berbayang halus, dan aksen warna royal blue #2563eb yang profesional tanpa menghapus konten.",
  },
  {
    id: "emerald_nature",
    name: "Natural Emerald",
    desc: "Nuansa alam segar, hijau & warna bumi",
    prompt: "Ubah seluruh gaya tema visual dan palet warna website menjadi tema 'Natural Emerald & Organic': palet warna bernuansa hijau zamrud #10b981, latar lembut ramah lingkungan, dan elemen visual segar natural tanpa menghapus konten yang ada.",
  },
  {
    id: "cyber_neon",
    name: "High-Tech Dark",
    desc: "Cyberpunk violet & neon gradient",
    prompt: "Ubah seluruh gaya tema visual dan palet warna website menjadi tema 'High-Tech Futuristic Dark': background cyberpunk gelap #030712, gradien ungu violet #a855f7 dan cyan menyala, serta micro-interactions futuristik tanpa menghapus konten.",
  },
  {
    id: "warm_boutique",
    name: "Warm Boutique",
    desc: "Rose gold, peach lembut & cozy aesthetic",
    prompt: "Ubah seluruh gaya tema visual dan palet warna website menjadi tema 'Warm Boutique & Cafe Chic': palet warna rose gold & peach lembut #f43f5e, font estetik, dan nuansa hangat nyaman untuk resto/kafe/fashion tanpa menghapus konten.",
  },
];

export default function FrontendCanvasViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Tab & Viewport state
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isExpanded, setIsExpanded] = useState(false);

  // In-Place Visual Text Editing Mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Canvas content & history state
  const [canvasTitle, setCanvasTitle] = useState("Web Canvas Workspace");
  const [code, setCode] = useState(DEFAULT_SAMPLE_HTML);
  const [history, setHistory] = useState<string[]>([DEFAULT_SAMPLE_HTML]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Chat & AI agent state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      role: "agent",
      text: "Halo! Saya adalah **Frontend AI Assistant** Anda di Web Canvas Studio.\n\nAnda dapat meminta saya membuatkan tampilan website, menambahkan komponen baru, mengganti tema warna, atau sekadar berdiskusi dan berkonsultasi seputar ide website impian Anda.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; type: string; content?: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [includePrd, setIncludePrd] = useState(true);
  const [prdAvailable, setPrdAvailable] = useState(false);
  const [copied, setCopied] = useState(false);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const isTextDoc =
        file.type.startsWith("text/") ||
        file.name.endsWith(".md") ||
        file.name.endsWith(".markdown") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".json") ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".html") ||
        file.name.endsWith(".yaml") ||
        file.name.endsWith(".yml") ||
        file.name.endsWith(".sql") ||
        file.name.endsWith(".ts") ||
        file.name.endsWith(".js") ||
        file.name.endsWith(".xml");

      if (isTextDoc) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve((e.target?.result as string) || "");
        };
        reader.onerror = () => resolve("");
        reader.readAsText(file);
      } else {
        resolve(`[Dokumen / Berkas Terlampir: ${file.name}, Tipe: ${file.type || 'Dokumen'}, Ukuran: ${(file.size / 1024).toFixed(1)} KB]`);
      }
    });
  };

  const addFilesToUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const newFileList: Array<{ name: string; size: string; type: string; content?: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeKb = (file.size / 1024).toFixed(1) + " KB";
      const content = await readFileContent(file);
      newFileList.push({
        name: file.name,
        size: sizeKb,
        type: file.type || "file",
        content
      });
    }
    setUploadedFiles((prev) => [...prev, ...newFileList]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await addFilesToUpload(e.target.files);
    }
    e.target.value = "";
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await addFilesToUpload(e.dataTransfer.files);
    }
  };

  const handleFilePaste = async (e: React.ClipboardEvent) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      await addFilesToUpload(e.clipboardData.files);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Left chat pane width resizing
  const [chatWidth, setChatWidth] = useState(430);
  const isResizing = useRef(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const codeTextareaRef = useRef<HTMLTextAreaElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Check Planning availability
  const checkPrd = useCallback(() => {
    if (typeof window !== "undefined") {
      const prd = (window.getActiveProjectPrd ? window.getActiveProjectPrd() : null) || (typeof localStorage !== "undefined" ? localStorage.getItem("satusite_active_prd") : null);
      setPrdAvailable(!!(prd && prd.trim()));
    }
  }, []);

  // Update history state
  const updateCodeWithHistory = useCallback((newCode: string) => {
    const cleaned = cleanHtmlCode(newCode);
    setCode(cleaned);
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newCode];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCode(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCode(history[newIndex]);
    }
  };

  // Close theme menu on outside click
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  // Sync In-Place Text Editing with iframe
  useEffect(() => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;

    const setupIframeEditing = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc || !doc.body) return;

        if (isEditMode) {
          doc.body.contentEditable = "true";
          doc.designMode = "on";
          
          let styleEl = doc.getElementById("satusite-edit-style");
          if (!styleEl) {
            styleEl = doc.createElement("style");
            styleEl.id = "satusite-edit-style";
            styleEl.innerHTML = `
              [contenteditable="true"] :hover {
                outline: 1.5px dashed #06b6d4 !important;
                outline-offset: 2px !important;
                cursor: text !important;
              }
              [contenteditable="true"] :focus {
                outline: 2px solid #06b6d4 !important;
                outline-offset: 3px !important;
                background-color: rgba(6, 182, 212, 0.08) !important;
              }
            `;
            doc.head.appendChild(styleEl);
          }

          const handleInput = () => {
            if (doc.documentElement) {
              const updated = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
              setCode(updated);
              saveProjectState(updated, messages, canvasTitle);
            }
          };

          doc.removeEventListener("input", handleInput);
          doc.addEventListener("input", handleInput);
        } else {
          doc.body.contentEditable = "false";
          doc.designMode = "off";
          const styleEl = doc.getElementById("satusite-edit-style");
          if (styleEl) styleEl.remove();
        }
      } catch (err) {
        console.warn("Iframe edit mode access:", err);
      }
    };

    iframe.addEventListener("load", setupIframeEditing);
    setupIframeEditing();

    return () => {
      iframe.removeEventListener("load", setupIframeEditing);
    };
  }, [isEditMode, code]);

  // Compute safe HTML preview with click navigation interceptor
  const previewSrcDoc = useMemo(() => {
    if (!code) return "";
    const cleanCode = cleanHtmlCode(code);
    
    // Script to intercept navigation clicks and prevent navigating the host window
    const interceptorScript = `
<script id="satusite-nav-sandbox">
(function() {
  document.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
  }, true);

  document.addEventListener('click', function(e) {
    var a = e.target.closest('button, a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    
    // If empty or dummy hash
    if (!href || href === '#' || href === 'javascript:void(0)') {
      if (a.tagName && a.tagName.toLowerCase() === 'a') {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    // If link is root or home (e.g. /, /index.html, #top, #hero)
    if (href === '/' || href === '/index.html' || href === 'index.html' || href === '#top' || href === '#hero' || href === '/#top' || href === '/#hero' || href === '/#') {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // In-page smooth scroll anchor
    if (href.startsWith('#') || href.startsWith('/#')) {
      e.preventDefault();
      e.stopPropagation();
      try {
        var cleanId = href.replace(/^(\/#|#)/, '');
        var targetEl = document.getElementById(cleanId) || document.querySelector('#' + cleanId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch(err) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    // External link
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('wa.me') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      e.preventDefault();
      e.stopPropagation();
      window.open(href.startsWith('wa.me') ? 'https://' + href : href, '_blank');
      return;
    }
    
    // Local / relative path: prevent iframe from reloading the parent SATU SITE app
    e.preventDefault();
    e.stopPropagation();
    try {
      var cleanSlug = href.replace(/^\//, '').replace(/\.html$/, '');
      var matchEl = document.getElementById(cleanSlug) || document.querySelector('#' + cleanSlug);
      if (matchEl) {
        matchEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch(err) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, true);
})();
</script>
`;

    if (cleanCode.includes("</body>")) {
      return cleanCode.replace("</body>", interceptorScript + "</body>");
    }
    return cleanCode + interceptorScript;
  }, [code]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Load saved state
  const loadProjectState = useCallback(() => {
    if (typeof window !== "undefined" && window.getActiveProjectCanvasState) {
      const saved = window.getActiveProjectCanvasState();
      if (saved && saved.code) {
        const cleaned = cleanHtmlCode(saved.code);
        setCode(cleaned);
        setHistory([saved.code]);
        setHistoryIndex(0);
        if (saved.messages && saved.messages.length > 0) {
          setMessages(saved.messages);
        }
        if (saved.title) {
          setCanvasTitle(saved.title);
        }
        return;
      }
    }
    checkPrd();
  }, [checkPrd]);

  // Save state to active project
  const saveProjectState = useCallback((currentCode: string, currentMessages: ChatMessage[], title: string) => {
    if (typeof window !== "undefined" && window.updateActiveProjectCanvasState) {
      window.updateActiveProjectCanvasState({
        code: currentCode,
        messages: currentMessages,
        title: title,
      });
    }
  }, []);

  // Global event listener to open/close
  useEffect(() => {
    const handleOpen = (e: any) => {
      checkPrd();
      loadProjectState();
      setIsMounted(true);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsOpen(true);
        });
      });

      if (e.detail && e.detail.prompt) {
        setTimeout(() => {
          handleSubmitPrompt(e.detail.prompt);
        }, 400);
      }
    };

    const handleCloseEvent = () => {
      handleClose();
    };

    window.addEventListener("open-frontend-canvas", handleOpen);
    window.addEventListener("close-frontend-canvas", handleCloseEvent);

    return () => {
      window.removeEventListener("open-frontend-canvas", handleOpen);
      window.removeEventListener("close-frontend-canvas", handleCloseEvent);
    };
  }, [checkPrd, loadProjectState]);

  const handleClose = () => {
    saveProjectState(code, messages, canvasTitle);
    setIsOpen(false);
    document.body.style.overflow = "";
    setTimeout(() => setIsMounted(false), 350);
  };

  // Escape shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Resizing left chat pane
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      e.preventDefault();
      let newWidth = e.clientX;
      if (newWidth < 320) newWidth = 320;
      if (newWidth > window.innerWidth * 0.6) newWidth = window.innerWidth * 0.6;
      setChatWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  // Submit Prompt to AI Agent API
  const handleSubmitPrompt = async (customPrompt?: string) => {
    const rawPrompt = customPrompt || inputPrompt;
    if ((!rawPrompt.trim() && uploadedFiles.length === 0) || isGenerating) return;

    let promptToSend = rawPrompt.trim() || "Mohon perbarui dan kembangkan antarmuka web ini sesuai dengan spesifikasi pada dokumen/PRD terlampir.";
    let fileMetaLabels: string[] = [];
    if (uploadedFiles.length > 0) {
      fileMetaLabels = uploadedFiles.map((f) => `${f.name} (${f.size})`);
      const docsContext = uploadedFiles
        .filter((f) => f.content)
        .map((f) => `=== LAMPIRAN DOKUMEN / PRD: ${f.name} ===\n${f.content}`)
        .join("\n\n");
      if (docsContext) {
        promptToSend = rawPrompt.trim()
          ? `${rawPrompt.trim()}\n\n${docsContext}`
          : `Mohon perbarui dan kembangkan antarmuka web ini sesuai dengan spesifikasi pada dokumen/PRD terlampir:\n\n${docsContext}`;
      }
      setUploadedFiles([]);
    }

    const userMsgText = fileMetaLabels.length > 0
      ? `${rawPrompt.trim() || 'Lampiran Dokumen / PRD'}\n\n[Lampiran: ${fileMetaLabels.join(", ")}]`
      : rawPrompt.trim();

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      role: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputPrompt("");
    setIsGenerating(true);
    setGenerationStep("Memproses permintaan...");

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev.includes("Memproses")) return "Menganalisis kebutuhan & instruksi...";
        if (prev.includes("Menganalisis")) return "Menyusun struktur & layout visual...";
        if (prev.includes("Menyusun")) return "Menerapkan styling & interaktivitas...";
        return "Menyelesaikan respon...";
      });
    }, 2200);

    try {
      const prd = includePrd && window.getActiveProjectPrd ? window.getActiveProjectPrd() || "" : "";
      const projName = window.getActiveProjectName ? window.getActiveProjectName() : "Web App";

      const res = await fetch("/api/generate-canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          chatHistory: updatedMessages.map((m) => ({ role: m.role, text: m.text })),
          currentCode: code,
          prdContext: prd,
          projectName: projName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memproses permintaan");

      // Update code ONLY if code was actually generated/updated
      if (data.hasCodeUpdate && data.code && data.code.trim()) {
        updateCodeWithHistory(data.code);
        setActiveTab("preview");
      }

      const agentMsg: ChatMessage = {
        id: "msg_" + (Date.now() + 1),
        role: "agent",
        text: data.message || (data.hasCodeUpdate ? "Kode antarmuka web berhasil diperbarui di Canvas." : "Berikut respon dari saya."),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        hasCodeUpdate: !!data.hasCodeUpdate,
      };

      const finalMessages = [...updatedMessages, agentMsg];
      setMessages(finalMessages);
      saveProjectState(data.hasCodeUpdate && data.code ? data.code : code, finalMessages, canvasTitle);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: "msg_err_" + Date.now(),
        role: "agent",
        text: `Notice: ${err.message || err}. Silakan coba lagi.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${canvasTitle.toLowerCase().replace(/[^a-z0-9]/g, "-") || "index"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        opacity: isOpen ? 1 : 0,
        transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Main Studio Container */}
      <div
        className="w-full h-full md:w-[98vw] md:h-[96vh] rounded-none md:rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)]"
        style={{
          background: "#121214",
          transform: isOpen ? "scale(1)" : "scale(0.98)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Workspace Body */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
          
          {/* ==================================================== */}
          {/* LEFT PANE: AI AGENT CHAT & QUICK BLOCKS              */}
          {/* ==================================================== */}
          <div
            className={`flex flex-col border-r border-white/10 bg-[#161618] shrink-0 transition-all duration-300 ${
              isExpanded ? "hidden md:hidden" : "flex w-full md:w-auto"
            }`}
            style={{
              width: typeof window !== "undefined" && window.innerWidth >= 768 ? `${chatWidth}px` : "100%",
            }}
          >
            {/* Chat Header */}
            <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between bg-[#19191c] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white tracking-tight">AI Agent</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-600/20 text-blue-300 text-[10px] font-semibold border border-blue-500/30">
                      Autonomous
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400">Diskusi & Generator Web Visual</p>
                </div>
              </div>

              {/* Planning Context & Open PRD Document */}
              <div className="flex items-center gap-2">
                {prdAvailable && (
                  <button
                    type="button"
                    onClick={() => {
                      const md = (window.getActiveProjectPrd ? window.getActiveProjectPrd() : null) || (typeof localStorage !== "undefined" ? localStorage.getItem("satusite_active_prd") : null) || "";
                      window.dispatchEvent(new CustomEvent("open-prd-sheet", { detail: { markdown: md } }));
                    }}
                    className="px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-[10px] font-semibold text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Buka Dokumen PRD (.md)"
                  >
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>Dokumen PRD (.md)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIncludePrd(!includePrd)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    includePrd && prdAvailable
                      ? "bg-blue-600/20 text-blue-300 border border-blue-400/40"
                      : "bg-white/5 text-neutral-400 border border-white/10 hover:text-neutral-300"
                  }`}
                  title={prdAvailable ? "Konteks Planning aktif disertakan" : "Belum ada dokumen Planning tersimpan"}
                >
                  <FileText className="w-3 h-3" />
                  <span>{includePrd && prdAvailable ? "Planning Aktif" : "Tanpa Planning"}</span>
                </button>
              </div>
            </div>

            {/* Quick Block Inserter Bar (1-Click Add Section) */}
            <div className="px-3 py-2 border-b border-white/8 bg-[#141416] shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <PlusCircle className="w-3 h-3 text-blue-400" /> Tambah Bagian Web
                </span>
                <span className="text-[9px] text-neutral-500">Sisipkan Instan</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {QUICK_BLOCK_PRESETS.map((block) => (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => handleSubmitPrompt(block.prompt)}
                    disabled={isGenerating}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 ${block.badgeColor} hover:brightness-125 hover:scale-105 active:scale-95`}
                  >
                    <i className={`${block.icon} text-[10px]`}></i>
                    <span>{block.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages List */}
            <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 prd-scroll-area">
              {/* Saved PRD Persistent Widget at the top of chat if available */}
              {prdAvailable && (
                <div className="p-3 rounded-2xl bg-amber-950/25 border border-amber-500/30 space-y-2 text-xs animate-fade-in shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">Dokumen PRD (.md) Tersimpan</div>
                        <div className="text-[10px] text-zinc-400">Arsitektur & Spesifikasi Proyek</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
                      .md
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const md = (window.getActiveProjectPrd ? window.getActiveProjectPrd() : null) || (typeof localStorage !== "undefined" ? localStorage.getItem("satusite_active_prd") : null) || "";
                      window.dispatchEvent(new CustomEvent("open-prd-sheet", { detail: { markdown: md } }));
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Buka Dokumen PRD (.md)</span>
                  </button>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-fade-in`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-neutral-400">
                      {msg.role === "user" ? "Anda" : "AI Agent"}
                    </span>
                    <span className="text-[9px] text-neutral-500">• {msg.timestamp}</span>
                  </div>
                  
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed break-words shadow-md ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-[#202025] text-neutral-200 border border-white/10 rounded-tl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    {msg.hasCodeUpdate && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-300">
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-blue-400" /> Tampilan di Canvas diperbarui
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab("preview")}
                          className="hover:underline font-semibold cursor-pointer"
                        >
                          Lihat Pratinjau
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex flex-col items-start animate-fade-in">
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-blue-400">AI Agent</span>
                    <span className="text-[9px] text-neutral-500">• Sedang menyusun...</span>
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tl-sm bg-[#202025] border border-blue-500/30 text-xs text-neutral-300 flex items-center gap-2.5 shadow-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span>{generationStep || "Sedang memproses..."}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Floating Pill */}
            <div className="p-3 border-t border-white/10 bg-[#19191c]">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={handleFileDrop}
                className="relative flex flex-col bg-[#222227] border border-white/15 rounded-2xl focus-within:border-cyan-400/60 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all"
              >
                {/* Uploaded Documents / PRD chips */}
                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-3 pt-2.5 pb-1 border-b border-white/10">
                    {uploadedFiles.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-900 border border-white/10 text-[10px] text-neutral-300"
                      >
                        <FileText className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[130px] font-medium">{f.name}</span>
                        <span className="text-neutral-500 text-[9px]">({f.size})</span>
                        <button
                          type="button"
                          onClick={() => removeUploadedFile(idx)}
                          className="ml-0.5 text-neutral-400 hover:text-rose-400 cursor-pointer"
                          title="Hapus Lampiran"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onPaste={handleFilePaste}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitPrompt();
                    }
                  }}
                  rows={2}
                  placeholder="Diskusikan ide, lampirkan dokumen PRD/spesifikasi, atau drag file ke sini..."
                  className="w-full bg-transparent p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none"
                  disabled={isGenerating}
                />

                <div className="flex items-center justify-between px-3 pb-2.5 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <label
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                      title="Lampirkan Dokumen PRD (.md, .txt, .json, .pdf, .docx, .csv, dll)"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        multiple
                        accept=".md,.markdown,.txt,.json,.csv,.pdf,.doc,.docx,.html,.yaml,.yml,.sql,image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => handleSubmitPrompt("Refactor dan rapikan seluruh tampilan web ini agar lebih modern, mewah, dan estetik dengan animasi halus.")}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                      title="Refactor & Poles Desain"
                    >
                      <Wand2 className="w-3 h-3 text-cyan-400" />
                      <span>+ Poles Estetika</span>
                    </button>
                    <span className="text-[10px] text-neutral-500 font-medium">Diskusi AI</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubmitPrompt()}
                    disabled={(!inputPrompt.trim() && uploadedFiles.length === 0) || isGenerating}
                    className="w-7 h-7 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none text-neutral-950 flex items-center justify-center transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
                    title="Kirim (Enter)"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resize Handle between Left & Right pane */}
          <div
            className="hidden md:block w-1.5 cursor-col-resize hover:bg-cyan-500/30 active:bg-cyan-500/50 transition-colors z-20 shrink-0"
            onMouseDown={startResizing}
          />

          {/* ==================================================== */}
          {/* RIGHT PANE: CANVAS STUDIO (Kode & Pratinjau)         */}
          {/* ==================================================== */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d0f] overflow-hidden">
            
            {/* Top Toolbar Bar */}
            <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between bg-[#141417] shrink-0 gap-3">
              
              {/* Left: Document Title */}
              <div className="flex items-center gap-2 min-w-0">
                <input
                  type="text"
                  value={canvasTitle}
                  onChange={(e) => setCanvasTitle(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-neutral-200 hover:bg-white/5 focus:bg-white/10 px-2 py-1 rounded-md border border-transparent focus:border-white/20 focus:outline-none transition-all truncate max-w-[160px] sm:max-w-[220px]"
                  title="Klik untuk mengubah nama dokumen"
                />
                <span className="text-[10px] text-neutral-500 hidden sm:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Tersimpan
                </span>
              </div>

              {/* Center Controls: Theme Switcher & Tab Switcher */}
              <div className="flex items-center gap-2">
                
                {/* 1-Click Theme Switcher Dropdown */}
                <div className="relative" ref={themeMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Ganti Tema Warna Website"
                  >
                    <Palette className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Tema Warna</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  {showThemeMenu && (
                    <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-[#1c1c22] border border-white/15 shadow-2xl z-50 animate-fade-in space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Pilih Nuansa Warna Instan
                      </div>
                      {THEME_PRESETS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setShowThemeMenu(false);
                            handleSubmitPrompt(t.prompt);
                          }}
                          className="w-full p-2 rounded-xl text-left hover:bg-white/10 transition-all flex flex-col gap-0.5 cursor-pointer group"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-neutral-200 group-hover:text-cyan-300">
                            <span>{t.name}</span>
                          </div>
                          <p className="text-[10px] text-neutral-400">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* In-Place Visual Text Editing Mode Button */}
                {activeTab === "preview" && (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isEditMode
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] animate-pulse"
                        : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
                    }`}
                    title={isEditMode ? "Matikan mode edit teks" : "Klik teks langsung di preview untuk mengedit kata-kata"}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">{isEditMode ? "Edit Teks (ON)" : "Edit Teks Langsung"}</span>
                  </button>
                )}

                {/* Tab Switcher (Kode | Pratinjau) */}
                <div className="flex items-center bg-[#1e1e24] p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab("code")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "code"
                        ? "bg-white/15 text-white shadow-sm"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Kode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "preview"
                        ? "bg-cyan-500 text-neutral-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau</span>
                  </button>
                </div>
              </div>

              {/* Right: Actions & Tools */}
              <div className="flex items-center gap-1.5">
                
                {/* History Undo / Redo */}
                <div className="hidden lg:flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-25 transition-colors rounded cursor-pointer"
                    title="Undo"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-25 transition-colors rounded cursor-pointer"
                    title="Redo"
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Viewport switcher */}
                {activeTab === "preview" && (
                  <div className="hidden md:flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
                    <button
                      onClick={() => setViewportMode("desktop")}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        viewportMode === "desktop" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
                      }`}
                      title="Desktop View (100%)"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewportMode("tablet")}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        viewportMode === "tablet" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
                      }`}
                      title="Tablet View (768px)"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewportMode("mobile")}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        viewportMode === "mobile" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
                      }`}
                      title="Mobile View (375px)"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Copy Code */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all text-xs cursor-pointer"
                  title="Salin Seluruh Kode"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* Download index.html */}
                <button
                  type="button"
                  onClick={handleDownloadCode}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
                  title="Unduh File HTML"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {/* Open in New Tab */}
                <button
                  type="button"
                  onClick={handleOpenNewTab}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
                  title="Buka Pratinjau di Tab Baru"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                {/* Fullscreen Expand Canvas */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden md:flex p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
                  title={isExpanded ? "Tampilkan Panel Chat" : "Maksimalkan Canvas"}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-all ml-1 cursor-pointer"
                  title="Tutup Canvas Studio"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Viewport Content Container */}
            <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col items-center justify-center p-0 md:p-3 bg-[#0a0a0c]">
              
              {/* In-Place Editing Notification Banner */}
              {isEditMode && activeTab === "preview" && (
                <div className="w-full max-w-2xl px-4 py-2 mb-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between animate-fade-in shadow-lg shrink-0">
                  <span className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span><b>Mode Edit Teks Aktif:</b> Klik teks apa saja pada website di bawah untuk langsung mengganti kata-kata.</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-bold text-[11px] text-amber-200 cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              )}

              {/* TAB 1: PRATINJAU (Interactive Iframe Sandbox) */}
              {activeTab === "preview" && (
                <div
                  className={`h-full transition-all duration-300 relative flex flex-col rounded-none md:rounded-xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl ${
                    viewportMode === "desktop"
                      ? "w-full"
                      : viewportMode === "tablet"
                      ? "w-[768px] max-w-full my-auto ring-12 ring-neutral-900 rounded-2xl"
                      : "w-[375px] max-w-full my-auto ring-12 ring-neutral-900 rounded-3xl"
                  }`}
                >
                  {/* Shimmer Loading Overlay during generation */}
                  {isGenerating && (
                    <div className="absolute inset-0 z-30 bg-[#121215]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                        <Code2 className="w-8 h-8 text-cyan-400 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">
                        {generationStep || "Mengompilasi Antarmuka Web..."}
                      </h3>
                      <p className="text-xs text-neutral-400 max-w-md mb-6 leading-relaxed">
                        AI Agent sedang meracik kode HTML & Tailwind CSS berkualitas tinggi...
                      </p>
                      <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4"></div>
                      </div>
                      <span className="text-[11px] text-neutral-500 mt-3 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-400" /> Segera siap
                      </span>
                    </div>
                  )}

                  {/* Sandboxed Iframe */}
                  <iframe
                    ref={iframeRef}
                    title="Live Web Canvas Preview"
                    srcDoc={previewSrcDoc}
                    sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
                    className="w-full h-full border-0 bg-neutral-950"
                  />
                </div>
              )}

              {/* TAB 2: KODE (Interactive Code Editor) */}
              {activeTab === "code" && (
                <div className="w-full h-full flex flex-col bg-[#141418] rounded-none md:rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                  <div className="h-9 px-4 border-b border-white/8 bg-[#18181d] flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-mono text-[11px] text-cyan-300">index.html (Tailwind CSS + JS)</span>
                    <span className="text-[11px] text-neutral-500">Edit kode di bawah untuk langsung memperbarui preview</span>
                  </div>
                  <div className="flex-1 flex min-h-0 relative font-mono text-xs">
                    <textarea
                      ref={codeTextareaRef}
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        saveProjectState(e.target.value, messages, canvasTitle);
                      }}
                      className="flex-1 w-full h-full p-4 bg-[#111115] text-neutral-200 border-0 focus:outline-none resize-none prd-scroll-area leading-relaxed selection:bg-cyan-500/30 selection:text-white"
                      spellCheck={false}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="h-8 px-4 border-t border-white/8 bg-[#121215] flex items-center justify-between text-[11px] text-neutral-500 shrink-0">
              <div className="flex items-center gap-3">
                <span>Format: Single-File HTML5</span>
                <span>•</span>
                <span>Tailwind CSS Standalone CDN</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline">Tekan Escape untuk menutup</span>
                <span className="text-cyan-400 font-medium">SATU SITE Studio Canvas Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PrdSheetViewer />
    </div>,
    document.body
  );
}
