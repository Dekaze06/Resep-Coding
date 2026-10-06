import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MousePointer,
  Hand,
  Type,
  Square,
  Plus,
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Copy,
  Eye,
  Trash2,
  CopyPlus,
  Palette,
  Layers,
  LayoutTemplate,
  Sliders,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Check,
  Code2,
  Sparkles,
  RotateCcw,
  Save,
  HelpCircle
} from "lucide-react";

export interface FigmaElement {
  id: string;
  tag: string;
  classes: string;
  text?: string;
  style?: Record<string, string>;
  children?: FigmaElement[];
}

const INITIAL_DESIGN_HTML = `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Figma Visual Canvas - Live Design</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    [data-figma-id] { position: relative; transition: outline 0.15s ease; cursor: pointer; }
    [data-figma-id]:hover { outline: 1.5px dashed #3b82f6 !important; outline-offset: 2px; }
    [data-figma-selected="true"] { outline: 2px solid #2563eb !important; outline-offset: 2px; box-shadow: 0 0 0 4px rgba(37,99,235,0.2) !important; }
    .figma-badge { position: absolute; top: -18px; left: 0; background: #2563eb; color: #ffffff; font-size: 9px; font-weight: 700; font-family: monospace; padding: 1px 5px; border-radius: 3px; z-index: 9999; pointer-events: none; }
  </style>
</head>
<body class="bg-[#09090b] text-zinc-100 min-h-screen flex flex-col selection:bg-red-600 selection:text-white p-0 m-0">

  <!-- Header / Navigation -->
  <header data-figma-id="el_nav" class="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
    <div data-figma-id="el_brand" class="flex items-center gap-3">
      <div data-figma-id="el_logo_icon" class="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-600/30">
        <i class="fa-solid fa-graduation-cap"></i>
      </div>
      <div>
        <h1 data-figma-id="el_brand_title" class="text-sm font-extrabold text-white leading-none">SMK TELKOM BANDUNG</h1>
        <p data-figma-id="el_brand_sub" class="text-[10px] text-zinc-400 mt-1">The Real Informatics School</p>
      </div>
    </div>
    <nav data-figma-id="el_nav_links" class="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
      <a data-figma-id="el_nav_1" href="#home" class="text-white font-semibold hover:text-red-400 transition-colors">Beranda</a>
      <a data-figma-id="el_nav_2" href="#jurusan" class="hover:text-white transition-colors">Jurusan</a>
      <a data-figma-id="el_nav_3" href="#ppdb" class="hover:text-white transition-colors">PPDB Online</a>
      <a data-figma-id="el_nav_4" href="#kontak" class="hover:text-white transition-colors">Kontak</a>
    </nav>
    <button data-figma-id="el_btn_ppdb" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/25 transition-all">
      Daftar Sekarang
    </button>
  </header>

  <!-- Hero Section -->
  <main data-figma-id="el_hero" class="max-w-6xl w-full mx-auto px-6 py-16 text-center flex flex-col items-center justify-center space-y-6">
    <div data-figma-id="el_hero_badge" class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
      <i class="fa-solid fa-award text-xs"></i>
      <span data-figma-id="el_badge_text">Penerimaan Siswa Baru PPDB 2026/2027 Dibuka</span>
    </div>
    <h2 data-figma-id="el_hero_heading" class="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
      Pendidikan Kejuruan Teknologi Masa Depan di <span class="text-red-500">Bandung</span>
    </h2>
    <p data-figma-id="el_hero_desc" class="text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed">
      Kembangkan keahlian unggulan dalam Rekayasa Perangkat Lunak, Jaringan Komputer, Desain Multimedia, dan Akses Telekomunikasi berstandar industri internasional.
    </p>
    <div data-figma-id="el_hero_actions" class="flex flex-wrap items-center justify-center gap-3 pt-2">
      <button data-figma-id="el_btn_primary" class="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center gap-2">
        <i class="fa-solid fa-file-pen text-xs"></i>
        <span data-figma-id="el_btn_text_1">Registrasi PPDB Online</span>
      </button>
      <button data-figma-id="el_btn_secondary" class="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition-colors">
        Unduh Brosur Informasi
      </button>
    </div>
  </main>

  <!-- Feature Cards Grid -->
  <section data-figma-id="el_features" class="max-w-6xl w-full mx-auto px-6 pb-20">
    <div data-figma-id="el_feat_header" class="text-center space-y-1 mb-10">
      <h3 data-figma-id="el_feat_title" class="text-2xl font-bold text-white">4 Program Keahlian Unggulan</h3>
      <p data-figma-id="el_feat_sub" class="text-xs text-zinc-400">Siap kerja, siap kuliah, dan siap berwirausaha digital</p>
    </div>
    <div data-figma-id="el_feat_grid" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      
      <!-- Card 1 -->
      <div data-figma-id="el_card_1" class="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 hover:border-red-500/40 transition-all">
        <div data-figma-id="el_icon_box_1" class="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-lg">
          <i class="fa-solid fa-code"></i>
        </div>
        <h4 data-figma-id="el_card_title_1" class="font-bold text-white text-base">RPL</h4>
        <p data-figma-id="el_card_desc_1" class="text-xs text-zinc-400 leading-relaxed">Rekayasa Perangkat Lunak: Web App, Mobile Programming, dan Cloud Backend.</p>
      </div>

      <!-- Card 2 -->
      <div data-figma-id="el_card_2" class="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 hover:border-red-500/40 transition-all">
        <div data-figma-id="el_icon_box_2" class="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-lg">
          <i class="fa-solid fa-network-wired"></i>
        </div>
        <h4 data-figma-id="el_card_title_2" class="font-bold text-white text-base">TKJ</h4>
        <p data-figma-id="el_card_desc_2" class="text-xs text-zinc-400 leading-relaxed">Teknik Komputer Jaringan: Cisco Networking, Linux Server, dan Cyber Security.</p>
      </div>

      <!-- Card 3 -->
      <div data-figma-id="el_card_3" class="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 hover:border-red-500/40 transition-all">
        <div data-figma-id="el_icon_box_3" class="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-lg">
          <i class="fa-solid fa-bezier-curve"></i>
        </div>
        <h4 data-figma-id="el_card_title_3" class="font-bold text-white text-base">DKV</h4>
        <p data-figma-id="el_card_desc_3" class="text-xs text-zinc-400 leading-relaxed">Desain Komunikasi Visual: UI/UX Prototyping, Motion Graphic, dan 3D Assets.</p>
      </div>

      <!-- Card 4 -->
      <div data-figma-id="el_card_4" class="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 hover:border-red-500/40 transition-all">
        <div data-figma-id="el_icon_box_4" class="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-lg">
          <i class="fa-solid fa-tower-cell"></i>
        </div>
        <h4 data-figma-id="el_card_title_4" class="font-bold text-white text-base">TJA</h4>
        <p data-figma-id="el_card_desc_4" class="text-xs text-zinc-400 leading-relaxed">Teknik Jaringan Akses: Fiber Optic FTTH, Jaringan Seluler 5G, dan Transmisi Data.</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer data-figma-id="el_footer" class="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-8 px-6 text-center text-xs text-zinc-500">
    <p data-figma-id="el_footer_text">&copy; 2026 SMK Telkom Bandung. Hak Cipta Dilindungi.</p>
  </footer>

</body>
</html>`;

