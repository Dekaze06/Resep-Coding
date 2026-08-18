'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  ChevronRight,
  Workflow,
  Download,
  Copy,
  RefreshCw,
  FolderGit2,
  ArrowRight,
  Sliders
} from 'lucide-react';

export interface SubFeatureItem {
  id: string;
  name: string;
}

export interface FeatureNode {
  id: string;
  title: string;
  badge?: string; // e.g. "Rilis 1", "Rilis 2"
  status?: string; // e.g. "Direncanakan", "Selesai"
  icon?: string;
  subFeatures: SubFeatureItem[];
}

export interface ArchitectureStructure {
  rootName: string;
  rootStatus?: string;
  features: FeatureNode[];
}

interface InteractiveArchitectureTreeProps {
  initialStructure?: ArchitectureStructure | null;
  projectName?: string;
  promptText?: string;
  onStructureChange?: (newStructure: ArchitectureStructure) => void;
  onApplyToPrompt?: (structureText: string) => void;
}

const DEFAULT_SCHOOL_STRUCTURE: ArchitectureStructure = {
  rootName: "Portal Sekolah Profesional",
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

export function InteractiveArchitectureTree({
  initialStructure,
  projectName = "Proyek Aplikasi",
  promptText = "",
  onStructureChange,
  onApplyToPrompt
}: InteractiveArchitectureTreeProps) {
  const [structure, setStructure] = useState<ArchitectureStructure>(() => {
    if (initialStructure && initialStructure.features && initialStructure.features.length > 0) {
      return initialStructure;
    }
    return {
      ...DEFAULT_SCHOOL_STRUCTURE,
      rootName: projectName && projectName !== "Proyek Baru" ? projectName : DEFAULT_SCHOOL_STRUCTURE.rootName
    };
  });

  const [zoom, setZoom] = useState<number>(0.9);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editBadge, setEditBadge] = useState<string>("");
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editSubText, setEditSubText] = useState<string>("");
  const [editingRoot, setEditingRoot] = useState<boolean>(false);
  const [editRootText, setEditRootText] = useState<string>("");
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rootNodeRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const subFeatureRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [svgLines, setSvgLines] = useState<{
    rootToFeatures: { x1: number; y1: number; x2: number; y2: number; id: string }[];
    featureToSubs: { x1: number; y1: number; x2: number; y2: number; id: string }[];
  }>({ rootToFeatures: [], featureToSubs: [] });

  // Update structure if projectName changes
  useEffect(() => {
    if (projectName && projectName !== "Proyek Baru" && structure.rootName === DEFAULT_SCHOOL_STRUCTURE.rootName) {
      setStructure(prev => ({ ...prev, rootName: projectName }));
    }
  }, [projectName]);

  // Recalculate dynamic connector cables
  const updateConnectors = () => {
    if (!containerRef.current || !rootNodeRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const rootRect = rootNodeRef.current.getBoundingClientRect();

    // Coordinates are relative to unscaled tree wrapper
    const rootX = (rootRect.right - containerRect.left) / zoom;
    const rootY = (rootRect.top + rootRect.height / 2 - containerRect.top) / zoom;

    const r2f: { x1: number; y1: number; x2: number; y2: number; id: string }[] = [];
    const f2s: { x1: number; y1: number; x2: number; y2: number; id: string }[] = [];

    structure.features.forEach(feat => {
      const featEl = featureRefs.current[feat.id];
      if (featEl) {
        const featRect = featEl.getBoundingClientRect();
        const featInX = (featRect.left - containerRect.left) / zoom;
        const featInY = (featRect.top + featRect.height / 2 - containerRect.top) / zoom;
        const featOutX = (featRect.right - containerRect.left) / zoom;
        const featOutY = featInY;

        r2f.push({
          x1: rootX,
          y1: rootY,
          x2: featInX,
          y2: featInY,
          id: feat.id
        });

        const subEl = subFeatureRefs.current[feat.id];
        if (subEl) {
          const subRect = subEl.getBoundingClientRect();
          const subInX = (subRect.left - containerRect.left) / zoom;
          const subInY = (subRect.top + subRect.height / 2 - containerRect.top) / zoom;

          f2s.push({
            x1: featOutX,
            y1: featOutY,
            x2: subInX,
            y2: subInY,
            id: feat.id
          });
        }
      }
    });

    setSvgLines({ rootToFeatures: r2f, featureToSubs: f2s });
  };

  useEffect(() => {
    const timer = setTimeout(updateConnectors, 60);
    window.addEventListener('resize', updateConnectors);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateConnectors);
    };
  }, [structure, zoom]);

  // Sync upward when structure changes
  const handleStructureUpdate = (newStructure: ArchitectureStructure) => {
    setStructure(newStructure);
    if (onStructureChange) {
      onStructureChange(newStructure);
    }
  };

  // Node editing handlers
  const handleStartEditNode = (feat: FeatureNode) => {
    setEditingNodeId(feat.id);
    setEditTitle(feat.title);
    setEditBadge(feat.badge || "Rilis 1");
  };

  const handleSaveNode = (featId: string) => {
    const newFeatures = structure.features.map(f => {
      if (f.id === featId) {
        return {
          ...f,
          title: editTitle.trim() || f.title,
          badge: editBadge.trim() || f.badge
        };
      }
      return f;
    });
    const updated = { ...structure, features: newFeatures };
    handleStructureUpdate(updated);
    setEditingNodeId(null);
  };

  const handleDeleteNode = (featId: string) => {
    const newFeatures = structure.features.filter(f => f.id !== featId);
    const updated = { ...structure, features: newFeatures };
    handleStructureUpdate(updated);
  };

  const handleAddFeatureNode = () => {
    const newId = `feat_${Date.now()}`;
    const newFeat: FeatureNode = {
      id: newId,
      title: "Fitur Baru",
      badge: "Rilis 1",
      status: "Direncanakan",
      icon: "fa-solid fa-cube",
      subFeatures: [
        { id: `sub_${newId}_1`, name: "Sub Komponen 1" },
        { id: `sub_${newId}_2`, name: "Sub Komponen 2" }
      ]
    };
    const updated = { ...structure, features: [...structure.features, newFeat] };
    handleStructureUpdate(updated);
    setEditingNodeId(newId);
    setEditTitle("Fitur Baru");
    setEditBadge("Rilis 1");
  };

  // Sub feature editing
  const handleStartEditSub = (subId: string, currentName: string) => {
    setEditingSubId(subId);
    setEditSubText(currentName);
  };

  const handleSaveSub = (featId: string, subId: string) => {
    const newFeatures = structure.features.map(f => {
      if (f.id === featId) {
        return {
          ...f,
          subFeatures: f.subFeatures.map(s => {
            if (s.id === subId) {
              return { ...s, name: editSubText.trim() || s.name };
            }
            return s;
          })
        };
      }
      return f;
    });
    const updated = { ...structure, features: newFeatures };
    handleStructureUpdate(updated);
    setEditingSubId(null);
  };

  const handleAddSubFeature = (featId: string) => {
    const newSubId = `sub_${featId}_${Date.now()}`;
    const newFeatures = structure.features.map(f => {
      if (f.id === featId) {
        return {
          ...f,
          subFeatures: [...f.subFeatures, { id: newSubId, name: "Sub Fitur Baru" }]
        };
      }
      return f;
    });
    const updated = { ...structure, features: newFeatures };
    handleStructureUpdate(updated);
    setEditingSubId(newSubId);
    setEditSubText("Sub Fitur Baru");
  };

  const handleDeleteSubFeature = (featId: string, subId: string) => {
    const newFeatures = structure.features.map(f => {
      if (f.id === featId) {
        return {
          ...f,
          subFeatures: f.subFeatures.filter(s => s.id !== subId)
        };
      }
      return f;
    });
    const updated = { ...structure, features: newFeatures };
    handleStructureUpdate(updated);
  };

  // Save Root
  const handleSaveRoot = () => {
    const updated = { ...structure, rootName: editRootText.trim() || structure.rootName };
    handleStructureUpdate(updated);
    setEditingRoot(false);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(structure, null, 2));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleSendToAI = () => {
    let summary = `Struktur Arsitektur & Fitur Aplikasi "${structure.rootName}":\n`;
    structure.features.forEach((f, idx) => {
      summary += `${idx + 1}. [${f.badge || 'Modul'}] ${f.title} (${f.status || 'Direncanakan'})\n`;
      f.subFeatures.forEach((s) => {
        summary += `   - ${s.name}\n`;
      });
    });
    summary += `\nInstruksi: Bangun dan sesuaikan kode aplikasi sesuai spesifikasi dan struktur komponen di atas.`;

    if (onApplyToPrompt) {
      onApplyToPrompt(summary);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0b0e14] text-zinc-200 overflow-hidden font-sans select-none">
      {/* Top Floating Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: Info & Status */}
        <div className="flex items-center gap-2 pointer-events-auto bg-zinc-950/85 backdrop-blur-md border border-zinc-800/80 px-3 py-1.5 rounded-xl shadow-xl">
          <Workflow className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-semibold text-white tracking-tight">Diagram Struktur & Alur Fitur</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-mono">
            {structure.features.length} Modul
          </span>
        </div>

        {/* Right: Actions (Add Feature, Zoom, Copy, Send to AI) */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-zinc-950/85 backdrop-blur-md border border-zinc-800/80 p-1 rounded-xl shadow-xl">
          <button
            onClick={handleAddFeatureNode}
            className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
            title="Tambah Modul Fitur Baru"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">Tambah Fitur</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 mx-1"></div>

          <button
            onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-mono text-zinc-500 w-9 text-center">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => setZoom(z => Math.min(1.4, z + 0.1))}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoom(0.9)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Ukuran"
          >
            <RefreshCw className="w-3 h-3" />
          </button>

          <div className="h-4 w-px bg-zinc-800 mx-1"></div>

          <button
            onClick={handleCopyJSON}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={copiedNotification ? "Tersalin!" : "Salin JSON Struktur"}
          >
            {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {onApplyToPrompt && (
            <button
              onClick={handleSendToAI}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              title="Perbarui Kode AI Sesuai Struktur Ini"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Sinkron ke AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 w-full h-full overflow-auto relative p-12 flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      >
        {/* Scaled Tree Container */}
        <div
          className="relative flex items-center gap-16 md:gap-24 transition-transform duration-100 ease-out origin-center py-20 min-w-[900px]"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Dynamic SVG Curves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {/* Root to Features */}
            {svgLines.rootToFeatures.map(line => {
              const dx = (line.x2 - line.x1) * 0.55;
              const path = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;
              return (
                <g key={`r2f_${line.id}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx={line.x1} cy={line.y1} r="3" fill="#60a5fa" />
                  <circle cx={line.x2} cy={line.y2} r="3" fill="#93c5fd" />
                </g>
              );
            })}

            {/* Features to SubFeatures */}
            {svgLines.featureToSubs.map(line => {
              const dx = (line.x2 - line.x1) * 0.55;
              const path = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;
              return (
                <g key={`f2s_${line.id}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx={line.x1} cy={line.y1} r="2.5" fill="#93c5fd" />
                  <circle cx={line.x2} cy={line.y2} r="2.5" fill="#60a5fa" />
                </g>
              );
            })}
          </svg>

          {/* COLUMN 1: ROOT NODE */}
          <div className="z-10 flex flex-col items-center">
            <div
              ref={rootNodeRef}
              className="group relative w-60 p-4 rounded-2xl bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 border border-zinc-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3 hover:border-blue-500/80 transition-all duration-200"
            >
              {/* Connector dot on the right */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />

              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                  <FolderGit2 className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  {editingRoot ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editRootText}
                        onChange={(e) => setEditRootText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRoot()}
                        className="w-full bg-zinc-800 border border-blue-500 text-white text-xs px-2 py-0.5 rounded focus:outline-none"
                        autoFocus
                      />
                      <button onClick={handleSaveRoot} className="text-emerald-400 p-0.5"><Check className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingRoot(true);
                        setEditRootText(structure.rootName);
                      }}
                      className="cursor-pointer group/title"
                      title="Klik untuk mengubah nama proyek"
                    >
                      <h3 className="text-xs font-bold text-white tracking-tight truncate group-hover/title:text-blue-400 transition-colors">
                        {structure.rootName}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                        {structure.rootStatus || "Perencanaan"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2 & 3: MAIN FEATURES & SUB FEATURES */}
          <div className="z-10 flex flex-col gap-6">
            {structure.features.map((feat) => {
              const isEditing = editingNodeId === feat.id;

              return (
                <div key={feat.id} className="flex items-center gap-12 md:gap-16">
                  {/* LEVEL 1: MAIN FEATURE CARD */}
                  <div
                    ref={(el) => { featureRefs.current[feat.id] = el; }}
                    className="group relative w-64 p-3.5 rounded-2xl bg-[#131722]/90 border border-zinc-800/80 hover:border-blue-500/60 shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 transition-all duration-200"
                  >
                    {/* Left Connector Dot */}
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 border-2 border-zinc-950 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                    {/* Right Connector Dot */}
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 border-2 border-zinc-950 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />

                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                        {feat.icon ? <i className={`${feat.icon} text-xs`} /> : <Layers className="w-3.5 h-3.5" />}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Nama Fitur..."
                              className="w-full bg-zinc-950 border border-blue-500 text-white text-xs px-2 py-1 rounded focus:outline-none"
                              autoFocus
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editBadge}
                                onChange={(e) => setEditBadge(e.target.value)}
                                placeholder="Badge (Rilis 1)..."
                                className="w-20 bg-zinc-950 border border-zinc-700 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded focus:outline-none"
                              />
                              <button
                                onClick={() => handleSaveNode(feat.id)}
                                className="px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded hover:bg-blue-500 font-bold"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() => setEditingNodeId(null)}
                                className="p-0.5 text-zinc-500 hover:text-white"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <h4
                                onClick={() => handleStartEditNode(feat)}
                                className="text-xs font-bold text-white tracking-tight truncate cursor-pointer hover:text-blue-400 transition-colors"
                                title="Klik untuk edit nama fitur"
                              >
                                {feat.title}
                              </h4>
                              {feat.badge && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 text-[9px] font-semibold tracking-wide shrink-0">
                                  {feat.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                              <span className="text-[10px] text-zinc-400 font-medium">
                                {feat.status || "Direncanakan"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Node Hover Actions */}
                    {!isEditing && (
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button
                          onClick={() => handleStartEditNode(feat)}
                          className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                          title="Edit Modul"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteNode(feat.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                          title="Hapus Modul"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* LEVEL 2: SUB FEATURES CARD */}
                  <div
                    ref={(el) => { subFeatureRefs.current[feat.id] = el; }}
                    className="relative w-64 p-3 rounded-2xl bg-[#10141f]/90 border border-zinc-800/80 shadow-[0_6px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between"
                  >
                    {/* Left Connector Dot */}
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-zinc-950 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />

                    {/* Sub Feature Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/50 mb-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
                        <Layers className="w-3 h-3 text-zinc-500" />
                        <span>SUB FITUR</span>
                      </div>
                      <button
                        onClick={() => handleAddSubFeature(feat.id)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5"
                        title="Tambah Sub Fitur"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Tambah</span>
                      </button>
                    </div>

                    {/* Sub Feature Items List */}
                    <div className="space-y-1.5">
                      {feat.subFeatures.map((sub) => {
                        const isEditingSub = editingSubId === sub.id;

                        if (isEditingSub) {
                          return (
                            <div key={sub.id} className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editSubText}
                                onChange={(e) => setEditSubText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveSub(feat.id, sub.id)}
                                className="w-full bg-zinc-950 border border-blue-500 text-white text-[11px] px-2 py-0.5 rounded focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveSub(feat.id, sub.id)}
                                className="text-emerald-400 p-0.5"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEditingSubId(null)}
                                className="text-zinc-500 hover:text-white p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={sub.id}
                            className="group/sub flex items-center justify-between p-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/50 hover:border-zinc-700/80 transition-colors"
                          >
                            <div
                              onClick={() => handleStartEditSub(sub.id, sub.name)}
                              className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                              title="Klik untuk mengubah teks sub fitur"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover/sub:bg-blue-400 shrink-0 transition-colors" />
                              <span className="text-[11px] font-medium text-zinc-300 group-hover/sub:text-white truncate transition-colors">
                                {sub.name}
                              </span>
                            </div>

                            <div className="opacity-0 group-hover/sub:opacity-100 flex items-center gap-1 transition-opacity">
                              <button
                                onClick={() => handleStartEditSub(sub.id, sub.name)}
                                className="p-0.5 text-zinc-500 hover:text-white"
                                title="Edit Teks"
                              >
                                <Edit2 className="w-2.5 h-2.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubFeature(feat.id, sub.id)}
                                className="p-0.5 text-zinc-500 hover:text-red-400"
                                title="Hapus Sub Fitur"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Sub Feature Footer */}
                    <div className="pt-2 text-right">
                      <span className="text-[9px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                        Lihat semua ({feat.subFeatures.length}) &gt;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveArchitectureTree;
