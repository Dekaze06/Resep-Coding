import { dev } from 'astro';

async function start() {
  try {
    const devServer = await dev({
      root: '.',
      mode: 'development',
      server: {
        host: '127.0.0.1',
        port: 4321,
      }
    });
    console.log('Astro dev server is running on http://127.0.0.1:4321');
  } catch (err) {
    console.error('Failed to start Astro server:', err);
  }
}

start();
