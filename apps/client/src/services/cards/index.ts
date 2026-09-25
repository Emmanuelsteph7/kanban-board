import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Api } from "../../types";
import { axiosConfig } from "../../config/axios";

export const createCardService = async (
  payload: Api.Cards.CreateCard.Request,
  config?: AxiosRequestConfig,
): Promise<Api.Cards.CreateCard.Response> => {
  const res = await axiosConfig.post<
    Api.Cards.CreateCard.Response,
    AxiosResponse<Api.Cards.CreateCard.Response>
  >(`/columns/${payload.columnId}/cards`, payload, config);

  return res.data;
};

export const updateCardService = async (
  payload: Api.Cards.UpdateCard.Request,
  config?: AxiosRequestConfig,
): Promise<Api.Cards.UpdateCard.Response> => {
  const res = await axiosConfig.patch<
    Api.Cards.UpdateCard.Response,
    AxiosResponse<Api.Cards.UpdateCard.Response>
  >(`/cards/${payload.id}`, payload, config);

  return res.data;
};

export const deleteCardService = async (
  payload: Api.Cards.DeleteCard.Request,
  config?: AxiosRequestConfig,
): Promise<void> => {
  const res = await axiosConfig.delete(`/cards/${payload.id}`, config);

  return res.data;
};
