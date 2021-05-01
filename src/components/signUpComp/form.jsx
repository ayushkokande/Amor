import { useState } from "react";
import Page0 from "./page0";
import Page1 from "./page1";
import Page2 from "./page2";
import Page3 from "./page3";
import firebase from "firebase/app";
import "firebase/auth";

export default function () {
  const [step, setStep] = useState(0);
  const [direction,setDirection] = useState(1);

  const arr = [Page0, Page1];
  const [data, setData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    password: "",
    age: "",
    sex: "",
    bio: "",
    images: []
  });

  function signIn(){
    firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      // ..
    });
  }

  function next() {
    setStep(step + 1);
  }

  function prev() {
    setStep(step - 1);
  }

  function sub() {
    signIn();
    //Send data to database
  }

  function onChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function changeDir(val) {
    setDirection(val);
  }

  function content(formVar) {
    switch (step) {
      case 0:
        return <Page2 changeDir = {changeDir} var = {formVar} next={next} data={data} change={onChange} />;

      case 1:
        return <Page1 changeDir = {changeDir} var = {formVar} prev={prev} data={data} next={next} change={onChange} />;

      case 2:
        return <Page2 changeDir = {changeDir} var = {formVar} prev={prev} data={data} next={next} sub={sub} change={onChange} />;

      case 3:
        return <Page3 changeDir = {changeDir} var = {formVar} prev={prev} data={data} next={next} change={onChange} />;

      default:
        return <Page0 changeDir = {changeDir} var = {formVar} next={next} data={data} sub={sub} change={onChange} />;
    }
  }

  const formVar = {
    initial:  {left: (direction===1) ? "-40%" : "40%" , opacity: 0},
    enter: {left: "0%", opacity:1, transition: {
      ease: [0.43, 0.13, 0.23, 0.96],
      duration: 0.8
    }},
    exit: {left: (direction===1) ? "40%" : "-40%", opacity:0, transition: {
      ease: [0.43, 0.13, 0.23, 0.96],
      duration: 0.8
    }}
  }
  console.log("Rendered");
  return content(formVar);
}
