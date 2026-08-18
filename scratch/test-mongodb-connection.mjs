import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://dekaze01_db_user:Nug5mEH0uoXoZdQd@satusite.1ayfqxp.mongodb.net/?appName=SATUSITE";

async function testConnection() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✔ SUCCESS: Connected to MongoDB Atlas cluster!");

    const db = client.db("satusite_db");
    const pingResult = await db.command({ ping: 1 });
    console.log("✔ Ping Result:", pingResult);

    // List collections
    const collections = await db.listCollections().toArray();
    console.log("✔ Available Collections in 'satusite_db':", collections.map(c => c.name));

    // Test inserting / seeding initial system stats if empty
    const usersCol = db.collection("users");
    const userCount = await usersCol.countDocuments();
    console.log(`✔ Total documents in 'users' collection: ${userCount}`);

  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

testConnection();
