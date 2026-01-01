import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdBadge, MdLock, MdArrowForward } from "react-icons/md";
import { authService } from "../lib/auth";

export function LoginForm() {
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await authService.login(regNumber, password);
      if (response.success) {
        // Redirect to dashboard on success
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#142828] rounded-lg p-6 md:p-8 border border-[#234848] shadow-2xl w-full relative overflow-hidden group">
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-sm rounded">
          {error}
        </div>
      )}

      {/* Reg Number */}
      <div className="mb-5">
        <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
          REG. NUMBER <span className="text-red-400">*</span>
        </label>
        <div className="relative group/input">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MdBadge className="w-5 h-5 text-[#568888] group-focus-within/input:text-[#13ecec] transition-colors" />
          </div>
          <input
            type="text"
            value={regNumber}
            onChange={(e) => {
              setRegNumber(e.target.value);
              setError(null);
            }}
            placeholder="2021/123456"
            className="w-full h-14 pl-12 pr-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 rounded font-medium text-lg transition-all shadow-inner placeholder:text-[#3a5c5c]"
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
          <a
            href="/forgot-password"
            onClick={(e) => {
              e.preventDefault();
              navigate("/forgot-password");
            }}
            className="text-[#568888] hover:text-[#13ecec] text-xs underline decoration-dotted underline-offset-4 transition-colors"
          >
            Forgot Password?
          </a>
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
            className="w-full h-14 pl-12 pr-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 rounded font-medium text-lg transition-all shadow-inner placeholder:text-[#3a5c5c]"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full h-14 bg-[#13ecec] hover:bg-[#0fd6d6] active:translate-y-[1px] text-[#112222] rounded font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_-5px_rgba(19,236,236,0.3)] hover:shadow-[0_0_25px_-5px_rgba(19,236,236,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{isSubmitting ? "LOGGING IN..." : "LOGIN"}</span>
        <MdArrowForward className="w-5 h-5" />
      </button>
    </form>
  );
}
