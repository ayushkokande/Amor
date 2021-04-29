import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD9GFN-FQyikSn34cpS_HtPQKv5qN7L0tE",
  authDomain: "dating-website-c4a8e.firebaseapp.com",
  projectId: "dating-website-c4a8e",
  storageBucket: "dating-website-c4a8e.appspot.com",
  messagingSenderId: "158391929758",
  appId: "1:158391929758:web:a4b4e3b7be16d0b6a7a48f",
  measurementId: "G-9QHBHFS8ZJ",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export { db, auth, storage };
