import type { APIRoute } from 'astro';
import { SubscribersDB } from '../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawText = await request.text();
    let body: any = {};
    if (rawText) {
      try {
        body = JSON.parse(rawText);
      } catch (e) {
        body = {};
      }
    }

    const { email, source = 'landing_cta' } = body;

    if (!email || !email.trim()) {
      return new Response(JSON.stringify({ success: false, error: 'Email wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return new Response(JSON.stringify({ success: false, error: 'Format email tidak valid.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = SubscribersDB.add(cleanEmail, source);

    return new Response(JSON.stringify({
      success: true,
      message: result.isNew
        ? 'Terima kasih telah berlangganan buletin mingguan satusitE!'
        : 'Email Anda sudah terdaftar dalam buletin mingguan kami.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal memproses langganan.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
