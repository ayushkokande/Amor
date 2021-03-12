import {useEffect} from "react";
import {useSpring, animated} from "react-spring";

export default function() {
    useEffect(()=>{

    },[]);

    const imgAnim = useSpring(
        {
        config: {friction: 50},
        to: {bottom: 0},
        from: {bottom: -600},
        delay: 300
})

    const transAnim = useSpring({
        
    })

    return (
        <section  id="firstSection">
            {/* <div className="container">
                <div className = "column">
                    <div className="row-md-4">

                    </div>
                    <div className="row-md-8"></div>
                </div>
            </div> */}
            <div className="transFirst"></div>
            <div className="transSec"></div>
            <div className="transText">
                amor
            </div>
            <div className="textcenter">
                <h1>we all need love to raw dog our hearts</h1>
            </div>
            <animated.div style={imgAnim} id="firstImg">
                <img src="/images/firstSection.jpg" />
                <p>love better</p>
            </animated.div>
        </section>
    )
}