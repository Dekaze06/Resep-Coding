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
  Bookmark,
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
  ChevronRight,
  FolderGit2,
  FileText,
  History,
  Trash2,
  Plus,
  Search,
  ShieldCheck,
  Rocket,
  SlidersHorizontal,
  Layers,
  Settings2,
  ArrowRight,
  Building2,
  Palette,
  Briefcase,
  GraduationCap,
  Calendar,
  Newspaper,
  Zap,
  Users,
  Bot,
  MicOff,
  FileUp,
  Radio,
  Heart,
  Circle
} from "lucide-react";
import CardScrollReveal from "./ui/CardScrollReveal";
import InteractiveArchitectureTree from "./ui/InteractiveArchitectureTree";

export interface ProjectConfig {
  webType: string;
  customWebType?: string;
  webName: string;
  theme: string;
  customTheme?: string;
  targetAudience: string;
  mainFeatures: string[];
}

export interface SubFeatureItem {
  id: string;
  name: string;
}

export interface FeatureNode {
  id: string;
  title: string;
  badge?: string;
  status?: string;
  icon?: string;
  subFeatures: SubFeatureItem[];
}

export interface ArchitectureStructure {
  rootName: string;
  rootStatus?: string;
  features: FeatureNode[];
}

function generateSmartStructureFromPrompt(promptText: string, projectName: string): ArchitectureStructure {
  const p = (promptText || "").toLowerCase();

  if (p.includes("sekolah") || p.includes("portal sekolah") || p.includes("guru") || p.includes("siswa") || p.includes("akademik")) {
    return {
      rootName: projectName && projectName !== "Proyek Baru" ? projectName : "Portal Sekolah Profesional",
      rootStatus: "Perencanaan",
      features: [
        {
          id: "feat_1",
          title: "Dashboard Utama",
          badge: "Rilis 1",
          status: "Direncanakan",
          icon: "fa-solid fa-grip",
          subFeatures: [
            { id: "sub_1_1", name: "Ringkasan Sekolah" },
            { id: "sub_1_2", name: "Aktivitas Terbaru" },
            { id: "sub_1_3", name: "Akses Cepat" }
          ]
        },
        {
          id: "feat_2",
          title: "Data Sekolah",
          badge: "Rilis 2",
          status: "Direncanakan",
          icon: "fa-solid fa-school",
          subFeatures: [
            { id: "sub_2_1", name: "Kelola Siswa" },
            { id: "sub_2_2", name: "Kelola Guru & Staf" },
            { id: "sub_2_3", name: "Kelola Kelas & Tahun Ajaran" }
          ]
        },
        {
          id: "feat_3",
          title: "Jadwal Pelajaran",
          badge: "Rilis 2",
          status: "Direncanakan",
          icon: "fa-solid fa-calendar-days",
          subFeatures: [
            { id: "sub_3_1", name: "Lihat Jadwal" },
            { id: "sub_3_2", name: "Atur Jadwal" },
            { id: "sub_3_3", name: "Info Perubahan" }
          ]
        },
        {
          id: "feat_4",
          title: "Penilaian & Raport",
          badge: "Rilis 2",
          status: "Direncanakan",
          icon: "fa-solid fa-clipboard-check",
          subFeatures: [
            { id: "sub_4_1", name: "Input Nilai" },
            { id: "sub_4_2", name: "Lihat Nilai" },
            { id: "sub_4_3", name: "Unduh Raport" }
          ]
        },
        {
          id: "feat_5",
          title: "Presensi Kehadiran",
          badge: "Rilis 2",
          status: "Direncanakan",
          icon: "fa-solid fa-user-check",
          subFeatures: [
            { id: "sub_5_1", name: "Catat Kehadiran" },
            { id: "sub_5_2", name: "Rekap Kehadiran" },
            { id: "sub_5_3", name: "Pantau Kehadiran" }
          ]
        },
        {
          id: "feat_6",
          title: "Komunikasi Sekolah",
          badge: "Rilis 2",
          status: "Direncanakan",
          icon: "fa-solid fa-comments",
          subFeatures: [
            { id: "sub_6_1", name: "Kirim Pengumuman" },
            { id: "sub_6_2", name: "Kotak Masuk" },
            { id: "sub_6_3", name: "Pesan Guru & Orang Tua" }
          ]
        },
        {
          id: "feat_7",
          title: "Login & Akun",
          badge: "Rilis 2",
          status: "Direncanakan",
          icon: "fa-solid fa-shield-halved",
          subFeatures: [
            { id: "sub_7_1", name: "Login & Logout" },
            { id: "sub_7_2", name: "Profil & Kata Sandi" },
            { id: "sub_7_3", name: "Hak Akses" }
          ]
        },
        {
          id: "feat_8",
          title: "Tampilan & Tema",
          badge: "Rilis 4",
          status: "Direncanakan",
          icon: "fa-solid fa-palette",
          subFeatures: [
            { id: "sub_8_1", name: "Tema Warna" },
            { id: "sub_8_2", name: "Logo Sekolah" },
            { id: "sub_8_3", name: "Mode Terang/Gelap" }
          ]
        }
      ]
    };
  }

  if (p.includes("toko") || p.includes("kasir") || p.includes("shop") || p.includes("ecommerce") || p.includes("produk") || p.includes("checkout")) {
    return {
      rootName: projectName && projectName !== "Proyek Baru" ? projectName : "Sistem E-Commerce & Kasir",
      rootStatus: "Perencanaan",
      features: [
        {
          id: "feat_1",
          title: "Katalog & Produk",
          badge: "Rilis 1",
          status: "Direncanakan",
          icon: "fa-solid fa-bag-shopping",
          subFeatures: [
            { id: "sub_1_1", name: "Grid Produk & Kategori" },
            { id: "sub_1_2", name: "Pencarian & Filter Harga" },
            { id: "sub_1_3", name: "Detail Produk & Modal" }
          ]
        },
        {
          id: "feat_2",
          title: "Keranjang & Checkout",
          badge: "Rilis 1",
          status: "Direncanakan",
          icon: "fa-solid fa-cart-shopping",
          subFeatures: [
            { id: "sub_2_1", name: "Drawer Keranjang Interaktif" },
            { id: "sub_2_2", name: "Perhitungan Total & Ongkir" },
            { id: "sub_2_3", name: "Integrasi Checkout WhatsApp" }
          ]
        },
        {
          id: "feat_3",
          title: "Riwayat & Transaksi",
          badge: "Rilis 2",
          status: "Direncanakan",
          icon: "fa-solid fa-receipt",
          subFeatures: [
            { id: "sub_3_1", name: "Catatan Penjualan Harian" },
            { id: "sub_3_2", name: "Ekspor Laporan CSV" },
            { id: "sub_3_3", name: "Status Pembayaran" }
          ]
        },
        {
          id: "feat_4",
          title: "Manajemen Inventori",
          badge: "Rilis 2",
          status: "Direncanakan",
          icon: "fa-solid fa-boxes-stacked",
          subFeatures: [
            { id: "sub_4_1", name: "Tambah & Edit Stok" },
            { id: "sub_4_2", name: "Peringatan Stok Rendah" },
            { id: "sub_4_3", name: "Varian Ukuran & Warna" }
          ]
        }
      ]
    };
  }

  // Default clean structure
  return {
    rootName: projectName && projectName !== "Proyek Baru" ? projectName : "Arsitektur Sistem & Aplikasi",
    rootStatus: "Perencanaan",
    features: [
      {
        id: "feat_1",
        title: "Antarmuka & Navigasi",
        badge: "Rilis 1",
        status: "Direncanakan",
        icon: "fa-solid fa-table-columns",
        subFeatures: [
          { id: "sub_1_1", name: "Header & Menu Responsif" },
          { id: "sub_1_2", name: "Hero Section & CTA" },
          { id: "sub_1_3", name: "Footer & Navigasi" }
        ]
      },
      {
        id: "feat_2",
        title: "Fitur & Modul Utama",
        badge: "Rilis 1",
        status: "Direncanakan",
        icon: "fa-solid fa-cubes",
        subFeatures: [
          { id: "sub_2_1", name: "Daftar Data & Kartu Konten" },
          { id: "sub_2_2", name: "Pencarian, Filter & Urutan" },
          { id: "sub_2_3", name: "Modal Detail & Aksi Cepat" }
        ]
      },
      {
        id: "feat_3",
        title: "Formulir & Data Layer",
        badge: "Rilis 2",
        status: "Direncanakan",
        icon: "fa-solid fa-pen-to-square",
        subFeatures: [
          { id: "sub_3_1", name: "Validasi Form Input" },
          { id: "sub_3_2", name: "Penyimpanan LocalStorage" },
          { id: "sub_3_3", name: "Notifikasi Status & Toast" }
        ]
      },
      {
        id: "feat_4",
        title: "Ekspor & Utilitas",
        badge: "Rilis 2",
        status: "Direncanakan",
        icon: "fa-solid fa-file-export",
        subFeatures: [
          { id: "sub_4_1", name: "Unduh File HTML Mandiri" },
          { id: "sub_4_2", name: "Salin Kode ke Clipboard" },
          { id: "sub_4_3", name: "Dukungan Mode Gelap/Terang" }
        ]
      }
    ]
  };
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: string;
  hasCodeUpdate?: boolean;
  agentName?: string;
  steps?: string[];
}

