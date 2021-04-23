import { useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Page0 from "./page0";
import Page1 from "./page1";
import Page2 from "./page2";

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
    sex: ""
  });

  function next() {
    setStep(step + 1);
  }

  function prev() {
    setStep(step - 1);
  }

  function sub() {
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
        return <Page2 changeDir = {changeDir} var = {formVar} prev={prev} data={data} sub={sub} change={onChange} />;

      default:
        return <Page0 changeDir = {changeDir} var = {formVar} next={next} data={data} change={onChange} />;
    }
  }

  const formVar = {
    initial:  {translateX: (direction===1) ? "-40%" : "40%" , opacity: 0},
    enter: {translateX: "0%", opacity:1, transition: {
      ease: [0.43, 0.13, 0.23, 0.96],
      duration: 0.8
    }},
    exit: {translateX: (direction===1) ? "40%" : "-40%", opacity:0, transition: {
      ease: [0.43, 0.13, 0.23, 0.96],
      duration: 0.8
    }}
  }
  console.log("Rendered");
  return content(formVar);
}
