import React, { useState } from "react";
import { useSelector } from "react-redux";
import {useSpring, animated} from "react-spring";
import store from "../store/store";

function Navbar(param) {
  let hover = useSelector(state => state.hover);
  const props = useSpring({
    backgroundColor: "#000"
  });

  function mouseEnter(){
    store.dispatch({type: "hover"});
  }

  function mouseLeave(){
    store.dispatch({type: "not"});
  }

  let name_class="navbar"+ param.class; 

  return (
    <nav className={name_class} id="navbar">
      <div className="container-fluid mx-5 pt-2 pb-2">
        <ul className="navbar-nav">
          <li className = "nav-item px-4">
            <animated.a onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} id="about" className="nav-link" href="/about">
              <span className="first" data-content="A">A</span><span className="rest" data-content="bout">bout</span>
            </animated.a>
            <svg><rect></rect></svg>
          </li>
        
          <a class="navbar-brand" href="/">amor</a>
        
          <li className = "nav-item px-4">
            <a id="dishes" className="nav-link" href="/login">
              <span className="first" data-content="L">L</span><span className="rest" data-content="ogin">ogin</span>
            </a>
            <svg><rect></rect></svg></li>
          {/* <li className = "nav-item col-sm-8">
            <a id="home" className="nav-link" href="#home">
              <span className="first" data-content="C">C</span><span className="rest" data-content="ontact">ontact</span>
            </a>
            <svg><rect></rect></svg></li> */}
        </ul>
      </div>  
    </nav>
  )
}

export default Navbar;
