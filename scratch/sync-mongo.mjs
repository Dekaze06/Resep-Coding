import fs from 'fs';
import { MongoClient } from 'mongodb';

const envContent = fs.readFileSync('.env', 'utf-8');
let uri = '';
let dbName = 'satusite_db';

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('MONGODB_URI=')) {
    uri = trimmed.substring('MONGODB_URI='.length).trim();
  }
  if (trimmed.startsWith('MONGODB_DB_NAME=')) {
    dbName = trimmed.substring('MONGODB_DB_NAME='.length).trim();
  }
}

async function update() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const res = await db.collection('users').updateMany({}, { $set: { quota: 99999 } });
  console.log(`Successfully updated ${res.matchedCount} users in MongoDB Atlas to quota: 99999.`);
  await client.close();
}

update().catch(console.error);
