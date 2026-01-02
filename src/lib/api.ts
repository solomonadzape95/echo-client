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

// Export API_BASE_URL for use in file uploads
export { API_BASE_URL };
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
      try {
        const error: ApiError = await response.json();
        // Format validation errors if present
        if (error.errors && error.errors.length > 0) {
          const errorMessages = error.errors.map(e => 
            `${e.path.join('.')}: ${e.message}`
          ).join(', ');
          throw new Error(error.message ? `${error.message} - ${errorMessages}` : errorMessages);
        }
        throw new Error(error.message || `API Error: ${response.statusText}`);
      } catch (parseError) {
        // If JSON parsing fails, throw a generic error
        throw new Error(`API Error: ${response.statusText} (${response.status})`);
      }
    }
    throw new Error(`API Error: ${response.statusText} (${response.status})`);
  }

  if (isJson) {
    try {
      return await response.json();
    } catch (parseError) {
      throw new Error('Failed to parse JSON response');
    }
  }

  return response.text() as unknown as T;
}

// Import the intercepted API for automatic token refresh
import { interceptedApi } from "./apiInterceptor";

// Export the intercepted API as the main API
// This automatically handles token refresh on 401 errors
export const api = interceptedApi;

