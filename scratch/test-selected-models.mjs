import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
let apiKey = '';
for (const line of envContent.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}

const models = [
  'gemini-3.7-flash',
  'gemini-3.1-pro-preview'
];

async function test() {
  for (const m of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say "Model OK: ' + m + '"' }] }]
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[SUCCESS] ${m}:`, data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
      } else {
        console.log(`[FAIL] ${m}:`, data.error?.message || data);
      }
    } catch (e) {
      console.log(`[ERROR] ${m}:`, e.message);
    }
  }
}

test();
