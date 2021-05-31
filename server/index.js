// server/index.js

const stableSelection = require("./algo");

// const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const app = express();
const cors = require("cors");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const port = process.env.PORT;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// app.use('/api', createProxyMiddleware({ target: 'http://www.example.org', changeOrigin: true }));
app.set("port", port);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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

let uid;
let sendSex;
let otherSex;
const { v4, v1 } = require("uuid");
const { response } = require("express");

app.post("/giveID", (req, res) => {
  uid = req.body.id;
  // console.log("S", uid);
  res.send({ success: true });
});

const addMembers = async (count, newGroup, listUID, SEX) => {
  // console.log("DSSDSDSD", SEX);
  console.log(uid);
  let newresponse = await db
    .collection("groupcount")
    .doc("0")
    .collection("users")
    .where("sex", "==", SEX)
    .get();

  let arr = [];
  newresponse.forEach((doc) => {
    arr.push({ data: doc.data(), id: doc.id });
  });

  let newArr = [];
  let i = 0;
  let j = 0;

  for (i = 0; j < count && i < arr.length; i++) {
    if (uid !== arr[i].data.uid) {
      let resp = await db.collection("profiles").doc(arr[i].data.uid).get();
      newArr.push({ ...resp.data(), uid: arr[i].data.uid });
      listUID.push({ uid: arr[i].data.uid, sex: SEX });
      j++;
    }
  }

  newGroup[SEX] = [...newGroup[SEX], ...newArr];
  // console.log("0HERe", newGroup[SEX], count);

  if (newGroup[SEX].length === 6) {
    // console.log("count");
    return newGroup;
  }

  newresponse = await db
    .collection("groupcount")
    .doc("1")
    .collection("users")
    .where("sex", "==", SEX)
    .get();

  arr = [];
  newresponse.forEach((doc) => {
    // console.log("Response: ", doc.data());
    arr.push({ data: doc.data(), id: doc.id });
  });

  i = 0;
  j = 0;
  newArr = [];

  for (i = 0; j < 6 - newGroup[SEX].length && i < arr.length; i++) {
    if (uid !== arr[i].data.uid) {
      let resp = await db.collection("profiles").doc(arr[i].data.uid).get();
      newArr.push({ ...resp.data(), uid: arr[i].data.uid });
      listUID.push({ uid: arr[i].data.uid, sex: SEX });
      j++;
    }
  }

  newGroup[SEX] = [...newGroup[SEX], ...newArr];
  // console.log("1heeeeRe", newGroup[SEX]);
  if (newGroup[SEX].length === 6) return newGroup;

  newresponse = await db
    .collection("groupcount")
    .doc("2")
    .collection("users")
    .where("sex", "==", SEX)
    .get();

  arr = [];
  newresponse.forEach((doc) => {
    arr.push({ data: doc.data(), id: doc.id });
  });

  i = 0;
  j = 0;
  newArr = [];

  for (i = 0; j < 6 - newGroup[SEX].length && i < arr.length; i++) {
    if (uid !== arr[i].data.uid) {
      let resp = await db.collection("profiles").doc(arr[i].data.uid).get();
      newArr.push({ ...resp.data(), uid: arr[i].data.uid });
      listUID.push({ uid: arr[i].data.uid, sex: SEX });
      j++;
    }
  }

  newGroup[SEX] = [...newGroup[SEX], ...newArr];
  if (newGroup[SEX].length === 6) return newGroup;
  console.log(newGroup[SEX]);

  return null;
};

const group = async () => {
  try {
    let Ref = db.collection("profiles").doc(uid);
    let response = await Ref.get();
    // console.log(response.data().sex);
    let groupArr = [];
    // console.log(response.data());
    let gender = response.data().sex;
    let groupCreation = true;
    sendSex = gender;
    otherSex = sendSex === "Male" ? "Female" : "Male";
    console.log(sendSex, "     ", otherSex);

    let listUID = [];

    if (response.data().groups && response.data().groups.length !== 0) {
      groupArr = response.data().groups;
      console.log("if");

      // if (response.data().marked) return [];

      let cnt = 0; //count of number of groups that can be added to this user
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
        let ret_group = await db.collection("groups").doc(ret_group_id).get();
        return { newGroup: ret_group.data(), exists: true };
      }

      if (cnt === 0) return [];

      // let ret_group = await db.collection("groups").doc(groupArr[0].id).get();
      // return ret_group.data();
    }
    if (groupCreation) {
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

      listUID.push({ uid: uid, sex: gender });

      newGroup = await addMembers(5, newGroup, listUID, sendSex, "==");
      // console.log(newGroup);
      if (newGroup === null) {
        console.log("nullhai");
        return [];
      }
      console.log(sendSex, newGroup);

      newGroup = await addMembers(6, newGroup, listUID, otherSex, "!=");
      if (newGroup === null) {
        console.log("nullhai");
        return [];
      }
      console.log(otherSex, newGroup);

      db.collection("groups").doc(vid).set(newGroup);
      // listUID.forEach((id) => {
      //   db.collection("profiles")
      //     .doc(id)
      //     .update({ groups: [{ id: newGroup.id }] });
      // });
      return {
        newGroup: newGroup,
        listUID: listUID,
        groupId: vid,
        exists: false,
      };
    }
  } catch (err) {
    console.log(err);
  }
};

