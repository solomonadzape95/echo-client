import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";

// ==================== Types ====================

export interface AdminStats {
  summary: {
    totalElections: number;
    totalEligibleVoters: number;
    totalVotesCast: number;
    overallTurnoutPercentage: number;
    electionsByStatus: {
      pending: number;
      active: number;
      completed: number;
    };
    electionsByType: {
      class: number;
      department: number;
      faculty: number;
    };
  };
  elections: Array<{
    electionId: string;
    electionName: string;
    electionType: string;
    electionStatus: string;
    eligibleVoters: number;
    votesCast: number;
    turnoutPercentage: number;
  }>;
}

export interface AdminVoter {
  id: string;
  username: string;
  regNumber: string;
  class: string;
  createdAt: string;
}

export interface AdminElection {
  id: string;
  name: string;
  type: string;
  status: "pending" | "active" | "completed";
  startDate: string;
  endDate: string;
  description: string | null;
  domainId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminClass {
  id: string;
  level: string;
  faculty: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOffice {
  id: string;
  name: string;
  description: string;
  election: string;
  dependsOn: string | null;
}

export interface AdminCandidate {
  id: string;
  office: string;
  voterId: string;
  quote: string;
  manifesto: string;
  image: string;
}

export interface CreateElectionData {
  name: string;
  type: "class" | "department" | "faculty";
  startDate: string;
  endDate: string;
  description?: string;
  domainId: string;
  offices?: Array<{
    title: string;
    description: string;
  }>;
}

export interface CreateOfficeData {
  name: string;
  description: string;
  election: string;
  dependsOn?: string | null;
}

export interface CreateCandidateData {
  officeId: string;
  voterId: string;
  quote?: string;
  manifesto?: string;
  image?: string;
}

export interface AdminAdmin {
  id: string;
  username: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminData {
  username: string;
  email: string;
  password: string;
  role?: "super_admin" | "admin" | "moderator";
  fullName?: string;
}

export interface UpdateAdminData {
  email?: string;
  password?: string;
  role?: "super_admin" | "admin" | "moderator";
  fullName?: string;
}

// ==================== Hooks ====================

// Admin Stats
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AdminStats>>("/admin/stats");
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache for 10 minutes
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchInterval: false, // Don't poll automatically
    placeholderData: (previousData) => previousData, // Keep previous data while refetching
  });
}

export function useAdminElectionStats(electionId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "stats", "election", electionId],
    queryFn: async () => {
      if (!electionId) throw new Error("Election ID is required");
      const response = await api.get<ApiResponse<any>>(`/admin/stats/election/${electionId}`);
      return response;
    },
    enabled: !!electionId,
  });
}

// Admin Voters
export function useAdminVoters(classId?: string) {
  return useQuery({
    queryKey: ["admin", "voters", classId],
    queryFn: async () => {
      const url = classId 
        ? `/admin/voter?classId=${classId}`
        : "/admin/voter";
      const response = await api.get<ApiResponse<AdminVoter[]>>(url);
      return response;
    },
  });
}

export interface VoterSearchResult {
  id: string;
  username: string;
  regNumber: string;
  name: string;
  class: string;
  classLevel: string;
  department: string;
  faculty: string;
}

export function useSearchVotersByElection(electionId: string | undefined, query: string) {
  return useQuery({
    queryKey: ["admin", "voters", "search", electionId, query],
    queryFn: async () => {
      if (!electionId || !query || query.length < 3) {
        throw new Error("Election ID and query (min 3 chars) are required");
      }
      const response = await api.get<ApiResponse<VoterSearchResult[]>>(
        `/admin/voter/search?electionId=${electionId}&query=${encodeURIComponent(query)}`
      );
      return response;
    },
    enabled: !!electionId && !!query && query.length >= 3,
  });
}

export function useAdminVoter(voterId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "voter", voterId],
    queryFn: async () => {
      if (!voterId) throw new Error("Voter ID is required");
      const response = await api.get<ApiResponse<AdminVoter>>(`/admin/voter/${voterId}`);
      return response;
    },
    enabled: !!voterId,
  });
}

// Admin Elections
export function useAdminElections(type?: string, status?: string) {
  return useQuery({
    queryKey: ["admin", "elections", type, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (status) params.append("status", status);
      const url = `/admin/election${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await api.get<ApiResponse<AdminElection[]>>(url);
      return response;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

export function useAdminElection(electionId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "election", electionId],
    queryFn: async () => {
      if (!electionId) throw new Error("Election ID is required");
      const response = await api.get<ApiResponse<AdminElection>>(`/admin/election/${electionId}`);
      return response;
    },
    enabled: !!electionId,
  });
}

export function useCreateElection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateElectionData) => {
      const response = await api.post<ApiResponse<AdminElection>>("/admin/election", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "elections"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useUpdateElection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateElectionData> }) => {
      const response = await api.put<ApiResponse<AdminElection>>(`/admin/election/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "elections"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "election"] });
    },
  });
}

