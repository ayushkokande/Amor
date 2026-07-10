import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useEffect } from "react";
import { auth, db } from "./lib/firebase";
import store from "./store/store";
import Loading from "./components/common/SpinLoad";
import { useSelector } from "react-redux";

import MatchPage from "./pages/matchPage";
import ChatPage from "./pages/chatPage";
import ProfilePage from "./pages/profilePage";
import CompleteProfile from "./components/signup/completeProfile";

const LandingRoutes = React.lazy(() => import("./pages/landing"));

function App() {
  useEffect(() => {
    const imgs = [
      "/images/pink_rice.png",
      "/images/blue_rice.png",
      "/images/royal_rice.png",
      "/images/noisy.png",
    ];
    imgs.forEach((item) => {
      new Image().src = item;
    });
  }, []);

  useEffect(() => {
    const storeUser = async (id) => {
      const response = await db.collection("profiles").doc(id).get();
      // data is null (not undefined) until the profile doc exists, so
      // components can rely on a consistent shape.
      store.dispatch({ type: "signedIn", id, data: response.data() || null });
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        storeUser(user.uid);
        store.dispatch({ type: "loginBtn" });
      } else {
        store.dispatch({ type: "signedOut" });
        store.dispatch({ type: "pDone" });
      }
    });

    return () => unsubscribe();
  }, []);

  const user = useSelector((state) => state.user.user);
  const userId = useSelector((state) => state.user.id);
  const userData = useSelector((state) => state.user.data);

  // OAuth signups skip the signup form, so their profile lacks the fields
  // matching needs — collect them once before letting them in.
  const needsProfile = user && userData && !userData.sex;

  return (
    <div className="App">
      <React.Suspense
        fallback={
          <div>
            <Loading />
          </div>
        }
      >
        {needsProfile ? (
          <CompleteProfile uid={userId} data={userData} />
        ) : user ? (
          <Switch>
            <Route exact path="/match" component={MatchPage} />
            <Route exact path="/chat" component={ChatPage} />
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/" component={ProfilePage} />
            <Redirect to="/profile" />
          </Switch>
        ) : (
          <LandingRoutes />
        )}
      </React.Suspense>
    </div>
  );
}

export default App;
