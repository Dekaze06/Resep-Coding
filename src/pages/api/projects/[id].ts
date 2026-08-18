import type { APIRoute } from 'astro';
import { ProjectsDB } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ success: false, error: 'ID proyek tidak valid.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const project = ProjectsDB.getById(id);
  if (!project) {
    return new Response(JSON.stringify({ success: false, error: 'Proyek tidak ditemukan.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    project
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ success: false, error: 'ID proyek tidak valid.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const updated = ProjectsDB.update(id, body);

    if (!updated) {
      return new Response(JSON.stringify({ success: false, error: 'Proyek tidak ditemukan.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Proyek berhasil diperbarui.',
      project: updated
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal memperbarui proyek.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ success: false, error: 'ID proyek tidak valid.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const deleted = ProjectsDB.delete(id);
  if (!deleted) {
    return new Response(JSON.stringify({ success: false, error: 'Proyek tidak ditemukan.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    message: 'Proyek berhasil dihapus.'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
