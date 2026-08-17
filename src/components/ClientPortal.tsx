import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  FolderGit2,
  Zap,
  Activity,
  Settings,
  Plus,
  Download,
  Share2,
  Search,
  CheckCircle2,
  Code2,
  ArrowRight,
  LogOut,
  Globe,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ProjectItem {
  id: string;
  name: string;
  category: 'E-Commerce' | 'Dashboard' | 'Landing Page' | 'Web App' | 'Bisnis & Kuliner';
  updatedAt: string;
  status: 'Live' | 'Draft' | 'Building';
  views: number;
  codeSnippet?: string;
  prompt?: string;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'Nexus Enterprise Analytics Dashboard',
    category: 'Dashboard',
    updatedAt: '18 Agu 2026, 02:40',
    status: 'Live',
    views: 142,
    prompt: 'Dashboard metrik penjualan SaaS dengan grafik bulanan Chart.js, filter tabel interaktif, dan ekspor CSV.'
  },
  {
    id: 'proj-2',
    name: 'Aura Minimalist Fashion Store',
    category: 'E-Commerce',
    updatedAt: '17 Agu 2026, 21:15',
    status: 'Live',
    views: 318,
    prompt: 'Toko pakaian modern dengan keranjang belanja interaktif sliding drawer dan formulir WhatsApp checkout.'
  },
  {
    id: 'proj-3',
    name: 'Kopi Kenangan Senja Digital Menu & POS',
    category: 'Bisnis & Kuliner',
    updatedAt: '16 Agu 2026, 18:30',
    status: 'Live',
    views: 89,
    prompt: 'Aplikasi kasir restoran dan menu digital dengan sistem keranjang meja dan hitung total otomatis.'
  },
  {
    id: 'proj-4',
    name: 'Vortex Kanban Task Management',
    category: 'Web App',
    updatedAt: '15 Agu 2026, 14:05',
    status: 'Draft',
    views: 45,
    prompt: 'Papan manajemen tugas Kanban board interaktif dengan filter prioritas dan penyimpanan lokal.'
  }
];

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'quota' | 'activity' | 'settings'>('overview');
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [user, setUser] = useState<{ name: string; email: string; plan: string; avatar: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('satusite_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser({
          name: 'Demo Client',
          email: 'demo@satusite.studio',
          plan: 'Enterprise Pro',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DemoClient&backgroundColor=27272a'
        });
      }

      const historyStr = localStorage.getItem('satusite_project_history');
      if (historyStr) {
        const historyArr = JSON.parse(historyStr);
        if (Array.isArray(historyArr) && historyArr.length > 0) {
          const formattedHistory: ProjectItem[] = historyArr.map((h: any, i: number) => ({
            id: `hist-${i}-${h.timestamp}`,
            name: h.name || `Proyek Web AI #${i + 1}`,
            category: 'Web App',
            updatedAt: new Date(h.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
            status: 'Live',
            views: Math.floor(Math.random() * 50) + 10,
            prompt: h.prompt
          }));
          
          setProjects(prev => {
            const combined = [...formattedHistory, ...DEFAULT_PROJECTS];
            const unique = combined.filter((item, index, self) => 
              index === self.findIndex(t => t.name === item.name)
            );
            return unique;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('satusite_auth_user');
    } catch (e) {}
    window.location.href = '/login';
  };

  const handleDownloadProject = (project: ProjectItem) => {
    setDownloadSuccess(project.id);
    setTimeout(() => setDownloadSuccess(null), 2000);

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} | satusitE Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Geist', sans-serif; }</style>
</head>
<body class="bg-[#09090b] text-zinc-100 min-h-screen flex flex-col items-center justify-center p-6 text-center">
  <div class="max-w-xl p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-4">
    <h1 class="text-2xl font-bold">${project.name}</h1>
    <p class="text-xs text-zinc-400 leading-relaxed">${project.prompt || 'Aplikasi web mandiri diekspor dari satusitE Studio.'}</p>
    <div class="pt-4">
      <span class="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-medium">Status: Mandiri & Siap Pakai</span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareLink = (project: ProjectItem) => {
    setCopiedId(project.id);
    navigator.clipboard.writeText(`${window.location.origin}/app?demo=${project.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProjects = projects.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (p.prompt && p.prompt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. SIDEBAR NAVIGATION (DARK MONOCHROME)                                  */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-60 bg-[#121215] border-r border-zinc-800/80 flex flex-col shrink-0 z-30">
        
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-zinc-800/80 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="satusitE Logo" className="w-5 h-5 object-contain" />
            <div className="flex items-center gap-1.5 select-none">
              <span className="font-agus text-sm font-normal tracking-[0.35em] text-white">satusitE</span>
              <span className="text-zinc-600 font-light text-xs">/</span>
              <span className="font-syne font-bold text-[11px] text-zinc-400 tracking-tight">Studio.</span>
            </div>
          </a>
        </div>

        {/* Create Project Button */}
        <div className="p-3.5">
          <a
            href="/app"
            className="w-full py-2 px-3 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] border border-blue-900/60 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-950/40 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Buat Proyek Baru</span>
          </a>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2.5 space-y-1 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
              activeTab === 'overview' 
                ? 'bg-zinc-800 text-white font-semibold' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-zinc-400" />
            <span>Ringkasan</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
              activeTab === 'projects' 
                ? 'bg-zinc-800 text-white font-semibold' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FolderGit2 className="w-4 h-4 text-zinc-400" />
              <span>Proyek Klien</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-zinc-900 text-[10px] text-zinc-400 border border-zinc-800">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quota')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
              activeTab === 'quota' 
                ? 'bg-zinc-800 text-white font-semibold' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Zap className="w-4 h-4 text-zinc-400" />
            <span>Kuota & Paket</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
              activeTab === 'activity' 
                ? 'bg-zinc-800 text-white font-semibold' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Activity className="w-4 h-4 text-zinc-400" />
            <span>Log Aktivitas</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-zinc-800 text-white font-semibold' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>Pengaturan</span>
          </button>
        </nav>

        {/* User Card Bottom */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/70 border border-zinc-800/60">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Client&backgroundColor=27272a"}
                alt="Avatar"
                className="w-7 h-7 rounded-lg bg-zinc-800 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-zinc-200 truncate">{user?.name || 'Klien'}</h4>
                <p className="text-[10px] text-zinc-400">{user?.plan || 'Pro'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (DARK CLEAN)                                        */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#09090b]">
        
        {/* Top Header Bar */}
        <header className="h-16 px-6 border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              {activeTab === 'overview' && 'Ringkasan Dashboard'}
              {activeTab === 'projects' && 'Daftar Proyek Web'}
              {activeTab === 'quota' && 'Status Kuota AI'}
              {activeTab === 'activity' && 'Log Aktivitas'}
              {activeTab === 'settings' && 'Pengaturan Akun'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/"
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Beranda
            </a>
            <a
              href="/app"
              className="px-3.5 py-1.5 rounded-lg bg-[#1e3a8a] hover:bg-[#1d4ed8] border border-blue-900/60 text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow-md shadow-blue-950/40"
            >
              <span>Buka Studio</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </a>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6 animate-fade-in-up">
          
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW DASHBOARD                                                */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Welcome Card */}
              <div className="p-6 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-medium text-zinc-400">
                  <ShieldCheck className="w-3 h-3 text-zinc-400" />
                  <span>Portal Klien</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Kelola & Ekspor Aplikasi Web Anda
                </h1>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  Akses seluruh aplikasi yang dirancang dengan AI, unduh file HTML mandiri, atau lanjutkan revisi di AI Studio kapan saja.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="text-[11px] font-medium">Total Proyek</span>
                    <FolderGit2 className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="text-xl font-bold text-white">{projects.length}</div>
                  <p className="text-[10px] text-zinc-500">Aplikasi aktif & draft</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="text-[11px] font-medium">Status Online</span>
                    <Globe className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="text-xl font-bold text-zinc-200">
                    {projects.filter(p => p.status === 'Live').length}
                  </div>
                  <p className="text-[10px] text-zinc-500">Siap dibagikan</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="text-[11px] font-medium">Sisa Kuota AI</span>
                    <Zap className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="text-xl font-bold text-emerald-400">48 <span className="text-xs text-zinc-500 font-normal">/ 50</span></div>
                  <p className="text-[10px] text-zinc-500">Kredit generasi</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="text-[11px] font-medium">Unduhan File</span>
                    <Download className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="text-xl font-bold text-white">12</div>
                  <p className="text-[10px] text-zinc-500">File HTML mandiri</p>
                </div>
              </div>

              {/* Recent Projects Section */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Proyek Terbaru</h3>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Lihat Semua</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {projects.slice(0, 4).map((project) => (
                    <div
                      key={project.id}
                      className="p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3.5 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-medium text-zinc-400">
                            {project.category}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">
                            {project.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                          {project.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {project.prompt || 'Aplikasi web mandiri berbasis HTML5 & Tailwind CSS.'}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-zinc-500">{project.updatedAt}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDownloadProject(project)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Unduh File HTML"
                          >
                            {downloadSuccess === project.id ? <CheckCircle2 className="w-3.5 h-3.5 text-zinc-200" /> : <Download className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleShareLink(project)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Salin Tautan"
                          >
                            {copiedId === project.id ? <CheckCircle2 className="w-3.5 h-3.5 text-zinc-200" /> : <Share2 className="w-3.5 h-3.5" />}
                          </button>
                          <a
                            href={`/app?load=${project.id}`}
                            className="px-2.5 py-1 rounded-lg bg-[#1e3a8a] hover:bg-[#1d4ed8] border border-blue-900/60 text-white font-medium text-xs flex items-center gap-1 transition-colors shadow-sm shadow-blue-950/40"
                          >
                            <span>Studio</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PROJECTS MANAGEMENT                                               */}
          {/* ========================================================================= */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama atau prompt..."
                    className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-zinc-600 rounded-xl pl-8.5 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {['Semua', 'Dashboard', 'E-Commerce', 'Bisnis & Kuliner', 'Web App'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-zinc-800 text-white font-semibold border border-zinc-700'
                          : 'bg-zinc-900 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3.5 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-medium text-zinc-400">
                          {project.category}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {project.status}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                        {project.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {project.prompt || 'Aplikasi web mandiri berbasis HTML5 & Tailwind CSS.'}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2.5 border-t border-zinc-800/60">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span>{project.updatedAt}</span>
                        <span>{project.views} views</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => handleDownloadProject(project)}
                          className="py-1 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Unduh HTML"
                        >
                          <Download className="w-3 h-3 text-zinc-400" />
                          <span>Unduh</span>
                        </button>
                        
                        <button
                          onClick={() => handleShareLink(project)}
                          className="py-1 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Salin Link"
                        >
                          <Share2 className="w-3 h-3 text-zinc-400" />
                          <span>{copiedId === project.id ? 'Tersalin' : 'Bagikan'}</span>
                        </button>

                        <a
                          href={`/app?load=${project.id}`}
                          className="py-1 px-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1d4ed8] border border-blue-900/60 text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors shadow-sm shadow-blue-950/40"
                        >
                          <span>Studio</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: QUOTA & CREDITS                                                   */}
          {/* ========================================================================= */}
          {activeTab === 'quota' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-white">Status Kuota AI Generasi</h3>
                    <p className="text-[11px] text-zinc-400">Kuota bulanan untuk perancangan aplikasi dan revisi prompt.</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400">
                    Pro Creator
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Penggunaan Kuota:</span>
                    <span className="font-semibold text-emerald-400">48 / 50 Kredit</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[96%]"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800/60 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Ekspor HTML</span>
                    <strong className="text-zinc-200 text-xs">Unlimited</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Token Output</span>
                    <strong className="text-emerald-400 text-xs font-semibold">8.192 Token</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Reset Kuota</span>
                    <strong className="text-zinc-200 text-xs">01 Sep 2026</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ACTIVITY LOG                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'activity' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-3.5">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Log Aktivitas Build</h3>
                <div className="space-y-2.5">
                  {[
                    { action: 'Generasi Aplikasi Web', title: 'Nexus Enterprise Analytics', time: '18 Agu 2026, 02:40', badge: 'Build' },
                    { action: 'Ekspor File HTML Mandiri', title: 'Aura Minimalist Fashion Store', time: '17 Agu 2026, 21:15', badge: 'Export' },
                    { action: 'Revisi Kode Visual via Chat', title: 'Kopi Kenangan Senja Digital Menu', time: '16 Agu 2026, 18:30', badge: 'Revisi' },
                    { action: 'Inisialisasi Blueprint PRD', title: 'Vortex Kanban Task Management', time: '15 Agu 2026, 14:05', badge: 'Blueprint' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                          <Code2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-zinc-200">{act.title}</h4>
                          <p className="text-[10px] text-zinc-500">{act.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-medium">
                          {act.badge}
                        </span>
                        <p className="text-[10px] text-zinc-600 mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: SETTINGS                                                          */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-4">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Pengaturan Akun Klien</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium text-[11px]">Nama Pengguna / Perusahaan</label>
                    <input
                      type="text"
                      defaultValue={user?.name || 'Demo Client'}
                      className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium text-[11px]">Email Klien</label>
                    <input
                      type="email"
                      defaultValue={user?.email || 'demo@satusite.studio'}
                      className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors text-xs"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => alert('Pengaturan profil berhasil disimpan!')}
                      className="px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] border border-blue-900/60 text-white font-semibold transition-all text-xs cursor-pointer shadow-lg shadow-blue-950/40"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
