import https from 'https';

const routes = [
  '/',
  '/login',
  '/app',
  '/portal',
  '/templates',
  '/verify-email',
  '/api/health',
  '/api/projects'
];

async function checkRoute(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.get(`https://satusitestudio.vercel.app${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const ms = Date.now() - start;
        resolve({
          path,
          status: res.statusCode,
          ms,
          size: data.length,
          hasGoogleGsi: data.includes('accounts.google.com/gsi/client'),
          hasLoginScript: data.includes('satusite_auth_user'),
        });
      });
    });
    req.on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing live deployment at https://satusitestudio.vercel.app ...\n');
  for (const r of routes) {
    const result = await checkRoute(r);
    if (result.error) {
      console.log(`[FAIL] ${r} -> Error: ${result.error}`);
    } else {
      console.log(`[OK]   ${result.status} | ${result.path} | ${result.size} bytes | ${result.ms}ms`);
    }
  }
}

run();
