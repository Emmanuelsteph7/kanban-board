import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type QueryOptions<T> = Omit<
  UseQueryOptions<T, AxiosError<any>>,
  "queryKey"
>;

export type MutationOptions<T, Q> = Omit<
  UseMutationOptions<T, AxiosError<any>, Q>,
  "mutationKey" | "mutationFn"
>;

export enum AuthQueryTag {
  Login = "Login",
  Signup = "Signup",
}
