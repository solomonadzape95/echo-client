import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdBadge, MdLock, MdArrowForward, MdAdminPanelSettings, MdFingerprint } from "react-icons/md";
import { authService } from "../lib/auth";
import { api } from "../lib/api";

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if admin is already authenticated and redirect
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // Try to access an admin endpoint to check if admin is authenticated
        // This will fail if not authenticated or not an admin
        const response = await api.get<{ success: boolean }>("/admin/stats");
        if (response && typeof response === 'object' && 'success' in response && response.success) {
          // Admin is authenticated, redirect to admin dashboard
          navigate("/admin/dashboard", { replace: true });
          return;
        }
      } catch (error) {
        // Admin is not authenticated or not an admin, stay on login page
        // This is expected for unauthenticated users
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await authService.adminLogin(username, password);
      if (response.success) {
        // Redirect to admin dashboard on success
        navigate("/admin/dashboard");
      } else {
        setError(response.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 bg-[#102222] flex items-center justify-center">
        <div className="text-center">
          <div className="loader mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #234848 1px, transparent 1px),
            linear-gradient(to bottom, #234848 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20  mb-1">
            <MdFingerprint className="w-10 h-10 text-[#13ecec]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">echo</h1>
          <p className="text-[#13ecec] text-sm uppercase tracking-wider">ADMIN CONSOLE</p>
          <p className="text-[#92c9c9] text-sm mt-2">System Administrator Access</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#142828]  p-6 md:p-8 border border-[#234848] shadow-2xl w-full relative overflow-hidden group"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-sm ">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-5">
            <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
              USERNAME <span className="text-red-400">*</span>
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MdBadge className="w-5 h-5 text-[#568888] group-focus-within/input:text-[#13ecec] transition-colors" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                placeholder="admin"
                className="w-full h-14 pl-12 pr-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0  font-medium text-lg transition-all shadow-inner placeholder:text-[#3a5c5c]"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <label className="block text-white text-sm font-bold uppercase tracking-wider">
                PASSWORD <span className="text-red-400">*</span>
              </label>
            </div>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MdLock className="w-5 h-5 text-[#568888] group-focus-within/input:text-[#13ecec] transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••"
                className="w-full h-14 pl-12 pr-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0  font-medium text-lg transition-all shadow-inner placeholder:text-[#3a5c5c]"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full h-14 bg-[#13ecec] hover:bg-[#0fd6d6] active:translate-y-[1px] text-[#112222]  font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_-5px_rgba(19,236,236,0.3)] hover:shadow-[0_0_25px_-5px_rgba(19,236,236,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? "LOGGING IN..." : "LOGIN"}</span>
            <MdArrowForward className="w-5 h-5" />
          </button>

          {/* Back to user login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#568888] hover:text-[#13ecec] text-sm transition-colors"
            >
              ← Back to User Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