export function useDeleteElection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<{ message: string }>>(`/admin/election/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "elections"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useCalculateResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (electionId: string) => {
      const response = await api.post<ApiResponse<any>>(`/admin/election/${electionId}/calculate-results`, {});
      return response;
    },
    onSuccess: (_, electionId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "election"] });
      queryClient.invalidateQueries({ queryKey: ["election"] });
      queryClient.invalidateQueries({ queryKey: ["election", electionId, "results"] });
    },
  });
}

export interface ElectionResultsData {
  electionId: string;
  electionName: string;
  hasResults: boolean;
  message?: string;
  calculatedAt?: string;
  calculatedBy?: string;
  offices: Array<{
    officeId: string;
    officeName: string;
    officeDescription: string;
    totalVotes: number;
    candidates: Array<{
      candidateId: string;
      candidateName: string;
      voteCount: number;
      percentage: number;
      isWinner: boolean;
    }>;
  }>;
}

export function useElectionResults(electionId: string | undefined) {
  return useQuery({
    queryKey: ["election", electionId, "results"],
    queryFn: async () => {
      if (!electionId) throw new Error("Election ID is required");
      const response = await api.get<ApiResponse<ElectionResultsData>>(`/election/${electionId}/results`);
      return response;
    },
    enabled: !!electionId,
  });
}

// Admin Classes
export function useAdminClasses() {
  return useQuery({
    queryKey: ["admin", "classes"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AdminClass[]>>("/admin/class");
      return response;
    },
  });
}

export function useAdminClass(classId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "class", classId],
    queryFn: async () => {
      if (!classId) throw new Error("Class ID is required");
      const response = await api.get<ApiResponse<AdminClass>>(`/admin/class/${classId}`);
      return response;
    },
    enabled: !!classId,
  });
}

export interface CreateClassData {
  level: string;
  faculty: string;
  department: string;
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateClassData) => {
      const response = await api.post<ApiResponse<AdminClass>>("/admin/class", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "classes"] });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateClassData> }) => {
      const response = await api.put<ApiResponse<AdminClass>>(`/admin/class/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "classes"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "class"] });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<{ message: string }>>(`/admin/class/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "classes"] });
    },
  });
}

// Admin Offices
export function useAdminOffices(electionId?: string) {
  return useQuery({
    queryKey: ["admin", "offices", electionId],
    queryFn: async () => {
      const url = electionId
        ? `/admin/office/by-election?electionId=${electionId}`
        : "/admin/office";
      const response = await api.get<ApiResponse<AdminOffice[]>>(url);
      return response;
    },
    enabled: electionId ? !!electionId : true,
  });
}

export function useAdminOffice(officeId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "office", officeId],
    queryFn: async () => {
      if (!officeId) throw new Error("Office ID is required");
      const response = await api.get<ApiResponse<AdminOffice>>(`/admin/office/${officeId}`);
      return response;
    },
    enabled: !!officeId,
  });
}

export function useCreateOffice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOfficeData) => {
      const response = await api.post<ApiResponse<AdminOffice>>("/admin/office", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "offices"] });
    },
  });
}

export function useUpdateOffice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateOfficeData> }) => {
      const response = await api.put<ApiResponse<AdminOffice>>(`/admin/office/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "offices"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "office"] });
    },
  });
}

export function useDeleteOffice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (officeId: string) => {
      const response = await api.delete<ApiResponse<{ success: boolean }>>(`/admin/office/${officeId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "offices"] });
    },
  });
}

// Admin Candidates
export function useAdminCandidates(officeId?: string) {
  return useQuery({
    queryKey: ["admin", "candidates", officeId],
    queryFn: async () => {
      const url = officeId
        ? `/admin/candidate/by-office?officeId=${officeId}`
        : "/admin/candidate";
      const response = await api.get<ApiResponse<AdminCandidate[]>>(url);
      return response;
    },
    enabled: officeId ? !!officeId : true,
  });
}

export function useCreateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCandidateData) => {
      const response = await api.post<ApiResponse<AdminCandidate>>("/admin/candidate", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "candidates"] });
    },
  });
}

// Admin Management
export function useAdminAdmins() {
  return useQuery({
    queryKey: ["admin", "admins"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AdminAdmin[]>>("/admin/admin");
      return response;
    },
  });
}

export function useAdminAdmin(adminId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "admin", adminId],
    queryFn: async () => {
      if (!adminId) throw new Error("Admin ID is required");
      const response = await api.get<ApiResponse<AdminAdmin>>(`/admin/admin/${adminId}`);
      return response;
    },
    enabled: !!adminId,
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateAdminData) => {
      const response = await api.post<ApiResponse<AdminAdmin>>("/admin/admin", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAdminData }) => {
      const response = await api.put<ApiResponse<AdminAdmin>>(`/admin/admin/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "admin"] });
    },
  });
}

// Office Templates
export interface OfficeTemplate {
  title: string;
  description: string;
}

export function useOfficeTemplates(type?: "class" | "department" | "faculty") {
  return useQuery({
    queryKey: ["office-templates", type],
    queryFn: async () => {
      const url = type
        ? `/office-templates?type=${type}`
        : "/office-templates";
      const response = await api.get<ApiResponse<OfficeTemplate[]>>(url);
      return response;
    },
    enabled: !!type,
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<{ message: string }>>(`/admin/admin/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}

