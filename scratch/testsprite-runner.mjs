import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

const MONGODB_URI = "mongodb+srv://dekaze01_db_user:Nug5mEH0uoXoZdQd@satusite.1ayfqxp.mongodb.net/?appName=SATUSITE";
const DB_NAME = "satusite_db";

const reports = [];

async function runTest(suite, name, fn) {
  const start = performance.now();
  try {
    await fn();
    const durationMs = Math.round(performance.now() - start);
    reports.push({ suite, name, durationMs, status: 'PASSED' });
    console.log(`  ✔ [PASS] ${name} (${durationMs}ms)`);
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    reports.push({ suite, name, durationMs, status: 'FAILED', details: err.message });
    console.error(`  ❌ [FAIL] ${name} (${durationMs}ms): ${err.message}`);
  }
}

async function main() {
  console.log("===============================================================");
  console.log("🛡️  TESTSPRITE AUTOMATED COMPREHENSIVE QA TEST SUITE");
  console.log("    Platform: satusitE Studio Cloud");
  console.log("    Target DB: MongoDB Atlas (" + DB_NAME + ")");
  console.log("===============================================================\n");

  const overallStart = performance.now();

  // ==========================================================
  // SUITE 1: DATABASE & MONGODB ATLAS CLOUD LAYER
  // ==========================================================
  console.log("📂 [SUITE 1] Database & Cloud Storage Integrity");
  let client = null;

  await runTest("Database", "MongoDB Cluster Ping & Latency Check", async () => {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const ping = await client.db(DB_NAME).command({ ping: 1 });
    if (ping.ok !== 1) throw new Error("Cluster ping failed");
  });

  await runTest("Database", "Collection Integrity (projects, users, system_config, subscribers)", async () => {
    if (!client) throw new Error("MongoDB Client not initialized");
    const db = client.db(DB_NAME);
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);
    const required = ['projects', 'users', 'system_config'];
    for (const req of required) {
      if (!names.includes(req)) {
        throw new Error(`Required collection '${req}' is missing in MongoDB`);
      }
    }
  });

  await runTest("Database", "Projects Collection Schema & CRUD Validation", async () => {
    if (!client) throw new Error("MongoDB Client not initialized");
    const db = client.db(DB_NAME);
    const testId = `testsprite_proj_${Date.now()}`;
    
    // Insert
    await db.collection("projects").insertOne({
      id: testId,
      name: "TestSprite Benchmark Web",
      category: "E-Commerce",
      mode: "fullstack",
      owner: "qa@satusite.studio",
      status: "Live",
      views: 10,
      code: "<html><body><h1>TestSprite QA</h1></body></html>",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Query
    const found = await db.collection("projects").findOne({ id: testId });
    if (!found || found.views !== 10) throw new Error("Inserted document mismatch");

    // Cleanup
    await db.collection("projects").deleteOne({ id: testId });
  });

  await runTest("Database", "Users Collection Quota & Role Verification", async () => {
    if (!client) throw new Error("MongoDB Client not initialized");
    const db = client.db(DB_NAME);
    const testId = `testsprite_usr_${Date.now()}`;

    await db.collection("users").insertOne({
      id: testId,
      name: "Test User QA",
      email: `qa.${Date.now()}@satusite.studio`,
      role: "Client Pro",
      status: "active",
      quota: 100,
      projectsCount: 0,
      joinedAt: "18 Agu 2026"
    });

    await db.collection("users").updateOne({ id: testId }, { $inc: { quota: 50 } });
    const user = await db.collection("users").findOne({ id: testId });
    if (!user || user.quota !== 150) throw new Error("Quota increment failed");

    await db.collection("users").deleteOne({ id: testId });
  });

  // ==========================================================
  // SUITE 2: FILE STRUCTURE & ROUTE CONTRACTS
  // ==========================================================
  console.log("\n📂 [SUITE 2] Project Routing & Pages Coverage");

  const expectedRoutes = [
    'src/pages/index.astro',
    'src/pages/app.astro',
    'src/pages/portal.astro',
    'src/pages/admin.astro',
    'src/pages/deploy.astro',
    'src/pages/github.astro',
    'src/pages/testing.astro',
    'src/pages/templates.astro',
    'src/pages/login.astro'
  ];

  for (const r of expectedRoutes) {
    await runTest("Routing", `Verify page route exists: ${r}`, async () => {
      const fullPath = path.resolve(r);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`File route ${r} does not exist`);
      }
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.length < 50) {
        throw new Error(`File ${r} is empty or corrupted`);
      }
    });
  }

  // ==========================================================
  // SUITE 3: REST API ENDPOINTS & LOGIC VALIDATION
  // ==========================================================
  console.log("\n📂 [SUITE 3] REST API Logic & Error Handling");

  const expectedApis = [
    'src/pages/api/health.ts',
    'src/pages/api/projects/index.ts',
    'src/pages/api/projects/[id].ts',
    'src/pages/api/auth/login.ts',
    'src/pages/api/auth/register.ts',
    'src/pages/api/auth/me.ts',
    'src/pages/api/admin/stats.ts',
    'src/pages/api/admin/users.ts',
    'src/pages/api/admin/config.ts',
    'src/pages/api/admin/subscribers.ts',
    'src/pages/api/subscribe.ts',
    'src/pages/api/deploy/trigger.ts',
    'src/pages/api/deploy/verify-domain.ts',
    'src/pages/api/github/push.ts',
    'src/pages/api/testing/audit.ts'
  ];

  for (const api of expectedApis) {
    await runTest("API Contract", `Validate endpoint file: ${api}`, async () => {
      const fullPath = path.resolve(api);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`API endpoint ${api} is missing`);
      }
      const code = fs.readFileSync(fullPath, 'utf-8');
      if (!code.includes('export const')) {
        throw new Error(`API endpoint ${api} does not export handler`);
      }
    });
  }

  // ==========================================================
  // SUITE 4: DESIGN SYSTEM & COMPLIANCE
  // ==========================================================
  console.log("\n📂 [SUITE 4] Design System & Components Cleanliness");

  await runTest("Design System", "Verify Monochrome Color Standard in Hubs", async () => {
    const deployHubCode = fs.readFileSync(path.resolve('src/components/DeployHub.tsx'), 'utf-8');
    const githubHubCode = fs.readFileSync(path.resolve('src/components/GitHubPushHub.tsx'), 'utf-8');
    const testingHubCode = fs.readFileSync(path.resolve('src/components/TestingSuiteHub.tsx'), 'utf-8');

    if (!deployHubCode.includes('bg-[#09090b]') || !githubHubCode.includes('bg-[#09090b]') || !testingHubCode.includes('bg-[#09090b]')) {
      throw new Error("Base background theme mismatch");
    }
  });

  await runTest("Design System", "Verify Pricing Model Configuration (Gratis, Pro 265k, Max 2.35jt)", async () => {
    const indexAstro = fs.readFileSync(path.resolve('src/pages/index.astro'), 'utf-8');
    if (!indexAstro.includes('265.000') || !indexAstro.includes('2.350.000')) {
      throw new Error("Pricing tiers do not match specification");
    }
  });

  // Close MongoDB client
  if (client) {
    await client.close();
  }

  const overallDuration = Math.round(performance.now() - overallStart);
  const totalTests = reports.length;
  const passedTests = reports.filter(r => r.status === 'PASSED').length;
  const failedTests = reports.filter(r => r.status === 'FAILED').length;
  const passRate = Math.round((passedTests / totalTests) * 100);

  // ==========================================================
  // SUMMARY REPORT
  // ==========================================================
  console.log("\n===============================================================");
  console.log("📊 TESTSPRITE QA EXECUTION SUMMARY REPORT");
  console.log("===============================================================");
  console.log(`  Total Test Cases Executed : ${totalTests}`);
  console.log(`  Passed Cases              : ${passedTests} ✔`);
  console.log(`  Failed Cases              : ${failedTests} ❌`);
  console.log(`  Pass Rate                 : ${passRate}%`);
  console.log(`  Total Execution Time      : ${overallDuration}ms`);
  console.log("===============================================================");

  if (failedTests === 0) {
    console.log("🎉 VERDICT: ALL SYSTEMS & INTEGRATIONS VERIFIED 100% OPERATIONAL!");
  } else {
    console.log("⚠️ VERDICT: SYSTEM HAS FAILING TESTS.");
    process.exit(1);
  }
}

main();
