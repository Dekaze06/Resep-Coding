import { MongoClient } from 'mongodb';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let uri = '';
let dbName = 'satusite_db';
for (const line of envFile.split('\n')) {
  if (line.startsWith('MONGODB_URI=')) uri = line.split('=')[1].trim();
  if (line.startsWith('MONGODB_DB_NAME=')) dbName = line.split('=')[1].trim();
}

async function updateMongo() {
  if (!uri) return;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection('users').updateMany({}, { $set: { quota: 99999 } });
    console.log(`Updated ${result.modifiedCount} users in MongoDB Atlas to quota: 99999.`);
  } catch (err) {
    console.error('Mongo update error:', err.message);
  } finally {
    await client.close();
  }
}

updateMongo();