export default function FigmaDesignStudio() {
  // Current Canvas HTML Code
  const [htmlCode, setHtmlCode] = useState<string>(INITIAL_DESIGN_HTML);
  const [history, setHistory] = useState<string[]>([INITIAL_DESIGN_HTML]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Figma Tool State: 'select' | 'hand' | 'text' | 'rect' | 'button'
  const [activeTool, setActiveTool] = useState<"select" | "hand" | "text" | "rect" | "button">("select");
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Selection & Properties Inspector State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectedClasses, setSelectedClasses] = useState<string>("");
  const [selectedBgColor, setSelectedBgColor] = useState<string>("#dc2626");
  const [selectedTextColor, setSelectedTextColor] = useState<string>("#ffffff");
  const [selectedFontSize, setSelectedFontSize] = useState<string>("14px");
  const [selectedFontWeight, setSelectedFontWeight] = useState<string>("600");
  const [selectedBorderRadius, setSelectedBorderRadius] = useState<string>("12px");
  const [selectedPadding, setSelectedPadding] = useState<string>("12px 24px");

  // Left Sidebar Tab: 'layers' | 'components' | 'presets'
  const [activeLeftTab, setActiveLeftTab] = useState<"layers" | "components" | "presets">("layers");

  // Code Export Modal & Toast state
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Push new state to undo/redo history
  const updateHtml = useCallback((newHtml: string) => {
    setHtmlCode(newHtml);
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newHtml];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setHtmlCode(history[newIdx]);
      setSelectedId(null);
      showToast("Undo berhasil");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setHtmlCode(history[newIdx]);
      setSelectedId(null);
      showToast("Redo berhasil");
    }
  };

  // Sync iframe message communication for click selection and inline edit
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;

      if (event.data.type === "FIGMA_ELEMENT_CLICKED") {
        const { id, tag, text, classes, computedStyle } = event.data;
        setSelectedId(id);
        setSelectedTag(tag);
        setSelectedText(text || "");
        setSelectedClasses(classes || "");
        if (computedStyle) {
          if (computedStyle.color) setSelectedTextColor(computedStyle.color);
          if (computedStyle.backgroundColor && computedStyle.backgroundColor !== "rgba(0, 0, 0, 0)") {
            setSelectedBgColor(computedStyle.backgroundColor);
          }
          if (computedStyle.fontSize) setSelectedFontSize(computedStyle.fontSize);
          if (computedStyle.fontWeight) setSelectedFontWeight(computedStyle.fontWeight);
          if (computedStyle.borderRadius) setSelectedBorderRadius(computedStyle.borderRadius);
        }
      }

      if (event.data.type === "FIGMA_TEXT_INLINE_EDITED") {
        const { id, newText } = event.data;
        if (id && newText !== undefined) {
          handleApplyTextDirectly(id, newText);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [htmlCode, updateHtml]);

  // Inject click listeners & selection outlines into the iframe
  const injectIframeScript = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;

    // Attach click listener to select elements
    doc.querySelectorAll("[data-figma-id]").forEach(el => {
      (el as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Highlight in iframe
        doc.querySelectorAll("[data-figma-selected]").forEach(node => {
          node.removeAttribute("data-figma-selected");
          const badge = node.querySelector(".figma-badge");
          if (badge) badge.remove();
        });

        el.setAttribute("data-figma-selected", "true");

        // Add Figma tag badge
        const badge = doc.createElement("div");
        badge.className = "figma-badge";
        badge.textContent = el.tagName.toLowerCase();
        el.appendChild(badge);

        const computed = window.getComputedStyle(el);
        window.postMessage({
          type: "FIGMA_ELEMENT_CLICKED",
          id: el.getAttribute("data-figma-id"),
          tag: el.tagName.toLowerCase(),
          text: (el as HTMLElement).innerText || "",
          classes: el.className || "",
          computedStyle: {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            borderRadius: computed.borderRadius
          }
        }, "*");
      };

      // Double click for inline text editing
      (el as HTMLElement).ondblclick = (e) => {
        e.stopPropagation();
        const currentText = (el as HTMLElement).innerText;
        const input = prompt("Edit teks visual langsung:", currentText);
        if (input !== null && input !== currentText) {
          (el as HTMLElement).innerText = input;
          window.postMessage({
            type: "FIGMA_TEXT_INLINE_EDITED",
            id: el.getAttribute("data-figma-id"),
            newText: input
          }, "*");
        }
      };
    });
  };

  const handleApplyTextDirectly = (id: string, text: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, "text/html");
    const target = doc.querySelector(`[data-figma-id="${id}"]`);
    if (target) {
      target.textContent = text;
      updateHtml(doc.documentElement.outerHTML);
      showToast("Teks berhasil diperbarui pada kanvas");
    }
  };

  // Apply properties changed from the Inspector to the HTML Code
  const handleUpdateProperty = (property: "text" | "classes" | "bgColor" | "textColor" | "fontSize" | "borderRadius", val: string) => {
    if (!selectedId) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, "text/html");
    const target = doc.querySelector(`[data-figma-id="${selectedId}"]`) as HTMLElement;

    if (!target) return;

    if (property === "text") {
      target.innerText = val;
      setSelectedText(val);
    } else if (property === "classes") {
      target.className = val;
      setSelectedClasses(val);
    } else if (property === "bgColor") {
      target.style.backgroundColor = val;
      setSelectedBgColor(val);
    } else if (property === "textColor") {
      target.style.color = val;
      setSelectedTextColor(val);
    } else if (property === "fontSize") {
      target.style.fontSize = val;
      setSelectedFontSize(val);
    } else if (property === "borderRadius") {
      target.style.borderRadius = val;
      setSelectedBorderRadius(val);
    }

    const newMarkup = doc.documentElement.outerHTML;
    updateHtml(newMarkup);
  };

  // Duplicate selected element
  const handleDuplicateElement = () => {
    if (!selectedId) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, "text/html");
    const target = doc.querySelector(`[data-figma-id="${selectedId}"]`);

    if (target && target.parentElement) {
      const clone = target.cloneNode(true) as HTMLElement;
      const newId = "el_" + Date.now();
      clone.setAttribute("data-figma-id", newId);
      target.parentElement.insertBefore(clone, target.nextSibling);
      updateHtml(doc.documentElement.outerHTML);
      setSelectedId(newId);
      showToast("Elemen berhasil digandakan");
    }
  };

  // Delete selected element
  const handleDeleteElement = () => {
    if (!selectedId) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, "text/html");
    const target = doc.querySelector(`[data-figma-id="${selectedId}"]`);

    if (target) {
      target.remove();
      updateHtml(doc.documentElement.outerHTML);
      setSelectedId(null);
      showToast("Elemen berhasil dihapus dari desain");
    }
  };

  // Insert a Pre-built Component into Canvas
  const handleInsertComponent = (type: "button" | "card" | "banner" | "heading") => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, "text/html");
    const container = doc.querySelector("main") || doc.querySelector("body");

    if (!container) return;

    const newId = "el_comp_" + Date.now();
    const wrapper = doc.createElement("div");

    if (type === "button") {
      wrapper.innerHTML = `
        <div data-figma-id="${newId}" class="my-4 text-center">
          <button class="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all">
            Tombol Aksi Baru
          </button>
        </div>
      `;
    } else if (type === "card") {
      wrapper.innerHTML = `
        <div data-figma-id="${newId}" class="my-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-2 max-w-md mx-auto">
          <div class="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-lg">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <h4 class="font-bold text-white text-base">Judul Kartu Baru</h4>
          <p class="text-xs text-zinc-400">Deskripsi konten komponen visual baru. Klik dua kali untuk mengedit teks secara langsung.</p>
        </div>
      `;
    } else if (type === "banner") {
      wrapper.innerHTML = `
        <div data-figma-id="${newId}" class="my-6 p-6 rounded-3xl bg-gradient-to-r from-red-600 to-rose-700 text-white text-center space-y-3 shadow-xl">
          <h3 class="text-xl font-extrabold">Pengumuman Khusus PPDB 2026</h3>
          <p class="text-xs text-red-100 max-w-lg mx-auto">Dapatkan potongan biaya pendaftaran awal bagi siswa berprestasi akademik dan non-akademik.</p>
        </div>
      `;
    } else if (type === "heading") {
      wrapper.innerHTML = `
        <div data-figma-id="${newId}" class="my-6 text-center space-y-1">
          <h2 class="text-3xl font-extrabold text-white">Section Baru</h2>
          <p class="text-xs text-zinc-400">Sub-judul bagian baru dapat disesuaikan sesuka Anda</p>
        </div>
      `;
    }

    if (wrapper.firstElementChild) {
      container.appendChild(wrapper.firstElementChild);
      updateHtml(doc.documentElement.outerHTML);
      setSelectedId(newId);
      showToast("Komponen baru berhasil ditambahkan ke kanvas");
    }
  };

  // Parse layers tree from current HTML
  const parsedLayers = React.useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, "text/html");
    const elements: Array<{ id: string; name: string; tag: string }> = [];

    doc.querySelectorAll("[data-figma-id]").forEach(el => {
      const id = el.getAttribute("data-figma-id") || "";
      let name = el.tagName.toLowerCase();
      const text = el.textContent?.trim().slice(0, 25);
      if (text) {
        name += ` ("${text}...")`;
      }
      elements.push({ id, name, tag: el.tagName.toLowerCase() });
    });

    return elements;
  }, [htmlCode]);

  // Viewport width styling
  const viewportWidth = 
    viewportMode === "mobile" ? "390px" :
    viewportMode === "tablet" ? "768px" : "100%";

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#121215] text-zinc-100 select-none font-sans">

      {/* TOP FIGMA TOOLBAR */}
      <header className="h-14 bg-zinc-950 border-b border-zinc-800 px-4 flex items-center justify-between z-40 shrink-0">
        
        {/* Left: Back & Project Title */}
        <div className="flex items-center gap-3">
          <a
            href="/studio"
            className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            title="Kembali ke Portal Studio"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
          </a>
          <div className="h-4 w-px bg-zinc-800"></div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              <i className="fa-brands fa-figma text-[11px]"></i>
            </span>
            <span className="text-xs font-bold text-white tracking-tight">Studio Desain (Figma Canvas)</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono border border-zinc-700/60 font-semibold">
              WYSIWYG VISUAL
            </span>
          </div>
        </div>

        {/* Center: Figma Tools & Viewport Mode */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTool("select")}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTool === "select" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
            title="Move / Select Tool (V)"
          >
            <MousePointer className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool("hand")}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTool === "hand" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
            title="Hand Tool (H)"
          >
            <Hand className="w-4 h-4" />
          </button>
          
          <div className="h-4 w-px bg-zinc-800 mx-1"></div>

          {/* Quick Insert Actions */}
          <button
            onClick={() => handleInsertComponent("heading")}
            className="px-2 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-1 transition-all"
            title="Tambah Judul Teks (T)"
          >
            <Type className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-medium hidden sm:inline">Teks</span>
          </button>
          <button
            onClick={() => handleInsertComponent("card")}
            className="px-2 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-1 transition-all"
            title="Tambah Kotak / Kartu (R)"
          >
            <Square className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium hidden sm:inline">Kartu</span>
          </button>
          <button
            onClick={() => handleInsertComponent("button")}
            className="px-2 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-1 transition-all"
            title="Tambah Tombol Interaktif"
          >
            <Plus className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] font-medium hidden sm:inline">Tombol</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 mx-1"></div>

          {/* Viewport Sizes */}
          <button
            onClick={() => setViewportMode("desktop")}
            className={`p-1.5 rounded-lg transition-all ${
              viewportMode === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
            title="Desktop 1440px"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportMode("tablet")}
            className={`p-1.5 rounded-lg transition-all ${
              viewportMode === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportMode("mobile")}
            className={`p-1.5 rounded-lg transition-all ${
              viewportMode === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
            title="Mobile 390px"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom, Undo, Redo, Export */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs text-zinc-300">
            <button
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
              className="p-1 hover:text-white hover:bg-zinc-800 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-semibold">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
              className="p-1 hover:text-white hover:bg-zinc-800 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Undo & Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className={`w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-colors ${
              historyIndex <= 0 ? "opacity-40 cursor-not-allowed text-zinc-600" : "text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={`w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-colors ${
              historyIndex >= history.length - 1 ? "opacity-40 cursor-not-allowed text-zinc-600" : "text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Export & Code Modal */}
          <button
            onClick={() => setShowCodeModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Ekspor HTML</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE BODY (3 PANELS: LAYERS | CANVAS | INSPECTOR) */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT SIDEBAR: LAYERS & COMPONENTS TREE */}
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col z-20 shrink-0">
          <div className="flex border-b border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => setActiveLeftTab("layers")}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeLeftTab === "layers" ? "border-blue-500 text-white bg-zinc-900/40" : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers ({parsedLayers.length})</span>
            </button>
            <button
              onClick={() => setActiveLeftTab("components")}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeLeftTab === "components" ? "border-blue-500 text-white bg-zinc-900/40" : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Komponen</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeLeftTab === "layers" && (
              <div className="space-y-0.5 text-xs">
                {parsedLayers.map((layer) => {
                  const isSelected = selectedId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedId(layer.id)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-600 text-white font-semibold" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] text-zinc-500 uppercase">{layer.tag}</span>
                        <span className="truncate text-xs">{layer.name}</span>
                      </div>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>}
                    </div>
                  );
                })}
              </div>
            )}

            {activeLeftTab === "components" && (
              <div className="p-2 space-y-3">
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Klik komponen di bawah untuk memasukkan elemen visual langsung ke dalam tampilan kanvas:
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleInsertComponent("heading")}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs font-semibold text-zinc-200 flex items-center justify-between transition-colors"
                  >
                    <span>Judul & Subtitle Baru</span>
                    <Plus className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleInsertComponent("button")}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs font-semibold text-zinc-200 flex items-center justify-between transition-colors"
                  >
                    <span>Tombol Call-to-Action</span>
                    <Plus className="w-3.5 h-3.5 text-red-400" />
                  </button>
                  <button
                    onClick={() => handleInsertComponent("card")}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs font-semibold text-zinc-200 flex items-center justify-between transition-colors"
                  >
                    <span>Kartu Fitur / Layanan</span>
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => handleInsertComponent("banner")}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs font-semibold text-zinc-200 flex items-center justify-between transition-colors"
                  >
                    <span>Banner Pengumuman</span>
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER: INFINITE CANVAS WITH FIGMA ARTBOARD */}
        <main className="flex-1 bg-[#1e1e24] overflow-auto flex items-center justify-center p-8 relative">
          
          {/* Subtle Figma Dot Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          ></div>

          {/* Figma Artboard Container */}
          <div
            className="transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-zinc-800 relative bg-[#09090b]"
            style={{
              width: viewportWidth,
              maxWidth: "1440px",
              height: "85vh",
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "center center"
            }}
          >
            {/* Embedded Live Editable Iframe */}
            <iframe
              ref={iframeRef}
              srcDoc={htmlCode}
              onLoad={injectIframeScript}
              className="w-full h-full border-none bg-[#09090b]"
              title="Figma Live Visual Canvas"
              sandbox="allow-scripts allow-same-origin allow-modals"
            />
          </div>

          {/* Quick Floating Hint Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-[11px] text-zinc-400 font-mono flex items-center gap-2 pointer-events-none shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Klik elemen untuk memilih • Klik dua kali (double click) untuk edit teks langsung</span>
          </div>
        </main>

        {/* RIGHT SIDEBAR: FIGMA PROPERTIES INSPECTOR */}
        <aside className="w-72 bg-zinc-950 border-l border-zinc-800 flex flex-col z-20 shrink-0 overflow-y-auto">
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Inspector Desain</span>
            </div>
            {selectedId ? (
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold">
                {selectedTag.toUpperCase()}
              </span>
            ) : (
              <span className="text-[10px] text-zinc-500 font-mono">PILIH ELEMEN</span>
            )}
          </div>

          <div className="p-4 space-y-5 text-xs">
            {selectedId ? (
              <>
                {/* 1. Teks Konten Langsung */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300 text-[11px]">Teks / Tulisan Konten:</label>
                  <textarea
                    rows={2}
                    value={selectedText}
                    onChange={(e) => handleUpdateProperty("text", e.target.value)}
                    placeholder="Ketik teks di sini..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* 2. Warna Background & Teks */}
                <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                  <span className="font-bold text-zinc-200 text-xs block">Warna & Tampilan (Fill)</span>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Warna Background:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedBgColor.startsWith("#") ? selectedBgColor : "#dc2626"}
                        onChange={(e) => handleUpdateProperty("bgColor", e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={selectedBgColor}
                        onChange={(e) => handleUpdateProperty("bgColor", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Warna Teks:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedTextColor.startsWith("#") ? selectedTextColor : "#ffffff"}
                        onChange={(e) => handleUpdateProperty("textColor", e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={selectedTextColor}
                        onChange={(e) => handleUpdateProperty("textColor", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Tipografi */}
                <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                  <span className="font-bold text-zinc-200 text-xs block">Tipografi</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400">Ukuran Font:</label>
                      <select
                        value={selectedFontSize}
                        onChange={(e) => handleUpdateProperty("fontSize", e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs cursor-pointer"
                      >
                        <option value="12px">12px (Small)</option>
                        <option value="14px">14px (Regular)</option>
                        <option value="16px">16px (Base)</option>
                        <option value="18px">18px (Medium)</option>
                        <option value="24px">24px (Large)</option>
                        <option value="36px">36px (Title)</option>
                        <option value="48px">48px (Hero)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400">Ketebalan:</label>
                      <select
                        value={selectedFontWeight}
                        onChange={(e) => handleUpdateProperty("fontWeight", e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs cursor-pointer"
                      >
                        <option value="400">Regular (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semibold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="800">Extra Bold (800)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Radius & Kelengkungan Sudut */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                  <label className="text-[11px] text-zinc-400">Border Radius (Sudut Membulat):</label>
                  <select
                    value={selectedBorderRadius}
                    onChange={(e) => handleUpdateProperty("borderRadius", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs cursor-pointer"
                  >
                    <option value="0px">Lancip (0px)</option>
                    <option value="8px">Halus (8px)</option>
                    <option value="12px">Sedang (12px)</option>
                    <option value="16px">Membulat (16px)</option>
                    <option value="9999px">Kapsul Penuh (Pill)</option>
                  </select>
                </div>

                {/* 5. Aksi Elemen Terpilih */}
                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <button
                    onClick={handleDuplicateElement}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs border border-zinc-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CopyPlus className="w-3.5 h-3.5 text-blue-400" />
                    <span>Gandakan Elemen Ini</span>
                  </button>
                  <button
                    onClick={handleDeleteElement}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-red-950/60 text-red-400 hover:text-red-300 font-semibold text-xs border border-zinc-800 hover:border-red-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus dari Desain</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-zinc-500 space-y-3">
                <MousePointer className="w-8 h-8 mx-auto text-zinc-600 opacity-60" />
                <p className="text-xs leading-relaxed max-w-[200px] mx-auto">
                  Pilih elemen apa saja di dalam kanvas untuk memeriksa dan mengedit properti desainnya secara langsung.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* MODAL EXPORT HTML */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Ekspor Kode HTML & CSS Desain</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <textarea
              readOnly
              rows={12}
              value={htmlCode}
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(htmlCode);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                  showToast("Kode HTML berhasil disalin ke clipboard!");
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? "Tersalin!" : "Salin Kode"}</span>
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([htmlCode], { type: "text/html;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "desain_figma_canvas.html";
                  a.click();
                  URL.revokeObjectURL(url);
                  showToast("File HTML berhasil diunduh!");
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File HTML</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-zinc-700 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
