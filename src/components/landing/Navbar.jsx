import { useHistory, useLocation } from "react-router-dom";
import store from "../../store/store";
import { motion } from "framer-motion";

const ROUTES = {
  about: "/about",
  home: "/",
  login: "/login",
  signUp: "/signUp",
};

function Navbar({ fixed = false }) {
  const history = useHistory();
  const location = useLocation();

  const navVariants = {
    initial: { translateY: "-100%", opacity: 0 },
    enter: {
      translateY: "0%",
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  function navigate(id) {
    store.dispatch({ type: id });
    history.push(ROUTES[id] || "/");
  }

  function onClick(e) {
    navigate(e.target.id);
  }

  function isActive(id) {
    const path = ROUTES[id];
    if (id === "home") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }

  const navClass = fixed ? "navbar NAV landing-nav-fixed" : "navbar NAV";

  return (
    <motion.nav
      variants={navVariants}
      initial="initial"
      animate="enter"
      className={navClass}
      id="navbar"
    >
      <div className="container-fluid mx-5 pt-2 pb-2">
        <ul className="navbar-nav">
          <li className="nav-item">
            <p
              onClick={onClick}
              id="about"
              className={`nav-link${isActive("about") ? " nav-link-active" : ""}`}
            >
              about
            </p>
          </li>

          <p
            onClick={onClick}
            id="home"
            className={`navbar-brand${isActive("home") ? " nav-link-active" : ""}`}
          >
            amor
          </p>

          <li className="nav-item">
            <p
              onClick={onClick}
              id="login"
              className={`nav-link${isActive("login") ? " nav-link-active" : ""}`}
            >
              login
            </p>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
}

export default Navbar;
