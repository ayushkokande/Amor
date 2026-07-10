import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import store from "../../store/store";
import { auth, db, googleProvider } from "../../lib/firebase";
import Button from "@material-ui/core/Button";

export default function () {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const abTransVariants1 = {
    initial: { translateX: "100%" },
    exit: {
      translateX: "0%",
      transition: {
        delay: 0.1,
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  const abTransVariants2 = {
    initial: { translateX: "-100%" },
    exit: {
      translateX: "0%",
      transition: {
        delay: 0.1,
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  function func(id) {
    store.dispatch({ type: id });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Changed the link");
        resolve({ msg: "Changed link" });
        reject({ msg: "Couldnt change link" });
      }, 100);
    });
  }

  function onClick(e) {
    func(e.target.id);
    // func(e.target.id).then(setChange(true));
  }

  const transBG = useSelector((state) => state.link);

  const boxVar = {
    initial: { translateX: "-50%", translateY: "-50%", scale: 0.7, opacity: 0 },
    enter: {
      translateX: "-50%",
      translateY: "-50%",
      scale: 1,
      opacity: 1,
      transition: { delay: 0.8, duration: 1, type: "spring" },
    },
  };

  function signIn(e) {
    store.dispatch({ type: "loginBtn" });
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        // Signed in
        // setChange(true);
        // ...
      })
      .catch((error) => {
        alert(error);
      });
  }

  async function signInWithGoogle(e) {
    e.preventDefault();
    store.dispatch({ type: "loginBtn" });
    try {
      const result = await auth.signInWithPopup(googleProvider);
      const user = result.user;
      const ref = db.collection("profiles").doc(user.uid);
      const snap = await ref.get();

      if (!snap.exists) {
        const [f_name, ...rest] = (user.displayName || "").split(" ");
        const profile = {
          f_name: f_name || "",
          l_name: rest.join(" "),
          email: user.email || "",
          age: "",
          sex: "",
          bio: "",
          images: user.photoURL ? [user.photoURL] : [],
        };
        await ref.set(profile);
        store.dispatch({ type: "signedIn", id: user.uid, data: profile });
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <section
      style={{ backgroundImage: `url(/images/royal_rice.png)` }}
      className="l-sec"
      id="secondSection"
    >
      <motion.div
        style={{ backgroundImage: `url(/images/${transBG.img})` }}
        variants={abTransVariants1}
        initial="initial"
        exit="exit"
        className="Trans1"
      ></motion.div>
      <motion.div
        style={{ backgroundImage: `url(/images/${transBG.img})` }}
        variants={abTransVariants2}
        initial="initial"
        exit="exit"
        className="Trans2"
      ></motion.div>
      <motion.div
        className="signInBox"
        variants={boxVar}
        initial="initial"
        animate="enter"
      >
        <div className="imgContainer">
          <img
            id="loginImg"
            src={process.env.PUBLIC_URL + "/images/secSection2.jpg"}
            alt="LoginPage Image"
          />
        </div>
        <div className="signInContent">
          <form method="POST" className="signInForm">
            <h3 className="form-title" className="SignIn">
              Sign In
            </h3>
            <div className="form-group em_pw">
              <label for="email">
                <i className="zmdi zmdi-email"></i>
              </label>
              <input
                type="email"
                className="inpText"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="form-group em_pw">
              <i className="zmdi zmdi-lock"></i>
              <input
                type="password"
                className=" text-muted inpText"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Password"
                onChange={(e) => setPw(e.target.value)}
              ></input>
            </div>
            <div className="form-group check-form">
              <input type="checkbox" />
              <label>Remember my password</label>
            </div>
            <div className="form-group form-button">
              <Button className="form-submit" onClick={signIn}>
                Login
              </Button>
            </div>
            <div className="form-group form-button">
              <Button className="googleBtn" onClick={signInWithGoogle}>
                <svg
                  className="googleIcon"
                  viewBox="0 0 48 48"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
            <div
              className="form-group text-center"
              style={{ fontSize: "12px", color: "rgb(65, 65, 65)" }}
            >
              <p>
                Don't have an account?{" "}
                <p>
                  <Link to="/signUp" onClick={onClick} id="signUp">
                    Sign up.
                  </Link>
                </p>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
