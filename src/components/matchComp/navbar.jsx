import React from "react";

function Navbar() {
  return (
    <nav class="navbar m-nav">
      <div class="container-fluid">
        <li className="nav-item">
          <a className="active" href="#" className="yourProfile">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz3Gjad-GAHH-b4aguHoIhVn3zLOivYmAuAA&usqp=CAU"
              alt=""
            />
          </a>
        </li>

        <a class="navbar-brand" href="#">
          amor
        </a>

        <li className="nav-item">
          <a href="#">Chat</a>
        </li>
      </div>
    </nav>
  );
}

export default Navbar;
