// server/index.js

const stableSelection = require("./algo");

// const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const app = express();
const cors = require("cors");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// app.use('/api', createProxyMiddleware({ target: 'http://www.example.org', changeOrigin: true }));
app.use(cors());
app.use(express.json());

//Initialisation of database

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyD9GFN-FQyikSn34cpS_HtPQKv5qN7L0tE",
  authDomain: "dating-website-c4a8e.firebaseapp.com",
  projectId: "dating-website-c4a8e",
  storageBucket: "dating-website-c4a8e.appspot.com",
  messagingSenderId: "158391929758",
  appId: "1:158391929758:web:a4b4e3b7be16d0b6a7a48f",
  measurementId: "G-9QHBHFS8ZJ",
});

var db = firebase.firestore();

// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://dating-website-c4a8e.firebaseio.com",
// });
// var db = admin.database();
// console.log(db);
// var ref = db.ref("restricted_access/secret_document");
// ref.on(
//   "value",
//   function (snapshot) {
//     console.log(snapshot.val());
//   },
//   function (errorObject) {
//     console.log("The read failed: " + errorObject.code);
//   }
// );

//Send messages on request from db
app.get("/rooms/:room", (req, res) => {
  let arr_data = [];

  const roomsRef = db
    .collection("rooms")
    .doc(req.params.room)
    .collection("messages");
  roomsRef
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        arr_data = [...arr_data, doc.data()];
      });
      // console.log(arr_data);
      res.send({ messages: arr_data });
    });
});

//Send URL of Image after uploading to file storage

//Send the ID

// const { v4, v1 } = require("uuid");

// app.get("/getId", (req, res) => {
//   db.collection("ID")
//     .add({
//       id: v4(),
//     })
//     .then((docRef) => {
//       console.log("Document written with ID: ", docRef.id);
//     })
//     .catch((error) => {
//       console.error("Error adding document: ", error);
//     });
// });

// Group Connection

let uid;
let sendSex;
let otherSex;
const { v4, v1 } = require("uuid");

app.post("/giveID", (req, res) => {
  uid = req.body.id;
  console.log("S", uid);
  res.send({ success: true });
});

const addMembers = (response, count, newGroup, listUID, SEX) => {
  let size = response.size;
  let arr = [];
  response.forEach((doc) => {
    // console.log(doc.id, doc.data().f_name);
    arr.push({ data: doc.data(), id: doc.id });
  });
  if (arr.length <= 0) return newGroup;
  // console.log(SEX, ...newGroup[SEX]);
  // console.log(arr[0].f_name);

  let newArr = [];
  let i = 0;
  let j = 0;

  // console.log(sendSex, typeof newGroup[SEX.toString()]);

  for (i = 0; j < count && i < size; i++) {
    if (uid !== arr[i].id) {
      newArr.push({ ...arr[i].data, uid: arr[i].id });
      listUID.push(arr[i].id);
      j++;
    }
  }

  // while (i < count && i < size) {
  //   // let idx = Math.floor(Math.random() * size) + 0;

  //   if (uid !== arr[i].id) {
  //     newArr.push({ ...arr[i].data, uid: arr[i - 1].id });
  //     listUID.push(arr[i - 1].id);
  //   }
  //   i++;
  //   // newGroup[SEX].push(arr[idx]);
  // }
  // console.log(size, newArr);
  newGroup[SEX] = [...newGroup[SEX], ...newArr];
  // console.log("now", newGroup[sendSex]);
  return newGroup;
};

const group = async () => {
  try {
    let Ref = db.collection("profiles").doc(uid);
    let response = await Ref.get();
    // console.log(response.data().sex);
    let groupArr = [];
    let gender = response.data().sex;
    sendSex = gender;
    otherSex = sendSex === "Male" ? "Female" : "Male";

    let listUID = [];

    // if (response.data().groups) {
    //   console.log("Exists");
    //   if (response.data().marked) return [];
    //   let ret_group = await db
    //     .collection("groups")
    //     .doc(response.data().groups[0].id)
    //     .get();
    //   return ret_group.data();
    // } else {
    //   console.log("Not exist");
    //   return 3;
    // }

    if (response.data().groups && response.data().groups.length !== 0) {
      groupArr = response.data().groups;
      console.log("if");

      if (response.data().marked) return [];

      // let i = 0;
      // for (i = 0; i < group.length; i++) {
      //   console.log(groupArr[i].)
      //   if (groupArr[i].marked === false) {
      //     console.log("D", i);
      //     break;
      //   }
      // }
      // if (i === group.length) {
      //   console.log("i equal");
      //   return [];
      // }

      let ret_group = await db.collection("groups").doc(groupArr[0].id).get();
      return ret_group.data();
    } else {
      // Randomly pick 6 opposite gendered users and make and add a group
      let newRef = db.collection("profiles");
      let vid = v4();
      let newGroup = {
        id: vid,
        Male: [],
        Female: [],
        m_pref: ["", "", "", "", "", ""],
        f_pref: ["", "", "", "", "", ""],
        cnt: 0,
      };
      if (sendSex === "Male")
        newGroup.Male.push({ ...response.data(), uid: uid });
      else newGroup.Female.push({ ...response.data(), uid: uid });

      listUID.push(uid);

      let newResponse = await newRef.where("sex", "==", gender).get();
      newGroup = addMembers(newResponse, 5, newGroup, listUID, sendSex);

      let newOtherResponse = await newRef.where("sex", "!=", gender).get();
      newGroup = addMembers(newOtherResponse, 6, newGroup, listUID, otherSex);

      // console.log(listUID);
      // let wow = db.collection("profiles").doc(listUID[0]);
      // let wres = await wow.get();
      // if (wres.data().marked) console.log(wres.data());
      // else console.log("HUHAH");
      db.collection("groups").doc(vid).set(newGroup);
      listUID.forEach((id) => {
        db.collection("profiles")
          .doc(id)
          .update({ groups: [{ id: newGroup.id }] });
      });
      return newGroup;
    }
  } catch (err) {
    console.log(err);
  }
};

