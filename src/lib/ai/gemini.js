// Shared Gemini REST client for all Satusite Studio generators.
// - Model failover (primary -> fallback) driven by system config
// - Smart retry: retries only on transient errors (429 / 5xx / network)
// - Robust text extraction (joins all non-thought text parts)
// - Deterministic post-processing (emoji stripping)
import { SystemConfigDB } from '../db.ts';

const DEFAULT_MODELS = [
    'gemini-3.7-flash',
    'gemini-3.8-flash',
];
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

export function getApiKey() {
    return (typeof import.meta !== 'undefined' && import.meta.env?.GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';
}

/** Resolve model order from admin system config, falling back to defaults. */
export async function resolveModels() {
    try {
        const cfg = await SystemConfigDB.getAsync();
        const list = [cfg?.primaryModel, cfg?.fallbackModel].filter(Boolean);
        const unique = [...new Set(list)];
        return unique.length ? unique : DEFAULT_MODELS;
    } catch {
        return DEFAULT_MODELS;
    }
}

/** Join every text part of the first candidate, skipping internal thought parts. */
export function extractText(data) {
    const parts = data?.candidates?.[0]?.content?.parts || [];
    return parts
        .filter((p) => p && typeof p.text === 'string' && !p.thought)
        .map((p) => p.text)
        .join('');
}

/**
 * Gemini expects alternating user/model turns that start with a user turn.
 * Merge consecutive same-role turns and drop leading model turns.
 */
export function normalizeContents(contents) {
    const out = [];
    for (const c of contents) {
        const text = (c?.parts || []).map((p) => p.text || '').join('\n').trim();
        if (!text) continue;
        const role = c.role === 'model' ? 'model' : 'user';
        if (!out.length && role === 'model') continue;
        const last = out[out.length - 1];
        if (last && last.role === role) {
            last.parts[0].text += `\n\n${text}`;
        } else {
            out.push({ role, parts: [{ text }] });
        }
    }
    return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Call Gemini generateContent with failover.
 * @returns {Promise<{text: string, finishReason: string, model: string} | null>}
 */
export async function generate({
    systemPrompt,
    contents,
    temperature = 0.7,
    topP = 0.95,
    maxOutputTokens = 8192,
    responseMimeType,
    models,
    attemptsPerModel = 2,
}) {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    const modelList = models && models.length ? models : await resolveModels();
    const generationConfig = { temperature, topP, maxOutputTokens };
    if (responseMimeType) generationConfig.responseMimeType = responseMimeType;

    const body = JSON.stringify({
        ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
        contents: normalizeContents(contents),
        generationConfig,
    });

    for (const model of modelList) {
        for (let attempt = 1; attempt <= attemptsPerModel; attempt++) {
            try {
                const res = await fetch(`${ENDPOINT}/${model}:generateContent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
                    body,
                });

                if (res.ok) {
                    const data = await res.json();
                    const text = extractText(data);
                    const finishReason = data?.candidates?.[0]?.finishReason || 'STOP';
                    if (text) return { text, finishReason, model };
                    console.warn(`[Gemini] ${model} returned empty text (finishReason: ${finishReason})`);
                    break; // empty/blocked output: try next model
                }

                const errText = await res.text();
                console.warn(`[Gemini] ${model} attempt ${attempt} -> ${res.status}: ${errText.slice(0, 160)}`);
                const transient = res.status === 429 || res.status >= 500;
                if (!transient) break; // 400/403/404: retrying the same model will not help
                if (attempt < attemptsPerModel) await sleep(1200 * attempt);
            } catch (err) {
                console.warn(`[Gemini] ${model} attempt ${attempt} network error: ${err?.message || err}`);
                if (attempt < attemptsPerModel) await sleep(1000 * attempt);
            }
        }
    }
    return null;
}

// Emoji ranges only. Typographic symbols used in professional UI (such as
// copyright, trademark, arrows and the star used in ratings) are preserved.
const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2705}\u{274C}\u{274E}\u{2728}\u{26A1}\u{2B50}\u{2B55}\u{23F0}\u{23F3}\u{231B}\u{2615}\u{2764}\u{FE0F}]/gu;

export function stripEmoji(text) {
    return typeof text === 'string' ? text.replace(EMOJI_RE, '') : text;
}

/** Parse a JSON response defensively (handles stray code fences). */
export function parseJsonLoose(text) {
    if (!text) return null;
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    try {
        return JSON.parse(cleaned);
    } catch {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start >= 0 && end > start) {
            try { return JSON.parse(cleaned.slice(start, end + 1)); } catch { /* ignore */ }
        }
        return null;
    }
}
