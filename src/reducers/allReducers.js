import onHover from "./hover";
import matchReducer from "./matchReducer";
import profileReducer from "./profileReducer";
import modaleReducer from "./modaleReducer";
import socketReducer from "./socketReducer";
import linkReducer from "./linkReducer";
import userReducer from "./userReducer";
import groupReducer from "./groupReducer";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  hover: onHover,
  match: matchReducer,
  profile: profileReducer,
  modal: modaleReducer,
  link: linkReducer,
  socket: socketReducer,
  user: userReducer,
  group: groupReducer,
});

export default allReducers;
