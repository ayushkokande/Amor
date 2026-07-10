/**
 * Dumps every Firestore collection (including subcollections) to JSON.
 *
 * Usage:
 *   node server/scripts/exportFirestore.js [path/to/serviceAccountKey.json]
 *
 * Defaults to server/scripts/serviceAccountKey.json. Get the key from
 * Firebase console → Project settings → Service accounts → Generate new
 * private key. Never commit the key or the export output.
 *
 * Output: server/scripts/firestore-export.json
 */
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const keyPath = path.resolve(
  process.argv[2] || path.join(__dirname, "serviceAccountKey.json")
);

if (!fs.existsSync(keyPath)) {
  console.error(`Service account key not found: ${keyPath}`);
  console.error(
    "Download it from Firebase console → Project settings → Service accounts."
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(keyPath)),
});

const db = admin.firestore();

async function dumpDoc(docRef) {
  const snap = await docRef.get();
  const out = { _data: snap.exists ? snap.data() : null };

  const subcollections = await docRef.listCollections();
  for (const sub of subcollections) {
    out[sub.id] = await dumpCollection(sub);
  }
  return out;
}

async function dumpCollection(colRef) {
  const out = {};
  const docs = await colRef.listDocuments();
  for (const docRef of docs) {
    out[docRef.id] = await dumpDoc(docRef);
  }
  return out;
}

async function main() {
  const result = {};
  const collections = await db.listCollections();

  for (const col of collections) {
    console.log(`Exporting collection: ${col.id}`);
    result[col.id] = await dumpCollection(col);
  }

  const outPath = path.join(__dirname, "firestore-export.json");
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`Done. Written to ${outPath}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
