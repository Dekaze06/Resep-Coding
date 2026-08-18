import fs from 'fs';

// Read .env
const envFile = fs.readFileSync('.env', 'utf-8');
let apiKey = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}

console.log('API Key:', apiKey ? apiKey.slice(0, 8) + '...' : 'MISSING');

const models = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-3.7-flash'
];

async function run() {
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello, respond with 1 word' }] }]
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[SUCCESS] ${model} (HTTP ${res.status}):`, data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
      } else {
        console.log(`[FAILED]  ${model} (HTTP ${res.status}):`, data.error?.message || JSON.stringify(data));
      }
    } catch (err) {
      console.log(`[ERROR]   ${model}:`, err.message);
    }
  }
}

run();
