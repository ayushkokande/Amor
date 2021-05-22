import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar() {
  let UserImg = useSelector((state) =>
    state.user.data ? state.user.data.images[0] : ""
  );
  return (
    <nav className="navbar m-nav">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item" id="pro_pic">
            <Link to="/profile" className="yourProfile">
              <img src={UserImg} alt="" />
            </Link>
          </li>

          <Link className="navbar-brand" to="/match">
            amor
          </Link>

          <li className="nav-item">
            <Link to="/chat" id="chat">
              <i className="fas fa-comments"></i>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
