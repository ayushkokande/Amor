import { useTransition, animated, useSpring, interpolate } from 'react-spring'
import { useState } from "react";

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
            <section id="secondSection">
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
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-auto col-sm-12">
                        <div className="loginContainer">
                        <img src="/images/secondSection.jpg" />
                        <div className = "container login">
                            <div className = "row">
                                <div className = "col-sm-9 mx-auto">
                                <form>
                                    <div class="logo mb-3">
                                    <div class="col-md-12 text-center">
                                        <h1>Login</h1>
                                    </div>
                                    </div>
                                    <div class="mb-3 form-group">
                                        <input type="email" class="form-control" placeholder="Enter your email address" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                                    </div>
                                    <div class="mb-3 form-group">
                                        <input type="password" class="form-control" placeholder="Password" id="exampleInputPassword1" />
                                    </div>
                                    <div className = "col-md-12 text-center">
                                    <button type="submit" class="btn btn-primary">Login</button>
                                    </div>
                                    <div class="col-md-12 ">
                                    <div class="login-or">
                                        <hr class="hr-or" />
                                        <span class="span-or">or</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <p class="text-center">Don't have account? <a href="#" id="signup">Sign up here</a></p>
                                </div>
                                </form>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                    </div>
                    <div className="col-md-auto col-sm-12">
                        <div className = "container aboutBS">
                            <h2>heading</h2>
                            <p>Some bs about love</p>
                        </div>
                    </div>
                </div>
            </div>
            </section>  
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