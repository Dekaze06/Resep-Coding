import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Zap,
  Edit2
} from 'lucide-react';

export default function AuthPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleContinueEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !email.includes('@')) {
      setErrorMsg('Harap masukkan alamat email yang valid.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 300);
  };

  const handleLoginPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!password) {
      setErrorMsg('Harap masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        name: email.split('@')[0] || 'Klien SatuSite',
        email,
        plan: 'Pro Creator',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}&backgroundColor=27272a`,
        loggedInAt: new Date().toISOString(),
        quotaRemaining: 48,
        totalProjects: 3
      };

      try {
        localStorage.setItem('satusite_auth_user', JSON.stringify(userData));
      } catch (err) {
        console.error(err);
      }

      setSuccessMsg('Login berhasil! Mengalihkan...');
      setTimeout(() => {
        window.location.href = '/portal';
      }, 700);
    }, 700);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setSuccessMsg('Menghubungkan dengan Google...');
    setTimeout(() => {
      const googleUser = {
        name: 'Google User',
        email: 'user.google@satusite.studio',
        plan: 'Enterprise Pro',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GoogleUser&backgroundColor=27272a',
        loggedInAt: new Date().toISOString(),
        quotaRemaining: 50,
        totalProjects: 4
      };

      try {
        localStorage.setItem('satusite_auth_user', JSON.stringify(googleUser));
      } catch (err) {
        console.error(err);
      }

      window.location.href = '/portal';
    }, 800);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setSuccessMsg('Mengakses Portal Klien...');
    setTimeout(() => {
      const demoUser = {
        name: 'Demo Client',
        email: 'demo@satusite.studio',
        plan: 'Enterprise Pro',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DemoClient&backgroundColor=27272a',
        loggedInAt: new Date().toISOString(),
        quotaRemaining: 50,
        totalProjects: 4
      };

      try {
        localStorage.setItem('satusite_auth_user', JSON.stringify(demoUser));
      } catch (err) {
        console.error(err);
      }

      window.location.href = '/portal';
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col justify-between relative selection:bg-zinc-800 selection:text-white overflow-hidden font-sans">
      
      {/* Subtle Monochrome Ambient Glow */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-zinc-800/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Top Bar Header */}
      <header className="relative z-20 px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Beranda</span>
        </a>

        {/* Brand Mark */}
        <a href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="satusitE Logo" className="w-5 h-5 object-contain" />
          <span className="font-agus text-sm font-normal tracking-[0.35em] text-white">satusitE</span>
        </a>

        <div className="w-20 flex justify-end">
          <a href="/app" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
            Studio &rarr;
          </a>
        </div>
      </header>

      {/* Main Form Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[380px] bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl space-y-6 animate-fade-in-up">
          
          {/* Header Title */}
          <div className="text-center space-y-1.5">
            <h1 className="text-xl font-bold tracking-tight text-white">
              {step === 1 ? 'Masuk ke Akun' : 'Masukkan Kata Sandi'}
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {step === 1 
                ? 'Ketik email Anda untuk melanjutkan ke Portal Klien.' 
                : 'Lengkapi kata sandi untuk mengakses proyek Anda.'}
            </p>
          </div>

          {/* Error & Success Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: EMAIL INPUT */}
          {step === 1 && (
            <form onSubmit={handleContinueEmail} className="space-y-4 text-left animate-fade-in-up">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-400">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    className="w-full bg-[#09090b] border border-zinc-800 focus:border-zinc-500 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] border border-blue-900/60 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-950/40"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Lanjutkan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: PASSWORD INPUT (Shown after email is entered) */}
          {step === 2 && (
            <form onSubmit={handleLoginPassword} className="space-y-4 text-left animate-fade-in-up">
              {/* Selected Email Pill with Edit Action */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="text-zinc-200 truncate font-medium">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(1); setErrorMsg(''); }}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors ml-2 shrink-0 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Ubah</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-zinc-400">Kata Sandi</label>
                  <button 
                    type="button" 
                    onClick={() => alert('Fitur pemulihan sandi dapat menggunakan akses 1-Click Demo Login.')}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#09090b] border border-zinc-800 focus:border-zinc-500 rounded-xl pl-9.5 pr-10 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] border border-blue-900/60 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-950/40"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Masuk ke Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-zinc-800/80"></div>
            <span className="bg-[#121215] px-3 text-[10px] uppercase font-medium text-zinc-500 tracking-wider">
              atau
            </span>
          </div>

          {/* Google Login Button */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              {/* Clean Google SVG Icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#888888" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#888888" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#888888" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#888888" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Login dengan Google</span>
            </button>

            {/* 1-Click Demo Client */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2 px-3 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-zinc-500" />
              <span>Akses Demo 1-Click</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 py-4 px-6 text-center text-[11px] text-zinc-600 border-t border-zinc-900">
        <p>&copy; {new Date().getFullYear()} satusitE Studio. Platform Pembuat Aplikasi AI Otonom.</p>
      </footer>

    </div>
  );
}
