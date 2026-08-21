'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Layers,
  Workflow,
  Copy,
  RotateCcw,
  GitBranch
} from 'lucide-react';

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

  useEffect(() => {
    if (projectName && projectName !== "Proyek Baru" && structure.rootName === DEFAULT_SCHOOL_STRUCTURE.rootName) {
      setStructure(prev => ({ ...prev, rootName: projectName }));
    }
  }, [projectName]);

  const updateConnectors = () => {
    if (!containerRef.current || !rootNodeRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const rootRect = rootNodeRef.current.getBoundingClientRect();

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

        r2f.push({ x1: rootX, y1: rootY, x2: featInX, y2: featInY, id: feat.id });

        const subEl = subFeatureRefs.current[feat.id];
        if (subEl) {
          const subRect = subEl.getBoundingClientRect();
          const subInX = (subRect.left - containerRect.left) / zoom;
          const subInY = (subRect.top + subRect.height / 2 - containerRect.top) / zoom;
          f2s.push({ x1: featOutX, y1: featOutY, x2: subInX, y2: subInY, id: feat.id });
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

  const handleStructureUpdate = (newStructure: ArchitectureStructure) => {
    setStructure(newStructure);
    if (onStructureChange) onStructureChange(newStructure);
  };

  const handleStartEditNode = (feat: FeatureNode) => {
    setEditingNodeId(feat.id);
    setEditTitle(feat.title);
    setEditBadge(feat.badge || "Rilis 1");
  };

  const handleSaveNode = (featId: string) => {
    const newFeatures = structure.features.map(f => {
      if (f.id === featId) return { ...f, title: editTitle.trim() || f.title, badge: editBadge.trim() || f.badge };
      return f;
    });
    handleStructureUpdate({ ...structure, features: newFeatures });
    setEditingNodeId(null);
  };

  const handleDeleteNode = (featId: string) => {
    handleStructureUpdate({ ...structure, features: structure.features.filter(f => f.id !== featId) });
  };

  const handleAddFeatureNode = () => {
    const newId = `feat_${Date.now()}`;
    const newFeat: FeatureNode = {
      id: newId, title: "Fitur Baru", badge: "Rilis 1", status: "Direncanakan",
      subFeatures: [{ id: `sub_${newId}_1`, name: "Sub Komponen 1" }, { id: `sub_${newId}_2`, name: "Sub Komponen 2" }]
    };
    handleStructureUpdate({ ...structure, features: [...structure.features, newFeat] });
    setEditingNodeId(newId);
    setEditTitle("Fitur Baru");
    setEditBadge("Rilis 1");
  };

  const handleStartEditSub = (subId: string, currentName: string) => {
    setEditingSubId(subId);
    setEditSubText(currentName);
  };

  const handleSaveSub = (featId: string, subId: string) => {
    const newFeatures = structure.features.map(f => {
      if (f.id === featId) {
        return { ...f, subFeatures: f.subFeatures.map(s => s.id === subId ? { ...s, name: editSubText.trim() || s.name } : s) };
      }
      return f;
    });
    handleStructureUpdate({ ...structure, features: newFeatures });
    setEditingSubId(null);
  };

  const handleAddSubFeature = (featId: string) => {
    const newSubId = `sub_${featId}_${Date.now()}`;
    const newFeatures = structure.features.map(f => {
      if (f.id === featId) return { ...f, subFeatures: [...f.subFeatures, { id: newSubId, name: "Sub Fitur Baru" }] };
      return f;
    });
    handleStructureUpdate({ ...structure, features: newFeatures });
    setEditingSubId(newSubId);
    setEditSubText("Sub Fitur Baru");
  };

  const handleDeleteSubFeature = (featId: string, subId: string) => {
    const newFeatures = structure.features.map(f => {
      if (f.id === featId) return { ...f, subFeatures: f.subFeatures.filter(s => s.id !== subId) };
      return f;
    });
    handleStructureUpdate({ ...structure, features: newFeatures });
  };

  const handleSaveRoot = () => {
    handleStructureUpdate({ ...structure, rootName: editRootText.trim() || structure.rootName });
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
      f.subFeatures.forEach((s) => { summary += `   - ${s.name}\n`; });
    });
    summary += `\nInstruksi: Bangun dan sesuaikan kode aplikasi sesuai spesifikasi dan struktur komponen di atas.`;
    if (onApplyToPrompt) onApplyToPrompt(summary);
  };

  // Badge color mapping based on release phase
  const getBadgeStyle = (badge?: string) => {
    if (!badge) return "bg-zinc-800/60 text-zinc-500 border-zinc-700/50";
    if (badge.includes("1")) return "bg-emerald-500/8 text-emerald-400/90 border-emerald-500/20";
    if (badge.includes("2")) return "bg-blue-500/8 text-blue-400/90 border-blue-500/20";
    if (badge.includes("3")) return "bg-amber-500/8 text-amber-400/90 border-amber-500/20";
    if (badge.includes("4")) return "bg-purple-500/8 text-purple-400/90 border-purple-500/20";
    return "bg-zinc-800/60 text-zinc-400 border-zinc-700/50";
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#08090d] text-zinc-200 overflow-hidden select-none" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      {/* ── Floating Toolbar ── */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: Title & Count */}
        <div className="flex items-center gap-2.5 pointer-events-auto bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/60 px-3.5 py-2 rounded-xl">
          <Workflow className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-[11px] font-medium text-zinc-300 tracking-tight">Diagram Struktur & Alur Fitur</span>
          <span className="px-1.5 py-0.5 rounded-md bg-zinc-800/80 text-zinc-500 text-[10px] font-mono tabular-nums border border-zinc-700/40">
            {structure.features.length}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-0.5 pointer-events-auto bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/60 p-1 rounded-xl">
          <button
            onClick={handleAddFeatureNode}
            className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Tambah Modul Fitur Baru"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">Tambah Fitur</span>
          </button>

          <div className="h-4 w-px bg-zinc-800/60 mx-0.5"></div>

          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 rounded-lg hover:bg-zinc-800/80 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-zinc-600 w-8 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(1.4, z + 0.1))} className="p-1.5 rounded-lg hover:bg-zinc-800/80 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(0.9)} className="p-1.5 rounded-lg hover:bg-zinc-800/80 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer" title="Reset Zoom">
            <RotateCcw className="w-3 h-3" />
          </button>

          <div className="h-4 w-px bg-zinc-800/60 mx-0.5"></div>

          <button onClick={handleCopyJSON} className="p-1.5 rounded-lg hover:bg-zinc-800/80 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer" title={copiedNotification ? "Tersalin!" : "Salin JSON Struktur"}>
            {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {onApplyToPrompt && (
            <button
              onClick={handleSendToAI}
              className="ml-0.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-zinc-700/50 text-zinc-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="Perbarui Kode AI Sesuai Struktur Ini"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Sinkron ke AI</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Canvas ── */}
      <div
        ref={containerRef}
        className="flex-1 w-full h-full overflow-auto relative p-12 flex items-center justify-center"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      >
        <div
          className="relative flex items-center gap-16 md:gap-24 transition-transform duration-150 ease-out origin-center py-20 min-w-[900px]"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* ── SVG Connectors ── */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <defs>
              <linearGradient id="connectorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(161,161,170,0.25)" />
                <stop offset="100%" stopColor="rgba(161,161,170,0.08)" />
              </linearGradient>
            </defs>

            {svgLines.rootToFeatures.map(line => {
              const dx = (line.x2 - line.x1) * 0.5;
              const path = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;
              return (
                <g key={`r2f_${line.id}`}>
                  <path d={path} fill="none" stroke="url(#connectorGrad)" strokeWidth="1" strokeLinecap="round" />
                  <circle cx={line.x1} cy={line.y1} r="2" fill="#52525b" />
                  <circle cx={line.x2} cy={line.y2} r="2" fill="#3f3f46" />
                </g>
              );
            })}

            {svgLines.featureToSubs.map(line => {
              const dx = (line.x2 - line.x1) * 0.5;
              const path = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;
              return (
                <g key={`f2s_${line.id}`}>
                  <path d={path} fill="none" stroke="rgba(161,161,170,0.12)" strokeWidth="1" strokeLinecap="round" />
                  <circle cx={line.x1} cy={line.y1} r="1.5" fill="#3f3f46" />
                  <circle cx={line.x2} cy={line.y2} r="1.5" fill="#27272a" />
                </g>
              );
            })}
          </svg>

          {/* ── COLUMN 1: ROOT NODE ── */}
          <div className="z-10 flex flex-col items-center">
            <div
              ref={rootNodeRef}
              className="group relative w-56 p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/70 hover:border-zinc-700/90 transition-all duration-200"
              style={{ boxShadow: '0 0 0 1px rgba(39,39,42,0.3), 0 8px 32px rgba(0,0,0,0.5)' }}
            >
              {/* Right connector */}
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-700 border border-zinc-600" />

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center shrink-0">
                  <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
                </div>

                <div className="min-w-0 flex-1">
                  {editingRoot ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editRootText}
                        onChange={(e) => setEditRootText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRoot()}
                        className="w-full bg-zinc-900 border border-zinc-700 text-white text-[11px] px-2 py-1 rounded-lg focus:outline-none focus:border-zinc-600"
                        autoFocus
                      />
                      <button onClick={handleSaveRoot} className="text-emerald-400 p-0.5 hover:bg-zinc-800 rounded cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditingRoot(false)} className="text-zinc-500 p-0.5 hover:bg-zinc-800 rounded cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div
                      onClick={() => { setEditingRoot(true); setEditRootText(structure.rootName); }}
                      className="cursor-pointer group/title"
                      title="Klik untuk mengubah nama proyek"
                    >
                      <h3 className="text-[12px] font-semibold text-zinc-200 tracking-tight truncate group-hover/title:text-white transition-colors">
                        {structure.rootName}
                      </h3>
                      <p className="text-[10px] text-zinc-600 mt-0.5 font-medium">
                        {structure.rootStatus || "Perencanaan"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── COLUMN 2 & 3: FEATURES & SUB-FEATURES ── */}
          <div className="z-10 flex flex-col gap-5">
            {structure.features.map((feat, featureIndex) => {
              const isEditing = editingNodeId === feat.id;

              return (
                <div key={feat.id} className="flex items-center gap-10 md:gap-14">
                  {/* FEATURE CARD */}
                  <div
                    ref={(el) => { featureRefs.current[feat.id] = el; }}
                    className="group relative w-56 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-200"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                  >
                    {/* Connector dots */}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-700 border border-zinc-600" />
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-700 border border-zinc-600" />

                    <div className="flex items-start gap-2.5 min-w-0">
                      {/* Index number */}
                      <span className="text-[10px] font-mono text-zinc-700 mt-0.5 shrink-0 tabular-nums w-4 text-right">
                        {String(featureIndex + 1).padStart(2, '0')}
                      </span>

                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Nama Fitur..."
                              className="w-full bg-zinc-900 border border-zinc-700 text-white text-[11px] px-2 py-1 rounded-lg focus:outline-none focus:border-zinc-600"
                              autoFocus
                            />
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editBadge}
                                onChange={(e) => setEditBadge(e.target.value)}
                                placeholder="Rilis 1"
                                className="w-16 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded-md focus:outline-none"
                              />
                              <button onClick={() => handleSaveNode(feat.id)} className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] rounded-md font-medium transition-colors cursor-pointer">Simpan</button>
                              <button onClick={() => setEditingNodeId(null)} className="p-0.5 text-zinc-500 hover:text-white cursor-pointer"><X className="w-3 h-3" /></button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h4
                                onClick={() => handleStartEditNode(feat)}
                                className="text-[11px] font-semibold text-zinc-300 tracking-tight truncate cursor-pointer hover:text-white transition-colors"
                                title="Klik untuk edit nama fitur"
                              >
                                {feat.title}
                              </h4>
                              {feat.badge && (
                                <span className={`px-1.5 py-px rounded-md text-[9px] font-medium tracking-wide shrink-0 border ${getBadgeStyle(feat.badge)}`}>
                                  {feat.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="w-1 h-1 rounded-full bg-zinc-700" />
                              <span className="text-[10px] text-zinc-600 font-normal">{feat.status || "Direncanakan"}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover Actions */}
                    {!isEditing && (
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 bg-zinc-900 border border-zinc-800/80 rounded-lg p-0.5 transition-opacity shadow-lg">
                        <button onClick={() => handleStartEditNode(feat)} className="p-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer" title="Edit"><Edit2 className="w-2.5 h-2.5" /></button>
                        <button onClick={() => handleDeleteNode(feat.id)} className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer" title="Hapus"><Trash2 className="w-2.5 h-2.5" /></button>
                      </div>
                    )}
                  </div>

                  {/* SUB-FEATURES PANEL */}
                  <div
                    ref={(el) => { subFeatureRefs.current[feat.id] = el; }}
                    className="relative w-56 rounded-xl bg-zinc-950/60 border border-zinc-800/40 overflow-hidden"
                    style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
                  >
                    {/* Left connector */}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-zinc-800 border border-zinc-700" />

                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/40">
                      <span className="text-[9px] font-medium text-zinc-600 tracking-widest uppercase">Sub Fitur</span>
                      <button
                        onClick={() => handleAddSubFeature(feat.id)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 font-medium flex items-center gap-0.5 transition-colors cursor-pointer"
                        title="Tambah Sub Fitur"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Tambah</span>
                      </button>
                    </div>

                    {/* Items */}
                    <div className="px-3 py-2 space-y-px">
                      {feat.subFeatures.map((sub) => {
                        const isEditingSub = editingSubId === sub.id;

                        if (isEditingSub) {
                          return (
                            <div key={sub.id} className="flex items-center gap-1 py-1">
                              <input
                                type="text"
                                value={editSubText}
                                onChange={(e) => setEditSubText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveSub(feat.id, sub.id)}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white text-[10px] px-2 py-0.5 rounded-md focus:outline-none"
                                autoFocus
                              />
                              <button onClick={() => handleSaveSub(feat.id, sub.id)} className="text-emerald-400 p-0.5 cursor-pointer"><Check className="w-3 h-3" /></button>
                              <button onClick={() => setEditingSubId(null)} className="text-zinc-500 p-0.5 cursor-pointer"><X className="w-3 h-3" /></button>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={sub.id}
                            className="group/sub flex items-center justify-between py-1.5 px-1 -mx-1 rounded-md hover:bg-white/[0.02] transition-colors"
                          >
                            <div
                              onClick={() => handleStartEditSub(sub.id, sub.name)}
                              className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                              title="Klik untuk mengubah"
                            >
                              <span className="w-1 h-1 rounded-full bg-zinc-700 group-hover/sub:bg-zinc-500 shrink-0 transition-colors" />
                              <span className="text-[10px] text-zinc-500 group-hover/sub:text-zinc-300 truncate transition-colors">
                                {sub.name}
                              </span>
                            </div>

                            <div className="opacity-0 group-hover/sub:opacity-100 flex items-center transition-opacity">
                              <button onClick={() => handleStartEditSub(sub.id, sub.name)} className="p-0.5 text-zinc-600 hover:text-zinc-300 cursor-pointer" title="Edit"><Edit2 className="w-2.5 h-2.5" /></button>
                              <button onClick={() => handleDeleteSubFeature(feat.id, sub.id)} className="p-0.5 text-zinc-600 hover:text-red-400 cursor-pointer" title="Hapus"><Trash2 className="w-2.5 h-2.5" /></button>
                            </div>
                          </div>
                        );
                      })}
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
