import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/client";

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: string;
}

interface CreateCardData {
  front: string;
  back: string;
}

interface UpdateCardData {
  front?: string;
  back?: string;
}

export function useCards(deckId: string) {
  return useQuery({
    queryKey: ["cards", deckId],
    queryFn: async () => {
      const response = await api.get<Card[]>(`/api/decks/${deckId}/cards`);
      return response.data;
    },
    enabled: !!deckId,
  });
}

export function useCard(id: string) {
  return useQuery({
    queryKey: ["cards", "single", id],
    queryFn: async () => {
      const response = await api.get<Card>(`/api/cards/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deckId,
      data,
    }: {
      deckId: string;
      data: CreateCardData;
    }) => {
      const response = await api.post<Card>(`/api/decks/${deckId}/cards`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cards", data.deckId] });
      queryClient.invalidateQueries({ queryKey: ["decks"] }); // Update card count
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCardData }) => {
      const response = await api.put<Card>(`/api/cards/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cards", data.deckId] });
      queryClient.invalidateQueries({ queryKey: ["cards", "single", data.id] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const card = await api
        .get<Card>(`/api/cards/${id}`)
        .then((res) => res.data);
      await api.delete(`/api/cards/${id}`);
      return { id, deckId: card.deckId };
    },
    onSuccess: ({ deckId }) => {
      queryClient.invalidateQueries({ queryKey: ["cards", deckId] });
      queryClient.invalidateQueries({ queryKey: ["decks"] }); // Update card count
    },
  });
}
