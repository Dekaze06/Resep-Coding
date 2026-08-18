import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  FolderGit2,
  Sparkles,
  Layers,
  Rocket,
  GitBranch,
  ShieldCheck,
  Zap,
  Activity,
  Settings,
  BookOpen,
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
  Trash2,
  ExternalLink,
  RefreshCw,
  Check,
  Copy,
  SlidersHorizontal,
  FileCode2,
  Key,
  HelpCircle,
  Clock,
  HardDrive,
  Shield,
  CreditCard,
  User,
  Bell,
  Cpu
} from 'lucide-react';

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  mode?: 'fullstack' | 'frontend' | 'prd';
  updatedAt: string;
  status: 'Live' | 'Draft' | 'Building';
  views: number;
  code?: string;
  prompt?: string;
}

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'quota' | 'activity' | 'settings' | 'docs'>('overview');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [user, setUser] = useState<{ id?: string; name: string; email: string; role: string; quota: number; projectsCount: number } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'grid' | 'table'>('grid');

  // Settings State
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('Demo Client');
  const [clientEmail, setClientEmail] = useState<string>('demo@satusite.studio');

  // Fetch initial data from backend APIs
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch User Profile
      const authRaw = localStorage.getItem('satusite_auth_user');
      let activeEmail = 'demo@satusite.studio';
      if (authRaw) {
        try {
          const parsed = JSON.parse(authRaw);
          if (parsed.email) activeEmail = parsed.email;
        } catch (e) {}
      }

      const userRes = await fetch(`/api/auth/me?email=${encodeURIComponent(activeEmail)}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.success && userData.user) {
          setUser(userData.user);
          setClientName(userData.user.name || 'Demo Client');
          setClientEmail(userData.user.email || 'demo@satusite.studio');
        }
      }

      // 2. Fetch Projects from Server Database
      const projRes = await fetch('/api/projects');
      let serverProjects: ProjectItem[] = [];
      if (projRes.ok) {
        const pData = await projRes.json();
        if (pData.success && Array.isArray(pData.projects)) {
          serverProjects = pData.projects.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category || 'Web App',
            mode: p.mode || 'fullstack',
            updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Hari ini',
            status: p.status || 'Live',
            views: p.views || 42,
            code: p.code,
            prompt: p.prompt
          }));
        }
      }

      // Merge with localStorage projects if any
      try {
        const storeRaw = localStorage.getItem('satusite_projects_store') || localStorage.getItem('emergent_projects_store');
        if (storeRaw) {
          const store = JSON.parse(storeRaw);
          if (store && store.projects) {
            const localList: ProjectItem[] = Object.values(store.projects).map((lp: any) => ({
              id: lp.id,
              name: lp.name || 'Proyek AI Lokal',
              category: 'Web App',
              mode: 'fullstack',
              updatedAt: lp.updatedAt ? new Date(lp.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Baru saja',
              status: 'Live',
              views: 12,
              code: lp.code,
              prompt: lp.prompt
            }));

            const combined = [...serverProjects, ...localList];
            const unique = combined.filter((item, index, self) =>
              index === self.findIndex(t => t.id === item.id)
            );
            setProjects(unique);
          } else {
            setProjects(serverProjects);
          }
        } else {
          setProjects(serverProjects);
        }
      } catch (e) {
        setProjects(serverProjects);
      }
    } catch (err) {
      console.warn('Error fetching client portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('satusite_auth_user');
      localStorage.removeItem('satusite_auth_token');
    } catch (e) {}
    window.location.href = '/login';
  };

  const handleDownloadProject = async (project: ProjectItem) => {
    setDownloadSuccess(project.id);
    setTimeout(() => setDownloadSuccess(null), 2500);

    let htmlContent = project.code;
    if (!htmlContent) {
      try {
        const res = await fetch(`/api/projects/${project.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.project && data.project.code) {
            htmlContent = data.project.code;
          }
        }
      } catch (e) {}
    }

    if (!htmlContent) {
      htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} | satusitE Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#09090b] text-zinc-100 min-h-screen flex flex-col items-center justify-center p-6 text-center">
  <div class="max-w-xl p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-4">
    <h1 class="text-2xl font-bold">${project.name}</h1>
    <p class="text-xs text-zinc-400 leading-relaxed">${project.prompt || 'Aplikasi web mandiri diekspor dari satusitE Studio.'}</p>
  </div>
