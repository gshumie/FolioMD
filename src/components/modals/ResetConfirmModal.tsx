import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-carbon-900 border border-carbon-700 rounded-lg shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-carbon-700 bg-carbon-850">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h2 id="reset-modal-title" className="text-xs font-semibold uppercase tracking-wider font-mono">
              Reset Document Draft
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-carbon-400 hover:text-white rounded hover:bg-carbon-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 text-xs text-carbon-300 leading-relaxed">
          Are you sure you want to reset the editor to the default template? Any unsaved edits will be cleared from your local browser storage.
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-carbon-700 bg-carbon-850">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-carbon-300 hover:text-white rounded hover:bg-carbon-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white font-medium rounded transition-colors"
          >
            Reset to Sample
          </button>
        </div>
      </div>
    </div>
  );
};
