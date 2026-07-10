import { Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import About from "../components/landing/About";
import FirstSection from "../components/landing/FirstSection";
import SecondSection from "../components/landing/SecondSection";
import SignUpPage from "./SignUpPage";
import Navbar from "../components/landing/Navbar";

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
