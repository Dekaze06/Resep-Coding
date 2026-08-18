import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let apiKey = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}

const prompt = `Nama: Kopi Senja Nusantara
Jenis: Kafe, Restoran & Kuliner
Tema: Dark Minimalist & Sleek
Fitur: Menu kopi & makanan interaktif, keranjang belanja, panel admin CRUD lengkap dengan tambah edit hapus menu, rekap keuangan harian & bulanan, laporan kas dan integrasi WhatsApp checkout.`;

const systemPrompt = `Anda adalah AI Lead Architect & Senior Engineer di SATUSITE STUDIO — Platform Pembuatan Aplikasi Otonom kelas dunia.
Mode: FULLSTACK APPLICATION ARCHITECTURE (END-TO-END CRUD & STORAGE)
ATURAN MUTLAK:
1. DILARANG KERAS MENGGUNAKAN EMOJI / EMOTICON APAPUN.
2. Desain Clean Minimalis, rapi, profesional, modern dengan Tailwind CSS dan Font Awesome 6.
3. KODE 100% LENGKAP MANDIRI (Single HTML file) siap pakai, tidak ada placeholder "TODO" atau fungsi kosong.
4. Buat navigasi multi-view (Katalog Pelanggan, Keranjang, Panel Admin Manajemen Menu CRUD, Rekap Kas Keuangan).
5. Data tersimpan otomatis di localStorage.`;

async function testGen() {
  console.log('Generating with gemini-3.6-flash...');
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`, {
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
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Success! Output length:', text.length, 'characters.');
    fs.writeFileSync('scratch/real_gemini_output.html', text);
    console.log('Saved to scratch/real_gemini_output.html');
  } else {
    console.error('Failed:', data);
  }
}

testGen();
