import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdBadge, MdArrowForward, MdArrowBack, MdEmail } from "react-icons/md";
import { authService } from "../lib/auth";
import { useToast } from "../hooks/useToast";
import { FloatingHelpButton } from "../components/FloatingHelpButton";
import { Footer } from "../components/Footer";
import { authHelpSteps } from "../constants/helpContent";

export function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [regNumber, setRegNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authService.forgotPassword(regNumber, email);
      if (response.success) {
        setSubmitted(true);
        // In development, token is returned for testing
        if (response.data?.token) {
          setResetToken(response.data.token);
        }
        showToast(response.data?.message || "Password reset instructions sent", "success");
      } else {
        showToast(response.message || "Failed to send reset instructions", "error");
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to send reset instructions", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="bg-[#142828]  p-6 md:p-8 border border-[#234848] shadow-2xl">
          {!submitted ? (
            <>
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16  bg-[#234848] mb-4">
                  <MdEmail className="w-8 h-8 text-[#13ecec]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
                <p className="text-[#92c9c9] text-sm">
                  Enter your registration number and email address. We'll send you instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
                    REGISTRATION NUMBER <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MdBadge className="w-5 h-5 text-[#568888] group-focus-within/input:text-[#13ecec] transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="2021/123456"
                      className="w-full h-14 pl-12 pr-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0  font-medium text-lg transition-all shadow-inner placeholder:text-[#3a5c5c]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
                    EMAIL ADDRESS <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MdEmail className="w-5 h-5 text-[#568888] group-focus-within/input:text-[#13ecec] transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full h-14 pl-12 pr-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0  font-medium text-lg transition-all shadow-inner placeholder:text-[#3a5c5c]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#13ecec] hover:bg-[#0fd6d6] active:translate-y-[1px] text-[#112222]  font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_-5px_rgba(19,236,236,0.3)] hover:shadow-[0_0_25px_-5px_rgba(19,236,236,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? "SENDING..." : "SEND RESET LINK"}</span>
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
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16  bg-green-900/20 border border-green-500/50 mb-4">
                <MdEmail className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-[#92c9c9] text-sm mb-6">
                If an account exists with this registration number, password reset instructions have been sent.
              </p>
              
              {/* Development only - show token */}
              {resetToken && process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-[#102222] border border-[#234848] ">
                  <p className="text-xs text-[#568888] mb-2">Development Mode - Reset Token:</p>
                  <p className="text-[#13ecec] font-mono text-xs break-all">{resetToken}</p>
                  <button
                    onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                    className="mt-3 text-sm text-[#13ecec] hover:underline"
                  >
                    Use this token to reset password
                  </button>
                </div>
              )}

              <button
                onClick={() => navigate("/login")}
                className="w-full h-12 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222]  font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all"
              >
                <MdArrowBack className="w-5 h-5" />
                <span>Back to Login</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Help Button */}
      <FloatingHelpButton
        steps={authHelpSteps}
        title="Getting Started Guide"
        position="auth"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

