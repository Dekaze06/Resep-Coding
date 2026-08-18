import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

const uri = "mongodb+srv://dekaze01_db_user:Nug5mEH0uoXoZdQd@satusite.1ayfqxp.mongodb.net/?appName=SATUSITE";
const client = new MongoClient(uri);

async function purge() {
  console.log("🧹 PURGING ALL DUMMY DATA FROM MONGODB ATLAS & LOCAL JSON...");

  try {
    await client.connect();
    const db = client.db("satusite_db");

    // 1. Delete all projects
    const pResult = await db.collection("projects").deleteMany({});
    console.log(`  ✔ Deleted ${pResult.deletedCount} projects from MongoDB.`);

    // 2. Delete all users
    const uResult = await db.collection("users").deleteMany({});
    console.log(`  ✔ Deleted ${uResult.deletedCount} users from MongoDB.`);

    // 3. Delete all subscribers
    const sResult = await db.collection("subscribers").deleteMany({});
    console.log(`  ✔ Deleted ${sResult.deletedCount} subscribers from MongoDB.`);

    // 4. Initialize system_config cleanly
    await db.collection("system_config").updateOne({}, {
      $set: {
        primaryModel: 'gemini-2.5-flash',
        fallbackModel: 'gemini-1.5-pro',
        temperature: 0.7,
        topP: 0.95,
        systemStatus: 'healthy',
        maintenanceMode: false,
        edgeNodesCount: 312,
        updatedAt: new Date().toISOString()
      }
    }, { upsert: true });
    console.log(`  ✔ System configuration initialized.`);

    // 5. Clean local JSON files
    fs.writeFileSync(path.resolve('src/data/projects.json'), '[]', 'utf-8');
    fs.writeFileSync(path.resolve('src/data/users.json'), '[]', 'utf-8');
    fs.writeFileSync(path.resolve('src/data/subscribers.json'), '[]', 'utf-8');
    console.log(`  ✔ Local JSON database files reset to empty array [].`);

    const pCount = await db.collection("projects").countDocuments();
    const uCount = await db.collection("users").countDocuments();
    const sCount = await db.collection("subscribers").countDocuments();

    console.log(`\n🎉 CLEAN STATE CONFIRMATION:`);
    console.log(`   Projects in DB: ${pCount}`);
    console.log(`   Users in DB: ${uCount}`);
    console.log(`   Subscribers in DB: ${sCount}`);

  } catch (err) {
    console.error("❌ Purge failed:", err);
  } finally {
    await client.close();
  }
}

purge();
