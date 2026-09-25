import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Api } from "../../types";
import { axiosConfig } from "../../config/axios";

export const createBoardService = async (
  payload: Api.Boards.CreateBoard.Request,
  config?: AxiosRequestConfig,
): Promise<Api.Boards.CreateBoard.Response> => {
  const res = await axiosConfig.post<
    Api.Boards.CreateBoard.Response,
    AxiosResponse<Api.Boards.CreateBoard.Response>
  >("/boards", payload, config);

  return res.data;
};

export const getBoardsService = async (
  config?: AxiosRequestConfig,
): Promise<Api.Boards.GetBoards.Response> => {
  const res = await axiosConfig.get<
    Api.Boards.GetBoards.Response,
    AxiosResponse<Api.Boards.GetBoards.Response>
  >("/boards", config);

  return res.data;
};

export const renameBoardService = async (
  payload: Api.Boards.RenameBoard.Request,
  config?: AxiosRequestConfig,
): Promise<Api.Boards.RenameBoard.Response> => {
  const res = await axiosConfig.patch<
    Api.Boards.RenameBoard.Response,
    AxiosResponse<Api.Boards.RenameBoard.Response>
  >(`/boards/${payload.id}`, payload, config);

  return res.data;
};

export const deleteBoardService = async (
  payload: Api.Boards.DeleteBoard.Request,
  config?: AxiosRequestConfig,
): Promise<void> => {
  const res = await axiosConfig.delete(`/boards/${payload.id}`, config);

  return res.data;
};

export const getBoardByIdService = async (
  payload: Api.Boards.GetBoardById.Request,
  config?: AxiosRequestConfig,
): Promise<Api.Boards.GetBoardById.Response> => {
  const res = await axiosConfig.get<
    Api.Boards.GetBoardById.Response,
    AxiosResponse<Api.Boards.GetBoardById.Response>
  >(`/boards/${payload.id}`, config);

  return res.data;
};
