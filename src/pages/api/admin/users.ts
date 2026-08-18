import type { APIRoute } from 'astro';
import { UsersDB } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  const users = await UsersDB.getAllAsync();
  return new Response(JSON.stringify({
    success: true,
    users
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { action, userId, quotaDelta, name, email, role = 'Client Pro' } = body;

    if (action === 'adjust_quota' && userId) {
      const updated = UsersDB.updateQuota(userId, quotaDelta || 100);
      if (!updated) {
        return new Response(JSON.stringify({ success: false, error: 'Pengguna tidak ditemukan.' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({
        success: true,
        message: `Kuota berhasil ditambahkan (${updated.quota} token).`,
        user: updated
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'create_user' && email && name) {
      const created = UsersDB.create({
        name,
        email,
        role,
        status: 'active',
        quota: 100,
        projectsCount: 0
      });
      return new Response(JSON.stringify({
        success: true,
        message: 'Pengguna baru berhasil dibuat.',
        user: created
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Aksi tidak valid.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal memproses request admin.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'userId tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const deleted = UsersDB.delete(userId);
    if (!deleted) {
      return new Response(JSON.stringify({ success: false, error: 'Pengguna tidak ditemukan.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Pengguna berhasil dihapus dari platform.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal menghapus pengguna.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