</body>
</html>`;
    }

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Hapus proyek ini secara permanen dari server?')) return;
    setProjects(prev => prev.filter(p => p.id !== id));

    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  const handleShareLink = (project: ProjectItem) => {
    setCopiedId(project.id);
    navigator.clipboard.writeText(`${window.location.origin}/app?id=${project.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsSuccess(true);
    if (user) {
      setUser({ ...user, name: clientName, email: clientEmail });
    }
    try {
      localStorage.setItem('satusite_auth_user', JSON.stringify({ name: clientName, email: clientEmail, role: user?.role || 'Client Pro' }));
    } catch (e) {}
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  const filteredProjects = projects.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (p.prompt && p.prompt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory || p.mode === selectedCategory.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. SIDEBAR NAVIGATION (CLEAN, MINIMALIST, HIGH DENSITY)                  */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 bg-[#0d0d10] border-r border-zinc-800/70 flex flex-col shrink-0 z-30">
        
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-zinc-800/70 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="satusitE Logo" className="w-5 h-5 object-contain" />
            <div className="flex items-center gap-1.5 select-none">
              <span className="font-agus text-sm font-normal tracking-[0.35em] text-white">satusitE</span>
              <span className="text-zinc-600 font-light text-xs">/</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">PORTAL</span>
            </div>
          </a>
        </div>

        {/* Action Button: Quick Launch */}
        <div className="p-3">
          <a
            href="/app"
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
            <span>Studio AI Generator</span>
          </a>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 px-3 py-2 space-y-5 overflow-y-auto text-xs">
          
          {/* GROUP 1: WORKSPACE */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Workspace
            </div>
            
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
              <span>Ringkasan Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'projects' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Koleksi Proyek</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-400 font-mono border border-zinc-800/60">
                {projects.length}
              </span>
            </button>

            <a
              href="/gallery"
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors text-left"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>Galeri & Showcase</span>
            </a>
          </div>

          {/* GROUP 2: DEVOPS & DISTRIBUSI */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              DevOps & Launch
            </div>

            <a
              href="/deploy"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Rocket className="w-3.5 h-3.5 text-zinc-400" />
                <span>Deploy & Custom Domain</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Edge</span>
            </a>

            <a
              href="/github"
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors text-left"
            >
              <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
              <span>GitHub Push Hub</span>
            </a>

            <a
              href="/testing"
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors text-left"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Testing & QA Suite</span>
            </a>
          </div>

          {/* GROUP 3: AKUN & MANAJEMEN */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Akun & Sistem
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('quota')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'quota' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-3.5 h-3.5 text-zinc-400" />
                <span>Kuota Token AI</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                {user?.quota || 250}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'activity' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
              <span>Log Aktivitas & Audit</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
              <span>Pengaturan Profil</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'docs' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>Panduan & API Doc</span>
            </button>
          </div>

          {/* SUPERADMIN ACCESS */}
          {user?.role === 'Superadmin' && (
            <div className="pt-2 border-t border-zinc-800/60">
              <a
                href="/admin"
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-zinc-300 hover:text-white bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Portal Admin</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </a>
            </div>
          )}

        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-zinc-800/70">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold text-[11px] shrink-0 border border-zinc-700/60">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-white truncate">{user?.name || 'Klien satusitE'}</div>
                <div className="text-[10px] text-zinc-500 truncate">{user?.email || 'demo@satusite.studio'}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT VIEW (CLEAN MINIMALIST LAYOUT)                            */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-zinc-800/70 bg-[#09090b]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white tracking-tight">
              {activeTab === 'overview' && 'Ringkasan Dashboard'}
              {activeTab === 'projects' && 'Katalog Aplikasi Web'}
              {activeTab === 'quota' && 'Manajemen Kuota Token AI'}
              {activeTab === 'activity' && 'Log Audit & Aktivitas'}
              {activeTab === 'settings' && 'Pengaturan Akun & Profil'}
              {activeTab === 'docs' && 'Panduan Integrasi & API'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
              <Zap className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-mono text-zinc-200">{user?.quota || 250}</span>
              <span className="text-zinc-500">Token</span>
            </div>

            <button
              type="button"
              onClick={fetchAllData}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Segarkan Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-white' : ''}`} />
            </button>

            <a
              href="/app"
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Proyek Baru</span>
            </a>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="p-5 sm:p-7 lg:p-8 space-y-6 max-w-7xl">
          
          {/* ===================================================================== */}
          {/* TAB 1: OVERVIEW                                                       */}
          {/* ===================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Top Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase">Total Proyek Web</div>
                  <div className="text-2xl font-semibold text-white tracking-tight">{projects.length}</div>
                  <div className="text-[11px] text-zinc-400">Tersimpan di Cloud Database</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase">Sisa Kuota AI</div>
                  <div className="text-2xl font-semibold text-white tracking-tight font-mono">{user?.quota || 250}</div>
                  <div className="text-[11px] text-zinc-400">Token Generasi Aktif</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase">Paket Langganan</div>
                  <div className="text-2xl font-semibold text-white tracking-tight">{user?.role || 'Client Pro'}</div>
                  <div className="text-[11px] text-zinc-400">Akses Tanpa Batas</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase">Jaringan Edge CDN</div>
                  <div className="text-2xl font-semibold text-emerald-400 tracking-tight">100% Aktif</div>
                  <div className="text-[11px] text-zinc-400">300+ Node Tersebar Global</div>
                </div>
              </div>

              {/* Quick Action Cards Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/app"
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all group space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-200">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="font-semibold text-white text-xs flex items-center justify-between">
                    <span>Studio AI Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Hasilkan kode Fullstack, Frontend, dan PRD interaktif hanya dari satu deskripsi teks.
                  </p>
                </a>

                <a
                  href="/deploy"
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all group space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-200">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div className="font-semibold text-white text-xs flex items-center justify-between">
                    <span>Deploy & Custom Domain</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Hubungkan domain kustom dan deploy proyek secara instan ke Vercel atau Netlify Edge.
                  </p>
                </a>

                <a
                  href="/testing"
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all group space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-200">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="font-semibold text-white text-xs flex items-center justify-between">
                    <span>Lighthouse QA Suite</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Uji performa, aksesibilitas, SEO, dan keamanan kode sebelum dirilis ke publik.
                  </p>
                </a>
              </div>

              {/* Recent Projects Table/Grid */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-xs font-semibold text-white">Proyek Aktif Terbaru</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('projects')}
                    className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Lihat Semua ({projects.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-xs space-y-2">
                    <Code2 className="w-8 h-8 mx-auto opacity-30" />
                    <p>Belum ada proyek yang dibuat.</p>
                    <a href="/app" className="text-white hover:underline font-medium">Buka Studio AI untuk membuat proyek pertama &rarr;</a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.slice(0, 4).map(p => (
                      <div key={p.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/70 space-y-3 hover:border-zinc-700 transition-all flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-white text-xs">{p.name}</h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800">
                              {p.mode || 'fullstack'}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                            {p.prompt || 'Aplikasi web mandiri dengan antarmuka modern.'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/60 text-xs">
                          <span className="text-[10px] text-zinc-500 font-mono">{p.updatedAt}</span>

                          <div className="flex items-center gap-1.5">
                            <a
                              href={`/app?id=${p.id}`}
                              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 transition-colors text-[11px]"
                              title="Buka di Studio"
                            >
                              Studio
                            </a>
                            <a
                              href={`/deploy?id=${p.id}`}
                              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 transition-colors text-[11px]"
                              title="Deploy ke Cloud"
                            >
                              Deploy
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDownloadProject(p)}
                              className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                              title="Unduh HTML"
                            >
                              {downloadSuccess === p.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Download className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: PROJECTS CATALOG                                              */}
          {/* ===================================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-4 animate-fade-in-up">
              
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/30 border border-zinc-800/80 p-3 rounded-2xl">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari proyek berdasarkan nama atau prompt..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['Semua', 'Fullstack', 'Frontend', 'PRD', 'Dashboard', 'E-Commerce'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                        selectedCategory === cat 
                          ? 'bg-zinc-800 text-white border border-zinc-700' 
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map(p => (
                  <div key={p.id} className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-white text-xs leading-snug">{p.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 uppercase">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                        {p.prompt || 'Aplikasi web mandiri yang dirancang oleh AI Agent.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/60 space-y-3">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{p.status}</span>
                        </span>
                        <span>{p.updatedAt}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-1">
                        <a
                          href={`/app?id=${p.id}`}
                          className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-[11px] font-medium flex items-center justify-center border border-zinc-800 transition-colors"
                          title="Buka di Studio"
                        >
                          Studio
                        </a>
                        <a
                          href={`/deploy?id=${p.id}`}
                          className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-[11px] font-medium flex items-center justify-center border border-zinc-800 transition-colors"
                          title="Deploy"
                        >
                          Deploy
                        </a>
                        <a
                          href={`/github?id=${p.id}`}
                          className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-[11px] font-medium flex items-center justify-center border border-zinc-800 transition-colors"
                          title="Push GitHub"
                        >
                          GitHub
                        </a>
                        <a
                          href={`/testing?id=${p.id}`}
                          className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-[11px] font-medium flex items-center justify-center border border-zinc-800 transition-colors"
                          title="Testing QA"
                        >
                          Test
                        </a>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
                        <button
                          type="button"
                          onClick={() => handleDownloadProject(p)}
                          className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh File</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(p.id)}
                          className="hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: QUOTA & BILLING                                               */}
          {/* ===================================================================== */}
          {activeTab === 'quota' && (
            <div className="max-w-2xl bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 space-y-6 animate-fade-in-up">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-zinc-300" />
                  <span>Manajemen Kuota Token AI</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Setiap instruksi pembuatan atau pengubahan antarmuka mengonsumsi 1 token kuota AI generasi cerdas.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">Sisa Kuota Aktif</span>
                  <span className="text-white font-mono font-semibold">{user?.quota || 250} / 500 Token</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((user?.quota || 250) / 500) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="font-medium text-white flex items-center justify-between">
                  <span>Tipe Paket: {user?.role || 'Client Pro'}</span>
                  <span className="text-emerald-400 text-[11px] font-mono">Aktif</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Paket Anda menyertakan regenerasi tanpa batas, ekspor kode sumber mandiri, integrasi deployment global, serta akses prioritas ke model AI terbaru.
                </p>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: ACTIVITY LOGS                                                 */}
          {/* ===================================================================== */}
          {activeTab === 'activity' && (
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-zinc-400" />
                  <span>Riwayat Aktivitas & Sinkronisasi</span>
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">Live Feed</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="text-zinc-200">Sinkronisasi Database Proyek Serverless</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px]">Baru saja</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span className="text-zinc-200">Otentikasi Klien Terverifikasi</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px]">Aktif</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                    <span className="text-zinc-200">Pembaruan Edge CDN Deployment</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px]">10m lalu</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 5: PROFILE & SETTINGS                                            */}
          {/* ===================================================================== */}
          {activeTab === 'settings' && (
            <div className="max-w-xl bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 space-y-6 animate-fade-in-up">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-300" />
                  <span>Pengaturan Profil & Akun</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Perbarui identitas profil dan konfigurasi preferensi akun Anda.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-medium">Nama Lengkap</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-medium">Alamat Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {savedSettingsSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-zinc-950" />
                        <span>Profil Berhasil Diperbarui!</span>
                      </>
                    ) : (
                      <span>Simpan Perubahan Profil</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 6: DOCUMENTATION & API GUIDE                                      */}
          {/* ===================================================================== */}
          {activeTab === 'docs' && (
            <div className="max-w-3xl bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 space-y-6 animate-fade-in-up">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-zinc-300" />
                  <span>Panduan & Integrasi API satusitE</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Panduan cepat untuk memaksimalkan workflow pengembangan web modern berbasis AI.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <FileCode2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>1. Membuat Aplikasi Web dengan AI Prompt</span>
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Masuk ke menu Studio AI, pilih mode (Fullstack, Frontend, atau PRD), ketikkan ide spesifikasi aplikasi Anda, dan biarkan AI merancang struktur, kode HTML5, Tailwind CSS, dan JavaScript interaktif secara utuh.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Rocket className="w-3.5 h-3.5 text-zinc-400" />
                    <span>2. Deployment Mandiri & Custom Domain</span>
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Gunakan Deploy Hub untuk menerbitkan aplikasi ke Edge Network Vercel atau Netlify dengan sertifikat SSL gratis dan latensi ultra rendah.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
                    <span>3. Integrasi Git & GitHub Otomatis</span>
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Koneksikan token GitHub Personal Access Token (PAT) Anda untuk melakukan `git push` langsung dari browser ke repositori pribadi atau publik Anda.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
