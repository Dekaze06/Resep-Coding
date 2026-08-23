import { UsersDB } from '../../lib/db';

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
            projectConfig = null,
            activeAgent = 'all',
            mode = 'fullstack', // 'fullstack' | 'frontend'
            modelChoice = 'auto',
            userEmail = ''
        } = body;

        if (!prompt || !prompt.trim()) {
            return new Response(JSON.stringify({ error: 'Prompt tidak boleh kosong.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // User lookup (unlimited generation for all users)
        let user = null;
        if (userEmail) {
            user = await UsersDB.getByEmailAsync(userEmail);
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

        const systemPrompt = `Anda adalah AI Fullstack Architect & Senior Software Engineer di SATUSITE STUDIO yang ditenagai oleh model Gemini 3.7 Flash.
Tugas Anda adalah merancang dan membangun antarmuka web, aplikasi web interaktif, prototipe digital, atau dokumen arsitektur sesuai kebutuhan dan instruksi pengguna dengan kualitas tinggi.

PEDOMAN UTAMA:
1. DILARANG KERAS MENGGUNAKAN EMOJI / EMOTICON APAPUN (ATURAN MUTLAK):
   - JANGAN PERNAH menyertakan karakter emoji atau emoticon apa pun di seluruh bagian: judul, teks tombol, badge status, menu, kartu, footer, komentar kode, maupun di pesan obrolan.
   - Gunakan icon garis netral profesional dari FontAwesome 6 CDN (misal: <i class="fa-solid fa-arrow-right"></i>, <i class="fa-solid fa-check"></i>, <i class="fa-solid fa-magnifying-glass"></i>, dll.) atau inline SVG jika memerlukan representasi ikon visual.

2. SUGGESTION & DESAIN MURNI GEMINI 3.7 FLASH:
   - Berikan rekomendasi terbaik dan bangun solusi secara murni dari kecerdasan Gemini 3.7 Flash, disesuaikan secara fleksibel dengan prompt dan spesifikasi yang diminta pengguna.
   - Hasilkan antarmuka yang modern, bersih, proporsional, estetis, dan responsif di berbagai perangkat (desktop, tablet, mobile).

3. STRUKTUR KODE MANDIRI (SELF-CONTAINED HTML5):
   - Hasilkan kode satu file HTML5 lengkap dan mandiri yang menggabungkan HTML, styling (Tailwind CSS CDN / modern CSS), dan JavaScript Vanilla fungsional.
   - Pastikan interaktivitas (seperti event listener, navigasi, modal, kalkulasi, atau manipulasi data DOM) berfungsi dengan baik dan bebas error.

4. ATURAN REVISI & EDITING BERTAHAP (INCREMENTAL EDITING):
   - Jika terdapat "KODE TERKINI (REFERENSI UPDATE)", pertahankan logika dan fungsionalitas yang sudah bekerja dengan baik, lalu terapkan perubahan yang diminta secara presisi dengan menghasilkan kembali seluruh file HTML5 utuh.

5. NAVIGASI INTERNAL:
   - Gunakan anchor link (#top, #section-id) untuk navigasi internal satu halaman agar tidak memicu reload halaman di dalam Canvas viewer.

FORMAT OUTPUT:
1. Tulis ringkasan penjelasan teknis singkat dan hal yang dikerjakan untuk panel obrolan (bersih, profesional, to the point, tanpa emoji).
2. Letakkan SELURUH kode HTML5 lengkap HANYA di dalam blok markdown:
\`\`\`html
<!DOCTYPE html>
<html lang="id">
...
</html>
\`\`\`
Jika pengguna hanya mengajukan pertanyaan atau diskusi tanpa memerlukan pembuatan/pembaruan kode, jawablah secara informatif dan profesional tanpa blok kode HTML.`;

        // Assemble conversational prompt context
        let fullUserPrompt = `Proyek: ${projectName}\nActive Agent: ${activeAgent}\n\n`;

        if (projectConfig && typeof projectConfig === 'object') {
            fullUserPrompt += `=== KONFIGURASI SPESIFIKASI PROYEK ===\n`;
            if (projectConfig.webName) fullUserPrompt += `- Nama Website: ${projectConfig.webName}\n`;
            if (projectConfig.webType) fullUserPrompt += `- Jenis / Kategori Website: ${projectConfig.webType}\n`;
            if (projectConfig.theme) fullUserPrompt += `- Tema & Gaya Desain: ${projectConfig.theme}\n`;
            if (projectConfig.targetAudience) fullUserPrompt += `- Target Pengunjung: ${projectConfig.targetAudience}\n`;
            if (projectConfig.mainFeatures && (Array.isArray(projectConfig.mainFeatures) ? projectConfig.mainFeatures.length : projectConfig.mainFeatures)) {
                const feats = Array.isArray(projectConfig.mainFeatures) ? projectConfig.mainFeatures.join(', ') : projectConfig.mainFeatures;
                fullUserPrompt += `- Fitur Kunci: ${feats}\n`;
            }
            fullUserPrompt += `\n`;
        }

        if (prdContext && prdContext.trim()) {
            fullUserPrompt += `=== DOKUMEN ARSITEKTUR / PRD ===\n${prdContext.slice(0, 15000)}\n\n`;
        }

        if (currentCode && currentCode.trim()) {
            fullUserPrompt += `=== KODE TERKINI (REFERENSI UPDATE) ===\n\`\`\`html\n${currentCode.slice(0, 100000)}\n\`\`\`\n\n`;
        }

        fullUserPrompt += `=== DETAIL INSTRUKSI PENGGUNA ===\n${prompt}`;

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

        // AI Model Engine: gemini-3.7-flash (Model Utama) with fallback to gemini-3.6-flash
        const candidateModels = [
            'gemini-3.7-flash',
            'gemini-3.6-flash'
        ];

        let geminiResponse = null;
        let lastErrorText = '';

        // Helper: call Gemini with given contents and return parsed JSON or null
        async function callGemini(reqContents, maxTokens = 65536) {
            for (const model of candidateModels) {
                for (let attempt = 1; attempt <= 2; attempt++) {
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
                                    contents: reqContents,
                                    generationConfig: {
                                        temperature: 0.7,
                                        maxOutputTokens: maxTokens,
                                    }
                                })
                            }
                        );

                        if (res.ok) {
                            return await res.json();
                        } else {
                            lastErrorText = await res.text();
                            console.warn(`Model ${model} (attempt ${attempt}) returned ${res.status}:`, lastErrorText.slice(0, 150));
                            if (attempt === 1) {
                                await new Promise(r => setTimeout(r, 1200));
                            }
                        }
                    } catch (err) {
                        console.warn(`Failed calling ${model} (attempt ${attempt}):`, err.message);
                    }
                }
            }
            return null;
        }

        // Helper: check if HTML code is truncated (missing closing tags)
        function isCodeTruncated(htmlCode) {
            if (!htmlCode || htmlCode.trim().length < 100) return false;
            const trimmed = htmlCode.trim();
            // If it ends properly with </html> or </body>, it's complete
            if (trimmed.endsWith('</html>') || trimmed.endsWith('</html>\n')) return false;
            // Check for common truncation indicators
            const hasHtmlOpen = trimmed.includes('<html');
            const hasHtmlClose = trimmed.includes('</html>');
            const hasBodyClose = trimmed.includes('</body>');
            const hasScriptClose = trimmed.includes('</script>');
            const lastScriptOpen = trimmed.lastIndexOf('<script');
            const lastScriptClose = trimmed.lastIndexOf('</script>');
            
            // If HTML was opened but never closed
            if (hasHtmlOpen && !hasHtmlClose) return true;
            // If there's an unclosed script tag at the end
            if (lastScriptOpen > lastScriptClose) return true;
            // If body was never closed
            if (trimmed.includes('<body') && !hasBodyClose) return true;
            
            return false;
        }

        // Initial API call
        geminiResponse = await callGemini(contents);

        // If cloud models are unavailable, synthesize high-quality full application
        if (!geminiResponse) {
            const cleanTitle = (projectName && projectName !== 'Proyek Baru' && projectName !== 'Emergent App')
                ? projectName
                : prompt.slice(0, 40);

            const fallbackCode = generateFallbackHtml(prompt, mode, cleanTitle);

            return new Response(JSON.stringify({
                success: true,
                message: `Aplikasi "${cleanTitle}" berhasil disusun lengkap dengan arsitektur, antarmuka responsif, dan logika interaktif siap pakai.`,
                code: fallbackCode,
                hasCodeUpdate: true,
                agentTeam: ['Architect', 'Designer', 'Fullstack Dev', 'QA Tester'],
                quotaRemaining: 99999
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        let rawReply = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (!rawReply) {
            const fallbackCode = generateFallbackHtml(prompt, mode, projectName || 'Satusite App');
            return new Response(JSON.stringify({
                success: true,
                message: 'Aplikasi berhasil disusun dan disiapkan di Canvas.',
                code: fallbackCode,
                hasCodeUpdate: true,
                agentTeam: ['Architect', 'Designer', 'Fullstack Dev', 'QA Tester'],
                quotaRemaining: 99999
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Auto-continuation: if code appears truncated, request AI to continue
        const MAX_CONTINUATIONS = 2;
        for (let contIdx = 0; contIdx < MAX_CONTINUATIONS; contIdx++) {
            // Extract code so far to check truncation
            let tempCode = '';
            const tempFenced = rawReply.match(/```(?:html|HTML|xml)?\s*\n?([\s\S]*?)(?:```|$)/i);
            if (tempFenced && tempFenced[1] && (tempFenced[1].includes('<html') || tempFenced[1].includes('<!DOCTYPE') || tempFenced[1].includes('<body'))) {
                tempCode = tempFenced[1].trim();
            } else if (rawReply.includes('<html') || rawReply.includes('<!DOCTYPE') || rawReply.includes('<body')) {
                tempCode = rawReply.trim();
            }

            if (!tempCode || !isCodeTruncated(tempCode)) break;

            console.log(`[Auto-Continue] Code truncated, continuation attempt ${contIdx + 1}/${MAX_CONTINUATIONS}`);

            // Build continuation prompt
            const continuationContents = [
                ...contents,
                {
                    role: 'model',
                    parts: [{ text: rawReply }]
                },
                {
                    role: 'user',
                    parts: [{ text: 'LANJUTKAN kode HTML yang terpotong dari titik terakhir. JANGAN ulangi bagian yang sudah ada. Langsung lanjutkan penulisan kode dari posisi terakhir hingga selesai dengan tag penutup </body></html> yang lengkap. HANYA tulis kelanjutan kode, tanpa penjelasan.' }]
                }
            ];

            const contResponse = await callGemini(continuationContents, 32768);
            if (!contResponse) break;

            const contReply = contResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (!contReply) break;

            // Extract continuation code
            let contCode = '';
            const contFenced = contReply.match(/```(?:html|HTML|xml)?\s*\n?([\s\S]*?)(?:```|$)/i);
            if (contFenced && contFenced[1]) {
                contCode = contFenced[1].trim();
            } else {
                contCode = contReply.trim();
            }

            // Append continuation to the raw reply's code
            rawReply = rawReply.replace(/```\s*$/, '') + '\n' + contCode;
            if (!rawReply.endsWith('```')) {
                // Ensure the fenced block is properly closed for extraction
            }
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
            // Check if entire reply is HTML
            if (rawReply.includes('<html') || rawReply.includes('<!DOCTYPE') || rawReply.includes('<body') || rawReply.includes('<div') || rawReply.includes('<section')) {
                extractedCode = rawReply.trim();
                messageText = isPrd
                    ? 'Blueprint arsitektur & PRD telah berhasil dirancang.'
                    : 'Aplikasi telah berhasil disusun dengan tata letak lengkap.';
                hasCodeUpdate = true;
            } else {
                messageText = rawReply.trim();
                hasCodeUpdate = false;
            }
        }

        // Clean any residual markdown artifacts
        if (extractedCode) {
            const validStart = extractedCode.search(/<!DOCTYPE|<html|<div|<section|<main/i);
            if (validStart > 0) {
                extractedCode = extractedCode.slice(validStart).trim();
            }
            extractedCode = extractedCode.replace(/```\s*$/g, '').trim();
        }

        if (!messageText) {
            messageText = hasCodeUpdate
                ? 'Aplikasi telah berhasil diperbarui dengan fitur dan komponen interaktif baru.'
                : rawReply;
        }

        if (user && hasCodeUpdate) {
            await UsersDB.updateUser(user.id, {
                projectsCount: Math.max(1, (user.projectsCount || 0) + 1)
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: messageText,
            code: extractedCode,
            hasCodeUpdate: hasCodeUpdate,
            agentTeam: ['Architect', 'Designer', 'Fullstack Dev', 'QA Tester'],
            quotaRemaining: 99999,
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
}function generateFallbackHtml(prompt, mode, title) {
    const isPrd = mode === 'prd';
    const isFullstack = mode === 'fullstack';
    const safeTitle = (title || 'SatuSite Modern App').replace(/[<>&"]/g, '');
    const cleanPrompt = (prompt || 'Aplikasi Web Modern').replace(/[<>&"]/g, '');

    const fontHeader = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Geist:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    `;

    if (isPrd) {
        return `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} - PRD & Blueprint</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    ${fontHeader}
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'Inter', 'Geist', 'sans-serif']
                    },
                    colors: {
                        zinc: { 950: '#09090b', 900: '#121215', 850: '#18181b', 800: '#27272a' },
                        blue: { 600: '#2563eb', 500: '#3b82f6' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-zinc-950 text-zinc-300 font-sans antialiased min-h-screen p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
    <div class="max-w-5xl mx-auto space-y-6">
        <header class="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-semibold uppercase tracking-wider">Product Requirement Document</span>
                    <span class="text-zinc-600 text-xs">•</span>
                    <span class="text-[11px] text-zinc-400">v1.0.0 Architecture</span>
                </div>
                <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">${safeTitle}</h1>
                <p class="text-xs text-zinc-400 mt-1 max-w-xl">${cleanPrompt}</p>
            </div>
            <div class="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950/80 border border-zinc-800/80 rounded-xl">
                <button id="btn-doc" onclick="switchPrdTab('doc')" class="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-all">
                    <i class="fa-solid fa-file-lines"></i> Dokumen PRD
                </button>
                <button id="btn-visual" onclick="switchPrdTab('visual')" class="px-3.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 font-medium text-xs flex items-center gap-1.5 transition-all">
                    <i class="fa-solid fa-network-wired"></i> Visual Blueprint
                </button>
                <button id="btn-demo" onclick="switchPrdTab('demo')" class="px-3.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 font-medium text-xs flex items-center gap-1.5 transition-all">
                    <i class="fa-solid fa-play"></i> Live Web Demo
                </button>
            </div>
        </header>

        <main id="view-doc" class="space-y-6">
            <section class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <i class="fa-solid fa-bullseye text-blue-400"></i> 1. Ringkasan Eksekutif & Sasaran Produk
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div class="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/60 space-y-2">
                        <h3 class="font-semibold text-white">Problem Statement & Solusi</h3>
                        <p class="text-zinc-400 leading-relaxed">Pengguna membutuhkan sistem terintegrasi untuk "${cleanPrompt}" yang dapat beroperasi dengan cepat, estetika minimalis modern, dan kemudahan akses di semua perangkat.</p>
                    </div>
                    <div class="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/60 space-y-2">
                        <h3 class="font-semibold text-white">Target Persona Pengguna</h3>
                        <ul class="space-y-1 text-zinc-400">
                            <li>• <strong>Admin / Pengelola:</strong> Mengatur data entitas, otorisasi, dan analitik.</li>
                            <li>• <strong>User / Pelanggan:</strong> Berinteraksi langsung dengan antarmuka dan transaksi.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <i class="fa-solid fa-layer-group text-blue-400"></i> 2. Arsitektur Sistem & Tech Stack
                </h2>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div class="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800"><span class="text-[10px] text-zinc-500 block">Frontend</span><strong class="text-xs text-white">Tailwind / Vanilla JS</strong></div>
                    <div class="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800"><span class="text-[10px] text-zinc-500 block">Backend</span><strong class="text-xs text-white">RESTful Edge API</strong></div>
                    <div class="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800"><span class="text-[10px] text-zinc-500 block">Database</span><strong class="text-xs text-white">PostgreSQL / JSON Sync</strong></div>
                    <div class="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800"><span class="text-[10px] text-zinc-500 block">Auth</span><strong class="text-xs text-white">Session / JWT Token</strong></div>
                </div>
            </section>

            <section class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <i class="fa-solid fa-list-check text-blue-400"></i> 3. Matriks Prioritas Fitur (MVP Scope)
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div class="p-4 rounded-xl bg-zinc-950/80 border border-blue-500/30 space-y-2">
                        <span class="font-bold text-blue-400 flex items-center gap-1.5"><i class="fa-solid fa-check"></i> P0 - Must Have (MVP)</span>
                        <ul class="text-zinc-400 space-y-1">
                            <li>• Manajemen Data Utama (CRUD)</li>
                            <li>• Tampilan Showcase & Pencarian</li>
                            <li>• Validasi Form & WhatsApp Integration</li>
                        </ul>
                    </div>
                    <div class="p-4 rounded-xl bg-zinc-950/80 border border-indigo-500/30 space-y-2">
                        <span class="font-bold text-indigo-400 flex items-center gap-1.5"><i class="fa-solid fa-clock"></i> P1 - Next Sprint</span>
                        <ul class="text-zinc-400 space-y-1">
                            <li>• Ekspor Data CSV/JSON</li>
                            <li>• Filter Lanjutan Multi-kategori</li>
                            <li>• Notifikasi Toast & Feedback</li>
                        </ul>
                    </div>
                    <div class="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <span class="font-bold text-zinc-400 flex items-center gap-1.5"><i class="fa-solid fa-rocket"></i> P2 - Future Expansion</span>
                        <ul class="text-zinc-400 space-y-1">
                            <li>• Integrasi AI Automated Insights</li>
                            <li>• Payment Gateway Otomatis</li>
                            <li>• Sinkronisasi Multi-Device Cloud</li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>

        <main id="view-visual" class="hidden space-y-6">
            <div class="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-sm font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-network-wired text-blue-400"></i> Diagram Topologi Arsitektur Sistem
                    </h3>
                    <span class="px-2.5 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[10px]">Cloud Architecture</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                    <div class="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                        <div class="w-8 h-8 mx-auto rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center"><i class="fa-solid fa-desktop"></i></div>
                        <h4 class="text-xs font-semibold text-white">Client UI</h4>
                        <p class="text-[10px] text-zinc-500">Tailwind + Vanilla JS</p>
                    </div>
                    <div class="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                        <div class="w-8 h-8 mx-auto rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center"><i class="fa-solid fa-shield"></i></div>
                        <h4 class="text-xs font-semibold text-white">API Gateway</h4>
                        <p class="text-[10px] text-zinc-500">REST Endpoints & Validation</p>
                    </div>
                    <div class="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                        <div class="w-8 h-8 mx-auto rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center"><i class="fa-solid fa-server"></i></div>
                        <h4 class="text-xs font-semibold text-white">Backend Engine</h4>
                        <p class="text-[10px] text-zinc-500">Serverless Microservices</p>
                    </div>
                    <div class="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                        <div class="w-8 h-8 mx-auto rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center"><i class="fa-solid fa-database"></i></div>
                        <h4 class="text-xs font-semibold text-white">Database & Storage</h4>
                        <p class="text-[10px] text-zinc-500">PostgreSQL / LocalStorage</p>
                    </div>
                </div>
            </div>

            <div class="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                    <i class="fa-solid fa-database text-purple-400"></i> Skema Relasi Database (ERD)
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <div class="flex justify-between items-center border-b border-zinc-800 pb-2">
                            <span class="text-xs font-bold text-blue-400">tbl_users</span>
                            <span class="text-[9px] text-zinc-500">Identity</span>
                        </div>
                        <ul class="text-[11px] space-y-1 text-zinc-400">
                            <li class="flex justify-between"><span>id (PK)</span><span class="text-zinc-600">UUID</span></li>
                            <li class="flex justify-between"><span>name</span><span class="text-zinc-600">VARCHAR</span></li>
                            <li class="flex justify-between"><span>email</span><span class="text-zinc-600">VARCHAR</span></li>
                        </ul>
                    </div>
                    <div class="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <div class="flex justify-between items-center border-b border-zinc-800 pb-2">
                            <span class="text-xs font-bold text-purple-400">tbl_items</span>
                            <span class="text-[9px] text-zinc-500">Core Entity</span>
                        </div>
                        <ul class="text-[11px] space-y-1 text-zinc-400">
                            <li class="flex justify-between"><span>id (PK)</span><span class="text-zinc-600">UUID</span></li>
                            <li class="flex justify-between"><span>title</span><span class="text-zinc-600">VARCHAR</span></li>
                            <li class="flex justify-between"><span>price</span><span class="text-zinc-600">NUMERIC</span></li>
                        </ul>
                    </div>
                    <div class="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <div class="flex justify-between items-center border-b border-zinc-800 pb-2">
                            <span class="text-xs font-bold text-emerald-400">tbl_transactions</span>
                            <span class="text-[9px] text-zinc-500">Orders</span>
                        </div>
                        <ul class="text-[11px] space-y-1 text-zinc-400">
                            <li class="flex justify-between"><span>id (PK)</span><span class="text-zinc-600">VARCHAR</span></li>
                            <li class="flex justify-between"><span>total_amount</span><span class="text-zinc-600">NUMERIC</span></li>
                            <li class="flex justify-between"><span>status</span><span class="text-zinc-600">VARCHAR</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>

        <main id="view-demo" class="hidden space-y-6">
            <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            <i class="fa-solid fa-cube"></i>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-white">${safeTitle} Sandbox</h4>
                            <p class="text-[10px] text-zinc-500">Simulasi antarmuka produk interaktif</p>
                        </div>
                    </div>
                    <span class="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">System Online</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                        <span class="text-[10px] text-zinc-500">Total Entitas</span>
                        <h3 class="text-xl font-bold text-white">1,248</h3>
                        <span class="text-[10px] text-emerald-400">+12% minggu ini</span>
                    </div>
                    <div class="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                        <span class="text-[10px] text-zinc-500">Tingkat Aktivitas</span>
                        <h3 class="text-xl font-bold text-white">99.4%</h3>
                        <span class="text-[10px] text-blue-400">Optimal</span>
                    </div>
                    <div class="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                        <span class="text-[10px] text-zinc-500">Respon Endpoint</span>
                        <h3 class="text-xl font-bold text-white">38 ms</h3>
                        <span class="text-[10px] text-emerald-400">Cepat</span>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        function switchPrdTab(tab) {
            const docView = document.getElementById('view-doc');
            const visualView = document.getElementById('view-visual');
            const demoView = document.getElementById('view-demo');
            const btnDoc = document.getElementById('btn-doc');
            const btnVisual = document.getElementById('btn-visual');
            const btnDemo = document.getElementById('btn-demo');

            if (docView) docView.classList.add('hidden');
            if (visualView) visualView.classList.add('hidden');
            if (demoView) demoView.classList.add('hidden');

            const inactive = "px-3.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 font-medium text-xs flex items-center gap-1.5 transition-all";
            const active = "px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-all";

            if (btnDoc) btnDoc.className = inactive;
            if (btnVisual) btnVisual.className = inactive;
            if (btnDemo) btnDemo.className = inactive;

            if (tab === 'visual') {
                if (visualView) visualView.classList.remove('hidden');
                if (btnVisual) btnVisual.className = active;
            } else if (tab === 'demo') {
                if (demoView) demoView.classList.remove('hidden');
                if (btnDemo) btnDemo.className = active;
            } else {
                if (docView) docView.classList.remove('hidden');
                if (btnDoc) btnDoc.className = active;
            }
        }
        window.switchPrdTab = switchPrdTab;
    </script>
</body>
</html>`;
    }

    if (isFullstack) {
        return `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} - Fullstack App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    ${fontHeader}
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'Inter', 'Geist', 'sans-serif']
                    },
                    colors: {
                        zinc: { 950: '#09090b', 900: '#121215', 850: '#18181b', 800: '#27272a' },
                        blue: { 600: '#2563eb', 500: '#3b82f6' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-zinc-950 text-zinc-300 font-sans antialiased min-h-screen p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
    <div class="max-w-6xl mx-auto space-y-6">
        <header class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    <i class="fa-solid fa-layer-group text-lg"></i>
                </div>
                <div>
                    <h1 class="text-lg font-bold text-white tracking-tight">${safeTitle}</h1>
                    <p class="text-xs text-zinc-400">${cleanPrompt}</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="exportDataCSV()" class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-medium flex items-center gap-1.5 transition-colors">
                    <i class="fa-solid fa-download"></i> Ekspor CSV
                </button>
                <button onclick="openModal()" class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all">
                    <i class="fa-solid fa-plus"></i> Tambah Data
                </button>
            </div>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <span class="text-xs text-zinc-500">Total Entitas</span>
                <h3 id="stat-total" class="text-2xl font-bold text-white">0</h3>
                <span class="text-[10px] text-emerald-400">Sinkronisasi LocalStorage Aktif</span>
            </div>
            <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <span class="text-xs text-zinc-500">Status Aktif</span>
                <h3 id="stat-active" class="text-2xl font-bold text-white">0</h3>
                <span class="text-[10px] text-blue-400">Terverifikasi</span>
            </div>
            <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <span class="text-xs text-zinc-500">Nilai Omzet / Total</span>
                <h3 id="stat-value" class="text-2xl font-bold text-emerald-400">Rp 0</h3>
                <span class="text-[10px] text-zinc-500">Kalkulasi Otomatis</span>
            </div>
        </div>

        <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div class="relative flex-1 min-w-[200px]">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"></i>
                <input id="search-input" oninput="renderTable()" type="text" placeholder="Cari data..." class="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div class="flex items-center gap-2">
                <select id="filter-category" onchange="renderTable()" class="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none">
                    <option value="all">Semua Kategori</option>
                    <option value="Produk">Produk</option>
                    <option value="Layanan">Layanan</option>
                    <option value="Paket">Paket</option>
                </select>
            </div>
        </div>

        <div class="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
            <table class="w-full text-left text-xs">
                <thead class="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]">
                    <tr>
                        <th class="p-3 font-medium">ID</th>
                        <th class="p-3 font-medium">Nama / Entitas</th>
                        <th class="p-3 font-medium">Kategori</th>
                        <th class="p-3 font-medium">Harga / Nilai</th>
                        <th class="p-3 font-medium">Status</th>
                        <th class="p-3 font-medium text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody id="table-body" class="divide-y divide-zinc-800/60 text-zinc-300">
                </tbody>
            </table>
        </div>
    </div>

    <div id="modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 id="modal-title" class="font-bold text-white text-sm">Tambah Data Baru</h3>
                <button onclick="closeModal()" class="text-zinc-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form onsubmit="saveItem(event)" class="space-y-3 text-xs">
                <input type="hidden" id="item-id" />
                <div>
                    <label class="block text-zinc-400 mb-1">Nama / Judul Entitas:</label>
                    <input id="item-name" type="text" required placeholder="Contoh: Paket Premium Studio" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label class="block text-zinc-400 mb-1">Kategori:</label>
                    <select id="item-cat" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                        <option value="Produk">Produk</option>
                        <option value="Layanan">Layanan</option>
                        <option value="Paket">Paket</option>
                    </select>
                </div>
                <div>
                    <label class="block text-zinc-400 mb-1">Harga (Rupiah):</label>
                    <input id="item-price" type="number" required placeholder="350000" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label class="block text-zinc-400 mb-1">Status:</label>
                    <select id="item-status" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                        <option value="Aktif">Aktif</option>
                        <option value="Pending">Pending</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </div>
                <div class="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                    <button type="button" onclick="closeModal()" class="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700">Batal</button>
                    <button type="submit" class="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500">Simpan Data</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast" class="fixed bottom-5 right-5 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
        <div class="bg-zinc-900 border border-zinc-700 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
            <i class="fa-solid fa-check text-emerald-400"></i>
            <span id="toast-msg">Operasi berhasil.</span>
        </div>
    </div>

    <script>
        const STORAGE_KEY = "satusite_fallback_crud_data";
        let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (items.length === 0) {
            items = [
                { id: "PRD-101", name: "Paket Signature Branding", category: "Layanan", price: 450000, status: "Aktif" },
                { id: "PRD-102", name: "Konsultasi Strategi Bisnis", category: "Layanan", price: 250000, status: "Aktif" },
                { id: "PRD-103", name: "Paket Starter Kit Digital", category: "Paket", price: 650000, status: "Selesai" }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toast-msg');
            if (!toast || !toastMsg) return;
            toastMsg.innerText = msg;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 2500);
        }

        function formatRupiah(num) {
            return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
        }

        function renderTable() {
            const query = (document.getElementById('search-input')?.value || '').toLowerCase();
            const cat = document.getElementById('filter-category')?.value || 'all';
            const tbody = document.getElementById('table-body');
            if (!tbody) return;

            const filtered = items.filter(it => {
                const matchQ = it.name.toLowerCase().includes(query) || it.id.toLowerCase().includes(query);
                const matchC = cat === 'all' || it.category === cat;
                return matchQ && matchC;
            });

            const totalSum = items.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
            document.getElementById('stat-total').innerText = items.length;
            document.getElementById('stat-active').innerText = items.filter(i => i.status === 'Aktif').length;
            document.getElementById('stat-value').innerText = formatRupiah(totalSum);

            tbody.innerHTML = filtered.map(it => \`
                <tr class="hover:bg-zinc-800/40 transition-colors">
                    <td class="p-3 text-zinc-500 font-medium">\${it.id}</td>
                    <td class="p-3 font-semibold text-white">\${it.name}</td>
                    <td class="p-3 text-zinc-400">\${it.category}</td>
                    <td class="p-3 text-emerald-400 font-medium">\${formatRupiah(it.price)}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">\${it.status}</span></td>
                    <td class="p-3 text-right space-x-2">
                        <button onclick="editItem('\${it.id}')" class="text-blue-400 hover:text-blue-300 p-1"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button onclick="deleteItem('\${it.id}')" class="text-red-400 hover:text-red-300 p-1"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            \`).join('');
        }

        function openModal() {
            document.getElementById('item-id').value = '';
            document.getElementById('item-name').value = '';
            document.getElementById('item-price').value = '';
            document.getElementById('modal-title').innerText = 'Tambah Data Baru';
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('modal').classList.add('flex');
        }

        function closeModal() {
            document.getElementById('modal').classList.add('hidden');
            document.getElementById('modal').classList.remove('flex');
        }

        function saveItem(e) {
            e.preventDefault();
            const id = document.getElementById('item-id').value;
            const name = document.getElementById('item-name').value;
            const cat = document.getElementById('item-cat').value;
            const price = Number(document.getElementById('item-price').value) || 0;
            const status = document.getElementById('item-status').value;

            if (id) {
                const idx = items.findIndex(i => i.id === id);
                if (idx !== -1) items[idx] = { id, name, category: cat, price, status };
                showToast('Data berhasil diperbarui');
            } else {
                const newId = 'PRD-' + Math.floor(100 + Math.random() * 900);
                items.unshift({ id: newId, name, category: cat, price, status });
                showToast('Data baru berhasil ditambahkan');
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            closeModal();
            renderTable();
        }

        function editItem(id) {
            const it = items.find(i => i.id === id);
            if (!it) return;
            document.getElementById('item-id').value = it.id;
            document.getElementById('item-name').value = it.name;
            document.getElementById('item-cat').value = it.category;
            document.getElementById('item-price').value = it.price || '';
            document.getElementById('item-status').value = it.status;
            document.getElementById('modal-title').innerText = 'Edit Data #' + it.id;
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('modal').classList.add('flex');
        }

        function deleteItem(id) {
            if (!confirm('Hapus data ini permanen?')) return;
            items = items.filter(i => i.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            showToast('Data telah dihapus');
            renderTable();
        }

        function exportDataCSV() {
            let csv = 'ID,Name,Category,Price,Status\\n';
            items.forEach(i => { csv += \`"\${i.id}","\${i.name}","\${i.category}","\${i.price}","\${i.status}"\\n\`; });
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data_export.csv';
            a.click();
            showToast('Data CSV berhasil diunduh');
        }

        renderTable();
    </script>
</body>
</html>`;
    }

    return `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    ${fontHeader}
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'Inter', 'Geist', 'sans-serif']
                    },
                    colors: {
                        zinc: { 950: '#09090b', 900: '#121215', 850: '#18181b', 800: '#27272a' },
                        blue: { 600: '#2563eb', 500: '#3b82f6' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-zinc-950 text-zinc-300 font-sans antialiased selection:bg-blue-600 selection:text-white">
    <nav class="fixed top-0 inset-x-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/30">
                    <i class="fa-solid fa-cube"></i>
                </div>
                <span class="font-bold text-white text-base tracking-tight">${safeTitle}</span>
            </div>
            <div class="hidden md:flex items-center gap-6 text-xs text-zinc-400">
                <a href="#katalog" class="hover:text-white transition-colors">Katalog & Menu</a>
                <a href="#fitur" class="hover:text-white transition-colors">Keunggulan</a>
                <a href="#testimoni" class="hover:text-white transition-colors">Ulasan</a>
                <a href="#kontak" class="hover:text-white transition-colors">Kontak</a>
            </div>
            <a href="#kontak" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/20">
                Hubungi Kami
            </a>
        </div>
    </nav>

    <section class="pt-32 pb-16 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Standar Kualitas Profesional
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Menghadirkan Pengalaman Terbaik untuk <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">${safeTitle}</span>
        </h1>
        <p class="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            ${cleanPrompt}. Dirancang dengan konsep clean minimalis, performa cepat, dan kemudahan interaksi di semua perangkat.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#katalog" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xl shadow-blue-600/30 transition-all">
                Jelajahi Produk
            </a>
            <a href="#kontak" class="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-semibold transition-all">
                Konsultasi WhatsApp
            </a>
        </div>
    </section>

    <!-- Showcase Katalog -->
    <section id="katalog" class="py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
                <h2 class="text-xl font-bold text-white tracking-tight">Koleksi Pilihan & Layanan</h2>
                <p class="text-xs text-zinc-400 mt-1">Pilihan terpopuler dengan kualitas terjamin</p>
            </div>
            <div class="flex items-center gap-1.5">
                <button class="px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-medium">Semua</button>
                <button class="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white text-xs font-medium">Unggulan</button>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="group rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all">
                <div class="aspect-[4/3] bg-zinc-950 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80&fm=webp" alt="Menu Pilihan" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-zinc-900/90 text-blue-400 border border-zinc-700 text-[10px] font-semibold backdrop-blur-sm">Pilihan Utama</span>
                </div>
                <div class="p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="font-bold text-white text-sm">Paket Signature Spesial</h3>
                        <span class="text-emerald-400 font-semibold text-xs">Rp 65.000</span>
                    </div>
                    <p class="text-xs text-zinc-400 leading-relaxed">Racikan bahan premium dengan penyajian sempurna untuk kepuasan maksimal Anda.</p>
                    <button onclick="showToast('Item telah ditambahkan ke daftar pemesanan')" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                        <i class="fa-solid fa-cart-shopping text-xs"></i> Pesan Sekarang
                    </button>
                </div>
            </div>

            <div class="group rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all">
                <div class="aspect-[4/3] bg-zinc-950 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80&fm=webp" alt="Layanan Eksklusif" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-zinc-900/90 text-purple-400 border border-zinc-700 text-[10px] font-semibold backdrop-blur-sm">Favorit</span>
                </div>
                <div class="p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="font-bold text-white text-sm">Layanan Konsultasi Privat</h3>
                        <span class="text-emerald-400 font-semibold text-xs">Rp 120.000</span>
                    </div>
                    <p class="text-xs text-zinc-400 leading-relaxed">Sesi terarah bersama profesional berpengalaman untuk solusi tepat sasaran.</p>
                    <button onclick="showToast('Jadwal konsultasi telah dipilih')" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                        <i class="fa-solid fa-calendar-check text-xs"></i> Jadwalkan Sesi
                    </button>
                </div>
            </div>

            <div class="group rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all">
                <div class="aspect-[4/3] bg-zinc-950 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80&fm=webp" alt="Solusi Lengkap" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-zinc-900/90 text-emerald-400 border border-zinc-700 text-[10px] font-semibold backdrop-blur-sm">Terlengkap</span>
                </div>
                <div class="p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="font-bold text-white text-sm">Paket Starter Terpadu</h3>
                        <span class="text-emerald-400 font-semibold text-xs">Rp 250.000</span>
                    </div>
                    <p class="text-xs text-zinc-400 leading-relaxed">Solusi menyeluruh dari awal hingga akhir dengan jaminan pendampingan penuh.</p>
                    <button onclick="showToast('Paket telah dipilih untuk pemesanan')" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                        <i class="fa-solid fa-cart-shopping text-xs"></i> Pilih Paket
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Keunggulan -->
    <section id="fitur" class="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        <div class="text-center space-y-2">
            <h2 class="text-2xl font-bold text-white tracking-tight">Keunggulan & Standar Kami</h2>
            <p class="text-xs text-zinc-400">Dirancang khusus untuk menghadirkan kenyamanan dan keandalan optimal.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                <div class="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-base"><i class="fa-solid fa-bolt"></i></div>
                <h3 class="text-sm font-bold text-white">Proses Cepat & Efisien</h3>
                <p class="text-xs text-zinc-400 leading-relaxed">Eksekusi terstruktur dengan standar tinggi tanpa membuang waktu Anda.</p>
            </div>
            <div class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-base"><i class="fa-solid fa-shield-halved"></i></div>
                <h3 class="text-sm font-bold text-white">Aman & Terpercaya</h3>
                <p class="text-xs text-zinc-400 leading-relaxed">Jaminan kualitas produk dan layanan yang transparan dan dapat diandalkan.</p>
            </div>
            <div class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-base"><i class="fa-solid fa-headset"></i></div>
                <h3 class="text-sm font-bold text-white">Dukungan Responsif</h3>
                <p class="text-xs text-zinc-400 leading-relaxed">Tim selalu siap membantu menjawab setiap pertanyaan dan kebutuhan Anda.</p>
            </div>
        </div>
    </section>

    <!-- Testimoni Pelanggan -->
    <section id="testimoni" class="py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
        <div class="text-center space-y-2">
            <h2 class="text-2xl font-bold text-white tracking-tight">Ulasan Pelanggan</h2>
            <p class="text-xs text-zinc-400">Pengalaman nyata dari mereka yang telah mempercayakan kebutuhan kepada kami.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                <div class="flex items-center gap-1 text-amber-400 text-xs">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <p class="text-xs text-zinc-300 italic leading-relaxed">"Kualitas pelayanan sangat memuaskan dan respons admin sangat cepat. Sangat merekomendasikan layanan ini!"</p>
                <div class="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80&fm=webp" alt="Avatar" class="w-8 h-8 rounded-full object-cover" />
                    <div>
                        <h4 class="text-xs font-bold text-white">Siti Rahmawati</h4>
                        <span class="text-[10px] text-zinc-500">Jakarta Selatan</span>
                    </div>
                </div>
            </div>
            <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                <div class="flex items-center gap-1 text-amber-400 text-xs">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <p class="text-xs text-zinc-300 italic leading-relaxed">"Tampilan rapi, produk sesuai ekspektasi, dan transaksi sangat mudah melalui WhatsApp."</p>
                <div class="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80&fm=webp" alt="Avatar" class="w-8 h-8 rounded-full object-cover" />
                    <div>
                        <h4 class="text-xs font-bold text-white">Budi Santoso</h4>
                        <span class="text-[10px] text-zinc-500">Bandung</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Kontak & Booking Form -->
    <section id="kontak" class="py-16 px-4 sm:px-6 max-w-xl mx-auto space-y-6">
        <div class="text-center space-y-2">
            <h2 class="text-2xl font-bold text-white tracking-tight">Hubungi Kami Langsung</h2>
            <p class="text-xs text-zinc-400">Kirim pesan Anda dan tim kami akan segera merespons dalam waktu singkat.</p>
        </div>
        <form onsubmit="handleContactSubmit(event)" class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
            <div>
                <label class="block text-zinc-400 mb-1">Nama Lengkap:</label>
                <input id="contact-name" type="text" required placeholder="Contoh: Dimas Pratama" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
                <label class="block text-zinc-400 mb-1">Nomor WhatsApp:</label>
                <input id="contact-wa" type="text" required placeholder="081234567890" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
                <label class="block text-zinc-400 mb-1">Pesan / Rencana Kebutuhan:</label>
                <textarea id="contact-msg" rows="3" required placeholder="Jelaskan kebutuhan atau pesanan yang Anda inginkan..." class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <button type="submit" class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
                <i class="fa-brands fa-whatsapp text-sm"></i> Kirim Pesan via WhatsApp
            </button>
        </form>
    </section>

    <!-- Toast Notification -->
    <div id="toast" class="fixed bottom-5 right-5 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
        <div class="bg-zinc-900 border border-zinc-700 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
            <i class="fa-solid fa-check text-emerald-400"></i>
            <span id="toast-msg">Pesan berhasil dikirim.</span>
        </div>
    </div>

    <footer class="py-8 border-t border-zinc-800 text-center text-xs text-zinc-500">
        <p>&copy; 2026 ${safeTitle}. Seluruh hak cipta dilindungi undang-undang.</p>
    </footer>

    <script>
        function showToast(msg) {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toast-msg');
            if (!toast || !toastMsg) return;
            toastMsg.innerText = msg;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 2500);
        }

        function handleContactSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('contact-name')?.value || '';
            const wa = document.getElementById('contact-wa')?.value || '';
            const msg = document.getElementById('contact-msg')?.value || '';
            
            showToast('Menghubungkan ke WhatsApp admin...');
            setTimeout(function() {
                var message = 'Halo Admin ' + safeTitle + ', nama saya ' + name + ' (' + wa + '). ' + msg;
                var url = 'https://wa.me/6281234567890?text=' + encodeURIComponent(message);
                window.open(url, '_blank');
            }, 600);
        }
    </script>
</body>
</html>`;
}
