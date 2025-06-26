import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";

const rootReducer = combineReducers({
  // Custom auth state (login/logout, etc.)
  auth: authReducer,

  // RTK Query reducers under dynamic key "authApi"
  [authApi.reducerPath]: authApi.reducer,
});

export default rootReducer;
