import { useState } from "react";
import { MdFingerprint } from "react-icons/md";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

export function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="fixed inset-0 bg-[#102222] flex flex-col">
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
      <header className="flex justify-between items-center px-10 py-4 fixed top-0 left-0 right-0 z-50 bg-[#102222]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-[#234848] flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-[#13ecec]"
              fill="currentColor"
            >
              <rect x="6" y="4" width="12" height="16" rx="2" />
              <rect x="8" y="6" width="8" height="12" fill="currentColor" />
              <path d="M 10 4 L 10 6 L 14 6 L 14 4 Z" fill="#102222" />
            </svg>
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
            <div className="opacity-50">
              <MdFingerprint className="w-16 h-16 text-[#234848]" />
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
    </div>
  );
}

