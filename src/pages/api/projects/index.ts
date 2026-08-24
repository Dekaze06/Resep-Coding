import type { APIRoute } from 'astro';
import { ProjectsDB } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const mode = url.searchParams.get('mode');
  const search = url.searchParams.get('search');
  const featured = url.searchParams.get('featured');
  const owner = url.searchParams.get('owner');

  let projects = await ProjectsDB.getAllAsync();

  if (owner) {
    projects = projects.filter(p => !p.owner || p.owner.toLowerCase() === owner.toLowerCase());
  }
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
    const { id, name, category = 'Web App', mode = 'fullstack', prompt = '', code = '', owner = 'demo@satusite.studio', isFeatured = false, prdContext = '', architectureNodes = [] } = body;

    if (!name) {
      return new Response(JSON.stringify({ success: false, error: 'Nama proyek wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. If explicit ID provided, update existing
    if (id) {
      const existing = await ProjectsDB.getByIdAsync(id);
      if (existing) {
        const updated = await ProjectsDB.updateAsync(id, {
          name,
          category,
          mode,
          owner,
          prompt: prompt || existing.prompt,
          code: code || existing.code,
          prdContext: prdContext || existing.prdContext,
          architectureNodes: architectureNodes && architectureNodes.length > 0 ? architectureNodes : existing.architectureNodes
        });
        return new Response(JSON.stringify({
          success: true,
          message: 'Proyek berhasil diperbarui.',
          project: updated
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 2. Prevent duplicates: if a project with same mode and name already exists for this owner, update it
    const all = await ProjectsDB.getAllAsync(owner);
    const existingSameName = all.find(p => 
      p.mode === mode && 
      p.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (existingSameName) {
      const updated = await ProjectsDB.updateAsync(existingSameName.id, {
        name,
        category,
        mode,
        owner,
        prompt: prompt || existingSameName.prompt,
        code: code || existingSameName.code,
        prdContext: prdContext || existingSameName.prdContext,
        architectureNodes: architectureNodes && architectureNodes.length > 0 ? architectureNodes : existingSameName.architectureNodes
      });
      return new Response(JSON.stringify({
        success: true,
        message: 'Dokumen PRD berhasil disinkronkan.',
        project: updated
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Create new project if not exists
    const created = await ProjectsDB.createAsync({
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
      message: 'Proyek berhasil disimpan ke database.',
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
