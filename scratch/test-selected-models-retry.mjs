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

async function callWithRetry(model, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Calling ${model} (attempt ${attempt}/${maxRetries})...`);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say "Hello, ready"' }] }]
        })
      });
      const data = await res.json();
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`[SUCCESS] ${model}:`, data.candidates[0].content.parts[0].text.trim());
        return data;
      } else {
        console.log(`[RETRY] ${model} status ${res.status}:`, data.error?.message?.slice(0, 120));
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 2000 * attempt));
        }
      }
    } catch (e) {
      console.log(`[ERR] ${model}:`, e.message);
    }
  }
  return null;
}

async function testAll() {
  for (const m of models) {
    await callWithRetry(m);
  }
}

testAll();
