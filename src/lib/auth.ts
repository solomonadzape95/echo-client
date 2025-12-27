import { api } from "./api";
import type { ApiResponse } from "./api";

export interface User {
  id: string;
  regNumber: string;
  username: string;
  class: string;
}

export interface LoginResponse {
  user: User;
}

export interface RegisterResponse {
  user: User;
}

export interface MasterlistRecord {
  id: string;
  regNumber: string;
  firstName: string;
  lastName: string;
  classId: string;
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
  activated: boolean;
}

export const authService = {
  async login(regNumber: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return api.post<ApiResponse<LoginResponse>>("/auth/login", {
      regNumber,
      password,
    });
  },

  async register(
    regNumber: string,
    username: string,
    password: string,
    classId: string
  ): Promise<ApiResponse<RegisterResponse>> {
    return api.post<ApiResponse<RegisterResponse>>("/auth/register", {
      regNumber,
      username,
      password,
      classId,
    });
  },

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return api.post<ApiResponse<{ message: string }>>("/auth/logout", {});
  },

  async refreshToken(): Promise<ApiResponse<{ message: string }>> {
    return api.post<ApiResponse<{ message: string }>>("/auth/refresh", {});
  },
};

export const masterlistService = {
  async verifyRegNumber(regNumber: string): Promise<ApiResponse<MasterlistRecord>> {
    // Use the public verification endpoint which returns the masterlist record
    // with populated class, department, and faculty
    return api.get<ApiResponse<MasterlistRecord>>(`/masterlist/verify?regNumber=${encodeURIComponent(regNumber)}`);
  },
};

