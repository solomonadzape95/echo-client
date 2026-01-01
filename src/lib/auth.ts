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

export interface Admin {
  id: string;
  username: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginResponse {
  admin: Admin;
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
    department?: string | {
      id: string;
      name: string;
      faculty?: {
        id: string;
        name: string;
      };
    };
    faculty?: string;
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

  async adminLogin(username: string, password: string): Promise<ApiResponse<AdminLoginResponse>> {
    // Admin login uses a separate endpoint
    return api.post<ApiResponse<AdminLoginResponse>>("/admin/auth/login", {
      username,
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

  async forgotPassword(regNumber: string, email: string): Promise<ApiResponse<{ message: string; token?: string }>> {
    return api.post<ApiResponse<{ message: string; token?: string }>>("/auth/forgot-password", {
      regNumber,
      email,
    });
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    return api.post<ApiResponse<{ message: string }>>("/auth/reset-password", {
      token,
      password,
    });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return api.post<ApiResponse<{ message: string }>>("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  async updateProfilePicture(profilePictureUrl: string): Promise<ApiResponse<{ message: string }>> {
    return api.put<ApiResponse<{ message: string }>>("/profile/picture", {
      profilePicture: profilePictureUrl,
    });
  },
};

export const masterlistService = {
  async verifyRegNumber(regNumber: string): Promise<ApiResponse<MasterlistRecord> & { alreadyExists?: boolean }> {
    // Use the public verification endpoint which returns the masterlist record
    // with populated class, department, and faculty
    return api.get<ApiResponse<MasterlistRecord> & { alreadyExists?: boolean }>(`/masterlist/verify?regNumber=${encodeURIComponent(regNumber)}`);
  },
};

