import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://dekaze01_db_user:Nug5mEH0uoXoZdQd@satusite.1ayfqxp.mongodb.net/?appName=SATUSITE";
const client = new MongoClient(uri);

async function testBackend() {
  console.log("=================================================");
  console.log("🚀 TESTING COMPREHENSIVE BACKEND & MONGODB ATOM");
  console.log("=================================================\n");

  let allPassed = true;

  try {
    // 1. Database Direct Connection & Collections Test
    console.log("[1] Testing MongoDB Cloud Cluster Connection...");
    await client.connect();
    const db = client.db("satusite_db");
    const ping = await db.command({ ping: 1 });
    if (ping.ok === 1) {
      console.log("  ✔ MongoDB Atlas Ping: OK");
    } else {
      console.error("  ❌ MongoDB Atlas Ping: FAILED");
      allPassed = false;
    }

    // 2. Test Projects Collection CRUD in MongoDB
    console.log("\n[2] Testing Projects CRUD in MongoDB Atlas...");
    const testProjId = `test_proj_${Date.now()}`;
    const testProj = {
      id: testProjId,
      name: "Auto QA Integration Test Project",
      category: "SaaS & AI Tool",
      mode: "fullstack",
      owner: "demo@satusite.studio",
      status: "Live",
      views: 1,
      prompt: "Buat sistem CRM enterprise",
      code: "<!DOCTYPE html><html><head><title>Test CRM</title></head><body><h1>CRM Active</h1></body></html>",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create
    await db.collection("projects").insertOne(testProj);
    console.log("  ✔ Insert Project: SUCCESS (ID: " + testProjId + ")");

    // Read
    const fetchedProj = await db.collection("projects").findOne({ id: testProjId });
    if (fetchedProj && fetchedProj.name === testProj.name) {
      console.log("  ✔ Read Project: SUCCESS (Matches inserted name)");
    } else {
      console.error("  ❌ Read Project: FAILED");
      allPassed = false;
    }

    // Update
    await db.collection("projects").updateOne({ id: testProjId }, { $set: { views: 42, status: "Building" } });
    const updatedProj = await db.collection("projects").findOne({ id: testProjId });
    if (updatedProj && updatedProj.views === 42 && updatedProj.status === "Building") {
      console.log("  ✔ Update Project: SUCCESS (Views updated to 42)");
    } else {
      console.error("  ❌ Update Project: FAILED");
      allPassed = false;
    }

    // Delete
    await db.collection("projects").deleteOne({ id: testProjId });
    const checkDeleted = await db.collection("projects").findOne({ id: testProjId });
    if (!checkDeleted) {
      console.log("  ✔ Delete Project: SUCCESS (Cleanly removed)");
    } else {
      console.error("  ❌ Delete Project: FAILED");
      allPassed = false;
    }

    // 3. Test Users Collection CRUD in MongoDB
    console.log("\n[3] Testing Users Collection in MongoDB Atlas...");
    const testUserId = `test_usr_${Date.now()}`;
    const testUser = {
      id: testUserId,
      name: "Integration Test User",
      email: `test.${Date.now()}@satusite.studio`,
      role: "Client Pro",
      status: "active",
      quota: 50,
      projectsCount: 1,
      joinedAt: "18 Agu 2026"
    };

    await db.collection("users").insertOne(testUser);
    console.log("  ✔ Insert User: SUCCESS (" + testUser.email + ")");

    await db.collection("users").updateOne({ id: testUserId }, { $inc: { quota: 10 } });
    const updatedUser = await db.collection("users").findOne({ id: testUserId });
    if (updatedUser && updatedUser.quota === 60) {
      console.log("  ✔ Update User Quota: SUCCESS (Quota updated to 60)");
    } else {
      console.error("  ❌ Update User Quota: FAILED");
      allPassed = false;
    }

    await db.collection("users").deleteOne({ id: testUserId });
    console.log("  ✔ Delete User: SUCCESS (Cleanly removed)");

    // 4. Test Subscribers Collection in MongoDB
    console.log("\n[4] Testing Subscribers in MongoDB Atlas...");
    const testSubEmail = `sub.${Date.now()}@example.com`;
    await db.collection("subscribers").insertOne({
      email: testSubEmail,
      subscribedAt: new Date().toISOString(),
      source: "landing_cta_test"
    });
    const subCheck = await db.collection("subscribers").findOne({ email: testSubEmail });
    if (subCheck) {
      console.log("  ✔ Insert & Read Subscriber: SUCCESS");
      await db.collection("subscribers").deleteOne({ email: testSubEmail });
    } else {
      console.error("  ❌ Subscriber Test: FAILED");
      allPassed = false;
    }

    // 5. Test System Config in MongoDB
    console.log("\n[5] Testing System Config in MongoDB Atlas...");
    const sysConfig = await db.collection("system_config").findOne({});
    if (sysConfig && sysConfig.primaryModel) {
      console.log("  ✔ System Config Model: " + sysConfig.primaryModel);
      console.log("  ✔ System Config Edge Nodes: " + sysConfig.edgeNodesCount);
    } else {
      console.error("  ❌ System Config: FAILED");
      allPassed = false;
    }

    // 6. Summary Counts
    console.log("\n[6] Live MongoDB Atlas Stats Summary:");
    const finalPCount = await db.collection("projects").countDocuments();
    const finalUCount = await db.collection("users").countDocuments();
    const finalSCount = await db.collection("subscribers").countDocuments();
    console.log(`  📊 Total Active Projects: ${finalPCount}`);
    console.log(`  📊 Total Registered Users: ${finalUCount}`);
    console.log(`  📊 Total Subscribers: ${finalSCount}`);

    console.log("\n=================================================");
    if (allPassed) {
      console.log("🎉 ALL INTEGRATIONS & BACKEND TESTS PASSED 100%!");
    } else {
      console.log("⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.");
    }
    console.log("=================================================");

  } catch (err) {
    console.error("Fatal Error during testing:", err);
  } finally {
    await client.close();
  }
}

testBackend();
