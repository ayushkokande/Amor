import { BrowserRouter, Route, Switch } from "react-router-dom";

import MatchPage from "./matchPage";
import ChatPage from "./chatPage";
import ProfilePage from "./profilePage";

export default function () {
  console.log("SignedInPage");
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={`/match`} component={MatchPage} />
        <Route exact path={`/chat`} component={ChatPage} />
        <Route path={`/`} component={ProfilePage} />
        <Route path={`/profile`} component={ProfilePage} />
      </Switch>
    </BrowserRouter>
  );
}
