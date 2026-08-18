import type { APIRoute } from 'astro';
import { auditHtmlCode } from '../../../lib/analyzer';
import { ProjectsDB } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawText = await request.text();
    let body: any = {};
    if (rawText) {
      try {
        body = JSON.parse(rawText);
      } catch (e) {
        body = {};
      }
    }

    const { code, projectId } = body;

    let targetCode = code;
    if (!targetCode && projectId) {
      const project = ProjectsDB.getById(projectId);
      if (project && project.code) {
        targetCode = project.code;
      }
    }

    if (!targetCode) {
      targetCode = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>satusitE App</title></head><body><main class="p-8"><h1>Halo Dunia</h1><button>Klik Saya</button></main></body></html>`;
    }

    const auditResult = auditHtmlCode(targetCode);

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      ...auditResult
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal menjalankan audit pengujian.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
