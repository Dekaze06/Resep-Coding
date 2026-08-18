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
  Cpu,
  LogIn
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
  owner?: string;
}

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'quota' | 'activity' | 'settings' | 'docs'>('overview');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [user, setUser] = useState<{ id?: string; name: string; email: string; avatar?: string; role: string; quota: number; projectsCount: number; authProvider?: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Settings State
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');

  // Fetch initial data from backend APIs
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const authRaw = localStorage.getItem('satusite_auth_user');
      let activeEmail = '';
      if (authRaw) {
        try {
          const parsed = JSON.parse(authRaw);
          if (parsed.email) {
            activeEmail = parsed.email;
            setUser(parsed);
            setClientName(parsed.name || parsed.email.split('@')[0]);
            setClientEmail(parsed.email);
          }
        } catch (e) {}
      }

      // 1. Fetch User Profile from MongoDB if logged in
      if (activeEmail) {
        try {
          const token = localStorage.getItem('satusite_auth_token') || '';
          const userRes = await fetch(`/api/auth/me?email=${encodeURIComponent(activeEmail)}`, {
            headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData.success && userData.user) {
              setUser(userData.user);
              setClientName(userData.user.name || '');
              setClientEmail(userData.user.email || '');
              localStorage.setItem('satusite_auth_user', JSON.stringify(userData.user));
            }
          }
        } catch (e) {}
      }

      // 2. Fetch Projects from MongoDB Database
      const projUrl = activeEmail ? `/api/projects` : `/api/projects`;
      const projRes = await fetch(projUrl);
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
            views: p.views || 0,
            code: p.code,
            prompt: p.prompt,
            owner: p.owner
          }));
        }
      }

      // Filter by current user if logged in
      if (activeEmail) {
        const userProjects = serverProjects.filter(p => !p.owner || p.owner.toLowerCase() === activeEmail.toLowerCase());
        setProjects(userProjects);
      } else {
        setProjects(serverProjects);
      }

    } catch (err) {
      console.warn('Error fetching client portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['overview', 'projects', 'quota', 'activity', 'settings', 'docs'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    } catch (e) {}
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const token = localStorage.getItem('satusite_auth_token') || '';
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ name: clientName })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('satusite_auth_user', JSON.stringify(data.user));
        }
      }
      setSavedSettingsSuccess(true);
      setTimeout(() => setSavedSettingsSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (p.prompt && p.prompt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory || p.mode === selectedCategory.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#09090b] border-r border-zinc-800/80 flex flex-col shrink-0 z-30">
        
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-zinc-800/80 flex items-center justify-between">
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
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
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
              href="/templates"
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors text-left"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>Template & Galeri</span>
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
                <span>Deploy & Cloud Edge</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Live</span>
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

          {/* GROUP 3: AKUN & SISTEM */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Akun & Preferensi
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
                <span>Paket & Kuota AI</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-300 font-bold">{user?.quota || 0}</span>
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

            {/* OPSI 2: DYNAMIC SUPERADMIN SHORTCUT (HANYA MUNCUL JIKA USER PEMILIK / SUPERADMIN) */}
            {(user?.role === 'Superadmin' || user?.email?.toLowerCase() === 'dekaze08@gmail.com') && (
              <div className="pt-2 border-t border-zinc-800/60">
                <a
                  href="/master-console-dekaze"
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition-all text-left font-medium shadow-sm"
                  title="Akses Konsol Master Superadmin"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs">Konsol Superadmin</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">
                    ROOT
                  </span>
                </a>
              </div>
            )}
          </div>

        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-zinc-800/80">
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || user.email)}&backgroundColor=27272a`}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{user.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </a>
          )}
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 px-6 border-b border-zinc-800/80 flex items-center justify-between shrink-0 bg-transparent">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white capitalize">
              {activeTab === 'overview' && 'Ringkasan Dashboard'}
              {activeTab === 'projects' && 'Koleksi Proyek'}
              {activeTab === 'quota' && 'Paket & Kuota AI'}
              {activeTab === 'settings' && 'Pengaturan Akun'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/app"
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Proyek Baru</span>
            </a>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="p-5 sm:p-7 lg:p-8 space-y-6 max-w-7xl">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Top Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase">Total Proyek Web</div>
                  <div className="text-2xl font-semibold text-white tracking-tight font-mono">{projects.length}</div>
                  <div className="text-[11px] text-zinc-400">Tersimpan di MongoDB Atlas</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase">Sisa Kuota Token</div>
                  <div className="text-2xl font-semibold text-white tracking-tight font-mono">{user?.quota ?? 100}</div>
                  <div className="text-[11px] text-zinc-400">Token Generasi AI Aktif</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase">Tingkat Paket</div>
                  <div className="text-2xl font-semibold text-white tracking-tight">{user?.role || 'Gratis'}</div>
                  <div className="text-[11px] text-zinc-400">Status Akun Terverifikasi</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase">AI Engine & DB</div>
                  <div className="text-2xl font-semibold text-white tracking-tight font-mono">Gemini 3.7 Flash</div>
                  <div className="text-[11px] text-zinc-400">MongoDB Atlas Live Sync</div>
                </div>
              </div>

              {/* Quick Action Cards Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/app"
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all group space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="font-semibold text-white text-xs flex items-center justify-between">
                    <span>Studio AI Generator</span>
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
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div className="font-semibold text-white text-xs flex items-center justify-between">
                    <span>Deploy & Cloud Edge</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Hubungkan domain kustom dan publikasikan aplikasi secara instan ke Vercel atau Netlify.
                  </p>
                </a>

                <a
                  href="/testing"
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all group space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="font-semibold text-white text-xs flex items-center justify-between">
                    <span>Testing & QA Suite</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Uji performa, aksesibilitas, SEO, dan keamanan kode sebelum dirilis ke publik.
                  </p>
                </a>
              </div>

              {/* Projects Section */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-xs font-semibold text-white">Proyek Aktif Anda</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('projects')}
                    className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Semua ({projects.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-12 text-zinc-400 text-xs space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-white text-sm">Belum Ada Proyek Tersimpan</div>
                      <p className="text-zinc-500 max-w-sm mx-auto">
                        Database Anda saat ini dalam kondisi bersih. Mulai buat proyek pertama Anda bersama AI Agent sekarang.
                      </p>
                    </div>
                    <a
                      href="/app"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold transition-all shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Buat Proyek Pertama di Studio</span>
                    </a>
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
                            {p.prompt || 'Aplikasi web mandiri dengan arsitektur modern.'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/60 text-xs">
                          <span className="text-[10px] text-zinc-500 font-mono">{p.updatedAt}</span>

                          <div className="flex items-center gap-1.5">
                            <a
                              href={`/app?id=${p.id}`}
                              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 transition-colors text-[11px]"
                            >
                              Studio
                            </a>
                            <a
                              href={`/deploy?id=${p.id}`}
                              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 transition-colors text-[11px]"
                            >
                              Deploy
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDownloadProject(p)}
                              className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                              title="Unduh HTML"
                            >
                              {downloadSuccess === p.id ? <Check className="w-3 h-3 text-zinc-200" /> : <Download className="w-3 h-3" />}
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

          {/* TAB 2: PROJECTS CATALOG */}
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-mono"
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

              {/* Projects Grid or Empty State */}
              {filteredProjects.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
                  <Code2 className="w-8 h-8 text-zinc-600 mx-auto" />
                  <div className="font-semibold text-white text-xs">Belum ada proyek yang sesuai</div>
                  <a href="/app" className="text-xs text-zinc-300 hover:text-white underline inline-block">
                    Buat proyek baru di Studio &rarr;
                  </a>
                </div>
              ) : (
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
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                            <span>{p.status}</span>
                          </span>
                          <span>{p.updatedAt}</span>
                        </div>

                        <div className="grid grid-cols-4 gap-1">
                          <a
                            href={`/app?id=${p.id}`}
                            className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-[11px] font-medium flex items-center justify-center border border-zinc-800 transition-colors"
                          >
                            Studio
                          </a>
                          <a
                            href={`/deploy?id=${p.id}`}
                            className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-[11px] font-medium flex items-center justify-center border border-zinc-800 transition-colors"
                          >
                            Deploy
                          </a>
                          <a
                            href={`/github?id=${p.id}`}
                            className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-[11px] font-medium flex items-center justify-center border border-zinc-800 transition-colors"
                          >
                            GitHub
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(p.id)}
                            className="py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 text-[11px] flex items-center justify-center border border-zinc-800 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: QUOTA & SUBSCRIPTION */}
          {activeTab === 'quota' && (
            <div className="space-y-6 animate-fade-in-up">
              
              <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono uppercase text-zinc-400">Paket Langganan Aktif</div>
                    <h3 className="text-xl font-bold text-white">{user?.role || 'Gratis'}</h3>
                    <p className="text-xs text-zinc-400">
                      Tersambung ke akun <span className="text-white font-mono">{user?.email || 'Tamu'}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-right">
                    <div className="text-[10px] text-zinc-500 font-mono uppercase">Sisa Kuota Token</div>
                    <div className="text-3xl font-bold text-white font-mono">{user?.quota || 100}</div>
                  </div>
                </div>
              </div>

              {/* 3-Tier Official Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gratis */}
                <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">Gratis</h4>
                    <div className="text-2xl font-bold text-white">Rp 0</div>
                    <p className="text-xs text-zinc-400">Eksplorasi pembuatan aplikasi dasar.</p>
                  </div>
                  <ul className="text-xs text-zinc-400 space-y-2">
                    <li>• Akses preview di Studio</li>
                    <li className="text-zinc-600">• Tidak ada fitur download kode</li>
                    <li className="text-zinc-600">• Tidak ada fitur deploy ke cloud</li>
                    <li className="text-zinc-600">• Tidak ada fitur push GitHub</li>
                  </ul>
                </div>

                {/* Pro */}
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-600 space-y-4 relative">
                  <span className="absolute top-4 right-4 text-[9px] px-2 py-0.5 rounded bg-zinc-800 text-white font-semibold border border-zinc-700">Populer</span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">Pro</h4>
                    <div className="text-2xl font-bold text-white">Rp 265.000 <span className="text-xs text-zinc-500 font-normal">/ bln</span></div>
                    <p className="text-xs text-zinc-400">Untuk kreator & web developer profesional.</p>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-2">
                    <li>• Akses mode Frontend & PRD Struktur</li>
                    <li>• Fitur unduh kode HTML5/JS lengkap</li>
                    <li>• 500 Token generasi AI bulanan</li>
                    <li>• Pratinjau responsif mobile & tablet</li>
                  </ul>
                </div>

                {/* Max */}
                <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">Max</h4>
                    <div className="text-2xl font-bold text-white">Rp 2.350.000 <span className="text-xs text-zinc-500 font-normal">/ bln</span></div>
                    <p className="text-xs text-zinc-400">Akses penuh tanpa batas untuk perusahaan.</p>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-2">
                    <li>• Semua Fitur Terbuka 100%</li>
                    <li>• Mode Fullstack + In-Memory CRUD</li>
                    <li>• 1-Click Deploy ke Edge Network</li>
                    <li>• Sinkronisasi otomatis repositori GitHub</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl animate-fade-in-up">
              
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
                <div className="space-y-1 pb-4 border-b border-zinc-800/60">
                  <h3 className="text-sm font-semibold text-white">Informasi Profil Pengguna</h3>
                  <p className="text-xs text-zinc-400">Kelola data identitas akun yang terhubung ke MongoDB Atlas.</p>
                </div>

                {savedSettingsSuccess && (
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
                    <span>Perubahan profil berhasil disimpan ke database!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Nama Tampilan</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Alamat Email (Akun Utama)</label>
                    <input
                      type="email"
                      disabled
                      value={clientEmail}
                      className="w-full bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-2.5 text-xs text-zinc-500 cursor-not-allowed font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}
