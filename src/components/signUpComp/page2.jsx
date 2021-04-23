import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function (props) {
  const [show,setShow] = useState(true);
  console.log(props.data);
  function click(e) {
    console.log(e);
  }
  let formVar = props.var;
  return (
    <>
    <div className="formContainer">
      <AnimatePresence exitBeforeEnter>
      {show &&
        <motion.div variants={formVar} initial="initial" animate="enter" exit="exit" className="Container">
        <div id="signUpForm">
      <h2 className="form-title">Details</h2>
      <div className="formUnd"><svg><line x1="0" y1="0" x2="1000" y2="0" style={{stroke:"#000", strokeWidth:2}} /></svg></div>
      <div className="formGroup">
        <p>
          Upload your images!
        </p>
        <div className="images">
            <div className="row p2">
                <label className="imgUp col-auto">
                    <span>+</span>
                    <input type="file" required/>
                </label>
                <label className="imgUp col-auto">
                    <span>+</span>
                    <input type="file" required/>
                </label>
                <label className="imgUp col-auto">
                    <span>+</span>
                    <input type="file" required/>
                </label>
            </div>
            <div className="row p2">
                <label className="imgUp col-auto">
                    <span>+</span>
                    <input type="file" required/>
                </label>
                <label className="imgUp col-auto">
                    <span>+</span>
                    <input type="file" required/>
                </label>
                <label className="imgUp col-auto">
                    <span>+</span>
                    <input type="file" required/>
                </label>
            </div>
            
        </div>
      </div>
      </div>
      </motion.div>}
      </AnimatePresence>
    </div>   
    </>
  );
}
