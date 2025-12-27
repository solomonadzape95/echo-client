import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

// Example React Query hook - you can use this as a template for other API calls
export function useElections() {
  return useQuery({
    queryKey: ["elections"],
    queryFn: () => api.get("/elections"),
  });
}

// Example mutation hook (for creating/updating)
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// 
// export function useCreateElection() {
//   const queryClient = useQueryClient();
//   
//   return useMutation({
//     mutationFn: (data: unknown) => api.post("/elections", data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["elections"] });
//     },
//   });
// }

