import type { APIRoute } from 'astro';
import { validateGitHubToken } from '../../../lib/github';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { token } = body;

    if (!token || !token.trim()) {
      return new Response(JSON.stringify({ success: false, error: 'Token GitHub tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await validateGitHubToken(token.trim());
    if (!result.valid) {
      return new Response(JSON.stringify({ success: false, error: result.error || 'Token tidak valid.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Token valid untuk akun @${result.username}`,
      username: result.username
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal memvalidasi token.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
