import "./landingStyles.css";
import React from "react";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";

import About from "../components/landingComp/about";
import Navbar from "../components/landingComp/navbar";
import FirstSection from "../components/landingComp/firstSection";
import SecondSection from "../components/landingComp/secondSection";
import SignUpPage from "./signUpPage";

import { AnimatePresence } from "framer-motion";

// const FirstSection = React.lazy(()=>import("../components/landingComp/firstSection"));
// const SecondSection = React.lazy(()=>import("../components/landingComp/secondSection"));
// const About = React.lazy(()=>import("../components/landingComp/about"));
// const SignUpPage = React.lazy(()=>import("./signUpPage"));

function Landing() {
  const [classLT,setClassLT] = React.useState("");
  const ht = document.documentElement.clientHeight;
  var myScrollFunc = function() {
  var y = window.scrollY;
  if (y >= ht-10) {
    setClassLT(" scrolled");
  } else {
    setClassLT("");
  }
};
window.addEventListener("scroll", myScrollFunc);

  
  return (
    <BrowserRouter>
        <Route
        render={({ location }) => (
          <AnimatePresence exitBeforeEnter>
          {/* <React.Suspense fallback={<div>LOADINGG.....</div>}> */}
            <Switch location={location} key={location.key}>
              <Route exact path='/' render={() => <FirstSection />} />
              <Route path='/about' render={() => <About />} />
              <Route path='/login' render={() => <SecondSection />} />
              <Route path="/signUp" render={() => <SignUpPage />} />
            </Switch>
            {/* </React.Suspense> */}
          </AnimatePresence>
        )}
      />
      </BrowserRouter>
  );
}

export default Landing;
