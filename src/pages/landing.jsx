import React from "react";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";

import About from "../components/landingComp/about";
import Navbar from "../components/landingComp/navbar";
import FirstSection from "../components/landingComp/firstSection";
import SecondSection from "../components/landingComp/secondSection";

import { AnimatePresence } from "framer-motion";

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
        <Navbar class={classLT}/>
        <Route
        render={({ location }) => (
          <AnimatePresence exitBeforeEnter>
            <Switch location={location} key={location.key}>
              <Route exact path='/' render={() => <FirstSection />} />
              <Route path='/about' render={() => <About />} />
              <Route path='/login' render={() => <SecondSection />} />
            </Switch>
          </AnimatePresence>
        )}
      />
      </BrowserRouter>
  );
}

export default Landing;
