import type { APIRoute } from 'astro';
import { UsersDB } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token verifikasi wajib disertakan.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const verifiedUser = await UsersDB.verifyUser(token);
    if (!verifiedUser) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token verifikasi tidak valid atau telah kedaluwarsa (berlaku 24 jam).'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const authToken = `sat_token_${Buffer.from(verifiedUser.email).toString('base64')}_${Date.now()}`;

    return new Response(JSON.stringify({
      success: true,
      message: 'Akun Anda berhasil diverifikasi! Selamat datang di satusitE.',
      token: authToken,
      user: {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        role: verifiedUser.role,
        quota: verifiedUser.quota,
        status: verifiedUser.status
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Terjadi kesalahan sistem saat memproses verifikasi.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = GET;
