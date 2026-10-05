import type { APIRoute } from 'astro';
import { pushToGitHub } from '../../../lib/github';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const effectiveToken = (body.token || body.pat || '').trim();
    const repoName = (body.repoName || '').trim();
    const isPrivate = Boolean(body.isPrivate);
    const commitMessage = (body.commitMessage || 'feat: publish app via Satusite Studio').trim();

    if (!effectiveToken) {
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

    let effectiveFiles = body.files;
    if ((!effectiveFiles || !Array.isArray(effectiveFiles) || effectiveFiles.length === 0) && body.code) {
      effectiveFiles = [
        { path: 'index.html', content: body.code },
        { path: 'README.md', content: `# ${body.projectName || repoName}\n\nAplikasi web mandiri dihasilkan otomatis oleh Satusite Studio AI Agent.\n\n## Panduan Menjalankan:\n1. Buka \`index.html\` langsung di peramban Anda.\n2. Hubungkan repositori ini ke Vercel atau Netlify untuk deployment otomatis gratis.` }
      ];
    }

    if (!effectiveFiles || !Array.isArray(effectiveFiles) || effectiveFiles.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Daftar berkas atau kode proyek yang akan dipush tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await pushToGitHub({
      token: effectiveToken,
      repoName,
      isPrivate,
      commitMessage,
      files: effectiveFiles
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
