import { motion } from "framer-motion";
import { useState } from "react";

export default function () {
  const [toggle, setToggle] = useState(false);
  const variants2 = {
    anim1: { scale: [1, 2, 1], transition: { duration: 1 } },
    stop1: { scale: [1, 2, 1], transition: { duration: 1 } }
  };

  const variants1 = {
    anim: {
      rotateY: [0, -90, -180],
      padding: ["10px", "30px", "10px"],
      transition: { duration: 1 }
    },
    stop: {
      rotateY: [-180, -90, 0],
      padding: ["10px", "31px", "10px"],
      transition: { duration: 1 }
    }
  };

  let rightarr = document.querySelector(".rightArr");
  if (rightarr != null)
    rightarr.addEventListener("click", (e) => {
      // console.log(toggle);
      console.log(toggle);
      setToggle(!toggle);
      return false;
    });

  return (
    <div className="rightArrDiv">
      <motion.i
        variants={variants1}
        initial={false}
        animate={toggle ? "anim" : "stop"}
        className="rightArr fas fa-arrow-right"
      />
    </div>
  );
}
