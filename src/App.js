import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import SignedIn from "./pages/signedIn";
import { auth, db } from "./components/landingComp/firebase";
import store from "./store/store";
import axios from "axios";

function App() {
  const Landing = React.lazy(() => import("./pages/landing"));
  const SignUpPage = React.lazy(() => import("./pages/signUpPage"));
  const [userState, setUserState] = useState(() =>
    auth.currentUser ? true : false
  );
  console.log(userState);

  // useEffect(() => {
  //   db.collection("profiles")
  //     .get()
  //     .then((snapshot) => {
  //       snapshot.forEach((doc) => doc.ref.update({ groups: [] }));
  //     });
  // }, []);

  // const idArr = [];
  // useEffect(() => {
  //   db.collection("profiles")
  //     .get()
  //     .then((snapshot) => {
  //       snapshot.forEach((doc) =>
  //         idArr.push({ id: doc.id, sex: doc.data().sex })
  //       );
  //     })
  //     .then(() => {
  //       idArr.forEach(async (obj) => {
  //         await db
  //           .collection("groupcount")
  //           .doc("0")
  //           .collection("users")
  //           .add({ uid: obj.id, sex: obj.sex });
  //       });
  //     });
  // }, []);

  const storeUser = async (id) => {
    console.log(id);
    let response = await db.collection("profiles").doc(id).get();
    // console.log(response.data());
    store.dispatch({ type: "signedIn", id: id, data: response.data() });
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      // console.log("Signed In");
      // console.log(user.uid);
      storeUser(user.uid);
      store.dispatch({ type: "loginBtn" });
      store.dispatch({ type: "signedIn", id: user.uid });
      axios.post("http://localhost:4000/giveID", { id: user.uid });
      setUserState(true);
    } else {
      store.dispatch({ type: "signedOut" });
      store.dispatch({ type: "pDone" });
      setUserState(false);
    }
  });

  return userState ? (
    <BrowserRouter>
      <div className="App">
        <React.Suspense fallback={<div>LLLLLLL..........</div>}>
          <Switch>
            <Route path="/" component={SignedIn} />
          </Switch>
        </React.Suspense>
      </div>
    </BrowserRouter>
  ) : (
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
  );
}

export default App;
