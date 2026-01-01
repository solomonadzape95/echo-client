import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";

export interface Election {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: "pending" | "active" | "completed";
  startDate: string;
  endDate: string;
  domainId: string;
  createdAt: string;
  updatedAt: string;
}

export function useElections() {
  return useQuery({
    queryKey: ["elections"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Election[]>>("/election");
      return response;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}
