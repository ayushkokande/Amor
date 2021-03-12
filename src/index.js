import React from 'react';
import ReactDOM from 'react-dom';

import firebase from "firebase/app";
import "firebase/auth";

import {Provider} from "react-redux";
import store from "./store/store";

import App from './App';
import reportWebVitals from './reportWebVitals';

const firebaseConfig = {
  apiKey: "AIzaSyC8Z4xH29qp18AmhTfngXAeoMb26zjqwqw",
  authDomain: "amor-fa924.firebaseapp.com",
  projectId: "amor-fa924",
  storageBucket: "amor-fa924.appspot.com",
  messagingSenderId: "1068173000356",
  appId: "1:1068173000356:web:28cfb37259a993b323b031",
  measurementId: "G-XDLGYYB117"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <Provider store = {store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
