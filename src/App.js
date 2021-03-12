import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import About from "./components/about";
import Navbar from "./components/navbar";
import FirstSection from "./components/firstSection";
import SecondSection from "./components/secondSection";

function App() {
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
// console.log(document.documentElement.clientHeight);

// const pages = [
//   ({ style }) => <animated.div style={{ ...style, background: 'lightpink' }}>A</animated.div>,
//   ({ style }) => <animated.div style={{ ...style, background: 'lightblue' }}>B</animated.div>,
//   ({ style }) => <animated.div style={{ ...style, background: 'lightgreen' }}>C</animated.div>,
// ]

// const [index, set] = useState(0)
//   const onClick = useCallback(() => set(state => (state + 1) % 3), [])
//   const transitions = useTransition(index, p => p, {
//     from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
//     enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
//     leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
//   })
//   return (
//     <div className="simple-trans-main" onClick={onClick}>
//       {transitions.map(({ item, props, key }) => {
//         const Page = pages[item]
//         return <Page key={key} style={props} />
//       })}
//     </div>
//   )

  return (
    <BrowserRouter>
    <div>
      <Navbar class={classLT}/>
      <Switch>
        <Route exact path="/">
          <FirstSection />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/login">
          <SecondSection />
        </Route>
      </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
