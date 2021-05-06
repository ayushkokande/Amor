import { useState } from "react";
import Page0 from "./page0";
import Page1 from "./page1";
import Page2 from "./page2";
import Page3 from "./page3";
import firebase from "firebase/app";
import { db, auth } from "../landingComp/firebase";
import store from "../../store/store";
import { Redirect } from "react-router";

export default function () {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [redirect, setRedirect] = useState(false);
  const [data, setData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    password: "",
    age: "",
    sex: "",
    bio: "",
    images: [],
    matches: [],
  });

  function next() {
    setStep(step + 1);
  }

  function prev() {
    setStep(step - 1);
  }

  function postDetails(uid) {
    setRedirect(true);
    db.collection("profiles").doc(uid).set({
      f_name: data.f_name,
      l_name: data.l_name,
      email: data.email,
      password: data.password,
      age: data.age,
      sex: data.sex,
      bio: data.bio,
      images: data.images,
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

  function sub() {
    // signIn();
    console.log(data);
    //Send data to database
  }

  function onChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function onImgUpload(url, idx) {
    let newImgArr = data.images;
    newImgArr[idx] = url;
    setData({ ...data, images: newImgArr });
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
            sub={sub}
            next={next}
            change={onChange}
            imgUpload={onImgUpload}
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
            redirect={redirect}
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
