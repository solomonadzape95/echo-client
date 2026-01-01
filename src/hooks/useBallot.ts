import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";

export interface BallotCandidate {
  id: string;
  name: string;
  regNumber: string;
  quote: string;
  manifesto: string;
  image: string;
}

export interface BallotOffice {
  id: string;
  name: string;
  description: string;
  electionId: string;
  dependsOn: string | null;
  candidates: BallotCandidate[];
}

export interface BallotData {
  election: {
    id: string;
    name: string;
    description: string | null;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
    domainId: string;
  };
  offices: BallotOffice[];
}

export function useBallot(electionId: string | undefined) {
  return useQuery({
    queryKey: ["ballot", electionId],
    queryFn: async () => {
      if (!electionId) throw new Error("Election ID is required");
      const response = await api.get<ApiResponse<BallotData>>(`/ballot?electionId=${electionId}`);
      return response;
    },
    enabled: !!electionId,
  });
}

