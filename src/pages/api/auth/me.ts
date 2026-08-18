import type { APIRoute } from 'astro';
import { UsersDB } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization') || '';
  const url = new URL(request.url);
  const emailParam = url.searchParams.get('email');

  let email = emailParam;
  if (!email && authHeader.startsWith('Bearer sat_token_')) {
    try {
      const parts = authHeader.replace('Bearer sat_token_', '').split('_');
      email = Buffer.from(parts[0], 'base64').toString('utf8');
    } catch (e) {}
  }

  if (!email) {
    email = 'demo@satusite.studio';
  }

  const user = (await UsersDB.getByEmailAsync(email)) || {
    id: 'usr_demo',
    name: 'Demo Client',
    email: 'demo@satusite.studio',
    role: 'Client Pro' as const,
    status: 'active' as const,
    quota: 250,
    projectsCount: 4,
    joinedAt: '18 Agu 2026'
  };

  return new Response(JSON.stringify({
    success: true,
    user
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
