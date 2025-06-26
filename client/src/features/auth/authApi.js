import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const USER_API = `${BASE_URL}/user/`;

// Api's regarding the user register, login, logout & to get & update user profile.
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      // Api Call to register the user.
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),
    loginUser: builder.mutation({
      // Api Call to login the user.
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),

      // Updating the Redux State with the received Data from the above API.
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    loadUser: builder.query({
      // Api Call to get the user profile details.
      query: () => ({ url: "profile", method: "GET" }),

      // Updating the Redux State with the received Data from the above API.
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // console.log(result.data.data);
          dispatch(userLoggedIn({ user: result.data.data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: builder.mutation({
      // Api call to logout the user.
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateUser: builder.mutation({
      // Api Call to update the user profile details.
      query: (formData) => ({
        url: "profile/update",
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useLogoutMutation,
} = authApi;
