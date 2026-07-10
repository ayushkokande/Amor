/**
 * Fallback export using the client SDK (works only while security rules
 * allow unauthenticated reads). Client SDK can't enumerate collections,
 * so known root collections are listed explicitly.
 *
 * Usage: node server/scripts/exportFirestoreClient.js
 * Output: server/scripts/firestore-export.json
 */
const fs = require("fs");
const path = require("path");
const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyD9GFN-FQyikSn34cpS_HtPQKv5qN7L0tE",
  authDomain: "dating-website-c4a8e.firebaseapp.com",
  projectId: "dating-website-c4a8e",
});

const db = firebase.firestore();

const ROOT_COLLECTIONS = ["groupcount", "groups", "profiles", "rooms"];
// Known subcollection names to probe under every document.
const SUBCOLLECTIONS = ["users", "messages", "chats"];

async function dumpCollection(colRef) {
  const out = {};
  const snap = await colRef.get();
  for (const doc of snap.docs) {
    out[doc.id] = { _data: doc.data() };
    for (const subName of SUBCOLLECTIONS) {
      const subSnap = await colRef.doc(doc.id).collection(subName).get();
      if (!subSnap.empty) {
        out[doc.id][subName] = {};
        subSnap.docs.forEach((d) => {
          out[doc.id][subName][d.id] = { _data: d.data() };
        });
      }
    }
  }
  return out;
}

async function main() {
  const result = {};
  for (const name of ROOT_COLLECTIONS) {
    console.log(`Exporting collection: ${name}`);
    try {
      result[name] = await dumpCollection(db.collection(name));
    } catch (err) {
      console.error(`  Failed: ${err.message}`);
      result[name] = { _error: err.message };
    }
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
