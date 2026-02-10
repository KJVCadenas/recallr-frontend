import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "@/lib/api/client";

interface LoginData {
  email: string;
  password: string;
  recaptchaToken?: string;
}

interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<AuthResponse>("/api/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Auth token is now in HTTP-only cookie, no localStorage needed
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Login API error:", error);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<AuthResponse>("/api/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Auth token is now in HTTP-only cookie, no localStorage needed
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Registration API error:", error);
    },
  });
}

export function useAuthStatus() {
  return useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const response = await api.get("/api/auth/verify");
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
