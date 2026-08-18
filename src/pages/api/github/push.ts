import type { APIRoute } from 'astro';
import { pushToGitHub } from '../../../lib/github';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { token, repoName, isPrivate = false, commitMessage = 'feat: publish app via Satusite Studio', files } = body;

    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Token GitHub wajib disertakan.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!repoName) {
      return new Response(JSON.stringify({ success: false, error: 'Nama repositori wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!files || !Array.isArray(files) || files.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Daftar file yang akan dipush tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await pushToGitHub({
      token,
      repoName,
      isPrivate,
      commitMessage,
      files
    });

    if (!result.success) {
      return new Response(JSON.stringify({ success: false, error: result.error }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Kode berhasil disinkronisasi ke GitHub!',
      repoUrl: result.repoUrl,
      commitUrl: result.commitUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal melakukan push ke GitHub.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
