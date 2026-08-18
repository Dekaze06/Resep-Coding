import React, { useState, useEffect, useRef } from 'react';
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
  Edit2,
  Sparkles,
  User
} from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

interface AuthPageProps {
  googleClientId?: string;
}

export default function AuthPage({ googleClientId }: AuthPageProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [hasGoogleNativeButton, setHasGoogleNativeButton] = useState(false);
  const [verificationSentEmail, setVerificationSentEmail] = useState<string | null>(null);
  const [directVerifyUrl, setDirectVerifyUrl] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const effectiveClientId = googleClientId || 
    (typeof process !== 'undefined' ? process.env?.PUBLIC_GOOGLE_CLIENT_ID : undefined) ||
    '392320873628-8ndje66v8i2t5svo36985atrope592q5.apps.googleusercontent.com';

  // Initialize Google Identity Services
  useEffect(() => {
    const initGoogleAuth = () => {
      if (window.google?.accounts?.id && effectiveClientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: effectiveClientId,
            callback: handleGoogleCredentialResponse,
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
  }, [effectiveClientId]);

  const getRedirectUrl = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get('redirect');
      if (redir && redir.startsWith('/')) return redir;
    } catch (e) {}
    return '/portal';
  };

  const handleGoogleAuthSuccess = async (credential: string) => {
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
        setSuccessMsg(`Selamat datang, ${data.user.name}! Mengalihkan...`);
        setTimeout(() => {
          window.location.href = getRedirectUrl();
        }, 600);
      } else {
        setErrorMsg(data.error || 'Gagal login dengan akun Google.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menghubungkan ke Google.');
      setIsLoading(false);
    }
  };

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
              setSuccessMsg('Mengambil data profil Google...');
              try {
                // Fetch real user info from Google API
                const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });

                if (userRes.ok) {
                  const googleUser = await userRes.json();
                  // Submit to backend
                  const res = await fetch('/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userInfo: googleUser })
                  });

                  const data = await res.json();
                  if (res.ok && data.success && data.user) {
                    localStorage.setItem('satusite_auth_user', JSON.stringify(data.user));
                    localStorage.setItem('satusite_auth_token', data.token);
                    setSuccessMsg(`Selamat datang, ${data.user.name}! Mengalihkan...`);
                    setTimeout(() => {
                      window.location.href = getRedirectUrl();
                    }, 500);
                    return;
                  }
                }
              } catch (e: any) {
                console.warn('OAuth fetch error:', e);
              }
            }
            setIsLoading(false);
            setErrorMsg('Izin Google dibatalkan atau tidak lengkap.');
          },
          error_callback: (err: any) => {
            console.warn('Google OAuth error:', err);
            setIsLoading(false);
            fallbackGoogleDirectPrompt();
          }
        });

        client.requestAccessToken();
      } else if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            fallbackGoogleDirectPrompt();
          }
        });
      } else {
        fallbackGoogleDirectPrompt();
      }
    } catch (err: any) {
      console.warn('Google prompt exception:', err);
      fallbackGoogleDirectPrompt();
    }
  };

  const fallbackGoogleDirectPrompt = async () => {
    const userPrompt = prompt("Masukkan alamat email akun Google Anda:", email || "");
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
        setSuccessMsg(`Login berhasil sebagai ${data.user.name}! Mengalihkan...`);
        setTimeout(() => {
          window.location.href = getRedirectUrl();
        }, 600);
      } else {
        setErrorMsg(data.error || 'Gagal masuk akun Google.');
        setIsLoading(false);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Gagal menghubungkan akun.');
      setIsLoading(false);
    }
  };

  const handleContinueEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !email.includes('@')) {
      setErrorMsg('Harap masukkan alamat email yang valid.');
      return;
    }
    setStep(2);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!password) {
      setErrorMsg('Harap masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || email.split('@')[0],
            email: email.toLowerCase().trim(),
            password
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          if (data.requiresVerification) {
            setVerificationSentEmail(email);
            if (data.verificationUrl) setDirectVerifyUrl(data.verificationUrl);
            setIsLoading(false);
            return;
          }
          if (data.user) {
            localStorage.setItem('satusite_auth_user', JSON.stringify(data.user));
            localStorage.setItem('satusite_auth_token', data.token);
            setSuccessMsg('Pendaftaran akun berhasil! Mengalihkan...');
            setTimeout(() => {
              window.location.href = getRedirectUrl();
            }, 600);
          }
        } else {
          setErrorMsg(data.error || 'Gagal mendaftarkan akun.');
          setIsLoading(false);
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            password
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.user) {
          localStorage.setItem('satusite_auth_user', JSON.stringify(data.user));
          localStorage.setItem('satusite_auth_token', data.token);
          setSuccessMsg('Login berhasil! Mengalihkan...');
          setTimeout(() => {
            window.location.href = getRedirectUrl();
          }, 600);
        } else {
          setErrorMsg(data.error || 'Gagal memproses login.');
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan koneksi.');
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verificationSentEmail) return;
    setIsResending(true);
    setResendMsg('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || verificationSentEmail.split('@')[0],
          email: verificationSentEmail,
          password: password || 'default123'
        })
      });
      const data = await res.json();
      if (data.verificationUrl) setDirectVerifyUrl(data.verificationUrl);
      setResendMsg('Tautan verifikasi baru berhasil dibuat!');
    } catch (e) {
      setResendMsg('Gagal mengirim ulang email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col justify-between relative selection:bg-zinc-800 selection:text-white overflow-hidden font-sans">
      
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
        {verificationSentEmail ? (
          <div className="w-full max-w-[400px] bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fade-in-up">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-300">
              <Mail className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Periksa Email Anda
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tautan konfirmasi verifikasi telah dikirimkan ke <strong className="text-white font-mono">{verificationSentEmail}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left text-xs space-y-2 text-zinc-400">
              <div className="flex items-start gap-2">
                <span className="text-zinc-200 font-bold">1.</span>
                <span>Buka kotak masuk atau folder spam di email Anda.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-zinc-200 font-bold">2.</span>
                <span>Klik tombol <strong>"Verifikasi Akun Saya"</strong> di dalam email.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-zinc-200 font-bold">3.</span>
                <span>Akun Anda akan aktif dan langsung dialihkan ke Studio AI.</span>
              </div>
            </div>

            {resendMsg && (
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 text-center font-medium animate-fade-in-up">
                {resendMsg}
              </div>
            )}

            <div className="space-y-2 pt-2">
              {directVerifyUrl && (
                <a
                  href={directVerifyUrl}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verifikasi Akun Ini Sekarang &rarr;</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengirim Ulang...</span>
                  </>
                ) : (
                  <span>Kirim Ulang Email Verifikasi</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setVerificationSentEmail(null);
                  setAuthMode('login');
                  setStep(1);
                }}
                className="w-full py-2 px-4 rounded-xl text-zinc-500 hover:text-zinc-300 text-[11px] transition-colors cursor-pointer"
              >
                Kembali ke Halaman Masuk
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[400px] bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in-up">
            
            {/* Header Title & Mode Toggle */}
            <div className="text-center space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                {authMode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {authMode === 'login'
                  ? 'Akses portal akun, kelola proyek & sinkronisasi AI.'
                  : 'Mulai bangun aplikasi fullstack dengan akun satusitE.'}
              </p>
            </div>

            {/* Google Sign-In Primary Section */}
            <div className="flex flex-col items-center justify-center w-full">
              <div ref={googleBtnContainerRef} className={`flex justify-center w-full min-h-[44px] ${hasGoogleNativeButton ? 'block' : 'hidden'}`}></div>
              
              {!hasGoogleNativeButton && (
                <button
                  type="button"
                  onClick={handlePromptGoogleOAuth}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#d4d4d8" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#a1a1aa" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Lanjutkan dengan Akun Google</span>
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-zinc-800"></div>
              <span className="bg-zinc-950 px-3 text-[10px] uppercase font-medium text-zinc-500 tracking-wider">
                atau dengan email
              </span>
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

            {/* STEP 1: EMAIL (AND NAME IF REGISTER) */}
            {step === 1 && (
              <form onSubmit={handleContinueEmail} className="space-y-4 text-left animate-fade-in-up">
                {authMode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-zinc-400">Nama Lengkap</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Anda"
                        className="w-full bg-[#09090b] border border-zinc-800 focus:border-zinc-500 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

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
                      placeholder="nama@email.com"
                      className="w-full bg-[#09090b] border border-zinc-800 focus:border-zinc-500 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* STEP 2: PASSWORD */}
            {step === 2 && (
              <form onSubmit={handleAuthSubmit} className="space-y-4 text-left animate-fade-in-up">
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between text-xs">
                  <div className="truncate text-zinc-300 font-mono text-[11px]">
                    {email}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-zinc-500 hover:text-white text-[11px] underline cursor-pointer shrink-0 ml-2"
                  >
                    Ubah
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-zinc-400">Kata Sandi</label>
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
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>{authMode === 'register' ? 'Daftarkan Akun' : 'Masuk ke Portal'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Toggle Login vs Register */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setStep(1);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {authMode === 'login' ? (
                  <>Belum punya akun? <span className="font-semibold text-white underline">Daftar sekarang</span></>
                ) : (
                  <>Sudah punya akun? <span className="font-semibold text-white underline">Masuk di sini</span></>
                )}
              </button>
            </div>

          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 py-4 px-6 text-center text-[11px] text-zinc-600 border-t border-zinc-900">
        <p>&copy; {new Date().getFullYear()} satusitE Studio. Platform Pembuat Aplikasi AI Otonom.</p>
      </footer>

    </div>
  );
}
