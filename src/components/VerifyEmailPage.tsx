import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, Sparkles, Mail, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [verifiedUser, setVerifiedUser] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const processVerification = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          setStatus('error');
          setErrorMessage('Tautan verifikasi tidak lengkap. Parameter token tidak ditemukan.');
          return;
        }

        const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok && data.success && data.user) {
          localStorage.setItem('satusite_auth_user', JSON.stringify(data.user));
          localStorage.setItem('satusite_auth_token', data.token);
          setVerifiedUser(data.user);
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Token verifikasi tidak valid atau telah kedaluwarsa.');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Gagal menghubungi server verifikasi.');
      }
    };

    processVerification();
  }, []);

  // Countdown timer on success
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      window.location.href = '/app';
    }
  }, [status, countdown]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-zinc-800 selection:text-white font-sans relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-800/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 group">
            <span className="font-agus text-2xl font-normal tracking-[0.35em] text-white group-hover:text-zinc-300 transition-colors">
              satusitE
            </span>
          </a>
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
            Konfirmasi Akun Pengguna
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">

          {/* 1. LOADING STATE */}
          {status === 'loading' && (
            <div className="space-y-4 py-8 animate-fade-in-up">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-300">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base font-semibold text-white">Memverifikasi Akun Anda...</h2>
                <p className="text-xs text-zinc-400">Harap tunggu sebentar selagi kami mengonfirmasi token keamanan Anda.</p>
              </div>
            </div>
          )}

          {/* 2. SUCCESS STATE */}
          {status === 'success' && (
            <div className="space-y-5 animate-fade-in-up">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Email Berhasil Diverifikasi!
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Selamat datang <strong className="text-white">{verifiedUser?.name || 'Klien'}</strong>! Akun Anda kini telah aktif dengan paket <span className="text-emerald-400 font-mono font-semibold">{verifiedUser?.role || 'Gratis'}</span> ({verifiedUser?.quota || 15} Token).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-left font-mono text-[11px] space-y-1.5 text-zinc-400">
                <div className="flex justify-between">
                  <span>Alamat Email:</span>
                  <span className="text-zinc-200">{verifiedUser?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status Akun:</span>
                  <span className="text-emerald-400">Aktif & Terverifikasi</span>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <a
                  href="/app"
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buka Studio AI Sekarang ({countdown}s)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="/portal"
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors inline-block border border-zinc-800"
                >
                  Ke Portal Klien
                </a>
              </div>
            </div>
          )}

          {/* 3. ERROR STATE */}
          {status === 'error' && (
            <div className="space-y-5 animate-fade-in-up">
              <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Verifikasi Gagal
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {errorMessage}
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <a
                  href="/login"
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Kembali ke Halaman Masuk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="/"
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition-colors inline-block border border-zinc-800"
                >
                  Kembali ke Beranda
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-zinc-600 mt-6">
          &copy; 2026 satusitE. Sistem verifikasi otomatis terenkripsi.
        </p>

      </div>
    </div>
  );
}
