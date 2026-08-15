const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const keyMatch = env.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
const apiKey = keyMatch ? keyMatch[1].trim() : '';

const candidateModels = [
    'gemini-3.7-flash',
    'gemini-3.6-flash'
];

async function testCanvasGeneration() {
    console.log('--- Testing Canvas Generator Endpoint Logic ---');
    const prompt = 'Buatkan tombol counter interaktif modern dengan Glassmorphism Tailwind';
    const systemPrompt = `Anda adalah Senior Lead Frontend Engineer. Buatkan HTML5 lengkap mandiri di dalam blok \`\`\`html ... \`\`\``;
    
    let geminiResponse = null;
    let usedModel = '';

    for (const model of candidateModels) {
        try {
            console.log(`Calling ${model}...`);
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': apiKey,
                    },
                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [{ text: systemPrompt }]
                        },
                        contents: [
                            { role: 'user', parts: [{ text: prompt }] }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 8192,
                        }
                    })
                }
            );

            if (res.ok) {
                geminiResponse = await res.json();
                usedModel = model;
                console.log(`Success with ${model}!`);
                break;
            } else {
                const errText = await res.text();
                console.warn(`Model ${model} returned ${res.status}:`, errText.slice(0, 150));
            }
        } catch (err) {
            console.warn(`Failed ${model}:`, err.message);
        }
    }

    if (geminiResponse) {
        const reply = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log(`Output from ${usedModel} (${reply.length} chars):`);
        console.log(reply.slice(0, 300) + '...\n');
    } else {
        console.error('Canvas generation failed on all models.');
    }
}

async function testPrdGeneration() {
    console.log('--- Testing PRD Blueprint Generator Endpoint Logic ---');
    const prompt = 'Buatkan Dokumen Planning Blueprint Website Toko Baju Distro Minimalis';
    let geminiData = null;
    let usedModel = '';

    for (const model of candidateModels) {
        try {
            console.log(`Calling ${model}...`);
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': apiKey,
                    },
                    body: JSON.stringify({
                        contents: [
                            { parts: [{ text: prompt }] }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 8192,
                        }
                    })
                }
            );

            if (res.ok) {
                geminiData = await res.json();
                usedModel = model;
                console.log(`Success with ${model}!`);
                break;
            } else {
                const errText = await res.text();
                console.warn(`Model ${model} returned ${res.status}:`, errText.slice(0, 150));
            }
        } catch (err) {
            console.warn(`Failed ${model}:`, err.message);
        }
    }

    if (geminiData) {
        const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log(`Output from ${usedModel} (${text.length} chars):`);
        console.log(text.slice(0, 300) + '...\n');
    } else {
        console.error('PRD generation failed on all models.');
    }
}

async function run() {
    await testCanvasGeneration();
    await testPrdGeneration();
}

run();
