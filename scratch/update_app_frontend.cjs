const fs = require('fs');

const filePath = 'c:/Users/Akamale/Documents/PROJECT WEB APP/2.Web Task Development/src/pages/app.astro';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace Section 2 HTML
const oldSectionStart = `<!-- 2. Front End Section -->`;
const oldSectionEnd = `<!-- 3. Backend Section -->`;

const startIndex = content.indexOf(oldSectionStart);
const endIndex = content.indexOf(oldSectionEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find section 2 boundaries");
  process.exit(1);
}

const newSection2 = `<!-- 2. Front End Section -->
        <section id="frontend" class="slide-panel slide-next relative z-10 pb-4">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-paintbrush text-cyan-400 text-sm"></i>
                </div>
                <h2 class="text-2xl font-bold">2. Desain & Visual Web</h2>
            </div>
            <p class="text-gray-400 mb-6 text-sm">Rancang dan susun tampilan website impianmu secara nyata dengan bantuan AI Web Canvas Studio.</p>

            <!-- ✦ AI Web Canvas Studio Banner ✦ -->
            <div class="mb-6 p-5 rounded-2xl glass-panel border border-cyan-500/30 relative overflow-hidden shadow-[0_10px_35px_-10px_rgba(6,182,212,0.25)] bg-gradient-to-r from-cyan-950/20 via-neutral-900/60 to-blue-950/20">
                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[11px] font-semibold text-cyan-300 mb-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            AI Web Canvas Studio
                        </div>
                        <h3 class="text-base font-bold text-white tracking-tight">Pembuat & Penampil Web Interaktif</h3>
                        <p class="text-xs text-gray-400 mt-1 max-w-xl">
                            Rancang, edit teks langsung di pratinjau, dan tinjau live preview website Anda secara real-time bersama Gemini AI Agent.
                        </p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button
                            type="button"
                            onclick="window.openFrontendCanvas ? window.openFrontendCanvas() : null"
                            class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer"
                        >
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            <span>Buka Canvas Studio</span>
                        </button>
                        <button
                            type="button"
                            onclick="window.openFrontendCanvas ? window.openFrontendCanvas('Buatkan halaman Landing Page web lengkap dan responsif sesuai spesifikasi Planning aktif') : null"
                            class="px-3.5 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-neutral-200 font-semibold text-xs border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <i class="fa-solid fa-bolt text-cyan-400"></i>
                            <span>Bangun dari Planning</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-col gap-3">
                <!-- Task FE 1 -->
                <label class="task-container flex items-center gap-4 p-4 rounded-xl glass-panel cursor-pointer">
                    <input type="checkbox" id="task-fe-1" class="task-checkbox hidden">
                    <div class="w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center shrink-0 transition-colors">
                        <i class="fa-solid fa-check text-white text-xs opacity-0 transition-opacity"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                            <h4 class="task-title font-medium text-gray-200 transition-all duration-300">1. Halaman Pembuka (Hero & Judul)</h4>
                            <button type="button" class="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 shrink-0" onclick="event.preventDefault(); event.stopPropagation(); window.openFrontendCanvas ? window.openFrontendCanvas('Rancang bagian Pembuka (Hero Section) dengan Headline memikat, subheadline penjelasan, tombol aksi CTA, dan visual showcase modern sesuai rencana') : null">
                                <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Canvas
                            </button>
                        </div>
                        <p class="text-xs text-gray-400 mt-1 task-desc">Rancang headline memikat, tombol ajakan bertindak (CTA), dan visual pembuka bisnis.</p>
                    </div>
                
                    <button type="button" class="task-detail-btn shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300 self-center" data-task="task-fe-1" onclick="event.preventDefault(); event.stopPropagation(); openTaskModal('task-fe-1');" aria-label="Lihat detail proses task-fe-1"><i class="fa-solid fa-circle-info text-base"></i></button>
                </label>

                <!-- Task FE 2 -->
                <label class="task-container flex items-center gap-4 p-4 rounded-xl glass-panel cursor-pointer">
                    <input type="checkbox" id="task-fe-2" class="task-checkbox hidden">
                    <div class="w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center shrink-0 transition-colors">
                        <i class="fa-solid fa-check text-white text-xs opacity-0 transition-opacity"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                            <h4 class="task-title font-medium text-gray-200 transition-all duration-300">2. Navigasi & Menu Mobile</h4>
                            <button type="button" class="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 shrink-0" onclick="event.preventDefault(); event.stopPropagation(); window.openFrontendCanvas ? window.openFrontendCanvas('Buatkan komponen Header Navigasi responsif dengan logo brand, link menu penting, tombol aksi, dan menu mobile hamburger drawer') : null">
                                <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Canvas
                            </button>
                        </div>
                        <p class="text-xs text-gray-400 mt-1 task-desc">Menu navigasi yang bersih dan drawer hamburger responsif saat dibuka di layar HP.</p>
                    </div>
                
                    <button type="button" class="task-detail-btn shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300 self-center" data-task="task-fe-2" onclick="event.preventDefault(); event.stopPropagation(); openTaskModal('task-fe-2');" aria-label="Lihat detail proses task-fe-2"><i class="fa-solid fa-circle-info text-base"></i></button>
                </label>

                <!-- Task FE 3 -->
                <label class="task-container flex items-center gap-4 p-4 rounded-xl glass-panel cursor-pointer">
                    <input type="checkbox" id="task-fe-3" class="task-checkbox hidden">
                    <div class="w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center shrink-0 transition-colors">
                        <i class="fa-solid fa-check text-white text-xs opacity-0 transition-opacity"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                            <h4 class="task-title font-medium text-gray-200 transition-all duration-300">3. Showcase Layanan & Produk</h4>
                            <button type="button" class="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 shrink-0" onclick="event.preventDefault(); event.stopPropagation(); window.openFrontendCanvas ? window.openFrontendCanvas('Buatkan bagian Showcase Produk & Katalog Layanan dengan kartu modern, foto produk, deskripsi singkat, dan tombol pesan') : null">
                                <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Canvas
                            </button>
                        </div>
                        <p class="text-xs text-gray-400 mt-1 task-desc">Tampilkan produk, paket layanan, atau galeri karya terbaik bisnis Anda.</p>
                    </div>
                
                    <button type="button" class="task-detail-btn shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300 self-center" data-task="task-fe-3" onclick="event.preventDefault(); event.stopPropagation(); openTaskModal('task-fe-3');" aria-label="Lihat detail proses task-fe-3"><i class="fa-solid fa-circle-info text-base"></i></button>
                </label>

                <!-- Task FE 4 -->
                <label class="task-container flex items-center gap-4 p-4 rounded-xl glass-panel cursor-pointer">
                    <input type="checkbox" id="task-fe-4" class="task-checkbox hidden">
                    <div class="w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center shrink-0 transition-colors">
                        <i class="fa-solid fa-check text-white text-xs opacity-0 transition-opacity"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                            <h4 class="task-title font-medium text-gray-200 transition-all duration-300">4. Fitur Aksi (WhatsApp & Form Booking)</h4>
                            <button type="button" class="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 shrink-0" onclick="event.preventDefault(); event.stopPropagation(); window.openFrontendCanvas ? window.openFrontendCanvas('Sisipkan tombol WhatsApp melayang dan formulir booking/pesan interaktif yang mudah diisi oleh calon pelanggan') : null">
                                <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Canvas
                            </button>
                        </div>
                        <p class="text-xs text-gray-400 mt-1 task-desc">Fasilitasi pengunjung untuk chat WhatsApp langsung, order, dan formulir booking.</p>
                    </div>
                
                    <button type="button" class="task-detail-btn shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300 self-center" data-task="task-fe-4" onclick="event.preventDefault(); event.stopPropagation(); openTaskModal('task-fe-4');" aria-label="Lihat detail proses task-fe-4"><i class="fa-solid fa-circle-info text-base"></i></button>
                </label>

                <!-- Task FE 5 -->
                <label class="task-container flex items-center gap-4 p-4 rounded-xl glass-panel cursor-pointer">
                    <input type="checkbox" id="task-fe-5" class="task-checkbox hidden">
                    <div class="w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center shrink-0 transition-colors">
                        <i class="fa-solid fa-check text-white text-xs opacity-0 transition-opacity"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                            <h4 class="task-title font-medium text-gray-200 transition-all duration-300">5. Kustomisasi Gaya, Warna & Animasi</h4>
                            <button type="button" class="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 shrink-0" onclick="event.preventDefault(); event.stopPropagation(); window.openFrontendCanvas ? window.openFrontendCanvas('Poles estetika website: harmonisasikan palet warna brand, efek hover, micro-interactions, dan animasi scroll halus') : null">
                                <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Canvas
                            </button>
                        </div>
                        <p class="text-xs text-gray-400 mt-1 task-desc">Terapkan palet warna brand, tipografi modern, dan animasi mikro yang memukau.</p>
                    </div>
                
                    <button type="button" class="task-detail-btn shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300 self-center" data-task="task-fe-5" onclick="event.preventDefault(); event.stopPropagation(); openTaskModal('task-fe-5');" aria-label="Lihat detail proses task-fe-5"><i class="fa-solid fa-circle-info text-base"></i></button>
                </label>

                <!-- Task FE 6 -->
                <label class="task-container flex items-center gap-4 p-4 rounded-xl glass-panel cursor-pointer">
                    <input type="checkbox" id="task-fe-6" class="task-checkbox hidden">
                    <div class="w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center shrink-0 transition-colors">
                        <i class="fa-solid fa-check text-white text-xs opacity-0 transition-opacity"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                            <h4 class="task-title font-medium text-gray-200 transition-all duration-300">6. Tinjau Tampilan di HP & Komputer</h4>
                            <button type="button" class="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 shrink-0" onclick="event.preventDefault(); event.stopPropagation(); window.openFrontendCanvas ? window.openFrontendCanvas('Optimalkan responsivitas layout agar 100% sempurna di layar HP mobile (375px), tablet (768px), dan laptop desktop') : null">
                                <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Canvas
                            </button>
                        </div>
                        <p class="text-xs text-gray-400 mt-1 task-desc">Uji kenyamanan dan kerapian tata letak di berbagai ukuran layar perangkat.</p>
                    </div>
                
                    <button type="button" class="task-detail-btn shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300 self-center" data-task="task-fe-6" onclick="event.preventDefault(); event.stopPropagation(); openTaskModal('task-fe-6');" aria-label="Lihat detail proses task-fe-6"><i class="fa-solid fa-circle-info text-base"></i></button>
                </label>

                <!-- Special Pages -->
                <div class="pt-4 mt-2 border-t border-white/5">
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block"><i class="fa-solid fa-layer-group mr-1"></i> Halaman Lanjutan / Khusus (Opsional)</span>
                    
                    <label class="task-container flex items-center gap-4 p-4 rounded-xl glass-panel cursor-pointer mb-3 border-l-2 border-l-cyan-500">
                        <input type="checkbox" id="task-fe-9" class="task-checkbox hidden">
                        <div class="w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center shrink-0 transition-colors">
                            <i class="fa-solid fa-check text-white text-xs opacity-0 transition-opacity"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-2">
                                <h4 class="task-title font-medium text-gray-200 transition-all duration-300">7. Halaman Login & Registrasi</h4>
                                <button type="button" class="px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 shrink-0" onclick="event.preventDefault(); event.stopPropagation(); window.openFrontendCanvas ? window.openFrontendCanvas('Buatkan halaman Login & Registrasi modern yang bersih dengan validasi form dan toggle lihat password') : null">
                                    <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Canvas
                                </button>
                            </div>
                            <p class="text-xs text-gray-400 mt-1 task-desc">Form login/masuk akun yang bersih dan terisolasi tanpa gangguan menu lain.</p>
                        </div>
                    
                        <button type="button" class="task-detail-btn shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300 self-center" data-task="task-fe-9" onclick="event.preventDefault(); event.stopPropagation(); openTaskModal('task-fe-9');" aria-label="Lihat detail proses task-fe-9"><i class="fa-solid fa-circle-info text-base"></i></button>
                    </label>

                    <label class="task-container flex items-center gap-4 p-4 rounded-xl glass-panel cursor-pointer mb-3 border-l-2 border-l-cyan-500">
                        <input type="checkbox" id="task-fe-10" class="task-checkbox hidden">
                        <div class="w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center shrink-0 transition-colors">
                            <i class="fa-solid fa-check text-white text-xs opacity-0 transition-opacity"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-2">
                                <h4 class="task-title font-medium text-gray-200 transition-all duration-300">8. Profil / Dashboard Pelanggan</h4>
                                <button type="button" class="px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 shrink-0" onclick="event.preventDefault(); event.stopPropagation(); window.openFrontendCanvas ? window.openFrontendCanvas('Buatkan dashboard profil user/pelanggan dengan riwayat pesanan, profil info, dan menu pengaturan akun') : null">
                                    <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Canvas
                                </button>
                            </div>
                            <p class="text-xs text-gray-400 mt-1 task-desc">Area khusus anggota/pelanggan untuk melihat status transaksi dan profil.</p>
                        </div>
                    
                        <button type="button" class="task-detail-btn shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300 self-center" data-task="task-fe-10" onclick="event.preventDefault(); event.stopPropagation(); openTaskModal('task-fe-10');" aria-label="Lihat detail proses task-fe-10"><i class="fa-solid fa-circle-info text-base"></i></button>
                    </label>

                    <label class="task-container flex items-center gap-4 p-4 rounded-xl glass-panel cursor-pointer border-l-2 border-l-cyan-500">
                        <input type="checkbox" id="task-fe-11" class="task-checkbox hidden">
                        <div class="w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center shrink-0 transition-colors">
                            <i class="fa-solid fa-check text-white text-xs opacity-0 transition-opacity"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-2">
                                <h4 class="task-title font-medium text-gray-200 transition-all duration-300">9. Panel Pengelola Konten (CMS)</h4>
                                <button type="button" class="px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 shrink-0" onclick="event.preventDefault(); event.stopPropagation(); window.openFrontendCanvas ? window.openFrontendCanvas('Buatkan panel Admin CMS lengkap dengan ringkasan statistik, tabel kelola produk/pesanan, dan modal edit data') : null">
                                    <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Canvas
                                </button>
                            </div>
                            <p class="text-xs text-gray-400 mt-1 task-desc">Panel admin sederhana bagi pemilik web untuk menambah produk atau melihat pesan masuk.</p>
                        </div>
                    
                        <button type="button" class="task-detail-btn shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300 self-center" data-task="task-fe-11" onclick="event.preventDefault(); event.stopPropagation(); openTaskModal('task-fe-11');" aria-label="Lihat detail proses task-fe-11"><i class="fa-solid fa-circle-info text-base"></i></button>
                    </label>
                </div>
            </div>
        </section>

        `;