app.get("/getGroup", async (req, res) => {
  console.log("YAHA");
  // let s = await no();
  // console.log(s);
  let done = await group();
  // res.send({ message: done });
  // console.log(done);
  res.send({ success: true, done, sex: sendSex });
});

//

const updateMatches = async (woman, match, group) => {
  let female = woman;
  let male = match;

  let u1 = group.Female[female].uid.toString();
  let u2 = group.Male[male].uid.toString();
  let room = u1.localeCompare(u2) < 0 ? u1 + "@" + u2 : u2 + "@" + u1;

  await db
    .collection("rooms")
    .doc(room)
    .collection("messages")
    .add({ message: "Collection Created!", timestamp: Date.now() });

  await db
    .collection("profiles")
    .doc(group.Female[female].uid)
    .collection("matches")
    .doc(v4())
    .set({ uid: group.Male[male].uid, roomId: room });
  await db
    .collection("profiles")
    .doc(group.Male[male].uid)
    .collection("matches")
    .doc(v4())
    .set({ uid: group.Female[female].uid, roomId: room });

  let response = await db
    .collection("profiles")
    .doc(group.Female[female].uid)
    .get();
  let groups = response.data().groups;
  let newGroups = [];
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].id === group.id) continue;
    newGroups.push(groups[i]);
  }
  await db
    .collection("profiles")
    .doc(group.Female[female].uid)
    .update({ groups: newGroups });

  response = await db.collection("profiles").doc(group.Male[male].uid).get();
  groups = response.data().groups;
  newGroups = [];
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].id === group.id) continue;
    newGroups.push(groups[i]);
  }
  await db
    .collection("profiles")
    .doc(group.Male[male].uid)
    .update({ groups: newGroups });
};

const LOOP = async (result, group) => {
  for (let i = 0; i < 6; i++) {
    let d = await updateMatches(i, result[i], group);
  }
  console.log("Matches added");
  await db.collection("groups").doc(group.id).delete();
  return true;
};

app.post("/algo", (req, res) => {
  res.send(`<h1>Booty ${Date.now()}</h1>`);
  console.log("After Res");
  let group = req.body.group;
  let m_pref = [];
  for (let i = 0; i < 6; i++) {
    let arr = [];
    for (let j = 0; j < 6; j++) {
      arr.push(parseInt(group.m_pref[i][j]) + 6);
    }
    m_pref.push(arr);
  }

  let f_pref = [];
  for (let i = 0; i < 6; i++) {
    let arr = [];
    for (let j = 0; j < 6; j++) {
      arr.push(parseInt(group.f_pref[i][j]));
    }
    f_pref.push(arr);
  }

  let matrix = [...m_pref, ...f_pref];
  let result = stableSelection(matrix);
  console.log(result);
  // for (let i = 0; i < 6; i++) {
  //   await updateMatches(i, result[i], group);
  // }
  LOOP(result, group);
  console.log("Added all matches");
});

// const admin = require("firebase-admin");
// const fieldValue = admin.firestore.FieldValue;

// app.get("/deleteALL", async (req, res) => {
//   let resp = await db.collection("profiles").get();
//   resp.forEach((doc) => {
//     console.log(doc.ref);
//     doc.ref.update({ groups: fieldValue.delete() });
//   });
//   res.send(`<h1>${Date.now()}</h1>`);
// });
// const func = () => {
//   console.log("Hey");
// };

// const no = async () => {
//   try {
//     let newRef = db.collection("profiles");
//     let newResponse = await newRef.get();
//     console.log(new Date(), newResponse.size);
//     return 33;
//   } catch (err) {
//     console.log(err);
//   }
// };

// Socket Connection

io.on("connection", (socket) => {
  // console.log(socket);
  // console.log("a user connected");

  socket.on("hi", () => {
    console.log("baby");
  });

  socket.on("send_message", (receivedMessage) => {
    // const date = new Date();
    // const now = Date.now();
    // console.log(now);
    // console.log(receivedMessage.roomId);
    let { message, roomId, timestamp } = receivedMessage;
    let arr = [
      { message, senderUid: receivedMessage.senderUid, timestamp },
      ...receivedMessage.array,
    ];
    console.log("SSSSS", arr);

    // io.to(receivedMessage.roomId

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

    // db.collection("")
  });

  socket.on("joinRoom", (room) => {
    // console.log(room);
    socket.join(room);

    const roomsRef = db.collection("rooms").doc(room);

    // roomsRef.get().then((docSnapshot) => {
    //   if (docSnapshot.exists) {
    //     roomsRef.onSnapshot((doc) => {
    //       // do stuff with the data
    //       return;
    //     });
    //   } else {
    //     roomsRef.set({ room: room }); // create the document
    //   }
    // });
    // io.to(room).emit("alert", { message: "HI" });
    console.log("Someone joined the room", room);
  });
});

server.listen(4000, () => {
  console.log("Server listening on *:4000");
});
