import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";

// Helper function to create a secure reference code from data
async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export interface VerifyEligibilityResponse {
  token: {
    id: string;
    election: string;
    tokenHash: string;
    usedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  publicKey: string;
}

export interface VoteSubmissionData {
  electionId: string;
  tokenId: string;
  voteData: Record<string, string>; // { officeId: candidateId }
  prevHash?: string;
}

export interface VoteResponse {
  vote: {
    id: string;
    prevHash: string;
    currentHash: string;
    voteDataHash: string;
    encryptedVoteData: string | null;
    tokenId: string;
    election: string;
    createdAt: string;
    updatedAt: string;
  };
  receipt: {
    code: string;
    id: string;
  };
}

export const votingService = {
  /**
   * Verify eligibility and get voting token
   */
  async verifyEligibility(electionId: string): Promise<ApiResponse<VerifyEligibilityResponse>> {
    return api.get<ApiResponse<VerifyEligibilityResponse>>(`/verify-eligibility?electionId=${electionId}`);
  },

  /**
   * Get the last vote reference code for an election (for linking votes together)
   * Returns null if no votes exist yet (first vote in the election)
   */
  async getLastVoteHash(electionId: string): Promise<string | null> {
    try {
      const response = await api.get<ApiResponse<Array<{ currentHash: string; createdAt: string }>>>(`/vote/by-election?electionId=${electionId}`);
      if (response.success && response.data.length > 0) {
        // Votes are ordered by createdAt desc, so first one is most recent
        return response.data[0].currentHash;
      }
      return null; // No votes yet - this will be the first vote
    } catch (error) {
      console.error("Failed to get last vote reference:", error);
      // If error, return null - backend will handle first vote
      return null;
    }
  },

  /**
   * Submit a vote
   */
  async submitVote(data: VoteSubmissionData): Promise<ApiResponse<VoteResponse>> {
    // Create vote data reference code
    const voteDataString = JSON.stringify(data.voteData);
    const voteDataHash = await sha256(voteDataString);

    // Create current reference code (from previous reference + vote data reference)
    const prevHash = data.prevHash || "0000000000000000000000000000000000000000000000000000000000000000";
    const currentHash = await sha256(prevHash + voteDataHash);

    // Build payload - only include optional fields if they have values
    const payload: any = {
      electionId: data.electionId,
      tokenId: data.tokenId,
      voteDataHash,
      currentHash,
    };

    // Only include voteData if it's not empty
    if (Object.keys(data.voteData).length > 0) {
      payload.voteData = data.voteData;
    }

    // Only include prevHash if provided
    if (data.prevHash) {
      payload.prevHash = data.prevHash;
    }

    console.log('[VOTING SERVICE] Submitting vote with payload:', {
      ...payload,
      voteData: payload.voteData ? `${Object.keys(payload.voteData).length} selections` : 'empty/undefined',
    });

    return api.post<ApiResponse<VoteResponse>>("/vote", payload);
  },
};

export function useVoting() {
  const queryClient = useQueryClient();

  const verifyEligibilityMutation = useMutation({
    mutationFn: (electionId: string) => votingService.verifyEligibility(electionId),
  });

  const submitVoteMutation = useMutation({
    mutationFn: (data: VoteSubmissionData) => votingService.submitVote(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["elections"] });
    },
  });

  return {
    verifyEligibility: verifyEligibilityMutation,
    submitVote: submitVoteMutation,
  };
}

