import { MdFavorite } from "react-icons/md";

export function Footer() {
  return (
    <footer className="bottom-0 left-0 right-0 bg-transparent py-3 px-4 z-30 mt-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-[#92c9c9]">
        <span>built with</span>
        <span className="inline-flex items-center">
          <MdFavorite className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 animate-pulse" />
          <span className="ml-1">love</span>
        </span>
        <span>by</span>
        <a
          href="https://x.com/0xsolenoid"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#13ecec] hover:text-[#0fd6d6] transition-colors font-medium underline decoration-[#13ecec]/50 hover:decoration-[#0fd6d6]"
        >
          solenoid
        </a>
      </div>
    </footer>
  );
}

