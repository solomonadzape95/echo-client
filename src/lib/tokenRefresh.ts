import { authService } from "./auth";

let refreshPromise: Promise<void> | null = null;

export async function refreshTokenIfNeeded(): Promise<void> {
  // If a refresh is already in progress, wait for it
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      await authService.refreshToken();
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Optionally redirect to login on refresh failure
      // window.location.href = "/login";
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Set up automatic token refresh before expiration (e.g., every 14 minutes)
// Access tokens expire in 15 minutes, so refresh every 14 minutes
export function setupTokenRefresh(): () => void {
  const interval = setInterval(() => {
    refreshTokenIfNeeded().catch(console.error);
  }, 14 * 60 * 1000); // 14 minutes

  // Return cleanup function
  return () => clearInterval(interval);
}

