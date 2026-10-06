const fs = require('fs');
const path = require('path');

const telkomHtml = `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMK Telkom Bandung - The Real Informatics School</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] },
                    colors: {
                        telkom: { red: '#dc2626', darkred: '#991b1b', lightred: '#fee2e2' }
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-panel { background: rgba(18, 18, 22, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .red-gradient { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); }
    </style>
</head>
<body class="bg-[#09090b] text-zinc-100 min-h-screen flex flex-col selection:bg-red-600 selection:text-white">

    <!-- TOP ANNOUNCEMENT BAR -->
    <div class="bg-red-700 text-white text-[11px] font-medium py-1.5 px-4 text-center border-b border-red-800 flex items-center justify-center gap-2">
        <span class="px-2 py-0.5 rounded-full bg-white text-red-700 font-bold text-[9px] uppercase tracking-wider">PPDB 2026/2027</span>
        <span>Penerimaan Peserta Didik Baru SMK Telkom Bandung Gelombang 1 Resmi Dibuka!</span>
        <button onclick="navigatePage('ppdb')" class="underline font-bold hover:text-zinc-200 ml-1 cursor-pointer">Daftar Online Sekarang</button>
    </div>

    <!-- MAIN NAVBAR -->
    <header class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 cursor-pointer" onclick="navigatePage('home')">
                <div class="w-10 h-10 rounded-xl red-gradient flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                    <i class="fa-solid fa-graduation-cap text-lg"></i>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h1 class="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none">SMK TELKOM BANDUNG</h1>
                        <span class="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-bold">TERAKREDITASI A</span>
                    </div>
                    <span class="text-[10px] text-zinc-400 font-medium">The Real Informatics & Technology School</span>
                </div>
            </div>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl text-xs">
                <button id="nav-home" onclick="navigatePage('home')" class="nav-btn px-3 py-1.5 rounded-lg font-semibold bg-red-600 text-white transition-all">
                    <i class="fa-solid fa-house mr-1.5 text-[11px]"></i>Beranda
                </button>
                <button id="nav-jurusan" onclick="navigatePage('jurusan')" class="nav-btn px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                    <i class="fa-solid fa-laptop-code mr-1.5 text-[11px]"></i>Program Keahlian
                </button>
                <button id="nav-ppdb" onclick="navigatePage('ppdb')" class="nav-btn px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                    <i class="fa-solid fa-clipboard-check mr-1.5 text-[11px]"></i>PPDB Online
                </button>
                <button id="nav-admin" onclick="navigatePage('admin')" class="nav-btn px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                    <i class="fa-solid fa-user-shield mr-1.5 text-[11px]"></i>Portal Panitia PPDB
                </button>
            </nav>

            <div class="flex items-center gap-2.5">
                <button onclick="navigatePage('ppdb')" class="px-4 py-2 rounded-xl red-gradient text-white text-xs font-bold hover:brightness-110 shadow-lg shadow-red-600/25 transition-all flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-file-pen text-xs"></i>
                    <span>Registrasi Siswa</span>
                </button>
            </div>
        </div>
    </header>

    <!-- CONTENT WRAPPER -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-12">

        <!-- ===== PAGE 1: HOME ===== -->
        <section id="page-home" class="page-view space-y-12">
            
            <!-- Hero Banner -->
            <div class="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 sm:p-12 shadow-2xl">
                <div class="absolute -right-20 -top-20 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>
                <div class="relative z-10 max-w-3xl space-y-5">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                        <i class="fa-solid fa-award text-xs"></i>
                        <span>Pelopor Pendidikan Vokasi Bidang IT & Telekomunikasi di Jawa Barat</span>
                    </div>
                    <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                        Membentuk Generasi Unggul Digital di <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">SMK Telkom Bandung</span>
                    </h2>
                    <p class="text-xs sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
                        Kurikulum standar industri global berstandar Telkom Education Foundation. Didukung laboratorium berteknologi canggih, sertifikasi internasional, dan penyaluran kerja langsung ke industri nasional.
                    </p>
                    <div class="flex flex-wrap items-center gap-3 pt-2">
                        <button onclick="navigatePage('ppdb')" class="px-6 py-3 rounded-xl red-gradient hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all cursor-pointer">
                            <span>Daftar Calon Siswa Baru</span>
                            <i class="fa-solid fa-arrow-right text-xs"></i>
                        </button>
                        <button onclick="navigatePage('jurusan')" class="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-semibold border border-zinc-700 flex items-center gap-2 transition-colors cursor-pointer">
                            <i class="fa-solid fa-compass text-xs"></i>
                            <span>Eksplorasi 4 Jurusan</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Key Statistics -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
                <div class="p-5 rounded-2xl glass-panel text-center space-y-1 border-t-2 border-t-red-500">
                    <div class="text-2xl sm:text-3xl font-extrabold text-white">96.4%</div>
                    <div class="text-xs text-zinc-400">Terserap Kerja & Kuliah</div>
                </div>
                <div class="p-5 rounded-2xl glass-panel text-center space-y-1 border-t-2 border-t-white">
                    <div class="text-2xl sm:text-3xl font-extrabold text-white">1.450+</div>
                    <div class="text-xs text-zinc-400">Siswa Aktif Berprestasi</div>
                </div>
                <div class="p-5 rounded-2xl glass-panel text-center space-y-1 border-t-2 border-t-red-500">
                    <div class="text-2xl sm:text-3xl font-extrabold text-white">85+</div>
                    <div class="text-xs text-zinc-400">Mitra Industri & BUMN</div>
                </div>
                <div class="p-5 rounded-2xl glass-panel text-center space-y-1 border-t-2 border-t-white">
                    <div class="text-2xl sm:text-3xl font-extrabold text-white">A</div>
                    <div class="text-xs text-zinc-400">Akreditasi BAN-SM Unggul</div>
                </div>
            </div>

            <!-- Jurusan Preview Section -->
            <div class="space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
                    <div>
                        <h3 class="text-xl font-bold text-white">Program Keahlian Unggulan</h3>
                        <p class="text-xs text-zinc-400">4 Jurusan vokasi masa depan yang paling diminati dunia industri</p>
                    </div>
                    <button onclick="navigatePage('jurusan')" class="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1.5 cursor-pointer">
                        <span>Rincian Kurikulum & Kuota</span>
                        <i class="fa-solid fa-chevron-right text-[10px]"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- RPL -->
                    <div class="p-5 rounded-2xl glass-panel space-y-3 hover:border-red-500/40 transition-all flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-lg">
                                <i class="fa-solid fa-code"></i>
                            </div>
                            <h4 class="font-bold text-white text-base">RPL</h4>
                            <p class="text-xs text-zinc-300 font-medium">Rekayasa Perangkat Lunak</p>
                            <p class="text-[11px] text-zinc-400 leading-relaxed">Fokus pengembangan Web, Aplikasi Mobile, Cloud Backend, & AI Integration.</p>
                        </div>
                        <button onclick="selectMajor('RPL')" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-red-600 text-xs font-semibold text-white transition-all cursor-pointer">
                            Daftar di Jurusan Ini
                        </button>
                    </div>

                    <!-- TKJ -->
                    <div class="p-5 rounded-2xl glass-panel space-y-3 hover:border-red-500/40 transition-all flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-lg">
                                <i class="fa-solid fa-network-wired"></i>
                            </div>
                            <h4 class="font-bold text-white text-base">TKJ</h4>
                            <p class="text-xs text-zinc-300 font-medium">Teknik Komputer & Jaringan</p>
                            <p class="text-[11px] text-zinc-400 leading-relaxed">Keahlian infrastruktur server, Cloud Computing, Cybersecurity, & Router Cisco.</p>
                        </div>
                        <button onclick="selectMajor('TKJ')" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-red-600 text-xs font-semibold text-white transition-all cursor-pointer">
                            Daftar di Jurusan Ini
                        </button>
                    </div>

                    <!-- DKV -->
                    <div class="p-5 rounded-2xl glass-panel space-y-3 hover:border-red-500/40 transition-all flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-lg">
                                <i class="fa-solid fa-bezier-curve"></i>
                            </div>
                            <h4 class="font-bold text-white text-base">DKV</h4>
                            <p class="text-xs text-zinc-300 font-medium">Desain Komunikasi Visual</p>
                            <p class="text-[11px] text-zinc-400 leading-relaxed">Kreativitas UI/UX design, animasi 2D/3D, branding visual, dan produksi media digital.</p>
                        </div>
                        <button onclick="selectMajor('DKV')" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-red-600 text-xs font-semibold text-white transition-all cursor-pointer">
                            Daftar di Jurusan Ini
                        </button>
                    </div>

                    <!-- TJA -->
                    <div class="p-5 rounded-2xl glass-panel space-y-3 hover:border-red-500/40 transition-all flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-lg">
                                <i class="fa-solid fa-tower-cell"></i>
                            </div>
                            <h4 class="font-bold text-white text-base">TJA</h4>
                            <p class="text-xs text-zinc-300 font-medium">Teknik Jaringan Akses</p>
                            <p class="text-[11px] text-zinc-400 leading-relaxed">Spesialisasi Fiber Optic, jaringan 5G Telkom, transmisi gelombang, & wireless.</p>
                        </div>
                        <button onclick="selectMajor('TJA')" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-red-600 text-xs font-semibold text-white transition-all cursor-pointer">
                            Daftar di Jurusan Ini
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sambutan Kepala Sekolah -->
            <div class="p-6 sm:p-8 rounded-3xl glass-panel border border-zinc-800 flex flex-col sm:flex-row items-center gap-6">
                <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl red-gradient flex items-center justify-center text-white text-4xl shrink-0 shadow-xl">
                    <i class="fa-solid fa-user-tie"></i>
                </div>
                <div class="space-y-2 text-center sm:text-left">
                    <span class="text-[10px] font-bold tracking-widest text-red-400 uppercase">Sambutan Kepala Sekolah</span>
                    <h3 class="text-lg sm:text-xl font-bold text-white">Mempersiapkan Talenta Digital Siap Tempur</h3>
                    <p class="text-xs text-zinc-400 leading-relaxed italic">
                        "Selamat datang di SMK Telkom Bandung. Kami berkomitmen menyelenggarakan pendidikan vokasi berkarakter disiplin Telkom, berwawasan global, dan memiliki integritas moral tinggi untuk masa depan Indonesia."
                    </p>
                    <div class="text-xs font-bold text-white pt-1">Drs. H. Ahmad Fauzi, M.Kom. <span class="text-zinc-500 font-normal">- Kepala Sekolah</span></div>
                </div>
            </div>
        </section>

        <!-- ===== PAGE 2: JURUSAN & PROGRAM KEAHLIAN ===== -->
        <section id="page-jurusan" class="page-view hidden space-y-8">
            <div class="border-b border-zinc-800 pb-4">
                <h2 class="text-2xl font-bold text-white">Rincian 4 Program Keahlian</h2>
                <p class="text-xs text-zinc-400">Pilih jurusan yang sesuai dengan minat dan bakat teknologi Anda</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 rounded-2xl glass-panel border-l-4 border-l-red-500 space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-bold text-white">1. Rekayasa Perangkat Lunak (RPL)</h3>
                        <span class="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-mono font-bold">Kuota: 120 Siswa</span>
                    </div>
                    <p class="text-xs text-zinc-400 leading-relaxed">
                        Mempelajari pembuatan aplikasi web modern, sistem basis data, pemrograman mobile (Flutter/React Native), dan metodologi Agile Scrum standar software house.
                    </p>
                    <div class="space-y-1.5 text-xs text-zinc-300">
                        <div class="font-semibold text-white">Materi Utama:</div>
                        <div>• Fullstack JavaScript / Python / PHP Frameworks</div>
                        <div>• Database SQL & NoSQL Architecture</div>
                        <div>• Sertifikasi Internasional: Oracle Certified Associate</div>
                    </div>
                    <button onclick="selectMajor('RPL')" class="w-full py-2.5 rounded-xl red-gradient text-white text-xs font-bold hover:brightness-110 cursor-pointer">
                        Pilih Jurusan RPL di Formulir PPDB
                    </button>
                </div>

                <div class="p-6 rounded-2xl glass-panel border-l-4 border-l-white space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-bold text-white">2. Teknik Komputer & Jaringan (TKJ)</h3>
                        <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold">Kuota: 120 Siswa</span>
                    </div>
                    <p class="text-xs text-zinc-400 leading-relaxed">
                        Menguasai instalasi jaringan skala korporat, administrasi server Linux/Windows, mikrotik, virtualisasi cloud server, dan pertahanan siber.
                    </p>
                    <div class="space-y-1.5 text-xs text-zinc-300">
                        <div class="font-semibold text-white">Materi Utama:</div>
                        <div>• Routing & Switching Cisco / MikroTik MTCNA</div>
                        <div>• Cloud Infrastructure & Linux SysAdmin</div>
                        <div>• Sertifikasi: CCNA & CompTIA Network+</div>
                    </div>
                    <button onclick="selectMajor('TKJ')" class="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold cursor-pointer">
                        Pilih Jurusan TKJ di Formulir PPDB
                    </button>
                </div>

                <div class="p-6 rounded-2xl glass-panel border-l-4 border-l-red-500 space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-bold text-white">3. Desain Komunikasi Visual (DKV)</h3>
                        <span class="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-mono font-bold">Kuota: 90 Siswa</span>
                    </div>
                    <p class="text-xs text-zinc-400 leading-relaxed">
                        Fokus pada estetika grafis modern, perancangan antarmuka digital (Figma UI/UX), motion graphics, videografi, dan model 3D interaktif.
                    </p>
                    <div class="space-y-1.5 text-xs text-zinc-300">
                        <div class="font-semibold text-white">Materi Utama:</div>
                        <div>• Adobe Creative Suite & Blender 3D</div>
                        <div>• UI/UX Prototyping & Design System</div>
                        <div>• Sertifikasi: Adobe Certified Professional (ACP)</div>
                    </div>
                    <button onclick="selectMajor('DKV')" class="w-full py-2.5 rounded-xl red-gradient text-white text-xs font-bold hover:brightness-110 cursor-pointer">
                        Pilih Jurusan DKV di Formulir PPDB
                    </button>
                </div>

                <div class="p-6 rounded-2xl glass-panel border-l-4 border-l-white space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-bold text-white">4. Teknik Jaringan Akses Telekomunikasi (TJA)</h3>
                        <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold">Kuota: 90 Siswa</span>
                    </div>
                    <p class="text-xs text-zinc-400 leading-relaxed">
                        Jurusan ciri khas Telkom dengan keahlian teknologi transmisi serat optik (FTTH), sistem komunikasi seluler base station (BTS), dan instalasi broadband.
                    </p>
                    <div class="space-y-1.5 text-xs text-zinc-300">
                        <div class="font-semibold text-white">Materi Utama:</div>
                        <div>• Penyambungan & Pengukuran Serat Optik (OTDR)</div>
                        <div>• Sistem Transmisi Radio & Antena 4G/5G</div>
                        <div>• Sertifikasi: BNSP Teknisi Instalasi Fiber Optic</div>
                    </div>
                    <button onclick="selectMajor('TJA')" class="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold cursor-pointer">
                        Pilih Jurusan TJA di Formulir PPDB
                    </button>
                </div>
            </div>
        </section>

        <!-- ===== PAGE 3: PPDB ONLINE REGISTRATION ===== -->
        <section id="page-ppdb" class="page-view hidden space-y-8 max-w-4xl mx-auto">
            <div class="p-6 sm:p-8 rounded-3xl glass-panel border border-red-500/30 space-y-6 shadow-2xl">
                <div class="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold">
                            <i class="fa-solid fa-file-circle-check"></i> FORMULIR RESMI PPDB 2026/2027
                        </div>
                        <h2 class="text-xl sm:text-2xl font-extrabold text-white mt-1">Pendaftaran Calon Peserta Didik Baru</h2>
                        <p class="text-xs text-zinc-400">Isi data Anda secara lengkap dan benar untuk mendapatkan Nomor Registrasi Ujian.</p>
                    </div>
                </div>

                <form id="ppdb-form" onsubmit="handlePpdbSubmit(event)" class="space-y-5 text-xs">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="font-semibold text-zinc-300">Nomor Induk Siswa Nasional (NISN) *</label>
                            <input id="reg-nisn" type="text" required maxlength="10" placeholder="10 digit angka NISN" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="font-semibold text-zinc-300">Nama Lengkap Calon Siswa *</label>
                            <input id="reg-name" type="text" required placeholder="Nama sesuai ijazah/akta" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="font-semibold text-zinc-300">Asal Sekolah (SMP/MTs) *</label>
                            <input id="reg-school" type="text" required placeholder="Contoh: SMP Negeri 1 Bandung" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="font-semibold text-zinc-300">Pilihan Program Keahlian (Jurusan) *</label>
                            <select id="reg-major" required class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500 cursor-pointer">
                                <option value="RPL">RPL - Rekayasa Perangkat Lunak</option>
                                <option value="TKJ">TKJ - Teknik Komputer & Jaringan</option>
                                <option value="DKV">DKV - Desain Komunikasi Visual</option>
                                <option value="TJA">TJA - Teknik Jaringan Akses Telekomunikasi</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="font-semibold text-zinc-300">Nilai Rata-Rata Rapor Semester 1-5 *</label>
                            <input id="reg-score" type="number" step="0.1" min="60" max="100" required placeholder="Contoh: 86.5" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="font-semibold text-zinc-300">Nomor WhatsApp Aktif (Orang Tua / Siswa) *</label>
                            <input id="reg-phone" type="tel" required placeholder="08xxxxxxxxxx" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500" />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="font-semibold text-zinc-300">Alamat Lengkap Domisili *</label>
                        <textarea id="reg-address" rows="2" required placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"></textarea>
                    </div>

                    <div class="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 flex items-start gap-2.5">
                        <input id="reg-agree" type="checkbox" required class="mt-0.5 rounded text-red-600 focus:ring-0" />
                        <label for="reg-agree" class="cursor-pointer text-[11px] leading-relaxed">
                            Saya menyatakan bahwa data yang diisikan adalah benar dan bersedia mengikuti prosedur seleksi PPDB SMK Telkom Bandung Tahun Ajaran 2026/2027.
                        </label>
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="w-full py-3.5 rounded-xl red-gradient text-white text-sm font-bold shadow-xl shadow-red-600/30 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <i class="fa-solid fa-paper-plane"></i>
                            <span>Kirim Pendaftaran & Dapatkan Kartu Ujian</span>
                        </button>
                    </div>
                </form>
            </div>
        </section>

        <!-- ===== PAGE 4: PORTAL PANITIA / ADMIN PPDB ===== -->
        <section id="page-admin" class="page-view hidden space-y-6">
            <div class="p-5 sm:p-6 rounded-2xl glass-panel border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-xl red-gradient flex items-center justify-center text-white text-lg shadow-md">
                        <i class="fa-solid fa-clipboard-list"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 class="text-base font-bold text-white">Portal Panitia PPDB Online</h3>
                            <span class="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-[9px] font-bold">DATABASE ADMIN</span>
                        </div>
                        <p class="text-xs text-zinc-400">Verifikasi berkas, pantau kuota jurusan, dan kelola kelulusan pendaftar</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button onclick="exportPpdbCSV()" class="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer">
                        <i class="fa-solid fa-file-csv text-xs"></i>
                        <span>Ekspor Data CSV</span>
                    </button>
                    <button onclick="resetMockData()" class="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-400 border border-zinc-700 transition-colors cursor-pointer" title="Muat Ulang Data Awal">
                        <i class="fa-solid fa-rotate-right text-xs"></i>
                    </button>
                </div>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div class="p-4 rounded-xl glass-panel space-y-1">
                    <span class="text-[11px] text-zinc-400">Total Pendaftar Masuk</span>
                    <div id="adm-total" class="text-2xl font-extrabold text-white">0</div>
                    <span class="text-[10px] text-zinc-500">Sistem PPDB Live</span>
                </div>
                <div class="p-4 rounded-xl glass-panel space-y-1">
                    <span class="text-[11px] text-zinc-400">Status Terverifikasi</span>
                    <div id="adm-verified" class="text-2xl font-extrabold text-emerald-400">0</div>
                    <span class="text-[10px] text-emerald-500/80">Berkas Valid</span>
                </div>
                <div class="p-4 rounded-xl glass-panel space-y-1">
                    <span class="text-[11px] text-zinc-400">Menunggu Seleksi</span>
                    <div id="adm-pending" class="text-2xl font-extrabold text-amber-400">0</div>
                    <span class="text-[10px] text-amber-500/80">Perlu Review</span>
                </div>
                <div class="p-4 rounded-xl glass-panel space-y-1">
                    <span class="text-[11px] text-zinc-400">Rata-Rata Nilai</span>
                    <div id="adm-avg" class="text-2xl font-extrabold text-red-400">0.0</div>
                    <span class="text-[10px] text-zinc-500">Nilai Rapor Gabungan</span>
                </div>
            </div>

            <!-- Search & Filter -->
            <div class="p-4 rounded-xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div class="relative w-full sm:w-72">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"></i>
                    <input id="adm-search" oninput="renderAdminTable()" type="text" placeholder="Cari pendaftar atau asal SMP..." class="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500" />
                </div>
                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <select id="adm-filter-major" onchange="renderAdminTable()" class="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none cursor-pointer flex-1 sm:flex-initial">
                        <option value="all">Semua Jurusan</option>
                        <option value="RPL">RPL</option>
                        <option value="TKJ">TKJ</option>
                        <option value="DKV">DKV</option>
                        <option value="TJA">TJA</option>
                    </select>
                    <select id="adm-filter-status" onchange="renderAdminTable()" class="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none cursor-pointer flex-1 sm:flex-initial">
                        <option value="all">Semua Status</option>
                        <option value="Terverifikasi">Terverifikasi</option>
                        <option value="Proses">Proses</option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto rounded-2xl border border-zinc-800 glass-panel shadow-inner">
                <table class="w-full text-left text-xs">
                    <thead class="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-[11px] font-mono">
                        <tr>
                            <th class="p-3.5">No. Reg</th>
                            <th class="p-3.5">NISN & Nama</th>
                            <th class="p-3.5">Asal Sekolah</th>
                            <th class="p-3.5">Jurusan</th>
                            <th class="p-3.5">Nilai</th>
                            <th class="p-3.5">Status</th>
                            <th class="p-3.5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="adm-table-body" class="divide-y divide-zinc-800 text-zinc-300">
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <!-- FOOTER -->
    <footer class="mt-auto border-t border-zinc-800 bg-zinc-950/70 py-8 px-4 sm:px-8 text-xs text-zinc-500">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-between">
            <div class="space-y-1 text-center md:text-left">
                <div class="font-bold text-white text-sm">SMK TELKOM BANDUNG</div>
                <div>Jl. Radio Palasari Road Dayeuhkolot, Kab. Bandung, Jawa Barat 40257</div>
                <div>Telp: (022) 5224138 • WhatsApp CS: 0812-3456-7890</div>
            </div>
            <div class="text-center space-y-1">
                <div class="text-zinc-400 font-medium">Yayasan Pendidikan Telkom (YPT)</div>
                <div class="text-[11px]">&copy; 2026 SMK Telkom Bandung. Hak Cipta Dilindungi.</div>
            </div>
            <div class="flex items-center justify-center md:justify-end gap-3 text-base text-zinc-400">
                <a href="#" class="hover:text-red-500 transition-colors"><i class="fa-brands fa-instagram"></i></a>
                <a href="#" class="hover:text-red-500 transition-colors"><i class="fa-brands fa-youtube"></i></a>
                <a href="#" class="hover:text-red-500 transition-colors"><i class="fa-brands fa-facebook"></i></a>
                <a href="#" class="hover:text-red-500 transition-colors"><i class="fa-brands fa-tiktok"></i></a>
            </div>
        </div>
    </footer>

    <!-- MODAL BUKTI PENDAFTARAN -->
    <div id="modal-receipt" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
        <div class="bg-zinc-900 border border-red-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div class="flex justify-between items-start border-b border-zinc-800 pb-3">
                <div>
                    <span class="px-2 py-0.5 rounded bg-red-600/20 text-red-400 text-[10px] font-bold uppercase">Bukti Resmi Registrasi</span>
                    <h3 class="font-bold text-white text-base mt-1">Kartu Pendaftaran PPDB 2026</h3>
                </div>
                <button onclick="closeReceiptModal()" class="text-zinc-400 hover:text-white p-1 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div id="receipt-content" class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                <!-- Injected via JS -->
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
                <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-print text-xs"></i>
                    <span>Cetak Kartu</span>
                </button>
                <button onclick="closeReceiptModal()" class="px-5 py-2 rounded-xl red-gradient text-white font-bold cursor-pointer">
                    Selesai
                </button>
            </div>
        </div>
    </div>

    <!-- TOAST -->
    <div id="toast" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
        <div class="bg-zinc-900 border border-zinc-700 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-emerald-400"></i>
            <span id="toast-text">Operasi berhasil dilakukan.</span>
        </div>
    </div>

    <!-- LOGIC SCRIPT -->
    <script>
        var PPDB_STORAGE_KEY = 'smk_telkom_ppdb_data';

        var initialRegistrants = [
            { regNo: 'REG-2026-001', nisn: '0081234567', name: 'Rizky Pratama', school: 'SMPN 1 Bandung', major: 'RPL', score: 88.5, phone: '081234567890', status: 'Terverifikasi' },
            { regNo: 'REG-2026-002', nisn: '0089876543', name: 'Annisa Rahmawati', school: 'SMPN 5 Bandung', major: 'TKJ', score: 91.0, phone: '081398765432', status: 'Terverifikasi' },
            { regNo: 'REG-2026-003', nisn: '0085544332', name: 'Dimas Kurniawan', school: 'SMP Telkom Bandung', major: 'DKV', score: 84.0, phone: '081554433221', status: 'Proses' },
            { regNo: 'REG-2026-004', nisn: '0081122334', name: 'Nabila Syakira', school: 'SMPN 2 Dayeuhkolot', major: 'TJA', score: 87.2, phone: '081223344556', status: 'Terverifikasi' }
        ];

        function getRegistrants() {
            var data = localStorage.getItem(PPDB_STORAGE_KEY);
            if (!data) {
                localStorage.setItem(PPDB_STORAGE_KEY, JSON.stringify(initialRegistrants));
                return initialRegistrants;
            }
            return JSON.parse(data);
        }

        function saveRegistrants(list) {
            localStorage.setItem(PPDB_STORAGE_KEY, JSON.stringify(list));
        }

        function navigatePage(pageId) {
            var pages = document.querySelectorAll('.page-view');
            pages.forEach(function(p) { p.classList.add('hidden'); });
            var target = document.getElementById('page-' + pageId);
            if (target) target.classList.remove('hidden');

            var btns = document.querySelectorAll('.nav-btn');
            btns.forEach(function(b) {
                b.className = 'nav-btn px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all';
            });
            var active = document.getElementById('nav-' + pageId);
            if (active) {
                active.className = 'nav-btn px-3 py-1.5 rounded-lg font-semibold bg-red-600 text-white transition-all';
            }

            if (pageId === 'admin') renderAdminTable();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function selectMajor(majorCode) {
            navigatePage('ppdb');
            var select = document.getElementById('reg-major');
            if (select) select.value = majorCode;
        }

        function handlePpdbSubmit(e) {
            e.preventDefault();
            var nisn = document.getElementById('reg-nisn').value.trim();
            var name = document.getElementById('reg-name').value.trim();
            var school = document.getElementById('reg-school').value.trim();
            var major = document.getElementById('reg-major').value;
            var score = parseFloat(document.getElementById('reg-score').value);
            var phone = document.getElementById('reg-phone').value.trim();

            var list = getRegistrants();
            var nextNumber = String(list.length + 1).padStart(3, '0');
            var regNo = 'REG-2026-' + nextNumber;

            var newEntry = {
                regNo: regNo,
                nisn: nisn,
                name: name,
                school: school,
                major: major,
                score: score,
                phone: phone,
                status: 'Proses'
            };

            list.unshift(newEntry);
            saveRegistrants(list);

            document.getElementById('ppdb-form').reset();
            showReceipt(newEntry);
            showToast('Pendaftaran Anda berhasil! Simpan kartu pendaftaran Anda.');
        }

        function showReceipt(entry) {
            var content = document.getElementById('receipt-content');
            content.innerHTML = 
                '<div class="flex items-center justify-between border-b border-zinc-800 pb-2">' +
                    '<span class="text-zinc-400">Nomor Registrasi:</span>' +
                    '<span class="font-mono font-extrabold text-red-400 text-sm">' + entry.regNo + '</span>' +
                '</div>' +
                '<div class="flex items-center justify-between">' +
                    '<span class="text-zinc-400">Nama Calon Siswa:</span>' +
                    '<span class="font-bold text-white">' + entry.name + '</span>' +
                '</div>' +
                '<div class="flex items-center justify-between">' +
                    '<span class="text-zinc-400">NISN:</span>' +
                    '<span class="font-mono text-zinc-300">' + entry.nisn + '</span>' +
                '</div>' +
                '<div class="flex items-center justify-between">' +
                    '<span class="text-zinc-400">Asal Sekolah:</span>' +
                    '<span class="text-zinc-300">' + entry.school + '</span>' +
                '</div>' +
                '<div class="flex items-center justify-between">' +
                    '<span class="text-zinc-400">Pilihan Jurusan:</span>' +
                    '<span class="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-bold">' + entry.major + '</span>' +
                '</div>' +
                '<div class="flex items-center justify-between">' +
                    '<span class="text-zinc-400">Nilai Rata-Rata Rapor:</span>' +
                    '<span class="font-bold text-emerald-400">' + entry.score + '</span>' +
                '</div>' +
                '<div class="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">' +
                    '<i class="fa-solid fa-circle-info text-red-400 mr-1"></i> Harap bawa kartu ini atau simpan bukti PDF saat verifikasi berkas fisik di kampus SMK Telkom Bandung.' +
                '</div>';

            var modal = document.getElementById('modal-receipt');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeReceiptModal() {
            var modal = document.getElementById('modal-receipt');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function renderAdminTable() {
            var list = getRegistrants();
            var q = (document.getElementById('adm-search') ? document.getElementById('adm-search').value : '').toLowerCase();
            var fMajor = document.getElementById('adm-filter-major') ? document.getElementById('adm-filter-major').value : 'all';
            var fStatus = document.getElementById('adm-filter-status') ? document.getElementById('adm-filter-status').value : 'all';

            var filtered = list.filter(function(item) {
                var matchQuery = item.name.toLowerCase().includes(q) || item.school.toLowerCase().includes(q) || item.regNo.toLowerCase().includes(q);
                var matchMajor = fMajor === 'all' || item.major === fMajor;
                var matchStatus = fStatus === 'all' || item.status === fStatus;
                return matchQuery && matchMajor && matchStatus;
            });

            // Update stats
            document.getElementById('adm-total').textContent = list.length;
            var verifiedCount = list.filter(function(i) { return i.status === 'Terverifikasi'; }).length;
            document.getElementById('adm-verified').textContent = verifiedCount;
            document.getElementById('adm-pending').textContent = list.length - verifiedCount;
            
            var totalScore = list.reduce(function(acc, cur) { return acc + (cur.score || 0); }, 0);
            var avg = list.length > 0 ? (totalScore / list.length).toFixed(1) : '0.0';
            document.getElementById('adm-avg').textContent = avg;

            var tbody = document.getElementById('adm-table-body');
            tbody.innerHTML = '';

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="p-6 text-center text-zinc-500 font-medium">Tidak ada data calon siswa yang cocok.</td></tr>';
                return;
            }

            filtered.forEach(function(item) {
                var tr = document.createElement('tr');
                tr.className = 'hover:bg-zinc-900/60 transition-colors';
                tr.innerHTML = 
                    '<td class="p-3.5 font-mono text-zinc-400">' + item.regNo + '</td>' +
                    '<td class="p-3.5"><div class="font-bold text-white">' + item.name + '</div><div class="text-[10px] text-zinc-500 font-mono">NISN: ' + item.nisn + '</div></td>' +
                    '<td class="p-3.5 text-zinc-300">' + item.school + '</td>' +
                    '<td class="p-3.5"><span class="px-2 py-0.5 rounded font-bold text-[10px] bg-red-600/20 text-red-400">' + item.major + '</span></td>' +
                    '<td class="p-3.5 font-bold text-white">' + item.score + '</td>' +
                    '<td class="p-3.5">' +
                        (item.status === 'Terverifikasi'
                            ? '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px]">Terverifikasi</span>'
                            : '<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold text-[10px]">Proses</span>') +
                    '</td>' +
                    '<td class="p-3.5 text-right space-x-1">' +
                        '<button onclick="toggleStatus(\'' + item.regNo + '\')" class="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200 cursor-pointer" title="Ubah Status Verifikasi"><i class="fa-solid fa-check text-[10px]"></i></button>' +
                        '<button onclick="deleteRegistrant(\'' + item.regNo + '\')" class="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-red-900/50 text-[11px] text-zinc-400 hover:text-red-400 cursor-pointer" title="Hapus Data"><i class="fa-solid fa-trash text-[10px]"></i></button>' +
                    '</td>';
                tbody.appendChild(tr);
            });
        }

        function toggleStatus(regNo) {
            var list = getRegistrants();
            var item = list.find(function(i) { return i.regNo === regNo; });
            if (item) {
                item.status = item.status === 'Terverifikasi' ? 'Proses' : 'Terverifikasi';
                saveRegistrants(list);
                renderAdminTable();
                showToast('Status registrasi ' + regNo + ' diperbarui.');
            }
        }

        function deleteRegistrant(regNo) {
            if (!confirm('Hapus calon siswa dengan nomor registrasi ' + regNo + '?')) return;
            var list = getRegistrants();
            var updated = list.filter(function(i) { return i.regNo !== regNo; });
            saveRegistrants(updated);
            renderAdminTable();
            showToast('Data calon siswa dihapus.');
        }

        function exportPpdbCSV() {
            var list = getRegistrants();
            if (list.length === 0) return alert('Belum ada data pendaftar.');
            var header = 'No Registrasi,NISN,Nama Lengkap,Asal Sekolah,Pilihan Jurusan,Nilai Rapor,WhatsApp,Status\n';
            var rows = list.map(function(i) {
                return [i.regNo, i.nisn, '"' + i.name + '"', '"' + i.school + '"', i.major, i.score, i.phone, i.status].join(',');
            }).join('\n');
            var blob = new Blob([header + rows], { type: 'text/csv' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'ppdb_smk_telkom_bandung_2026.csv';
            a.click();
        }

        function resetMockData() {
            saveRegistrants(initialRegistrants);
            renderAdminTable();
            showToast('Data awal pendaftar dimuat ulang.');
        }

        function showToast(msg) {
            var toast = document.getElementById('toast');
            var text = document.getElementById('toast-text');
            if (!toast || !text) return;
            text.textContent = msg;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(function() {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }

        document.addEventListener('DOMContentLoaded', function() {
            renderAdminTable();
        });
    </script>
</body>
</html>`;

const projectsFile = path.resolve('./src/data/projects.json');
const data = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
const defaultProj = data.find(p => p.id === 'proj_default');
if (defaultProj) {
    defaultProj.name = 'SMK Telkom Bandung - Web Resmi & PPDB Online';
    defaultProj.category = 'Pendidikan & Sekolah';
    defaultProj.mode = 'fullstack';
    defaultProj.code = telkomHtml;
    defaultProj.updatedAt = new Date().toISOString();
    fs.writeFileSync(projectsFile, JSON.stringify(data, null, 2), 'utf8');
    console.log('SUCCESS: proj_default updated!');
} else {
    console.log('NOT FOUND');
}
