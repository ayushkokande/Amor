import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useState, useEffect } from "react";
import SignedIn from "./pages/signedIn";
import { auth, db } from "./components/landingComp/firebase";
import store from "./store/store";
import axios from "axios";
import Loading from "./spinLoad";
import { useSelector } from "react-redux";

function App() {
  const Landing = React.lazy(() => import("./pages/landing"));
  const SignUpPage = React.lazy(() => import("./pages/signUpPage"));
  const [userState, setUserState] = useState(() =>
    auth.currentUser ? true : false
  );
  console.log(userState);

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
    // await cacheImages(imgs);
  }, []);

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
  //       console.log(idArr);
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
      axios.post(`https://amor008.herokuapp.com/giveID`, {
        id: user.uid,
      });
      setUserState(true);
    } else {
      store.dispatch({ type: "signedOut" });
      store.dispatch({ type: "pDone" });
      setUserState(false);
    }
  });

  const user = useSelector((state) => state.user.user);

  return user ? (
    <BrowserRouter>
      <div className="App">
        <React.Suspense
          fallback={
            <div>
              <Loading />
            </div>
          }
        >
          <Switch>
            <Route path="/" component={SignedIn} />
          </Switch>
        </React.Suspense>
      </div>
    </BrowserRouter>
  ) : (
    <BrowserRouter>
      <div className="App">
        <React.Suspense
          fallback={
            <div>
              <Loading />
            </div>
          }
        >
          <Landing />
        </React.Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
