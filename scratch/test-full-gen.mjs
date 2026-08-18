import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let apiKey = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}

const prompt = `Buatkan website toko online kopi nusantara lengkap dengan katalog produk, filter kategori, keranjang belanja, panel admin CRUD dan rekap penjualan.`;

const systemPrompt = `Anda adalah AI Lead Architect & Senior Engineer di SATUSITE STUDIO — Platform Pembuatan Aplikasi Otonom kelas dunia.
PEDOMAN KODE & ESTETIKA UMUM (STRICT & WAJIB):
1. DILARANG KERAS MENGGUNAKAN EMOJI / EMOTICON APAPUN (ATURAN MUTLAK).
2. ESTETIKA CLEAN MINIMALIS, rapi, elegan, dan profesional.
3. KODE HARUS 100% MANDIRI & PRODUCTION-READY (Self-contained HTML5 file lengkap dengan Tailwind CSS v3 CDN, Font Awesome 6 CDN, dan Vanilla JS).
4. Sediakan fitur interaktif lengkap, CRUD nyata dengan localStorage, filter kategori, modal interaktif, dan notifikasi toast.`;

async function test() {
  console.log('Sending request to gemini-3.7-flash...');
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192
      }
    })
  });

  const data = await res.json();
  if (res.ok) {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Response length:', text?.length);
    console.log('First 300 chars:\n', text?.slice(0, 300));
    console.log('Last 200 chars:\n', text?.slice(-200));
    fs.writeFileSync('scratch/generated_sample.html', text || '');
  } else {
    console.error('API Error:', JSON.stringify(data));
  }
}

test();
