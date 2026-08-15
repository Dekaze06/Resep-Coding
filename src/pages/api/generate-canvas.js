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

        const {
            prompt,
            chatHistory = [],
            currentCode = '',
            prdContext = '',
            projectName = 'Web App',
        } = body;

        if (!prompt || !prompt.trim()) {
            return new Response(JSON.stringify({ error: 'Prompt tidak boleh kosong.' }), {
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

        // System instructions to act as elite Senior Frontend Architect & UI/UX Designer
        const systemPrompt = `Anda adalah Senior Lead Frontend Engineer dan UI/UX Designer kelas dunia di Web Canvas Studio.
Tugas Anda adalah:
1. Berdiskusi, memberi saran, dan menjawab pertanyaan pengguna tentang desain, fitur, konten, dan arsitektur website mereka secara ramah dan profesional.
2. Jika pengguna meminta membuat, memperbarui, menambah bagian, atau mengubah tema website, buatkan/perbarui kode antarmuka web (Frontend) lengkap, mandiri, responsif, dan interaktif (Single-File Complete HTML5).

PEDOMAN KODE:
1. Kode HARUS mandiri (Self-contained HTML5 file) yang menggabungkan struktur HTML, styling Tailwind CSS via CDN (Tailwind v3/v4 standalone), ikon (Font Awesome 6 & Lucide CDN jika perlu), dan script Vanilla JS interaktif.
2. Desain HARUS WOW, modern, estetik tinggi (Glassmorphism, dark/light mode harmonis, mikro-animasi, typography Google Fonts seperti Plus Jakarta Sans/Inter/Dancing Script, card glow, gradient cantik). JANGAN buat desain kaku atau membosankan.
3. Semua komponen interaktif (tombol, modal dialog, dropdown filter, tab switcher, form input, kalkulasi, slider, accordion FAQ, data table, floating WhatsApp chat) HARUS berfungsi aktif dengan Vanilla JavaScript di dalam tag <script>.
4. Jika diberikan Dokumen Planning/PRD proyek, terjemahkan fitur dan kebutuhan perencanaan tersebut secara akurat ke dalam komponen visual web.
5. Jika pengguna meminta penambahan bagian/fitur khusus (seperti: Tombol WhatsApp Melayang, Galeri Foto Grid, Daftar Harga & Paket, Form Booking, Google Maps, Testimoni Bintang 5, FAQ Accordion), SISIPKAN bagian tersebut di posisi yang tepat pada dokumen HTML tanpa menghapus bagian halaman yang sudah ada.
6. Jika pengguna meminta ganti tema warna atau gaya desain, sesuaikan konfigurasi warna brand pada Tailwind config, background body, teks, dan aksen kartu secara menyeluruh dan harmonis dengan tetap mempertahankan konten yang ada.
7. Jika pengguna meminta revisi pada kode yang sudah ada (currentCode), pertahankan fitur yang sudah bagus dan modifikasi/tambahkan bagian yang diminta secara rapi dan konsisten.
8. PENTING: Untuk tautan navigasi internal (menu Header/Footer), gunakan format anchor href="#nama-bagian" (misal href="#fitur", href="#layanan", href="#kontak") dan buat id yang sesuai pada section tersebut. Jangan gunakan link kosong href="#" atau link yang me-refresh halaman.

FORMAT RESPONSE:
- Jika permintaan memerlukan pembuatan/pembaruan kode web:
  1. Tulis penjelasan ramah dan ringkas mengenai perubahan/fitur yang dibuat untuk ditampilkan di panel CHAT.
  2. Letakkan SELURUH kode HTML5 lengkap HANYA di dalam blok markdown:\n\`\`\`html\n<!DOCTYPE html>\n<html lang="id">\n...\n</html>\n\`\`\`
- Jika pengguna HANYA ingin berdiskusi, bertanya saran/konsultasi tanpa meminta update kode (misal: "menurutmu apa nama yang bagus?", "warna apa yang cocok?", dll):
  Jawablah secara langsung dan informatif tanpa menyertakan blok kode HTML.`;

        // Assemble conversational prompt context
        let fullUserPrompt = `Proyek: ${projectName}\n\n`;

        if (prdContext && prdContext.trim()) {
            fullUserPrompt += `=== DOKUMEN PLANNING PROYEK TERKAIT ===\n${prdContext.slice(0, 5000)}\n\n`;
        }

        if (currentCode && currentCode.trim()) {
            fullUserPrompt += `=== KODE CANVAS SAAT INI (REFERENSI UPDATE) ===\n\`\`\`html\n${currentCode.slice(0, 10000)}\n\`\`\`\n\n`;
        }

        fullUserPrompt += `=== PERTANYAAN / INSTRUKSI PENGGUNA ===\n${prompt}`;

        // Build contents payload with past history ensuring proper alternation
        const contents = [];
        
        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
            // Exclude last message if it matches current prompt to prevent duplicates
            const pastMessages = chatHistory.filter((m, idx) => {
                if (idx === chatHistory.length - 1 && m.role === 'user' && m.text.trim() === prompt.trim()) {
                    return false;
                }
                return true;
            });

            // Take up to 6 past messages
            const recent = pastMessages.slice(-6);
            for (const msg of recent) {
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                });
            }
        }

        contents.push({
            role: 'user',
            parts: [{ text: fullUserPrompt }]
        });

        // List of candidate models in order of priority: Gemini 3.7 Flash as primary, Gemini 3.6 Flash as fallback
        const candidateModels = [
            'gemini-3.7-flash',
            'gemini-3.6-flash'
        ];

        let geminiResponse = null;
        let lastErrorText = '';

        for (const model of candidateModels) {
            try {
                const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-goog-api-key': apiKey,
                        },
                        body: JSON.stringify({
                            systemInstruction: {
                                parts: [{ text: systemPrompt }]
                            },
                            contents: contents,
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 8192,
                            }
                        })
                    }
                );

                if (res.ok) {
                    geminiResponse = await res.json();
                    break;
                } else {
                    lastErrorText = await res.text();
                    console.warn(`Model ${model} returned ${res.status}:`, lastErrorText.slice(0, 150));
                }
            } catch (err) {
                console.warn(`Failed calling ${model}:`, err.message);
            }
        }

        if (!geminiResponse) {
            return new Response(JSON.stringify({
                error: `Gagal memproses via AI Gemini. Detail: ${lastErrorText || 'Koneksi gagal'}`
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const rawReply = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (!rawReply) {
            return new Response(JSON.stringify({
                error: 'AI tidak mengembalikan teks respon. Silakan coba lagi.'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // =========================================================================
        // ROBUST SEPARATION: Pure Chat Explanation vs Clean HTML Code
        // =========================================================================
        let extractedCode = '';
        let messageText = '';
        let hasCodeUpdate = false;

        // 1. Try finding ```html ... ``` or unclosed ```html ...
        const fencedMatch = rawReply.match(/```(?:html|HTML|xml)?\s*\n?([\s\S]*?)(?:```|$)/i);

        if (fencedMatch && fencedMatch[1] && (fencedMatch[1].includes('<html') || fencedMatch[1].includes('<!DOCTYPE') || fencedMatch[1].includes('<body'))) {
            extractedCode = fencedMatch[1].trim();
            // Remove code block from rawReply to get pure explanation for chat
            messageText = rawReply.replace(/```(?:html|HTML|xml)?[\s\S]*?(?:```|$)/gi, '').trim();
            hasCodeUpdate = true;
        } else {
            // 2. Check if <!DOCTYPE html> or <html is in rawReply without markdown fences
            const docTypeIdx = rawReply.indexOf('<!DOCTYPE html>');
            const htmlIdx = rawReply.indexOf('<html');
            const startIdx = docTypeIdx !== -1 ? docTypeIdx : htmlIdx;

            if (startIdx !== -1) {
                messageText = rawReply.slice(0, startIdx).replace(/```(?:html|HTML)?/gi, '').trim();
                let codePart = rawReply.slice(startIdx);
                const endFenceIdx = codePart.lastIndexOf('```');
                if (endFenceIdx !== -1) {
                    codePart = codePart.slice(0, endFenceIdx);
                }
                extractedCode = codePart.trim();
                hasCodeUpdate = true;
            } else {
                // Pure conversational discussion (no new code generated)
                messageText = rawReply.trim();
                extractedCode = currentCode || '';
                hasCodeUpdate = false;
            }
        }

        // Clean up messageText: remove leftover backticks or "Berikut kode:" hanging markers
        messageText = messageText
            .replace(/```(?:html|HTML)?/gi, '')
            .replace(/```/g, '')
            .replace(/Berikut (?:adalah )?kode(?: HTML5)?(?: mandiri)?[^:\n]*:[\s\n]*$/gi, '')
            .trim();

        // Ensure extractedCode is 100% clean HTML without conversational text preamble
        if (extractedCode && hasCodeUpdate) {
            const firstDocType = extractedCode.indexOf('<!DOCTYPE html>');
            const firstHtml = extractedCode.indexOf('<html');
            const validStart = firstDocType !== -1 ? firstDocType : firstHtml;

            if (validStart > 0) {
                const leakedHeader = extractedCode.slice(0, validStart).trim();
                if (!messageText) messageText = leakedHeader;
                extractedCode = extractedCode.slice(validStart).trim();
            }

            // Remove any trailing backticks
            extractedCode = extractedCode.replace(/```\s*$/g, '').trim();
        }

        if (!messageText) {
            messageText = hasCodeUpdate
                ? 'Tentu, saya telah memperbarui antarmuka website di Canvas Studio sesuai instruksi Anda.'
                : rawReply;
        }

        return new Response(JSON.stringify({
            success: true,
            message: messageText,
            code: extractedCode,
            hasCodeUpdate: hasCodeUpdate,
            raw: rawReply
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        console.error("Error in generate-canvas API:", e);
        return new Response(JSON.stringify({
            error: 'Terjadi kesalahan internal pada server AI: ' + (e.message || e)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
