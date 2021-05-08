import "./landingStyles.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ReactLoading from "react-loading";

import About from "../components/landingComp/about";
import FirstSection from "../components/landingComp/firstSection";
import SecondSection from "../components/landingComp/secondSection";
import SignUpPage from "./signUpPage";

import { AnimatePresence } from "framer-motion";

// const FirstSection = React.lazy(()=>import("../components/landingComp/firstSection"));

// const SecondSectionPromise = import("../components/landingComp/secondSection");
// const SecondSection = React.lazy(()=>SecondSectionPromise);

// const AboutPromise = import("../components/landingComp/about");
// const About = React.lazy(()=>AboutPromise);

// const SignUpPage = React.lazy(()=>import("./signUpPage"));

function Landing() {
  const [isLoading, setIsLoading] = useState(true);

  async function cacheImages(srcArray) {
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();

        img.src = src;
        img.onLoad = resolve();
        img.onerror = reject();
      });
    });

    Promise.all(promises).then(setIsLoading(false));
  }

  useEffect(async () => {
    const imgs = [
      "/images/pink_rice.png",
      "/images/blue_rice.png",
      "/images/royal_rice.png",
      "/images/noisy.png",
    ];

    imgs.forEach((item) => {
      new Image().src = item;
    });
    setIsLoading(true);
    // await cacheImages(imgs);
  }, []);

  return !isLoading ? (
    <div
      style={{
        backgroundColor: "#2E2C2C",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ReactLoading type={"spinningBubbles"} color="grey" />
    </div>
  ) : (
    <BrowserRouter>
      <Route
        render={({ location }) => (
          <AnimatePresence exitBeforeEnter>
            <Switch location={location} key={location.key}>
              <Route exact path="/" render={() => <FirstSection />} />
              <Route path="/about" render={() => <About />} />
              <Route path="/login" render={() => <SecondSection />} />
              <Route path="/signUp" render={() => <SignUpPage />} />
            </Switch>
          </AnimatePresence>
        )}
      />
    </BrowserRouter>
  );
}

export default Landing;
