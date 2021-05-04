import { useState } from "react";
import Page0 from "./page0";
import Page1 from "./page1";
import Page2 from "./page2";
import Page3 from "./page3";
import firebase from "firebase/app";
import { db, auth } from "../landingComp/firebase";

export default function () {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [user, setUser] = useState(null);
  const arr = [Page0, Page1];
  const [data, setData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    password: "",
    age: "",
    sex: "",
    bio: "",
    images: [],
  });

  // function signIn(){
  //   firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
  //   .then((userCredential) => {
  //     // Signed in
  //     var user = userCredential.user;
  //     // ...
  //   })
  //   .catch((error) => {
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     console.log(errorMessage);
  //     // ..
  //   });
  // }

  function next() {
    setStep(step + 1);
  }

  function prev() {
    setStep(step - 1);
  }

  function postDetails(uid) {
    db.collection("profiles").doc(uid).set({
      f_name: data.f_name,
      l_name: data.l_name,
      email: data.email,
      password: data.password,
      age: data.age,
      sex: data.sex,
      bio: data.bio,
      //images remain
    });

    console.log("SUCCESSSFULLY DONE");
  }

  function signup(event) {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((response) => {
        postDetails(response.user.uid);
      })
      .catch((error) => alert(error.message));
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
        return (
          <Page0
            changeDir={changeDir}
            var={formVar}
            next={next}
            data={data}
            change={onChange}
          />
        );

      case 1:
        return (
          <Page1
            changeDir={changeDir}
            var={formVar}
            prev={prev}
            data={data}
            next={next}
            change={onChange}
          />
        );

      case 2:
        return (
          <Page2
            changeDir={changeDir}
            var={formVar}
            prev={prev}
            data={data}
            next={next}
            change={onChange}
          />
        );

      case 3:
        return (
          <Page3
            changeDir={changeDir}
            var={formVar}
            prev={prev}
            data={data}
            signup={signup}
            change={onChange}
          />
        );
      default:
        return (
          <Page0
            changeDir={changeDir}
            var={formVar}
            next={next}
            data={data}
            change={onChange}
          />
        );
    }
  }

  const formVar = {
    initial: { left: direction === 1 ? "-40%" : "40%", opacity: 0 },
    enter: {
      left: "0%",
      opacity: 1,
      transition: {
        ease: [0.43, 0.13, 0.23, 0.96],
        duration: 0.8,
      },
    },
    exit: {
      left: direction === 1 ? "40%" : "-40%",
      opacity: 0,
      transition: {
        ease: [0.43, 0.13, 0.23, 0.96],
        duration: 0.8,
      },
    },
  };
  // console.log("Rendered");
  return content(formVar);
}
