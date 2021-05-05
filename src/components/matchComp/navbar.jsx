import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav class="navbar m-nav">
      <div class="container-fluid">
        <li className="nav-item">
          <Link to="/profile" className="yourProfile">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz3Gjad-GAHH-b4aguHoIhVn3zLOivYmAuAA&usqp=CAU"
              alt=""
            />
          </Link>
        </li>

        <Link class="navbar-brand" to="/match">
          amor
        </Link>

        <li className="nav-item">
          <Link to="/chat" id="chat">
            <i class="fas fa-comments"></i>
          </Link>
        </li>
      </div>
    </nav>
  );
}

export default Navbar;
