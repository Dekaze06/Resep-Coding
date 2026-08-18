import http from 'http';

const routes = [
  '/',
  '/app',
  '/portal',
  '/admin',
  '/deploy',
  '/github',
  '/testing',
  '/templates',
  '/login',
  '/api/health',
  '/api/projects',
  '/api/admin/stats',
  '/api/admin/users',
  '/api/admin/config',
  '/api/admin/subscribers',
  '/api/auth/me?email=demo@satusite.studio'
];

async function checkRoute(path) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:4321${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, length: data.length });
      });
    });
    req.on('error', (err) => {
      resolve({ path, error: err.message });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ path, error: 'Timeout' });
    });
  });
}

async function run() {
  console.log('Testing all routes on http://localhost:4321...');
  for (const r of routes) {
    const res = await checkRoute(r);
    console.log(`${res.status || 'ERR'} | ${res.path} | ${res.error || res.length + ' bytes'}`);
  }
}

run();
