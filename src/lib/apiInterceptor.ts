import { authService } from "./auth";

// Get API base URL (same logic as api.ts)
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
  // return "http://localhost:3001";
  return "https://echo-fmir.onrender.com";  
}

const API_BASE_URL = getApiBaseUrl();

// Track if a refresh is in progress to avoid multiple simultaneous refreshes
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

// Queue of failed requests to retry after refresh
type QueuedRequest = {
  resolve: (value: Response) => void;
  reject: (error: Error) => void;
  url: string;
  options: RequestInit;
};

const failedRequestQueue: QueuedRequest[] = [];

/**
 * Attempt to refresh the access token
 */
async function refreshAccessToken(): Promise<void> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      // Use direct fetch to avoid circular dependency with intercepted API
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Token refresh failed" }));
        throw new Error(errorData.message || "Token refresh failed");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Token refresh failed");
      }
      console.log("[API INTERCEPTOR] Token refreshed successfully");
    } catch (error) {
      console.error("[API INTERCEPTOR] Token refresh failed:", error);
      // Clear any stored auth state
      // Redirect to login on refresh failure
      const currentPath = window.location.pathname;
      const isAdminPath = currentPath.startsWith("/admin");
      const loginPath = isAdminPath ? "/admin/login" : "/login";
      
      // Only redirect if not already on login page
      if (!currentPath.includes("login")) {
        window.location.href = loginPath;
      }
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Process queued requests after token refresh
 */
async function processQueue(error: Error | null): Promise<void> {
  const queue = [...failedRequestQueue];
  failedRequestQueue.length = 0;

  for (const request of queue) {
    if (error) {
      request.reject(error);
    } else {
      try {
        const response = await fetch(request.url, request.options);
        request.resolve(response);
      } catch (err) {
        request.reject(err instanceof Error ? err : new Error("Request failed"));
      }
    }
  }
}

/**
 * Intercept fetch requests to handle token refresh automatically
 */
export async function interceptedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Make the initial request
  let response = await fetch(url, options);

  // If we get a 401, try to refresh the token
  if (response.status === 401) {
    // Don't retry refresh endpoint itself
    if (url.includes("/auth/refresh") || url.includes("/admin/auth/login")) {
      return response;
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestQueue.push({
          resolve,
          reject,
          url,
          options,
        });
      });
    }

    try {
      // Attempt to refresh the token
      await refreshAccessToken();

      // Retry the original request with the new token
      response = await fetch(url, options);

      // If still 401 after refresh, the refresh token is invalid
      if (response.status === 401) {
        const currentPath = window.location.pathname;
        const isAdminPath = currentPath.startsWith("/admin");
        const loginPath = isAdminPath ? "/admin/login" : "/login";
        
        if (!currentPath.includes("login")) {
          window.location.href = loginPath;
        }
        throw new Error("Authentication failed after token refresh");
      }

      // Process any queued requests
      await processQueue(null);
    } catch (error) {
      // Process queued requests with error
      await processQueue(error instanceof Error ? error : new Error("Token refresh failed"));
      throw error;
    }
  }

  return response;
}

/**
 * Enhanced API methods with automatic token refresh
 */
export const interceptedApi = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await interceptedFetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await interceptedFetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await interceptedFetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await interceptedFetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return handleResponse<T>(response);
  },
};

/**
 * Handle API response (same as original api.ts)
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    if (isJson) {
      try {
        const error: { success: false; message: string; errors?: Array<{ path: string[]; message: string }> } = await response.json();
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

