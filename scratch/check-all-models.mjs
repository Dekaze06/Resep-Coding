import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let apiKey = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}

const candidateList = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-3.7-flash',
  'gemini-3.1-pro-preview'
];

async function checkAll() {
  console.log('Testing models with API Key...\n');
  for (const model of candidateList) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Write a short 1-line HTML snippet: <button>Click</button>' }] }]
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[ONLINE] ${model.padEnd(25)} -> Status: 200 OK`);
      } else {
        console.log(`[OFFLINE/LIMIT] ${model.padEnd(25)} -> Error ${res.status}: ${data.error?.message?.slice(0, 100)}`);
      }
    } catch (e) {
      console.log(`[ERROR] ${model.padEnd(25)} -> ${e.message}`);
    }
  }
}

checkAll();
