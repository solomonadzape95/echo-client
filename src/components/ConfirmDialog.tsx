import { MdWarning, MdCheckCircle, MdError, MdInfo } from "react-icons/md";

export type ConfirmDialogType = "warning" | "danger" | "info";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  type = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const icons = {
    warning: MdWarning,
    danger: MdError,
    info: MdInfo,
  };

  const colors = {
    warning: "text-orange-400",
    danger: "text-red-400",
    info: "text-blue-400",
  };

  const buttonColors = {
    warning: "bg-orange-600 hover:bg-orange-700",
    danger: "bg-red-600 hover:bg-red-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  const Icon = icons[type];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        {/* Dialog */}
        <div
          className="bg-[#142828] border border-[#234848]  shadow-xl max-w-md w-full p-6 animate-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-4">
            <Icon className={`w-6 h-6 flex-shrink-0 mt-1 ${colors[type]}`} />
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-[#92c9c9] text-sm">{message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-[#234848] hover:bg-[#2a5050] text-white  font-medium transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white  font-medium transition-all ${buttonColors[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

