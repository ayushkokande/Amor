import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar m-nav">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item" id="pro_pic">
            <Link to="/profile" className="yourProfile">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz3Gjad-GAHH-b4aguHoIhVn3zLOivYmAuAA&usqp=CAU"
                alt=""
              />
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
