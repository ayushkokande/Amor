import {useEffect} from "react";
import {useSpring, animated} from "react-spring";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import store from "../../store/store";

import Navbar from "./navbar";
import { useSelector } from "react-redux";

export default function() {
    let title = "we all need love to raw dog our hearts";
    title = title.split(' ');

    function titleAnim(item,ind) {
        const titleVariants = {
            initial: {y: "101%"},
            animate: i=>({y: "0", transition: {duration: 0.5, delay: 1.6 + i*0.13, type: "tween"}})
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
        initial: {translateX: "-50%", translateY: "100%", opacity: 0},
        enter: {translateX: "-50%", translateY: "0%",opacity: 1, transition: {
            duration: 1,
            ease: [0.43, 0.13, 0.23, 0.96],
            delay: 0.5
          }},
    }

    const secVariants = {
        initial: {translateY: "100%", opacity: 0},
        enter: {translateY: "0%",opacity: 1, transition: {
            duration: 1,
            ease: [0.43, 0.13, 0.23, 0.96],
          }},
        exit: {translateY: "100%", opacity: 1, transition: {
            duration: 1,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
    }

    const abTransVariants1 = {
        initial: {translateX: "100%"},
        exit: {translateX: "0%", transition: {
            delay: 0.1,
            duration: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96],
        }}
    };

    const abTransVariants2 = {
        initial: {translateX: "-100%"},
        exit: {translateX: "0%", transition: {
            delay: 0.1,
            duration: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96],
        }}
    };

    const transBG = useSelector(state => state.link);

    console.log(useLocation());
    return (
        <>
            <motion.section className="l-sec" id="firstSection">
                <Navbar />
                <motion.div style={{backgroundImage: `url(/images/${transBG.img})`}} variants = {abTransVariants1} initial="initial" exit="exit" className="Trans1"></motion.div>
                <motion.div style={{backgroundImage: `url(/images/${transBG.img})`}} variants = {abTransVariants2} initial="initial" exit="exit" className="Trans2"></motion.div>
                <div className="content">
                    <div className="textcenter" style={{overflow: "hidden"}}>
                        <h1 style = {{fontSize: "2rem"}}>{title.map(titleAnim)}</h1>
                    </div>
                    <motion.div variants={imgVariants} initial="initial" animate="enter" exit="exit" id="firstImg">
                        <img src={process.env.PUBLIC_URL + "/images/firstSec.jpg"} />
                        <div className="imgOverlay"></div>
                    </motion.div>
                </div>
            </motion.section>
        </>
    )
}