// ============================================
// RRK Firestore Migration — Import into new project
// Usage: npm run migrate [path/to/export.json]
// ============================================

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const EXPORT_FILE = process.argv[2] || 'rrk-firestore-export.json';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'service-account.json');

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('Service account not found at scripts/service-account.json');
  console.error('Download it from Firebase Console → Project Settings → Service Accounts → Generate New Private Key');
  process.exit(1);
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

if (!fs.existsSync(EXPORT_FILE)) {
  console.error('Export file not found:', EXPORT_FILE);
  console.error('Run the export from admin.html first, then place the JSON file in this directory.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(EXPORT_FILE, 'utf8'));

const COLLECTION_ORDER = ['settings', 'categories', 'customers', 'menu', 'raw', 'occasions', 'orders'];

async function migrate() {
  console.log(`\nStarting Firestore migration to project: ${serviceAccount.project_id}`);
  console.log(`Source: ${data.projectId || 'unknown'}`);
  console.log(`Exported at: ${data.exportedAt || 'unknown'}\n`);

  let totalDocs = 0;
  let totalWritten = 0;

  for (const colName of COLLECTION_ORDER) {
    const docs = data.collections[colName];
    if (!docs || !Array.isArray(docs) || docs.length === 0) {
      console.log(`  ${colName}: 0 docs (empty)`);
      continue;
    }

    console.log(`  ${colName}: ${docs.length} docs → writing...`);
    totalDocs += docs.length;

    let batch = db.batch();
    let batchCount = 0;
    let colWritten = 0;

    for (const doc of docs) {
      const { id, ...docData } = doc;

      // settings collection uses `key` as document ID (export loses auto-generated IDs)
      let docId = id;
      if (!docId && colName === 'settings' && docData.key) {
        docId = docData.key;
      }

      if (!docId) {
        console.warn(`    WARNING: Skipping doc in ${colName} — missing ID`);
        continue;
      }

      batch.set(db.collection(colName).doc(docId), docData);
      batchCount++;
      colWritten++;

      if (batchCount >= 500) {
        await batch.commit();
        batch = db.batch();
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    totalWritten += colWritten;
    console.log(`         ${colWritten} written`);
  }

  console.log(`\nMigration complete! ${totalWritten}/${totalDocs} documents written to ${serviceAccount.project_id}`);
  console.log('Next step: Update js/firebase-config.js with the new project web config keys.\n');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
