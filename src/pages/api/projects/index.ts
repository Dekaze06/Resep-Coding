import type { APIRoute } from 'astro';
import { ProjectsDB } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const mode = url.searchParams.get('mode');
  const search = url.searchParams.get('search');
  const featured = url.searchParams.get('featured');

  let projects = ProjectsDB.getAll();

  if (category) {
    projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (mode) {
    projects = projects.filter(p => p.mode === mode);
  }
  if (featured === 'true') {
    projects = projects.filter(p => p.isFeatured);
  }
  if (search) {
    const q = search.toLowerCase();
    projects = projects.filter(p => p.name.toLowerCase().includes(q) || (p.prompt && p.prompt.toLowerCase().includes(q)));
  }

  return new Response(JSON.stringify({
    success: true,
    total: projects.length,
    projects
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { name, category = 'Web App', mode = 'fullstack', prompt = '', code = '', owner = 'demo@satusite.studio', isFeatured = false, prdContext = '', architectureNodes = [] } = body;

    if (!name) {
      return new Response(JSON.stringify({ success: false, error: 'Nama proyek wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const created = ProjectsDB.create({
      id: body.id,
      name,
      category,
      mode,
      owner,
      status: 'Live',
      isFeatured,
      views: 0,
      prompt,
      code,
      prdContext,
      architectureNodes
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Proyek berhasil disimpan.',
      project: created
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal menyimpan proyek.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
