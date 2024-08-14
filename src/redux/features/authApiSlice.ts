import type { IUser } from "@/lib/definitions";
import { apiSlice } from "../services/apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: ({ email, first_name, last_name, password, re_password }) => ({
        url: "users/",
        method: "POST",
        body: {
          email,
          first_name,
          last_name,
          password,
          re_password,
        },
      }),
    }),
    resendActivation: builder.mutation({
      query: (email) => ({
        url: "users/resend_activation/",
        method: "POST",
        body: {
          email,
        },
      }),
    }),
    activate: builder.mutation({
      query: ({ uid, token }) => ({
        url: "users/activation/",
        method: "POST",
        body: { uid, token },
      }),
    }),
    signIn: builder.mutation({
      query: ({ email, password }) => ({
        url: "jwt/create/",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
    retrieveUser: builder.query<IUser, void>({
      query: () => ({
        url: "users/me/",
      }),
      providesTags: ["User"],
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "jwt/refresh/",
        method: "POST",
      }),
    }),
    verify: builder.mutation<void, void>({
      query: () => ({
        url: "jwt/verify/",
        method: "POST",
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "logout/",
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (email) => ({
        url: "users/reset_password/",
        method: "POST",
        body: {
          email,
        },
      }),
    }),
    confirmPasswordReset: builder.mutation({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: "users/reset_password_confirm/",
        method: "POST",
        body: {
          uid,
          token,
          new_password,
          re_new_password,
        },
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "users/me/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    resetEmail: builder.mutation({
      query: (email) => ({
        url: "users/reset_email/",
        method: "POST",
        body: {
          email,
        },
        headers: { "Content-Type": "application/json" },
      }),
    }),
    confirmEmailReset: builder.mutation({
      query: ({ uid, token, new_email, re_new_email }) => ({
        url: "users/reset_email_confirm/",
        method: "POST",
        body: {
          uid,
          token,
          new_email,
          re_new_email,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useResendActivationMutation,
  useActivateMutation,
  useSignInMutation,
  useRetrieveUserQuery,
  useRefreshMutation,
  useVerifyMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useConfirmPasswordResetMutation,
  useUpdateProfileMutation,
  useResetEmailMutation,
  useConfirmEmailResetMutation,
} = authApiSlice;
