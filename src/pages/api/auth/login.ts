import type { APIRoute } from 'astro';
import { UsersDB } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Email wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let user = await UsersDB.getByEmailAsync(email);

    if (!user) {
      const adminEmails = (process.env.ADMIN_ALLOWED_EMAILS || 'dekaze08@gmail.com').toLowerCase().split(',').map(s => s.trim());
      const isSuperAdmin = adminEmails.includes(email.toLowerCase().trim());
      user = UsersDB.create({
        name: email.split('@')[0],
        email,
        role: isSuperAdmin ? 'Superadmin' : 'Gratis',
        status: 'active',
        quota: isSuperAdmin ? 99999 : 1,
        projectsCount: 0
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Login berhasil.',
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
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal memproses login.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
