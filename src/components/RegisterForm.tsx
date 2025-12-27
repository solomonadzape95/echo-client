import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdBadge, MdLock, MdArrowForward, MdCheckCircle, MdClose, MdPerson } from "react-icons/md";
import { authService, masterlistService, MasterlistRecord } from "../lib/auth";

type Step = "regNumber" | "verifying" | "confirm" | "password";

export function RegisterForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("regNumber");
  const [regNumber, setRegNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [masterlistRecord, setMasterlistRecord] = useState<MasterlistRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegNumberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep("verifying");

    try {
      const response = await masterlistService.verifyRegNumber(regNumber);
      if (response.success) {
        setMasterlistRecord(response.data);
        setStep("confirm");
      } else {
        setError(response.message || "Registration number not found in masterlist");
        setStep("regNumber");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify registration number");
      setStep("regNumber");
    }
  };

  const handleConfirm = () => {
    setStep("password");
  };

  const handleReject = () => {
    setMasterlistRecord(null);
    setRegNumber("");
    setStep("regNumber");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!masterlistRecord) {
      setError("Masterlist record not found. Please start over.");
      setStep("regNumber");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.register(
        regNumber,
        username || regNumber, // Use regNumber as username if not provided
        password,
        masterlistRecord.classId
      );

      if (response.success) {
        // Redirect to dashboard on success
        navigate("/dashboard");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Registration Form - slides left when confirming */}
      <div
        className={`transition-transform duration-500 ease-in-out ${
          step === "regNumber" ? "translate-x-0" : "-translate-x-full opacity-0 absolute inset-0"
        }`}
      >
        <form onSubmit={handleRegNumberSubmit} className="bg-[#142828] rounded-lg p-6 md:p-8 border border-[#234848] shadow-2xl w-full relative overflow-hidden group">
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full h-14 bg-[#13ecec] hover:bg-[#0fd6d6] active:translate-y-[1px] text-[#112222] rounded font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_-5px_rgba(19,236,236,0.3)] hover:shadow-[0_0_25px_-5px_rgba(19,236,236,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>VERIFY REGISTRATION</span>
            <MdArrowForward className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Verifying State */}
      {step === "verifying" && (
        <div className="bg-[#142828] rounded-lg p-6 md:p-8 border border-[#234848] shadow-2xl w-full">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg font-medium">Verifying registration number...</p>
            <p className="text-[#92c9c9] text-sm mt-2">Please wait while we check the masterlist</p>
          </div>
        </div>
      )}

      {/* Confirmation Container - slides in from right */}
      {step === "confirm" && masterlistRecord && (
        <div className="bg-[#142828] rounded-lg p-6 md:p-8 border border-[#234848] shadow-2xl w-full animate-in slide-in-from-right">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white text-xl font-bold uppercase tracking-wider mb-2">
                Verify Your Identity
              </h3>
              <p className="text-[#92c9c9] text-sm">
                We found a record in the masterlist. Is this you?
              </p>
            </div>

            <div className="bg-[#102222] border border-[#234848] p-6 rounded-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#234848] flex items-center justify-center">
                  <MdPerson className="w-6 h-6 text-[#13ecec]" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">
                    {masterlistRecord.firstName} {masterlistRecord.lastName}
                  </p>
                  <p className="text-[#92c9c9] text-sm">Reg. Number: {masterlistRecord.regNumber}</p>
                </div>
              </div>

              {masterlistRecord.class && (
                <div className="pt-4 border-t border-[#234848] space-y-3">
                  <div>
                    <p className="text-[#568888] text-xs uppercase tracking-wider mb-1">Class</p>
                    <p className="text-white">{masterlistRecord.class.name}</p>
                  </div>

                  {masterlistRecord.class.department && (
                    <div>
                      <p className="text-[#568888] text-xs uppercase tracking-wider mb-1">Department</p>
                      <p className="text-white">{masterlistRecord.class.department.name}</p>
                    </div>
                  )}

                  {masterlistRecord.class.department?.faculty && (
                    <div>
                      <p className="text-[#568888] text-xs uppercase tracking-wider mb-1">Faculty</p>
                      <p className="text-white">{masterlistRecord.class.department.faculty.name}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleReject}
                className="flex-1 h-12 bg-[#234848] hover:bg-[#2a5050] text-white rounded font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all"
              >
                <MdClose className="w-5 h-5" />
                <span>No, Try Again</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 h-12 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] rounded font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all"
              >
                <MdCheckCircle className="w-5 h-5" />
                <span>Yes, Continue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Form - slides in from right */}
      {step === "password" && (
        <div className="bg-[#142828] rounded-lg p-6 md:p-8 border border-[#234848] shadow-2xl w-full animate-in slide-in-from-right">
          <form onSubmit={handlePasswordSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-sm rounded">
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
                  placeholder={regNumber}
                  className="w-full h-14 pl-12 pr-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 rounded font-medium text-lg transition-all shadow-inner placeholder:text-[#3a5c5c]"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
                PASSWORD <span className="text-red-400">*</span>
              </label>
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

            {/* Confirm Password */}
            <div className="mb-5">
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
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
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
              <span>{isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}</span>
              <MdArrowForward className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