export const WEB_TYPE_OPTIONS = [
  {
    id: "Toko Online & E-Commerce",
    label: "Toko Online & E-Commerce",
    desc: "Katalog produk, keranjang belanja & kasir",
    icon: ShoppingBag,
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Kafe, Restoran & Kuliner",
    label: "Kafe, Restoran & Kuliner",
    desc: "Daftar menu, reservasi meja & pesanan",
    icon: Utensils,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Company Profile & Korporat",
    label: "Company Profile & Korporat",
    desc: "Profil perusahaan, layanan & kontak klien",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Portofolio & Agensi Kreatif",
    label: "Portofolio & Agensi Kreatif",
    desc: "Showcase visual, hasil karya & jasa",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Dashboard Web App / SaaS",
    label: "Dashboard Web App / SaaS",
    desc: "Manajemen data, analitik & CRUD lengkap",
    icon: Database,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Landing Page Produk / Event",
    label: "Landing Page Produk / Event",
    desc: "Halaman konversi tinggi & registrasi",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Portal Berita, Blog & Media",
    label: "Portal Berita, Blog & Media",
    desc: "Artikel berita, kategori & pembaca",
    icon: Newspaper,
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Booking & Reservasi Layanan",
    label: "Booking & Reservasi Layanan",
    desc: "Kalender reservasi, slot waktu & form",
    icon: Calendar,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Edukasi & Kursus Online",
    label: "Edukasi & Kursus Online",
    desc: "Silabus belajar, materi & modul kelas",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Kustom (Tulis Sendiri...)",
    label: "Kustom (Tulis Sendiri...)",
    desc: "Ketik kategori unik sesuai kebutuhan Anda",
    icon: Plus,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80"
  }
];

export const THEME_OPTIONS = [
  {
    id: "Dark Minimalist & Sleek (Monokrom Modern)",
    label: "Dark Minimalist & Sleek",
    desc: "Obsidian & Deep Zinc dengan kontras tajam",
    dotColor: "bg-zinc-100 ring-zinc-400/40",
    palette: ["#09090b", "#18181b", "#27272a", "#71717a", "#fafafa"]
  },
  {
    id: "Clean White & Professional (Terang & Bersih)",
    label: "Clean White & Professional",
    desc: "Nuansa terang, rapi & minimalis elegan",
    dotColor: "bg-zinc-300 ring-zinc-500/40",
    palette: ["#ffffff", "#f4f4f5", "#e4e4e7", "#3b82f6", "#09090b"]
  },
  {
    id: "Luxury Black & Gold (Mewah & Eksklusif)",
    label: "Luxury Black & Gold",
    desc: "Kombinasi hitam pekat & aksen emas mewah",
    dotColor: "bg-amber-400 ring-amber-500/40",
    palette: ["#050505", "#1c1917", "#b45309", "#f59e0b", "#fef3c7"]
  },
  {
    id: "Corporate Modern (Biru & Abu-abu Elegan)",
    label: "Corporate Modern",
    desc: "Biru terpercaya & tata letak profesional",
    dotColor: "bg-blue-500 ring-blue-500/40",
    palette: ["#0f172a", "#1e293b", "#2563eb", "#60a5fa", "#f8fafc"]
  },
  {
    id: "Warm & Cozy (Cokelat Hangat & Estetik)",
    label: "Warm & Cozy",
    desc: "Nuansa kopi, kayu hangat & estetik",
    dotColor: "bg-amber-700 ring-amber-700/40",
    palette: ["#29180f", "#452414", "#9a3412", "#d97706", "#fef3c7"]
  },
  {
    id: "Emerald Modern (Hijau Segar & Modern)",
    label: "Emerald Modern",
    desc: "Hijau botani alami & ramah lingkungan",
    dotColor: "bg-emerald-500 ring-emerald-500/40",
    palette: ["#022c22", "#064e3b", "#059669", "#34d399", "#ecfdf5"]
  },
  {
    id: "Kustom (Tulis Sendiri...)",
    label: "Kustom (Tulis Sendiri...)",
    desc: "Tentukan palet warna kustom Anda",
    dotColor: "bg-purple-400 ring-purple-500/40",
    palette: ["#1e1b4b", "#4338ca", "#8b5cf6", "#c084fc", "#f5f3ff"]
  }
];

export const AUDIENCE_OPTIONS = [
  {
    id: "Pelanggan Umum & Pembeli Retail",
    label: "Pelanggan Umum & Pembeli Retail",
    desc: "Konsumen langsung & pembeli online",
    icon: Users,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Pengusaha, Bisnis & B2B",
    label: "Pengusaha, Bisnis & B2B",
    desc: "Mitra bisnis, distributor & pemilik usaha",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Profesional & Klien Korporat",
    label: "Profesional & Klien Korporat",
    desc: "Eksekutif, instansi & klien formal",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Anak Muda, Mahasiswa & Kreator",
    label: "Anak Muda, Mahasiswa & Kreator",
    desc: "Gen-Z, pegiat konten & kreator digital",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Komunitas & Pecinta Hobi",
    label: "Komunitas & Pecinta Hobi",
    desc: "Anggota komunitas & kelompok minat khusus",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Keluarga, Pasien & Edukasi",
    label: "Keluarga & Edukasi",
    desc: "Orang tua, pelajar & masyarakat umum",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&auto=format&fit=crop&q=80"
  }
];

export const FEATURE_OPTIONS = [
  {
    id: "Panel Admin & CRUD",
    label: "Panel Admin & CRUD",
    desc: "Kelola data, input inventori & dashboard admin",
    icon: Database,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Katalog Produk & Filter",
    label: "Katalog Produk & Filter",
    desc: "Tampilan produk rapi dengan pencarian & filter",
    icon: ShoppingBag,
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Form Pemesanan / WhatsApp Direct",
    label: "Pemesanan via WhatsApp",
    desc: "Kirim pesanan langsung ke chat WhatsApp",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Laporan Kas & Ringkasan Keuangan",
    label: "Laporan Keuangan",
    desc: "Grafik pemasukan, rekap laba & arus kas",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "Galeri Foto Responsif",
    label: "Galeri Showcase Foto",
    desc: "Grid visual portfolio resolusi tinggi",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "FAQ Interaktif & Testimoni",
    label: "FAQ & Testimoni Klien",
    desc: "Accordion tanya jawab dan ulasan pelanggan",
    icon: Users,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80"
  }
];

