// server/index.js

const stableSelection = require("./matching/algo");
const {
  GROUP_SIZE,
  TOTAL_GROUP,
  createEmptyPreferences,
} = require("./matching/config");
const { buildPreferenceMatrix } = require("./matching/preferences");

const express = require("express");
const app = express();
const cors = require("cors");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const port = process.env.PORT || 8080;
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("port", port);
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Prefer the Admin SDK (bypasses security rules, so rules can be locked
// down). Falls back to the client SDK only when no service account key is
// available — that mode requires open Firestore rules.
const fs = require("fs");
const path = require("path");

function initDb() {
  const keyPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    [
      path.join(__dirname, "serviceAccountKey.json"),
      path.join(__dirname, "scripts", "serviceAccountKey.json"),
    ].find((p) => fs.existsSync(p));

  if (keyPath && fs.existsSync(keyPath)) {
    const admin = require("firebase-admin");
    admin.initializeApp({
      credential: admin.credential.cert(require(keyPath)),
    });
    console.log(`Firestore: admin SDK (key: ${keyPath})`);
    return admin.firestore();
  }

  console.warn(
    "Firestore: no service account key found — falling back to client SDK. " +
      "This only works while security rules allow unauthenticated access. " +
      "Put the key at server/serviceAccountKey.json to fix."
  );
  const firebase = require("firebase");
  require("firebase/firestore");
  firebase.initializeApp({
    apiKey:
      process.env.FIREBASE_API_KEY || "AIzaSyD9GFN-FQyikSn34cpS_HtPQKv5qN7L0tE",
    authDomain:
      process.env.FIREBASE_AUTH_DOMAIN || "dating-website-c4a8e.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "dating-website-c4a8e",
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || "dating-website-c4a8e.appspot.com",
    messagingSenderId:
      process.env.FIREBASE_MESSAGING_SENDER_ID || "158391929758",
    appId:
      process.env.FIREBASE_APP_ID || "1:158391929758:web:a4b4e3b7be16d0b6a7a48f",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-9QHBHFS8ZJ",
  });
  return firebase.firestore();
}

const db = initDb();
const { v4 } = require("uuid");

function getRequestUid(req) {
  return (
    req.query.uid ||
    req.headers["x-user-id"] ||
    req.body?.uid ||
    req.body?.id ||
    null
  );
}

function sendJson(res, payload, status = 200) {
  res.status(status).header("Access-Control-Allow-Origin", "*").json(payload);
}

// Only these profile fields may be copied into group docs / sent to other
// members. Never spread a raw profile doc — legacy docs carry password/email.
function publicProfile(data, uid) {
  const { f_name, l_name, age, sex, bio, images } = data || {};
  return { uid, f_name, l_name, age, sex, bio, images: images || [] };
}

app.get("/", (req, res) => {
  sendJson(res, {
    name: "Amor API",
    status: "running",
    message: "This is the backend only. Open the React app at http://localhost:3000",
    endpoints: {
      getGroup: "GET /getGroup?uid=<firebase-uid>",
      groupStatus: "GET /groups/:groupId/status?uid=<firebase-uid>",
      matching: "POST /algo",
      messages: "GET /rooms/:roomId",
    },
  });
});

const addMembers = async (count, newGroup, listUID, SEX, requestUid) => {
  let j = 0;

  for (let num = 0; num < 3; num++) {
    const newresponse = await db
      .collection("groupcount")
      .doc(num.toString())
      .collection("users")
      .where("sex", "==", SEX)
      .get();

    const arr = [];
    newresponse.forEach((doc) => {
      arr.push({ data: doc.data(), id: doc.id });
    });

    const newArr = [];
    for (let i = 0; j < count && i < arr.length; i++) {
      if (requestUid !== arr[i].data.uid) {
        const resp = await db.collection("profiles").doc(arr[i].data.uid).get();
        newArr.push(publicProfile(resp.data(), arr[i].data.uid));
        listUID.push({ uid: arr[i].data.uid, sex: SEX });
        j++;
      }
    }

    newGroup[SEX] = [...newGroup[SEX], ...newArr];
    if (newGroup[SEX].length === GROUP_SIZE) {
      return newGroup;
    }
  }

  return null;
};

const group = async (requestUid) => {
  try {
    const Ref = db.collection("profiles").doc(requestUid);
    const response = await Ref.get();
    if (!response.exists) return { empty: true, sex: null };

    const gender = response.data().sex;
    const sendSex = gender;
    const otherSex = sendSex === "Male" ? "Female" : "Male";
    let groupCreation = true;
    const listUID = [];

    if (response.data().groups && response.data().groups.length !== 0) {
      const groupArr = response.data().groups;
      let cnt = 0;
      let ret_group_id = null;

      for (let i = 0; i < groupArr.length; i++) {
        if (groupArr[i].marked === false) {
          ret_group_id = groupArr[i].id;
          break;
        }
        if (groupArr[i].matched !== true) cnt++;
      }

      if (ret_group_id !== null) {
        groupCreation = false;
        const ret_group = await db.collection("groups").doc(ret_group_id).get();
        return {
          newGroup: ret_group.data(),
          exists: true,
          sex: sendSex,
        };
      }

      if (cnt === 0) return { empty: true, sex: sendSex };
    }

    if (groupCreation) {
      const vid = v4();
      let newGroup = {
        id: vid,
        Male: [],
        Female: [],
        m_pref: createEmptyPreferences(),
        f_pref: createEmptyPreferences(),
        cnt: 0,
        size: GROUP_SIZE,
        status: "open",
      };

      if (sendSex === "Male") {
        newGroup.Male.push(publicProfile(response.data(), requestUid));
      } else {
        newGroup.Female.push(publicProfile(response.data(), requestUid));
      }

      listUID.push({ uid: requestUid, sex: gender });

      newGroup = await addMembers(
        GROUP_SIZE - 1,
        newGroup,
        listUID,
        sendSex,
        requestUid
      );
      if (newGroup === null) return { empty: true, sex: sendSex };

      newGroup = await addMembers(
        GROUP_SIZE,
        newGroup,
        listUID,
        otherSex,
        requestUid
      );
      if (newGroup === null) return { empty: true, sex: sendSex };

      await db.collection("groups").doc(vid).set(newGroup);

      return {
        newGroup,
        listUID,
        groupId: vid,
        exists: false,
        sex: sendSex,
      };
    }
  } catch (err) {
    console.error("group()", err);
    return null;
  }

  return null;
};

const updateAfterCreation = async (item, ret) => {
  const id = item.uid;
  const sex = item.sex;
  const idResponse = await db.collection("profiles").doc(id).get();
  let gr = idResponse.data().groups || [];
  const newGr = [];

  for (let i = 0; i < gr.length; i++) {
    if (gr[i].matched !== true) newGr.push(gr[i]);
  }
  const updated = [
    ...newGr,
    { id: ret.groupId, matched: false, marked: false },
  ];

  await db
    .collection("groupcount")
    .doc(updated.length.toString())
    .collection("users")
    .add({ uid: id, sex });

  const prevBucket = await db
    .collection("groupcount")
    .doc((updated.length - 1).toString())
    .collection("users")
    .where("uid", "==", id)
    .get();

  prevBucket.forEach((doc) => doc.ref.delete());

  await db.collection("profiles").doc(id).update({ groups: updated });
};

app.get("/rooms/:room", (req, res) => {
  const roomsRef = db
    .collection("rooms")
    .doc(req.params.room)
    .collection("messages");

  roomsRef
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      const arr_data = [];
      querySnapshot.forEach((doc) => {
        arr_data.push(doc.data());
      });
      sendJson(res, { messages: arr_data });
    })
    .catch((err) => {
      console.error(err);
      sendJson(res, { error: "Failed to load messages" }, 500);
    });
});

