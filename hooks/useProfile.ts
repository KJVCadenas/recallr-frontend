import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/client";

export interface Profile {
  id: string;
  email: string;
  username?: string;
}

export interface UpdateProfileData {
  username?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      const response = await api.get("/api/auth/profile");
      return response.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData): Promise<Profile> => {
      const response = await api.put("/api/auth/profile", data);
      return response.data;
    },
    onSuccess: (updatedProfile) => {
      // Update the cached profile data
      queryClient.setQueryData(["profile"], updatedProfile);
    },
  });
}