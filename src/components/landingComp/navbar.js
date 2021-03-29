import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {useSpring, animated} from "react-spring";
import store from "../../store/store";

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
            <Link to="/about" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} id="about" className="nav-link">
              <span className="first" data-content="A">A</span><span className="rest" data-content="bout">bout</span>
            </Link>
            <svg><rect></rect></svg>
          </li>
        
          <Link to="/" class="navbar-brand">amor</Link>
        
          <li className = "nav-item px-4">
            <Link to="/login" id="dishes" className="nav-link">
              <span className="first" data-content="L">L</span><span className="rest" data-content="ogin">ogin</span>
            </Link>
            <svg><rect></rect></svg></li>
          
        </ul>
      </div>  
    </nav>
  )
}

export default Navbar;
