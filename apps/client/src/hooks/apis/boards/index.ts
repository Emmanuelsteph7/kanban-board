import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Api } from "../../../types";
import {
  createBoardService,
  deleteBoardService,
  getBoardByIdService,
  getBoardsService,
  renameBoardService,
} from "../../../services/boards";
import {
  BoardsQueryTag,
  type MutationOptions,
  type QueryOptions,
} from "../types";

export const useCreateBoard = (
  options?: MutationOptions<
    Api.Boards.CreateBoard.Response,
    Api.Boards.CreateBoard.Request
  >,
) => {
  return useMutation<
    Api.Boards.CreateBoard.Response,
    AxiosError<any>,
    Api.Boards.CreateBoard.Request
  >({
    mutationFn: (payload) => createBoardService(payload),
    mutationKey: [BoardsQueryTag.CreateBoard],
    ...options,
  });
};

export const useGetBoards = (
  options?: QueryOptions<Api.Boards.GetBoards.Response>,
) => {
  return useQuery<Api.Boards.GetBoards.Response, AxiosError<any>>({
    queryKey: [BoardsQueryTag.GetBoards],
    queryFn: () => getBoardsService(),
    ...options,
  });
};

export const useGetBoardById = (
  payload: Api.Boards.GetBoardById.Request,
  options?: QueryOptions<Api.Boards.GetBoardById.Response>,
) => {
  return useQuery<Api.Boards.GetBoardById.Response, AxiosError<any>>({
    queryKey: [BoardsQueryTag.GetBoardById, payload],
    queryFn: () => getBoardByIdService(payload),
    ...options,
  });
};

export const useRenameBoard = (
  options?: MutationOptions<
    Api.Boards.RenameBoard.Response,
    Api.Boards.RenameBoard.Request
  >,
) => {
  return useMutation<
    Api.Boards.RenameBoard.Response,
    AxiosError<any>,
    Api.Boards.RenameBoard.Request
  >({
    mutationFn: (payload) => renameBoardService(payload),
    mutationKey: [BoardsQueryTag.RenameBoard],
    ...options,
  });
};

export const useDeleteBoard = (
  options?: MutationOptions<void, Api.Boards.DeleteBoard.Request>,
) => {
  return useMutation<void, AxiosError<any>, Api.Boards.DeleteBoard.Request>({
    mutationFn: (payload) => deleteBoardService(payload),
    mutationKey: [BoardsQueryTag.DeleteBoard],
    ...options,
  });
};
