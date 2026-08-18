import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let apiKey = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}

const prompt = `Nama: Kopi Nusantara. Buatkan single HTML file toko online dengan Tailwind CSS dan menu interaktif.`;

const modelsToTest = [
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite'
];

async function run() {
  for (const m of modelsToTest) {
    console.log('Testing', m, '...');
    try {
      const start = Date.now();
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 8192 }
        })
      });
      const duration = ((Date.now() - start)/1000).toFixed(1);
      const data = await res.json();
      if (res.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(`[SUCCESS] ${m} responded in ${duration}s! Length: ${text?.length}`);
      } else {
        console.log(`[FAIL] ${m} failed in ${duration}s: ${data.error?.message?.slice(0, 100)}`);
      }
    } catch (e) {
      console.log(`[ERR] ${m}: ${e.message}`);
    }
  }
}

run();
