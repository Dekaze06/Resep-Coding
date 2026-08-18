import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://dekaze01_db_user:Nug5mEH0uoXoZdQd@satusite.1ayfqxp.mongodb.net/?appName=SATUSITE";
const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db('satusite_db');
  await db.collection('system_config').updateOne({}, {
    $set: {
      primaryModel: 'gemini-3.7-flash',
      fallbackModel: 'gemini-3.7-flash',
      temperature: 0.7,
      topP: 0.95,
      systemStatus: 'healthy',
      maintenanceMode: false,
      edgeNodesCount: 312,
      updatedAt: new Date().toISOString()
    }
  }, { upsert: true });

  const conf = await db.collection('system_config').findOne({});
  console.log('✅ Real MongoDB System Config Updated:', conf);
  await client.close();
}

run().catch(console.error);
