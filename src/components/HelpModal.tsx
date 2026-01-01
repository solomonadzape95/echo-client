import { useState } from "react";
import { MdClose, MdArrowBack, MdArrowForward, MdHelpOutline } from "react-icons/md";

export interface HelpStep {
  title: string;
  content: string | React.ReactNode;
}

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: HelpStep[];
  title?: string;
}

export function HelpModal({ isOpen, onClose, steps, title = "Help Guide" }: HelpModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-[#142828] border border-[#234848] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#234848]">
            <div className="flex items-center gap-3">
              <MdHelpOutline className="w-6 h-6 text-[#13ecec]" />
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#92c9c9] hover:text-white hover:bg-[#1a3333] rounded-lg transition-all"
              aria-label="Close"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mb-4">
              <span className="text-xs sm:text-sm text-[#568888] uppercase tracking-wider">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              {currentStepData.title}
            </h3>
            <div className="text-[#92c9c9] leading-relaxed text-sm sm:text-base">
              {typeof currentStepData.content === "string" ? (
                <p className="whitespace-pre-line">{currentStepData.content}</p>
              ) : (
                currentStepData.content
              )}
            </div>
          </div>

          {/* Footer with Navigation */}
          <div className="p-4 sm:p-6 border-t border-[#234848] flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-[#234848] hover:bg-[#2a5050] text-white rounded font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <MdArrowBack className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <div className="flex gap-2 flex-1 justify-center">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-[#13ecec] w-6"
                      : "bg-[#234848]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] rounded font-medium transition-all text-sm sm:text-base"
            >
              <span>{currentStep === steps.length - 1 ? "Got it!" : "Next"}</span>
              {currentStep < steps.length - 1 && <MdArrowForward className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

