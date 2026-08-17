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
            projectName = 'Emergent App',
            activeAgent = 'all',
            mode = 'fullstack', // 'fullstack' | 'frontend'
            modelChoice = 'auto'
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

        // Specialized system instructions based on mode
        const isFullstack = mode === 'fullstack';
        
        const systemPrompt = `Anda adalah AI Agent di SATUSITE STUDIO — Platform Pengembangan Aplikasi Otonom kelas dunia.
Mode Aktif: ${isFullstack ? 'FULLSTACK APPLICATION ARCHITECTURE' : 'FRONTEND POLISHED INTERFACE'}

PEDOMAN KODE & ESTETIKA:
1. Desain HARUS DARK MODE CLEAN MINIMALIS (Zinc/Obsidian dark theme, sleek borders, tipografi bersih Geist Sans/Inter, layout terstruktur rapi).
2. Gunakan aksen warna Dark Blue / Royal Blue (#2563eb, #1d4ed8, blue-600, blue-500) yang elegan dan profesional.
3. DILARANG KERAS menggunakan icon emoji/emoticon Unicode warna-warni pada teks maupun tombol (gunakan FontAwesome/SVG/Lucide minimalis).
4. Kode HARUS mandiri (Self-contained HTML5 file) yang menggabungkan struktur HTML lengkap, Tailwind CSS CDN (v3/v4), Font Awesome 6/Lucide jika perlu, Chart.js (jika ada chart/metrik), dan Vanilla JS interaktif.
${isFullstack ? `
SPESIFIKASI MODE FULLSTACK:
- Bangun arsitektur data lengkap in-memory dengan auto-sync ke browser localStorage.
- Sediakan fungsionalitas CRUD lengkap (Create, Read, Update, Delete) dengan modal form interaktif dan feedback toast/alert.
- Sediakan fitur pencarian / filter data real-time, pengurutan, dan tombol Ekspor Data (CSV atau JSON).
- Buat penanganan state yang kokoh layaknya aplikasi backend/fullstack modern.
- Script JavaScript harus memuat handler data terstruktur dengan objek model yang jelas.
` : `
SPESIFIKASI MODE FRONTEND:
- Fokus pada desain tampilan antarmuka visual yang sangat lengkap, presisi, estetik, dan responsif (Desktop, Tablet, Mobile).
- Bangun seluruh section halaman secara utuh: Header Navigasi responsif, Hero Section, Feature Highlights, Showcase Grid / Galeri, Testimonial/FAQ Accordion, Formulir Kontak dengan validasi visual, dan Footer.
- Tambahkan animasi halus, efek hover, modal popups, dan transisi CSS yang responsif.
`}
5. Jika pengguna meminta revisi pada kode yang sudah ada (currentCode), pertahankan fitur yang sudah bagus dan modifikasi/tambahkan bagian yang diminta secara konsisten.
6. Untuk tautan navigasi internal (menu Header/Footer), gunakan format anchor href="#nama-bagian" dan buat id yang sesuai pada section tersebut.

FORMAT RESPONSE:
- Jika permintaan memerlukan pembuatan/pembaruan kode web:
  1. Tulis ringkasan penjelasan teknis singkat untuk ditampilkan di panel percakapan chat (bersih, profesional, tanpa emoji).
  2. Letakkan SELURUH kode HTML5 lengkap HANYA di dalam blok markdown:
\`\`\`html
<!DOCTYPE html>
<html lang="id">
...
</html>
\`\`\`
- Jika pengguna HANYA ingin konsultasi/bertanya tanpa kode:
  Jawablah secara informatif, profesional, dan to the point tanpa blok kode.`;

        // Assemble conversational prompt context
        let fullUserPrompt = `Proyek: ${projectName}\nActive Agent: ${activeAgent}\n\n`;

        if (prdContext && prdContext.trim()) {
            fullUserPrompt += `=== DOKUMEN ARSITEKTUR / PRD ===\n${prdContext.slice(0, 5000)}\n\n`;
        }

        if (currentCode && currentCode.trim()) {
            fullUserPrompt += `=== KODE TERKINI (REFERENSI UPDATE) ===\n\`\`\`html\n${currentCode.slice(0, 12000)}\n\`\`\`\n\n`;
        }

        fullUserPrompt += `=== INSTRUKSI PENGGUNA ===\n${prompt}`;

        // Build contents payload with past history ensuring proper alternation
        const contents = [];
        
        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
            const pastMessages = chatHistory.filter((m, idx) => {
                if (idx === chatHistory.length - 1 && m.role === 'user' && m.text.trim() === prompt.trim()) {
                    return false;
                }
                return true;
            });

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

        // Use Gemini 3.7 Flash as dedicated engine
        const candidateModels = [
            'gemini-3.7-flash',
            'gemini-2.5-flash',
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

        // Separate explanation and clean HTML code
        let extractedCode = '';
        let messageText = '';
        let hasCodeUpdate = false;

        const fencedMatch = rawReply.match(/```(?:html|HTML|xml)?\s*\n?([\s\S]*?)(?:```|$)/i);

        if (fencedMatch && fencedMatch[1] && (fencedMatch[1].includes('<html') || fencedMatch[1].includes('<!DOCTYPE') || fencedMatch[1].includes('<body'))) {
            extractedCode = fencedMatch[1].trim();
            messageText = rawReply.replace(/```(?:html|HTML|xml)?[\s\S]*?(?:```|$)/gi, '').trim();
            hasCodeUpdate = true;
        } else {
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
                messageText = rawReply.trim();
                extractedCode = currentCode || '';
                hasCodeUpdate = false;
            }
        }

        messageText = messageText
            .replace(/```(?:html|HTML)?/gi, '')
            .replace(/```/g, '')
            .replace(/Berikut (?:adalah )?kode(?: HTML5)?(?: mandiri)?[^:\n]*:[\s\n]*$/gi, '')
            .trim();

        if (extractedCode && hasCodeUpdate) {
            const firstDocType = extractedCode.indexOf('<!DOCTYPE html>');
            const firstHtml = extractedCode.indexOf('<html');
            const validStart = firstDocType !== -1 ? firstDocType : firstHtml;

            if (validStart > 0) {
                const leakedHeader = extractedCode.slice(0, validStart).trim();
                if (!messageText) messageText = leakedHeader;
                extractedCode = extractedCode.slice(validStart).trim();
            }
            extractedCode = extractedCode.replace(/```\s*$/g, '').trim();
        }

        if (!messageText) {
            messageText = hasCodeUpdate
                ? 'Aplikasi telah berhasil diperbarui dengan fitur dan komponen interaktif baru.'
                : rawReply;
        }

        return new Response(JSON.stringify({
            success: true,
            message: messageText,
            code: extractedCode,
            hasCodeUpdate: hasCodeUpdate,
            agentTeam: ['Architect', 'Designer', 'Fullstack Dev', 'QA Tester'],
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
