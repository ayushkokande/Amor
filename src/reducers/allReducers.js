import onHover from "./hover";
import matchReducer from "./matchReducer";
import profileReducer from "./profileReducer";
import modaleReducer from "./modaleReducer";
import signUpReducer from "./signUpReducer";
import linkReducer from "./linkReducer";
import {combineReducers} from "redux";

const allReducers = combineReducers({
    hover: onHover,
    match: matchReducer,
    profile: profileReducer,
    modal: modaleReducer,
    link: linkReducer
});

export default allReducers;