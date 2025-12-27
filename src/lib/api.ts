// API base URL - Bun exposes env vars via import.meta.env
// Use BUN_PUBLIC_API_URL if set, otherwise fallback to default
function getApiBaseUrl(): string {
  try {
    if (import.meta.env && typeof import.meta.env === "object") {
      const envUrl = (import.meta.env as Record<string, unknown>).BUN_PUBLIC_API_URL;
      if (typeof envUrl === "string" && envUrl.trim()) {
        return envUrl.trim();
      }
    }
  } catch (error) {
    console.warn("Could not read BUN_PUBLIC_API_URL from environment:", error);
  }
  return "http://localhost:3001";
  // return "https://echo-fmir.onrender.com";
}

const API_BASE_URL = getApiBaseUrl();
console.log(API_BASE_URL);
export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ path: string[]; message: string }>;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    if (isJson) {
      const error: ApiError = await response.json();
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  if (isJson) {
    return response.json();
  }

  return response.text() as unknown as T;
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
    });

    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
    });

    return handleResponse<T>(response);
  },
};

