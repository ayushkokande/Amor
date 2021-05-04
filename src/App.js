import Landing from "./pages/landing";
import SignUpPage from "./pages/signUpPage";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import React from "react";
import ChatPage from "./pages/chatPage";
import MatchPage from "./pages/matchPage";
import ProfilePage from "./pages/profilePage";

function App() {
  const Landing = React.lazy(() => import("./pages/landing"));
  const SignUpPage = React.lazy(() => import("./pages/signUpPage"));

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <React.Suspense fallback={<div>LLLLLLL..........</div>}>
            {/* <ChatPage /> */}
            {/* <ProfilePage /> */}
            <MatchPage />
            {/* <Switch>
              <Route path="/" component={Landing} />
              <Route path="/signup" component={SignUpPage} />
            </Switch> */}
          </React.Suspense>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
