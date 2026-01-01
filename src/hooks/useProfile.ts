import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";

export interface ProfileData {
  profile: {
    id: string;
    username: string;
    regNumber: string;
    name: string;
    class?: {
      id: string;
      name: string;
      department?: {
        id: string;
        name: string;
        faculty?: {
          id: string;
          name: string;
        };
      };
    };
    createdAt: string;
    isVerified: boolean;
  };
  votingHistory: Array<{
    voteId: string;
    electionId: string;
    electionName: string;
    electionDescription: string;
    votedAt: string;
    receiptCode: string | null;
  }>;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProfileData>>("/profile");
      return response;
    },
  });
}

