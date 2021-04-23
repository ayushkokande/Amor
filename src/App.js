import Landing from "./pages/landing";
import MatchPage from "./pages/matchPage";
import SignUpPage from "./pages/signUpPage";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import { useState } from "react";
import ReactLoading from "react-loading";
import FirstSection from "./components/landingComp/firstSection";
import SecondSection from "./components/landingComp/secondSection";
import About from "./components/landingComp/about";

function App() {  
  const [load,setLoad] = useState(false);

  setTimeout(() => {fetch("https://localhost:3000").
  then(setLoad(true));},2000);
  
  return (
    !load ? (<>
    <div style={{backgroundColor: "#2E2C2C", height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center"}}><ReactLoading type={"spinningBubbles"} color="grey" /></div>
    </>) : (<BrowserRouter>
      <div className="App">
        <Switch>
        <Route path='/' component={Landing} />
        <Route path='/signup' component={SignUpPage} />
        </Switch>
      </div>
    </BrowserRouter>) 
  );
}

export default App;
