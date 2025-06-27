import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "./authSlice";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const USER_API = `${BASE_URL}/user/`;

// Api's regarding the user register, login, logout & to get & update user profile.
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include", // for refresh token in cookie
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.accessToken; // get token from Redux slice
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"], // optional: helps with caching & invalidation
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      // Api Call to register the user.
      query: (formData) => ({
        url: "register",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    verifyEmail: builder.mutation({
      // Api Call to verify the user Email.
      query: (formData) => ({
        url: "verify-email",
        method: "POST",
        body: formData,
        formData: true,
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
          const { data } = await queryFulfilled;
          // console.log(data);
          dispatch(
            userLoggedIn({
              user: data.data,
              accessToken: data.meta?.accessToken,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    loadUser: builder.query({
      // Api Call to get the user profile details.
      query: () => ({ url: "user-profile", method: "GET" }),

      // Updating the Redux State with the received Data from the above API.
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { result } = await queryFulfilled;
          // console.log(result.data.data);
          dispatch(
            userLoggedIn({
              user: result.data,
              accessToken: result.meta?.accessToken,
            })
          );
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
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useLazyLoadUserQuery, // ✅ for manual trigger
  useUpdateUserMutation,
  useLogoutMutation,
} = authApi;
