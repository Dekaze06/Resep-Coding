'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Eye,
  Code2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  X,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  ArrowLeft,
  FolderOpen,
  Share2,
  CheckCircle2
} from 'lucide-react';

export interface TemplateItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  rating: number;
  downloads: number;
  previewGradient: string;
  code: string;
  isUserGenerated?: boolean;
}

const PRESET_TEMPLATES: TemplateItem[] = [
  {
    id: "lumina-store",
    title: "Lumina Storefront & WhatsApp Checkout",
    category: "E-Commerce",
    description: "Katalog produk modern dengan grid produk responsif, drawer keranjang belanja interaktif, filter kategori, dan checkout langsung via WhatsApp.",
    tags: ["E-Commerce", "Keranjang Belanja", "WhatsApp", "Tailwind CSS"],
    rating: 4.9,
    downloads: 1420,
    previewGradient: "from-amber-600/30 via-orange-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lumina Goods - Modern Lifestyle Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen">
  <!-- Navbar -->
  <header class="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-bold">L</div>
      <span class="font-bold text-lg tracking-tight">LUMINA GOODS</span>
    </div>
    <div class="flex items-center gap-4">
      <button onclick="toggleCart()" class="relative p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-all">
        <i class="fa-solid fa-bag-shopping text-sm"></i>
        <span id="cart-badge" class="absolute -top-1.5 -right-1.5 bg-amber-500 text-zinc-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="px-6 py-16 max-w-6xl mx-auto text-center">
    <span class="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest">Koleksi Terbaru 2026</span>
    <h1 class="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">Minimalist Essentials untuk Setiap Hari</h1>
    <p class="text-zinc-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">Dirancang untuk kenyamanan, estetika, dan ketahanan jangka panjang.</p>
  </section>

  <!-- Product Grid -->
  <section class="px-6 pb-24 max-w-6xl mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div class="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden p-4 group">
        <div class="aspect-square bg-zinc-800/80 rounded-xl overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop" alt="Watch" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <span class="absolute top-3 left-3 bg-amber-500 text-zinc-950 text-[10px] font-bold px-2.5 py-1 rounded-md">BEST SELLER</span>
        </div>
        <h3 class="font-bold text-white mt-4">Analog Minimalist Watch</h3>
        <p class="text-amber-400 font-bold text-sm mt-1">Rp 749.000</p>
        <button onclick="addToCart('Analog Minimalist Watch', 749000)" class="w-full mt-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-xs font-bold transition-colors">Tambah ke Keranjang</button>
      </div>

      <div class="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden p-4 group">
        <div class="aspect-square bg-zinc-800/80 rounded-xl overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop" alt="Smartwatch" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <h3 class="font-bold text-white mt-4">Smart Pulse Band v2</h3>
        <p class="text-amber-400 font-bold text-sm mt-1">Rp 1.199.000</p>
        <button onclick="addToCart('Smart Pulse Band v2', 1199000)" class="w-full mt-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-xs font-bold transition-colors">Tambah ke Keranjang</button>
      </div>

      <div class="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden p-4 group">
        <div class="aspect-square bg-zinc-800/80 rounded-xl overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop" alt="Headphones" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <h3 class="font-bold text-white mt-4">Studio Sound Wireless</h3>
        <p class="text-amber-400 font-bold text-sm mt-1">Rp 1.499.000</p>
        <button onclick="addToCart('Studio Sound Wireless', 1499000)" class="w-full mt-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-xs font-bold transition-colors">Tambah ke Keranjang</button>
      </div>
    </div>
  </section>

  <!-- Cart Drawer -->
  <div id="cart-drawer" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex justify-end">
    <div class="w-full max-w-md bg-zinc-900 h-full p-6 flex flex-col justify-between border-l border-zinc-800">
      <div>
        <div class="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h2 class="text-lg font-bold text-white">Keranjang Belanja</h2>
          <button onclick="toggleCart()" class="text-zinc-400 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>
        <div id="cart-items" class="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <p class="text-zinc-500 text-sm text-center py-8">Keranjang belanja Anda masih kosong.</p>
        </div>
      </div>
      <div class="pt-4 border-t border-zinc-800 space-y-3">
        <div class="flex justify-between text-sm font-bold">
          <span>Total</span>
          <span id="cart-total" class="text-amber-400">Rp 0</span>
        </div>
        <button onclick="checkoutWhatsApp()" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2">
          <i class="fa-brands fa-whatsapp text-lg"></i> Checkout via WhatsApp
        </button>
      </div>
    </div>
  </div>

  <script>
    let cart = [];
    function toggleCart() {
      const drawer = document.getElementById('cart-drawer');
      drawer.classList.toggle('hidden');
    }
    function addToCart(name, price) {
      cart.push({ name, price });
      renderCart();
      toggleCart();
    }
    function renderCart() {
      const list = document.getElementById('cart-items');
      const badge = document.getElementById('cart-badge');
      const totalEl = document.getElementById('cart-total');
      badge.textContent = cart.length;
      if (cart.length === 0) {
        list.innerHTML = '<p class="text-zinc-500 text-sm text-center py-8">Keranjang belanja kosong.</p>';
        totalEl.textContent = 'Rp 0';
        return;
      }
      let total = 0;
      list.innerHTML = cart.map((item, idx) => {
        total += item.price;
        return \`<div class="flex items-center justify-between p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
          <div><p class="font-medium text-xs text-white">\${item.name}</p><p class="text-amber-400 text-xs font-bold mt-0.5">Rp \${item.price.toLocaleString('id-ID')}</p></div>
          <button onclick="cart.splice(\${idx},1); renderCart();" class="text-zinc-500 hover:text-red-400 text-xs"><i class="fa-solid fa-trash"></i></button>
        </div>\`;
      }).join('');
      totalEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
    }
    function checkoutWhatsApp() {
      if (cart.length === 0) { alert('Keranjang belanja kosong!'); return; }
      let msg = 'Halo Lumina Goods, saya ingin memesan:\\n';
      let total = 0;
      cart.forEach((c, i) => { msg += (i+1) + '. ' + c.name + ' (Rp ' + c.price.toLocaleString('id-ID') + ')\\n'; total += c.price; });
      msg += '\\nTotal: Rp ' + total.toLocaleString('id-ID');
      window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(msg), '_blank');
    }
  </script>
</body>
</html>`
  },
  {
    id: "omnipulse-saas",
    title: "OmniPulse SaaS & Analytics Dashboard",
    category: "Dashboard",
    description: "Antarmuka dashboard analitik dengan metrik KPI ringkasan, grafik visual pertumbuhan real-time, dan tabel data pengguna dengan fitur filter & pencarian.",
    tags: ["Dashboard", "SaaS", "Chart", "Data Table"],
    rating: 5.0,
    downloads: 2180,
    previewGradient: "from-blue-600/30 via-indigo-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OmniPulse - Enterprise Analytics</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col md:flex-row">
  <!-- Sidebar -->
  <aside class="w-full md:w-64 bg-zinc-900/80 border-r border-zinc-800 p-5 flex flex-col justify-between">
    <div class="space-y-6">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white"><i class="fa-solid fa-chart-pie text-xs"></i></div>
        <span class="font-bold tracking-tight text-white">OmniPulse</span>
      </div>
      <nav class="space-y-1">
        <a href="#" class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 font-medium text-xs border border-blue-500/30"><i class="fa-solid fa-gauge w-4"></i> Dashboard</a>
        <a href="#" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-medium text-xs transition-colors"><i class="fa-solid fa-users w-4"></i> Pengguna</a>
        <a href="#" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-medium text-xs transition-colors"><i class="fa-solid fa-credit-card w-4"></i> Transaksi</a>
        <a href="#" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-medium text-xs transition-colors"><i class="fa-solid fa-gear w-4"></i> Pengaturan</a>
      </nav>
    </div>
    <div class="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs">AR</div>
      <div class="min-w-0 flex-1"><p class="text-xs font-bold text-white truncate">Alex Rivera</p><p class="text-[10px] text-zinc-500 truncate">Admin Pro</p></div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Ringkasan Kinerja</h1>
        <p class="text-xs text-zinc-400 mt-1">Data statistik metrik real-time sistem Anda.</p>
      </div>
      <button onclick="alert('Laporan berhasil diekspor!')" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 w-fit">
        <i class="fa-solid fa-download"></i> Ekspor CSV
      </button>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <p class="text-xs text-zinc-400 font-medium">Total Pendapatan (MRR)</p>
        <p class="text-2xl font-bold text-white mt-2">Rp 482.500.000</p>
        <span class="text-[10px] text-emerald-400 font-medium mt-1 inline-flex items-center gap-1"><i class="fa-solid fa-arrow-trend-up"></i> +14.2% bulan ini</span>
      </div>
      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <p class="text-xs text-zinc-400 font-medium">Pengguna Aktif</p>
        <p class="text-2xl font-bold text-white mt-2">14.820</p>
        <span class="text-[10px] text-emerald-400 font-medium mt-1 inline-flex items-center gap-1"><i class="fa-solid fa-arrow-trend-up"></i> +8.5% minggu ini</span>
      </div>
      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <p class="text-xs text-zinc-400 font-medium">Tingkat Konversi</p>
        <p class="text-2xl font-bold text-white mt-2">4.85%</p>
        <span class="text-[10px] text-blue-400 font-medium mt-1 inline-flex items-center gap-1"><i class="fa-solid fa-bolt"></i> Optimal</span>
      </div>
    </div>

    <!-- User Table -->
    <div class="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-4">
      <h2 class="text-sm font-bold text-white">Pengguna Terbaru</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-zinc-500 border-b border-zinc-800">
              <th class="pb-3 font-semibold">Nama</th>
              <th class="pb-3 font-semibold">Role</th>
              <th class="pb-3 font-semibold">Status</th>
              <th class="pb-3 font-semibold">Tanggal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
            <tr>
              <td class="py-3 font-medium text-white">Sarah Jenkins</td>
              <td class="py-3 text-zinc-400">Enterprise</td>
              <td class="py-3"><span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">Aktif</span></td>
              <td class="py-3 text-zinc-500">18 Agu 2026</td>
            </tr>
            <tr>
              <td class="py-3 font-medium text-white">Michael Chang</td>
              <td class="py-3 text-zinc-400">Pro Plan</td>
              <td class="py-3"><span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">Aktif</span></td>
              <td class="py-3 text-zinc-500">17 Agu 2026</td>
            </tr>
            <tr>
              <td class="py-3 font-medium text-white">Dian Sastro</td>
              <td class="py-3 text-zinc-400">Starter</td>
              <td class="py-3"><span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px]">Pending</span></td>
              <td class="py-3 text-zinc-500">16 Agu 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</body>
</html>`
  },
  {
    id: "gusto-bistro",
    title: "Gusto Artisan Bistro & Cafe",
    category: "Restoran",
    description: "Website profil kafe & restoran modern dengan navigasi kategori menu hidangan, foto galeri makanan, jam operasional, dan tombol reservasi meja online.",
    tags: ["Restoran", "Menu Digital", "Reservasi", "Kuliner"],
    rating: 4.8,
    downloads: 980,
    previewGradient: "from-amber-700/30 via-yellow-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gusto Artisan Cafe & Bistro</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    h1, h2, h3, .serif-font { font-family: 'Playfair Display', serif; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-[#0b0806] text-amber-50 min-h-screen">
  <header class="p-6 flex items-center justify-between max-w-6xl mx-auto border-b border-amber-900/30">
    <span class="text-xl font-bold tracking-widest text-amber-400 serif-font">GUSTO BISTRO</span>
    <button onclick="alert('Buka Form Reservasi Meja')" class="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all">Reservasi Meja</button>
  </header>
  
  <section class="py-20 text-center px-6 max-w-3xl mx-auto">
    <p class="text-amber-400 font-mono text-xs uppercase tracking-widest mb-3">Authentic Taste & Aesthetic Space</p>
    <h1 class="text-4xl sm:text-6xl font-bold text-white tracking-tight">Kelezatan Klasik dengan Sentuhan Modern</h1>
    <p class="text-amber-200/70 text-sm mt-4 leading-relaxed">Nikmati sajian kopi spesialti pilihan, hidangan hangat artisan, dan suasana kafe yang nyaman untuk berkumpul bersama keluarga & rekan.</p>
  </section>

  <section class="max-w-5xl mx-auto px-6 pb-24">
    <h2 class="text-2xl font-bold text-center text-amber-400 mb-8">Pilihan Menu Favorit</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-5 rounded-2xl bg-zinc-950/60 border border-amber-900/30 flex justify-between items-start">
        <div>
          <h3 class="text-base font-bold text-white">Truffle Mushroom Pasta</h3>
          <p class="text-xs text-amber-200/60 mt-1">Fettuccine dengan saus krim jamur truffle & keju parmesan</p>
        </div>
        <span class="text-amber-400 font-bold text-sm">Rp 85.000</span>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-950/60 border border-amber-900/30 flex justify-between items-start">
        <div>
          <h3 class="text-base font-bold text-white">Artisan Pour-Over Coffee</h3>
          <p class="text-xs text-amber-200/60 mt-1">Biji kopi arabika single origin dengan aroma floral & citrus</p>
        </div>
        <span class="text-amber-400 font-bold text-sm">Rp 45.000</span>
      </div>
    </div>
  </section>
</body>
</html>`
  },
  {
    id: "apex-agency",
    title: "Apex Digital Agency & Portfolio",
    category: "Landing Page",
    description: "Halaman landing page agensi kreatif profesional dengan visual hero interaktif, showcase portofolio proyek klien, paket layanan, dan formulir konsultasi.",
    tags: ["Landing Page", "Agensi", "Kreatif", "Portofolio"],
    rating: 4.9,
    downloads: 1850,
    previewGradient: "from-purple-600/30 via-violet-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Agency - Creative Digital Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    h1, h2, h3 { font-family: 'Syne', sans-serif; }
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-black text-white min-h-screen">
  <header class="p-6 flex items-center justify-between max-w-6xl mx-auto">
    <span class="text-xl font-black tracking-wider text-purple-400">APEX.</span>
    <a href="#kontak" class="px-4 py-2 rounded-full border border-purple-500/40 bg-purple-600/20 text-purple-300 text-xs font-semibold hover:bg-purple-600 hover:text-white transition-all">Mulai Proyek</a>
  </header>

  <section class="py-24 text-center px-6 max-w-4xl mx-auto">
    <h1 class="text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
      Membangun Identitas Visual & Digital Berkelas
    </h1>
    <p class="text-zinc-400 text-sm sm:text-base mt-6 max-w-xl mx-auto">
      Kami membantu brand visioner meningkatkan konversi melalui desain antarmuka, strategi branding, dan rekayasa web modern.
    </p>
  </section>
</body>
</html>`
  },
  {
    id: "medika-clinic",
    title: "Medika Health Clinic & Care",
    category: "Kesehatan",
    description: "Website profil layanan klinik kesehatan lengkap dengan jadwal dokter spesialis, paket cek medis rutin, dan formulir janji temu instan.",
    tags: ["Klinik", "Dokter", "Kesehatan", "Janji Temu"],
    rating: 4.8,
    downloads: 720,
    previewGradient: "from-emerald-600/30 via-teal-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medika Health Clinic</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-zinc-950 text-white min-h-screen">
  <header class="p-6 max-w-6xl mx-auto flex items-center justify-between border-b border-zinc-800">
    <span class="text-lg font-bold text-emerald-400">MEDIKA CARE</span>
    <button onclick="alert('Buka Form Janji Temu Dokter')" class="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs">Buat Janji Temu</button>
  </header>
  <section class="py-20 text-center px-6 max-w-3xl mx-auto">
    <h1 class="text-3xl sm:text-5xl font-bold text-white">Layanan Kesehatan Tepercaya untuk Keluarga</h1>
    <p class="text-zinc-400 text-sm mt-3">Konsultasi dokter spesialis, lab diagnostik, dan perawatan medis komprehensif.</p>
  </section>
</body>
</html>`
  }
];

export function TemplateGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userTemplates, setUserTemplates] = useState<TemplateItem[]>([]);
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<TemplateItem | null>(null);
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  // Load User Generated Templates from LocalStorage
  useEffect(() => {
    try {
      const storeRaw =
        localStorage.getItem("satusite_projects_store") ||
        localStorage.getItem("emergent_projects_store") ||
        localStorage.getItem("webDevProjectsStore");
      if (storeRaw) {
        const parsed = JSON.parse(storeRaw);
        const projects = parsed.projects || {};
        const list: TemplateItem[] = Object.keys(projects).map((k) => {
          const p = projects[k];
          return {
            id: p.id || k,
            title: p.name || "Aplikasi Kustom",
            category: "Karya Anda",
            description: p.prompt || "Aplikasi web yang dibuat melalui AI Agent Studio.",
            tags: ["AI Generated", "Kustom", "HTML5"],
            rating: 5.0,
            downloads: 1,
            previewGradient: "from-blue-600/30 via-indigo-950/40 to-black",
            code: p.code || "",
            isUserGenerated: true,
          };
        }).filter(item => Boolean(item.code));
        setUserTemplates(list);
      }
    } catch (e) {
      console.error("Failed to load user templates:", e);
    }
  }, []);

  const allTemplates = useMemo(() => {
    return [...userTemplates, ...PRESET_TEMPLATES];
  }, [userTemplates]);

  const categories = useMemo(() => {
    const cats = new Set<string>(["Semua"]);
    if (userTemplates.length > 0) cats.add("Karya Anda");
    PRESET_TEMPLATES.forEach((t) => cats.add(t.category));
    return Array.from(cats);
  }, [userTemplates]);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      const matchesCat =
        selectedCategory === "Semua" || t.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCat && matchesSearch;
    });
  }, [allTemplates, selectedCategory, searchQuery]);

  const handleCopyCode = (template: TemplateItem) => {
    navigator.clipboard.writeText(template.code);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCode = (template: TemplateItem) => {
    const blob = new Blob([template.code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUseInStudio = (template: TemplateItem) => {
    const encodedPrompt = encodeURIComponent(
      `Sempurnakan template ${template.title}: ${template.description}`
    );
    window.location.href = `/app?prompt=${encodedPrompt}&mode=frontend`;
  };

  return (
    <div
      className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-blue-500/30 selection:text-blue-200"
      style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div className="flex items-center gap-2">
            <span className="font-agus text-sm font-normal tracking-[0.35em] text-white">
              satusitE
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              / Galeri Template
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/app"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <span>Buka Studio AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative px-6 pt-16 pb-12 max-w-6xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Pustaka Template Website Siap Pakai
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Pilih template mandiri beresolusi tinggi, buka pratinjau langsung, unduh file HTML mandiri, atau lanjutkan kustomisasi secara instan di Studio AI.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari template (contoh: Toko Online, Restoran, SaaS, Portofolio)..."
              className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-blue-500 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 p-1 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Template Grid */}
      <section className="px-6 pb-24 max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-500">
          <span>Menampilkan {filteredTemplates.length} Template</span>
          <span>Pratinjau & Unduh Instan</span>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border border-zinc-800/60 bg-zinc-950/40 space-y-3">
            <FolderOpen className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-zinc-300 font-semibold text-sm">Tidak ada template yang cocok</p>
            <p className="text-zinc-500 text-xs">Coba gunakan kata kunci pencarian yang berbeda atau reset filter kategori.</p>
            <button
              onClick={() => { setSelectedCategory("Semua"); setSearchQuery(""); }}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 text-xs text-white hover:bg-zinc-700 mt-2"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950/70 hover:border-zinc-700 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl"
              >
                {/* Visual Thumbnail / Preview Area */}
                <div
                  onClick={() => setActivePreviewTemplate(template)}
                  className={`h-48 w-full bg-gradient-to-br ${template.previewGradient} relative p-4 flex flex-col justify-between cursor-pointer overflow-hidden border-b border-zinc-800/60`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-medium text-zinc-300">
                      {template.category}
                    </span>
                    {template.isUserGenerated && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-medium">
                        Karya Anda
                      </span>
                    )}
                  </div>

                  {/* Simulated Card Content in Thumbnail */}
                  <div className="z-10 text-left space-y-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors drop-shadow-md">
                      {template.title}
                    </h4>
                  </div>

                  {/* Hover Overlay with Live Preview Button */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                    <span className="px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {template.description}
                    </p>

                    {/* Tag Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyCode(template)}
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Salin Kode HTML"
                      >
                        {copiedId === template.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadCode(template)}
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Unduh File HTML"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleUseInStudio(template)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Buka di Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FULLSCREEN LIVE PREVIEW MODAL */}
      {activePreviewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          {/* Modal Top Bar */}
          <div className="h-14 bg-zinc-950 border-b border-zinc-800 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-white truncate max-w-xs sm:max-w-md">
                {activePreviewTemplate.title}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-medium">
                {activePreviewTemplate.category}
              </span>
            </div>

            {/* Viewport & View Mode Selectors */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewViewport("desktop")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    previewViewport === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Desktop (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewViewport("tablet")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    previewViewport === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewViewport("mobile")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    previewViewport === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Mobile (390px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tab Switcher: Preview vs Code */}
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                    activeTab === "preview" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                    activeTab === "code" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  <span>Code</span>
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={() => handleUseInStudio(activePreviewTemplate)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
              >
                <span>Edit di Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => setActivePreviewTemplate(null)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Tutup Pratinjau"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="flex-1 bg-zinc-950 p-4 sm:p-6 overflow-hidden flex items-center justify-center">
            {activeTab === "preview" ? (
              <div
                className={`h-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300 ${
                  previewViewport === "mobile"
                    ? "w-[390px]"
                    : previewViewport === "tablet"
                    ? "w-[768px]"
                    : "w-full"
                }`}
              >
                <iframe
                  srcDoc={activePreviewTemplate.code}
                  title="Template Preview"
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
                />
              </div>
            ) : (
              <div className="w-full h-full max-w-5xl rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 overflow-auto font-mono text-xs text-zinc-300 leading-relaxed select-text">
                <pre className="whitespace-pre-wrap">{activePreviewTemplate.code}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateGallery;
