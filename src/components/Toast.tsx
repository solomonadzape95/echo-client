import { useEffect } from "react";
import { MdCheckCircle, MdError, MdInfo, MdWarning, MdClose } from "react-icons/md";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "info", duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: MdCheckCircle,
    error: MdError,
    info: MdInfo,
    warning: MdWarning,
  };

  const colors = {
    success: "bg-green-900/20 border-green-500/50 text-green-400",
    error: "bg-red-900/20 border-red-500/50 text-red-400",
    info: "bg-blue-900/20 border-blue-500/50 text-blue-400",
    warning: "bg-orange-900/20 border-orange-500/50 text-orange-400",
  };

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md animate-in slide-in-from-right ${colors[type]}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <MdClose className="w-4 h-4" />
      </button>
    </div>
  );
}

