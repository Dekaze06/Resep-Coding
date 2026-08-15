const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const keyMatch = env.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
const key = keyMatch ? keyMatch[1].trim() : '';

async function run() {
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await res.json();
        if (data.models) {
            console.log('Total models:', data.models.length);
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log('Response:', JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('Error:', err);
    }
}
run();
