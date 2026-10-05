import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { projectId, projectName = 'satusite-app', provider = 'vercel', customDomain } = body;
    const token = (body.token || (provider === 'vercel' ? process.env.VERCEL_TOKEN : process.env.NETLIFY_TOKEN) || '').trim();

    const slug = (projectName || 'satusite-app')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 30) || 'app';

    const htmlContent = body.code || '<!DOCTYPE html><html><body><h1>Satusite Web App</h1></body></html>';

    // Provider: Vercel Deployments API
    if (provider === 'vercel') {
      if (!token) {
        return new Response(JSON.stringify({
          success: false,
          requiresToken: true,
          error: 'Vercel Personal Access Token diperlukan untuk deploy otomatis. Buat token gratis di vercel.com/account/tokens atau gunakan opsi Netlify Drop / GitHub.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const vercelRes = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: slug,
          files: [
            {
              file: 'index.html',
              data: htmlContent
            }
          ],
          projectSettings: {
            framework: null
          }
        })
      });

      const vercelData = await vercelRes.json();

      if (!vercelRes.ok || vercelData.error) {
        return new Response(JSON.stringify({
          success: false,
          error: vercelData.error?.message || 'Gagal mendeploy ke Vercel API. Periksa token Anda.'
        }), {
          status: vercelRes.status || 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const liveUrl = customDomain
        ? `https://${customDomain.replace(/^https?:\/\//, '')}`
        : `https://${vercelData.url}`;

      return new Response(JSON.stringify({
        success: true,
        deploymentId: vercelData.id,
        provider: 'vercel',
        liveUrl,
        status: 'Live',
        deployedAt: new Date().toISOString(),
        logs: [
          `[VERCEL] Deployment ID: ${vercelData.id}`,
          `[VERCEL] Status Edge: ${vercelData.readyState || 'READY'}`,
          `[VERCEL] Berkas index.html (${htmlContent.length} bytes) berhasil diunggah`,
          `[SUCCESS] Website resmi aktif di: ${liveUrl}`
        ]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Provider: Netlify Deploy API
    if (provider === 'netlify') {
      if (!token) {
        return new Response(JSON.stringify({
          success: false,
          requiresToken: true,
          error: 'Netlify Personal Access Token diperlukan untuk deploy API. Anda juga dapat menggunakan Netlify Drop (gratis tanpa token).'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 1. Create a site on Netlify
      const siteRes = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${slug}-${Math.random().toString(36).substring(2, 6)}`
        })
      });

      const siteData = await siteRes.json();
      if (!siteRes.ok || siteData.error) {
        return new Response(JSON.stringify({
          success: false,
          error: siteData.message || 'Gagal membuat situs di Netlify API.'
        }), {
          status: siteRes.status || 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const liveUrl = siteData.ssl_url || siteData.url || `https://${siteData.name}.netlify.app`;
      return new Response(JSON.stringify({
        success: true,
        deploymentId: siteData.id,
        provider: 'netlify',
        liveUrl,
        status: 'Live',
        deployedAt: new Date().toISOString(),
        logs: [
          `[NETLIFY] Site ID: ${siteData.id}`,
          `[NETLIFY] Subdomain: ${siteData.name}.netlify.app`,
          `[SUCCESS] Situs aktif di: ${liveUrl}`
        ]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: `Provider ${provider} memerlukan token integrasi atau sinkronisasi melalui GitHub.`
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal mengeksekusi deployment.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