app.get("/groups/:groupId/status", async (req, res) => {
  const requestUid = getRequestUid(req);
  if (!requestUid) {
    return sendJson(res, { error: "uid required" }, 400);
  }

  try {
    const doc = await db.collection("groups").doc(req.params.groupId).get();
    if (!doc.exists) {
      return sendJson(res, { error: "Group not found" }, 404);
    }

    const groupData = doc.data();
    const submissionCount = groupData.cnt || 0;

    sendJson(res, {
      groupId: req.params.groupId,
      submissionCount,
      totalSubmissions: TOTAL_GROUP,
      status:
        submissionCount >= TOTAL_GROUP
          ? "complete"
          : groupData.status || "open",
    });
  } catch (err) {
    console.error(err);
    sendJson(res, { error: "Failed to load group status" }, 500);
  }
});

app.get("/getGroup", async (req, res) => {
  const requestUid = getRequestUid(req);
  if (!requestUid) {
    return sendJson(res, { error: "uid required" }, 400);
  }

  const ret = await group(requestUid);
  if (ret === null) {
    return sendJson(res, { error: "Failed to load group" }, 500);
  }

  if (ret.empty) {
    return sendJson(res, {
      success: true,
      done: [],
      sex: ret.sex,
      submissionCount: 0,
      totalSubmissions: TOTAL_GROUP,
    });
  }

  if (ret.exists) {
    return sendJson(res, {
      success: true,
      done: ret.newGroup,
      sex: ret.sex,
      submissionCount: ret.newGroup.cnt || 0,
      totalSubmissions: TOTAL_GROUP,
    });
  }

  for (let i = 0; i < TOTAL_GROUP; i++) {
    await updateAfterCreation(ret.listUID[i], ret);
  }

  sendJson(res, {
    success: true,
    done: ret.newGroup,
    sex: ret.sex,
    submissionCount: ret.newGroup.cnt || 0,
    totalSubmissions: TOTAL_GROUP,
  });
});

