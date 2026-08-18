import type { APIRoute } from 'astro';
import { UsersDB } from '../../../lib/db';

export const prerender = false;

// Helper to decode JWT without external dependencies
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { credential, accessToken, userInfo } = body;

    let email = '';
    let name = '';
    let avatar = '';

    // 1. If Google ID Token (Credential) is provided from Google Identity Services
    if (credential) {
      // First attempt: verify via Google tokeninfo endpoint
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        if (verifyRes.ok) {
          const googleData = await verifyRes.json();
          email = googleData.email;
          name = googleData.name || googleData.email?.split('@')[0];
          avatar = googleData.picture;
        }
      } catch (err) {
        console.warn('[Google Auth] Tokeninfo check fallback to local JWT decode:', err);
      }

      // Fallback: decode JWT payload
      if (!email) {
        const decoded = parseJwt(credential);
        if (decoded && decoded.email) {
          email = decoded.email;
          name = decoded.name || decoded.email.split('@')[0];
          avatar = decoded.picture || '';
        }
      }
    }

    // 2. If access token is passed directly
    if (!email && accessToken) {
      try {
        const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (userRes.ok) {
          const googleData = await userRes.json();
          email = googleData.email;
          name = googleData.name || googleData.email?.split('@')[0];
          avatar = googleData.picture;
        }
      } catch (err) {
        console.warn('[Google Auth] Fetch with accessToken failed:', err);
      }
    }

    // 3. If client userInfo is passed
    if (!email && userInfo && userInfo.email) {
      email = userInfo.email;
      name = userInfo.name || email.split('@')[0];
      avatar = userInfo.picture || userInfo.avatar || '';
    }

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token Google tidak valid atau gagal diverifikasi.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Upsert real user in MongoDB Atlas
    const user = await UsersDB.upsertGoogleUser({
      name: name || 'Google User',
      email: email.toLowerCase().trim(),
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}&backgroundColor=27272a`
    });

    const token = `sat_token_${Buffer.from(user.email).toString('base64')}_${Date.now()}`;

    return new Response(JSON.stringify({
      success: true,
      message: 'Login Google berhasil!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        quota: user.quota,
        projectsCount: user.projectsCount,
        authProvider: 'google',
        joinedAt: user.joinedAt
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Gagal memproses autentikasi Google.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
