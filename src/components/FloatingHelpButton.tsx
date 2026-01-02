import { useState } from "react";
import { MdHelpOutline } from "react-icons/md";
import { HelpModal, HelpStep } from "./HelpModal";

interface FloatingHelpButtonProps {
  steps: HelpStep[];
  title?: string;
  position?: "auth" | "dashboard";
}

export function FloatingHelpButton({ 
  steps, 
  title = "Help Guide",
  position = "auth" 
}: FloatingHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Position based on context - responsive positioning
  // On mobile, stack vertically; on desktop, place side by side
  const positionClasses = position === "auth" 
    ? "fixed bottom-4 right-4 sm:bottom-6 sm:right-6" 
    : "fixed bottom-20 right-4 sm:bottom-6 sm:right-24"; // Stack above menu on mobile, side by side on desktop

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${positionClasses} w-12 h-12 sm:w-14 sm:h-14 bg-[#234848] hover:bg-[#2a5050] text-[#13ecec]  shadow-lg flex items-center justify-center z-40 transition-all hover:scale-110 active:scale-95 ${
          position === "auth" ? "animate-pulse" : ""
        }`}
        aria-label="Open help guide"
      >
        <MdHelpOutline className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <HelpModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        steps={steps}
        title={title}
      />
    </>
  );
}

