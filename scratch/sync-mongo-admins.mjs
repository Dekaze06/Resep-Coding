import { MongoClient } from 'mongodb';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let uri = '';
let dbName = 'satusite_db';
for (const line of envFile.split(/\r?\n/)) {
  if (line.startsWith('MONGODB_URI=')) uri = line.replace('MONGODB_URI=', '').trim();
  if (line.startsWith('MONGODB_DB_NAME=')) dbName = line.replace('MONGODB_DB_NAME=', '').trim();
}

console.log('Using URI:', uri.replace(/:[^:@]+@/, ':****@'));

const adminEmails = [
  'dekaze08@gmail.com',
  'dekaze06@gmail.com',
  'dekaze01@gmail.com',
  'akmalsf0@gmail.com',
  'akmalsf2@gmail.com'
];

async function syncMongo() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const usersColl = db.collection('users');

    for (const email of adminEmails) {
      const res = await usersColl.updateMany(
        { email: { $regex: new RegExp(`^${email}$`, 'i') } },
        { $set: { role: 'Superadmin', status: 'active', isVerified: true, quota: 99999 } }
      );
      console.log(`Updated ${email} (${res.matchedCount} matched) to Superadmin in MongoDB.`);
    }
    await client.close();
    console.log('MongoDB admin sync complete!');
  } catch (err) {
    console.error('Mongo sync error:', err.message);
  }
}

syncMongo();
