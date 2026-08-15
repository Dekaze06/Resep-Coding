const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const keyMatch = env.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
const key = keyMatch ? keyMatch[1].trim() : '';

async function testGeneration() {
    try {
        const model = 'gemini-3.7-flash';
        console.log(`Testing generation with model: ${model}...`);
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': key,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: 'Halo, perkenalkan dirimu sebagai Gemini 3.7 Flash AI Agent!' }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 200,
                    }
                })
            }
        );

        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response:');
        console.log(data?.candidates?.[0]?.content?.parts?.[0]?.text || data);
    } catch (err) {
        console.error('Error:', err);
    }
}
testGeneration();
