const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const keyMatch = env.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
const apiKey = keyMatch ? keyMatch[1].trim() : '';

const candidateModels = [
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest'
];

async function generateWithFallback() {
    const prompt = 'Buatkan Dokumen Blueprint Singkat untuk Website Toko Kopi Modern';
    let data = null;
    let usedModel = '';

    for (const model of candidateModels) {
        console.log(`Trying model: ${model}...`);
        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': apiKey,
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1000
                        }
                    })
                }
            );

            if (res.ok) {
                data = await res.json();
                usedModel = model;
                console.log(`Success with model: ${model}!`);
                break;
            } else {
                const errText = await res.text();
                console.warn(`Model ${model} returned ${res.status}:`, errText.slice(0, 120));
            }
        } catch (e) {
            console.error(`Error on ${model}:`, e.message);
        }
    }

    if (data) {
        console.log(`Result from ${usedModel}:`, data.candidates?.[0]?.content?.parts?.[0]?.text?.slice(0, 200));
    } else {
        console.error('All models failed.');
    }
}

generateWithFallback();