const updateAfterCreation = async (item, ret) => {
  let id = item.uid;
  let sex = item.sex;
  console.log(item);
  let idResponse = await db.collection("profiles").doc(id).get();
  let gr = idResponse.data().groups;
  // console.log(gr);
  let newGr = [];

  if (gr === undefined || gr.length === 0) {
    db.collection("profiles")
      .doc(id)
      .update({
        groups: [{ id: ret.groupId, matched: false, marked: false }],
      });
    db.collection("groupcount")
      .doc((1).toString())
      .collection("users")
      .add({ uid: id, sex: sex });
    db.collection("groupcount")
      .doc((0).toString())
      .collection("users")
      .where("uid", "==", id)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          doc.ref.delete();
        });
      });
  } else if (gr.length < 3) {
    for (let i = 0; i < gr.length; i++) {
      if (gr[i].matched !== true) newGr.push(gr[i]);
    }
    if (newGr.length + 1 !== gr.length) {
      db.collection("profiles")
        .doc(id)
        .update({
          groups: [
            ...newGr,
            { id: ret.groupId, matched: false, marked: false },
          ],
        });
      db.collection("groupcount")
        .doc((newGr.length + 1).toString())
        .collection("users")
        .add({ uid: id, sex: sex });
      db.collection("groupcount")
        .doc(newGr.length.toString())
        .collection("users")
        .where("uid", "==", id)
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            doc.ref.delete();
          });
        });
    }
  } else {
    let i = 0;
    for (i = 0; i < 3; i++) {
      if (gr[i].matched === true) {
        gr[i] = { id: ret.groupId, matched: false, marked: false };
        break;
      }
    }
    db.collection("profiles")
      .doc(id)
      .update({ groups: [...gr] });
  }
};

app.get("/getGroup", async (req, res) => {
  console.log("YAHA");
  let ret = await group();
  if (ret === undefined || ret.length === 0)
    res.send({ success: true, done: [], sex: sendSex });
  else if (ret.exists) {
    res.send({ success: true, done: ret.newGroup, sex: sendSex });
  } else {
    let done = ret.newGroup;
    res.send({ success: true, done, sex: sendSex });

    let listUID = ret.listUID;
    for (let i = 0; i < 12; i++) {
      updateAfterCreation(listUID[i], ret);
    }
  }
});

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
  // let newGroups = [];
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].id === group.id) groups[i].matched = true;
    // newGroups.push(groups[i]);
  }
  await db
    .collection("profiles")
    .doc(group.Female[female].uid)
    .update({ groups: groups });

  let len = groups.length;
  await db
    .collection("groupcount")
    .doc((len - 1).toString())
    .collection("users")
    .add({ uid: group.Female[female].uid, sex: "Female" });
  await db
    .collection("groupcount")
    .doc(len.toString())
    .collection("users")
    .where("uid", "==", group.Female[female].uid)
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        doc.ref.delete();
      });
    });

  response = await db.collection("profiles").doc(group.Male[male].uid).get();
  groups = response.data().groups;
  // newGroups = [];
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].id === group.id) groups[i].matched = true;
    // newGroups.push(groups[i]);
  }
  await db
    .collection("profiles")
    .doc(group.Male[male].uid)
    .update({ groups: groups });

  len = groups.length;
  await db
    .collection("groupcount")
    .doc((len - 1).toString())
    .collection("users")
    .add({ uid: group.Male[male].uid, sex: "Male" });
  await db
    .collection("groupcount")
    .doc(len.toString())
    .collection("users")
    .where("uid", "==", group.Male[male].uid)
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        doc.ref.delete();
      });
    });
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
  res.send("haa");
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

server.listen(port, () => {
  console.log("Server listening on *:4000");
});
