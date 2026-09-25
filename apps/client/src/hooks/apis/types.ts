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

export enum BoardsQueryTag {
  CreateBoard = "CreateBoard",
  GetBoards = "GetBoards",
  GetBoardById = "GetBoardById",
  RenameBoard = "RenameBoard",
  DeleteBoard = "DeleteBoard",
}

export enum ColumnsQueryTag {
  CreateColumn = "CreateColumn",
  GetColumns = "GetColumns",
  RenameColumn = "RenameColumn",
  DeleteColumn = "DeleteColumn",
}

export enum CardsQueryTag {
  CreateCard = "CreateCard",
  UpdateCard = "UpdateCard",
  DeleteCard = "DeleteCard",
}
