import { useQuery } from "@tanstack/react-query";
import { votingService } from "./useVoting";

/**
 * Hook to check if the current user has voted for a specific election
 * This works by attempting to verify eligibility - if the user has already voted,
 * the token will be marked as used and the verification will fail with a specific error
 */
export function useVoteStatus(electionId: string | undefined) {
  return useQuery({
    queryKey: ["voteStatus", electionId],
    queryFn: async () => {
      if (!electionId) return false;
      
      try {
        // Try to verify eligibility
        const response = await votingService.verifyEligibility(electionId);
        
        // If verification succeeds, check if token is already used
        if (response.success && response.data) {
          // If token exists and is already used, user has voted
          if (response.data.token.usedAt !== null) {
            return true;
          }
          // Token exists but not used - user hasn't voted yet
          return false;
        }
        
        // If verification fails, check the error message
        if (!response.success) {
          const message = response.message?.toLowerCase() || "";
          // Common error messages that indicate user has already voted
          if (
            message.includes("already voted") ||
            message.includes("token already used") ||
            message.includes("already cast") ||
            message.includes("vote already") ||
            message.includes("forbidden") ||
            message.includes("not eligible")
          ) {
            return true;
          }
        }
        
        return false;
      } catch (error) {
        // If there's an error, check if it's about already voting
        if (error instanceof Error) {
          const message = error.message.toLowerCase();
          if (
            message.includes("already voted") ||
            message.includes("token already used") ||
            message.includes("already cast") ||
            message.includes("vote already") ||
            message.includes("403") || // Forbidden often means already voted
            message.includes("forbidden")
          ) {
            return true;
          }
        }
        // If we can't determine, assume they haven't voted (safer for UX)
        // This allows users to proceed with voting if there's a network error, etc.
        return false;
      }
    },
    enabled: !!electionId,
    retry: false, // Don't retry on failure
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus to avoid unnecessary API calls
  });
}

