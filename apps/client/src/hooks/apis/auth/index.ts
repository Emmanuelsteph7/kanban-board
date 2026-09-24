import { useMutation } from "@tanstack/react-query";
import type { Api } from "../../../types";
import { AuthQueryTag, type MutationOptions } from "../types";
import type { AxiosError } from "axios";
import { loginService, signupService } from "../../../services/auth";

export const useLogin = (
  options?: MutationOptions<Api.Auth.Login.Response, Api.Auth.Login.Request>,
) => {
  return useMutation<
    Api.Auth.Login.Response,
    AxiosError<any>,
    Api.Auth.Login.Request
  >({
    mutationFn: (payload) => loginService(payload),
    mutationKey: [AuthQueryTag.Login],
    ...options,
  });
};

export const useSignup = (
  options?: MutationOptions<Api.Auth.Signup.Response, Api.Auth.Signup.Request>,
) => {
  return useMutation<
    Api.Auth.Signup.Response,
    AxiosError<any>,
    Api.Auth.Signup.Request
  >({
    mutationFn: (payload) => signupService(payload),
    mutationKey: [AuthQueryTag.Signup],
    ...options,
  });
};
