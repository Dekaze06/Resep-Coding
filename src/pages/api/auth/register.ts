import type { APIRoute } from 'astro';
import { UsersDB } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { name, email } = body;

    if (!email || !name) {
      return new Response(JSON.stringify({ success: false, error: 'Nama dan email wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const existing = await UsersDB.getByEmailAsync(email);
    if (existing) {
      return new Response(JSON.stringify({ success: false, error: 'Email sudah terdaftar. Silakan login.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = UsersDB.create({
      name,
      email,
      role: 'Gratis',
      status: 'active',
      quota: 15,
      projectsCount: 0
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Pendaftaran akun berhasil!',
      token: `sat_token_${Buffer.from(email).toString('base64')}_${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        quota: user.quota,
        projectsCount: user.projectsCount
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal mendaftarkan akun.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
