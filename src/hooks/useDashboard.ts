import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";

export interface DashboardData {
  profile: {
    id: string;
    username: string;
    regNumber: string;
    name: string;
    profilePicture: string | null;
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
  };
  activeElection: {
    id: string;
    slug: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    type: string;
    status: string;
  } | null;
  upcomingElection: {
    id: string;
    slug: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    type: string;
    status: string;
  } | null;
  stats: {
    totalElections: number;
    eligibleElections: number;
    electionsVotedIn: number;
    votesCast: number;
  };
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<DashboardData>>("/dashboard");
      return response;
    },
  });
}

