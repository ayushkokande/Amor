import { useTransition, animated, useSpring, interpolate } from "react-spring";
import { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import store from "../../store/store";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { db, auth } from "./firebase";
import { Input, Button } from "@material-ui/core";

import Navbar from "./navbar";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function () {
  const [linkChange, setChange] = useState(false);
  {
    /* for modal*/
  }
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
        if (authUser.displayName) {
          //don't update username
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => {
      //perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  let id = useSelector((state) => state.link.link);

  const animFirst = useSpring({
    config: { friction: 30 },
    from: { t: 0 },
    to: { t: 200000 },
  });

  const animSec = useSpring({
    config: { friction: 30 },
    from: { t: 0 },
    to: { t: 200000 },
  });

  const abTransVariants1 = {
    initial: { translateX: "100%" },
    exit: {
      translateX: "0%",
      transition: {
        delay: 0.1,
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  const abTransVariants2 = {
    initial: { translateX: "-100%" },
    exit: {
      translateX: "0%",
      transition: {
        delay: 0.1,
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  function func(id) {
    store.dispatch({ type: id });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Changed the link");
        resolve({ msg: "Changed link" });
        reject({ msg: "Couldnt change link" });
      }, 100);
    });
  }
  const signup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
  };
  function onClick(e) {
    // func(e.target.id).then(setChange(true));
  }

  const transBG = useSelector((state) => state.link);

  const boxVar = {
    initial: { translateX: "-50%", scale: 0.7, opacity: 0 },
    enter: {
      translateX: "-50%",
      scale: 1,
      opacity: 1,
      transition: { delay: 0.8, duration: 1, type: "spring" },
    },
  };

  return !linkChange ? (
    <>
      <section
        style={{ backgroundImage: `url(/images/royal_rice.png)` }}
        className="l-sec"
        id="secondSection"
      >
        <Navbar />
        {/* Code for Modal*/}
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signup}>
                SIGN UP
              </Button>
            </form>
          </div>
        </Modal>

        <motion.div
          style={{ backgroundImage: `url(/images/${transBG.img})` }}
          variants={abTransVariants1}
          initial="initial"
          exit="exit"
          className="Trans1"
        ></motion.div>
        <motion.div
          style={{ backgroundImage: `url(/images/${transBG.img})` }}
          variants={abTransVariants2}
          initial="initial"
          exit="exit"
          className="Trans2"
        ></motion.div>
        <motion.div
          className="signInBox"
          variants={boxVar}
          initial="initial"
          animate="enter"
        >
          <div className="imgContainer">
            <img
              id="loginImg"
              src={process.env.PUBLIC_URL + "/images/secSection2.jpg"}
              alt="LoginPage Image"
            />
          </div>
          {user ? (
            <Button type="submit" onClick={() => auth.signOut()}>
              Sign Out{" "}
            </Button>
          ) : (
            <div className="signInContent">
              <form method="POST" className="signInForm">
                <h3 className="form-title">Sign In</h3>
                <div className="form-group em_pw">
                  <label for="email">
                    <i className="zmdi zmdi-email"></i>
                  </label>
                  <input
                    type="email"
                    className="inpText"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
                <div className="form-group em_pw">
                  <i className="zmdi zmdi-lock"></i>
                  <input
                    type="password"
                    className=" text-muted inpText"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
                <div class="form-group check-form">
                  <input type="checkbox" />
                  <label>Remember my password</label>
                </div>
                <div class="form-group form-button">
                  <input
                    onClick={signIn}
                    type="submit"
                    class="form-submit"
                    value="Login"
                  />
                </div>
                <div className="form-group">
                  <p>
                    Don't have an account?{" "}
                    {/* <p onClick={onClick} id="signUp"> */}
                    <p onClick={() => setOpen(true)}>Sign up.</p>
                  </p>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </section>
    </>
  ) : (
    <>
      <section className="l-sec" id="secondSection">
        <Navbar />
        <motion.div
          style={{ backgroundImage: `url(/images/${transBG.img})` }}
          variants={abTransVariants1}
          initial="initial"
          exit="exit"
          className="Trans1"
        ></motion.div>
        <motion.div
          style={{ backgroundImage: `url(/images/${transBG.img})` }}
          variants={abTransVariants2}
          initial="initial"
          exit="exit"
          className="Trans2"
        ></motion.div>
        <div className="signInBox">
          <div className="imgContainer">
            <img
              id="loginImg"
              src={process.env.PUBLIC_URL + "/images/secSection2.jpg"}
              alt="LoginPage Image"
            />
          </div>
          <div className="signInContent">
            <form method="POST" className="signInForm">
              <h3 className="form-title">Sign In</h3>
              <div className="form-group em_pw">
                <label for="email">
                  <i className="zmdi zmdi-email"></i>
                </label>
                <input
                  type="email"
                  className="inpText"
                  placeholder="Enter email"
                ></input>
              </div>
              <div className="form-group em_pw">
                <i className="zmdi zmdi-lock"></i>
                <input
                  type="password"
                  className=" text-muted inpText"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Password"
                ></input>
              </div>
              <div class="form-group check-form">
                <input type="checkbox" />
                <label>Remember my password</label>
              </div>
              <div class="form-group form-button">
                <input type="submit" class="form-submit" value="Login" />
              </div>
              <div className="form-group">
                <p>
                  Don't have an account?{" "}
                  <p onClick={onClick} id="signUp">
                    Sign up.
                  </p>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Redirect to={`/${id}`} />
    </>
  );
}
