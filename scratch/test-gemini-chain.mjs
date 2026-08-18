import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let apiKey = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}

const candidateModels = [
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-pro-latest'
];

async function testChain() {
  for (const m of candidateModels) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say "Antigravity ready"' }] }]
        })
      });
      const data = await res.json();
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`[SUCCESS] Model ${m} replied:`, data.candidates[0].content.parts[0].text.trim());
        return;
      } else {
        console.log(`[FAIL] Model ${m} (${res.status}):`, data.error?.message || 'Unknown');
      }
    } catch (e) {
      console.log(`[ERR] Model ${m}:`, e.message);
    }
  }
}

testChain();
