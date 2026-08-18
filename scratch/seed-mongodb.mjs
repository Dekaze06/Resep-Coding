import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

const uri = "mongodb+srv://dekaze01_db_user:Nug5mEH0uoXoZdQd@satusite.1ayfqxp.mongodb.net/?appName=SATUSITE";

async function seed() {
  console.log("Starting data migration to MongoDB Atlas...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("satusite_db");

    // 1. Seed Projects
    const projectsFile = path.resolve('src/data/projects.json');
    if (fs.existsSync(projectsFile)) {
      const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf-8'));
      if (projects.length > 0) {
        const col = db.collection('projects');
        for (const p of projects) {
          await col.updateOne({ id: p.id }, { $set: p }, { upsert: true });
        }
        console.log(`✔ Seeded ${projects.length} projects to MongoDB 'projects' collection.`);
      }
    }

    // 2. Seed Users
    const usersFile = path.resolve('src/data/users.json');
    if (fs.existsSync(usersFile)) {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
      if (users.length > 0) {
        const col = db.collection('users');
        for (const u of users) {
          await col.updateOne({ id: u.id }, { $set: u }, { upsert: true });
        }
        console.log(`✔ Seeded ${users.length} users to MongoDB 'users' collection.`);
      }
    }

    // 3. Seed System Config
    const configFile = path.resolve('src/data/system-config.json');
    if (fs.existsSync(configFile)) {
      const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
      const col = db.collection('system_config');
      await col.updateOne({}, { $set: config }, { upsert: true });
      console.log(`✔ Seeded system config to MongoDB 'system_config' collection.`);
    }

    // 4. Verify count
    const pCount = await db.collection('projects').countDocuments();
    const uCount = await db.collection('users').countDocuments();
    console.log(`\n🎉 MongoDB Atlas is now fully synchronized!`);
    console.log(`📊 Projects in MongoDB: ${pCount}`);
    console.log(`📊 Users in MongoDB: ${uCount}`);

  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await client.close();
  }
}

seed();
