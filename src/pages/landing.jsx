import { Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import About from "../components/landing/about";
import FirstSection from "../components/landing/firstSection";
import SecondSection from "../components/landing/secondSection";
import SignUpPage from "./signUpPage";
import Navbar from "../components/landing/navbar";

import "./landingStyles.css";

function LandingRoutes() {
  const location = useLocation();

  return (
    <div className="landing-shell">
      <Navbar fixed />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/about" component={About} />
          <Route path="/login" component={SecondSection} />
          <Route path="/signUp" component={SignUpPage} />
          <Route exact path="/" component={FirstSection} />
        </Switch>
      </AnimatePresence>
    </div>
  );
}

export default LandingRoutes;

export { About, FirstSection, SecondSection, SignUpPage };
