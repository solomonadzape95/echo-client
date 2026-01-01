import { useState, useCallback } from "react";
import { ConfirmDialog, ConfirmDialogType } from "../components/ConfirmDialog";

interface ConfirmOptions {
  title: string;
  message: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmState({
          isOpen: true,
          options,
          onConfirm: () => {
            setConfirmState(null);
            resolve(true);
          },
          onCancel: () => {
            setConfirmState(null);
            resolve(false);
          },
        });
      });
    },
    []
  );

  const ConfirmDialogComponent = confirmState ? (
    <ConfirmDialog
      isOpen={confirmState.isOpen}
      title={confirmState.options.title}
      message={confirmState.options.message}
      type={confirmState.options.type}
      confirmText={confirmState.options.confirmText}
      cancelText={confirmState.options.cancelText}
      onConfirm={confirmState.onConfirm}
      onCancel={confirmState.onCancel}
    />
  ) : null;

  return { confirm, ConfirmDialogComponent };
}

