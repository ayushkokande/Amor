import Landing from "./pages/landing";
import MatchPage from "./pages/matchPage";
import SignUpPage from "./pages/signUpPage";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";

function App() {  
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
        <Route path='/' component={Landing} />
        <Route path='/signup' component={SignUpPage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
