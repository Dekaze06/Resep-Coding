export const prerender = false;
import { ProjectsDB } from '../../lib/db.ts';
import { generate, getApiKey, stripEmoji } from '../../lib/ai/gemini.js';
import { PRD_SYSTEM_PROMPT, buildPrdUserPrompt } from '../../lib/ai/prompts.js';

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST({ request }) {
    try {
        let body;
        try {
            body = JSON.parse(await request.text());
        } catch {
            return json({ error: 'Request body tidak valid (JSON parse error).' }, 400);
        }

        if (!getApiKey()) {
            return json({ error: 'GEMINI_API_KEY belum dikonfigurasi di server (.env).' }, 500);
        }

        const promptText = buildPrdUserPrompt(body);

        const result = await generate({
            systemPrompt: PRD_SYSTEM_PROMPT,
            contents: [{ role: 'user', parts: [{ text: promptText }] }],
            temperature: 0.6,
            maxOutputTokens: 8192,
        });

        const ownerEmail = body.owner || 'guest@satusite.com';
        const projName = body.webName || (body.prompt ? body.prompt.slice(0, 45).trim() : 'Dokumen PRD Blueprint');

        if (!result || !result.text) {
            // Intelligent fallback template
            const fallbackPrd = `# Planning Blueprint: ${projName}

> **Value Proposition**: Solusi digital terintegrasi dengan standar arsitektur clean minimalis dan performa tinggi.
> **Kategori**: ${body.webType || 'Aplikasi Web & Bisnis'} | **Target Pengguna**: Pelanggan & Pengelola Bisnis | **Platform**: Web Responsif & PWA

---

## 1. Ringkasan Eksekutif
Sistem dirancang untuk menyajikan platform digital yang tangguh, cepat, dan elegan guna menjawab kebutuhan interaksi data dan layanan bisnis modern. Dengan tata letak minimalis dan alur pengguna yang intuitif, platform ini memaksimalkan efisiensi dan kepuasan pengguna.

---

## 2. Latar Belakang & Problem Statement
Banyak platform digital di industri ini mengalami kendala antarmuka yang lambat, alur pemesanan yang rumit, serta integrasi data yang terfragmentasi. Proyek ini memecahkan masalah tersebut dengan menyatukan seluruh siklus interaksi ke dalam satu sistem yang mulus dan terukur.

---

## 3. Tujuan & Metrik Keberhasilan
| Tujuan Utama | KPI Kunci | Target | Metode Pengukuran |
| :--- | :--- | :--- | :--- |
| Kecepatan Akses Mobile | Largest Contentful Paint (LCP) | < 2.0 detik | Google Lighthouse |
| Konversi Alur Pesanan | Checkout Completion Rate | > 35% | Analitik Interaksi |
| Reliabilitas Sistem | Uptime Ketersediaan | 99.9% | Server Health Monitor |

---

## 4. User Personas
### Persona 1: Pelanggan Utama
- **Profil**: Pengguna mobile aktif yang membutuhkan kemudahan akses informasi secara cepat.
- **Pain Points**: Kecepatan muat halaman yang lambat, form pemesanan yang terlalu panjang.
- **Kebutuhan**: Filter katalog instan, kalkulasi harga otomatis, dan opsi konfirmasi cepat ke WhatsApp.

### Persona 2: Administrator / Pengelola Bisnis
- **Profil**: Pemilik usaha atau staf operasional yang mengelola pesanan harian.
- **Pain Points**: Kesulitan memantau riwayat pesanan dan mengupdate data produk secara real-time.
- **Kebutuhan**: Dashboard manajemen CRUD yang ringkas, aman, dan mudah dioperasikan.

---

## 5. User Stories & Acceptance Criteria
1. **US-01**: Sebagai Pengunjung, saya ingin mencari dan memfilter produk/layanan berdasarkan kategori agar menemukan item yang sesuai dalam hitungan detik.
   - *Given*: Pengunjung membuka halaman katalog.
   - *When*: Pengunjung mengetik kata kunci atau mengklik tab kategori.
   - *Then*: Daftar kartu produk diperbarui secara instan tanpa reload halaman.
2. **US-02**: Sebagai Pembeli, saya ingin menambahkan item ke keranjang dan mengonfirmasi pesanan ke WhatsApp dengan rincian otomatis.
   - *Given*: Pembeli telah memilih minimal satu produk.
   - *When*: Pembeli menekan tombol Checkout WhatsApp.
   - *Then*: Tautan WhatsApp API terbuka dengan format rincian invoice rapi dalam mata uang Rupiah.

---

## 6. Sitemap & Alur Pengguna
- **Beranda (Home)**: Hero section persuasif, kartu katalog unggulan dengan live search/filter, highlight keunggulan, ulasan pelanggan autentik, formulir booking/order instan, dan footer navigasi.
- **Katalog & Layanan**: Grid produk/menu/layanan interaktif dengan filter kategori instan, modal detail produk, dan sticky cart order.
- **Tentang Kami**: Cerita brand/bisnis, standar kualitas, tim profesional, dan sertifikasi/legalitas.
- **Kontak & Lokasi**: Jam operasional, alamat fisik terintegrasi, dan tombol direct WhatsApp dengan format invoice pesan terstruktur.

---

## 7. Prioritas Fitur (MoSCoW)
| Fitur | Prioritas | Alasan |
| :--- | :--- | :--- |
| Katalog Produk Filterable & Live Search | Must Have | Fondasi utama pengalaman pengguna dan eksplorasi data |
| Sticky Cart & WhatsApp Order Formatter | Must Have | Alur konversi transaksi utama bisnis |
| Mode Gelap & Terang (Dark/Light Mode) | Should Have | Standar kenyamanan antarmuka modern |
| Riwayat Pesanan di LocalStorage | Should Have | Mempertahankan state pengguna saat koneksi terputus |
| Ekspor Laporan CSV untuk Admin | Could Have | Memudahkan rekap data administratif |

---

## 8. Model Data (ERD Entities)
- \`tbl_categories\` (id PK, name, slug, icon, is_active)
- \`tbl_items\` (id PK, category_id FK, name, description, price, image_url, stock, status)
- \`tbl_orders\` (id PK, customer_name, customer_phone, total_amount, order_items JSON, status, created_at)
- \`tbl_reviews\` (id PK, item_id FK, reviewer_name, rating, comment, avatar_url, created_at)

---

## 9. Spesifikasi REST API Endpoints
| Method | Endpoint | Deskripsi | Status |
| :--- | :--- | :--- | :--- |
| GET | /api/v1/items | Mengambil daftar item aktif dengan filter kategori & search | 200 OK |
| GET | /api/v1/items/:id | Mengambil rincian lengkap satu item beserta varian | 200 OK |
| POST | /api/v1/orders | Menyimpan data pesanan baru | 201 Created |
| POST | /api/v1/contact | Mengirim pesan formulir konsultasi/booking | 200 OK |

---

## 10. Rekomendasi Design System
- **Palet Warna 60-30-10**:
  - 60% Background: Obsidian Dark (#09090b) / Clean White (#ffffff)
  - 30% Surface Card: Deep Zinc Card (#121215) dengan border halus #27272a
  - 10% Aksen Tunggal: Electric Cyan (#06b6d4) atau Indigo (#6366f1)
- **Tipografi**: Heading: Plus Jakarta Sans / Inter; Body: Inter (keterbacaan tinggi, anti-lelah mata)
- **Icon**: Font Awesome 6 CDN atau clean inline SVG (tanpa emoji)`;

            let fallbackProjectId = null;
            try {
                const saved = await ProjectsDB.createAsync({
                    name: projName,
                    category: body.webType || 'Product Blueprint & PRD',
                    mode: 'prd',
                    owner: ownerEmail,
                    status: 'Live',
                    prompt: body.prompt || '',
                    prdContext: fallbackPrd,
                    code: fallbackPrd,
                    architectureNodes: [],
                });
                fallbackProjectId = saved?.id;
            } catch (dbErr) {
                console.warn('[DB] Auto-save fallback PRD to database failed:', dbErr);
            }

            return json({
                success: true,
                markdown: fallbackPrd,
                prd: fallbackPrd,
                format: 'markdown',
                projectId: fallbackProjectId,
                savedToDatabase: !!fallbackProjectId,
                agentTeam: ['Lead Architect', 'System Analyst', 'Fullstack Planner'],
                note: 'Generated via SatuSite Engine',
            });
        }

        const markdown = stripEmoji(result.text).trim();

        let savedProjectId = null;
        try {
            const saved = await ProjectsDB.createAsync({
                name: projName,
                category: body.webType || 'Product Blueprint & PRD',
                mode: 'prd',
                owner: ownerEmail,
                status: 'Live',
                prompt: body.prompt || '',
                prdContext: markdown,
                code: markdown,
                architectureNodes: [],
            });
            savedProjectId = saved?.id;
        } catch (dbErr) {
            console.warn('[DB] Auto-save PRD to database failed:', dbErr);
        }

        return json({
            success: true,
            markdown,
            prd: markdown,
            format: 'markdown',
            projectId: savedProjectId,
            savedToDatabase: !!savedProjectId,
            model: result.model,
        });
    } catch (e) {
        console.error('Error generating Planning via Gemini:', e);
        return json({ error: 'Terjadi kesalahan pada server AI: ' + (e.message || e) }, 500);
    }
}
