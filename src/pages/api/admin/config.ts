import type { APIRoute } from 'astro';
import { SystemConfigDB } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  const config = SystemConfigDB.get();
  return new Response(JSON.stringify({
    success: true,
    config
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const updated = SystemConfigDB.update(body);

    return new Response(JSON.stringify({
      success: true,
      message: 'Konfigurasi sistem berhasil diperbarui.',
      config: updated
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal memperbarui konfigurasi.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
