'use client';
import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number; // Durasi loading dalam milidetik (default: 1800ms)
  text?: string;
  subtext?: string;
}

export function LoadingScreen({
  onComplete,
  minDuration = 1800,
  text = "RUANG VISUAL",
  subtext = "Visual Stories Creating Memories"
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.round((elapsed / minDuration) * 100), 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsHidden(true);
            if (onComplete) onComplete();
          }, 600); // Durasi transisi fade-out
        }, 200);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none transition-all duration-700 ease-in-out bg-black ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      {/* Konten Tengah (Hanya Logo & Teks Sederhana) */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Logo / Badge */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center text-white shadow-2xl">
            <i className="fa-solid fa-camera-retro text-2xl"></i>
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="font-display font-extrabold uppercase tracking-[0.25em] text-2xl sm:text-3xl text-white mb-2">
          {text}
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-xs sm:text-sm tracking-widest mb-8">
          {subtext}
        </p>

        {/* Progress Bar & Percentage */}
        <div className="w-52 sm:w-64 flex flex-col items-center gap-2">
          <div className="w-full h-1 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-white rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between w-full text-[10px] font-mono text-zinc-500 px-0.5">
            <span>Memuat Karya</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
