import Landing from "./pages/landing";
import SignUpPage from "./pages/signUpPage";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import { useState } from "react";
import ReactLoading from "react-loading";
import React from "react";

function App() {    
  // const Landing = React.lazy(()=>import("./pages/landing"));
  // const SignUpPage = React.lazy(()=>import("./pages/signUpPage"));

  return (
    <>
    <BrowserRouter>
      <div className="App">
        <Switch>
        <Route path='/' component={Landing} />
        <Route path='/signup' component={SignUpPage} />
        </Switch>
      </div> 
    </BrowserRouter>
    </>
  );
}

export default App;
