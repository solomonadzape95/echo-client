import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdLock, MdArrowForward, MdArrowBack, MdCheckCircle } from "react-icons/md";
import { authService } from "../lib/auth";
import { useToast } from "../hooks/useToast";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast, ToastContainer } = useToast();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    if (!token) {
      showToast("Reset token is required", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.resetPassword(token, password);
      if (response.success) {
        setSuccess(true);
        showToast("Password reset successfully", "success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showToast(response.message || "Failed to reset password", "error");
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to reset password", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4">
        <ToastContainer />
        <div className="w-full max-w-md">
          <div className="bg-[#142828] rounded-lg p-6 md:p-8 border border-[#234848] shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/20 border border-green-500/50 mb-4">
              <MdCheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
            <p className="text-[#92c9c9] text-sm mb-6">
              Your password has been reset successfully. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="bg-[#142828] rounded-lg p-6 md:p-8 border border-[#234848] shadow-2xl">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#234848] mb-4">
              <MdLock className="w-8 h-8 text-[#13ecec]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-[#92c9c9] text-sm">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!token && (
              <div>
                <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
                  RESET TOKEN <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter reset token"
                  className="w-full h-14 px-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 rounded font-medium text-lg transition-all shadow-inner placeholder:text-[#3a5c5c]"
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
                NEW PASSWORD <span className="text-red-400">*</span>
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdLock className="w-5 h-5 text-[#568888] group-focus-within/input:text-[#13ecec] transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full h-14 pl-12 pr-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 rounded font-medium text-lg transition-all shadow-inner placeholder:text-[#3a5c5c]"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
                CONFIRM PASSWORD <span className="text-red-400">*</span>
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdLock className="w-5 h-5 text-[#568888] group-focus-within/input:text-[#13ecec] transition-colors" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full h-14 pl-12 pr-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 rounded font-medium text-lg transition-all shadow-inner placeholder:text-[#3a5c5c]"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-[#13ecec] hover:bg-[#0fd6d6] active:translate-y-[1px] text-[#112222] rounded font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_-5px_rgba(19,236,236,0.3)] hover:shadow-[0_0_25px_-5px_rgba(19,236,236,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? "RESETTING..." : "RESET PASSWORD"}</span>
              <MdArrowForward className="w-5 h-5" />
            </button>
          </form>

          <button
            onClick={() => navigate("/login")}
            className="mt-4 w-full flex items-center justify-center gap-2 text-[#92c9c9] hover:text-white transition-colors"
          >
            <MdArrowBack className="w-4 h-4" />
            <span className="text-sm">Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

