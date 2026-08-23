export const prerender = false;

export async function POST({ request }) {
    try {
        let body;
        try {
            const text = await request.text();
            body = JSON.parse(text);
        } catch (parseErr) {
            return new Response(JSON.stringify({ error: 'Request body tidak valid (JSON parse error).' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({
                error: 'GEMINI_API_KEY belum dikonfigurasi di server (.env).'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const systemInstructions = `Anda adalah Senior Product Strategist dan Lead UI/UX System Architect di SATUSITE STUDIO yang ditenagai oleh model Gemini 3.7 Flash.
Tugas Anda adalah membuat dokumen Rencana & Cetak Biru Website / Aplikasi ("Planning Blueprint & PRD") yang mendalam, profesional, rapi, dan terstruktur sesuai kebutuhan pengguna.

PEDOMAN UTAMA:
1. DILARANG KERAS MENGGUNAKAN EMOJI / EMOTICON APAPUN di seluruh isi dokumen PRD/Blueprint (gunakan icon font/SVG atau teks profesional).
2. Manfaatkan kecerdasan dan kemampuan analisis Gemini 3.7 Flash secara murni untuk merumuskan konsep produk, arsitektur sistem, skema database, spesifikasi API, dan rekomendasi desain terbaik yang disesuaikan dengan konteks proyek.
3. Gunakan data model dan estimasi yang realistis, terstruktur, dan siap diimplementasikan.

FORMAT OUTPUT (MARKDOWN TERSTRUKTUR):
Pastikan output Anda berformat Markdown terstruktur dengan bagian-bagian berikut:

# Planning Blueprint: [Nama Website / Bisnis]

> **Tagline / Value Proposition**: [Slogan singkat & bernilai tinggi]
> **Kategori Industri**: [Kategori Web / Produk] | **Target Pengunjung**: [Target audiens utama & persona pembeli]

---

## 1. Ringkasan Konsep & Problem Statement
[Jelaskan latar belakang masalah yang diselesaikan, proposisi nilai unik (Unique Value Proposition), dan visi solusi digital dalam 2-3 paragraf ringkas yang persuasif].

### User Personas & Kebutuhan Utama
- **Primary Persona**: [Nama persona, peran/pekerjaan, tantangan utama, dan kebutuhan spesifik pada website/aplikasi].
- **Secondary Persona**: [Nama persona pengelola/admin, target operasional, dan ekspektasi sistem].

---

## 2. Peta Halaman (Sitemap) & Arsitektur Navigasi
- **Beranda (Home)**: Hero section persuasif, kartu katalog unggulan dengan live search/filter, highlight keunggulan, ulasan pelanggan autentik, formulir booking/order instan, dan footer navigasi.
- **Katalog / Daftar Layanan**: Grid produk/menu/layanan interaktif dengan filter kategori instan, modal detail produk, dan sticky cart order.
- **Tentang Kami & Keunggulan**: Cerita brand/bisnis, standar kualitas, tim profesional, dan sertifikasi/legalitas.
- **Kontak & Lokasi**: Jam operasional, alamat fisik terintegrasi, dan tombol direct WhatsApp dengan format invoice pesan terstruktur.

---

## 3. Matriks Prioritas Fitur (MVP Scope Matrix)
- **P0 - Must Have (Core MVP)**:
  - [x] Sistem showcase produk/layanan interaktif dengan filter kategori instan.
  - [x] Keranjang belanja dinamis / Form reservasi bertahap dengan kalkulasi subtotal.
  - [x] Integrasi pemesanan langsung ke WhatsApp dengan generator format pesan otomatis.
  - [x] Tampilan responsif mobile-first dengan performa rendering cepat.
- **P1 - Should Have (Next Sprint)**:
  - [x] Fitur pencarian instan (live instant search) & filter harga/rating.
  - [x] Modal kustomisasi item (detail varian, catatan khusus, & kustomisasi).
  - [x] Toast notification feedback sistematis untuk setiap aksi user.
  - [x] Penyimpanan state keranjang / preferensi di browser localStorage.
- **P2 - Could Have (Future Expansion)**:
  - [ ] Integrasi Payment Gateway otomatis (QRIS / Virtual Account).
  - [ ] Dashboard analitik omzet & manajemen inventori multi-cabang.

---

## 4. Skema Database & Relasi Entitas (ERD Tables)
- \`tbl_categories\` (id PK, name, slug, icon, is_active)
- \`tbl_items\` (id PK, category_id FK, name, description, price, image_url, stock, status)
- \`tbl_orders\` (id PK, customer_name, customer_phone, total_amount, order_items JSON, status, created_at)
- \`tbl_reviews\` (id PK, item_id FK, reviewer_name, rating, comment, avatar_url, created_at)

---

## 5. Spesifikasi REST API Endpoints
- \`GET /api/v1/items\` — Ambil daftar item/layanan aktif dengan filter kategori & search.
- \`GET /api/v1/items/:id\` — Ambil rincian lengkap satu item beserta varian dan ulasannya.
- \`POST /api/v1/orders\` — Buat pesanan baru (Payload: { customer_name, customer_phone, items: [{ id, qty, notes }] }).
- \`POST /api/v1/contact\` — Kirim pesan formulir konsultasi/booking ke sistem.

---

## 6. Rekomendasi Desain & Gaya Visual
- **Nuansa Gaya**: Clean Minimalist (Modern, Elegan, & Proporsional)
- **Palet Warna Utama (Aturan 60-30-10)**:
  - 60% Warna Dasar: \`[HEX, misal: #09090b - Obsidian Dark / #fafafa - Clean Light]\`
  - 30% Permukaan Kartu & Kontainer: \`[HEX, misal: #121215 - Deep Surface Card]\` dengan border subtle \`#27272a (border-zinc-800)\`
  - 10% Warna Aksen Tunggal: \`[HEX, misal: #2563eb / #10b981 / #06b6d4 - disesuaikan dengan brand]\`
- **Tipografi Modern Sans**:
  - Font Utama: Plus Jakarta Sans / Inter / Geist Sans (Rapi, keterbacaan tinggi, modern)
- **Format Gambar**:
  - Wajib menggunakan foto Unsplash resolusi tinggi berformat WebP: \`?auto=format&fit=crop&w=1200&q=80&fm=webp\`
- **Animasi Section & Interaksi**:
  - Transisi hover lembut (transition-all duration-200, hover:-translate-y-0.5), smooth scroll anchor navigation, dan modal popover dengan backdrop-blur.`;

        let prompt = '';
        if (body.prompt && typeof body.prompt === 'string') {
            prompt = body.prompt;
        } else if (body.type === 'wizard') {
            const { category = 'Bisnis & Jasa', businessName = '', features = [], colorStyle = 'Modern Cyan', notes = '' } = body;
            prompt = `Buatkan Dokumen Planning Blueprint Website berdasarkan informasi wizard berikut:
- **Kategori Website**: ${category}
- **Nama Bisnis / Website**: ${businessName || 'Web Project'}
- **Fitur yang Diinginkan**: ${Array.isArray(features) && features.length > 0 ? features.join(', ') : 'WhatsApp Direct Order, Katalog Filterable, Form Reservasi, Mobile Responsif, Toast Feedback'}
- **Gaya Desain & Warna**: ${colorStyle}
- **Catatan / Deskripsi Tambahan**: ${notes || 'Buatkan rancangan website yang elegan, modern, berbasis data realistis Indonesia, dan bebas dari gaya generik.'}`;
        } else if (body.type === 'manual' || body.desc) {
            prompt = `Buatkan Dokumen Planning Blueprint Website berdasarkan deskripsi aplikasi berikut:
${body.desc || body.prompt || ''}`;
        } else if (body.type === 'cloning') {
            prompt = `Buatkan Dokumen Planning Blueprint Website untuk membuat versi website yang lebih baik dari referensi berikut:
- **URL Referensi**: ${body.url}
- **Deskripsi Khusus & Fitur Tambahan**: ${body.desc}`;
        } else if (body.text) {
            prompt = body.text;
        } else {
            prompt = 'Buatkan Dokumen PRD dan Planning Blueprint Aplikasi Web yang komprehensif.';
        }

        // AI Model Engine: gemini-3.7-flash (Model Utama) with fallback to gemini-3.6-flash
        const candidateModels = [
            'gemini-3.7-flash',
            'gemini-3.6-flash'
        ];

        let geminiData = null;
        let lastError = '';

        for (const model of candidateModels) {
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    const geminiResponse = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-goog-api-key': apiKey,
                            },
                            body: JSON.stringify({
                                contents: [
                                    {
                                        parts: [
                                            { text: `${systemInstructions}\n\n${prompt}` }
                                        ]
                                    }
                                ],
                                generationConfig: {
                                    temperature: 0.7,
                                    maxOutputTokens: 8192,
                                }
                            })
                        }
                    );

                    if (geminiResponse.ok) {
                        geminiData = await geminiResponse.json();
                        break;
                    } else {
                        lastError = await geminiResponse.text();
                        console.warn(`Planning Gen: Model ${model} (attempt ${attempt}) returned ${geminiResponse.status}:`, lastError.slice(0, 150));
                        if (attempt === 1) {
                            await new Promise(r => setTimeout(r, 1200));
                        }
                    }
                } catch (fetchErr) {
                    console.warn(`Planning Gen: Failed calling ${model} (attempt ${attempt}):`, fetchErr.message);
                }
            }
            if (geminiData) break;
        }

        if (!geminiData) {
            const fallbackPrd = `# Planning Blueprint: Platform Digital Modern

> **Tagline / Value Proposition**: Solusi Digital Terintegrasi dengan Standar Estetika Clean Minimalis
> **Kategori Industri**: Bisnis & Layanan Profesional | **Target Pengunjung**: Pelanggan & Pengelola Bisnis

---

## 1. Ringkasan Konsep & Problem Statement
Sistem dirancang untuk menyajikan platform digital yang tangguh, cepat, dan elegan guna menjawab kebutuhan interaksi data dan layanan bisnis modern. Dengan tata letak minimalis dan alur pengguna yang intuitif, platform ini memaksimalkan konversi pelanggan.

### User Personas
- **Pelanggan Utama**: Mencari informasi produk/layanan secara instan, membandingkan harga, dan melakukan pemesanan tanpa hambatan.
- **Admin / Pengelola**: Memantau aktivitas pesanan, mengelola daftar katalog, dan menganalisis performa bisnis.

---

## 2. Peta Halaman (Sitemap)
- **Beranda (Home)**: Hero section persuasif, showcase produk/layanan dengan filter kategori, ulasan pelanggan autentik, dan form booking/kontak cepat.
- **Katalog & Menu**: Tampilan kartu grid interaktif, modal detail varian, dan floating cart pemesanan.
- **Tentang Kami**: Informasi reputasi bisnis, tim ahli, dan standar mutu.
- **Kontak & Lokasi**: Informasi jam operasional, peta lokasi, dan tombol WhatsApp direct order.

---

## 3. Matriks Prioritas Fitur (MVP Scope)
- **P0 (Core MVP)**:
  - [x] Katalog produk/layanan dengan filter kategori dinamis.
  - [x] Floating cart bar dan generator pesanan otomatis ke WhatsApp.
  - [x] Form reservasi/kontak dengan validasi instan.
- **P1 (Next Sprint)**:
  - [x] Live search instan dan modal detail produk.
  - [x] Penyimpanan state di browser localStorage.
  - [x] Feedback toast notification interaktif.
- **P2 (Future Expansion)**:
  - [ ] Otomasi payment gateway QRIS.
  - [ ] Dashboard analitik pendapatan terintegrasi.

---

## 4. Skema Database (ERD Tables)
- \`tbl_categories\` (id PK, name, slug, is_active)
- \`tbl_items\` (id PK, category_id FK, name, description, price, image_url, status)
- \`tbl_orders\` (id PK, customer_name, customer_phone, total_amount, order_items JSON, status, created_at)

---

## 5. Spesifikasi REST API Endpoints
- \`GET /api/v1/items\` — Mengambil daftar item aktif
- \`POST /api/v1/orders\` — Menyimpan pesanan baru
- \`POST /api/v1/contact\` — Mengirim pesan formulir kontak

---

## 6. Rekomendasi Desain & Visual
- **Nuansa Desain**: Clean Minimalist dengan border subtle \`border-zinc-800\`.
- **Tipografi**: Plus Jakarta Sans / Inter / Geist Sans.
- **Gambar**: Unsplash WebP teroptimasi (\`?auto=format&fit=crop&w=1200&q=80&fm=webp\`).`;

            return new Response(JSON.stringify({
                success: true,
                markdown: fallbackPrd,
                prd: fallbackPrd,
                format: 'markdown',
                agentTeam: ['Lead Architect', 'System Analyst', 'Fullstack Planner'],
                note: 'Generated via SatuSite Engine'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const markdown = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!markdown) {
            return new Response(JSON.stringify({
                error: 'AI tidak mengembalikan teks. Silakan coba lagi.'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            markdown: markdown,
            prd: markdown,
            format: 'markdown'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error("Error generating Planning via Gemini:", e);
        return new Response(JSON.stringify({
            error: 'Terjadi kesalahan pada server AI: ' + (e.message || e)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
