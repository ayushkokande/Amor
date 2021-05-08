import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import store from "../../store/store";
import { motion } from "framer-motion";

function Navbar(param) {
  const [linkChange, setChange] = useState(false);
  let id = useSelector((state) => state.link.link);

  // let name_class="navbar"+ param.class;
  const navVariants = {
    initial: { translateY: "-100%", opacity: 0 },
    enter: {
      translateY: "0%",
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
    exit: {
      translateY: "-10%",
      opacity: 0,
      transition: {
        duration: 0.5,
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
      }, 1);
    });
  }

  function onClick(e) {
    func(e.target.id).then(setChange(true));
  }

  let pos = param.fixed === "fixed" ? "fixed" : "relative";

  return !linkChange ? (
    <motion.nav
      variants={navVariants}
      initial="initial"
      animate="enter"
      className="navbar NAV"
      id="navbar"
    >
      <div className="container-fluid mx-5 pt-2 pb-2">
        <ul className="navbar-nav">
          <li className="nav-item">
            <p onClick={onClick} id="about" className="nav-link">
              about
            </p>
          </li>

          <p onClick={onClick} id="home" className="navbar-brand">
            amor
          </p>

          <li className="nav-item">
            <p onClick={onClick} id="login" className="nav-link">
              login
            </p>
          </li>
        </ul>
      </div>
    </motion.nav>
  ) : (
    <>
      <motion.nav
        variants={navVariants}
        initial="initial"
        animate="enter"
        className="navbar"
        id="navbar"
      >
        <div className="container-fluid mx-5 pt-2 pb-2">
          <ul className="navbar-nav">
            <li className="nav-item">
              <p onClick={onClick} id="about" className="nav-link">
                about
              </p>
            </li>

            <p onClick={onClick} id="home" className="navbar-brand">
              amor
            </p>

            <li className="nav-item">
              <p onClick={onClick} id="login" className="nav-link">
                login
              </p>
            </li>
          </ul>
        </div>
      </motion.nav>
      <Redirect to={`/${id}`} />
    </>
  );
}

export default Navbar;
