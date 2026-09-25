import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Api } from "../../types";
import { axiosConfig } from "../../config/axios";

export const createColumnService = async (
  payload: Api.Columns.CreateColumn.Request,
  config?: AxiosRequestConfig,
): Promise<Api.Columns.CreateColumn.Response> => {
  const res = await axiosConfig.post<
    Api.Columns.CreateColumn.Response,
    AxiosResponse<Api.Columns.CreateColumn.Response>
  >(`/boards/${payload.boardId}/columns`, payload, config);

  return res.data;
};

export const getColumnsService = async (
  payload: Api.Columns.GetColumns.Request,
  config?: AxiosRequestConfig,
): Promise<Api.Columns.GetColumns.Response> => {
  const res = await axiosConfig.get<
    Api.Columns.GetColumns.Response,
    AxiosResponse<Api.Columns.GetColumns.Response>
  >(`/boards/${payload.boardId}/columns`, config);

  return res.data;
};

export const RenameColumnService = async (
  payload: Api.Columns.RenameColumn.Request,
  config?: AxiosRequestConfig,
): Promise<Api.Columns.RenameColumn.Response> => {
  const res = await axiosConfig.get<
    Api.Columns.RenameColumn.Response,
    AxiosResponse<Api.Columns.RenameColumn.Response>
  >(`/boards/columns/${payload.id}`, config);

  return res.data;
};

export const DeleteColumnService = async (
  payload: Api.Columns.DeleteColumn.Request,
  config?: AxiosRequestConfig,
): Promise<void> => {
  const res = await axiosConfig.delete(`/boards/columns/${payload.id}`, config);

  return res.data;
};
