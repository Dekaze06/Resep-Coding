import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let apiKey = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}

const list = [
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-3.1-flash-lite',
  'gemini-3.1-pro-preview'
];

async function testAll() {
  for (const m of list) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say "OK ' + m + '"' }] }]
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[WORKING 200] ${m.padEnd(25)} -> Output:`, data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
      } else {
        console.log(`[FAILED ${res.status}]  ${m.padEnd(25)} -> Message:`, data.error?.message?.slice(0, 120));
      }
    } catch (err) {
      console.log(`[ERR] ${m}:`, err.message);
    }
  }
}

testAll();
