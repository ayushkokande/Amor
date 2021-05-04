import React from "react";

function Navbar() {
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
