import React, { useState } from "react";
import { useSelector } from "react-redux";
import store from "../../store/store";

function Navbar(param) {
  let hover = useSelector((state) => state.hover);

  function mouseEnter() {
    store.dispatch({ type: "hover" });
  }

  function mouseLeave() {
    store.dispatch({ type: "not" });
  }

  let name_class = "navbar";

  return (
    <nav class="navbar m-nav">
      <div class="container-fluid">
        <li className="nav-item">
          <a className="active" aria-current="page" href="#">
            <img
              className="yourProfile"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz3Gjad-GAHH-b4aguHoIhVn3zLOivYmAuAA&usqp=CAU"
              alt=""
            />
          </a>
        </li>

        <a class="navbar-brand" href="#">
          amor
        </a>

        <li className="nav-item">
          <a href="#">Explore</a>
        </li>
      </div>
    </nav>
  );
}

export default Navbar;
