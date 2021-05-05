import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import React from "react";
import SignedIn from "./pages/signedIn";
import { auth } from "./components/landingComp/firebase";
import store from "./store/store";

let initialVal = auth.currentUser !== null ? true : false;

function App() {
  const Landing = React.lazy(() => import("./pages/landing"));
  const SignUpPage = React.lazy(() => import("./pages/signUpPage"));
  const [userState, setUserState] = useState(() =>
    auth.currentUser ? true : false
  );
  console.log(userState);

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("Signed In");
      store.dispatch({ type: "signedIn", id: user.uid });
      setUserState(true);
    } else setUserState(false);
  });

  return !userState ? (
    <BrowserRouter>
      <div className="App">
        <React.Suspense fallback={<div>LLLLLLL..........</div>}>
          {/* <ChatPage /> */}
          {/* <ProfilePage /> */}
          {/* <MatchPage /> */}
          <Switch>
            <Route path="/" component={Landing} />
            <Route exact path="/signup" component={SignUpPage} />
          </Switch>
        </React.Suspense>
      </div>
    </BrowserRouter>
  ) : (
    <BrowserRouter>
      <div className="App">
        <React.Suspense fallback={<div>LLLLLLL..........</div>}>
          <Switch>
            <Route path="/" component={SignedIn} />
          </Switch>
        </React.Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
