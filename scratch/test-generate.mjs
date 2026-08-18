import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
let apiKey = '';

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('GEMINI_API_KEY=')) {
    apiKey = trimmed.substring('GEMINI_API_KEY='.length).trim();
  }
}

async function testApi() {
  const res = await fetch('http://localhost:4321/api/generate-canvas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'buat web toko kopi secara lengkap admin client dan katalog serta keuangan buat desain yang bagus',
      mode: 'fullstack',
      projectName: 'Kopi Nusantara'
    })
  });

  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Success:', data.success);
  console.log('Message:', data.message);
  console.log('Code length:', data.code ? data.code.length : 0);
  console.log('Has emojis in message?:', /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(data.message));
  console.log('Has emojis in code?:', /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(data.code || ''));
  console.log('Quota Remaining:', data.quotaRemaining);
}

testApi().catch(console.error);
