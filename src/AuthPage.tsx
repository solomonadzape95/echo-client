import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdFingerprint } from "react-icons/md";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { FloatingHelpButton } from "./components/FloatingHelpButton";
import { Footer } from "./components/Footer";
import { authHelpSteps } from "./constants/helpContent";
import { authService } from "./lib/auth";

export function AuthPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to refresh token to check if user is authenticated
        const response = await authService.refreshToken();
        if (response.success) {
          // User is authenticated, redirect to dashboard
          navigate("/dashboard", { replace: true });
          return;
        }
      } catch (error) {
        // User is not authenticated, stay on login page
        // This is expected for unauthenticated users
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 bg-[#102222] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-transparent flex flex-col relative h-screen">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #234848 1px, transparent 1px),
            linear-gradient(to bottom, #234848 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="flex justify-between items-center px-10 py-4 fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <MdFingerprint className="w-5 h-5 text-[#13ecec]" />
          </div>
          <h1 className="text-white text-lg font-bold tracking-tight uppercase">
            echo
          </h1>
        </div>

        <div className="flex items-center gap-4 relative z-50">
          <button
            onClick={() => setIsRegister(false)}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wider rounded transition-colors cursor-pointer relative z-50 ${
              !isRegister 
                ? "bg-[#13ecec] text-[#112222]" 
                : "text-[#92c9c9] hover:text-white"
            }`}
            type="button"
          >
            Login
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wider rounded transition-colors cursor-pointer relative z-50 ${
              isRegister 
                ? "bg-[#13ecec] text-[#112222]" 
                : "text-[#92c9c9] hover:text-white"
            }`}
            type="button"
          >
            Register
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pt-20 pb-12">
        <div className="max-w-lg w-full flex flex-col items-center gap-8">
          {/* Title */}
          <div className="relative w-full flex justify-between items-end gap-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight uppercase tracking-tighter">
              {isRegister ? (
                <>
                  REGISTER
                </>
              ) : (
                "LOGIN"
              )}
            </h2>
            <div>
              <MdFingerprint className="w-16 h-16 text-[#13ecec] opacity-80" />
            </div>
          </div>

          {/* Instructions */}
          <div className="border-l-2 border-[#13ecec] pl-4 w-full">
            <p className="text-[#92c9c9] text-base leading-relaxed">
              {isRegister 
                ? "Create your account to access the voting terminal. All fields are required for registration."
                : "Enter your official credentials to access the voting terminal. Identification is mandatory for ballot access."
              }
            </p>
          </div>

          {/* Forms */}
          {!isRegister ? <LoginForm /> : <RegisterForm />}

          {/* Footer Links */}
          <div className="flex justify-center items-center gap-6 pt-4">
            <a href="#" className="text-[#568888] text-xs uppercase tracking-widest hover:text-[#13ecec] transition-colors">
              PRIVACY POLICY
            </a>
            <span className="text-[#568888] text-xs">•</span>
            <a href="#" className="text-[#568888] text-xs uppercase tracking-widest hover:text-[#13ecec] transition-colors">
              TERMS
            </a>
          </div>
        </div>
      </main>

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

