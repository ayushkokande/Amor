import {useEffect} from "react";
import {useSpring, animated} from "react-spring";
import { motion } from "framer-motion";

import Navbar from "./navbar";

export default function() {
    let title = "we all need love to raw dog our hearts";
    title = title.split(' ');

    function titleAnim(item,ind) {
        const titleVariants = {
            initial: {y: "101%"},
            animate: i=>({y: "0", transition: {duration: 0.5, delay: 1 + i*0.13, type: "tween"}})
        }
        return (
        <motion.div variants={titleVariants} initial="initial" animate="animate" custom={ind} style={{display: "inline-block"}}>
            {item + (ind === title.length-1 ? "" : "\u00A0")}
        </motion.div>)
    }

    const imgAnim = useSpring(
        {
        config: {friction: 50},
        to: {bottom: 0},
        from: {bottom: -600},
        delay: 300
})

    const transVariants = {
        initial: { scale: 0.6, opacity: 0 },
        enter: { scale: 1, opacity: 1, transition: {duration: 1}},
        exit: {
          scale: 0.3,
          opacity: 0,
          transition: { duration: 1.5, when: "beforeChildren", staggerChildren: 1 }
        }
    };

    const imgVariants = {
        initial: {translateY: "100%", translateX: "-50%"},
        enter: {translateY: "0%", translateX: "-50%",transition: {
            duration: 1,
            ease: [0.43, 0.13, 0.23, 0.96]
          }},
    }

    return (
        <>
        <Navbar />
        <section className="l-sec" id="firstSection">
            <div className="transFirst"></div>
            <div className="transSec"></div>
            <div className="textcenter" style={{overflow: "hidden"}}>
                <h1>{title.map(titleAnim)}</h1>
            </div>
            <motion.div variants={imgVariants} initial="initial" animate="enter" exit="exit" id="firstImg">
                <img src={process.env.PUBLIC_URL + "/images/firstSection.jpg"} />
                <p>love better</p>
            </motion.div>
        </section>
        </>
    )
}