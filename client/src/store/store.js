import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer"; // Your combined reducers
import { authApi } from "../features/auth/authApi";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(authApi.middleware),
});

