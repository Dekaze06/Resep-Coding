import type { APIRoute } from 'astro';
import { SystemConfigDB } from '../../lib/db';
import { isMongoConfigured } from '../../lib/mongodb';

export const prerender = false;

export const GET: APIRoute = async () => {
  const config = SystemConfigDB.get();
  const uptimeSeconds = process.uptime();

  return new Response(JSON.stringify({
    status: 'healthy',
    platform: 'satusitE Studio Cloud Backend',
    version: '2.5.0',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptimeSeconds / 60)}m ${Math.floor(uptimeSeconds % 60)}s`,
    database: {
      driver: isMongoConfigured() ? 'MongoDB Atlas' : 'In-Memory JSON Store (Local Fallback)',
      isCloudConnected: isMongoConfigured()
    },
    engine: {
      primary: config.primaryModel,
      fallback: config.fallbackModel,
      edgeNodes: config.edgeNodesCount
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
