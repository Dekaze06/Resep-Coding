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

        const systemInstructions = `Anda adalah Senior Product Strategist dan Lead UI/UX Architect kelas dunia.
Tugas Anda adalah membuat dokumen Rencana & Cetak Biru Website ("Planning Blueprint") yang profesional, rapi, terstruktur, dan bersih.

PEDOMAN UTAMA (STRICT):
1. DILARANG KERAS MENGGUNAKAN EMOJI / EMOTICON APAPUN di seluruh isi dokumen PRD/Blueprint.
2. Rekomendasikan gaya desain CLEAN MINIMALIS, elegan, modern, dan profesional (fleksibel mengikuti tema pengguna tanpa warna-warni pelangi yang tidak perlu).
3. Rekomendasikan tipografi font Geist (Geist Sans / Geist Mono) serta animasi section & mikro-interaksi yang halus dan profesional.

FORMAT OUTPUT (MARKDOWN):
Pastikan output Anda berformat Markdown terstruktur rapi dengan bagian-bagian berikut:

# Planning Blueprint: [Nama Website / Bisnis]

> **Tagline / Slogan**: [Slogan singkat & menarik]
> **Kategori**: [Kategori Web] | **Target Pengunjung**: [Target audiens utama]

---

## 1. Ringkasan Konsep & Visi
[Jelaskan tujuan utama website, nilai unik / value proposition, dan konsep antarmuka minimalis dalam 2-3 paragraf ringkas].

## 2. Peta Halaman (Sitemap)
- **Beranda (Home)**: Hero banner, sambutan, keunggulan utama, ringkasan produk/layanan, ulasan testimoni, CTA kontak.
- **Layanan / Katalog Produk**: Daftar produk/layanan dengan foto, deskripsi singkat, dan tombol pemesanan/detail.
- **Tentang Kami**: Cerita singkat bisnis/organisasi, visi-misi, dan tim/lokasi.
- **Kontak & Lokasi**: Informasi jam operasional, peta lokasi, formulir pesan, dan kontak langsung.

## 3. Fitur Utama & Interaktivitas
- [x] **Pemesanan / Chat WhatsApp Langsung**: Tombol cepat untuk langsung terhubung ke admin WhatsApp dengan format pesan terstruktur.
- [x] **Galeri Foto & Showcase Responsif**: Tampilan grid visual dengan animasi hover halus dan filter kategori.
- [x] **Formulir Interaktif / Booking**: Form pendaftaran atau pesan dengan validasi instan.
- [x] **Tampilan Responsif Mobile-First**: Berjalan mulus di smartphone, tablet, maupun desktop.

## 4. Rekomendasi Desain & Gaya Visual
- **Nuansa Gaya**: Clean Minimalist (Modern & Elegan)
- **Palet Warna Utama**:
  - Warna Primer: \`[HEX, misal: #ffffff - White / disesuaikan dengan brand]\` (Tombol utama & teks sorotan)
  - Warna Latar: \`[HEX, misal: #09090b - Obsidian Dark / Clean White jika light]\` (Latar belakang utama)
  - Warna Kartu: \`[HEX, misal: #18181b - Deep Zinc / Surface Card]\` (Background container / card)
  - Garis Tepi: \`[HEX, misal: #27272a - Subtle Border]\` (Border halus minimalis)
- **Tipografi Font**:
  - Judul / Headline: Geist Sans / Geist Mono (Ultra modern, proporsional, & bersih)
- **Animasi Section**:
  - Transisi hover lembut, fade-in section, dan micro-interaction profesional.

## 5. Panduan Eksekusi Desain (Siap untuk Web Canvas)
1. **Hero Section**: Headline memikat + sub-headline persuasif + tombol CTA minimalis.
2. **Katalog & Pricing**: Grid cards dengan border halus subtle (border-zinc-800) tanpa badge warna-warni yang ramai.
3. **Social Proof**: Kartu testimoni dan rating review dengan icon garis netral.
4. **Footer**: Navigasi lengkap, hak cipta, dan link kontak.`;

        let prompt = '';
        if (body.type === 'wizard') {
            const { category = 'Bisnis & Jasa', businessName = '', features = [], colorStyle = 'Modern Cyan', notes = '' } = body;
            prompt = `Buatkan Dokumen Planning Blueprint Website berdasarkan informasi wizard berikut:
- **Kategori Website**: ${category}
- **Nama Bisnis / Website**: ${businessName || 'Web Project'}
- **Fitur yang Diinginkan**: ${Array.isArray(features) && features.length > 0 ? features.join(', ') : 'WhatsApp Order, Galeri Foto, Form Kontak, Mobile Responsif'}
- **Gaya Desain & Warna**: ${colorStyle}
- **Catatan / Deskripsi Tambahan**: ${notes || 'Buatkan website yang profesional, modern, dan menarik bagi pelanggan.'}`;
        } else if (body.type === 'manual') {
            prompt = `Buatkan Dokumen Planning Blueprint Website berdasarkan deskripsi aplikasi berikut:
${body.desc}`;
        } else if (body.type === 'cloning') {
            prompt = `Buatkan Dokumen Planning Blueprint Website untuk membuat versi website yang lebih baik dari referensi berikut:
- **URL Referensi**: ${body.url}
- **Deskripsi Khusus & Fitur Tambahan**: ${body.desc}`;
        } else {
            return new Response(JSON.stringify({ error: 'Tipe request tidak valid.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // AI Model Engine with robust multi-model fallback cascade
        const candidateModels = [
            'gemini-3.7-flash',
            'gemini-3.6-flash',
            'gemini-3.5-flash',
            'gemini-3-flash-preview',
            'gemini-flash-latest',
            'gemini-3.1-flash-lite',
            'gemini-3.1-pro-preview'
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
            const fallbackPrd = `# Product Requirement Document (PRD) & Blueprint Arsitektur

## 1. Ringkasan Eksekutif & Problem Statement
Sistem dirancang untuk menjawab kebutuhan "${prompt.slice(0, 80)}" dengan platform digital modern, modular, dan handal.

### Target Persona Pengguna
- **Administrator**: Memiliki hak akses penuh untuk mengelola konfigurasi, entitas data, dan audit logs.
- **End User / Pelanggan**: Mengakses antarmuka intuitif untuk eksplorasi dan interaksi data.

## 2. Arsitektur Sistem & Tech Stack
- **Frontend Layer**: React / Astro / Tailwind CSS
- **API & Gateway**: RESTful microservices dengan JWT auth
- **Database & Storage**: Relational PostgreSQL + In-memory cache
- **Deployment**: Vercel / Cloudflare Edge

## 3. Matriks Prioritas Fitur (MVP Scope)
- **P0 (Core MVP)**: Autentikasi Pengguna, Manajemen CRUD Utama, Dashboard Ringkasan.
- **P1 (Next Sprint)**: Filter Lanjutan, Ekspor Data CSV/PDF, Notifikasi Webhook.
- **P2 (Future Roadmap)**: AI Assistant Integration, Multi-tenant permissions.

## 4. Skema Database (ERD Entity Relationship)
- \`tbl_users\` (id PK, name, email, role, created_at)
- \`tbl_entities\` (id PK, user_id FK, title, category, status, metadata)
- \`tbl_audit_logs\` (id PK, action, ip_address, timestamp)

## 5. Spesifikasi REST API Endpoints
- \`GET /api/v1/items\` — Ambil daftar data
- \`POST /api/v1/items\` — Buat data baru
- \`PUT /api/v1/items/:id\` — Perbarui data
- \`DELETE /api/v1/items/:id\` — Hapus data`;

            return new Response(JSON.stringify({
                success: true,
                prd: fallbackPrd,
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

        return new Response(JSON.stringify({ success: true, markdown }), {
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
