import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";

export interface ReceiptVerificationData {
  receipt: {
    id: string;
    code: string;
    createdAt: string;
  };
  vote: {
    id: string;
    currentHash: string;
    prevHash: string;
    voteDataHash: string;
    createdAt: string;
  };
  election: {
    id: string;
    name: string;
    description: string | null;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
  };
}

export function useReceiptVerification() {
  return useMutation({
    mutationFn: async (receiptCode: string): Promise<ApiResponse<ReceiptVerificationData>> => {
      return api.get<ApiResponse<ReceiptVerificationData>>(`/receipt?code=${encodeURIComponent(receiptCode)}`);
    },
  });
}

