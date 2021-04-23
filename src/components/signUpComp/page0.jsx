import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function (props) {
  const [show,setShow] = useState(true);
  let formVar = props.var;
  return (
    <>
    <div className="formContainer">
      <AnimatePresence exitBeforeEnter>
      {show && 
      <motion.div variants={formVar} initial="initial" animate="enter" exit="exit" className="Container">
        <div id="signUpForm">
      <h2 className="form-title">Get Started</h2>
      <div className="formUnd"><svg><line x1="0" y1="0" x2="1000" y2="0" style={{stroke:"#000", strokeWidth:2}} /></svg></div>
      <div className="form-group">
        <label for="email">
          <i className="zmdi zmdi-email"></i>
        </label>
        <input
          type="email"
          className="inpsText"
          placeholder="Your email"
          name="email"
          onChange={props.change}
          value={props.data.email}
        ></input>
      </div>
      <div className="form-group em_pw">
        <label for="pw">
          <i class="zmdi zmdi-lock-outline"></i>
        </label>
        <input
          type="password"
          name="password"
          className=" text-muted inpsText"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Password"
          onChange={props.change}
        ></input>
      </div>
      <div className="form-group em_pw">
        <label for="pw1">
          <i class="zmdi zmdi-lock"></i>
        </label>
        <input
          type="password"
          className=" text-muted inpsText"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter password again"
          onChange={props.change}
        ></input>
      </div>
      <div class="form-button">
        <button className = "but" onClick={()=>{props.changeDir(1); setTimeout(()=>setShow(false),1); setTimeout(()=>props.next(),700);}}>
          Next <i style={{ margin: 0 }} class="zmdi zmdi-arrow-right"></i>
        </button>
      </div>
      </div>
      </motion.div>}
      </AnimatePresence>
    </div>
    </>
  );
}
