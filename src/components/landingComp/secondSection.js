import { useTransition, animated, useSpring, interpolate } from 'react-spring'
import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import store from "../../store/store";

import Navbar from "./navbar";

export default function() {
    const [linkChange,setChange] = useState(false);
    let id = useSelector(state=>state.link.link);

    const animFirst = useSpring({
        config: {friction: 30},
        from: {t: 0},
        to: {t: 200000}
    });

    const animSec = useSpring({
        config: {friction: 30},
        from: {t: 0},
        to: {t: 200000}
    });

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

    function func(id) {
        store.dispatch({type: id});
        return new Promise((resolve,reject) => {
          setTimeout(()=>{
            console.log("Changed the link");
            resolve({msg: "Changed link"});
            reject({msg: "Couldnt change link"});
          },100);
        })
      }
    
      function onClick(e) {
        func(e.target.id).then(setChange(true));
      }
    
    
    const transBG = useSelector(state => state.link);

    const boxVar = {
        initial: {translateX: "-50%", scale: 0.7, opacity: 0},
        enter: {translateX: "-50%", scale: 1,opacity: 1, transition: {delay: 0.8, duration: 1, type: "spring"}}    
    }

    return (
        !linkChange?
            (<>
            <section className="l-sec" id="secondSection">
            <Navbar/>
            <motion.div style={{backgroundImage: `url(/images/${transBG.img})`}} variants = {abTransVariants1} initial="initial" exit="exit" className="Trans1"></motion.div>
            <motion.div style={{backgroundImage: `url(/images/${transBG.img})`}} variants = {abTransVariants2} initial="initial" exit="exit" className="Trans2"></motion.div>
            <motion.div className="signInBox" variants={boxVar} initial="initial" animate="enter">
                <div className="imgContainer">
                    <img id="loginImg" src={process.env.PUBLIC_URL + "/images/secSection2.jpg"} alt="LoginPage Image"/>
                </div>                
                <div className="signInContent">
                    <form method="POST" className="signInForm">
                    <h3 className="form-title">Sign In</h3>
                        <div className="form-group em_pw">
                            <label for="email"><i className="zmdi zmdi-email"></i></label>
                            <input type="email" className="inpText" placeholder="Enter email"></input>
                        </div>
                        <div className="form-group em_pw">
                            <i className="zmdi zmdi-lock"></i>
                            <input type="password" className=" text-muted inpText" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Password"></input>
                        </div>
                        <div class="form-group check-form">
                            <input type="checkbox"/>
                            <label>Remember my password</label>
                        </div>
                        <div class="form-group form-button">
                            <input type="submit"  class="form-submit" value="Login"/>
                        </div>
                        <div className="form-group">
                            <p>Don't have an account? <p onClick={onClick} id="signUp">Sign up.</p></p>
                        </div>
                    </form>
                </div>
            </motion.div>    
            </section> 
            </>)
            :
            (<>
                <section className="l-sec" id="secondSection">
                <Navbar/>
                <motion.div style={{backgroundImage: `url(/images/${transBG.img})`}} variants = {abTransVariants1} initial="initial" exit="exit" className="Trans1"></motion.div>
                <motion.div style={{backgroundImage: `url(/images/${transBG.img})`}} variants = {abTransVariants2} initial="initial" exit="exit" className="Trans2"></motion.div>
                <div className="signInBox">
                    <div className="imgContainer">
                        <img id="loginImg" src={process.env.PUBLIC_URL + "/images/secSection2.jpg"} alt="LoginPage Image"/>
                    </div>                
                    <div className="signInContent">
                        <form method="POST" className="signInForm">
                        <h3 className="form-title">Sign In</h3>
                            <div className="form-group em_pw">
                                <label for="email"><i className="zmdi zmdi-email"></i></label>
                                <input type="email" className="inpText" placeholder="Enter email"></input>
                            </div>
                            <div className="form-group em_pw">
                                <i className="zmdi zmdi-lock"></i>
                                <input type="password" className=" text-muted inpText" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Password"></input>
                            </div>
                            <div class="form-group check-form">
                                <input type="checkbox"/>
                                <label>Remember my password</label>
                            </div>
                            <div class="form-group form-button">
                                <input type="submit"  class="form-submit" value="Login"/>
                            </div>
                            <div className="form-group">
                                <p>Don't have an account? <p onClick={onClick} id="signUp">Sign up.</p></p>
                            </div>
                        </form>
                    </div>
                </div>    
                </section><Redirect to= {`/${id}`} /></>) 
    )
}