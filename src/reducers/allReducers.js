import onHover from "./hover";
import {combineReducers} from "redux";

const allReducers = combineReducers({
    hover: onHover
});

export default allReducers;