import type { APIRoute } from 'astro';
import { ProjectsDB } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { id, code, filename = 'satusite-app.html' } = body;

    let htmlContent = code;
    if (!htmlContent && id) {
      const project = ProjectsDB.getById(id);
      if (project && project.code) {
        htmlContent = project.code;
      }
    }

    if (!htmlContent) {
      return new Response(JSON.stringify({ success: false, error: 'Konten kode HTML tidak ditemukan.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal mengekspor file.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
