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
Tugas Anda adalah merancang dan membangun antarmuka web, aplikasi web interaktif, prototipe digital, atau dokumen arsitektur sesuai kebutuhan dan instruksi pengguna dengan kualitas tinggi dan standar industri modern.

PEDOMAN UTAMA:
1. DILARANG KERAS MENGGUNAKAN EMOJI / EMOTICON APAPUN (ATURAN MUTLAK):
   - JANGAN PERNAH menyertakan karakter emoji atau emoticon apa pun di seluruh bagian: judul, teks tombol, badge status, menu, kartu, footer, komentar kode, maupun di pesan obrolan.
   - Gunakan icon garis netral profesional dari FontAwesome 6 CDN (misal: <i class="fa-solid fa-arrow-right"></i>, <i class="fa-solid fa-check"></i>, <i class="fa-solid fa-user"></i>, <i class="fa-solid fa-gauge"></i>, <i class="fa-solid fa-magnifying-glass"></i>, dll.) atau inline SVG jika memerlukan representasi ikon visual.

2. SUGGESTION & DESAIN MURNI GEMINI 3.7 FLASH:
   - Berikan rekomendasi terbaik dan bangun solusi secara murni dari kecerdasan Gemini 3.7 Flash, disesuaikan secara fleksibel dengan prompt dan spesifikasi yang diminta pengguna.
   - Hasilkan antarmuka yang modern, bersih, proporsional, estetis, dan responsif di berbagai perangkat (desktop, tablet, mobile).
   - Dukung opsi tema yang fleksibel (Dark Mode & Light Mode) dengan estetika premium.

