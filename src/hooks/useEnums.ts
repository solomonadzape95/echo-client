import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";

export interface EnumsData {
  faculties: Record<string, string>;
  departments: Record<string, string>;
  facultyDepartmentMap: Record<string, string[]>;
}

export function useEnums() {
  return useQuery({
    queryKey: ["enums"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<EnumsData>>("/enum");
      return response;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

export function useFaculties() {
  return useQuery({
    queryKey: ["enums", "faculties"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Record<string, string>>>("/enum/faculties");
      return response;
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["enums", "departments"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Record<string, string>>>("/enum/departments");
      return response;
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useDepartmentsByFaculty(faculty: string | undefined) {
  return useQuery({
    queryKey: ["enums", "faculties", faculty, "departments"],
    queryFn: async () => {
      if (!faculty) throw new Error("Faculty is required");
      const response = await api.get<ApiResponse<string[]>>(
        `/enum/faculties/${encodeURIComponent(faculty)}/departments`
      );
      return response;
    },
    enabled: !!faculty,
    staleTime: 1000 * 60 * 60,
  });
}