// Legacy endpoint — uid now travels on every request
app.post("/giveID", (req, res) => {
  sendJson(res, { success: true, deprecated: true });
});

const updateMatches = async (woman, match, groupDoc) => {
  const female = woman;
  const male = match;

  const u1 = groupDoc.Female[female].uid.toString();
  const u2 = groupDoc.Male[male].uid.toString();
  const room = u1.localeCompare(u2) < 0 ? `${u1}@${u2}` : `${u2}@${u1}`;

  await db
    .collection("rooms")
    .doc(room)
    .collection("messages")
    .add({ message: "Collection Created!", timestamp: Date.now() });

  await db
    .collection("profiles")
    .doc(groupDoc.Female[female].uid)
    .collection("matches")
    .doc(v4())
    .set({ uid: groupDoc.Male[male].uid, roomId: room, groupId: groupDoc.id });

  await db
    .collection("profiles")
    .doc(groupDoc.Male[male].uid)
    .collection("matches")
    .doc(v4())
    .set({
      uid: groupDoc.Female[female].uid,
      roomId: room,
      groupId: groupDoc.id,
    });

  for (const uid of [groupDoc.Female[female].uid, groupDoc.Male[male].uid]) {
    const profileSnap = await db.collection("profiles").doc(uid).get();
    const groups = profileSnap.data().groups || [];

    for (let i = 0; i < groups.length; i++) {
      if (groups[i].id === groupDoc.id) groups[i].matched = true;
    }

    await db.collection("profiles").doc(uid).update({ groups });

    const len = groups.length;
    const sex = uid === groupDoc.Female[female].uid ? "Female" : "Male";

    await db
      .collection("groupcount")
      .doc((len - 1).toString())
      .collection("users")
      .add({ uid, sex });

    const oldPool = await db
      .collection("groupcount")
      .doc(len.toString())
      .collection("users")
      .where("uid", "==", uid)
      .get();

    oldPool.forEach((doc) => doc.ref.delete());
  }
};

const runMatchingLoop = async (result, groupDoc) => {
  const n = groupDoc.size || GROUP_SIZE;
  for (let i = 0; i < n; i++) {
    await updateMatches(i, result[i], groupDoc);
  }
  await db.collection("groups").doc(groupDoc.id).delete();
  return true;
};

app.post("/algo", async (req, res) => {
  const requestUid = getRequestUid(req);
  if (!requestUid) {
    return sendJson(res, { error: "uid required" }, 400);
  }

  const groupDoc = req.body.group;
  if (!groupDoc?.id) {
    return sendJson(res, { error: "group required" }, 400);
  }

  const n = groupDoc.size || GROUP_SIZE;

  sendJson(res, { success: true, status: "matching" });

  try {
    const matrix = buildPreferenceMatrix(groupDoc, n);
    const result = stableSelection(matrix, n);
    await runMatchingLoop(result, groupDoc);
    console.log("Matching complete for group", groupDoc.id);
  } catch (err) {
    console.error("Matching failed:", err.message);
  }
});

io.on("connection", (socket) => {
  socket.on("send_message", (receivedMessage) => {
    const arr = [
      {
        message: receivedMessage.message,
        senderUid: receivedMessage.senderUid,
        timestamp: receivedMessage.timestamp,
      },
      ...receivedMessage.array,
    ];

    io.to(receivedMessage.roomId).emit("svMessage", {
      senderUid: receivedMessage.senderUid,
      message: receivedMessage.message,
      timestamp: receivedMessage.timestamp,
      array: arr,
    });

    db.collection("rooms")
      .doc(receivedMessage.roomId)
      .collection("messages")
      .add({
        message: receivedMessage.message,
        timestamp: receivedMessage.timestamp,
        senderUid: receivedMessage.senderUid,
      });
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
