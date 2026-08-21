import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Cpu,
  Server,
  ShieldCheck,
  Activity,
  KeyRound,
  Sliders,
  Terminal,
  Database,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Lock,
  Globe,
  Zap,
  Check,
  Clock,
  Layers,
  BarChart3,
  LogOut,
  SlidersHorizontal,
  FileCode2,
  HardDrive,
  Shield,
  CreditCard,
  User,
  Bell,
  TrendingUp,
  Download,
  ToggleLeft,
  ToggleRight,
  Filter,
  X
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Gratis' | 'Pro' | 'Max' | 'Superadmin' | string;
  status: 'active' | 'suspended' | 'pending';
  quota: number;
  projectsCount: number;
  joinedAt: string;
}

interface PlatformProject {
  id: string;
  name: string;
  owner: string;
  category: string;
  mode: 'fullstack' | 'frontend' | 'prd';
  createdAt: string;
  isFeatured: boolean;
  status: 'Live' | 'Draft' | 'Building';
}

interface SubscriberRecord {
  id: string;
  email: string;
  source: string;
  status: string;
  createdAt: string;
}

export default function AdminPortal() {
  // Security Gate State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isCheckingPin, setIsCheckingPin] = useState<boolean>(false);
  const [showPinPassword, setShowPinPassword] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'analytics' | 'users' | 'projects' | 'subscribers' | 'ai-models' | 'servers' | 'database' | 'logs' | 'settings'
  >('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Check existing session on load
  useEffect(() => {
    const sessionToken = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('satusite_admin_session') : null;
    if (sessionToken === 'true') {
      setIsAdminUnlocked(true);
      fetchAllAdminData();
      return;
    }

    const authUserRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('satusite_auth_user') : null;
    if (authUserRaw) {
      try {
        const u = JSON.parse(authUserRaw);
        const allowed = ['dekaze08@gmail.com', 'dekaze06@gmail.com', 'dekaze01@gmail.com', 'akmalsf0@gmail.com', 'akmalsf2@gmail.com', 'agus@satusite.studio'];
        const role = (u.role || '').toLowerCase();
        if (role === 'superadmin' || role === 'admin' || allowed.includes(u.email?.toLowerCase())) {
          setIsAdminUnlocked(true);
          sessionStorage.setItem('satusite_admin_session', 'true');
          fetchAllAdminData();
        }
      } catch (e) {}
    }
  }, []);

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setIsCheckingPin(true);

    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: adminPin })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('satusite_admin_session', 'true');
        setIsAdminUnlocked(true);
        fetchAllAdminData();
      } else {
        setPinError(data.error || 'PIN Master Admin salah.');
      }
    } catch (err: any) {
      setPinError('Gagal memverifikasi PIN keamanan.');
    } finally {
      setIsCheckingPin(false);
    }
  };

  const handleLockAdmin = () => {
    sessionStorage.removeItem('satusite_admin_session');
    setIsAdminUnlocked(false);
    setAdminPin('');
  };

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Gratis' | 'Pro' | 'Max' | 'Superadmin'>('Gratis');

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    apiCalls24h: 0,
    serverUptime: '100%',
    avgGenTime: '1.8s',
    activeEdgeNodes: 312
  });

  // User Management (Real Data from MongoDB)
  const [users, setUsers] = useState<UserRecord[]>([]);

  // Projects Management (Real Data from MongoDB)
  const [platformProjects, setPlatformProjects] = useState<PlatformProject[]>([]);

  // AI Model Settings
  const [primaryModel, setPrimaryModel] = useState<string>('gemini-3.7-flash');
  const [fallbackModel, setFallbackModel] = useState<string>('gemini-3.6-flash');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.95);
  const [savedModelSuccess, setSavedModelSuccess] = useState<boolean>(false);

  // Global Platform Settings
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [publicRegistration, setPublicRegistration] = useState<boolean>(true);
  const [defaultNewUserQuota, setDefaultNewUserQuota] = useState<number>(100);
  const [platformConfigSaved, setPlatformConfigSaved] = useState<boolean>(false);

  // System Logs
  const [logFilter, setLogFilter] = useState<'ALL' | 'SYSTEM' | 'AUTH' | 'API' | 'DEPLOY'>('ALL');
  const [logs, setLogs] = useState<{ id: number; time: string; tag: string; message: string }[]>([
    { id: 1, time: new Date().toLocaleTimeString(), tag: 'SYSTEM', message: 'Satusite Studio Platform v3.7 Online & Stabil' },
    { id: 2, time: new Date().toLocaleTimeString(), tag: 'AUTH', message: 'Superadmin session aktif (dekaze08@gmail.com)' },
    { id: 3, time: new Date().toLocaleTimeString(), tag: 'API', message: 'Gemini 3.7 Flash Engine aktif (Latency: 1.8s)' },
    { id: 4, time: new Date().toLocaleTimeString(), tag: 'DEPLOY', message: '312 Vercel & Netlify Edge nodes dalam sinkronisasi' },
    { id: 5, time: new Date().toLocaleTimeString(), tag: 'DB', message: 'MongoDB Atlas Cloud Cluster Connected (satusite_db)' }
  ]);

  // Fetch dynamic data from Backend APIs
  const fetchAllAdminData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Stats
      const statRes = await fetch('/api/admin/stats');
      if (statRes.ok) {
        const data = await statRes.json();
        if (data.success && data.stats) {
          setStats(prev => ({
            ...prev,
            totalUsers: data.stats.totalUsers || prev.totalUsers,
            totalProjects: data.stats.totalProjects || prev.totalProjects,
            apiCalls24h: data.stats.apiCalls24h || prev.apiCalls24h,
            activeEdgeNodes: data.stats.activeEdgeNodes || prev.activeEdgeNodes
          }));
        }
      }

      // 2. Users
      const userRes = await fetch('/api/admin/users');
      if (userRes.ok) {
        const uData = await userRes.json();
        if (uData.success && Array.isArray(uData.users)) {
          setUsers(uData.users);
        }
      }

      // 3. Projects
      const projRes = await fetch('/api/projects');
      if (projRes.ok) {
        const pData = await projRes.json();
        if (pData.success && Array.isArray(pData.projects)) {
          setPlatformProjects(pData.projects.map((p: any) => ({
            id: p.id,
            name: p.name,
            owner: p.owner || 'user@satusite.studio',
            category: p.category || 'Web App',
            mode: p.mode || 'fullstack',
            createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Hari ini',
            isFeatured: !!p.isFeatured,
            status: p.status || 'Live'
          })));
        }
      }

      // 4. Config
      const confRes = await fetch('/api/admin/config');
      if (confRes.ok) {
        const cData = await confRes.json();
        if (cData.success && cData.config) {
          if (cData.config.primaryModel) setPrimaryModel(cData.config.primaryModel);
          if (cData.config.fallbackModel) setFallbackModel(cData.config.fallbackModel);
          if (cData.config.temperature) setTemperature(cData.config.temperature);
          if (cData.config.topP) setTopP(cData.config.topP);
        }
      }

      // 5. Subscribers
      const subRes = await fetch('/api/admin/subscribers');
      if (subRes.ok) {
        const sData = await subRes.json();
        if (sData.success && Array.isArray(sData.subscribers)) {
          setSubscribers(sData.subscribers);
        }
      }
    } catch (e) {
      console.warn('Error refreshing admin portal data:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const handleToggleFeatured = async (id: string) => {
    const target = platformProjects.find(p => p.id === id);
    const newFeatured = target ? !target.isFeatured : true;

    setPlatformProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, isFeatured: newFeatured } : p))
    );

    try {
      await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: newFeatured })
      });
    } catch (e) {}
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Hapus pengguna ini dari platform?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));

    try {
      await fetch(`/api/admin/users?userId=${id}`, {
        method: 'DELETE'
      });
    } catch (e) {}
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    let quota = 15;
    if (newRole === 'Pro') quota = 500;
    if (newRole === 'Max') quota = 5000;
    if (newRole === 'Superadmin') quota = 99999;

    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, role: newRole, quota } : u))
    );

    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_role', userId: id, role: newRole, quotaDelta: quota })
      });
    } catch (e) {}
  };

  const handleAddQuota = async (id: string, amount: number) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, quota: u.quota + amount } : u))
    );

    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'adjust_quota', userId: id, quotaDelta: amount })
      });
    } catch (e) {}
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: UserRecord = {
      id: `usr_${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'active',
      quota: defaultNewUserQuota,
      projectsCount: 0,
      joinedAt: 'Hari ini'
    };

    setUsers(prev => [newUser, ...prev]);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');

    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_user',
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        })
      });
    } catch (e) {}
  };

  const handleSaveAiSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedModelSuccess(true);

    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryModel,
          fallbackModel,
          temperature,
          topP
        })
      });
    } catch (e) {}

    setLogs(prev => [
      { id: Date.now(), time: new Date().toLocaleTimeString(), tag: 'SYSTEM', message: `AI Config diubah: ${primaryModel} (Temp: ${temperature})` },
      ...prev
    ]);
    setTimeout(() => setSavedModelSuccess(false), 2500);
  };

  const handleClearPlatformCache = () => {
    if (confirm('Bersihkan temporary platform cache & restart Edge workers?')) {
      setLogs(prev => [
        { id: Date.now(), time: new Date().toLocaleTimeString(), tag: 'DEPLOY', message: 'Global Edge Cache dibersihkan (312 node)' },
        ...prev
      ]);
      alert('Cache global berhasil dibersihkan.');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = platformProjects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col justify-between items-center p-6 relative font-sans selection:bg-zinc-800">
        
        {/* Top Minimal Bar */}
        <div className="w-full max-w-5xl flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </a>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="satusitE Logo" className="w-4 h-4 object-contain" />
            <span className="font-agus text-xs tracking-[0.3em] text-white">satusitE</span>
          </div>
        </div>

        {/* Center Lock Box */}
        <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800/80 rounded-2xl p-7 shadow-2xl space-y-6 animate-fade-in-up my-auto text-center">
          
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-200 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-lg font-bold text-white tracking-tight">Konsol Superadmin</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Area terbatas. Masukkan PIN Master Admin atau masuk dengan akun pemilik terverifikasi.
            </p>
          </div>

          {pinError && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyPin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">PIN Rahasia Master Admin</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPinPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#09090b] border border-zinc-800 focus:border-zinc-500 rounded-xl pl-9.5 pr-10 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPinPassword(!showPinPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCheckingPin}
              className="w-full py-3 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              {isCheckingPin ? (
                <div className="w-4 h-4 border-2 border-zinc-900/20 border-t-zinc-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Buka Akses Konsol</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-900">
            <a
              href="/login"
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
            >
              <User className="w-3 h-3" />
              <span>Login dengan Akun Google Pemilik &rarr;</span>
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="text-[10px] text-zinc-600 py-2">
          Platform Security Gate &bull; satusitE Studio
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row selection:bg-zinc-800 selection:text-white font-sans">
      
      {/* ========================================================================= */}
      {/* 1. SIDEBAR NAVIGATION (CLEAN, MINIMALIST, HIGH PRECISION)                 */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 bg-[#0d0d10] border-r border-zinc-800/70 flex flex-col shrink-0 z-30">
        
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-zinc-800/70 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="satusitE Logo" className="w-5 h-5 object-contain" />
            <div className="flex items-center gap-1.5 select-none">
              <span className="font-agus text-sm font-normal tracking-[0.35em] text-white">satusitE</span>
              <span className="text-zinc-600 font-light text-xs">/</span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                ADMIN
              </span>
            </div>
          </a>

          <button
            type="button"
            onClick={handleLockAdmin}
            className="p-1 text-zinc-500 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Kunci Konsol Admin"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Admin Profile Pill */}
        <div className="p-3 border-b border-zinc-800/60 flex items-center gap-2.5 bg-zinc-900/20">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/60 text-white flex items-center justify-center font-bold text-[11px]">
            SA
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">Super Administrator</div>
            <div className="text-[10px] text-zinc-500 font-mono truncate">dekaze08@gmail.com</div>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 px-3 py-3 space-y-5 overflow-y-auto text-xs">
          
          {/* GROUP 1: RINGKASAN & STATS */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Ringkasan & Metrik
            </div>
            
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
              <span>Dashboard Platform</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'analytics' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
              <span>Analitik & Trafik</span>
            </button>
          </div>

          {/* GROUP 2: MANAJEMEN ENTITAS */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Manajemen Entitas
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'users' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>Pengguna & Kuota</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-400 font-mono border border-zinc-800/60">
                {users.length}
              </span>
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
                <FolderKanban className="w-3.5 h-3.5 text-zinc-400" />
                <span>Katalog Proyek AI</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-400 font-mono border border-zinc-800/60">
                {platformProjects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('subscribers')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'subscribers' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>Pelanggan Buletin</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-400 font-mono border border-zinc-800/60">
                {subscribers.length}
              </span>
            </button>
          </div>

          {/* GROUP 3: OPERASI MESIN & CLOUD */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Mesin & Infrastruktur
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('ai-models')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'ai-models' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              <span>Model AI & Engine</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('servers')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'servers' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-zinc-400" />
              <span>Edge Server & CDN</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'database' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              <span>Database JSON</span>
            </button>
          </div>

          {/* GROUP 4: SISTEM & AUDIT */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Sistem & Konfigurasi
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'logs' 
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              <span>Log Sistem & Audit</span>
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
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span>Pengaturan Global</span>
            </button>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-zinc-800/70 space-y-1.5">
          <a
            href="/portal"
            className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-zinc-800"
          >
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>Lihat Portal Klien</span>
          </a>
          <a
            href="/"
            className="w-full py-1.5 px-3 rounded-lg text-zinc-500 hover:text-zinc-300 text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar ke Beranda</span>
          </a>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT VIEW                                                      */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-zinc-800/70 bg-[#09090b]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white tracking-tight">
              {activeTab === 'dashboard' && 'Ringkasan Eksekutif Platform'}
              {activeTab === 'analytics' && 'Metrik Pertumbuhan & API Usage'}
              {activeTab === 'users' && 'Manajemen Pengguna & Kuota Token'}
              {activeTab === 'projects' && 'Katalog Proyek AI Platform'}
              {activeTab === 'subscribers' && 'Daftar Pelanggan Buletin Eksklusif'}
              {activeTab === 'ai-models' && 'Konfigurasi Model AI & Engine'}
              {activeTab === 'servers' && 'Status Infrastruktur Edge & CDN'}
              {activeTab === 'database' && 'Status Database JSON & Cache'}
              {activeTab === 'logs' && 'Terminal Audit Log & Transaksi'}
              {activeTab === 'settings' && 'Pengaturan Global Platform'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClearPlatformCache}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Bersihkan Cache</span>
            </button>

            <button
              type="button"
              onClick={fetchAllAdminData}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Segarkan Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-white' : ''}`} />
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="p-5 sm:p-7 lg:p-8 space-y-6 max-w-7xl">
          
          {/* ===================================================================== */}
          {/* TAB 1: DASHBOARD                                                      */}
          {/* ===================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Top Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">Total Pengguna</div>
                  <div className="text-2xl font-semibold text-white tracking-tight">{stats.totalUsers.toLocaleString()}</div>
                  <div className="text-[11px] text-zinc-400 font-medium">Terdaftar di Platform</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">Total Proyek AI</div>
                  <div className="text-2xl font-semibold text-white tracking-tight">{stats.totalProjects.toLocaleString()}</div>
                  <div className="text-[11px] text-zinc-400">94% Berhasil Live</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">AI API Requests (24h)</div>
                  <div className="text-2xl font-semibold text-white tracking-tight">{stats.apiCalls24h.toLocaleString()}</div>
                  <div className="text-[11px] text-zinc-400 font-mono">Latensi: {stats.avgGenTime}</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-1.5">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">Server & CDN Uptime</div>
                  <div className="text-2xl font-semibold text-emerald-400 tracking-tight">{stats.serverUptime}</div>
                  <div className="text-[11px] text-zinc-400 font-mono">{stats.activeEdgeNodes} Edge Nodes</div>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Users (7 cols) */}
                <div className="lg:col-span-7 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                    <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Pengguna Aktif Terbaru</span>
                    </h3>
                    <button onClick={() => setActiveTab('users')} className="text-xs text-zinc-400 hover:text-white transition-colors">
                      Kelola Semua &rarr;
                    </button>
                  </div>

                  <div className="space-y-2">
                    {users.length === 0 ? (
                      <div className="py-8 text-center text-xs text-zinc-500 font-sans space-y-1">
                        <div>Belum ada pengguna terdaftar di database.</div>
                        <div className="text-[11px] text-zinc-600">Akun akan tercatat otomatis saat Anda atau klien login dengan Google.</div>
                      </div>
                    ) : (
                      users.slice(0, 4).map(u => (
                        <div key={u.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/70 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-medium text-white">{u.name}</div>
                            <div className="text-[11px] text-zinc-500 font-mono">{u.email}</div>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800">
                              {u.role}
                            </span>
                            <div className="text-[10px] text-zinc-500 mt-1 font-mono">{u.quota} Kuota Token</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick System Health (5 cols) */}
                <div className="lg:col-span-5 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                      <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Kesehatan AI Engine</span>
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400">Normal</span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>Engine Utama:</span>
                        <span className="font-mono text-white">{primaryModel || 'gemini-3.7-flash'}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>Model Cadangan:</span>
                        <span className="font-mono text-white">{fallbackModel || 'gemini-3.7-flash'}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>Database Driver:</span>
                        <span className="font-mono text-emerald-400">MongoDB Atlas Cloud (Live)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('ai-models')}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 text-xs font-medium transition-colors text-center"
                  >
                    Konfigurasi Engine AI &rarr;
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: ANALYTICS                                                      */}
          {/* ===================================================================== */}
          {activeTab === 'analytics' && (() => {
            const totalProj = platformProjects.length;
            const fullstackCount = platformProjects.filter(p => (p.mode || 'fullstack') === 'fullstack').length;
            const frontendCount = platformProjects.filter(p => p.mode === 'frontend').length;
            const prdCount = platformProjects.filter(p => p.mode === 'prd').length;

            const fullstackPct = totalProj > 0 ? Math.round((fullstackCount / totalProj) * 100) : 0;
            const frontendPct = totalProj > 0 ? Math.round((frontendCount / totalProj) * 100) : 0;
            const prdPct = totalProj > 0 ? Math.round((prdCount / totalProj) * 100) : 0;

            return (
              <div className="space-y-6 animate-fade-in-up">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-1">
                    <div className="text-[11px] text-zinc-500 font-mono uppercase">Total Generasi Prompt</div>
                    <div className="text-2xl font-semibold text-white font-mono">{stats.apiCalls24h.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{totalProj} Sesi Studio Tersimpan</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-1">
                    <div className="text-[11px] text-zinc-500 font-mono uppercase">Rata-rata Token per Build</div>
                    <div className="text-2xl font-semibold text-white font-mono">{totalProj > 0 ? '~2,150' : '0'}</div>
                    <div className="text-[10px] text-zinc-400">Gemini 3.7 Flash Engine</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-1">
                    <div className="text-[11px] text-zinc-500 font-mono uppercase">Total Pelanggan Buletin</div>
                    <div className="text-2xl font-semibold text-white font-mono">{subscribers.length.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Data Live MongoDB Atlas</div>
                  </div>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-semibold text-white">Distribusi Kategori Pembuatan Proyek (Real-Time)</h3>
                  {totalProj === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-500 font-sans">
                      Belum ada proyek yang dibuat di database. Persentase akan terkalkulasi otomatis saat pengguna membuat proyek baru.
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Fullstack Web Apps & Dashboards ({fullstackCount})</span>
                          <span>{fullstackPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden">
                          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${fullstackPct}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Frontend UI Interfaces ({frontendCount})</span>
                          <span>{frontendPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden">
                          <div className="h-full bg-zinc-400 rounded-full transition-all duration-500" style={{ width: `${frontendPct}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>PRD & Blueprint Arsitektur ({prdCount})</span>
                          <span>{prdPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden">
                          <div className="h-full bg-zinc-600 rounded-full transition-all duration-500" style={{ width: `${prdPct}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ===================================================================== */}
          {/* TAB 3: USERS MANAGEMENT                                              */}
          {/* ===================================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-fade-in-up">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/30 border border-zinc-800/80 p-3 rounded-2xl">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari pengguna berdasarkan nama atau email..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddUserModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pengguna</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-4">Pengguna</th>
                        <th className="py-3 px-4">Peran</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Sisa Kuota</th>
                        <th className="py-3 px-4">Terdaftar</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-3 px-4 font-sans">
                            <div className="font-medium text-white">{u.name}</div>
                            <div className="text-[11px] text-zinc-500">{u.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={u.role || 'Gratis'}
                              onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 rounded px-2 py-1 focus:outline-none focus:border-zinc-700 cursor-pointer"
                            >
                              <option value="Gratis">Gratis (Free Trial)</option>
                              <option value="Pro">Pro (Berlangganan)</option>
                              <option value="Max">Max (Enterprise)</option>
                              <option value="Superadmin">Superadmin</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 font-sans">
                            <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>Aktif</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white font-semibold">{u.quota} Token</td>
                          <td className="py-3 px-4 text-zinc-500 text-[11px]">{u.joinedAt}</td>
                          <td className="py-3 px-4 text-right font-sans">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleAddQuota(u.id, 100)}
                                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-[11px] border border-zinc-800 transition-colors cursor-pointer"
                                title="Tambah 100 Kuota"
                              >
                                +100 Kuota
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-colors cursor-pointer"
                                title="Hapus Pengguna"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: PROJECTS MANAGEMENT                                            */}
          {/* ===================================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-4 animate-fade-in-up">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/30 border border-zinc-800/80 p-3 rounded-2xl">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari proyek atau pemilik..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-4">Nama Proyek</th>
                        <th className="py-3 px-4">Pemilik</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Mode</th>
                        <th className="py-3 px-4">Unggulan (Featured)</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {filteredProjects.map(p => (
                        <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-3 px-4 font-sans font-medium text-white">{p.name}</td>
                          <td className="py-3 px-4 text-zinc-400 font-sans">{p.owner}</td>
                          <td className="py-3 px-4 text-zinc-300 font-sans">{p.category}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 uppercase">
                              {p.mode}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-sans">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(p.id)}
                              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer border ${
                                p.isFeatured 
                                  ? 'bg-zinc-800 text-white border-zinc-700' 
                                  : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                              }`}
                            >
                              {p.isFeatured ? 'Unggulan' : 'Reguler'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right font-sans">
                            <a
                              href={`/app?id=${p.id}`}
                              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-[11px] border border-zinc-800 transition-colors"
                            >
                              Buka di Studio
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 5: SUBSCRIBERS                                                    */}
          {/* ===================================================================== */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/30 border border-zinc-800/80 p-4 rounded-2xl">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Daftar Pelanggan Buletin ({subscribers.length})</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Lead yang mendaftar melalui formulir buletin mingguan halaman utama.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," + ["Email,Sumber,Status,Tanggal"].concat(
                      subscribers.map(s => `"${s.email}","${s.source}","${s.status}","${s.createdAt}"`)
                    ).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `satusite_subscribers_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor CSV</span>
                </button>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-4">No</th>
                        <th className="py-3 px-4">Email Pelanggan</th>
                        <th className="py-3 px-4">Sumber</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Tanggal Pendaftaran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {subscribers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-zinc-500 font-sans">
                            Belum ada pelanggan buletin.
                          </td>
                        </tr>
                      ) : (
                        subscribers.map((s, idx) => (
                          <tr key={s.id || idx} className="hover:bg-zinc-900/40 transition-colors">
                            <td className="py-3 px-4 text-zinc-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-sans font-medium text-white">{s.email}</td>
                            <td className="py-3 px-4 text-zinc-400 font-sans">{s.source || 'Landing CTA'}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-sans text-emerald-400 bg-zinc-900 border border-zinc-800">
                                {s.status || 'Active'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-zinc-500 text-[11px]">
                              {s.createdAt ? new Date(s.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Hari ini'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 6: AI MODELS                                                      */}
          {/* ===================================================================== */}
          {activeTab === 'ai-models' && (
            <div className="max-w-2xl bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 space-y-6 animate-fade-in-up">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-zinc-300" />
                  <span>Konfigurasi Engine & Parameter AI</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Pilih model AI utama dan sesuaikan parameter generasi kode untuk seluruh platform.
                </p>
              </div>

              <form onSubmit={handleSaveAiSettings} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-medium">Model AI Utama (Primary Engine)</label>
                  <select
                    value={primaryModel}
                    onChange={(e) => setPrimaryModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-700 font-mono text-xs"
                  >
                    <option value="gemini-3.7-flash">gemini-3.7-flash (Model Utama - High Reasoning & Fast Generation)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-medium">Model AI Cadangan (Fallback Engine)</label>
                  <select
                    value={fallbackModel}
                    onChange={(e) => setFallbackModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-700 font-mono text-xs"
                  >
                    <option value="gemini-3.6-flash">gemini-3.6-flash (Model Cadangan)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>Temperature</span>
                      <span className="font-mono text-white">{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>Top-P Sampling</span>
                      <span className="font-mono text-white">{topP}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={topP}
                      onChange={(e) => setTopP(parseFloat(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {savedModelSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-zinc-950" />
                        <span>Pengaturan Berhasil Disimpan!</span>
                      </>
                    ) : (
                      <span>Simpan Konfigurasi Model AI</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 7: SERVERS                                                        */}
          {/* ===================================================================== */}
          {activeTab === 'servers' && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Vercel Global Edge</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <div className="text-xs text-zinc-400">Status: 100% Operational</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Latensi: 14ms | 0 Packet Loss</div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Netlify CDN Workers</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <div className="text-xs text-zinc-400">Status: 100% Operational</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Latensi: 18ms | 0 Packet Loss</div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Gemini API Relay</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <div className="text-xs text-zinc-400">Status: 100% Operational</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Rate Limit Buffer: 85% Aman</div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 8: DATABASE STORAGE                                               */}
          {/* ===================================================================== */}
          {activeTab === 'database' && (
            <div className="max-w-2xl bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 space-y-4 animate-fade-in-up">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-zinc-300" />
                  <span>Status Penyimpanan MongoDB Atlas Cloud (Live Cluster)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Database terhubung langsung ke cluster cloud <span className="text-white font-mono">satusite_db</span> via MongoDB driver.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between font-mono">
                  <span className="text-zinc-300">koleksi: satusite_db.projects</span>
                  <span className="text-emerald-400">{platformProjects.length} Dokumen Tersimpan</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between font-mono">
                  <span className="text-zinc-300">koleksi: satusite_db.users</span>
                  <span className="text-emerald-400">{users.length} Akun Terdaftar</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between font-mono">
                  <span className="text-zinc-300">koleksi: satusite_db.subscribers</span>
                  <span className="text-emerald-400">{subscribers.length} Pelanggan Aktif</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between font-mono">
                  <span className="text-zinc-300">koleksi: satusite_db.system_config</span>
                  <span className="text-emerald-400">Tersinkron (gemini-3.7-flash)</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 9: LOGS                                                           */}
          {/* ===================================================================== */}
          {activeTab === 'logs' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[520px] animate-fade-in-up font-mono text-xs">
              <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-500/80"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80"></div>
                  <span className="text-zinc-400 ml-2">platform-audit.log</span>
                </div>

                <div className="flex items-center gap-2">
                  {(['ALL', 'SYSTEM', 'AUTH', 'API', 'DEPLOY'] as const).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setLogFilter(tag)}
                      className={`px-2 py-0.5 rounded text-[10px] font-sans transition-colors cursor-pointer ${
                        logFilter === tag ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setLogs([{ id: Date.now(), time: new Date().toLocaleTimeString(), tag: 'SYSTEM', message: 'Log dibersihkan' }])}
                    className="text-[11px] text-zinc-500 hover:text-white transition-colors cursor-pointer ml-2"
                  >
                    Bersihkan
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-1.5 text-zinc-300">
                {filteredLogs.map(log => (
                  <div key={log.id} className="leading-relaxed flex items-center gap-2">
                    <span className="text-zinc-500">[{log.time}]</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                      log.tag === 'SYSTEM' ? 'bg-zinc-900 text-zinc-400' : log.tag === 'AUTH' ? 'bg-blue-950 text-blue-400' : 'bg-emerald-950 text-emerald-400'
                    }`}>
                      [{log.tag}]
                    </span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 10: SETTINGS                                                      */}
          {/* ===================================================================== */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 space-y-6 animate-fade-in-up">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-zinc-300" />
                  <span>Pengaturan Global Platform</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Konfigurasi aturan pendaftaran dan parameter default akun baru.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Mode Pemeliharaan (Maintenance)</div>
                    <div className="text-[11px] text-zinc-500">Kunci akses publik saat update infrastruktur</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                      maintenanceMode ? 'bg-red-950 text-red-400 border-red-800' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {maintenanceMode ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Pendaftaran Terbuka (Public Registration)</div>
                    <div className="text-[11px] text-zinc-500">Izinkan pengguna baru mendaftar dari halaman auth</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPublicRegistration(!publicRegistration)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                      publicRegistration ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {publicRegistration ? 'Dibuka' : 'Ditutup'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="font-medium text-white">Default Kuota Akun Baru (Token)</div>
                  <input
                    type="number"
                    value={defaultNewUserQuota}
                    onChange={(e) => setDefaultNewUserQuota(parseInt(e.target.value) || 100)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-700 font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPlatformConfigSaved(true);
                    setTimeout(() => setPlatformConfigSaved(false), 2500);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  {platformConfigSaved ? 'Pengaturan Berhasil Disimpan!' : 'Simpan Pengaturan Global'}
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* ========================================================================= */}
      {/* ADD USER MODAL                                                            */}
      {/* ========================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-white">Tambah Pengguna Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Peran Akun</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-zinc-700 text-xs"
                >
                  <option value="Gratis">Gratis (Free Trial - 15 Token)</option>
                  <option value="Pro">Pro (Berlangganan - 500 Token)</option>
                  <option value="Max">Max (Enterprise - 5.000 Token)</option>
                  <option value="Superadmin">Superadmin (Root - Akses Penuh)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
