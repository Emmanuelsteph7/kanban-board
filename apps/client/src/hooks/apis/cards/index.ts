import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Api } from "../../../types";
import {
  createCardService,
  deleteCardService,
  updateCardService,
} from "../../../services/cards";
import { CardsQueryTag, type MutationOptions } from "../types";

export const useCreateCard = (
  options?: MutationOptions<
    Api.Cards.CreateCard.Response,
    Api.Cards.CreateCard.Request
  >,
) => {
  return useMutation<
    Api.Cards.CreateCard.Response,
    AxiosError<any>,
    Api.Cards.CreateCard.Request
  >({
    mutationFn: (payload) => createCardService(payload),
    mutationKey: [CardsQueryTag.CreateCard],
    ...options,
  });
};

export const useUpdateCard = (
  options?: MutationOptions<
    Api.Cards.UpdateCard.Response,
    Api.Cards.UpdateCard.Request
  >,
) => {
  return useMutation<
    Api.Cards.UpdateCard.Response,
    AxiosError<any>,
    Api.Cards.UpdateCard.Request
  >({
    mutationFn: (payload) => updateCardService(payload),
    mutationKey: [CardsQueryTag.UpdateCard],
    ...options,
  });
};

export const useDeleteCard = (
  options?: MutationOptions<void, Api.Cards.DeleteCard.Request>,
) => {
  return useMutation<void, AxiosError<any>, Api.Cards.DeleteCard.Request>({
    mutationFn: (payload) => deleteCardService(payload),
    mutationKey: [CardsQueryTag.DeleteCard],
    ...options,
  });
};
