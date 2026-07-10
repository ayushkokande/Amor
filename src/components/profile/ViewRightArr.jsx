import { motion } from "framer-motion";
import { useState } from "react";

export default function (props) {
  const [toggle, setToggle] = useState(false);
  const variants2 = {
    anim1: { scale: [1, 1.3, 1], transition: { duration: 1 } },
    stop1: { scale: [1, 1.31, 1], transition: { duration: 1 } },
  };

  const variants1 = {
    anim: {
      rotateY: [0, -180],
      transition: { duration: 0.5 },
    },
    stop: {
      rotateY: [-180, 0],
      transition: { duration: 0.5 },
    },
  };

  let rightarr = document.querySelector(".rightArr");
  if (rightarr != null)
    rightarr.addEventListener("click", (e) => {
      // console.log(toggle);
      if (!toggle) {
        props.setCardFront(props.cardFront + " flip-front");
        props.setCardBack(props.cardBack + " flip-back");
      } else {
        props.setCardBack("Card card-back");
        props.setCardFront("Card card-front");
      }

      console.log(toggle);
      setToggle(!toggle);
      return false;
    });

  return (
    <motion.div
      variants={variants2}
      initial={false}
      animate={toggle ? "anim1" : "stop1"}
      className="rightArrDiv"
    >
      <motion.i
        variants={variants1}
        initial={false}
        animate={toggle ? "anim" : "stop"}
        className="rightArr fas fa-arrow-right"
      />
    </motion.div>
  );
}
