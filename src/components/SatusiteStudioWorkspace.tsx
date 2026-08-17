import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Code2,
  Eye,
  Download,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  X,
  Loader2,
  RotateCw,
  CheckCircle2,
  Database,
  Terminal as TerminalIcon,
  Globe,
  Workflow,
  QrCode,
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  Paperclip,
  Mic,
  ArrowUp,
  Square,
  ShoppingBag,
  Compass,
  Utensils,
  Layout,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
  ChevronDown,
  FolderGit2,
  FileText,
  History,
  Trash2,
  Plus,
  Search
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: string;
  hasCodeUpdate?: boolean;
  agentName?: string;
  steps?: string[];
}

export default function SatusiteStudioWorkspace() {
  const [genMode, setGenMode] = useState<"fullstack" | "frontend" | "prd">("fullstack");
  const [showModeDropdown, setShowModeDropdown] = useState<"center" | "side" | null>(null);
  const [projectId, setProjectId] = useState<string>("proj_default");
  const [projectName, setProjectName] = useState<string>("Proyek Baru");
  const [code, setCode] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [showCanvas, setShowCanvas] = useState<boolean>(true);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      role: "agent",
      agentName: "AI Agent",
      text: "Halo! Pilih mode Fullstack, Frontend, atau PRD di bawah, lalu ketikkan ide yang ingin Anda bangun.",
      timestamp: "Siap",
    }
  ]);

  const [activeTab, setActiveTab] = useState<"preview" | "code" | "architecture" | "database" | "logs">("preview");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentThinkingStep, setCurrentThinkingStep] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historySearch, setHistorySearch] = useState<string>("");
  const [savedProjectsList, setSavedProjectsList] = useState<any[]>([]);
  const [activeCodeFile, setActiveCodeFile] = useState<"index.html" | "styles.css" | "app.js" | "database.json">("index.html");
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Satusite Studio v2.5 initialized",
    "[AI AGENT] Ready for prompt execution",
    "[SANDBOX] Hot-reloader active",
    "[DATABASE] In-memory collection mounted",
  ]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadSavedProjects = useCallback(() => {
    try {
      const storeRaw = localStorage.getItem("satusite_projects_store") || localStorage.getItem("emergent_projects_store");
      if (storeRaw) {
        const parsed = JSON.parse(storeRaw);
        if (parsed && parsed.projects) {
          const list = Object.values(parsed.projects).sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));
          setSavedProjectsList(list);
          return;
        }
      }
      setSavedProjectsList([]);
    } catch (e) {
      console.warn("Failed loading saved projects:", e);
      setSavedProjectsList([]);
    }
  }, []);

  const handleCopyMessage = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMsgId(id);
      setTimeout(() => setCopiedMsgId(null), 2000);
    }
  };

  const handleSelectHistoryProject = (p: any) => {
    setProjectId(p.id);
    setProjectName(p.name || "Proyek Baru");
    if (p.code) {
      setCode(p.code);
      setHasGenerated(true);
    }
    if (p.messages && p.messages.length > 0) {
      setMessages(p.messages);
      setHasGenerated(true);
    }
    setShowHistoryModal(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("id", p.id);
      window.history.replaceState({}, "", url.toString());
    } catch (err) {}
  };

  const handleDeleteHistoryProject = (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    if (!confirm("Hapus sesi percakapan ini dari riwayat?")) return;
    try {
      const storeRaw = localStorage.getItem("satusite_projects_store") || localStorage.getItem("emergent_projects_store");
      if (storeRaw) {
        const store = JSON.parse(storeRaw);
        if (store && store.projects && store.projects[targetId]) {
          delete store.projects[targetId];
          localStorage.setItem("satusite_projects_store", JSON.stringify(store));
          loadSavedProjects();
        }
      }
    } catch (err) {
      console.warn("Failed deleting project:", err);
    }
  };

  const handleNewChat = () => {
    const newId = "proj_" + Date.now();
    setProjectId(newId);
    setProjectName("Proyek Baru");
    setCode("");
    setHasGenerated(false);
    setShowCanvas(true);
    setMessages([
      {
        id: "msg_1",
        role: "agent",
        agentName: "AI Agent",
        text: "Halo! Pilih mode Fullstack, Frontend, atau PRD di bawah, lalu ketikkan ide yang ingin Anda bangun.",
        timestamp: "Siap",
      }
    ]);
    setShowHistoryModal(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("id");
      url.searchParams.delete("prompt");
      window.history.replaceState({}, "", url.toString());
    } catch (err) {}
  };

  const filteredHistory = useMemo(() => {
    if (!historySearch.trim()) return savedProjectsList;
    const q = historySearch.toLowerCase();
    return savedProjectsList.filter((p: any) => {
      const nameMatch = (p.name || "").toLowerCase().includes(q);
      const msgMatch = (p.messages || []).some((m: any) => (m.text || "").toLowerCase().includes(q));
      return nameMatch || msgMatch;
    });
  }, [savedProjectsList, historySearch]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qPrompt = params.get("prompt");
      const qId = params.get("id");
      const qName = params.get("name");
      const qMode = params.get("mode");

      let initialMode: "fullstack" | "frontend" | "prd" = "fullstack";
      if (qMode === "frontend" || qMode === "fullstack" || qMode === "prd") {
        initialMode = qMode;
        setGenMode(qMode);
      }

      if (qName) setProjectName(qName);

      const storeRaw = localStorage.getItem("satusite_projects_store") || localStorage.getItem("emergent_projects_store");
      const store = storeRaw ? JSON.parse(storeRaw) : { projects: {} };

      if (qId && store.projects[qId]) {
        const p = store.projects[qId];
        setProjectId(qId);
        setProjectName(p.name || "Proyek Baru");
        if (p.code) {
          setCode(p.code);
          setHasGenerated(true);
        }
        if (p.messages && p.messages.length > 0) setMessages(p.messages);
      } else if (qPrompt) {
        const newId = "proj_" + Date.now();
        setProjectId(newId);
        const name = qPrompt.slice(0, 30) + (qPrompt.length > 30 ? "..." : "");
        setProjectName(name);
        setHasGenerated(true);
        handleSendPrompt(qPrompt, name, newId, initialMode);
      }
    } catch (err) {
      console.warn("Error parsing init query params:", err);
    }
  }, []);

  const saveProjectState = useCallback((newCode: string, newMessages: ChatMessage[], newName?: string) => {
    try {
      const storeRaw = localStorage.getItem("satusite_projects_store") || localStorage.getItem("emergent_projects_store");
      const store = storeRaw ? JSON.parse(storeRaw) : { projects: {} };
      const currentName = newName || projectName;

      store.projects[projectId] = {
        id: projectId,
        name: currentName,
        code: newCode,
        messages: newMessages,
        updatedAt: Date.now(),
        createdAt: store.projects[projectId]?.createdAt || Date.now()
      };
      store.activeId = projectId;
      localStorage.setItem("satusite_projects_store", JSON.stringify(store));
    } catch (e) {
      console.warn("Failed saving project:", e);
    }
  }, [projectId, projectName]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSendPrompt = async (promptToSend?: string, customName?: string, customId?: string, modeOverride?: "fullstack" | "frontend" | "prd") => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isGenerating) return;

    setHasGenerated(true);
    setShowCanvas(true);
    setInputPrompt("");
    setIsGenerating(true);

    const effectiveMode = modeOverride || genMode;
    const isFull = effectiveMode === "fullstack";
    const isPrd = effectiveMode === "prd";

    setCurrentThinkingStep(
      isPrd
        ? "AI Agent menganalisis kebutuhan sistem, arsitektur, & membuat PRD..."
        : isFull
        ? "AI Agent menganalisis model data, skema, & arsitektur fullstack..."
        : "AI Agent menyusun tata letak visual & styling responsif..."
    );

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      role: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    const thinkingTimer1 = setTimeout(() => {
      setCurrentThinkingStep(
        isPrd
          ? "AI Agent menyusun entity-relationship & arsitektur data..."
          : isFull
          ? "AI Agent merancang database in-memory & fungsi CRUD..."
          : "AI Agent merancang section halaman lengkap & navigasi..."
      );
      setLogs(prev => [
        ...prev,
        isPrd
          ? `[SPEC-ENGINE] Product architecture & user persona specifications generated for "${text.slice(0, 25)}..."`
          : isFull
          ? `[ARCHITECT] In-memory database schema & CRUD endpoints configured for "${text.slice(0, 25)}..."`
          : `[DESIGNER] Layout tokens, palette & responsive grid initialized for "${text.slice(0, 25)}..."`
      ]);
    }, 1200);

    const thinkingTimer2 = setTimeout(() => {
      setCurrentThinkingStep(
        isPrd
          ? "AI Agent menyusun blueprint interaktif & spesifikasi teknis..."
          : isFull
          ? "AI Agent mengintegrasikan state storage & sinkronisasi UI..."
          : "AI Agent menyempurnakan interaksi UI, animasi & modal..."
      );
      setLogs(prev => [
        ...prev,
        isPrd
          ? `[BLUEPRINT] Interactive PRD dashboard, diagrams & MVP features ready`
          : isFull
          ? `[BACKEND] localStorage adapter & state synchronization connected`
          : `[FRONTEND] Interactive components, modals, filters & views generated`
      ]);
    }, 2400);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/generate-canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: text,
          projectName: customName || projectName,
          currentCode: code,
          chatHistory: updatedMessages,
          mode: effectiveMode
        })
      });

      clearTimeout(thinkingTimer1);
      clearTimeout(thinkingTimer2);

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Terjadi kesalahan saat memproses permintaan.");
      }

      const agentResponseText =
        data.message ||
        (isPrd
          ? "Dokumen PRD & Blueprint arsitektur aplikasi berhasil dirancang secara komprehensif."
          : isFull
          ? "Aplikasi Fullstack berhasil dirancang lengkap dengan skema data, CRUD, dan UI interaktif."
          : "Tampilan Frontend berhasil dirancang lengkap dengan layout responsif dan komponen visual.");
      
      const newGeneratedCode = data.code && data.hasCodeUpdate ? data.code : code;

      const agentMsg: ChatMessage = {
        id: "msg_agent_" + Date.now(),
        role: "agent",
        agentName: "AI Agent",
        text: agentResponseText,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        hasCodeUpdate: data.hasCodeUpdate,
        steps: isPrd
          ? [
              "Spesifikasi teknis & persona pengguna tersusun",
              "Skema relasi database & API contract siap",
              "Dokumen PRD & blueprint interaktif selesai"
            ]
          : isFull
          ? [
              "Skema data & model entitas siap",
              "Handler CRUD & penyimpanan localStorage aktif",
              "Antarmuka & logika bisnis terhubung"
            ]
          : [
              "Tata letak responsif (Desktop/Tablet/Mobile) selesai",
              "Komponen section lengkap terpasang",
              "Animasi & interaksi visual aktif"
            ]
      };

      const finalMessages = [...updatedMessages, agentMsg];
      setMessages(finalMessages);

      if (data.hasCodeUpdate && data.code) {
        setCode(data.code);
        saveProjectState(data.code, finalMessages, customName);
        setLogs(prev => [
          ...prev,
          `[HOT-RELOAD] index.html updated (${data.code.length} bytes) [Mode: ${genMode.toUpperCase()}]`
        ]);
      } else {
        saveProjectState(code, finalMessages, customName);
      }

    } catch (err: any) {
      clearTimeout(thinkingTimer1);
      clearTimeout(thinkingTimer2);

      if (err.name === "AbortError") {
        setLogs(prev => [...prev, `[AI AGENT] Proses dihentikan oleh pengguna.`]);
        return;
      }

      let userFriendlyError = err.message || "Terjadi kendala saat menghubungi AI.";
      if (userFriendlyError.includes("429") || userFriendlyError.includes("quota") || userFriendlyError.includes("RESOURCE_EXHAUSTED")) {
        userFriendlyError = "Batas kuota gratis AI Gemini Cloud sedang penuh sesaat. Sistem telah mengalihkan ke model cadangan, silakan coba kirim ulang prompt Anda dalam 30 detik.";
      } else if (userFriendlyError.includes("{") && userFriendlyError.includes("error")) {
        try {
          const parsed = JSON.parse(userFriendlyError.slice(userFriendlyError.indexOf("{")));
          if (parsed.error && parsed.error.message) {
            userFriendlyError = `AI Cloud Error (${parsed.error.code || "Busy"}): Permintaan sedang padat. Silakan coba lagi.`;
          }
        } catch (e) {}
      }

      setMessages(prev => [
        ...prev,
        {
          id: "msg_err_" + Date.now(),
          role: "agent",
          agentName: "AI Agent",
          text: `Pemberitahuan: ${userFriendlyError}`,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setLogs(prev => [...prev, `[STATUS] ${userFriendlyError}`]);
    } finally {
      abortControllerRef.current = null;
      setIsGenerating(false);
      setCurrentThinkingStep("");
    }
  };

  const handleEnhancePrompt = () => {
    if (!inputPrompt.trim()) return;
    const enhancements = [
      `Tambahkan ${inputPrompt} dengan desain clean minimalis, tombol responsif, formulir validasi instan, dan integrasi WhatsApp.`,
      `Sempurnakan ${inputPrompt} dengan tata letak rapi, filter pencarian interaktif, dan tampilan mobile yang nyaman.`,
      `Buat ${inputPrompt} dengan struktur data rapi, modal interaktif, dan tombol aksi yang jelas.`
    ];
    const picked = enhancements[Math.floor(Math.random() * enhancements.length)];
    setInputPrompt(picked);
  };

  // Starter Suggestions for Centered Chat View (Professional Lucide Icons, NO Emojis)
  const starterSuggestions = [
    {
      title: "Toko Online & Katalog",
      description: "Katalog produk modern dengan filter kategori dan checkout WhatsApp.",
      icon: ShoppingBag,
      prompt: "Buat website toko online modern dan minimalis lengkap dengan katalog produk, filter kategori, badge diskon, dan tombol beli langsung via WhatsApp."
    },
    {
      title: "Landing Page Bisnis & Jasa",
      description: "Halaman promosi profesional dengan showcase layanan dan formulir kontak.",
      icon: Compass,
      prompt: "Buat landing page profesional untuk perusahaan agensi/jasa dengan hero section menarik, showcase keunggulan, portofolio, dan form kontak responsif."
    },
    {
      title: "Restoran & Kafe Kuliner",
      description: "Daftar menu digital interaktif dengan foto hidangan dan reservasi meja.",
      icon: Utensils,
      prompt: "Buat website profil kafe & restoran modern dengan daftar menu makanan & minuman terorganisir, foto menu, jam buka, dan tombol reservasi meja."
    },
    {
      title: "Dashboard & Aplikasi Web",
      description: "Antarmuka dashboard analitik dengan metrik KPI, grafik, dan tabel data.",
      icon: Layout,
      prompt: "Buat dashboard antarmuka web modern dengan kartu metrik ringkasan, grafik visual pertumbuhan, dan tabel data interaktif dengan fitur pencarian."
    }
  ];



  const fileContents = useMemo(() => {
    return {
      "index.html": code,
      "styles.css": `/* Satusite Dark Blue Tokens */\n:root {\n  --color-primary: #2563eb;\n  --color-darkblue: #1d4ed8;\n  --bg-dark: #09090b;\n  --bg-card: #121215;\n  --border-subtle: #27272a;\n}`,
      "app.js": `// Satusite Application Handlers\nconsole.log("[Satusite App] Initialized");`,
      "database.json": JSON.stringify({
        schema: "Satusite Studio v2.5",
        collections: {
          users: [
            { id: "usr_1", name: "Alex Rivera", role: "Admin", status: "Active" },
            { id: "usr_2", name: "Sarah Chen", role: "Developer", status: "Active" }
          ],
          metrics: {
            mrr: 48250,
            activeSubscriptions: 1420
          }
        }
      }, null, 2)
    };
  }, [code]);

  const previewSrcDoc = useMemo(() => {
    if (!code) return "";
    const scrollbarCss = `
      <style id="satusite-sleek-scrollbar">
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: rgba(9, 9, 11, 0.9); }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
        * { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.15) transparent; }
      </style>
    `;

    const interceptorScript = `
      <script id="satusite-nav-interceptor">
        (function() {
          function renderVisualBlueprint(container) {
            container.innerHTML = '<div class="space-y-6 pt-2">' +
              '<div class="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">' +
                '<div class="flex items-center justify-between">' +
                  '<h3 class="text-sm font-bold text-white flex items-center gap-2"><i class="fas fa-network-wired text-blue-400"></i> Diagram Topologi Arsitektur Sistem</h3>' +
                  '<span class="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[10px] font-mono">Full-Stack Cloud Architecture</span>' +
                '</div>' +
                '<div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1.5"><div class="w-7 h-7 mx-auto rounded-md bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs"><i class="fas fa-desktop"></i></div><h4 class="text-xs font-semibold text-white">Client UI Layer</h4><p class="text-[10px] text-zinc-500">React / Astro / Tailwind</p></div>' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1.5"><div class="w-7 h-7 mx-auto rounded-md bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs"><i class="fas fa-shield-alt"></i></div><h4 class="text-xs font-semibold text-white">API Gateway</h4><p class="text-[10px] text-zinc-500">REST Endpoints & JWT</p></div>' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1.5"><div class="w-7 h-7 mx-auto rounded-md bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs"><i class="fas fa-server"></i></div><h4 class="text-xs font-semibold text-white">Backend Services</h4><p class="text-[10px] text-zinc-500">Serverless Microservices</p></div>' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1.5"><div class="w-7 h-7 mx-auto rounded-md bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs"><i class="fas fa-database"></i></div><h4 class="text-xs font-semibold text-white">Database & Store</h4><p class="text-[10px] text-zinc-500">PostgreSQL / In-Memory</p></div>' +
                '</div>' +
              '</div>' +
              '<div class="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">' +
                '<div class="flex items-center justify-between"><h3 class="text-sm font-bold text-white flex items-center gap-2"><i class="fas fa-database text-purple-400"></i> Skema Relasi Database (ERD)</h3><span class="text-[10px] text-zinc-500">Relational Entities Model</span></div>' +
                '<div class="grid grid-cols-1 md:grid-cols-3 gap-3">' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950/90 border border-zinc-800/80 space-y-2"><div class="flex items-center justify-between border-b border-zinc-800 pb-1.5"><span class="font-mono text-xs font-bold text-blue-400">tbl_users</span><span class="text-[9px] text-zinc-500">Core</span></div><ul class="text-[11px] font-mono space-y-1 text-zinc-400"><li class="flex justify-between"><span>id (PK)</span><span class="text-zinc-600">UUID</span></li><li class="flex justify-between"><span>name</span><span class="text-zinc-600">VARCHAR</span></li><li class="flex justify-between"><span>email</span><span class="text-zinc-600">VARCHAR</span></li><li class="flex justify-between"><span>role</span><span class="text-zinc-600">ENUM</span></li></ul></div>' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950/90 border border-zinc-800/80 space-y-2"><div class="flex items-center justify-between border-b border-zinc-800 pb-1.5"><span class="font-mono text-xs font-bold text-purple-400">tbl_entities</span><span class="text-[9px] text-zinc-500">Data</span></div><ul class="text-[11px] font-mono space-y-1 text-zinc-400"><li class="flex justify-between"><span>id (PK)</span><span class="text-zinc-600">UUID</span></li><li class="flex justify-between"><span>user_id (FK)</span><span class="text-zinc-600">UUID</span></li><li class="flex justify-between"><span>title</span><span class="text-zinc-600">VARCHAR</span></li><li class="flex justify-between"><span>status</span><span class="text-zinc-600">VARCHAR</span></li></ul></div>' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950/90 border border-zinc-800/80 space-y-2"><div class="flex items-center justify-between border-b border-zinc-800 pb-1.5"><span class="font-mono text-xs font-bold text-emerald-400">tbl_audit_logs</span><span class="text-[9px] text-zinc-500">Security</span></div><ul class="text-[11px] font-mono space-y-1 text-zinc-400"><li class="flex justify-between"><span>log_id (PK)</span><span class="text-zinc-600">BIGINT</span></li><li class="flex justify-between"><span>action</span><span class="text-zinc-600">VARCHAR</span></li><li class="flex justify-between"><span>ip_address</span><span class="text-zinc-600">INET</span></li><li class="flex justify-between"><span>created_at</span><span class="text-zinc-600">TIMESTAMP</span></li></ul></div>' +
                '</div>' +
              '</div>' +
              '<div class="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">' +
                '<h3 class="text-sm font-bold text-white flex items-center gap-2"><i class="fas fa-plug text-emerald-400"></i> Spesifikasi REST API Endpoints</h3>' +
                '<div class="space-y-2">' +
                  '<div class="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs"><div class="flex items-center gap-3"><span class="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 font-mono font-bold text-[10px]">GET</span><span class="font-mono text-zinc-200">/api/v1/items</span><span class="text-zinc-500 text-[11px] hidden sm:inline">— Ambil daftar seluruh entitas data</span></div><span class="text-[10px] text-zinc-500 font-mono">200 OK</span></div>' +
                  '<div class="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs"><div class="flex items-center gap-3"><span class="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 font-mono font-bold text-[10px]">POST</span><span class="font-mono text-zinc-200">/api/v1/items</span><span class="text-zinc-500 text-[11px] hidden sm:inline">— Buat entitas baru dengan validasi</span></div><span class="text-[10px] text-zinc-500 font-mono">201 Created</span></div>' +
                  '<div class="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs"><div class="flex items-center gap-3"><span class="px-2 py-0.5 rounded bg-amber-600/20 text-amber-400 font-mono font-bold text-[10px]">PUT</span><span class="font-mono text-zinc-200">/api/v1/items/:id</span><span class="text-zinc-500 text-[11px] hidden sm:inline">— Perbarui entitas data</span></div><span class="text-[10px] text-zinc-500 font-mono">200 OK</span></div>' +
                  '<div class="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs"><div class="flex items-center gap-3"><span class="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-mono font-bold text-[10px]">DELETE</span><span class="font-mono text-zinc-200">/api/v1/items/:id</span><span class="text-zinc-500 text-[11px] hidden sm:inline">— Hapus entitas permanen</span></div><span class="text-[10px] text-zinc-500 font-mono">204 No Content</span></div>' +
                '</div>' +
              '</div>' +
              '<div class="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">' +
                '<h3 class="text-sm font-bold text-white flex items-center gap-2"><i class="fas fa-tasks text-blue-400"></i> Matriks Prioritas Fitur (MVP Scope)</h3>' +
                '<div class="grid grid-cols-1 md:grid-cols-3 gap-3">' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950 border border-blue-500/30 space-y-2"><span class="text-xs font-bold text-blue-400 flex items-center gap-1.5"><i class="fas fa-check-circle"></i> P0 (Core MVP)</span><ul class="text-[11px] text-zinc-400 space-y-1"><li>• Autentikasi Pengguna & Sesi</li><li>• Fungsionalitas CRUD Utama</li><li>• Dashboard Ringkasan Data</li></ul></div>' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950 border border-indigo-500/30 space-y-2"><span class="text-xs font-bold text-indigo-400 flex items-center gap-1.5"><i class="fas fa-clock"></i> P1 (Next Sprint)</span><ul class="text-[11px] text-zinc-400 space-y-1"><li>• Notifikasi & Webhooks</li><li>• Filter Lanjutan & Ekspor CSV</li><li>• Multi-role Permissions</li></ul></div>' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2"><span class="text-xs font-bold text-zinc-400 flex items-center gap-1.5"><i class="fas fa-rocket"></i> P2 (Future)</span><ul class="text-[11px] text-zinc-400 space-y-1"><li>• AI Automated Analytics</li><li>• Payment Gateway Integration</li><li>• Mobile App Sync API</li></ul></div>' +
                '</div>' +
              '</div>' +
            '</div>';
          }

          function renderLiveDemo(container) {
            container.innerHTML = '<div class="space-y-5 pt-2">' +
              '<div class="p-4 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-between"><div><h3 class="text-sm font-bold text-white flex items-center gap-2"><i class="fas fa-play-circle text-blue-400"></i> Interactive Live Prototype Demo</h3><p class="text-[11px] text-zinc-400 mt-0.5">Simulasi antarmuka produk yang dirancang di dalam dokumen PRD ini.</p></div><span class="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-semibold">Live Sandbox</span></div>' +
              '<div class="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">' +
                '<div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">' +
                  '<div class="flex items-center gap-2"><div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold"><i class="fas fa-cube"></i></div><div><h4 class="text-xs font-bold text-white">Dashboard Portal Operasional</h4><p class="text-[10px] text-zinc-500">Status Sistem: Online (99.9%)</p></div></div>' +
                  '<div class="flex items-center gap-2"><input type="text" placeholder="Cari data instan..." class="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none" /><button onclick="alert(\\'Simulasi: Tambah data berhasil dibuka!\\');" class="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"><i class="fas fa-plus"></i> Tambah Data</button></div>' +
                '</div>' +
                '<div class="grid grid-cols-1 md:grid-cols-3 gap-3">' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1"><span class="text-[10px] text-zinc-500">Total Entitas Terdaftar</span><h3 class="text-lg font-bold text-white">1,248</h3><span class="text-[10px] text-emerald-400">+12% minggu ini</span></div>' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1"><span class="text-[10px] text-zinc-500">Aktivitas Selesai</span><h3 class="text-lg font-bold text-white">98.4%</h3><span class="text-[10px] text-blue-400">Efisiensi Tinggi</span></div>' +
                  '<div class="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1"><span class="text-[10px] text-zinc-500">Rata-rata Respon API</span><h3 class="text-lg font-bold text-white">42 ms</h3><span class="text-[10px] text-emerald-400">Optimal</span></div>' +
                '</div>' +
                '<div class="overflow-x-auto rounded-lg border border-zinc-800">' +
                  '<table class="w-full text-left text-xs"><thead class="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]"><tr><th class="p-2.5 font-medium">ID</th><th class="p-2.5 font-medium">Nama / Judul</th><th class="p-2.5 font-medium">Kategori</th><th class="p-2.5 font-medium">Status</th><th class="p-2.5 font-medium text-right">Aksi</th></tr></thead>' +
                  '<tbody class="divide-y divide-zinc-800/60 bg-zinc-900/40 text-zinc-300">' +
                    '<tr class="hover:bg-zinc-800/40 transition-colors"><td class="p-2.5 font-mono text-[10px] text-zinc-500">#REC-001</td><td class="p-2.5 font-medium text-white">Integrasi Portal Akademik</td><td class="p-2.5 text-zinc-400">Core Engine</td><td class="p-2.5"><span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">Aktif</span></td><td class="p-2.5 text-right"><button onclick="alert(\\'Detail #REC-001\\');" class="text-blue-400 hover:text-blue-300 text-[11px]">Detail</button></td></tr>' +
                    '<tr class="hover:bg-zinc-800/40 transition-colors"><td class="p-2.5 font-mono text-[10px] text-zinc-500">#REC-002</td><td class="p-2.5 font-medium text-white">Sistem Manajemen Pengguna</td><td class="p-2.5 text-zinc-400">Auth & Role</td><td class="p-2.5"><span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">Terverifikasi</span></td><td class="p-2.5 text-right"><button onclick="alert(\\'Detail #REC-002\\');" class="text-blue-400 hover:text-blue-300 text-[11px]">Detail</button></td></tr>' +
                  '</tbody></table>' +
                '</div>' +
              '</div>' +
            '</div>';
          }

          function initInteractivity() {
            document.addEventListener('click', function(e) {
              var btn = e.target.closest('button, a');
              if (!btn) return;
              
              var text = (btn.textContent || '').trim().toLowerCase();
              var href = btn.getAttribute('href');

              // TAB SWITCHER: Visual Blueprint
              if (text.includes('visual') || text.includes('blueprint')) {
                var visualContainer = document.querySelector('#view-visual, #tab-visual, #visual-view, [id*="visual"], [id*="blueprint"]');
                var docContainer = document.querySelector('#view-doc, #tab-doc, #doc-view, #document-view, [id*="doc"]');
                var demoContainer = document.querySelector('#view-demo, #tab-demo, #demo-view');

                if (!visualContainer || (visualContainer.innerText || '').trim().length < 50) {
                  if (!visualContainer) {
                    visualContainer = document.createElement('div');
                    visualContainer.id = 'view-visual';
                    visualContainer.className = 'space-y-6 animate-fade-in text-zinc-300';
                    if (docContainer && docContainer.parentElement) {
                      docContainer.parentElement.appendChild(visualContainer);
                    } else {
                      document.body.appendChild(visualContainer);
                    }
                  }
                  renderVisualBlueprint(visualContainer);
                }

                e.preventDefault();
                e.stopPropagation();
                if (docContainer) docContainer.classList.add('hidden');
                if (demoContainer) demoContainer.classList.add('hidden');
                visualContainer.classList.remove('hidden');

                btn.classList.add('bg-blue-600', 'text-white');
                btn.classList.remove('bg-zinc-800', 'bg-zinc-900', 'text-zinc-400', 'text-zinc-300');

                var parent = btn.parentElement;
                if (parent) {
                  var otherBtns = parent.querySelectorAll('button, a');
                  otherBtns.forEach(function(other) {
                    if (other !== btn) {
                      other.classList.remove('bg-blue-600', 'text-white');
                      other.classList.add('text-zinc-400');
                    }
                  });
                }
                return;
              }

              // TAB SWITCHER: Live Web Demo / Prototype Demo
              if (text.includes('demo') || text.includes('prototype') || text.includes('live')) {
                var demoContainer = document.querySelector('#view-demo, #tab-demo, #demo-view, [id*="demo"]');
                var docContainer = document.querySelector('#view-doc, #tab-doc, #doc-view, #document-view, [id*="doc"]');
                var visualContainer = document.querySelector('#view-visual, #tab-visual, #visual-view, [id*="visual"], [id*="blueprint"]');

                if (!demoContainer || (demoContainer.innerText || '').trim().length < 50) {
                  if (!demoContainer) {
                    demoContainer = document.createElement('div');
                    demoContainer.id = 'view-demo';
                    demoContainer.className = 'space-y-6 animate-fade-in text-zinc-300';
                    if (docContainer && docContainer.parentElement) {
                      docContainer.parentElement.appendChild(demoContainer);
                    } else {
                      document.body.appendChild(demoContainer);
                    }
                  }
                  renderLiveDemo(demoContainer);
                }

                e.preventDefault();
                e.stopPropagation();
                if (docContainer) docContainer.classList.add('hidden');
                if (visualContainer) visualContainer.classList.add('hidden');
                demoContainer.classList.remove('hidden');

                btn.classList.add('bg-blue-600', 'text-white');
                btn.classList.remove('bg-zinc-800', 'bg-zinc-900', 'text-zinc-400', 'text-zinc-300');

                var parent = btn.parentElement;
                if (parent) {
                  var otherBtns = parent.querySelectorAll('button, a');
                  otherBtns.forEach(function(other) {
                    if (other !== btn) {
                      other.classList.remove('bg-blue-600', 'text-white');
                      other.classList.add('text-zinc-400');
                    }
                  });
                }
                return;
              }

              // TAB SWITCHER: Dokumen PRD
              if (text.includes('dokumen') || (text.includes('prd') && !text.includes('salin') && !text.includes('unduh'))) {
                var visualContainer = document.querySelector('#view-visual, #tab-visual, #visual-view, [id*="visual"], [id*="blueprint"]');
                var docContainer = document.querySelector('#view-doc, #tab-doc, #doc-view, #document-view, [id*="doc"]');
                var demoContainer = document.querySelector('#view-demo, #tab-demo, #demo-view');

                if (docContainer) {
                  e.preventDefault();
                  e.stopPropagation();
                  if (visualContainer) visualContainer.classList.add('hidden');
                  if (demoContainer) demoContainer.classList.add('hidden');
                  docContainer.classList.remove('hidden');

                  btn.classList.add('bg-blue-600', 'text-white');
                  btn.classList.remove('bg-zinc-800', 'bg-zinc-900', 'text-zinc-400', 'text-zinc-300');

                  var parent = btn.parentElement;
                  if (parent) {
                    var otherBtns = parent.querySelectorAll('button, a');
                    otherBtns.forEach(function(other) {
                      if (other !== btn) {
                        other.classList.remove('bg-blue-600', 'text-white');
                        other.classList.add('text-zinc-400');
                      }
                    });
                  }
                  return;
                }
              }

              // ACTION: Salin Dokumen PRD
              if (text.includes('salin') || text.includes('copy')) {
                e.preventDefault();
                e.stopPropagation();
                var docEl = document.querySelector('#view-doc, #tab-doc, main') || document.body;
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(docEl.innerText || docEl.textContent || '');
                }
                var origText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
                setTimeout(function() { btn.innerHTML = origText; }, 2000);
                return;
              }

              // ACTION: Unduh Dokumen .md
              if (text.includes('unduh') || text.includes('download')) {
                e.preventDefault();
                e.stopPropagation();
                var docEl = document.querySelector('#view-doc, #tab-doc, main') || document.body;
                var blob = new Blob([docEl.innerText || docEl.textContent || ''], { type: 'text/markdown;charset=utf-8;' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'PRD_Blueprint_Document.md';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                return;
              }
              
              // If empty or dummy hash
              if (!href || href === '#' || href === 'javascript:void(0)') {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              
              // In-page smooth scroll anchor (e.g. #ringkasan, #tech-stack, #erd, #api-endpoints)
              if (href.startsWith('#')) {
                e.preventDefault();
                e.stopPropagation();
                try {
                  var targetId = href.slice(1);
                  var targetEl = document.getElementById(targetId) || document.querySelector(href);
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                } catch(err) {}
                return;
              }
              
              // External link (e.g. WhatsApp, external docs)
              if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('wa.me')) {
                e.preventDefault();
                e.stopPropagation();
                window.open(href.startsWith('wa.me') ? 'https://' + href : href, '_blank');
                return;
              }
              
              // Local / relative path: prevent iframe from reloading the parent SATUSITE app
              e.preventDefault();
              e.stopPropagation();
            }, true);
          }

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initInteractivity);
          } else {
            initInteractivity();
          }
        })();
      </script>
    `;

    let html = code;
    if (html.includes("</head>")) {
      html = html.replace("</head>", `${scrollbarCss}</head>`);
    } else {
      html = scrollbarCss + html;
    }

    if (html.includes("</body>")) {
      html = html.replace("</body>", `${interceptorScript}</body>`);
    } else {
      html = html + interceptorScript;
    }

    return html;
  }, [code]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mode-dropdown-container")) {
        setShowModeDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Render Prompt Input Box
  const renderPromptInput = (isCentered: boolean = false) => {
    const dropdownKey = isCentered ? "center" : "side";
    const isDropdownOpen = showModeDropdown === dropdownKey;

    return (
      <div className={`bg-zinc-900/60 rounded-xl focus-within:bg-zinc-900/80 transition-colors ${isCentered ? "border border-zinc-800/80 shadow-lg" : ""}`}>
        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendPrompt();
            }
          }}
          placeholder={
            genMode === "prd"
              ? "Ketik ide atau kebutuhan sistem untuk dibuatkan dokumen PRD & Blueprint arsitektur..."
              : genMode === "fullstack"
              ? "Ketik instruksi aplikasi fullstack (contoh: 'Buat app kasir toko kopi dengan pencarian & ringkasan penjualan')..."
              : "Ketik instruksi desain frontend (contoh: 'Buat landing page agensi modern dengan hero, galeri & form kontak')..."
          }
          rows={isCentered ? 3 : 2}
          disabled={isGenerating}
          className="w-full bg-transparent p-3 text-xs text-white placeholder-zinc-500 focus:outline-none resize-none font-sans"
        />

        <div className="px-2.5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <label
              htmlFor={`ws-file-upload-${dropdownKey}`}
              className="p-1.5 rounded-md hover:bg-zinc-800/60 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              title="Lampirkan File"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <input
                id={`ws-file-upload-${dropdownKey}`}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setInputPrompt((prev) => `${prev ? prev + ' ' : ''}[File: ${f.name}]`);
                }}
              />
            </label>

            {/* Dark Minimalist Mode Dropdown */}
            <div className="relative mode-dropdown-container">
              <button
                type="button"
                onClick={() => setShowModeDropdown(isDropdownOpen ? null : dropdownKey)}
                className={`h-7 px-2 rounded-md bg-zinc-950/80 hover:bg-zinc-800/80 border text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDropdownOpen
                    ? "border-zinc-700 text-white bg-zinc-800"
                    : "border-zinc-800/80 text-zinc-300 hover:text-white"
                }`}
                title="Pilih Mode Pengembangan"
              >
                {genMode === "fullstack" ? (
                  <Database className="w-3 h-3 text-blue-400 shrink-0" />
                ) : genMode === "prd" ? (
                  <FileText className="w-3 h-3 text-zinc-400 shrink-0" />
                ) : (
                  <Layout className="w-3 h-3 text-blue-400 shrink-0" />
                )}
                <span className="capitalize text-[11px]">{genMode === "prd" ? "PRD" : genMode}</span>
                <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-zinc-300" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 p-1.5 bg-[#121215] border border-zinc-800 rounded-xl shadow-[0_10px_38px_rgba(0,0,0,0.85)] z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
                  <div className="px-2 py-1 text-[9px] font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-800/50 mb-1">
                    Pilih Mode Pengembangan
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setGenMode("fullstack");
                      setShowModeDropdown(null);
                    }}
                    className={`w-full p-2 rounded-lg flex items-start gap-2.5 text-left transition-colors cursor-pointer ${
                      genMode === "fullstack"
                        ? "bg-zinc-800/90 text-white"
                        : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-blue-950/70 border border-blue-800/30 text-blue-400 mt-0.5 shrink-0">
                      <Database className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-zinc-100">Fullstack</span>
                      <p className="text-[10px] text-zinc-400 leading-snug mt-0.5">
                        Skema data, operasi CRUD, storage sync & UI lengkap.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGenMode("frontend");
                      setShowModeDropdown(null);
                    }}
                    className={`w-full p-2 rounded-lg flex items-start gap-2.5 text-left transition-colors cursor-pointer mt-1 ${
                      genMode === "frontend"
                        ? "bg-zinc-800/90 text-white"
                        : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-blue-950/70 border border-blue-800/30 text-blue-400 mt-0.5 shrink-0">
                      <Layout className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-zinc-100">Frontend</span>
                      <p className="text-[10px] text-zinc-400 leading-snug mt-0.5">
                        Tampilan antarmuka visual lengkap, estetik & responsif.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGenMode("prd");
                      setShowModeDropdown(null);
                    }}
                    className={`w-full p-2 rounded-lg flex items-start gap-2.5 text-left transition-colors cursor-pointer mt-1 ${
                      genMode === "prd"
                        ? "bg-zinc-800/90 text-white"
                        : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-400 mt-0.5 shrink-0">
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-zinc-100">PRD Blueprint</span>
                      <p className="text-[10px] text-zinc-400 leading-snug mt-0.5">
                        Dokumen spesifikasi & arsitektur sistem komprehensif.
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
              if (SpeechRec) {
                const rec = new SpeechRec();
                rec.lang = 'id-ID';
                rec.onresult = (ev: any) => {
                  const text = ev.results[0][0].transcript;
                  setInputPrompt((prev) => `${prev ? prev + ' ' : ''}${text}`);
                };
                rec.start();
              }
            }}
            className="p-1.5 rounded-md hover:bg-zinc-800/60 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            title="Input Suara"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (isGenerating) {
                if (abortControllerRef.current) {
                  abortControllerRef.current.abort();
                  abortControllerRef.current = null;
                }
                setIsGenerating(false);
                setCurrentThinkingStep("");
              } else {
                handleSendPrompt();
              }
            }}
            disabled={!isGenerating && !inputPrompt.trim()}
            className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all disabled:opacity-20 cursor-pointer border-0 outline-none"
            title={isGenerating ? "Hentikan" : "Kirim"}
          >
            {isGenerating ? (
              <Square className="w-2.5 h-2.5 text-zinc-300 fill-current" />
            ) : (
              <ArrowUp className="w-3 h-3 text-zinc-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="flex flex-col h-screen w-screen bg-[#09090b] text-zinc-100 overflow-hidden select-none font-sans">
      
      {/* TOP NAVIGATION — Clean & Borderless */}
      <header className="h-11 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30">
        
        <div className="flex items-center gap-2.5">
          <a href="/" className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors" title="Kembali ke Beranda">
            <ArrowLeft className="w-3.5 h-3.5" />
          </a>
          <img src="/logo.png" alt="Satusite Logo" className="w-5 h-5 object-contain" />
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => saveProjectState(code, messages, projectName)}
            className="bg-transparent hover:bg-zinc-900/60 focus:bg-zinc-900/60 border border-transparent focus:border-zinc-700/50 rounded-md px-2 py-0.5 text-xs font-semibold text-white tracking-tight focus:outline-none transition-colors max-w-[160px] sm:max-w-[220px] truncate"
          />
        </div>

        {/* Viewport Switcher (Visible when canvas is active) */}
        {hasGenerated && showCanvas && activeTab === "preview" && (
          <div className="hidden md:flex items-center gap-0.5 bg-zinc-900/60 p-0.5 rounded-lg">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${viewport === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-200"}`}
              title="Desktop"
            >
              <Monitor className="w-3 h-3" />
              <span className="hidden lg:inline text-[10px]">Desktop</span>
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${viewport === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-200"}`}
              title="Tablet"
            >
              <Tablet className="w-3 h-3" />
              <span className="hidden lg:inline text-[10px]">Tablet</span>
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${viewport === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-200"}`}
              title="Mobile"
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden lg:inline text-[10px]">Mobile</span>
            </button>
          </div>
        )}

        {/* Action Buttons — Borderless & Clean */}
        <div className="flex items-center gap-1">
          {hasGenerated && (
            <button
              onClick={() => setShowCanvas(!showCanvas)}
              className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors hidden md:flex"
              title={showCanvas ? "Sembunyikan Canvas" : "Buka Canvas"}
            >
              {showCanvas ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            </button>
          )}

          <a
            href="/portal"
            className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center gap-1 text-[11px]"
            title="Buka Portal Klien"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Portal</span>
          </a>

          <button
            onClick={() => {
              loadSavedProjects();
              setShowHistoryModal(true);
            }}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center gap-1 text-[11px]"
            title="Riwayat Chat & Proyek"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Riwayat</span>
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors"
            title="Panduan Pemakaian"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {hasGenerated && (
            <>
              <button
                onClick={() => setShowExportModal(true)}
                className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors"
                title="Unduh File HTML"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowDeployModal(true)}
                className="ml-1 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold transition-colors"
                title="Pratinjau Live & QR Code"
              >
                <Globe className="w-3 h-3 text-zinc-400" />
                <span>Online</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* WORKSPACE BODY */}
      {!hasGenerated ? (
        /* ========================================================================= */
        /* STAGE 1: ONLY CHAT AGENT VISIBLE (BEFORE GENERATING)                      */
        /* ========================================================================= */
        <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto relative">
          
          {/* Top Brand Mark (Elevated slightly higher up) */}
          <div className="w-full pt-1 sm:pt-2 flex justify-center shrink-0">
            <div className="relative group inline-block">
              <div className="absolute -inset-3 bg-blue-600/10 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              <div className="relative flex items-center justify-center gap-2 select-none">
                <span className="font-agus text-xs sm:text-sm font-normal tracking-[0.35em] text-white">
                  satusitE
                </span>
                <span className="text-zinc-500 font-light text-xs">/</span>
                <span className="font-syne font-bold text-xs sm:text-[13px] text-zinc-300 tracking-tight">
                  Studio.
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Area (Centered towards the lower-middle) */}
          <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-5 animate-fade-in-up my-auto pt-6 pb-4">
            
            {/* Clean Heading */}
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Apa yang ingin Anda bangun hari ini?
              </h1>
              <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
                Ketik ide bisnis atau konsep website yang Anda inginkan. AI Agent akan langsung merancang tampilan dan membuka kanvas kerja 65% secara otomatis.
              </p>
            </div>

            {/* Clean Starter Prompt Suggestions (Lucide Vector Icons, NO Emojis) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left pt-1">
              {starterSuggestions.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendPrompt(s.prompt, s.title)}
                    className="p-3.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700 text-left transition-all group flex items-start gap-3 cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-zinc-800/60 text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {s.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Centered Main Prompt Input Bar */}
            <div className="w-full pt-1">
              {renderPromptInput(true)}
            </div>

          </div>

          {/* Bottom subtle anchor spacer to balance layout */}
          <div className="w-full h-2 shrink-0"></div>
        </div>
      ) : (
        /* ========================================================================= */
        /* STAGE 2: 35% CHAT AGENT & 65% CANVAS (SLIDES IN FROM SIDE)               */
        /* ========================================================================= */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

          {/* LEFT PANE: 35% CHAT AGENT */}
          <aside className={`w-full ${showCanvas ? "md:w-[35%]" : "md:w-full max-w-3xl mx-auto"} border-r border-zinc-800/60 bg-zinc-950 flex flex-col shrink-0 overflow-hidden z-20 transition-all duration-500`}>
            
            {/* Agent status — minimal */}
            <div className="px-3 py-2 border-b border-zinc-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[11px] font-semibold text-zinc-300">AI Agent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    loadSavedProjects();
                    setShowHistoryModal(true);
                  }}
                  className="px-2 py-1 rounded-md bg-zinc-900/80 hover:bg-zinc-800 text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 border border-zinc-800/60 transition-colors cursor-pointer"
                  title="Riwayat Percakapan & Sesi"
                >
                  <History className="w-3 h-3 text-zinc-400" />
                  <span>Riwayat</span>
                </button>
                {code && !showCanvas && (
                  <button
                    onClick={() => setShowCanvas(true)}
                    className="px-2.5 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1.5 border border-blue-500/30 transition-all cursor-pointer"
                    title="Buka kembali Canvas Viewer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Buka Canvas</span>
                  </button>
                )}
                <span className="text-[10px] text-zinc-500 font-mono">
                  {showCanvas ? "35% Panel" : "Full Chat"}
                </span>
              </div>
            </div>

            {/* Messages stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} animate-fade-in-up group/msg`}
                >
                  {/* Sender label & timestamp */}
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-zinc-500">
                    <span className="font-medium text-zinc-400">
                      {m.role === "user" ? "Anda" : "AI Agent"}
                    </span>
                    <span className="text-[9px] text-zinc-600">{m.timestamp}</span>
                  </div>

                  {/* Message bubble + copy icon beside it */}
                  <div className={`flex items-start gap-1 max-w-[92%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`flex-1 rounded-xl p-2.5 text-xs leading-relaxed ${
                        m.role === "user"
                          ? "bg-zinc-800/60 text-zinc-100 border border-zinc-700/40"
                          : "bg-zinc-900/60 text-zinc-300 border border-zinc-800/60"
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>

                      {m.steps && m.steps.length > 0 && (
                        <div className="mt-2 pt-1.5 border-t border-zinc-800/40 space-y-0.5">
                          {m.steps.map((s, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                              <CheckCircle2 className="w-2.5 h-2.5 text-blue-400/70 shrink-0" />
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {m.hasCodeUpdate && (
                        <button
                          onClick={() => {
                            setShowCanvas(true);
                            setActiveTab("preview");
                          }}
                          className="mt-2 text-[10px] text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                        >
                          Lihat hasil di Canvas
                        </button>
                      )}
                    </div>

                    {/* Copy button beside the chat bubble */}
                    <button
                      onClick={() => handleCopyMessage(m.id, m.text)}
                      className="shrink-0 p-1.5 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all opacity-0 group-hover/msg:opacity-100 focus:opacity-100 cursor-pointer mt-0.5"
                      title="Salin Pesan"
                    >
                      {copiedMsgId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="bg-zinc-900/50 rounded-lg p-3 space-y-1.5 animate-fade-in-up">
                  <div className="flex items-center gap-2 text-xs text-blue-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="font-medium">
                      {genMode === "prd"
                        ? "Membuat PRD..."
                        : genMode === "fullstack"
                        ? "Membangun aplikasi fullstack..."
                        : "Memproses website..."}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500">{currentThinkingStep}</p>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Prompt input bar */}
            <div className="p-2.5 border-t border-zinc-800/40 bg-zinc-950">
              {renderPromptInput(false)}
            </div>
          </aside>

          {/* RIGHT PANE: 65% CANVAS (SLIDES IN SMOOTHLY FROM SIDE) */}
          {showCanvas && (
            <main className="w-full md:w-[65%] flex flex-col overflow-hidden bg-[#09090b] relative animate-slide-in-right transition-all duration-500">
              
              {/* Tab Header Bar */}
              <div className="h-9 border-b border-zinc-800/40 bg-zinc-950/80 px-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-0.5">
                  {[
                    { key: "preview" as const, icon: Eye, label: "Canvas" },
                    { key: "code" as const, icon: Code2, label: "Code" },
                    { key: "architecture" as const, icon: Workflow, label: "Struktur" },
                    { key: "database" as const, icon: Database, label: "Data" },
                    { key: "logs" as const, icon: TerminalIcon, label: "Terminal" },
                  ].map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                        activeTab === key
                          ? "bg-zinc-800/80 text-white"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/30"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className={key === "preview" || key === "code" ? "" : "hidden sm:inline"}>{label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => {
                      if (iframeRef.current) iframeRef.current.srcdoc = previewSrcDoc;
                    }}
                    className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/40 transition-colors"
                    title="Muat Ulang"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => {
                      const blob = new Blob([code], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      window.open(url, "_blank");
                    }}
                    className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/40 transition-colors"
                    title="Buka di Tab Baru"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="h-3.5 w-px bg-zinc-800/60 mx-1"></div>

                  <button
                    onClick={() => setShowCanvas(false)}
                    className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
                    title="Tutup Canvas Viewer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* TAB 1: CANVAS PREVIEW */}
              {activeTab === "preview" && (
                <div className="flex-1 bg-[#060609] p-2 flex items-center justify-center overflow-auto relative">
                  <div
                    className={`transition-all duration-300 flex items-center justify-center ${
                      viewport === "desktop"
                        ? "w-full h-full"
                        : viewport === "tablet"
                        ? "device-tablet-frame"
                        : "device-mobile-frame"
                    }`}
                  >
                    {viewport === "mobile" && <div className="device-mobile-notch"></div>}
                    
                    <iframe
                      ref={iframeRef}
                      srcDoc={previewSrcDoc}
                      title="Live Preview Canvas"
                      sandbox="allow-scripts allow-modals allow-same-origin allow-popups allow-forms"
                      className="w-full h-full bg-[#09090b] border-0 rounded"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CODE */}
              {activeTab === "code" && (
                <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
                  <div className="h-8 border-b border-zinc-800/40 bg-zinc-900/40 px-3 flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {(["index.html", "styles.css", "app.js", "database.json"] as const).map((fname) => (
                        <button
                          key={fname}
                          onClick={() => setActiveCodeFile(fname)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors ${
                            activeCodeFile === fname
                              ? "bg-zinc-800/80 text-white"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {fname}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(fileContents[activeCodeFile]);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/40 transition-colors"
                      title={copied ? "Tersalin!" : "Salin Kode"}
                    >
                      {copied ? <Check className="w-3 h-3 text-blue-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex-1 p-4 overflow-auto code-editor-font text-xs text-zinc-200 leading-relaxed bg-[#0a0a0f]">
                    {activeCodeFile === "index.html" ? (
                      <textarea
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value);
                          saveProjectState(e.target.value, messages);
                        }}
                        className="w-full h-full bg-transparent text-zinc-300 font-mono focus:outline-none resize-none"
                        spellCheck={false}
                      />
                    ) : (
                      <pre className="text-zinc-400 font-mono whitespace-pre-wrap">
                        <code>{fileContents[activeCodeFile]}</code>
                      </pre>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: ARCHITECTURE */}
              {activeTab === "architecture" && (
                <div className="flex-1 p-6 overflow-y-auto bg-zinc-950 space-y-4 text-xs">
                  <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-blue-400" />
                      <h3 className="font-semibold text-white text-sm">Struktur Komponen & Alur Data</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-300">
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/60 space-y-1.5">
                        <h5 className="font-semibold text-white font-mono text-xs">Hierarki Tampilan</h5>
                        <p className="text-zinc-400 leading-relaxed">Header Navigasi $\to$ Bagian Utama $\to$ Komponen Fitur $\to$ Formulir Interaktif $\to$ Footer</p>
                      </div>
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/60 space-y-1.5">
                        <h5 className="font-semibold text-white font-mono text-xs">Penyimpanan & State</h5>
                        <p className="text-zinc-400 leading-relaxed">Penyimpanan state otomatis ke browser localStorage dengan fitur ekspor kode instan.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DATABASE */}
              {activeTab === "database" && (
                <div className="flex-1 p-6 overflow-y-auto bg-zinc-950 space-y-4 text-xs">
                  <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        <h3 className="font-semibold text-white text-sm">Koleksi Mock Data (JSON)</h3>
                      </div>
                      <span className="text-blue-400 font-mono text-[11px]">Terhubung</span>
                    </div>
                    <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/60 font-mono text-zinc-300">
                      <pre>{fileContents["database.json"]}</pre>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TERMINAL */}
              {activeTab === "logs" && (
                <div className="flex-1 p-4 bg-zinc-950 overflow-y-auto font-mono text-xs text-zinc-300 space-y-1.5">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800/40 text-zinc-500 font-sans text-xs">
                    <span>Terminal Eksekusi AI Agent</span>
                    <button onClick={() => setLogs(["[CONSOLE] Bersih"])} className="hover:text-white transition-colors">Bersihkan</button>
                  </div>
                  <div className="pt-2 space-y-1">
                    {logs.map((log, idx) => (
                      <div key={idx} className="text-zinc-400">
                        <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span> {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </main>
          )}

        </div>
      )}

      {/* QUICK HELP / PANDUAN MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/60">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" /> Panduan Penggunaan Satusite Studio
              </h3>
              <button onClick={() => setShowHelpModal(false)} className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/40 space-y-1">
                <h4 className="font-medium text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> 1. Mengubah Website Lewat Chat
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Cukup ketik instruksi Anda di kolom chat (misal: <em>"Ganti warna tombol jadi biru tua"</em> atau <em>"Tambahkan nomor WhatsApp"</em>), lalu tekan Enter.
                </p>
              </div>

              <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/40 space-y-1">
                <h4 className="font-medium text-white flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-400" /> 2. Menguji Tampilan di HP & Komputer
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Gunakan tombol <strong>Desktop, Tablet, Mobile</strong> di menu atas untuk memeriksa apakah tampilan website sudah rapi di semua jenis layar.
                </p>
              </div>

              <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/40 space-y-1">
                <h4 className="font-medium text-white flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-blue-400" /> 3. Mengunduh & Memasang Website
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Klik tombol <strong>Unduh</strong> di pojok kanan atas untuk menyimpan file <code>.html</code> lengkap yang siap dipakai dan dihosting.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEPLOY MODAL */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/60">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" /> Pratinjau Publik & Uji HP
              </h3>
              <button onClick={() => setShowDeployModal(false)} className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Tautan Pratinjau Langsung:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://${projectName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "app"}.satusite.preview`}
                    className="flex-1 bg-zinc-950 border border-zinc-800/60 rounded-lg px-3 py-1.5 text-blue-400 font-mono text-xs"
                  />
                  <button
                    onClick={() => {
                      const blob = new Blob([code], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      window.open(url, "_blank");
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors"
                  >
                    Buka
                  </button>
                </div>
              </div>

              <div className="p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl flex items-center gap-3">
                <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-black" />
                </div>
                <p className="text-[11px] text-zinc-400">Scan QR Code ini menggunakan kamera HP Anda untuk melihat tampilan website langsung di smartphone.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800/40">
              <button
                onClick={() => setShowDeployModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL WITH CLEAR INSTRUCTIONS */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/60">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-400" /> Unduh Kode Website
              </h3>
              <button onClick={() => setShowExportModal(false)} className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob([code], { type: "text/html" });
                  element.href = URL.createObjectURL(file);
                  element.download = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, "_") || "website"}.html`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                  setShowExportModal(false);
                }}
                className="w-full p-3 rounded-xl border border-zinc-800/60 hover:border-zinc-700 bg-zinc-950/60 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">Unduh Berkas HTML Siap Pakai (.html)</h4>
                  <p className="text-zinc-400 text-[11px] mt-0.5">Satu berkas lengkap berisi HTML, Tailwind CSS, dan JavaScript</p>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                    setShowExportModal(false);
                  }, 1200);
                }}
                className="w-full p-3 rounded-xl border border-zinc-800/60 hover:border-zinc-700 bg-zinc-950/60 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">Salin Seluruh Kode ke Clipboard</h4>
                  <p className="text-zinc-400 text-[11px] mt-0.5">Untuk ditempel langsung di VS Code atau code editor Anda</p>
                </div>
                {copied ? <Check className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4 text-zinc-400 group-hover:text-white" />}
              </button>
            </div>

            {/* Beginner instructions note */}
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/40 text-[11px] text-zinc-400 leading-relaxed">
              <strong className="text-white">Petunjuk Penggunaan:</strong> Anda cukup klik 2x berkas <code>.html</code> yang diunduh untuk langsung membukanya di browser apa saja, atau langsung upload ke hosting cPanel, Vercel, maupun Netlify Anda.
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800/40">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Riwayat Percakapan & Sesi</h3>
                  <p className="text-[11px] text-zinc-400">Pilih sesi chat terdahulu untuk dibuka kembali di workspace</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search & New Chat Action */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Cari pesan atau nama proyek..."
                  className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                onClick={handleNewChat}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Chat Baru</span>
              </button>
            </div>

            {/* Project/Chat Sessions List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs space-y-1.5">
                  <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-zinc-400" />
                  <p className="font-medium text-zinc-400">Belum ada riwayat percakapan.</p>
                  <p className="text-[11px] text-zinc-600">Ketik prompt pertama Anda untuk memulai sesi otomatis.</p>
                </div>
              ) : (
                filteredHistory.map((p: any) => {
                  const isCurrent = p.id === projectId;
                  const lastMsg = p.messages && p.messages.length > 0
                    ? p.messages[p.messages.length - 1].text
                    : "Percakapan kosong";
                  const dateStr = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) : "Baru saja";

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectHistoryProject(p)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-center justify-between gap-3 ${
                        isCurrent
                          ? "bg-blue-600/10 border-blue-500/40"
                          : "bg-zinc-950/60 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/60"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className={`text-xs font-semibold truncate ${isCurrent ? "text-blue-400" : "text-zinc-200 group-hover:text-white"}`}>
                            {p.name || "Percakapan Tanpa Judul"}
                          </h4>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[9px] font-mono">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate max-w-sm">
                          {lastMsg}
                        </p>
                        <div className="flex items-center gap-2.5 mt-1.5 text-[10px] text-zinc-500">
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span>{p.messages?.length || 1} pesan</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleDeleteHistoryProject(e, p.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 opacity-70 group-hover:opacity-100 transition-all"
                          title="Hapus Sesi Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800/40">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
