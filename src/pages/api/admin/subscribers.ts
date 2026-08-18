import type { APIRoute } from 'astro';
import { SubscribersDB } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const subscribers = SubscribersDB.getAll();
    return new Response(JSON.stringify({
      success: true,
      total: subscribers.length,
      subscribers
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal memuat daftar pelanggan.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
