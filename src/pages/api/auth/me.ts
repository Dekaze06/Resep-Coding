import type { APIRoute } from 'astro';
import { UsersDB } from '../../../lib/db';

export const prerender = false;

function extractEmail(request: Request): string | null {
  const authHeader = request.headers.get('authorization') || '';
  const url = new URL(request.url);
  const emailParam = url.searchParams.get('email');

  if (emailParam) return emailParam.trim().toLowerCase();
  if (authHeader.startsWith('Bearer sat_token_')) {
    try {
      const parts = authHeader.replace('Bearer sat_token_', '').split('_');
      return Buffer.from(parts[0], 'base64').toString('utf8').trim().toLowerCase();
    } catch (e) {}
  }
  return null;
}

export const GET: APIRoute = async ({ request }) => {
  const email = extractEmail(request);

  if (!email) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Tidak terautentikasi. Silakan login terlebih dahulu.'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const user = await UsersDB.getByEmailAsync(email);
  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Pengguna tidak ditemukan dalam database.'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    user
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const email = extractEmail(request);

  if (!email) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Tidak terautentikasi.'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { name, role, avatar } = body;

    const user = await UsersDB.getByEmailAsync(email);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Pengguna tidak ditemukan.'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updated = await UsersDB.updateUser(user.id, {
      ...(name && { name }),
      ...(role && { role }),
      ...(avatar && { avatar })
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Profil berhasil diperbarui.',
      user: updated
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Gagal memperbarui profil.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
