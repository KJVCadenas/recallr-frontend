import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/client";

export interface Deck {
  id: string;
  name: string;
  description: string;
  userId: string;
  cardCount: number;
  lastReviewed: string;
  createdAt: string;
}

interface CreateDeckData {
  name: string;
  description: string;
}

interface UpdateDeckData {
  name?: string;
  description?: string;
}

export function useDecks() {
  return useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      const response = await api.get<Deck[]>("/api/decks");
      return response.data;
    },
  });
}

export function useDeck(id: string) {
  return useQuery({
    queryKey: ["decks", id],
    queryFn: async () => {
      const response = await api.get<Deck>(`/api/decks/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDeckData) => {
      const response = await api.post<Deck>("/api/decks", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useUpdateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDeckData }) => {
      const response = await api.put<Deck>(`/api/decks/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/decks/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}
