import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Api } from "../../types";
import { axiosConfig } from "../../config/axios";

export const loginService = async (
  payload: Api.Auth.Login.Request,
  config?: AxiosRequestConfig,
): Promise<Api.Auth.Login.Response> => {
  const res = await axiosConfig.post<
    Api.Auth.Login.Response,
    AxiosResponse<Api.Auth.Login.Response>
  >("/auth/login", payload, config);

  return res.data;
};

export const signupService = async (
  payload: Api.Auth.Signup.Request,
  config?: AxiosRequestConfig,
): Promise<Api.Auth.Signup.Response> => {
  const res = await axiosConfig.post<
    Api.Auth.Signup.Response,
    AxiosResponse<Api.Auth.Signup.Response>
  >("/auth/signup", payload, config);

  return res.data;
};
