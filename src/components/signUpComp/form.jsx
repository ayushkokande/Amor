import { useState } from "react";
import { useSelector } from "react-redux";
import Page0 from "./page0";
import Page1 from "./page1";

export default function () {
  const [step, setStep] = useState(0);

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

  function content() {
    switch (step) {
      case 0:
        return <Page0 next={next} data={data} change={onChange} />;

      case 1:
        return <Page1 prev={prev} data={data} sub={sub} change={onChange} />;

      default:
        return <Page0 next={next} data={data} change={onChange} />;
    }
  }

  return (
    <div className="formContainer">
      <div className="Container">
        <div id="signUpForm">{content()}</div>
      </div>
    </div>
  );
}
