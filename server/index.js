// server/index.js

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
      res.send(arr_data);
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
const { v4, v1 } = require("uuid");

app.post("/giveID", (req, res) => {
  console.log(req.body);
  uid = req.body.id;
  res.send({ success: true });
});

const addMembers = (response, count, newGroup, listUID) => {
  let size = response.size;
  let arr = [];
  response.forEach((doc) => {
    // console.log(doc.id, doc.data().f_name);
    arr.push({ data: doc.data(), id: doc.id });
  });
  if (arr.length <= 0) return newGroup;
  let SEX = arr[0].data.sex;
  // console.log(newGroup[SEX]);
  // console.log(arr[0].f_name);

  let newArr = [];
  let i = 1;
  let j = 0;
  while (i <= count && i <= size) {
    // let idx = Math.floor(Math.random() * size) + 0;
    i++;
    newArr.push({ ...arr[j].data, uid: arr[j].id });
    listUID.push(arr[j].id);
    j++;
    // newGroup[SEX].push(arr[idx]);
  }
  // console.log(size, newArr);
  newGroup[SEX] = newArr;
  return newGroup;
};

const group = async () => {
  try {
    let Ref = db.collection("profiles").doc(uid);
    let response = await Ref.get();
    console.log(response.data().sex);
    let groupArr = [];
    let gender = response.data().sex;
    sendSex = gender;

    let listUID = [];

    if (response.data().groups) {
      groupArr = response.data().groups;
      console.log("if");
      let i = 0;
      for (i = 0; i < group.length; i++) {
        if (!groupArr[i].marked) break;
      }
      return groupArr[i];
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
      if (sendSex === "Male") newGroup.Male.push(response.data());
      else newGroup.Female.push(response.data());

      let newResponse = await newRef.where("sex", "==", gender).get();
      newGroup = addMembers(newResponse, 5, newGroup, listUID);

      let newOtherResponse = await newRef.where("sex", "!=", gender).get();
      newGroup = addMembers(newOtherResponse, 6, newGroup, listUID);

      console.log(listUID);
      // let wow = db.collection("profiles").doc(listUID[0]);
      // let wres = await wow.get();
      // if (wres.data().marked) console.log(wres.data());
      // else console.log("HUHAH");
      db.collection("groups").doc(vid).set(newGroup);
      listUID.forEach((id) => {
        db.collection("profiles")
          .doc(id)
          .update({ groups: [newGroup] });
      });
      return newGroup;
    }
  } catch (err) {
    console.log(err);
  }
};

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

app.get("/getGroup", async (req, res) => {
  console.log("YAHA");
  // let s = await no();
  // console.log(s);
  let done = await group();
  // console.log(done);
  res.send({ success: true, done, sex: sendSex });
});

// Socket Connection

io.on("connection", (socket) => {
  // console.log(socket);
  console.log("a user connected");

  socket.on("hi", () => {
    console.log("baby");
  });

  socket.on("send_message", (message) => {
    const date = new Date();
    const now = Date.now();
    console.log(now);
    io.to(message.room).emit("retrieve_message_from_sv", {
      u_id: message.id,
      text: message.text,
      date: date,
    });
    db.collection("rooms").doc(message.room).collection("messages").add({
      u_id: message.id,
      text: message.text,
      date: date,
      id: v1(),
      timestamp: now,
    });
  });

  socket.on("joinRoom", (room) => {
    console.log(room);
    socket.join(room);

    const roomsRef = db.collection("rooms").doc(room);

    roomsRef.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        roomsRef.onSnapshot((doc) => {
          // do stuff with the data
          return;
        });
      } else {
        roomsRef.set({ room: room }); // create the document
      }
    });

    console.log("Someone joined the room");
  });
});

server.listen(4000, () => {
  console.log("Server listening on *:4000");
});
