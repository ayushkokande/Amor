import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import store from "../../store/store";

import Navbar from "./navbar";
import { useSelector } from "react-redux";

export default function () {
  let title = "we all need love to overwhelm our hearts";
  title = title.split(" ");

  function titleAnim(item, ind) {
    const titleVariants = {
      initial: { y: "101%", opacity: 0 },
      animate: (i) => ({
        y: "0",
        opacity: 1,
        transition: { duration: 0.5, delay: 1.6 + i * 0.13, type: "tween" },
      }),
    };
    return (
      <motion.div
        variants={titleVariants}
        initial="initial"
        animate="animate"
        custom={ind}
        style={{ display: "inline-block" }}
      >
        {item + (ind === title.length - 1 ? "" : "\u00A0")}
      </motion.div>
    );
  }

  // let mediaQ = window.matchMedia('(max-width: 468px');
  // let mQ = (mediaQ) ? 1.4 : 1;

  const imgVariants = {
    initial: { translateX: "0%", translateY: "100%", opacity: 0 },
    enter: {
      translateX: "0%",
      translateY: "0%",
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.43, 0.13, 0.23, 0.96],
        delay: 0.5,
      },
    },
  };

  const secVariants = {
    initial: { translateY: "100%", opacity: 0 },
    enter: {
      translateY: "0%",
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
    exit: {
      translateY: "100%",
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

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

  const transBG = useSelector((state) => state.link);

  console.log(useLocation());
  return (
    <>
      <motion.section
        style={{ backgroundImage: `url(/images/pink_rice.png)` }}
        className="l-sec"
        id="firstSection"
      >
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
        <div className="content">
          <div className="textcenter" style={{ overflow: "hidden" }}>
            <h2>{title.map(titleAnim)}</h2>
          </div>
          <motion.div
            variants={imgVariants}
            initial="initial"
            animate="enter"
            id="firstImg"
          >
            <img src={process.env.PUBLIC_URL + "/images/firstSec.jpg"} />
            <div className="imgOverlay"></div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
