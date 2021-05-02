// server/index.js

const express = require('express');
const app = express();
const cors = require("cors");

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
    cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
    }
  });

app.use(cors());

//Initialisation of database

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyAQCDcYoahVFxjgnWkx8dUtECWH7EJqeCE",
  authDomain: "chattrial-7c3c5.firebaseapp.com",
  projectId: "chattrial-7c3c5"
});

var db = firebase.firestore();

//Send messages on request from db
app.get("/rooms/:room",(req,res) => {
  let arr_data = [];

  const roomsRef = db.collection('rooms').doc(req.params.room).collection('messages');
  roomsRef.orderBy('timestamp', 'desc').get()
    .then((querySnapshot)=> {
      querySnapshot.forEach((doc)=>{
        arr_data = [...arr_data, doc.data()];
      });
      res.send(arr_data);
    })
})

//Send URL of Image after uploading to file storage

//Send the ID

const {v4, v1} = require("uuid");

app.get('/getId',(req,res) => {
  db.collection("ID").add({
    id: v4()
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});
;
})

io.on('connection', (socket) => {
    // console.log(socket);
    console.log('a user connected');

    socket.on("hi", ()=>{
      console.log("baby");
    })

    socket.on("send_message", (message)=> {
      const date = new Date();
      const now = Date.now();
      console.log(now);
      io.to(message.room).emit("retrieve_message_from_sv", {u_id: message.id, text: message.text, date: date } );
      db.collection('rooms').doc(message.room)
        .collection('messages').add({u_id: message.id, text: message.text, date: date, id: v1(), timestamp: now });
    })

    socket.on("joinRoom", (room) => {
      console.log(room);
      socket.join(room);
      
      const roomsRef = db.collection('rooms').doc(room);

      roomsRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            roomsRef.onSnapshot((doc) => {
              // do stuff with the data
              return;
            });
          } else {
            roomsRef.set({room: room}) // create the document
          }
      });

      console.log("Someone joined the room");
    })
});

server.listen(4000, () => {
  console.log('Server listening on *:4000');
});