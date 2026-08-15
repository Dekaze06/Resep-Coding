const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const keyMatch = env.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
const apiKey = keyMatch ? keyMatch[1].trim() : '';

async function testPrd() {
    const prompt = `Buatkan Dokumen Planning Blueprint Website singkat untuk Toko Kopi Modern.`;
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey,
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                }
            })
        }
    );

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Full response:', JSON.stringify(data, null, 2));
}

testPrd();
