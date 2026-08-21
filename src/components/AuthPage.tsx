import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  FolderLock
} from 'lucide-react';
import PlasmaBackground from './ui/PlasmaBackground';

declare global {
  interface Window {
    google?: any;
  }
}

interface AuthPageProps {
  googleClientId?: string;
}

const SHOWCASE_SLIDES = [
  {
    phase: "Fase 01 - Konseptualisasi",
    step: "01 / 04",
    title: "Evolusi Prompt ke Arsitektur",
    desc: "Tulis ide dan kebutuhan sistem dalam bahasa natural. AI menganalisis kebutuhan fungsional dan merancang skema instan.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  },
  {
    phase: "Fase 02 - Desain Visual UI/UX",
    step: "02 / 04",
    title: "Rancang Antarmuka Responsif",
    desc: "Desain visual modern, layout adaptif multi-perangkat, dan micro-interaction yang presisi serta intuitif.",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
  },
  {
    phase: "Fase 03 - Logika Fullstack",
    step: "03 / 04",
    title: "Integrasi Database & CRUD",
    desc: "Otomasi sistem backend, manipulasi data dinamis, otentikasi aman, dan dashboard admin terpadu.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  },
  {
    phase: "Fase 04 - Siap Produksi",
    step: "04 / 04",
    title: "Ekspor Kode Bersih & Deploy",
    desc: "Hasilkan source code murni berkualitas tinggi tanpa batasan vendor, siap deploy dalam hitungan detik.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
  },
];

export default function AuthPage({ googleClientId }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isAlreadyAuthed, setIsAlreadyAuthed] = useState(false);
  const [hasGoogleNativeButton, setHasGoogleNativeButton] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  // Auto-slide showcase images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const effectiveClientId = googleClientId || 
    (typeof process !== 'undefined' ? process.env?.PUBLIC_GOOGLE_CLIENT_ID : undefined) ||
    '392320873628-8ndje66v8i2t5svo36985atrope592q5.apps.googleusercontent.com';

  const getRedirectUrl = useCallback(() => {
    return "/";
  }, []);

  // If already authenticated, redirect immediately
  useEffect(() => {
    try {
      const existing = localStorage.getItem('satusite_auth_user');
      if (existing) {
        setIsAlreadyAuthed(true);
        const parsed = JSON.parse(existing);
        setSuccessMsg(`Anda sudah masuk sebagai ${parsed.name || 'Pengguna'}. Mengalihkan...`);
        const target = getRedirectUrl();
        window.location.replace(target);
      }
    } catch (e) {}
  }, [getRedirectUrl]);

  // Handle Google auth success - stable callback for GIS
  const handleGoogleAuthSuccess = useCallback(async (credential: string) => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('Memverifikasi akun Google...');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        localStorage.setItem('satusite_auth_user', JSON.stringify(data.user));
        localStorage.setItem('satusite_auth_token', data.token);
        setSuccessMsg(`Selamat datang, ${data.user.name}! Mengalihkan ke Beranda...`);
        const target = getRedirectUrl();
        setTimeout(() => { window.location.replace(target); }, 300);
        return;
      } else {
        setErrorMsg(data.error || 'Gagal login dengan akun Google.');
        setSuccessMsg('');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menghubungkan ke Google.');
      setSuccessMsg('');
      setIsLoading(false);
    }
  }, [getRedirectUrl]);

  // Initialize Google Identity Services
  useEffect(() => {
    const initGoogleAuth = () => {
      if (window.google?.accounts?.id && effectiveClientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: effectiveClientId,
            callback: (response: any) => {
              if (response && response.credential) {
                handleGoogleAuthSuccess(response.credential);
              } else {
                setErrorMsg('Login Google dibatalkan atau tidak berhasil. Silakan coba lagi.');
                setSuccessMsg('');
                setIsLoading(false);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true
          });

          if (googleBtnContainerRef.current) {
            window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
              theme: 'filled_black',
              size: 'large',
              width: 320,
              text: 'continue_with',
              shape: 'pill'
            });
            setHasGoogleNativeButton(true);
          }
        } catch (e) {
          console.warn('[Google GIS] Init error:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleAuth();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogleAuth();
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [effectiveClientId, handleGoogleAuthSuccess]);

  // Google OAuth 2.0 Popup Token Client
  const handlePromptGoogleOAuth = () => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('Membuka autentikasi Google...');

    try {
      if (window.google?.accounts?.oauth2) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: effectiveClientId,
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              setSuccessMsg('Memverifikasi akun Google...');
              try {
                const res = await fetch('/api/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ accessToken: tokenResponse.access_token })
                });

                const data = await res.json();
                if (res.ok && data.success && data.user) {
                  localStorage.setItem('satusite_auth_user', JSON.stringify(data.user));
                  localStorage.setItem('satusite_auth_token', data.token);
                  setSuccessMsg(`Selamat datang, ${data.user.name}! Mengalihkan ke Beranda...`);
                  const target = getRedirectUrl();
                  setTimeout(() => { window.location.replace(target); }, 300);
                  return;
                } else {
                  setErrorMsg(data.error || 'Gagal memproses login Google.');
                  setSuccessMsg('');
                  setIsLoading(false);
                  return;
                }
              } catch (e: any) {
                console.warn('OAuth fetch error:', e);
                setErrorMsg(e.message || 'Gagal menghubungkan ke server.');
                setSuccessMsg('');
                setIsLoading(false);
                return;
              }
            }
            setIsLoading(false);
            setSuccessMsg('');
            setErrorMsg('Izin Google dibatalkan atau tidak lengkap.');
          },
          error_callback: (err: any) => {
            console.warn('Google OAuth error:', err);
            setIsLoading(false);
            setSuccessMsg('');
            fallbackGoogleDirectPrompt();
          }
        });

        client.requestAccessToken();
      } else if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setIsLoading(false);
            setSuccessMsg('');
            fallbackGoogleDirectPrompt();
          }
        });
      } else {
        fallbackGoogleDirectPrompt();
      }
    } catch (err: any) {
      console.warn('Google prompt exception:', err);
      setIsLoading(false);
      setSuccessMsg('');
      fallbackGoogleDirectPrompt();
    }
  };

  const fallbackGoogleDirectPrompt = async () => {
    const userPrompt = prompt("Masukkan alamat email akun Google Anda:");
    if (!userPrompt || !userPrompt.includes("@")) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSuccessMsg("Menghubungkan akun Google...");
    try {
      const nameGuess = userPrompt.split("@")[0].replace(/[._-]/g, ' ');
      const formattedName = nameGuess.charAt(0).toUpperCase() + nameGuess.slice(1);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInfo: {
            email: userPrompt.toLowerCase().trim(),
            name: formattedName,
            picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=27272a`
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        localStorage.setItem('satusite_auth_user', JSON.stringify(data.user));
        localStorage.setItem('satusite_auth_token', data.token);
        setSuccessMsg(`Login berhasil sebagai ${data.user.name}! Mengalihkan ke Beranda...`);
        const target = getRedirectUrl();
        window.location.replace(target);
        return;
      } else {
        setErrorMsg(data.error || 'Gagal masuk akun Google.');
        setIsLoading(false);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Gagal menghubungkan akun.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col justify-between relative selection:bg-zinc-800 selection:text-white overflow-hidden font-sans">
      <PlasmaBackground />
      
      {/* Top Bar Header */}
      <header className="relative z-20 px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Beranda</span>
        </a>

        <div className="w-20 flex justify-end">
          <a href="/studio" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
            Studio &rarr;
          </a>
        </div>
      </header>

      {/* Main Form & Image Split Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-4xl bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/80 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-fade-in-up">
          
          {/* LEFT: Kotak Gambar Showcase Auto-Slide (Menempel di samping form) */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-6 relative overflow-hidden flex-col justify-between p-6 lg:p-8 min-h-[480px] select-none">
            {/* Background Multi-Image Carousel with Crossfade */}
            {SHOWCASE_SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                    idx === currentSlide ? 'scale-100' : 'scale-110'
                  }`}
                />
              </div>
            ))}

            {/* Gradient Overlay for Sleek Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/45 to-black/30 pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-950/60 pointer-events-none z-10" />

            {/* Top Tag Badge */}
            <div className="relative z-20 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[11px] font-mono text-zinc-200 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse"></span>
                <span>{SHOWCASE_SLIDES[currentSlide].phase}</span>
              </div>
            </div>

            {/* Middle/Right Vertical Slide Navigation Dots */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 p-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
              {SHOWCASE_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentSlide
                      ? 'w-1.5 h-4 bg-white'
                      : 'w-1.5 h-1.5 bg-zinc-500/60 hover:bg-zinc-300'
                  }`}
                  title={`Slide ${idx + 1}`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Bottom Caption & Highlights with Dynamic Content */}
            <div className="relative z-20 space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-zinc-300">
                <span className="font-bold text-white">{SHOWCASE_SLIDES[currentSlide].step}</span>
                <span className="text-zinc-500">|</span>
                <span>Studio AI Otonom</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold tracking-tight text-white leading-snug transition-all">
                {SHOWCASE_SLIDES[currentSlide].title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-sm transition-all min-h-[36px]">
                {SHOWCASE_SLIDES[currentSlide].desc}
              </p>
            </div>
          </div>

          {/* RIGHT: Kotak Login Google Eksklusif */}
          <div className="col-span-1 md:col-span-7 lg:col-span-6 p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-6 md:border-l border-zinc-800/80">
            {isAlreadyAuthed ? (
              <div className="space-y-6 text-center animate-fade-in-up py-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-300">
                  <Loader2 className="w-7 h-7 animate-spin text-white" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">
                    Sesi Aktif Ditemukan
                  </h1>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {successMsg || 'Mengalihkan Anda ke Beranda...'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in-up text-left">
                
                {/* Brand Logo inside Form Card */}
                <div className="flex items-center gap-2.5">
                  <a href="/" className="flex items-center gap-2.5 group">
                    <img
                      src="/logo.png"
                      alt="satusitE Logo"
                      className="w-6 h-6 object-contain transition-transform group-hover:scale-105"
                    />
                    <span className="font-agus text-sm sm:text-base font-normal tracking-[0.35em] text-white">
                      SATUSITE
                    </span>
                  </a>
                </div>

                {/* Header Text */}
                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                    Portal Akses Klien
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Masuk secara instan menggunakan akun Google untuk mengakses seluruh studio AI dan workspace proyek Anda.
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

                {/* Google Sign-In Section */}
                <div className="space-y-3 pt-1">
                  <div ref={googleBtnContainerRef} className={`flex justify-center w-full min-h-[44px] ${hasGoogleNativeButton ? 'block' : 'hidden'}`}></div>
                  
                  {!hasGoogleNativeButton && (
                    <button
                      type="button"
                      onClick={handlePromptGoogleOAuth}
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-white/5"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Memverifikasi Akun...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#000000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#000000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#000000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#000000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                          <span>Lanjutkan dengan Akun Google</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Features list */}
                <div className="pt-2 border-t border-zinc-900 space-y-2 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Otentikasi aman & terenkripsi oleh Google Identity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>1-Klik akses ke Studio PRD, Frontend & Fullstack</span>
                  </div>
                </div>

              </div>
            )}
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