content = content.slice(0, startIndex) + newSection2 + content.slice(endIndex);

// 2. Update taskDetails for FE tasks
const oldFeDetailsTarget = `'task-fe-1': {`;
const oldFeDetailsEnd = `'task-fe-9': {`;

const feStartIdx = content.indexOf(oldFeDetailsTarget);
const feEndIdx = content.indexOf(oldFeDetailsEnd);

if (feStartIdx !== -1 && feEndIdx !== -1) {
  const newFeDetails = `'task-fe-1': {
                category: '2. Desain & Visual Web',
                icon: 'fa-solid fa-star',
                title: '1. Halaman Pembuka (Hero & Judul)',
                detail: \`
                    <p>Bagian pertama yang dilihat pengunjung saat membuka website Anda. Sangat krusial untuk menarik perhatian dalam 3 detik pertama.</p>
                    <p><b>Elemen Kunci:</b></p>
                    <ul class="list-disc list-inside space-y-1">
                        <li><b>Headline Memikat:</b> Jelaskan apa yang bisnis Anda tawarkan secara singkat dan jelas.</li>
                        <li><b>Tombol Aksi Utama (CTA):</b> Tombol 'Pesan Sekarang', 'Konsultasi Gratis', atau 'Hubungi Kami'.</li>
                        <li><b>Visual Menarik:</b> Foto produk unggulan, ilustrasi modern, atau mockup interaktif.</li>
                    </ul>
                \`
            },
            'task-fe-2': {
                category: '2. Desain & Visual Web',
                icon: 'fa-solid fa-bars',
                title: '2. Navigasi & Menu Mobile',
                detail: \`
                    <p>Memastikan pengunjung dapat dengan mudah berpindah antar bagian website baik saat membuka lewat komputer maupun layar HP smartphone.</p>
                    <p><b>Tips Navigasi Ramah Pengunjung:</b></p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Taruh logo toko/bisnis di bagian kiri atas.</li>
                        <li>Sediakan tautan cepat ke 'Layanan', 'Galeri', 'Harga', dan 'Kontak'.</li>
                        <li>Gunakan menu hamburger otomatis saat dibuka di layar HP.</li>
                    </ul>
                \`
            },
            'task-fe-3': {
                category: '2. Desain & Visual Web',
                icon: 'fa-solid fa-tags',
                title: '3. Showcase Layanan & Produk',
                detail: \`
                    <p>Tempat memajang karya terbaik, katalog produk, atau paket jasa yang Anda sediakan kepada calon pelanggan.</p>
                    <p><b>Rekomendasi Isi:</b></p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Kartu produk dengan foto tajam dan deskripsi singkat.</li>
                        <li>Informasi harga atau paket hemat yang jelas.</li>
                        <li>Tombol langsung 'Pesan Produk Ini' via WhatsApp.</li>
                    </ul>
                \`
            },
            'task-fe-4': {
                category: '2. Desain & Visual Web',
                icon: 'fa-brands fa-whatsapp',
                title: '4. Fitur Aksi (WhatsApp & Form Booking)',
                detail: \`
                    <p>Memudahkan pengunjung yang tertarik untuk langsung melakukan transaksi atau bertanya kepada Anda.</p>
                    <p><b>Fitur Interaktif:</b></p>
                    <ul class="list-disc list-inside space-y-1">
                        <li><b>Tombol WhatsApp Melayang:</b> Tombol chat yang selalu terlihat di pojok bawah layar.</li>
                        <li><b>Formulir Pemesanan:</b> Input nama, nomor telepon, tanggal, dan pesan.</li>
                        <li><b>Peta Google Maps:</b> Menunjukkan lokasi toko fisik / kantor Anda secara interaktif.</li>
                    </ul>
                \`
            },
            'task-fe-5': {
                category: '2. Desain & Visual Web',
                icon: 'fa-solid fa-palette',
                title: '5. Kustomisasi Gaya, Warna & Animasi',
                detail: \`
                    <p>Memberikan sentuhan estetika agar website terlihat mewah, kredibel, dan sesuai karakter brand bisnis Anda.</p>
                    <p><b>Fitur di Canvas Studio:</b></p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Pilihan tema 1-klik (Dark Luxury, Clean Minimalist, Natural Emerald, Cyber Neon, dll).</li>
                        <li>Efek hover halus saat kursor mengarah ke tombol atau kartu.</li>
                        <li>Edit teks instan langsung pada layar pratinjau.</li>
                    </ul>
                \`
            },
            'task-fe-6': {
                category: '2. Desain & Visual Web',
                icon: 'fa-solid fa-mobile-screen',
                title: '6. Tinjau Tampilan di HP & Komputer',
                detail: \`
                    <p>Mayoritas pengunjung membuka website dari smartphone. Memastikan tata letak tetap rapi dan tidak berantakan di HP adalah prioritas utama.</p>
                    <p><b>Cara Menguji di Canvas Studio:</b></p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Klik ikon 📱 <b>Mobile (375px)</b> pada toolbar Canvas untuk melihat tampilan HP.</li>
                        <li>Klik ikon 📲 <b>Tablet (768px)</b> untuk melihat tampilan tablet/iPad.</li>
                        <li>Klik ikon 💻 <b>Desktop (100%)</b> untuk tampilan laptop/komputer.</li>
                    </ul>
                \`
            },
            `;
  content = content.slice(0, feStartIdx) + newFeDetails + content.slice(feEndIdx);
}

// 3. Update stepsData array
content = content.replace(
  `{ label: 'Front-End', icon: 'fa-react', type: 'fa-brands', color: '#d4d4d4' }`,
  `{ label: 'Desain Web', icon: 'fa-paintbrush', type: 'fa-solid', color: '#38bdf8' }`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated app.astro for Desain & Visual Web');
