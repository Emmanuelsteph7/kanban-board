import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Api } from "../../../types";
import {
  createColumnService,
  DeleteColumnService,
  getColumnsService,
  RenameColumnService,
} from "../../../services/columns";
import { ColumnsQueryTag, type MutationOptions, type QueryOptions } from "../types";

export const useCreateColumn = (
  options?: MutationOptions<
    Api.Columns.CreateColumn.Response,
    Api.Columns.CreateColumn.Request
  >,
) => {
  return useMutation<
    Api.Columns.CreateColumn.Response,
    AxiosError<any>,
    Api.Columns.CreateColumn.Request
  >({
    mutationFn: (payload) => createColumnService(payload),
    mutationKey: [ColumnsQueryTag.CreateColumn],
    ...options,
  });
};

export const useGetColumns = (
  payload: Api.Columns.GetColumns.Request,
  options?: QueryOptions<Api.Columns.GetColumns.Response>,
) => {
  return useQuery<Api.Columns.GetColumns.Response, AxiosError<any>>({
    queryKey: [ColumnsQueryTag.GetColumns, payload.boardId],
    queryFn: () => getColumnsService(payload),
    ...options,
  });
};

export const useRenameColumn = (
  options?: MutationOptions<
    Api.Columns.RenameColumn.Response,
    Api.Columns.RenameColumn.Request
  >,
) => {
  return useMutation<
    Api.Columns.RenameColumn.Response,
    AxiosError<any>,
    Api.Columns.RenameColumn.Request
  >({
    mutationFn: (payload) => RenameColumnService(payload),
    mutationKey: [ColumnsQueryTag.RenameColumn],
    ...options,
  });
};

export const useDeleteColumn = (
  options?: MutationOptions<void, Api.Columns.DeleteColumn.Request>,
) => {
  return useMutation<void, AxiosError<any>, Api.Columns.DeleteColumn.Request>({
    mutationFn: (payload) => DeleteColumnService(payload),
    mutationKey: [ColumnsQueryTag.DeleteColumn],
    ...options,
  });
};
