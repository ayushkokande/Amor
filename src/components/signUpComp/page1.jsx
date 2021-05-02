import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function (props) {
  const [show, setShow] = useState(true);
  console.log(props.data);

  let formVar = props.var;
  return (
    <>
      <div className="formContainer">
        <AnimatePresence exitBeforeEnter>
          {show && (
            <motion.div
              variants={formVar}
              initial="initial"
              animate="enter"
              exit="exit"
              className="Container"
            >
              <div id="signUpForm">
                <h2 className="form-title">Details</h2>
                <div className="formUnd">
                  <svg>
                    <line
                      x1="0"
                      y1="0"
                      x2="1000"
                      y2="0"
                      style={{ stroke: "#000", strokeWidth: 2 }}
                    />
                  </svg>
                </div>
                <div className="form-group">
                  <label for="fname">First Name:</label>
                  <input
                    type="text"
                    name="f_name"
                    className="inpsText"
                    placeholder="First Name"
                    onChange={props.change}
                    value={props.data.f_name}
                  ></input>
                </div>
                <div className="form-group">
                  <label for="lname">Last Name:</label>
                  <input
                    type="text"
                    name="l_name"
                    className="inpsText"
                    placeholder="Last Name"
                    onChange={props.change}
                    value={props.data.l_name}
                  ></input>
                </div>
                <div className="form-group">
                  <label for="age">Age:</label>
                  <input
                    type="text"
                    name="age"
                    className="inpsText"
                    placeholder="Age"
                    onChange={props.change}
                    value={props.data.age}
                  ></input>
                </div>
                <div className="form-group">
                  <label for="sex">Sex:</label>
                  <input
                    type="text"
                    name="sex"
                    className="inpsText"
                    placeholder="Sex"
                    onChange={props.change}
                    value={props.data.sex}
                  ></input>
                </div>
                <div class="form-button">
                  <button
                    className="but"
                    style={{ marginRight: "20px" }}
                    onClick={() => {
                      props.changeDir(-1);
                      setTimeout(() => setShow(false), 1);
                      setTimeout(() => props.prev(), 900);
                    }}
                  >
                    Back{" "}
                    <i style={{ margin: 0 }} class="zmdi zmdi-arrow-left"></i>
                  </button>
                  <button
                    className="but"
                    onClick={() => {
                      props.changeDir(1);
                      setTimeout(() => setShow(false), 1);
                      setTimeout(() => props.next(), 700);
                    }}
                  >
                    Next{" "}
                    <i style={{ margin: 0 }} class="zmdi zmdi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
