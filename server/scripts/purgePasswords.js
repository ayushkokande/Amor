/**
 * One-off cleanup:
 *  - profiles/*: delete the plaintext `password` field
 *  - groups/*: rewrite Male/Female member arrays through the public-field
 *    whitelist (drops password, email, nested groups from embedded copies)
 *
 * Full backup taken beforehand: server/scripts/firestore-export.json
 *
 * Usage: node server/scripts/purgePasswords.js
 */
const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyD9GFN-FQyikSn34cpS_HtPQKv5qN7L0tE",
  authDomain: "dating-website-c4a8e.firebaseapp.com",
  projectId: "dating-website-c4a8e",
});

const db = firebase.firestore();

function publicProfile(m) {
  return {
    uid: m.uid || "",
    f_name: m.f_name || "",
    l_name: m.l_name || "",
    age: m.age || "",
    sex: m.sex || "",
    bio: m.bio || "",
    images: m.images || [],
  };
}

async function main() {
  // 1. profiles: drop password
  const profiles = await db.collection("profiles").get();
  let profFixed = 0;
  for (const doc of profiles.docs) {
    if (doc.data().password !== undefined) {
      await doc.ref.update({
        password: firebase.firestore.FieldValue.delete(),
      });
      profFixed++;
    }
  }
  console.log(`profiles: removed password from ${profFixed}/${profiles.size}`);

  // 2. groups: sanitize embedded member copies
  const groups = await db.collection("groups").get();
  let grpFixed = 0;
  for (const doc of groups.docs) {
    const d = doc.data();
    const dirty = ["Male", "Female"].some((k) =>
      (d[k] || []).some(
        (m) => m.password !== undefined || m.email !== undefined || m.groups
      )
    );
    if (!dirty) continue;
    await doc.ref.update({
      Male: (d.Male || []).map(publicProfile),
      Female: (d.Female || []).map(publicProfile),
    });
    grpFixed++;
  }
  console.log(`groups: sanitized ${grpFixed}/${groups.size}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Purge failed:", err);
  process.exit(1);
});
