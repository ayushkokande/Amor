import { useTransition, animated, useSpring, interpolate } from 'react-spring'
import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "./navbar";

export default function() {
    // const [index, set] = useState(0);
    // const transitions = useTransition(index, p => p, {
    //     from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    //     enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    //     leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    //   });

    const animFirst = useSpring({
        config: {friction: 30},
        from: {t: 0},
        to: {t: 200000}
    })

    const animSec = useSpring({
        config: {friction: 30},
        from: {t: 0},
        to: {t: 200000}
    })

    return (  
            <>
            <Navbar />
            <section classNamae="l-sec" id="secondSection">
            <animated.div style={{top: animFirst.t.interpolate({
                range: [0,20000,180000,200000],
                output: [-100,0,0,100]
            }).interpolate(t=> `${t}vh`)
            }} className="transFirst"></animated.div>

            <animated.div style={{bottom: animSec.t.interpolate({
                range: [0,10000,180000,200000],
                output: [-100,0,0,100]
            }).interpolate(t=> `${t}vh`)
            }} className="transSec"></animated.div>
            <div className="transText">
                amor
            </div>
            {/* <div className="transFirst"></div>
            <div className="transSec"></div>
            <div className="transText">
                amor
            </div> */}
            <div className="signInBox">
                <div className="imgContainer">
                    <img id="loginImg" src="/images/secSection2.jpg" alt="LoginPage Image"/>
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
                            <p>Don't have an account? <Link to="/signup">Sign up.</Link></p>
                        </div>
                    </form>
                </div>
            </div>    
            </section> 
            </> 
    )
}

// export default function() {
//     const pages = [
//         ({ style }) => <animated.section id="secondSection" style={{ ...style }}>{secSection()}</animated.section>
//     ];
//     const transitions = useTransition(0, (p) => p, {
//         from: { opacity: 0, transform: 'translate3d(-100%,0,0)' },
//         enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
//         leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
//       });
    
//     return (
//         <div>
//             {transitions.map(({ item, props, key }) => {
//                 const Page = pages[0];
//                 return <Page key={key} style={props} />
//             })}
//         </div>
//     )
// }