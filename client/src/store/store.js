import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer"; // Your combined reducers
import { authApi } from "../features/auth/authApi";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(authApi.middleware),
});

// Below code, fetches user data to check/authenticate, if user tokens are stored in the headers or cookies.
// const initializeApp = async () => {
//   await store.dispatch(
//     authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
//   );
// };
// initializeApp();
