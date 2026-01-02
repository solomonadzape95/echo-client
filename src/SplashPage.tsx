import { useEffect, useState } from "react";
import { MdFingerprint } from "react-icons/md";

export function SplashPage({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#102222] flex flex-col items-center justify-center">
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
      
      {/* Ambient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#13ecec]/5 blur-[120px]  pointer-events-none"></div>

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Fingerprint logo */}
        <div className="mb-8 relative">
          <div className="w-32 h-32  border-2 border-[#13ecec] bg-[#13ecec]/10 flex items-center justify-center shadow-[0_0_30px_rgba(19,236,236,0.5)]">
            <MdFingerprint className="w-20 h-20 text-[#13ecec]" />
          </div>
        </div>

        {/* System title */}
        <h1 className="text-5xl font-bold text-white mb-4 tracking-wider">
          echo
        </h1>

        {/* Tagline */}
        <p className="text-white text-lg mb-12 tracking-wide">
          Secure. Transparent. Official.
        </p>

        {/* Loading section */}
        <div className="w-96">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-sm tracking-wide">
              STARTING UP...
            </span>
            <span className="text-white text-sm font-mono">{progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#234848]/30  overflow-hidden border border-[#234848]/50">
            <div
              className="h-full bg-[#13ecec] transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(19,236,236,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Version number */}
        <p className="text-white text-xs mt-16 tracking-wider opacity-70">
          V0.1.0 ALPHA
        </p>
      </div>
    </div>
  );
}

