import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

import Navbar from "./navbar";

export default function () {
  const transBG = useSelector((state) => state.link);
  // let location = useLocation();
  // console.log(location);
  const transVariants = {
    from: { scale: 0.6, opacity: 0 },
    in: { scale: 1, opacity: 1, transition: { duration: 1 } },
    out: {
      scale: 0.3,
      opacity: 0,
      transition: { duration: 2, when: "afterChildren" },
    },
  };

  let title = "as beautiful as the moon";
  title = title.split(" ");

  const mq = window.matchMedia("(max-width: 468px)");

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

  const cirVar = {
    initial: { opacity: 0, scale: 0 },
    enter: {
      opacity: 1,
      scale: mq.matches ? 9 : 15,
      transition: { delay: 0.5, duration: 0.6, type: "tween" },
    },
  };

  const oneLinerVar = {
    initial: { translateY: "30%", opacity: 0 },
    enter: {
      translateY: "0%",
      opacity: 1,
      transition: { delay: 1.25, duration: 0.5, type: "tween" },
    },
  };

  const abVar = {
    initial: { translateX: "-35%", opacity: 0 },
    enter: {
      translateX: "0%",
      opacity: 1,
      transition: { delay: 3, duration: 1, type: "spring" },
    },
  };

  const contVar = {
    initial: { translateX: "-20%", opacity: 0 },
    enter: {
      translateX: "0%",
      opacity: 1,
      transition: { delay: 3.3, duration: 0.6, type: "tween" },
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

  return (
    <>
      <section
        style={{ backgroundImage: `url(/images/blue_rice.png)` }}
        className="l-sec"
        id="thirdSection"
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
        <motion.svg
          variants={cirVar}
          initial="initial"
          animate="enter"
          height="100"
          width="100"
        >
          <circle
            cx="50"
            cy="0"
            r="40"
            stroke="black"
            stroke-width="3"
            fill="red"
          />
          Sorry, your browser does not support inline SVG.
        </motion.svg>
        <div className="container-fluid">
          <motion.h1
            className="text-center oneLiner"
            variants={oneLinerVar}
            initial="initial"
            animate="enter"
          >
            amor
          </motion.h1>
          <h3 className="motto text-center">{title.map(titleAnim)}</h3>
          <div className="desc">
            <motion.h3 variants={abVar} initial="initial" animate="enter">
              About <span className="amor">amor</span>
            </motion.h3>
            <motion.p variants={contVar} initial="initial" animate="enter">
              <span>amor</span> is a dating web application, co-developed by
              Neejor Chakma and Ayush Kokande. It employs Gale-Shapley matching
              algorithm to attain the most stable matches for the users present
              in a group.
              <br />
              Users are requested to fill their subjective preferences over the
              members of the opposite group. For a better rate of matches, the
              number of{" "}
              <strong>
                <u>active</u>
              </strong>{" "}
              groups a user can be a part of, has been limited to 3. Most stable
              matches are then made accordingly.
            </motion.p>
          </div>
        </div>
      </section>
    </>
  );
}
