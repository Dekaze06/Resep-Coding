import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let apiKey = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}

const prompt = `Nama: Kopi Nusantara
Jenis: Kafe, Restoran & Kuliner
Tema: Dark Minimalist & Sleek
Fitur: Menu kopi interaktif, keranjang belanja, panel admin CRUD, rekap laba kas keuangan harian.`;

const systemPrompt = `Anda adalah AI Lead Architect di SATUSITE STUDIO.
DILARANG KERAS MENGGUNAKAN EMOJI. Gunakan Font Awesome 6 CDN dan Tailwind CSS v3.
Buat Single HTML file mandiri lengkap siap pakai dengan navigasi tab dan CRUD nyata.`;

const candidateModels = [
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite'
];

async function generate() {
  let output = null;
  let usedModel = null;

  for (const model of candidateModels) {
    console.log(`Trying model: ${model}...`);
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
          })
        });

        if (res.ok) {
          const data = await res.json();
          output = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (output && output.length > 500) {
            usedModel = model;
            console.log(`[SUCCESS] Generated ${output.length} chars using model: ${model}`);
            break;
          }
        } else {
          const errText = await res.text();
          console.warn(`[FAILED ${res.status}] ${model} (attempt ${attempt}): ${errText.slice(0, 100)}`);
          if (attempt === 1) await new Promise(r => setTimeout(r, 1000));
        }
      } catch (err) {
        console.warn(`[ERROR] ${model} attempt ${attempt}:`, err.message);
      }
    }
    if (output) break;
  }

  if (output) {
    fs.writeFileSync('scratch/generated_live.html', output);
    console.log(`Successfully generated and saved with model: ${usedModel}!`);
  } else {
    console.log('All models failed.');
  }
}

generate();
