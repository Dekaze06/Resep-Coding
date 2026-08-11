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

        // Membaca API Key dari Environment Variable (Server-side)
        const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({
                error: 'GEMINI_API_KEY belum dikonfigurasi di server (.env).'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const aiAgentInstructions = `
Instruksi Tambahan AI Agent untuk Integrasi & Arsitektur Komponen:
- Pastikan proyek mendukung struktur shadcn, Tailwind CSS, dan TypeScript. Jika belum, berikan panduan setup via shadcn CLI, Tailwind, atau TypeScript.
- Jalur default komponen adalah /components/ui (jelaskan pentingnya folder ini jika belum ada).
- Sertakan acuan komponen berikut pada /components/ui/edit-tool.tsx dan demo.tsx bila relevan untuk pelacak proses/editing:
  - Dependency: clsx, tailwind-merge
  - Pedoman Implementasi: Analisis dependensi, props/state, responsive design, serta penempatan komponen terbaik dalam aplikasi.
`;

        let prompt = '';
        if (body.type === 'manual') {
            prompt = `Bertindaklah sebagai Senior Product Manager & Lead Architect. Buatkan Product Requirements Document (PRD) yang profesional dan terstruktur dengan rapi dalam format Markdown berdasarkan deskripsi aplikasi berikut:

Deskripsi Aplikasi:
${body.desc}

${aiAgentInstructions}

Pastikan PRD mencakup bagian-bagian standar berikut:
1. Ringkasan Eksekutif (Visi & Tujuan)
2. Target Pengguna
3. Fitur Utama (Minimum Viable Product)
4. Kebutuhan Non-Fungsional & Arsitektur Komponen (shadcn UI, Tailwind, TypeScript)
5. Rencana Pengembangan (Roadmap)`;
        } else if (body.type === 'cloning') {
            prompt = `Bertindaklah sebagai Senior Product Manager & Lead Architect. Buatkan Product Requirements Document (PRD) yang profesional dalam format Markdown untuk membuat versi *clone* atau aplikasi serupa dari website referensi berikut.

URL Referensi: ${body.url}
Deskripsi Khusus / Fitur Tambahan: ${body.desc}

${aiAgentInstructions}

Pastikan PRD mencakup:
1. Ringkasan Eksekutif & Tujuan Utama
2. Target Pengguna
3. Analisis Fungsionalitas dari Referensi Utama
4. Fitur Utama yang akan dibuat (Termasuk fitur tambahan yang direquest)
5. Kebutuhan Spesifikasi Teknis & Arsitektur Komponen (shadcn UI, Tailwind, TypeScript)`;
        } else {
            return new Response(JSON.stringify({ error: 'Tipe request tidak valid.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Call Gemini REST API directly (compatible with X-goog-api-key)
        const geminiResponse = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
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
                                { text: prompt }
                            ]
                        }
                    ]
                })
            }
        );

        if (!geminiResponse.ok) {
            const errData = await geminiResponse.text();
            console.error('Gemini API Error:', geminiResponse.status, errData);
            return new Response(JSON.stringify({
                error: `Gemini API Error (${geminiResponse.status}): ${errData}`
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const geminiData = await geminiResponse.json();
        const markdown = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!markdown) {
            return new Response(JSON.stringify({
                error: 'AI tidak mengembalikan teks. Coba lagi.'
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
        console.error("Error generating PRD via Gemini:", e);
        return new Response(JSON.stringify({
            error: 'Terjadi kesalahan pada server AI: ' + (e.message || e)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
