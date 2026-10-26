import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl / ⌘ + B', action: 'Toggle Bold text (**text**)' },
    { key: 'Ctrl / ⌘ + I', action: 'Toggle Italic text (*text*)' },
    { key: 'Ctrl / ⌘ + K', action: 'Insert Hyperlink ([title](url))' },
    { key: 'Ctrl / ⌘ + S', action: 'Manual Save trigger' },
    { key: 'Ctrl / ⌘ + P', action: 'Native Vector Print / Save as PDF' },
    { key: 'Tab', action: 'Insert 2-space indentation' },
    { key: 'Shift + Tab', action: 'Outdent line' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-carbon-900 border border-carbon-700 rounded-lg shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-carbon-700 bg-carbon-850">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-accent-electric" />
            <h2 id="shortcuts-title" className="text-sm font-semibold text-white">
              Keyboard Shortcuts Reference
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-carbon-400 hover:text-white rounded hover:bg-carbon-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-carbon-800/50 text-xs"
            >
              <span className="text-carbon-300">{s.action}</span>
              <kbd className="px-2 py-1 font-mono text-[11px] bg-carbon-950 text-accent-cyan border border-carbon-700 rounded">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-carbon-700 bg-carbon-850 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-carbon-700 hover:bg-carbon-600 text-white rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
