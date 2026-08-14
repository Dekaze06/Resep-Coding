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
Tugas Anda adalah membuat dokumen Rencana & Cetak Biru Website ("Planning Blueprint") yang profesional, rapi, dan mudah dipahami oleh orang awam maupun developer.

FORMAT OUTPUT (MARKDOWN):
Pastikan output Anda berformat Markdown terstruktur rapi dengan bagian-bagian berikut:

# Planning Blueprint: [Nama Website / Bisnis]

> **Tagline / Slogan**: [Slogan singkat & menarik]
> **Kategori**: [Kategori Web] | **Target Pengunjung**: [Target audiens utama]

---

## 1. 📌 Ringkasan Konsep & Visi
[Jelaskan tujuan utama website, nilai unik (unique selling point), dan kesan visual yang ingin diciptakan dalam 2-3 paragraf ramah].

## 2. 📑 Peta Halaman (Sitemap)
- **Beranda (Home)**: Hero banner, sambutan, keunggulan utama, ringkasan produk/layanan, ulasan testimoni, CTA kontak.
- **Layanan / Katalog Produk**: Daftar produk/layanan dengan foto, deskripsi singkat, dan tombol pemesanan/detail.
- **Tentang Kami**: Cerita singkat bisnis/organisasi, visi-misi, dan tim/lokasi.
- **Kontak & Lokasi**: Informasi jam buka, peta lokasi, formulir pesan, dan tautan media sosial.

## 3. ⚡ Fitur Utama & Interaktivitas
- [x] **Pemesanan / Chat WhatsApp Langsung**: Tombol cepat untuk langsung terhubung ke admin WhatsApp dengan pesan template otomatis.
- [x] **Galeri Foto & Showcase Responsif**: Tampilan grid visual dengan animasi hover halus dan filter kategori.
- [x] **Formulir Interaktif / Booking**: Form pendaftaran atau pesan dengan validasi instan.
- [x] **Tampilan Responsif Mobile-First**: Sempurna saat diakses melalui smartphone, tablet, maupun laptop.

## 4. 🎨 Rekomendasi Desain & Gaya Visual
- **Nuansa Gaya**: [Misal: Modern Clean / Dark Luxury / Natural Pastel]
- **Palet Warna Utama**:
  - Warna Primer: \`[HEX, misal: #06b6d4 - Cyan]\` (Warna tombol & highlight)
  - Warna Latar: \`[HEX, misal: #09090b - Dark Slate]\` (Latar belakang utama)
  - Warna Aksen/Teks: \`[HEX, misal: #f8fafc - Bright White]\`
- **Tipografi Font**:
  - Judul / Headline: Plus Jakarta Sans / Inter (Tegas & modern)
  - Aksen Tambahan: Dancing Script (Opsional untuk sentuhan hangat)

## 5. 🚀 Panduan Eksekusi Desain (Siap untuk Web Canvas)
1. **Hero Section**: Headline memikat + sub-headline persuasif + 2 tombol CTA (Pesan Sekarang & Lihat Katalog).
2. **Katalog & Pricing**: Grid cards dengan efek glassmorphism atau border glow.
3. **Social Proof**: Kartu testimoni dengan rating bintang ⭐⭐⭐⭐⭐.
4. **Footer**: Navigasi lengkap, hak cipta, dan link WhatsApp.
`;

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

        const candidateModels = [
            'gemini-3.6-flash',
            'gemini-3.7-flash',
            'gemini-3.5-flash',
            'gemini-flash-latest'
        ];

        let geminiData = null;
        let lastError = '';

        for (const model of candidateModels) {
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
                                maxOutputTokens: 4096,
                            }
                        })
                    }
                );

                if (geminiResponse.ok) {
                    geminiData = await geminiResponse.json();
                    break;
                } else {
                    lastError = await geminiResponse.text();
                    console.warn(`Planning Gen: Model ${model} returned ${geminiResponse.status}:`, lastError.slice(0, 150));
                }
            } catch (fetchErr) {
                console.warn(`Planning Gen: Failed calling ${model}:`, fetchErr.message);
            }
        }

        if (!geminiData) {
            return new Response(JSON.stringify({
                error: `Gagal memproses via AI Gemini. Detail: ${lastError || 'Koneksi gagal'}`
            }), {
                status: 500,
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