export default function SatusiteStudioWorkspace() {
  const [genMode, setGenMode] = useState<"fullstack" | "frontend" | "prd">("fullstack");
  const [showModeDropdown, setShowModeDropdown] = useState<"center" | "side" | null>(null);
  const [openDropdown, setOpenDropdown] = useState<"type" | "theme" | "audience" | "modal_type" | "modal_theme" | "modal_audience" | null>(null);
  const [projectId, setProjectId] = useState<string>("proj_default");
  const [projectName, setProjectName] = useState<string>("Proyek Baru");
  const [code, setCode] = useState<string>("");
  const [architectureStructure, setArchitectureStructure] = useState<ArchitectureStructure | null>(null);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [isConfigCompleted, setIsConfigCompleted] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [detailPrompt, setDetailPrompt] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; type: string; content?: string }>>([]);
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false);
  const [isRecordingStep1Mic, setIsRecordingStep1Mic] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfigEditModal, setShowConfigEditModal] = useState<boolean>(false);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    webType: "Toko Online & E-Commerce",
    customWebType: "",
    webName: "",
    theme: "Dark Minimalist & Sleek (Monokrom Modern)",
    customTheme: "",
    targetAudience: "Pelanggan Umum & Pembeli Retail",
    mainFeatures: ["Katalog Produk & Filter", "Panel Admin & CRUD", "Form Pemesanan / WhatsApp Direct"]
  });
  const [showCanvas, setShowCanvas] = useState<boolean>(true);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [activeTab, setActiveTab] = useState<"preview" | "code" | "architecture" | "database" | "logs">("preview");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationTaskIndex, setGenerationTaskIndex] = useState<number>(0);
  const [currentThinkingStep, setCurrentThinkingStep] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historySearch, setHistorySearch] = useState<string>("");
  const [savedProjectsList, setSavedProjectsList] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState<string>("Fitur Ini");

  const isPaidUser = useMemo(() => {
    if (!currentUser) return false;
    const r = (currentUser.role || "").toLowerCase();
    return r === "pro" || r === "client pro" || r === "max" || r === "superadmin";
  }, [currentUser]);

  const [activeCodeFile, setActiveCodeFile] = useState<"index.html" | "styles.css" | "app.js" | "database.json">("index.html");
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Satusite Studio v2.5 initialized",
    "[AI AGENT] Ready for prompt execution (Unlimited Canvas)",
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
    if (p.projectConfig) {
      setProjectConfig(p.projectConfig);
    }
    setIsConfigCompleted(true);
    if (p.code) {
      setCode(p.code);
      setHasGenerated(true);
    }
    if (p.messages && p.messages.length > 0) {
      setMessages(p.messages);
      setHasGenerated(true);
    }
    if (p.structure) {
      setArchitectureStructure(p.structure);
    } else {
      setArchitectureStructure(null);
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
    setArchitectureStructure(null);
    setHasGenerated(false);
    setIsConfigCompleted(false);
    setOnboardingStep(1);
    setDetailPrompt("");
    setUploadedFiles([]);
    setIsRecordingMic(false);
    setProjectConfig({
      webType: "Toko Online & E-Commerce",
      customWebType: "",
      webName: "",
      theme: "Dark Minimalist & Sleek (Monokrom Modern)",
      customTheme: "",
      targetAudience: "Pelanggan Umum & Pembeli Retail",
      mainFeatures: ["Katalog Produk & Filter", "Panel Admin & CRUD", "Form Pemesanan / WhatsApp Direct"]
    });
    setShowCanvas(true);
    setMessages([]);
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

  const toggleMicRecording = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda belum mendukung Web Speech Recognition. Silakan gunakan Google Chrome atau Microsoft Edge.");
      return;
    }

    if (isRecordingMic) {
      setIsRecordingMic(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "id-ID";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecordingMic(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setDetailPrompt(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecordingMic(false);
      };

      recognition.onend = () => {
        setIsRecordingMic(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition failed:", err);
      setIsRecordingMic(false);
    }
  };

  const toggleStep1Mic = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda belum mendukung Web Speech Recognition. Silakan gunakan Google Chrome atau Microsoft Edge.");
      return;
    }

    if (isRecordingStep1Mic) {
      setIsRecordingStep1Mic(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "id-ID";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecordingStep1Mic(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          const cleaned = transcript.trim();
          setProjectConfig(prev => ({ ...prev, webName: cleaned }));
          setProjectName(cleaned);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecordingStep1Mic(false);
      };

      recognition.onend = () => {
        setIsRecordingStep1Mic(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition failed:", err);
      setIsRecordingStep1Mic(false);
    }
  };

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
        // Binary files (PDF, images, docx): include metadata
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
    setUploadedFiles(prev => [...prev, ...newFileList]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await addFilesToUpload(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartBuilding = (chosenMode?: "fullstack" | "frontend" | "prd") => {
    const modeToUse = chosenMode || genMode;
    const finalName = projectConfig.webName.trim() || "Proyek Baru";
    const finalType = projectConfig.webType === "Kustom (Tulis Sendiri...)" ? (projectConfig.customWebType?.trim() || "Web Kustom") : projectConfig.webType;
    const finalTheme = projectConfig.theme === "Kustom (Tulis Sendiri...)" ? (projectConfig.customTheme?.trim() || "Kustom") : projectConfig.theme;

    setProjectName(finalName);
    setGenMode(modeToUse);
    setIsConfigCompleted(true);
    setHasGenerated(true);
    setShowCanvas(true);

    const fileAttachmentsText = uploadedFiles.length > 0 
      ? `\n\n[Lampiran Dokumen/PRD: ${uploadedFiles.map(f => `${f.name} (${f.size})`).join(", ")}]` 
      : "";

    const welcomeMsg: ChatMessage = {
      id: "msg_init_" + Date.now(),
      role: "agent",
      agentName: "AI Agent",
      text: `Konfigurasi awal proyek "${finalName}" (${finalType} • ${finalTheme} • Mode ${modeToUse.toUpperCase()}) berhasil dicatat.${fileAttachmentsText}\n\nMemulai perancangan arsitektur dan antarmuka aplikasi berdasarkan instruksi lengkap Anda...`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages([welcomeMsg]);
    
    // Extract document contents if any
    let attachedDocContext = "";
    if (uploadedFiles.length > 0) {
      const docSnippets = uploadedFiles
        .filter(f => f.content)
        .map(f => `=== LAMPIRAN DOKUMEN / PRD: ${f.name} ===\n${f.content}`)
        .join("\n\n");
      if (docSnippets) {
        attachedDocContext = `\n\n${docSnippets}`;
      }
    }

    // Construct effective comprehensive prompt
    const basePrompt = detailPrompt.trim()
      ? `${detailPrompt.trim()}${fileAttachmentsText}`
      : `Buatkan website profesional "${finalName}" untuk kategori ${finalType} dengan nuansa desain ${finalTheme}, ditujukan bagi ${projectConfig.targetAudience}, lengkap dengan fitur ${projectConfig.mainFeatures.join(", ")}.${fileAttachmentsText}`;

    const effectivePrompt = basePrompt + attachedDocContext;
    setUploadedFiles([]);

    // Automatically trigger AI Generation in the workspace
    handleSendPrompt(effectivePrompt, finalName, undefined, modeToUse);
  };

  useEffect(() => {
    // Auth Check: Set authenticated user or fallback to guest preview user
    try {
      const authUser = localStorage.getItem("satusite_auth_user");
      if (authUser) {
        setCurrentUser(JSON.parse(authUser));
      } else {
        setCurrentUser({
          name: "Tamu (Preview)",
          email: "guest@satusite.com",
          role: "free"
        });
      }
    } catch (e) {
      setCurrentUser({
        name: "Tamu (Preview)",
        email: "guest@satusite.com",
        role: "free"
      });
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const qPrompt = params.get("prompt");
      const qId = params.get("id");
      const qMode = params.get("mode");

      let initialMode: "fullstack" | "frontend" | "prd" = "fullstack";
      if (qMode === "frontend" || qMode === "fullstack" || qMode === "prd") {
        initialMode = qMode;
        setGenMode(qMode);
      }

      // Check if there are attached documents passed via sessionStorage from studio entrypoints
      let pendingDocsContext = "";
      try {
        const pendingRaw = sessionStorage.getItem("satusite_pending_attached_docs");
        if (pendingRaw) {
          const pendingFiles = JSON.parse(pendingRaw);
          if (Array.isArray(pendingFiles) && pendingFiles.length > 0) {
            const snippets = pendingFiles
              .filter((f: any) => f.content)
              .map((f: any) => `=== LAMPIRAN DOKUMEN / PRD: ${f.name} ===\n${f.content}`)
              .join("\n\n");
            if (snippets) {
              pendingDocsContext = `\n\n${snippets}`;
            }
          }
          sessionStorage.removeItem("satusite_pending_attached_docs");
        }
      } catch (e) {
        console.warn("Error parsing pending attached docs:", e);
      }

      const storeRaw = localStorage.getItem("satusite_projects_store") || localStorage.getItem("emergent_projects_store");
      const store = storeRaw ? JSON.parse(storeRaw) : null;

      if (qId && store && store.projects && store.projects[qId]) {
        const p = store.projects[qId];
        setProjectId(qId);
        setProjectName(p.name || "Proyek Baru");
        if (p.projectConfig) {
          setProjectConfig(p.projectConfig);
        }
        setIsConfigCompleted(true);
        if (p.code) {
          setCode(p.code);
          setHasGenerated(true);
        }
        if (p.messages && p.messages.length > 0) setMessages(p.messages);
        if (p.structure) setArchitectureStructure(p.structure);
      } else if (qPrompt) {
        const newId = "proj_" + Date.now();
        setProjectId(newId);
        const name = qPrompt.slice(0, 30) + (qPrompt.length > 30 ? "..." : "");
        setProjectName(name);
        setProjectConfig(prev => ({ ...prev, webName: name }));
        setIsConfigCompleted(true);
        setHasGenerated(true);
        const finalPrompt = qPrompt + pendingDocsContext;
        handleSendPrompt(finalPrompt, name, newId, initialMode);
      }
    } catch (err) {
      console.warn("Error parsing init query params:", err);
    }
  }, []);

  const saveProjectState = useCallback((newCode: string, newMessages: ChatMessage[], newName?: string, newStructure?: ArchitectureStructure | null) => {
    try {
      const storeRaw = localStorage.getItem("satusite_projects_store") || localStorage.getItem("emergent_projects_store");
      const store = storeRaw ? JSON.parse(storeRaw) : { projects: {} };
      const currentName = newName || projectName;

      const structToSave = newStructure !== undefined ? newStructure : architectureStructure;

      store.projects[projectId] = {
        id: projectId,
        name: currentName,
        code: newCode,
        messages: newMessages,
        structure: structToSave,
        projectConfig: projectConfig,
        updatedAt: Date.now(),
        createdAt: store.projects[projectId]?.createdAt || Date.now()
      };
      store.activeId = projectId;
      localStorage.setItem("satusite_projects_store", JSON.stringify(store));
    } catch (e) {
      console.warn("Failed saving project:", e);
    }
  }, [projectId, projectName, architectureStructure, projectConfig]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);



  const handleSendPrompt = async (promptToSend?: string, customName?: string, customId?: string, modeOverride?: "fullstack" | "frontend" | "prd") => {
    const rawText = (promptToSend || inputPrompt).trim();
    if ((!rawText && uploadedFiles.length === 0) || isGenerating) return;

    let text = rawText || "Mohon rancang dan bangun aplikasi sesuai dengan spesifikasi pada dokumen/PRD terlampir.";
    let fileMetaLabels: string[] = [];
    if (uploadedFiles.length > 0) {
      fileMetaLabels = uploadedFiles.map(f => `${f.name} (${f.size})`);
      const docsContext = uploadedFiles
        .filter(f => f.content)
        .map(f => `=== LAMPIRAN DOKUMEN / PRD: ${f.name} ===\n${f.content}`)
        .join("\n\n");
      if (docsContext) {
        text = rawText
          ? `${rawText}\n\n${docsContext}`
          : `Mohon rancang dan bangun aplikasi sesuai dengan spesifikasi pada dokumen/PRD terlampir:\n\n${docsContext}`;
      }
      setUploadedFiles([]);
    }

    setHasGenerated(true);
    setShowCanvas(true);
    setInputPrompt("");
    setIsGenerating(true);
    setGenerationTaskIndex(0);

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

    const userMsgText = fileMetaLabels.length > 0
      ? `${rawText}\n\n[Lampiran: ${fileMetaLabels.join(", ")}]`
      : rawText;

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      role: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    const thinkingTimer1 = setTimeout(() => {
      setGenerationTaskIndex(1);
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
    }, 1100);

    const thinkingTimer2 = setTimeout(() => {
      setGenerationTaskIndex(2);
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
    }, 2300);

    const thinkingTimer3 = setTimeout(() => {
      setGenerationTaskIndex(3);
      setCurrentThinkingStep(
        isPrd
          ? "AI Agent memverifikasi Acceptance Criteria & kelengkapan blueprint..."
          : isFull
          ? "AI Agent memvalidasi operasi CRUD & audit anti-slop visual..."
          : "AI Agent mengaudit interaktivitas, no emoji & format WebP..."
      );
    }, 3800);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/generate-canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: text,
          projectName: customName || projectConfig.webName || projectName,
          projectConfig: {
            webType: projectConfig.webType === "Kustom (Tulis Sendiri...)" ? (projectConfig.customWebType || "Web Kustom") : projectConfig.webType,
            webName: projectConfig.webName || customName || projectName,
            theme: projectConfig.theme === "Kustom (Tulis Sendiri...)" ? (projectConfig.customTheme || "Kustom") : projectConfig.theme,
            targetAudience: projectConfig.targetAudience,
            mainFeatures: projectConfig.mainFeatures
          },
          currentCode: code,
          chatHistory: updatedMessages,
          mode: effectiveMode,
          userEmail: currentUser?.email || ""
        })
      });

      clearTimeout(thinkingTimer1);
      clearTimeout(thinkingTimer2);
      clearTimeout(thinkingTimer3);

      const data = await res.json();

      if (data.requiresUpgrade) {
        setUpgradeFeatureName("Iterasi Lanjutan & Unlimited Prompt");
        setShowUpgradeModal(true);
        setIsGenerating(false);
        return;
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Terjadi kesalahan saat memproses permintaan.");
      }

      if (data.quotaRemaining !== undefined && !isPaidUser && currentUser) {
        const updatedUser = { ...currentUser, quota: data.quotaRemaining };
        setCurrentUser(updatedUser);
        try {
          localStorage.setItem("satusite_auth_user", JSON.stringify(updatedUser));
        } catch (e) {}
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
              "Analisis Kebutuhan Sistem & User Personas selesai",
              "Skema Database ERD & REST API Contracts siap",
              "Dashboard PRD Interaktif & Topology Diagram aktif",
              "Ekspor Markdown & Acceptance Criteria terverifikasi"
            ]
          : isFull
          ? [
              "Analisis Arsitektur Domain & Model Data AppDB siap",
              "Handler CRUD (Create/Read/Update/Delete) & localStorage aktif",
              "Integrasi 4-Panel Switcher (Katalog POS, CRUD, KPI Chart, API Inspector)",
              "Audit Anti-Slop Visual, Tipografi Modern Sans & WebP lolos"
            ]
          : [
              "Analisis Desain Sistem & Kategori Industri selesai",
              "Layout Responsif (Desktop/Tablet/Mobile) & Palet 60-30-10 terpasang",
              "Section Lengkap, Quick-View Modal & WhatsApp Cart aktif",
              "Audit Navigasi Anchor, Tanpa Emoji & Format WebP terverifikasi"
            ]
      };

      const finalMessages = [...updatedMessages, agentMsg];
      setMessages(finalMessages);

      const smartStruct = generateSmartStructureFromPrompt(text, customName || projectName);
      setArchitectureStructure(smartStruct);

      if (data.hasCodeUpdate && data.code) {
        setCode(data.code);
        saveProjectState(data.code, finalMessages, customName, smartStruct);
        setLogs(prev => [
          ...prev,
          `[HOT-RELOAD] index.html updated (${data.code.length} bytes) [Mode: ${effectiveMode.toUpperCase()}]`
        ]);
      } else {
        saveProjectState(code, finalMessages, customName, smartStruct);
      }

      if (isPrd) {
        setActiveTab("architecture");
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
            // Prevent form submission from reloading or navigating parent page
            document.addEventListener('submit', function(e) {
              e.preventDefault();
              e.stopPropagation();
            }, true);

            // Detect if this is a PRD page (has specific PRD tab infrastructure)
            var isPrdPage = !!(document.querySelector('#prd-tab-bar, #view-doc, [data-prd-tabs]'));

            document.addEventListener('click', function(e) {
              var btn = e.target.closest('button, a');
              if (!btn) return;
              
              var text = (btn.textContent || '').trim().toLowerCase();
              var href = btn.getAttribute('href');

              // ========================================================
              // PRIORITY 1: ANCHOR / HREF-BASED NAVIGATION (always first)
              // ========================================================
              
              // If the element has an href, handle navigation before text-matching
              if (href && href.length > 0) {
                // If empty or dummy hash
                if (href === '#' || href === 'javascript:void(0)') {
                  if (btn.tagName && btn.tagName.toLowerCase() === 'a') {
                    e.preventDefault();
                    e.stopPropagation();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                  return;
                }
                
                // If link is root, home, top, hero
                if (href === '/' || href === '/index.html' || href === 'index.html' || href === '#top' || href === '#hero' || href === '/#top' || href === '/#hero' || href === '/#') {
                  e.preventDefault();
                  e.stopPropagation();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }

                // In-page smooth scroll anchor (e.g. #katalog, #fitur, #kontak, #keunggulan, #galeri)
                if (href.startsWith('#') || href.startsWith('/#')) {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    var cleanId = href.replace(/^(\/#|#)/, '');
                    var targetEl = document.getElementById(cleanId) || document.querySelector('[id="' + cleanId + '"]');
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
                
                // External link (e.g. WhatsApp, external docs, tel, mailto)
                if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('wa.me') || href.startsWith('tel:') || href.startsWith('mailto:')) {
                  e.preventDefault();
                  e.stopPropagation();
                  var fullUrl = href.startsWith('wa.me') ? 'https://' + href : href;
                  window.open(fullUrl, '_blank');
                  return;
                }
                
                // Local / relative path: prevent iframe from reloading the parent SATUSITE app
                e.preventDefault();
                e.stopPropagation();
                try {
                  var cleanSlug = href.replace(/^\//, '').replace(/\.html$/, '');
                  var matchEl = document.getElementById(cleanSlug) || document.querySelector('[id="' + cleanSlug + '"]');
                  if (matchEl) {
                    matchEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                } catch(err) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                return;
              }

              // ========================================================
              // PRIORITY 2: PRD TAB SWITCHING (only on PRD pages)
              // ========================================================
              if (!isPrdPage) return;

              // TAB SWITCHER: Visual Blueprint
              if (text.includes('visual') || text.includes('blueprint')) {
                var visualContainer = document.querySelector('#view-visual, #tab-visual');
                var docContainer = document.querySelector('#view-doc, #tab-doc');
                var demoContainer = document.querySelector('#view-demo, #tab-demo');

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
                var demoContainer = document.querySelector('#view-demo, #tab-demo');
                var docContainer = document.querySelector('#view-doc, #tab-doc');
                var visualContainer = document.querySelector('#view-visual, #tab-visual');

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
                var visualContainer = document.querySelector('#view-visual, #tab-visual');
                var docContainer = document.querySelector('#view-doc, #tab-doc');
                var demoContainer = document.querySelector('#view-demo, #tab-demo');

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
      if (!target.closest(".custom-dropdown-container")) {
        setOpenDropdown(null);
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
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleFileDrop}
        className={`bg-zinc-900/60 rounded-xl focus-within:bg-zinc-900/80 transition-colors ${isCentered ? "border border-zinc-800/80 shadow-lg" : ""}`}
      >
        {/* Uploaded Documents / PRD chips */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-3 pt-2.5 pb-1 border-b border-zinc-800/40">
            {uploadedFiles.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 animate-in fade-in"
              >
                <FileText className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="truncate max-w-[130px] font-medium">{f.name}</span>
                <span className="text-zinc-500 text-[9px]">({f.size})</span>
                <button
                  type="button"
                  onClick={() => removeUploadedFile(idx)}
                  className="ml-0.5 text-zinc-500 hover:text-rose-400 cursor-pointer"
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
              handleSendPrompt();
            }
          }}
          placeholder={
            genMode === "prd"
              ? "Ketik ide atau lampirkan/drag dokumen PRD/Spesifikasi (.md, .txt, .json, .pdf)..."
              : genMode === "fullstack"
              ? "Ketik instruksi atau lampirkan/drag PRD/dokumen (contoh: 'Buat app kasir sesuai lampiran PRD')..."
              : "Ketik instruksi atau lampirkan/drag dokumen desain (contoh: 'Buat landing page sesuai PRD')..."
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
              title="Lampirkan Dokumen PRD (.md, .txt, .json, .pdf, .docx, .csv, dll)"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <input
                id={`ws-file-upload-${dropdownKey}`}
                type="file"
                multiple
                accept=".md,.markdown,.txt,.json,.csv,.pdf,.doc,.docx,.html,.yaml,.yml,.sql,image/*"
                className="hidden"
                onChange={handleFileUpload}
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
                <div className="absolute top-full left-0 mt-1.5 w-56 p-1 bg-[#121215] border border-zinc-800 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.85)] z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
                  <div className="px-2 py-0.5 text-[8.5px] font-medium text-zinc-500 uppercase tracking-wider border-b border-zinc-800/50 mb-0.5">
                    Pilih Mode
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setGenMode("fullstack");
                      setShowModeDropdown(null);
                    }}
                    className={`w-full px-2 py-1 rounded-lg flex items-center gap-2 text-left transition-colors cursor-pointer ${
                      genMode === "fullstack"
                        ? "bg-zinc-800/90 text-white"
                        : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                    }`}
                  >
                    <div className="w-5 h-5 rounded bg-blue-950/70 border border-blue-800/30 text-blue-400 flex items-center justify-center shrink-0">
                      <Database className="w-2.5 h-2.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-zinc-100 leading-tight">Fullstack</div>
                      <div className="text-[9px] text-zinc-400 truncate leading-tight">
                        CRUD, database in-memory & UI.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGenMode("frontend");
                      setShowModeDropdown(null);
                    }}
                    className={`w-full px-2 py-1 rounded-lg flex items-center gap-2 text-left transition-colors cursor-pointer mt-0.5 ${
                      genMode === "frontend"
                        ? "bg-zinc-800/90 text-white"
                        : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                    }`}
                  >
                    <div className="w-5 h-5 rounded bg-blue-950/70 border border-blue-800/30 text-blue-400 flex items-center justify-center shrink-0">
                      <Layout className="w-2.5 h-2.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-zinc-100 leading-tight">Frontend</div>
                      <div className="text-[9px] text-zinc-400 truncate leading-tight">
                        Antarmuka visual responsif.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGenMode("prd");
                      setShowModeDropdown(null);
                    }}
                    className={`w-full px-2 py-1 rounded-lg flex items-center gap-2 text-left transition-colors cursor-pointer mt-0.5 ${
                      genMode === "prd"
                        ? "bg-zinc-800/90 text-white"
                        : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                    }`}
                  >
                    <div className="w-5 h-5 rounded bg-zinc-800/80 border border-zinc-700/60 text-zinc-400 flex items-center justify-center shrink-0">
                      <FileText className="w-2.5 h-2.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-zinc-100 leading-tight">PRD Blueprint</div>
                      <div className="text-[9px] text-zinc-400 truncate leading-tight">
                        Spesifikasi & arsitektur sistem.
                      </div>
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
            disabled={!isGenerating && !inputPrompt.trim() && uploadedFiles.length === 0}
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
        
        <div className="flex items-center gap-2">
          <a href="/studio" className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center gap-1 text-[11px]" title="Kembali ke Pilihan Studio">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] text-zinc-400">Studio</span>
          </a>
          <div className="h-3 w-[1px] bg-zinc-800 hidden sm:block"></div>
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

          {isConfigCompleted && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (!isPaidUser) {
                    setUpgradeFeatureName("QA Testing & Verification Suite");
                    setShowUpgradeModal(true);
                  } else {
                    window.location.href = `/testing?id=${projectId}`;
                  }
                }}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center gap-1.5 text-[11px] cursor-pointer"
                title="Uji Kualitas & Testing Suite"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Testing</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isPaidUser) {
                    setUpgradeFeatureName("Sinkronisasi GitHub Repository");
                    setShowUpgradeModal(true);
                  } else {
                    window.location.href = `/github?id=${projectId}`;
                  }
                }}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center gap-1.5 text-[11px] cursor-pointer"
                title="Push ke GitHub Repository"
              >
                <i className="fa-brands fa-github text-sm text-zinc-400"></i>
                <span className="hidden sm:inline">GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isPaidUser) {
                    setUpgradeFeatureName("1-Click Cloud Deployment");
                    setShowUpgradeModal(true);
                  } else {
                    window.location.href = `/deploy?id=${projectId}`;
                  }
                }}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center gap-1.5 text-[11px] cursor-pointer"
                title="Publikasikan ke Vercel/Netlify"
              >
                <Rocket className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Deploy</span>
              </button>

              <button
                onClick={() => {
                  loadSavedProjects();
                  setShowHistoryModal(true);
                }}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center gap-1.5 text-[11px] cursor-pointer"
                title="Riwayat Chat & Proyek"
              >
                <History className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Riwayat</span>
              </button>

              <button
                onClick={() => setShowHelpModal(true)}
                className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
                title="Panduan Pemakaian"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {hasGenerated && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (!isPaidUser) {
                    setUpgradeFeatureName("Unduh Berkas Kode Sumber (.html / .zip)");
                    setShowUpgradeModal(true);
                  } else {
                    setShowExportModal(true);
                  }
                }}
                className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
                title="Unduh File HTML"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isPaidUser) {
                    setUpgradeFeatureName("1-Click Cloud Deployment");
                    setShowUpgradeModal(true);
                  } else {
                    window.location.href = `/deploy?id=${projectId}`;
                  }
                }}
                className="ml-1 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-medium transition-colors border border-zinc-700/80 shadow-sm cursor-pointer"
                title="Deploy ke Cloud"
              >
                <Rocket className="w-3 h-3 text-zinc-400" />
                <span>Deploy</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* WORKSPACE BODY */}
      {!isConfigCompleted ? (
        /* ========================================================================= */
        /* STAGE 1: INITIAL CONFIGURATION WIZARD                                     */
        /* ========================================================================= */
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto relative">
          
          {/* Top Brand Mark */}
          <div className="w-full pt-1 sm:pt-2 flex justify-center shrink-0 mb-3 sm:mb-4">
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


          {/* ========================================================================= */}
          {/* STEP 1: NAMA WEBSITE / BRAND                                              */}
          {/* ========================================================================= */}
          {onboardingStep === 1 && (
            <div key="step-1" className="max-w-2xl w-full relative my-auto space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Minimalist Title & Subtitle OUTSIDE the box */}
              <div className="text-center space-y-1 sm:space-y-1.5 px-2">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-zinc-100 font-sans">
                  Nama Website atau Brand
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Ketikkan nama bisnis atau judul proyek
                </p>
              </div>

              {/* Transparent Minimalist Elegant Input Box with Voice Icon & Next Icon */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-purple-600/10 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="relative flex items-center bg-zinc-950/60 hover:bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600/40 rounded-2xl p-2 sm:p-2.5 transition-all backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <input
                    type="text"
                    autoFocus
                    value={projectConfig.webName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProjectConfig(prev => ({ ...prev, webName: val }));
                      if (val.trim()) setProjectName(val.trim());
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const finalName = projectConfig.webName.trim() || "Proyek Baru";
                        setProjectName(finalName);
                        setOnboardingStep(2);
                      }
                    }}
                    placeholder="Tuliskan nama"
                    className="w-full bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans font-normal"
                  />

                  {/* Action buttons: Voice on left, Next on right */}
                  <div className="flex items-center gap-1.5 shrink-0 pr-0.5">
                    {/* Voice Dictation Button */}
                    <button
                      type="button"
                      onClick={toggleStep1Mic}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isRecordingStep1Mic
                          ? "bg-red-500/20 border border-red-500/60 text-red-400 animate-pulse"
                          : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                      title={isRecordingStep1Mic ? "Mendengarkan suara... Klik untuk berhenti" : "Input Suara"}
                    >
                      {isRecordingStep1Mic ? (
                        <MicOff className="w-4 h-4 text-red-400" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const finalName = projectConfig.webName.trim() || "Proyek Baru";
                        setProjectName(finalName);
                        setOnboardingStep(2);
                      }}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 group"
                      title="Lanjut ke Kategori Web"
                    >
                      <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {isRecordingStep1Mic && (
                  <div className="flex items-center justify-center pt-2 font-sans">
                    <span className="text-red-400 text-xs font-medium flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      Mendengarkan suara...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: KATEGORI / JENIS WEB                                              */}
          {/* ========================================================================= */}
          {onboardingStep === 2 && (
            <div key="step-2" className="max-w-4xl w-full relative my-auto space-y-3 sm:space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Minimalist Title & Subtitle OUTSIDE the box */}
              <div className="text-center space-y-1 sm:space-y-1.5 px-2">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-zinc-100 font-sans">
                  Kategori & Jenis Website
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Pilih model atau jenis website yang paling sesuai dengan kebutuhan proyek Anda
                </p>
              </div>

              {/* Cards Container with 4 columns across and tall container to view 3 rows */}
              <div className="relative mt-2">
                <div className="relative space-y-4">
                  {/* 4 Cards Grid Across, expanded max-h to display 3 rows easily */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5 max-h-[580px] overflow-y-auto pr-1">
                    {WEB_TYPE_OPTIONS.map(opt => {
                      const isSelected = projectConfig.webType === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setProjectConfig(prev => ({ ...prev, webType: opt.id }))}
                          className={`group/card relative block overflow-hidden rounded-xl border text-left transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer ${
                            isSelected
                              ? "border-white bg-zinc-800/90 ring-2 ring-white/20 shadow-md"
                              : "border-zinc-800/90 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/60"
                          }`}
                        >
                          {/* Image container with aspect ratio */}
                          <div className="aspect-[4/3] overflow-hidden bg-zinc-900 relative">
                            <img
                              src={opt.image}
                              alt={opt.label}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover/card:scale-105"
                            />
                            {/* Selected Badge */}
                            {isSelected && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white text-zinc-950 text-[10px] font-bold shadow-md flex items-center gap-1">
                                <Check className="w-3 h-3 text-zinc-950" />
                                <span>Dipilih</span>
                              </div>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-3">
                            <h3 className="font-semibold text-xs text-white leading-tight truncate font-sans">
                              {opt.label}
                            </h3>
                            <p className="mt-1 text-[11px] text-zinc-400 truncate font-sans">
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {projectConfig.webType === "Kustom (Tulis Sendiri...)" && (
                    <input
                      type="text"
                      value={projectConfig.customWebType || ""}
                      onChange={(e) => setProjectConfig(prev => ({ ...prev, customWebType: e.target.value }))}
                      placeholder="Tulis jenis website kustom Anda..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-sans"
                    />
                  )}

                  {/* Navigation Buttons: Icon Only for Back and Next */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(1)}
                      className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                      title="Kembali ke Nama Website"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setOnboardingStep(3)}
                      className="w-10 h-10 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 group"
                      title="Lanjut ke Tema Desain"
                    >
                      <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: TEMA & GAYA DESAIN                                                */}
          {/* ========================================================================= */}
          {onboardingStep === 3 && (
            <div key="step-3" className="max-w-4xl w-full relative my-auto space-y-3 sm:space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Minimalist Title & Subtitle OUTSIDE the box */}
              <div className="text-center space-y-1 sm:space-y-1.5 px-2">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-zinc-100 font-sans">
                  Tema & Gaya Desain
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Tentukan palet warna dan estetika tampilan yang sesuai dengan identitas website
                </p>
              </div>

              {/* Cards Container with 4 columns across and tall container */}
              <div className="relative mt-2">
                <div className="relative space-y-4">
                  {/* 4 Cards Grid Across */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5 max-h-[580px] overflow-y-auto pr-1">
                    {THEME_OPTIONS.map(opt => {
                      const isSelected = projectConfig.theme === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setProjectConfig(prev => ({ ...prev, theme: opt.id }))}
                          className={`group/card relative block overflow-hidden rounded-xl border text-left transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer ${
                            isSelected
                              ? "border-white bg-zinc-800/90 ring-2 ring-white/20 shadow-md"
                              : "border-zinc-800/90 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/60"
                          }`}
                        >
                          {/* Color Palette Display */}
                          <div className="aspect-[4/3] overflow-hidden bg-zinc-950 p-2 sm:p-2.5 flex flex-col justify-between relative group-hover/card:brightness-105 transition-all">
                            {/* Visual Color Palette Stripes */}
                            <div className="h-full w-full rounded-lg overflow-hidden flex flex-col gap-1">
                              {/* Main / Primary Large Swatch */}
                              <div 
                                className="flex-1 w-full rounded-md transition-transform duration-300 group-hover/card:scale-[1.02] border border-white/10" 
                                style={{ backgroundColor: opt.palette?.[0] || '#18181b' }}
                              />
                              {/* Secondary / Accent Palette Row */}
                              <div className="flex gap-1 h-5 sm:h-6">
                                {opt.palette?.slice(1).map((color, idx) => (
                                  <div
                                    key={idx}
                                    className="flex-1 rounded-sm border border-white/5 transition-transform duration-200 group-hover/card:scale-105"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Selected Badge */}
                            {isSelected && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white text-zinc-950 text-[10px] font-bold shadow-md flex items-center gap-1 z-10">
                                <Check className="w-3 h-3 text-zinc-950" />
                                <span>Dipilih</span>
                              </div>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${opt.dotColor} shrink-0`} />
                              <h3 className="font-semibold text-xs text-white leading-tight truncate font-sans">
                                {opt.label}
                              </h3>
                            </div>
                            <p className="mt-1 text-[11px] text-zinc-400 truncate font-sans">
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {projectConfig.theme === "Kustom (Tulis Sendiri...)" && (
                    <input
                      type="text"
                      value={projectConfig.customTheme || ""}
                      onChange={(e) => setProjectConfig(prev => ({ ...prev, customTheme: e.target.value }))}
                      placeholder="Tulis tema / palet warna kustom..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-sans"
                    />
                  )}

                  {/* Navigation Buttons: Icon Only for Back and Next */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(2)}
                      className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                      title="Kembali ke Kategori Website"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setOnboardingStep(4)}
                      className="w-10 h-10 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 group"
                      title="Lanjut ke Target Pengunjung"
                    >
                      <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: TARGET PENGUNJUNG                                                 */}
          {/* ========================================================================= */}
          {onboardingStep === 4 && (
            <div key="step-4" className="max-w-4xl w-full relative my-auto space-y-3 sm:space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Minimalist Title & Subtitle OUTSIDE the box */}
              <div className="text-center space-y-1 sm:space-y-1.5 px-2">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-zinc-100 font-sans">
                  Target Pengunjung & Audiens
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Pilih segmen audiens utama yang ingin dijangkau oleh website ini
                </p>
              </div>

              {/* Cards Container with 4 columns across */}
              <div className="relative mt-2">
                <div className="relative space-y-4">
                  {/* 4 Cards Grid Across */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5 max-h-[580px] overflow-y-auto pr-1">
                    {AUDIENCE_OPTIONS.map(opt => {
                      const isSelected = projectConfig.targetAudience === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setProjectConfig(prev => ({ ...prev, targetAudience: opt.id }))}
                          className={`group/card relative block overflow-hidden rounded-xl border text-left transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer ${
                            isSelected
                              ? "border-white bg-zinc-800/90 ring-2 ring-white/20 shadow-md"
                              : "border-zinc-800/90 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/60"
                          }`}
                        >
                          {/* Image container with aspect ratio */}
                          <div className="aspect-[4/3] overflow-hidden bg-zinc-900 relative">
                            <img
                              src={opt.image}
                              alt={opt.label}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover/card:scale-105"
                            />
                            {/* Selected Badge */}
                            {isSelected && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white text-zinc-950 text-[10px] font-bold shadow-md flex items-center gap-1">
                                <Check className="w-3 h-3 text-zinc-950" />
                                <span>Dipilih</span>
                              </div>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-3">
                            <h3 className="font-semibold text-xs text-white leading-tight truncate font-sans">
                              {opt.label}
                            </h3>
                            <p className="mt-1 text-[11px] text-zinc-400 truncate font-sans">
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons: Icon Only for Back and Next */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(3)}
                      className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                      title="Kembali ke Tema Desain"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setOnboardingStep(5)}
                      className="w-10 h-10 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 group"
                      title="Lanjut ke Fitur Utama"
                    >
                      <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: FITUR UTAMA YANG DIINGINKAN                                       */}
          {/* ========================================================================= */}
          {onboardingStep === 5 && (
            <div key="step-5" className="max-w-4xl w-full relative my-auto space-y-3 sm:space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Minimalist Title & Subtitle OUTSIDE the box */}
              <div className="text-center space-y-1 sm:space-y-1.5 px-2">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-zinc-100 font-sans">
                  Fitur Utama Website
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Pilih satu atau beberapa modul fitur penting yang ingin Anda integrasikan
                </p>
              </div>

              {/* Cards Container with 4 columns across */}
              <div className="relative mt-2">
                <div className="relative space-y-4">
                  {/* 4 Cards Grid Across */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5 max-h-[580px] overflow-y-auto pr-1">
                    {FEATURE_OPTIONS.map(opt => {
                      const isSelected = projectConfig.mainFeatures.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setProjectConfig(prev => ({
                              ...prev,
                              mainFeatures: isSelected
                                ? prev.mainFeatures.filter(f => f !== opt.id)
                                : [...prev.mainFeatures, opt.id]
                            }));
                          }}
                          className={`group/card relative block overflow-hidden rounded-xl border text-left transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer ${
                            isSelected
                              ? "border-white bg-zinc-800/90 ring-2 ring-white/20 shadow-md"
                              : "border-zinc-800/90 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/60"
                          }`}
                        >
                          {/* Image container with aspect ratio */}
                          <div className="aspect-[4/3] overflow-hidden bg-zinc-900 relative">
                            <img
                              src={opt.image}
                              alt={opt.label}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover/card:scale-105"
                            />
                            {/* Selected Badge */}
                            {isSelected && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white text-zinc-950 text-[10px] font-bold shadow-md flex items-center gap-1">
                                <Check className="w-3 h-3 text-zinc-950" />
                                <span>Aktif</span>
                              </div>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-3">
                            <h3 className="font-semibold text-xs text-white leading-tight truncate font-sans">
                              {opt.label}
                            </h3>
                            <p className="mt-1 text-[11px] text-zinc-400 truncate font-sans">
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons: Icon Only for Back and Next */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(4)}
                      className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                      title="Kembali ke Target Pengunjung"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setOnboardingStep(6)}
                      className="w-10 h-10 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 group"
                      title="Lanjut ke Deskripsi Detail"
                    >
                      <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: DESKRIPSI DETAIL SINGKAT (CHAT AGENT + UPLOAD FILE + MICROPHONE)   */}
          {/* ========================================================================= */}
          {onboardingStep === 6 && (
            <div key="step-6" className="max-w-4xl w-full relative my-auto space-y-3 sm:space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Minimalist Title & Subtitle OUTSIDE the box */}
              <div className="text-center space-y-1 sm:space-y-1.5 px-2">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-zinc-100 font-sans">
                  Deskripsi & Instruksi Khusus
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Tuliskan detail kebutuhan, gunakan suara, atau lampirkan file referensi
                </p>
              </div>

              {/* Input box container max-w-2xl centered inside 4xl container */}
              <div className="max-w-2xl mx-auto w-full space-y-3">
                {/* Attached Files List Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-zinc-950/90 border border-zinc-800">
                    {uploadedFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 text-[11px] text-zinc-300 border border-zinc-700">
                        <FileUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate max-w-[150px] font-medium">{f.name}</span>
                        <span className="text-zinc-500 text-[10px]">({f.size})</span>
                        <button
                          type="button"
                          onClick={() => removeUploadedFile(idx)}
                          className="ml-1 text-zinc-400 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept=".md,.markdown,.txt,.json,.csv,.pdf,.doc,.docx,.html,.yaml,.yml,.sql,image/*"
                  className="hidden"
                />

                {/* Minimalist Input Bar with Voice & Next Buttons */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={handleFileDrop}
                  className="relative"
                >
                  <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 hover:border-zinc-700 focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/10 transition-all duration-300 backdrop-blur-xl">
                    <textarea
                      autoFocus
                      rows={3}
                      value={detailPrompt}
                      onChange={(e) => setDetailPrompt(e.target.value)}
                      onPaste={handleFilePaste}
                      placeholder="Tuliskan instruksi, lampirkan dokumen PRD/spesifikasi, atau drag file ke sini..."
                      className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-0 px-2.5 py-1 font-sans resize-none"
                    />

                    {/* Toolbar inside input box */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-all cursor-pointer border border-zinc-800 hover:scale-105 active:scale-95"
                        title="Upload File Referensi"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={toggleMicRecording}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isRecordingMic
                            ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse scale-105"
                            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:scale-105 active:scale-95"
                        }`}
                        title={isRecordingMic ? "Mendengarkan..." : "Input dengan Suara"}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isRecordingMic && (
                    <div className="flex items-center justify-center pt-2 font-sans">
                      <span className="text-red-400 text-xs font-medium flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        Mendengarkan suara...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons: Icon Only for Back and Next */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(5)}
                  className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  title="Kembali ke Fitur Utama"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setOnboardingStep(7)}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 group"
                  title="Lanjut ke Mode Arsitektur"
                >
                  <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 7: FULLSTACK / FRONTEND / PRD (FINAL LAUNCH TO CANVAS)                */}
          {/* ========================================================================= */}
          {onboardingStep === 7 && (
            <div key="step-7" className="max-w-5xl w-full relative my-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Top Connected Step Line: 01 --- 02 --- 03 */}
              <div className="relative max-w-xl mx-auto w-full flex items-center justify-between my-2">
                <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-zinc-800 -translate-y-1/2 z-0" />
                <div className={`relative z-10 w-9 h-9 rounded-full bg-zinc-950 border ${genMode === 'prd' ? 'border-orange-500 text-orange-400 ring-2 ring-orange-500/30' : 'border-zinc-800 text-zinc-500'} text-xs font-mono font-bold flex items-center justify-center shadow-md transition-all`}>
                  01
                </div>
                <div className={`relative z-10 w-9 h-9 rounded-full bg-zinc-950 border ${genMode === 'frontend' ? 'border-blue-500 text-blue-400 ring-2 ring-blue-500/30' : 'border-zinc-800 text-zinc-500'} text-xs font-mono font-bold flex items-center justify-center shadow-md transition-all`}>
                  02
                </div>
                <div className={`relative z-10 w-9 h-9 rounded-full bg-zinc-950 border ${genMode === 'fullstack' ? 'border-purple-500 text-purple-400 ring-2 ring-purple-500/30' : 'border-zinc-800 text-zinc-500'} text-xs font-mono font-bold flex items-center justify-center shadow-md transition-all`}>
                  03
                </div>
              </div>

              {/* Minimalist Title & Subtitle OUTSIDE */}
              <div className="text-center space-y-1 sm:space-y-1.5 px-2">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-zinc-100 font-sans">
                  Pilih Mode Arsitektur Aplikasi
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Tentukan alur kerja dan tingkat kedalaman arsitektur yang akan diproduksi oleh AI Agent
                </p>
              </div>

              {/* 3-Column Grid Cards: 1. PRD (Orange) | 2. Frontend (Blue) | 3. Fullstack (Purple) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                {[
                  {
                    key: "prd" as const,
                    step: "01",
                    title: "Blueprint & PRD",
                    modeTitle: "Dokumen Teknis & Spesifikasi",
                    tierBadge: "PRO • Coba 1x Gratis",
                    badgeStyle: "bg-orange-500/15 text-orange-400 border-orange-500/30",
                    activeCardClass: "bg-orange-950/30 border-orange-500 ring-2 ring-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.15)] scale-[1.01]",
                    activeIconClass: "bg-orange-500/20 border-orange-500/40 text-orange-400",
                    icon: FileText,
                    desc: "Dokumen spesifikasi teknis lengkap, diagram entitas data, user flow persona, dan arsitektur roadmap produk MVP.",
                    bullets: [
                      "Analisis kebutuhan sistem & user stories",
                      "Visualisasi pohon hierarki modul arsitektur",
                      "Dokumen spesifikasi produk siap pakai"
                    ]
                  },
                  {
                    key: "frontend" as const,
                    step: "02",
                    title: "Frontend UI Visual",
                    modeTitle: "Fokus Visual & Antarmuka",
                    tierBadge: "PRO • Coba 1x Gratis",
                    badgeStyle: "bg-blue-500/15 text-blue-400 border-blue-500/30",
                    activeCardClass: "bg-blue-950/30 border-blue-500 ring-2 ring-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.01]",
                    activeIconClass: "bg-blue-500/20 border-blue-500/40 text-blue-400",
                    icon: Layout,
                    desc: "Fokus pada kesempurnaan antarmuka visual (UI/UX), komponen interaktif, animasi section, & responsivitas mobile-first.",
                    bullets: [
                      "Pemilihan palet warna kurasi modern",
                      "Logika interaktif tombol, form & navigasi",
                      "Preview langsung di desktop & mobile"
                    ]
                  },
                  {
                    key: "fullstack" as const,
                    step: "03",
                    title: "Fullstack Web App",
                    modeTitle: "Logika End-to-End & Database",
                    tierBadge: "MAX • Max Plan",
                    badgeStyle: "bg-purple-500/15 text-purple-400 border-purple-500/30",
                    activeCardClass: "bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-[1.01]",
                    activeIconClass: "bg-purple-500/20 border-purple-500/40 text-purple-400",
                    icon: Database,
                    desc: "Kode fullstack lengkap dengan state management, database in-memory, logika CRUD backend, panel admin, & hosting.",
                    bullets: [
                      "Kode fullstack dengan state management",
                      "Penyimpanan data lokal, pencarian & export",
                      "100% file HTML/CSS/JS mandiri tanpa dependensi"
                    ]
                  }
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = genMode === item.key;
                  return (
                    <div
                      key={item.key}
                      onClick={() => setGenMode(item.key)}
                      className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-5 sm:p-6 border text-left transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? item.activeCardClass
                          : "bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50"
                      }`}
                    >
                      <div>
                        {/* Icon Container & Tier Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${isSelected ? item.activeIconClass : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border shadow-sm ${item.badgeStyle}`}>
                            {item.tierBadge}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-sans mb-1">
                          {item.title}
                        </h3>
                        <p className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wider mb-2">
                          {item.modeTitle}
                        </p>

                        {/* Description */}
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
                          {item.desc}
                        </p>

                        {/* Divider */}
                        <div className="border-t border-zinc-800/80 my-3.5" />

                        {/* Bullet Features */}
                        <div className="space-y-2.5">
                          {item.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 font-sans">
                              <span className="w-2 h-2 rounded-full bg-zinc-500 shrink-0 mt-1" />
                              <span className="leading-snug text-zinc-300">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Selected Badge Indicator at bottom of card */}
                      <div className="mt-5 pt-3 border-t border-zinc-800/40 flex items-center justify-between">
                        <span className="text-[11px] font-mono font-semibold text-zinc-500">
                          MODE {item.step}
                        </span>
                        {isSelected && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 border ${item.badgeStyle}`}>
                            <Check className="w-3 h-3" />
                            <span>Aktif</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Buttons: Icon Only Back and Launch Button at bottom */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(6)}
                  className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  title="Kembali ke Deskripsi Detail"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleStartBuilding()}
                  className="group/cta relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-100 text-zinc-950 text-xs sm:text-sm font-bold shadow-md transition-all duration-300 cursor-pointer select-none px-5 py-2.5 h-10 sm:h-11"
                  title="Studio Canvas"
                >
                  <span className="mr-7 text-zinc-950 font-bold transition-opacity duration-500 group-hover/cta:opacity-0">
                    Studio Canvas
                  </span>
                  <span className="absolute right-1 top-1 bottom-1 rounded-lg z-10 grid w-7 place-items-center bg-zinc-950/10 group-hover/cta:bg-zinc-950/20 text-zinc-950 transition-all duration-500 group-hover/cta:w-[calc(100%-0.5rem)] group-active/cta:scale-95">
                    <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom subtle anchor spacer */}
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

            {/* Project Config summary badge */}
            <div className="px-3 py-1.5 border-b border-zinc-800/40 bg-zinc-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-4 h-4 rounded bg-zinc-900 border border-zinc-800 text-blue-400 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-2.5 h-2.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-200 text-[11px] truncate">
                      {projectConfig.webName || projectName}
                    </span>
                    <span className="px-1 py-0.2 rounded bg-zinc-900 text-zinc-400 text-[9px] border border-zinc-800 shrink-0 capitalize">
                      {genMode}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    {projectConfig.webType === "Kustom (Tulis Sendiri...)" ? (projectConfig.customWebType || "Kustom") : projectConfig.webType} • {projectConfig.theme === "Kustom (Tulis Sendiri...)" ? (projectConfig.customTheme || "Kustom") : projectConfig.theme}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigEditModal(true)}
                className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-medium text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 transition-colors cursor-pointer shrink-0 ml-2"
                title="Ubah Konfigurasi Dasar"
              >
                Ubah
              </button>
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
                        <div className="mt-2.5 pt-2 border-t border-zinc-800/60 space-y-1.5 bg-zinc-950/40 -mx-1 p-2.5 rounded-lg border border-zinc-800/40">
                          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-semibold mb-1">
                            <span className="flex items-center gap-1.5 text-zinc-300">
                              <Workflow className="w-3 h-3 text-blue-400" />
                              <span>Detail Task Selesai</span>
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                              4/4 Selesai
                            </span>
                          </div>
                          {m.steps.map((s, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[10px] text-zinc-400">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-tight">{s}</span>
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
                          className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-[10px] text-blue-400 hover:text-blue-300 font-semibold border border-blue-500/30 transition-all cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Lihat Hasil di Canvas</span>
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
                <div className="bg-zinc-900/80 rounded-xl p-3 border border-blue-500/20 space-y-2.5 animate-fade-in-up shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                      <span>
                        {genMode === "prd"
                          ? "Menyusun Blueprint PRD..."
                          : genMode === "fullstack"
                          ? "Membangun Aplikasi Fullstack..."
                          : "Memproses Frontend UI..."}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-mono font-bold uppercase">
                      Task {generationTaskIndex + 1}/4
                    </span>
                  </div>

                  {/* Live Step Progress List */}
                  <div className="space-y-1.5 pt-1 border-t border-zinc-800/60">
                    {(genMode === "prd"
                      ? [
                          "Analisis Kebutuhan Sistem & User Personas",
                          "Penyusunan Skema Relasi Database (ERD)",
                          "Spesifikasi REST API Contracts & Endpoint",
                          "Finalisasi Blueprint PRD & Live Demo"
                        ]
                      : genMode === "fullstack"
                      ? [
                          "Analisis Arsitektur Domain & Model Data AppDB",
                          "Penyusunan State Storage & Operasi CRUD",
                          "Integrasi 4-Panel Switcher & KPI Charts",
                          "Audit Anti-Slop Visual & UI Responsif"
                        ]
                      : [
                          "Analisis Desain Sistem & Kategori Industri",
                          "Penyusunan Layout Responsif & Palet 60-30-10",
                          "Integrasi Quick-View Modal & WhatsApp Cart",
                          "Audit Navigasi Anchor & Validasi Interaksi"
                        ]
                    ).map((taskTitle, tIdx) => {
                      const isDone = tIdx < generationTaskIndex;
                      const isCurrent = tIdx === generationTaskIndex;
                      return (
                        <div
                          key={tIdx}
                          className={`flex items-center gap-2 text-[10px] transition-all ${
                            isDone
                              ? "text-zinc-300"
                              : isCurrent
                              ? "text-blue-400 font-medium"
                              : "text-zinc-600"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          ) : isCurrent ? (
                            <Loader2 className="w-3 h-3 text-blue-400 animate-spin shrink-0" />
                          ) : (
                            <Circle className="w-3 h-3 text-zinc-700 shrink-0" />
                          )}
                          <span className="truncate">{taskTitle}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-zinc-500 font-mono bg-zinc-950/60 px-2 py-1 rounded border border-zinc-800/40 truncate">
                    {currentThinkingStep}
                  </div>
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

              {/* TAB 3: ARCHITECTURE (STRUKTUR) */}
              {activeTab === "architecture" && (
                <div className="flex-1 w-full h-full relative overflow-hidden bg-[#0b0e14]">
                  <InteractiveArchitectureTree
                    initialStructure={architectureStructure}
                    projectName={projectName}
                    promptText={messages[messages.length - 1]?.text || inputPrompt || ""}
                    onStructureChange={(newStruct) => {
                      setArchitectureStructure(newStruct);
                      saveProjectState(code, messages, projectName, newStruct);
                    }}
                    onApplyToPrompt={(summaryText) => {
                      setInputPrompt(summaryText);
                      setActiveTab("preview");
                    }}
                  />
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
                <HelpCircle className="w-4 h-4 text-blue-400" /> Panduan Penggunaan <span className="font-agus font-normal tracking-[0.25em] text-white">satusitE</span> Studio
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

      {/* UPGRADE PAYWALL MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in-up text-center relative font-sans">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-200">
              <Sparkles className="w-6 h-6 text-zinc-100" />
            </div>

            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                Eksklusif Akun Pro & Max
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Tingkatkan Paket Anda
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed px-2">
                Versi <strong>Gratis</strong> memberikan 1x generasi AI penuh tanpa batas. Fitur <strong className="text-zinc-200">{upgradeFeatureName}</strong> memerlukan paket <strong>Pro</strong> atau <strong>Max</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left text-xs space-y-2 text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Unduh kode sumber lengkap (.html, .zip bundle)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>1-Click Deploy ke Vercel & Netlify + Custom Domain</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Sinkronisasi otomatis ke GitHub Repository</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Testing QA Suite audit & performa CWV</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="/pricing"
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Lihat Pilihan Paket & Berlangganan &rarr;</span>
              </a>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2 px-4 rounded-xl text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
              >
                Lanjutkan Eksplorasi di Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CONFIG MODAL */}
      {showConfigEditModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-zinc-800/90 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/60">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <span>Ubah Konfigurasi Proyek</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setOpenDropdown(null);
                  setShowConfigEditModal(false);
                }}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Nama Website / Brand:</span>
                </label>
                <input
                  type="text"
                  value={projectConfig.webName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProjectConfig(prev => ({ ...prev, webName: val }));
                    if (val.trim()) setProjectName(val.trim());
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Modal Dropdown: Jenis Web */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Jenis / Kategori:</span>
                  </label>
                  <div className="relative custom-dropdown-container">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === "modal_type" ? null : "modal_type")}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-4 h-4 rounded bg-zinc-900 text-blue-400 flex items-center justify-center shrink-0">
                          {(() => {
                            const found = WEB_TYPE_OPTIONS.find(o => o.id === projectConfig.webType);
                            const IconComp = found?.icon || ShoppingBag;
                            return <IconComp className="w-2.5 h-2.5" />;
                          })()}
                        </div>
                        <span className="truncate">{projectConfig.webType}</span>
                      </div>
                      <ChevronDown className={`w-3 h-3 text-zinc-400 shrink-0 transition-transform ${openDropdown === "modal_type" ? "rotate-180" : ""}`} />
                    </button>

                    {openDropdown === "modal_type" && (
                      <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-[#121216] border border-zinc-800 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 max-h-52 overflow-y-auto space-y-0.5 custom-dropdown-container">
                        {WEB_TYPE_OPTIONS.map(opt => {
                          const isSelected = projectConfig.webType === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setProjectConfig(prev => ({ ...prev, webType: opt.id }));
                                setOpenDropdown(null);
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                                isSelected ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                              }`}
                            >
                              <span className="truncate">{opt.label}</span>
                              {isSelected && <Check className="w-3 h-3 text-blue-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Dropdown: Tema */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Tema Desain:</span>
                  </label>
                  <div className="relative custom-dropdown-container">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === "modal_theme" ? null : "modal_theme")}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {(() => {
                          const found = THEME_OPTIONS.find(o => o.id === projectConfig.theme);
                          const dotCls = found?.dotColor || "bg-blue-500 ring-blue-500/40";
                          return <span className={`w-2 h-2 rounded-full ${dotCls} shrink-0`} />;
                        })()}
                        <span className="truncate">{projectConfig.theme.split(" (")[0]}</span>
                      </div>
                      <ChevronDown className={`w-3 h-3 text-zinc-400 shrink-0 transition-transform ${openDropdown === "modal_theme" ? "rotate-180" : ""}`} />
                    </button>

                    {openDropdown === "modal_theme" && (
                      <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-[#121216] border border-zinc-800 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 max-h-52 overflow-y-auto space-y-0.5 custom-dropdown-container">
                        {THEME_OPTIONS.map(opt => {
                          const isSelected = projectConfig.theme === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setProjectConfig(prev => ({ ...prev, theme: opt.id }));
                                setOpenDropdown(null);
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                                isSelected ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className={`w-2 h-2 rounded-full ${opt.dotColor} shrink-0`} />
                                <span className="truncate">{opt.label}</span>
                              </div>
                              {isSelected && <Check className="w-3 h-3 text-blue-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Dropdown: Target Pengunjung */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Target Pengunjung:</span>
                </label>
                <div className="relative custom-dropdown-container">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "modal_audience" ? null : "modal_audience")}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-4 h-4 rounded bg-zinc-900 text-blue-400 flex items-center justify-center shrink-0">
                        {(() => {
                          const found = AUDIENCE_OPTIONS.find(o => o.id === projectConfig.targetAudience);
                          const IconComp = found?.icon || Users;
                          return <IconComp className="w-2.5 h-2.5" />;
                        })()}
                      </div>
                      <span className="truncate">{projectConfig.targetAudience}</span>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-zinc-400 shrink-0 transition-transform ${openDropdown === "modal_audience" ? "rotate-180" : ""}`} />
                  </button>

                  {openDropdown === "modal_audience" && (
                    <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-[#121216] border border-zinc-800 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 max-h-52 overflow-y-auto space-y-0.5 custom-dropdown-container">
                      {AUDIENCE_OPTIONS.map(opt => {
                        const isSelected = projectConfig.targetAudience === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setProjectConfig(prev => ({ ...prev, targetAudience: opt.id }));
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                              isSelected ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                            }`}
                          >
                            <span className="truncate">{opt.label}</span>
                            {isSelected && <Check className="w-3 h-3 text-blue-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Fitur Kunci Tags */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Fitur Kunci:</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FEATURE_OPTIONS.map(feat => {
                    const isSelected = projectConfig.mainFeatures.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => {
                          setProjectConfig(prev => ({
                            ...prev,
                            mainFeatures: isSelected
                              ? prev.mainFeatures.filter(f => f !== feat.id)
                              : [...prev.mainFeatures, feat.id]
                          }));
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer border flex items-center gap-1 ${
                          isSelected
                            ? "bg-zinc-800 text-white border-zinc-600 shadow-sm"
                            : "bg-zinc-950 text-zinc-400 border-zinc-800/80 hover:text-zinc-200"
                        }`}
                      >
                        {isSelected ? <Check className="w-2.5 h-2.5 text-blue-400" /> : <Plus className="w-2.5 h-2.5 text-zinc-500" />}
                        <span>{feat.label || feat.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800/60">
              <button
                type="button"
                onClick={() => {
                  setOpenDropdown(null);
                  setShowConfigEditModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
