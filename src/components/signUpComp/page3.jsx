import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Redirect } from "react-router-dom";

export default function (props) {
  const [show, setShow] = useState(true);
  // console.log(props.data);

  let formVar = props.var;
  return !props.redirect ? (
    <>
      <div
        className="formContainer"
        style={{ backgroundImage: `url(/images/noisy.png)` }}
      >
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
                <h2 className="form-title">About you</h2>
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
                  <label for="fname">Bio:</label>
                  <textarea
                    type="text"
                    name="bio"
                    id="bio"
                    className="inpsText"
                    placeholder="Let people know more about you!"
                    onChange={props.change}
                    value={props.data.bio}
                  ></textarea>
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
                    style={{ display: "flex" }}
                    onClick={props.signup}
                  >
                    Submit{" "}
                    <i
                      style={{ fontSize: "23px", margin: 0 }}
                      class="zmdi zmdi-caret-right"
                    ></i>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  ) : (
    <>
      <div
        className="formContainer"
        style={{ backgroundImage: `url(/images/noisy.png)` }}
      >
        <AnimatePresence exitBeforeEnter>
          {show && (
            <motion.div
              variants={formVar}
              initial="initial"
              animate="enter"
              // exit="exit"
              className="Container"
            >
              <div id="signUpForm">
                <h2 className="form-title">About you</h2>
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
                  <label for="fname">Bio:</label>
                  <textarea
                    type="text"
                    name="bio"
                    id="bio"
                    className="inpsText"
                    placeholder="Let people know more about you!"
                    onChange={props.change}
                    value={props.data.bio}
                  ></textarea>
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
                    style={{ display: "flex" }}
                    onClick={props.signup}
                  >
                    Submit{" "}
                    <i
                      style={{ fontSize: "23px", margin: 0 }}
                      class="zmdi zmdi-caret-right"
                    ></i>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Redirect to="/" />
    </>
  );
}