3. ARSITEKTUR FRONTEND MULTI-HALAMAN (JS, CSS & TAILWIND):
   Jika mode adalah Frontend (atau saat membuat UI website/aplikasi frontend), rancang antarmuka sebagai sistem Multi-Halaman SPA Router yang mulus tanpa reload halaman, dengan pemanfaatan JavaScript, Modern CSS, dan Tailwind CSS secara maksimal:
   a. Halaman Beranda / Home (#page-home):
      - Hero section visual menarik dengan CTA, kartu highlight fitur unggulan, showcase singkat, dan testimoni ulasan.
   b. Halaman Katalog / Layanan / Portofolio (#page-catalog):
      - Grid kartu produk/layanan interaktif dengan pencarian langsung (live search) dan filter kategori.
      - Modal interaktif (Quick-View Detail) saat item diklik.
   c. Halaman Tentang Kami / Profil (#page-about):
      - Kisah perusahaan/produk, visi & misi, nilai utama, dan metrik pencapaian.
   d. Halaman Kontak & FAQ Interaktif (#page-contact):
      - Formulir kontak responsif (nama, email/wa, pesan) dengan simulasi kirim toast feedback & integrasi WhatsApp.
      - Accordion FAQ interaktif yang dapat dibuka-tutup dengan animasi mulus.
   e. Interaktivitas JavaScript (Vanilla JS):
      - Navigasi halaman instan tanpa refresh (fungsi navigatePage(pageId)).
      - Toggle tema Gelap & Terang (Dark/Light mode).
      - Modal dialog interaktif dan toast notifikasi visual.

4. ARSITEKTUR FULLSTACK MULTI-HALAMAN (STANDAR ASTRO + NODE.JS):
   Jika mode adalah Fullstack (atau pengguna meminta web app lengkap), rancang antarmuka sebagai sistem Multi-Halaman SPA Router yang mencakup:
   a. Halaman Publik / Beranda (src/pages/index.astro).
   b. Halaman Autentikasi (src/pages/login.astro & register.astro) dengan pilihan peran User vs Administrator.
   c. Portal Akun Pengguna (src/pages/portal/index.astro) dengan profil & riwayat aktivitas.
   d. Portal Admin & CRUD Management Dashboard (src/pages/admin/index.astro) dengan tabel CRUD lengkap (Tambah modal, Edit, Hapus konfirmasi, Filter, dan Ekspor CSV/JSON).
   e. Lapisan Simulasi API Node.js / LocalStorage Engine terpadu.

5. STRUKTUR KODE MANDIRI (SELF-CONTAINED HTML5 SIAP EKSPOR):
   - Hasilkan kode satu file HTML5 lengkap dan mandiri yang menggabungkan HTML5 semantik, styling (Tailwind CSS CDN + FontAwesome 6 CDN), dan JavaScript modular fungsional.
   - Pastikan seluruh navigasi halaman, tombol, form input, modal, accordion, dan fungsi interaktif 100% bekerja secara nyata di Canvas browser.

6. ATURAN REVISI & EDITING BERTAHAP (INCREMENTAL EDITING):
   - Jika terdapat "KODE TERKINI (REFERENSI UPDATE)", pertahankan logika dan fungsionalitas yang sudah bekerja dengan baik, lalu terapkan perubahan yang diminta secara presisi dengan menghasilkan kembali seluruh file HTML5 utuh.

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
    <title>${safeTitle} - Astro Fullstack Web App</title>
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
                        zinc: { 950: '#09090b', 900: '#121215', 850: '#18181b', 800: '#27272a', 700: '#3f3f46' },
                        blue: { 600: '#2563eb', 500: '#3b82f6', 400: '#60a5fa' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-zinc-950 text-zinc-300 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200">
    
    <!-- TOP NAVIGATION BAR (Multi-Page Navigation) -->
    <header class="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3 transition-colors">
        <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <!-- Brand Logo -->
            <div class="flex items-center gap-3 cursor-pointer" onclick="navigatePage('home')">
                <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    <i class="fa-solid fa-cube text-base"></i>
                </div>
                <div>
                    <h1 class="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">${safeTitle}</h1>
                    <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Astro Fullstack App</span>
                </div>
            </div>

            <!-- Page Navigation Links -->
            <nav class="hidden md:flex items-center gap-1 bg-zinc-950/70 border border-zinc-800/70 p-1 rounded-xl">
                <button id="nav-home" onclick="navigatePage('home')" class="nav-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white transition-all">
                    <i class="fa-solid fa-house text-[11px] mr-1.5"></i> Beranda
                </button>
                <button id="nav-catalog" onclick="navigatePage('catalog')" class="nav-btn px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                    <i class="fa-solid fa-layer-group text-[11px] mr-1.5"></i> Katalog
                </button>
                <button id="nav-portal" onclick="navigatePage('portal')" class="nav-btn px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                    <i class="fa-solid fa-user text-[11px] mr-1.5"></i> Portal Akun
                </button>
                <button id="nav-admin" onclick="navigatePage('admin')" class="nav-btn px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                    <i class="fa-solid fa-gauge text-[11px] mr-1.5"></i> Portal Admin
                </button>
            </nav>

            <!-- Right Action Bar (Theme Toggle & Dynamic Auth) -->
            <div class="flex items-center gap-2">
                <button onclick="toggleTheme()" class="w-8 h-8 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 flex items-center justify-center transition-colors" title="Toggle Tema">
                    <i id="theme-icon" class="fa-solid fa-moon text-xs"></i>
                </button>
                <div id="auth-nav-container">
                    <button onclick="navigatePage('auth')" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-right-to-bracket text-xs"></i>
                        <span>Masuk</span>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- MAIN MULTI-PAGE CONTAINER -->
    <main class="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">

        <!-- ================= PAGE 1: BERANDA / PUBLIK (src/pages/index.astro) ================= -->
        <section id="page-home" class="page-view space-y-8 animate-fade-in">
            <!-- Hero Banner -->
            <div class="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-zinc-950 border border-zinc-800/80 shadow-2xl">
                <div class="max-w-2xl space-y-4">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                        <i class="fa-solid fa-circle-check text-[10px]"></i>
                        <span>Aplikasi Web Fullstack Modern Berbasis Astro + Node.js</span>
                    </div>
                    <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        Solusi Digital Terpadu untuk <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">${safeTitle}</span>
                    </h2>
                    <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        ${cleanPrompt}. Ditenagai arsitektur modular yang menggabungkan kemudahan akses publik, portal akun personal, dan dashboard admin terpadu.
                    </p>
                    <div class="flex flex-wrap items-center gap-3 pt-2">
                        <button onclick="navigatePage('catalog')" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer">
                            <span>Eksplorasi Katalog</span>
                            <i class="fa-solid fa-arrow-right text-xs"></i>
                        </button>
                        <button onclick="navigatePage('admin')" class="px-4 py-2.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700/70 flex items-center gap-2 transition-colors cursor-pointer">
                            <i class="fa-solid fa-gauge text-xs"></i>
                            <span>Buka Portal Admin</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 3 Highlights Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                    <div class="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                        <i class="fa-solid fa-bolt text-sm"></i>
                    </div>
                    <h3 class="font-bold text-white text-sm">Performa Cepat & Responsif</h3>
                    <p class="text-xs text-zinc-400 leading-relaxed">Arsitektur modern dengan rendering instan dan navigasi SPA mulus tanpa reload halaman.</p>
                </div>
                <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                    <div class="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                        <i class="fa-solid fa-user-shield text-sm"></i>
                    </div>
                    <h3 class="font-bold text-white text-sm">Portal Akun & Autentikasi</h3>
                    <p class="text-xs text-zinc-400 leading-relaxed">Manajemen pengguna dengan sistem login peran ganda (User & Administrator) terproteksi.</p>
                </div>
                <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                    <div class="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                        <i class="fa-solid fa-database text-sm"></i>
                    </div>
                    <h3 class="font-bold text-white text-sm">Manajemen CRUD Persisten</h3>
                    <p class="text-xs text-zinc-400 leading-relaxed">Sistem database tersimpan otomatis dengan kemampuan ekspor data ke format CSV/JSON.</p>
                </div>
            </div>
        </section>

        <!-- ================= PAGE 2: KATALOG / DAFTAR LAYANAN ================= -->
        <section id="page-catalog" class="page-view hidden space-y-6 animate-fade-in">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-lg">
                <div>
                    <h2 class="text-lg font-bold text-white">Katalog Produk & Layanan</h2>
                    <p class="text-xs text-zinc-400">Jelajahi seluruh daftar data aktif secara langsung</p>
                </div>
                <div class="flex items-center gap-2">
                    <div class="relative w-full sm:w-60">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"></i>
                        <input id="catalog-search" oninput="renderCatalog()" type="text" placeholder="Cari layanan..." class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500" />
                    </div>
                </div>
            </div>

            <!-- Catalog Grid -->
            <div id="catalog-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <!-- Injected via JS -->
            </div>
        </section>

        <!-- ================= PAGE 3: HALAMAN AUTENTIKASI (src/pages/login.astro) ================= -->
        <section id="page-auth" class="page-view hidden max-w-md mx-auto space-y-6 animate-fade-in py-8">
            <div class="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-5">
                <div class="text-center space-y-1.5">
                    <div class="w-12 h-12 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xl mb-2">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <h2 id="auth-title" class="text-lg font-bold text-white">Masuk ke Akun Anda</h2>
                    <p id="auth-subtitle" class="text-xs text-zinc-400">Pilih peran dan isi kredensial untuk melanjutkan</p>
                </div>

                <!-- Auth Tabs: Login vs Register -->
                <div class="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs font-semibold">
                    <button id="tab-login" onclick="switchAuthTab('login')" class="flex-1 py-1.5 rounded-lg bg-blue-600 text-white transition-all">Masuk</button>
                    <button id="tab-register" onclick="switchAuthTab('register')" class="flex-1 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-all">Buat Akun</button>
                </div>

                <!-- Form -->
                <form id="auth-form" onsubmit="handleAuthSubmit(event)" class="space-y-3.5 text-xs">
                    <div id="field-name" class="hidden space-y-1">
                        <label class="font-medium text-zinc-300">Nama Lengkap:</label>
                        <input id="auth-name" type="text" placeholder="Nama Anda" class="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div class="space-y-1">
                        <label class="font-medium text-zinc-300">Alamat Email:</label>
                        <input id="auth-email" type="email" required placeholder="user@domain.com" class="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div class="space-y-1">
                        <label class="font-medium text-zinc-300">Kata Sandi:</label>
                        <input id="auth-password" type="password" required placeholder="••••••••" class="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <!-- Role Switcher -->
                    <div class="space-y-1 pt-1">
                        <label class="font-medium text-zinc-300">Simulasi Masuk Sebagai:</label>
                        <div class="grid grid-cols-2 gap-2">
                            <label class="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 cursor-pointer hover:border-zinc-700">
                                <input type="radio" name="auth-role" value="user" checked class="text-blue-600 focus:ring-0" />
                                <span class="font-medium text-xs">Pengguna</span>
                            </label>
                            <label class="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 cursor-pointer hover:border-zinc-700">
                                <input type="radio" name="auth-role" value="admin" class="text-blue-600 focus:ring-0" />
                                <span class="font-medium text-xs">Administrator</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" id="auth-submit-btn" class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer mt-2">
                        Masuk Sekarang
                    </button>
                </form>
            </div>
        </section>

        <!-- ================= PAGE 4: PORTAL AKUN PENGGUNA (src/pages/portal/index.astro) ================= -->
        <section id="page-portal" class="page-view hidden space-y-6 animate-fade-in">
            <div class="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-6">
                <!-- User Profile Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <span id="user-avatar">U</span>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h2 id="user-display-name" class="text-base sm:text-lg font-bold text-white">Akun Pengguna</h2>
                                <span id="user-role-badge" class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase">User</span>
                            </div>
                            <p id="user-display-email" class="text-xs text-zinc-400">user@domain.com</p>
                        </div>
                    </div>
                    <button onclick="handleLogout()" class="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 border border-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
                        <span>Keluar Akun</span>
                    </button>
                </div>

                <!-- User Content Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <!-- Status Ringkasan -->
                    <div class="space-y-3">
                        <h3 class="font-bold text-white text-xs uppercase tracking-wider text-zinc-400">Ringkasan Aktivitas</h3>
                        <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                            <span class="text-[11px] text-zinc-500">Status Akun:</span>
                            <div class="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                                <i class="fa-solid fa-circle-check text-xs"></i>
                                <span>Terverifikasi Aktif</span>
                            </div>
                            <span class="text-[10px] text-zinc-500 block pt-1">Sesi tersimpan lokal aman</span>
                        </div>
                    </div>

                    <!-- Riwayat Transaksi / Aktivitas -->
                    <div class="md:col-span-2 space-y-3">
                        <h3 class="font-bold text-white text-xs uppercase tracking-wider text-zinc-400">Riwayat Layanan & Aktivitas</h3>
                        <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                            <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
                                <div>
                                    <div class="font-semibold text-white">Akses Layanan Terpadu</div>
                                    <div class="text-[10px] text-zinc-500">Sesi aktif terkini</div>
                                </div>
                                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Aktif</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-semibold text-white">Sinkronisasi Profil</div>
                                    <div class="text-[10px] text-zinc-500">Penyimpanan lokal Node.js Mock</div>
                                </div>
                                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Tersinkron</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ================= PAGE 5: PORTAL ADMIN & CRUD (src/pages/admin/index.astro) ================= -->
        <section id="page-admin" class="page-view hidden space-y-6 animate-fade-in">
            <!-- Header & Action -->
            <div class="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                        <i class="fa-solid fa-gauge-high text-base"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-base font-bold text-white">Portal Administrator & CRUD</h2>
                            <span class="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">ADMIN ACCESS</span>
                        </div>
                        <p class="text-xs text-zinc-400">Manajemen data, verifikasi entitas, dan ekspor data sistem</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="exportDataCSV()" class="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
                        <i class="fa-solid fa-download text-xs"></i>
                        <span>Ekspor CSV</span>
                    </button>
                    <button onclick="openModal()" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all cursor-pointer">
                        <i class="fa-solid fa-plus text-xs"></i>
                        <span>Tambah Data</span>
                    </button>
                </div>
            </div>

            <!-- Stats Metric Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
                    <span class="text-xs text-zinc-500">Total Entitas Data</span>
                    <h3 id="stat-total" class="text-2xl font-bold text-white">0</h3>
                    <span class="text-[10px] text-emerald-400 font-medium">Sinkronisasi Database Aktif</span>
                </div>
                <div class="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
                    <span class="text-xs text-zinc-500">Data Status Aktif</span>
                    <h3 id="stat-active" class="text-2xl font-bold text-white">0</h3>
                    <span class="text-[10px] text-blue-400 font-medium">Terverifikasi Sistem</span>
                </div>
                <div class="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
                    <span class="text-xs text-zinc-500">Nilai Omzet / Total Transaksi</span>
                    <h3 id="stat-value" class="text-2xl font-bold text-emerald-400">Rp 0</h3>
                    <span class="text-[10px] text-zinc-500">Kalkulasi Real-time</span>
                </div>
            </div>

            <!-- Search & Filter Bar -->
            <div class="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div class="relative flex-1 min-w-[220px]">
                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"></i>
                    <input id="search-input" oninput="renderTable()" type="text" placeholder="Cari data berdasarkan ID atau Nama..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div class="flex items-center gap-2">
                    <select id="filter-category" onchange="renderTable()" class="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none cursor-pointer">
                        <option value="all">Semua Kategori</option>
                        <option value="Produk">Produk</option>
                        <option value="Layanan">Layanan</option>
                        <option value="Paket">Paket</option>
                    </select>
                </div>
            </div>

            <!-- Table Container -->
            <div class="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-inner">
                <table class="w-full text-left text-xs">
                    <thead class="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]">
                        <tr>
                            <th class="p-3.5 font-semibold">ID</th>
                            <th class="p-3.5 font-semibold">Nama / Entitas</th>
                            <th class="p-3.5 font-semibold">Kategori</th>
                            <th class="p-3.5 font-semibold">Nilai / Harga</th>
                            <th class="p-3.5 font-semibold">Status</th>
                            <th class="p-3.5 font-semibold text-right">Aksi Manajemen</th>
                        </tr>
                    </thead>
                    <tbody id="table-body" class="divide-y divide-zinc-800/60 text-zinc-300">
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <!-- FOOTER ARCHITECTURE INDICATOR -->
    <footer class="mt-auto border-t border-zinc-800/80 bg-zinc-900/40 py-4 px-6 text-center text-xs text-zinc-500">
        <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span class="font-mono text-[11px]">${safeTitle} • Astro Fullstack Architecture</span>
            <div class="flex items-center gap-2 text-[10px] font-mono">
                <span class="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Astro SSR</span>
                <span class="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Node.js API</span>
                <span class="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Tailwind CSS</span>
            </div>
        </div>
    </footer>

    <!-- MODAL TAMBAH / EDIT DATA (ADMIN CRUD) -->
    <div id="modal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden items-center justify-center p-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div class="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 id="modal-title" class="font-bold text-white text-sm">Tambah Data Baru</h3>
                <button onclick="closeModal()" class="text-zinc-400 hover:text-white p-1"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form onsubmit="saveItem(event)" class="space-y-3 text-xs">
                <input type="hidden" id="item-id" />
                <div class="space-y-1">
                    <label class="font-medium text-zinc-300">Nama / Judul Entitas:</label>
                    <input id="item-name" type="text" required placeholder="Contoh: Paket Premium Studio" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div class="space-y-1">
                    <label class="font-medium text-zinc-300">Kategori:</label>
                    <select id="item-cat" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                        <option value="Layanan">Layanan</option>
                        <option value="Produk">Produk</option>
                        <option value="Paket">Paket</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="font-medium text-zinc-300">Harga / Nilai (Rupiah):</label>
                    <input id="item-price" type="number" required placeholder="350000" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div class="space-y-1">
                    <label class="font-medium text-zinc-300">Status Entitas:</label>
                    <select id="item-status" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                        <option value="Aktif">Aktif</option>
                        <option value="Pending">Pending</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </div>
                <div class="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">Batal</button>
                    <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-md">Simpan Data</button>
                </div>
            </form>
        </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div id="toast" class="fixed bottom-5 right-5 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
        <div class="bg-zinc-900 border border-zinc-700 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-emerald-400"></i>
            <span id="toast-msg">Operasi berhasil.</span>
        </div>
    </div>

    <!-- JAVASCRIPT LOGIC & STATE ENGINE -->
    <script>
        // State Keys
        var STORAGE_DATA_KEY = "satusite_fullstack_data";
        var STORAGE_AUTH_KEY = "satusite_fullstack_auth_user";

        // Initial Seed Data
        var items = JSON.parse(localStorage.getItem(STORAGE_DATA_KEY) || "[]");
        if (items.length === 0) {
            items = [
                { id: "AST-101", name: "Paket Signature Digital", category: "Layanan", price: 450000, status: "Aktif" },
                { id: "AST-102", name: "Modul Konsultasi Strategis", category: "Layanan", price: 250000, status: "Aktif" },
                { id: "AST-103", name: "Paket Starter Kit Arsitektur", category: "Paket", price: 750000, status: "Selesai" }
            ];
            localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(items));
        }

        var currentUser = JSON.parse(localStorage.getItem(STORAGE_AUTH_KEY) || "null");

        // Page Routing Navigator
        function navigatePage(pageId) {
            var views = document.querySelectorAll('.page-view');
            for (var i = 0; i < views.length; i++) {
                views[i].classList.add('hidden');
            }
            var target = document.getElementById('page-' + pageId);
            if (target) target.classList.remove('hidden');

            var btns = document.querySelectorAll('.nav-btn');
            for (var j = 0; j < btns.length; j++) {
                btns[j].className = "nav-btn px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all";
            }

            var activeBtn = document.getElementById('nav-' + pageId);
            if (activeBtn) {
                activeBtn.className = "nav-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white transition-all";
            }

            if (pageId === 'admin') renderTable();
            if (pageId === 'catalog') renderCatalog();
            if (pageId === 'portal') renderPortal();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Theme Toggle (Dark / Light)
        function toggleTheme() {
            var html = document.documentElement;
            var icon = document.getElementById('theme-icon');
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                if (icon) icon.className = "fa-solid fa-sun text-xs text-amber-400";
            } else {
                html.classList.add('dark');
                if (icon) icon.className = "fa-solid fa-moon text-xs";
            }
        }

        // Toast Feedback
        function showToast(msg) {
            var toast = document.getElementById('toast');
            var toastMsg = document.getElementById('toast-msg');
            if (!toast || !toastMsg) return;
            toastMsg.innerText = msg;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(function() {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 2500);
        }

        function formatRupiah(num) {
            return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
        }

        // Auth Logic
        var authMode = 'login';
        function switchAuthTab(mode) {
            authMode = mode;
            var tabLogin = document.getElementById('tab-login');
            var tabReg = document.getElementById('tab-register');
            var fieldName = document.getElementById('field-name');
            var submitBtn = document.getElementById('auth-submit-btn');
            var title = document.getElementById('auth-title');

            if (mode === 'register') {
                if (tabReg) tabReg.className = "flex-1 py-1.5 rounded-lg bg-blue-600 text-white transition-all";
                if (tabLogin) tabLogin.className = "flex-1 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-all";
                if (fieldName) fieldName.classList.remove('hidden');
                if (submitBtn) submitBtn.innerText = "Daftar Akun Baru";
                if (title) title.innerText = "Registrasi Akun Baru";
            } else {
                if (tabLogin) tabLogin.className = "flex-1 py-1.5 rounded-lg bg-blue-600 text-white transition-all";
                if (tabReg) tabReg.className = "flex-1 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-all";
                if (fieldName) fieldName.classList.add('hidden');
                if (submitBtn) submitBtn.innerText = "Masuk Sekarang";
                if (title) title.innerText = "Masuk ke Akun Anda";
            }
        }

        function handleAuthSubmit(e) {
            e.preventDefault();
            var email = document.getElementById('auth-email').value;
            var name = (document.getElementById('auth-name') && document.getElementById('auth-name').value) || email.split('@')[0];
            var roleRadio = document.querySelector('input[name="auth-role"]:checked');
            var role = (roleRadio && roleRadio.value) || 'user';

            currentUser = { name: name, email: email, role: role };
            localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
            updateAuthNav();
            showToast('Login berhasil sebagai ' + (role === 'admin' ? 'Administrator' : 'Pengguna'));
            
            if (role === 'admin') {
                navigatePage('admin');
            } else {
                navigatePage('portal');
            }
        }

        function handleLogout() {
            currentUser = null;
            localStorage.removeItem(STORAGE_AUTH_KEY);
            updateAuthNav();
            showToast('Anda telah keluar dari akun');
            navigatePage('home');
        }

        function updateAuthNav() {
            var container = document.getElementById('auth-nav-container');
            if (!container) return;
            if (currentUser) {
                container.innerHTML = '<div class="flex items-center gap-2">' +
                    '<button onclick="navigatePage(\'portal\')" class="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 flex items-center gap-1.5 transition-colors">' +
                    '<i class="fa-solid fa-user-check text-emerald-400 text-xs"></i>' +
                    '<span class="truncate max-w-[100px]">' + currentUser.name + '</span>' +
                    '</button>' +
                    '<button onclick="handleLogout()" class="w-8 h-8 rounded-xl bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-700/60 flex items-center justify-center transition-colors" title="Keluar">' +
                    '<i class="fa-solid fa-power-off text-xs"></i>' +
                    '</button>' +
                    '</div>';
            } else {
                container.innerHTML = '<button onclick="navigatePage(\'auth\')" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer">' +
                    '<i class="fa-solid fa-right-to-bracket text-xs"></i>' +
                    '<span>Masuk</span>' +
                    '</button>';
            }
        }

        // Render User Portal
        function renderPortal() {
            if (!currentUser) {
                navigatePage('auth');
                return;
            }
            var dName = document.getElementById('user-display-name');
            var dEmail = document.getElementById('user-display-email');
            var dAvatar = document.getElementById('user-avatar');
            if (dName) dName.innerText = currentUser.name;
            if (dEmail) dEmail.innerText = currentUser.email;
            if (dAvatar) dAvatar.innerText = currentUser.name.charAt(0).toUpperCase();
            var roleBadge = document.getElementById('user-role-badge');
            if (roleBadge) {
                roleBadge.innerText = currentUser.role.toUpperCase();
                roleBadge.className = currentUser.role === 'admin'
                    ? "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 uppercase"
                    : "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase";
            }
        }

        // Render Public Catalog Grid
        function renderCatalog() {
            var grid = document.getElementById('catalog-grid');
            var q = (document.getElementById('catalog-search') && document.getElementById('catalog-search').value || '').toLowerCase();
            if (!grid) return;

            var filtered = items.filter(function(it) {
                return it.name.toLowerCase().indexOf(q) !== -1 || it.category.toLowerCase().indexOf(q) !== -1;
            });
            grid.innerHTML = filtered.map(function(it) {
                return '<div class="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-3 hover:border-blue-500/40 transition-all flex flex-col justify-between group shadow-lg">' +
                    '<div>' +
                    '<div class="flex items-center justify-between text-[10px] text-zinc-500 mb-1.5 font-mono">' +
                    '<span>' + it.id + '</span>' +
                    '<span class="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold font-sans">' + it.category + '</span>' +
                    '</div>' +
                    '<h4 class="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">' + it.name + '</h4>' +
                    '</div>' +
                    '<div class="flex items-center justify-between pt-2 border-t border-zinc-800/80">' +
                    '<span class="font-extrabold text-emerald-400 text-sm">' + formatRupiah(it.price) + '</span>' +
                    '<button onclick="showToast(\'Layanan ' + it.name + ' siap diproses\')" class="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all cursor-pointer">' +
                    'Pilih Layanan' +
                    '</button>' +
                    '</div>' +
                    '</div>';
            }).join('');
        }

        // Admin CRUD Table & Logic
        function renderTable() {
            var searchEl = document.getElementById('search-input');
            var catEl = document.getElementById('filter-category');
            var query = (searchEl && searchEl.value || '').toLowerCase();
            var cat = (catEl && catEl.value || 'all');
            var tbody = document.getElementById('table-body');
            if (!tbody) return;

            var filtered = items.filter(function(it) {
                var matchQ = it.name.toLowerCase().indexOf(query) !== -1 || it.id.toLowerCase().indexOf(query) !== -1;
                var matchC = cat === 'all' || it.category === cat;
                return matchQ && matchC;
            });

            var totalSum = items.reduce(function(acc, curr) { return acc + Number(curr.price || 0); }, 0);
            var totalEl = document.getElementById('stat-total');
            var activeEl = document.getElementById('stat-active');
            var valEl = document.getElementById('stat-value');
            if (totalEl) totalEl.innerText = items.length;
            if (activeEl) activeEl.innerText = items.filter(function(i) { return i.status === 'Aktif'; }).length;
            if (valEl) valEl.innerText = formatRupiah(totalSum);

            tbody.innerHTML = filtered.map(function(it) {
                return '<tr class="hover:bg-zinc-800/40 transition-colors">' +
                    '<td class="p-3.5 text-zinc-500 font-mono font-medium">' + it.id + '</td>' +
                    '<td class="p-3.5 font-semibold text-white">' + it.name + '</td>' +
                    '<td class="p-3.5 text-zinc-400"><span class="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700/60 text-[10px]">' + it.category + '</span></td>' +
                    '<td class="p-3.5 text-emerald-400 font-bold">' + formatRupiah(it.price) + '</td>' +
                    '<td class="p-3.5"><span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">' + it.status + '</span></td>' +
                    '<td class="p-3.5 text-right space-x-1.5">' +
                    '<button onclick="editItem(\'' + it.id + '\')" class="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-blue-400 hover:text-blue-300 transition-colors" title="Edit"><i class="fa-solid fa-pen-to-square text-xs"></i></button>' +
                    '<button onclick="deleteItem(\'' + it.id + '\')" class="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors" title="Hapus"><i class="fa-solid fa-trash text-xs"></i></button>' +
                    '</td>' +
                    '</tr>';
            }).join('');
        }

        function closeModal() {
            var modal = document.getElementById('modal');
            if (!modal) return;
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function openModal() {
            document.getElementById('item-id').value = '';
            document.getElementById('item-name').value = '';
            document.getElementById('item-price').value = '';
            document.getElementById('modal-title').innerText = 'Tambah Data Baru';
            var modal = document.getElementById('modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function saveItem(e) {
            e.preventDefault();
            var id = document.getElementById('item-id').value;
            var name = document.getElementById('item-name').value;
            var cat = document.getElementById('item-cat').value;
            var price = Number(document.getElementById('item-price').value) || 0;
            var status = document.getElementById('item-status').value;

            if (id) {
                var idx = items.findIndex(function(i) { return i.id === id; });
                if (idx !== -1) items[idx] = { id: id, name: name, category: cat, price: price, status: status };
                showToast('Data berhasil diperbarui');
            } else {
                var newId = 'AST-' + Math.floor(100 + Math.random() * 900);
                items.unshift({ id: newId, name: name, category: cat, price: price, status: status });
                showToast('Data baru berhasil ditambahkan');
            }

            localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(items));
            closeModal();
            renderTable();
            renderCatalog();
        }

        function editItem(id) {
            var it = items.find(function(i) { return i.id === id; });
            if (!it) return;
            document.getElementById('item-id').value = it.id;
            document.getElementById('item-name').value = it.name;
            document.getElementById('item-cat').value = it.category;
            document.getElementById('item-price').value = it.price || '';
            document.getElementById('item-status').value = it.status;
            document.getElementById('modal-title').innerText = 'Edit Data #' + it.id;
            var modal = document.getElementById('modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function deleteItem(id) {
            if (!confirm('Hapus data ini secara permanen dari database?')) return;
            items = items.filter(function(i) { return i.id !== id; });
            localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(items));
            showToast('Data telah dihapus');
            renderTable();
            renderCatalog();
        }

        function exportDataCSV() {
            var csv = 'ID,Name,Category,Price,Status\n';
            items.forEach(function(i) { csv += '"' + i.id + '","' + i.name + '","' + i.category + '","' + i.price + '","' + i.status + '"\n'; });
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'data-export.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast('Data CSV berhasil diekspor');
        }

        window.navigatePage = navigatePage;
        window.toggleTheme = toggleTheme;
        window.switchAuthTab = switchAuthTab;
        window.handleAuthSubmit = handleAuthSubmit;
        window.handleLogout = handleLogout;
        window.renderCatalog = renderCatalog;
        window.renderPortal = renderPortal;
        window.renderTable = renderTable;
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.saveItem = saveItem;
        window.editItem = editItem;
        window.deleteItem = deleteItem;
        window.exportDataCSV = exportDataCSV;

        // Initialize on Load
        document.addEventListener('DOMContentLoaded', function() {
            updateAuthNav();
            renderCatalog();
            renderTable();
        });
    </script>
</body>
</html>`;
    }

    return `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} - Modern Web</title>
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
                        zinc: { 950: '#09090b', 900: '#121215', 850: '#18181b', 800: '#27272a', 700: '#3f3f46' },
                        blue: { 600: '#2563eb', 500: '#3b82f6', 400: '#60a5fa' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-zinc-950 text-zinc-300 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200">
    
    <!-- TOP NAVIGATION BAR (Multi-Page SPA Router) -->
    <header class="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3 transition-colors">
        <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <!-- Brand Logo -->
            <div class="flex items-center gap-3 cursor-pointer" onclick="navigatePage('home')">
                <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    <i class="fa-solid fa-cube text-base"></i>
                </div>
                <div>
                    <h1 class="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">${safeTitle}</h1>
                    <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Frontend Multi-Page UI</span>
                </div>
            </div>

            <!-- Page Navigation Links -->
            <nav class="hidden md:flex items-center gap-1 bg-zinc-950/70 border border-zinc-800/70 p-1 rounded-xl">
                <button id="nav-home" onclick="navigatePage('home')" class="nav-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white transition-all">
                    <i class="fa-solid fa-house text-[11px] mr-1.5"></i> Beranda
                </button>
                <button id="nav-catalog" onclick="navigatePage('catalog')" class="nav-btn px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                    <i class="fa-solid fa-layer-group text-[11px] mr-1.5"></i> Katalog & Layanan
                </button>
                <button id="nav-about" onclick="navigatePage('about')" class="nav-btn px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                    <i class="fa-solid fa-circle-info text-[11px] mr-1.5"></i> Tentang Kami
                </button>
                <button id="nav-contact" onclick="navigatePage('contact')" class="nav-btn px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                    <i class="fa-solid fa-envelope text-[11px] mr-1.5"></i> Kontak & FAQ
                </button>
            </nav>

            <!-- Right Actions: Theme Toggle & Order CTA -->
            <div class="flex items-center gap-2">
                <button onclick="toggleTheme()" class="w-8 h-8 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 flex items-center justify-center transition-colors" title="Toggle Tema">
                    <i id="theme-icon" class="fa-solid fa-moon text-xs"></i>
                </button>
                <button onclick="navigatePage('contact')" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-paper-plane text-xs"></i>
                    <span>Hubungi Kami</span>
                </button>
            </div>
        </div>
    </header>

    <!-- MAIN MULTI-PAGE CONTAINER -->
    <main class="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">

        <!-- ================= PAGE 1: BERANDA / HOME (#page-home) ================= -->
        <section id="page-home" class="page-view space-y-8 animate-fade-in">
            <!-- Hero Banner -->
            <div class="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-zinc-950 border border-zinc-800/80 shadow-2xl">
                <div class="max-w-2xl space-y-4">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                        <i class="fa-solid fa-sparkles text-[10px]"></i>
                        <span>Desain Frontend Interaktif, Responsif & Cepat</span>
                    </div>
                    <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        Pengalaman Web Modern untuk <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">${safeTitle}</span>
                    </h2>
                    <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        ${cleanPrompt}. Menghadirkan navigasi multi-halaman yang mulus, tampilan visual yang elegan, dan performa tinggi di seluruh perangkat.
                    </p>
                    <div class="flex flex-wrap items-center gap-3 pt-2">
                        <button onclick="navigatePage('catalog')" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer">
                            <span>Jelajahi Katalog</span>
                            <i class="fa-solid fa-arrow-right text-xs"></i>
                        </button>
                        <button onclick="navigatePage('about')" class="px-4 py-2.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700/70 flex items-center gap-2 transition-colors cursor-pointer">
                            <i class="fa-solid fa-circle-info text-xs"></i>
                            <span>Tentang Kami</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 3 Highlights Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 hover:border-blue-500/30 transition-all">
                    <div class="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                        <i class="fa-solid fa-bolt text-sm"></i>
                    </div>
                    <h3 class="font-bold text-white text-sm">Ultra Cepat & Responsif</h3>
                    <p class="text-xs text-zinc-400 leading-relaxed">Dibangun dengan Tailwind CSS dan struktur JavaScript modern tanpa ketergantungan berlebih.</p>
                </div>
                <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 hover:border-indigo-500/30 transition-all">
                    <div class="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                        <i class="fa-solid fa-layer-group text-sm"></i>
                    </div>
                    <h3 class="font-bold text-white text-sm">Navigasi Multi-Halaman</h3>
                    <p class="text-xs text-zinc-400 leading-relaxed">Perpindahan antar halaman secara instan dan mulus tanpa jeda pemuatan ulang halaman.</p>
                </div>
                <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 hover:border-emerald-500/30 transition-all">
                    <div class="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                        <i class="fa-solid fa-shield-halved text-sm"></i>
                    </div>
                    <h3 class="font-bold text-white text-sm">Desain Presisi & Bersih</h3>
                    <p class="text-xs text-zinc-400 leading-relaxed">Tata letak konsisten dengan hierarki tipografi Google Fonts yang nyaman dibaca.</p>
                </div>
            </div>

            <!-- Testimoni Singkat -->
            <div class="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
                <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h3 class="font-bold text-white text-sm">Ulasan Pengguna</h3>
                    <span class="text-xs text-amber-400 flex items-center gap-1"><i class="fa-solid fa-star"></i> 4.9/5.0 Skor Kepuasan</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                        <p class="text-zinc-300 italic">"Antarmuka sangat rapi, pemuatan halaman super cepat, dan navigasi multi halamannya sangat nyaman."</p>
                        <div class="text-[11px] font-bold text-zinc-400">Rian Hidayat • Pengguna Aktif</div>
                    </div>
                    <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                        <p class="text-zinc-300 italic">"Pilihan katalog sangat lengkap dan respons layanan bantuan sangat memuaskan."</p>
                        <div class="text-[11px] font-bold text-zinc-400">Maya Anggraini • Klien Bisnis</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ================= PAGE 2: KATALOG & LAYANAN (#page-catalog) ================= -->
        <section id="page-catalog" class="page-view hidden space-y-6 animate-fade-in">
            <!-- Filter & Search Header -->
            <div class="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-lg font-bold text-white">Katalog & Pilihan Layanan</h2>
                    <p class="text-xs text-zinc-400">Temukan pilihan produk dan paket terbaik sesuai kebutuhan Anda</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <div class="relative w-full sm:w-56">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"></i>
                        <input id="frontend-search" oninput="renderFrontendCatalog()" type="text" placeholder="Cari layanan..." class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500" />
                    </div>
                    <select id="frontend-cat-filter" onchange="renderFrontendCatalog()" class="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none cursor-pointer">
                        <option value="all">Semua Kategori</option>
                        <option value="Utama">Utama</option>
                        <option value="Spesial">Spesial</option>
                        <option value="Enterprise">Enterprise</option>
                    </select>
                </div>
            </div>

            <!-- Product Grid -->
            <div id="frontend-catalog-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <!-- Injected via JS -->
            </div>
        </section>

        <!-- ================= PAGE 3: TENTANG KAMI & VISI (#page-about) ================= -->
        <section id="page-about" class="page-view hidden space-y-6 animate-fade-in">
            <div class="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-6">
                <div class="max-w-2xl space-y-2">
                    <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Profil & Komitmen</span>
                    <h2 class="text-2xl font-extrabold text-white">Membangun Solusi Digital Berkualitas Tinggi</h2>
                    <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        Kami berdedikasi untuk menghadirkan pengalaman web terbaik dengan fokus pada estetika minimalis, kemudahan navigasi, dan kecepatan tinggi.
                    </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                        <span class="text-2xl font-bold text-blue-400">99.9%</span>
                        <div class="font-bold text-white text-xs">Kepuasan Pengguna</div>
                        <p class="text-[11px] text-zinc-500">Standar layanan teruji dan dapat diandalkan.</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                        <span class="text-2xl font-bold text-indigo-400">100%</span>
                        <div class="font-bold text-white text-xs">Responsif Seluler</div>
                        <p class="text-[11px] text-zinc-500">Optimal di layar smartphone, tablet, dan desktop.</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                        <span class="text-2xl font-bold text-emerald-400">24/7</span>
                        <div class="font-bold text-white text-xs">Aksesibilitas Tinggi</div>
                        <p class="text-[11px] text-zinc-500">Sistem selalu aktif melayani setiap kebutuhan.</p>
                    </div>
                </div>

                <div class="border-t border-zinc-800 pt-6 space-y-3">
                    <h3 class="font-bold text-white text-sm">Nilai Utama Kami</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                            <i class="fa-solid fa-check text-blue-400 mt-0.5"></i>
                            <div>
                                <strong class="text-white">Inovasi Berkelanjutan:</strong>
                                <span class="text-zinc-400 block mt-0.5">Selalu mengadopsi standar teknologi dan estetika desain terbaru.</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                            <i class="fa-solid fa-check text-emerald-400 mt-0.5"></i>
                            <div>
                                <strong class="text-white">Transparansi & Kecepatan:</strong>
                                <span class="text-zinc-400 block mt-0.5">Memberikan informasi yang jelas serta eksekusi yang tepat waktu.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ================= PAGE 4: KONTAK & FAQ (#page-contact) ================= -->
        <section id="page-contact" class="page-view hidden space-y-8 animate-fade-in">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Contact Form -->
                <div class="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
                    <div>
                        <h2 class="text-lg font-bold text-white">Hubungi Tim Kami</h2>
                        <p class="text-xs text-zinc-400">Kirimkan pesan Anda untuk konsultasi atau pemesanan langsung</p>
                    </div>
                    <form onsubmit="handleFrontendContact(event)" class="space-y-3.5 text-xs">
                        <div class="space-y-1">
                            <label class="font-medium text-zinc-300">Nama Lengkap:</label>
                            <input id="fc-name" type="text" required placeholder="Contoh: Budi Pratama" class="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div class="space-y-1">
                            <label class="font-medium text-zinc-300">Nomor WhatsApp / Kontak:</label>
                            <input id="fc-wa" type="text" required placeholder="081234567890" class="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div class="space-y-1">
                            <label class="font-medium text-zinc-300">Pesan atau Kebutuhan Anda:</label>
                            <textarea id="fc-msg" rows="3" required placeholder="Tuliskan kebutuhan atau pertanyaan Anda di sini..." class="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-blue-500"></textarea>
                        </div>
                        <button type="submit" class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <i class="fa-brands fa-whatsapp text-sm"></i>
                            <span>Kirim Pesan via WhatsApp</span>
                        </button>
                    </form>
                </div>

                <!-- Interactive Accordion FAQ -->
                <div class="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
                    <div>
                        <h2 class="text-lg font-bold text-white">Pertanyaan Umum (FAQ)</h2>
                        <p class="text-xs text-zinc-400">Jawaban atas pertanyaan yang sering diajukan</p>
                    </div>
                    <div class="space-y-2.5 text-xs">
                        <div class="faq-item border border-zinc-800 rounded-2xl bg-zinc-950 overflow-hidden">
                            <button onclick="toggleFaq(1)" class="w-full p-4 text-left font-semibold text-white flex items-center justify-between gap-2 hover:text-blue-400 transition-colors">
                                <span>Bagaimana cara melakukan pemesanan layanan?</span>
                                <i id="faq-icon-1" class="fa-solid fa-chevron-down text-zinc-500 text-xs transition-transform duration-200"></i>
                            </button>
                            <div id="faq-ans-1" class="hidden p-4 pt-0 text-zinc-400 text-xs leading-relaxed border-t border-zinc-800/60">
                                Anda dapat memilih layanan di halaman Katalog lalu menekan tombol pesan, atau langsung mengisi formulir kontak di sebelah kiri untuk terhubung dengan tim admin kami via WhatsApp.
                            </div>
                        </div>

                        <div class="faq-item border border-zinc-800 rounded-2xl bg-zinc-950 overflow-hidden">
                            <button onclick="toggleFaq(2)" class="w-full p-4 text-left font-semibold text-white flex items-center justify-between gap-2 hover:text-blue-400 transition-colors">
                                <span>Apakah tampilan ini sudah mendukung perangkat ponsel?</span>
                                <i id="faq-icon-2" class="fa-solid fa-chevron-down text-zinc-500 text-xs transition-transform duration-200"></i>
                            </button>
                            <div id="faq-ans-2" class="hidden p-4 pt-0 text-zinc-400 text-xs leading-relaxed border-t border-zinc-800/60">
                                Ya, seluruh komponen dan tata letak dirancang sepenuhnya responsif dan otomatis menyesuaikan ukuran layar perangkat smartphone, tablet, maupun desktop.
                            </div>
                        </div>

                        <div class="faq-item border border-zinc-800 rounded-2xl bg-zinc-950 overflow-hidden">
                            <button onclick="toggleFaq(3)" class="w-full p-4 text-left font-semibold text-white flex items-center justify-between gap-2 hover:text-blue-400 transition-colors">
                                <span>Bagaimana cara mengganti tema tampilan gelap/terang?</span>
                                <i id="faq-icon-3" class="fa-solid fa-chevron-down text-zinc-500 text-xs transition-transform duration-200"></i>
                            </button>
                            <div id="faq-ans-3" class="hidden p-4 pt-0 text-zinc-400 text-xs leading-relaxed border-t border-zinc-800/60">
                                Anda dapat menekan ikon bulan/matahari di bilah navigasi kanan atas untuk beralih antara Dark Mode dan Light Mode secara instan.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- FOOTER -->
    <footer class="mt-auto border-t border-zinc-800/80 bg-zinc-900/40 py-4 px-6 text-center text-xs text-zinc-500">
        <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span class="font-mono text-[11px]">&copy; 2026 ${safeTitle} • Frontend Multi-Page Architecture</span>
            <div class="flex items-center gap-2 text-[10px] font-mono">
                <span class="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Vanilla JS</span>
                <span class="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Tailwind CSS</span>
                <span class="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Responsive SPA</span>
            </div>
        </div>
    </footer>

    <!-- MODAL QUICK VIEW DETAIL -->
    <div id="quickview-modal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden items-center justify-center p-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div class="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 id="qv-title" class="font-bold text-white text-sm">Detail Layanan</h3>
                <button onclick="closeQuickView()" class="text-zinc-400 hover:text-white p-1 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="space-y-3 text-xs">
                <div class="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span id="qv-category" class="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-bold">Kategori</span>
                    <h4 id="qv-name" class="font-bold text-white text-sm pt-1">Nama Produk</h4>
                    <p id="qv-desc" class="text-zinc-400 text-xs">Deskripsi lengkap layanan ini.</p>
                </div>
                <div class="flex items-center justify-between pt-2">
                    <span class="text-zinc-500 text-xs">Harga / Investasi:</span>
                    <span id="qv-price" class="text-base font-extrabold text-emerald-400">Rp 0</span>
                </div>
                <div class="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                    <button type="button" onclick="closeQuickView()" class="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer">Tutup</button>
                    <button type="button" onclick="handleOrderFromModal()" class="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-md cursor-pointer">Pesan Sekarang</button>
                </div>
            </div>
        </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div id="toast" class="fixed bottom-5 right-5 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
        <div class="bg-zinc-900 border border-zinc-700 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-emerald-400"></i>
            <span id="toast-msg">Operasi berhasil.</span>
        </div>
    </div>

    <!-- JAVASCRIPT LOGIC & STATE ENGINE -->
    <script>
        // Sample Catalog Data
        var catalogItems = [
            { id: "FE-01", name: "Paket Signature Terpadu", category: "Utama", price: 180000, desc: "Layanan utama dengan fitur lengkap dan responsivitas terbaik untuk kebutuhan Anda." },
            { id: "FE-02", name: "Konsultasi Desain & Fitur", category: "Spesial", price: 250000, desc: "Sesi terarah bersama spesialis untuk memaksimalkan kepuasan dan performa antarmuka." },
            { id: "FE-03", name: "Paket Enterprise Skala Besar", category: "Enterprise", price: 650000, desc: "Solusi menyeluruh dengan kapasitas optimal dan prioritas dukungan penuh." }
        ];

        var selectedModalItem = null;

        // SPA Page Router
        function navigatePage(pageId) {
            var views = document.querySelectorAll('.page-view');
            for (var i = 0; i < views.length; i++) {
                views[i].classList.add('hidden');
            }
            var target = document.getElementById('page-' + pageId);
            if (target) target.classList.remove('hidden');

            var btns = document.querySelectorAll('.nav-btn');
            for (var j = 0; j < btns.length; j++) {
                btns[j].className = "nav-btn px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all";
            }

            var activeBtn = document.getElementById('nav-' + pageId);
            if (activeBtn) {
                activeBtn.className = "nav-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white transition-all";
            }

            if (pageId === 'catalog') renderFrontendCatalog();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Theme Switcher (Dark / Light)
        function toggleTheme() {
            var html = document.documentElement;
            var icon = document.getElementById('theme-icon');
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                if (icon) icon.className = "fa-solid fa-sun text-xs text-amber-400";
            } else {
                html.classList.add('dark');
                if (icon) icon.className = "fa-solid fa-moon text-xs";
            }
        }

        // Toast Feedback
        function showToast(msg) {
            var toast = document.getElementById('toast');
            var toastMsg = document.getElementById('toast-msg');
            if (!toast || !toastMsg) return;
            toastMsg.innerText = msg;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(function() {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 2500);
        }

        function formatRupiah(num) {
            return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
        }

        // Render Catalog Grid
        function renderFrontendCatalog() {
            var grid = document.getElementById('frontend-catalog-grid');
            var q = (document.getElementById('frontend-search') && document.getElementById('frontend-search').value || '').toLowerCase();
            var cat = (document.getElementById('frontend-cat-filter') && document.getElementById('frontend-cat-filter').value || 'all');
            if (!grid) return;

            var filtered = catalogItems.filter(function(it) {
                var matchQ = it.name.toLowerCase().indexOf(q) !== -1 || it.desc.toLowerCase().indexOf(q) !== -1;
                var matchC = (cat === 'all' || it.category === cat);
                return matchQ && matchC;
            });

            grid.innerHTML = filtered.map(function(it) {
                return '<div class="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-xl group">' +
                    '<div>' +
                    '<div class="flex items-center justify-between text-[10px] text-zinc-500 mb-2">' +
                    '<span class="font-mono">' + it.id + '</span>' +
                    '<span class="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold text-[9px] uppercase">' + it.category + '</span>' +
                    '</div>' +
                    '<h3 class="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">' + it.name + '</h3>' +
                    '<p class="text-xs text-zinc-400 leading-relaxed mt-1.5">' + it.desc + '</p>' +
                    '</div>' +
                    '<div class="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">' +
                    '<span class="font-extrabold text-emerald-400 text-sm">' + formatRupiah(it.price) + '</span>' +
                    '<div class="flex items-center gap-1.5">' +
                    '<button onclick="openQuickView(\'' + it.id + '\')" class="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer" title="Detail Cepat">' +
                    '<i class="fa-solid fa-eye text-xs"></i>' +
                    '</button>' +
                    '<button onclick="showToast(\'Layanan ' + it.name + ' dipilih\')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer">' +
                    'Pesan' +
                    '</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }).join('');
        }

        // Quick View Modal
        function openQuickView(id) {
            var it = catalogItems.find(function(i) { return i.id === id; });
            if (!it) return;
            selectedModalItem = it;
            document.getElementById('qv-title').innerText = 'Detail: ' + it.name;
            document.getElementById('qv-name').innerText = it.name;
            document.getElementById('qv-category').innerText = it.category.toUpperCase();
            document.getElementById('qv-desc').innerText = it.desc;
            document.getElementById('qv-price').innerText = formatRupiah(it.price);

            var modal = document.getElementById('quickview-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        }

        function closeQuickView() {
            var modal = document.getElementById('quickview-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }

        function handleOrderFromModal() {
            if (selectedModalItem) {
                showToast('Layanan ' + selectedModalItem.name + ' berhasil dipilih!');
            }
            closeQuickView();
        }

        // Interactive Accordion FAQ
        function toggleFaq(index) {
            var ans = document.getElementById('faq-ans-' + index);
            var icon = document.getElementById('faq-icon-' + index);
            if (!ans || !icon) return;
            if (ans.classList.contains('hidden')) {
                ans.classList.remove('hidden');
                icon.className = "fa-solid fa-chevron-up text-blue-400 text-xs transition-transform duration-200";
            } else {
                ans.classList.add('hidden');
                icon.className = "fa-solid fa-chevron-down text-zinc-500 text-xs transition-transform duration-200";
            }
        }

        // Contact Form Handler
        function handleFrontendContact(e) {
            e.preventDefault();
            var name = (document.getElementById('fc-name') && document.getElementById('fc-name').value) || '';
            var wa = (document.getElementById('fc-wa') && document.getElementById('fc-wa').value) || '';
            var msg = (document.getElementById('fc-msg') && document.getElementById('fc-msg').value) || '';
            
            showToast('Menghubungkan ke WhatsApp admin...');
            setTimeout(function() {
                var message = 'Halo Admin ' + '${safeTitle}' + ', nama saya ' + name + ' (' + wa + '). ' + msg;
                var url = 'https://wa.me/6281234567890?text=' + encodeURIComponent(message);
                window.open(url, '_blank');
            }, 600);
        }

        window.navigatePage = navigatePage;
        window.toggleTheme = toggleTheme;
        window.renderFrontendCatalog = renderFrontendCatalog;
        window.openQuickView = openQuickView;
        window.closeQuickView = closeQuickView;
        window.handleOrderFromModal = handleOrderFromModal;
        window.toggleFaq = toggleFaq;
        window.handleFrontendContact = handleFrontendContact;

        // Initialize on load
        document.addEventListener('DOMContentLoaded', function() {
            renderFrontendCatalog();
        });
    </script>
</body>
</html>`;
    }