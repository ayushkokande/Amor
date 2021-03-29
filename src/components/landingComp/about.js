import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function() {
    // let location = useLocation();
    // console.log(location);
    const transVariants = {
        from: { scale: 0.6, opacity: 0 },
        in: { scale: 1, opacity: 1, transition: {duration: 1}},
        out: {
          scale: 0.3,
          opacity: 0,
          transition: { duration: 2 , when: "afterChildren"}
        }
    };
    return(
        <motion.div
        initial={{opacity: 0,scale: 0.5}}
        animate={{opacity: 1, scale: 0.9, transition: {duration: 1, type: "spring", when: "afterChildren"}}}
        exit={{opacity: 0.2, scale: 0.8, transition: {duration:1, delay: 1, when: "afterChildren"}}}
        style={{backgroundColor: "violet"}}>
            
            <AnimatePresence exitBeforeEnter>
                <motion.p
                initial={{opacity: 0,scale: 0.5}}
                animate={{opacity: 1, scale: 1, transition: {duration: 1, delay: 2, type: "spring"}}}
                exit={{opacity: 0.2, scale: 0.8, transition: {duration:1, delay: 1}}}>
                D
                </motion.p>
            </AnimatePresence>
        </motion.div>
    )
}