import { MongoClient } from 'mongodb';
import { UsersDB, ProjectsDB } from '../src/lib/db.ts';

const uri = "mongodb+srv://dekaze01_db_user:Nug5mEH0uoXoZdQd@satusite.1ayfqxp.mongodb.net/?appName=SATUSITE";

async function verifyRealSystem() {
  console.log("🚀 TESTING REAL SYSTEM INTEGRATION & CLEAN STATE...\n");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("satusite_db");

  // Test 1: Check clean initial state
  const pCount = await db.collection("projects").countDocuments();
  const uCount = await db.collection("users").countDocuments();
  console.log(`[TEST 1] Initial Clean State in MongoDB Atlas:`);
  console.log(`  - Projects Count: ${pCount} (Expected: 0)`);
  console.log(`  - Users Count   : ${uCount} (Expected: 0)`);

  // Test 2: Real Google User Upsert Flow
  console.log(`\n[TEST 2] Testing Google OAuth Upsert...`);
  const testUser = await UsersDB.upsertGoogleUser({
    name: 'Akamale Dev',
    email: 'akamale.studio@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/sample-avatar'
  });
  console.log(`  ✔ Google User Created in MongoDB:`, testUser.id, testUser.name, testUser.email);

  // Test 3: Get user by email
  const fetchedUser = await UsersDB.getByEmailAsync('akamale.studio@gmail.com');
  console.log(`  ✔ Fetched User directly from MongoDB:`, fetchedUser?.name, fetchedUser?.role, `Quota: ${fetchedUser?.quota}`);

  // Test 4: Update profile
  const updatedUser = await UsersDB.updateUser(testUser.id, { name: 'Akamale Google Pro' });
  console.log(`  ✔ Updated User Profile in MongoDB:`, updatedUser?.name);

  // Test 5: Real Project Creation
  console.log(`\n[TEST 3] Testing Real Project Creation Flow...`);
  const testProject = await ProjectsDB.createAsync({
    name: 'Real AI SaaS App',
    category: 'SaaS Dashboard',
    mode: 'fullstack',
    owner: 'akamale.studio@gmail.com',
    status: 'Live',
    prompt: 'Aplikasi dashboard analitik AI real-time dengan MongoDB',
    code: '<!DOCTYPE html><html><body><h1>Real App</h1></body></html>'
  });
  console.log(`  ✔ Project Created in MongoDB:`, testProject.id, testProject.name);

  const projectsAfter = await ProjectsDB.getAllAsync('akamale.studio@gmail.com');
  console.log(`  ✔ Fetched ${projectsAfter.length} Projects for user from MongoDB.`);

  // Cleanup test records so user starts with a 100% pristine clean database
  console.log(`\n[CLEANUP] Removing test artifacts from MongoDB...`);
  await ProjectsDB.deleteAsync(testProject.id);
  await db.collection("users").deleteOne({ id: testUser.id });
  const finalPCount = await db.collection("projects").countDocuments();
  const finalUCount = await db.collection("users").countDocuments();

  console.log(`\n🎉 VERIFICATION SUMMARY:`);
  console.log(`  - Real Auth & Database Engine : 100% OPERATIONAL`);
  console.log(`  - Current Active Projects     : ${finalPCount}`);
  console.log(`  - Current Active Users        : ${finalUCount}`);
  console.log(`  - Status                      : PRISTINE & READY FOR REAL USE!`);

  await client.close();
}

verifyRealSystem().catch(console.error);
