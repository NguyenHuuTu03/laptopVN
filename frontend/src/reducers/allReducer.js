import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import authReducer from "./authReducer";
import settingReducer from "./settingReducer";

const allReducer = combineReducers({
  cartReducer,
  authReducer,
  settingReducer,
});

export default allReducer;
