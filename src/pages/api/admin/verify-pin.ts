import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { pin } = body;

    const serverPin = process.env.ADMIN_SECRET_PIN || 'satusite2026';

    if (pin && pin.trim() === serverPin.trim()) {
      return new Response(JSON.stringify({
        success: true,
        message: 'PIN Superadmin Terverifikasi!',
        adminToken: `sat_adm_${Date.now()}`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'PIN Master Admin salah atau tidak valid.'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Gagal memverifikasi PIN.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
