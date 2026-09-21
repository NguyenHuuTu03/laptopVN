import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import authReducer from "./authReducer";

const allReducer = combineReducers({
  cartReducer,
  authReducer,
});

export default allReducer;
