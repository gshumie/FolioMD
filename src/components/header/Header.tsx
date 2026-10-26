import React from 'react';
import { IsometricFolioLogo } from '../brand/IsometricFolioLogo';
import { ExportDropdown } from './ExportDropdown';
import { ViewMode } from '../../types';
import { ShieldCheck, HelpCircle, Columns, Edit3, Eye, FileText } from 'lucide-react';

interface HeaderProps {
  documentTitle: string;
  onTitleChange: (newTitle: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenSecurityModal: () => void;
  onOpenShortcutsModal: () => void;
  onExportHtml: () => void;
  onExportPdf: () => void;
  onCopyHtml: () => void;
  onNativePrint: () => void;
  isExportingPdf: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  documentTitle,
  onTitleChange,
  viewMode,
  onViewModeChange,
  onOpenSecurityModal,
  onOpenShortcutsModal,
  onExportHtml,
  onExportPdf,
  onCopyHtml,
  onNativePrint,
  isExportingPdf,
}) => {
  return (
    <header className="h-14 bg-carbon-900 border-b border-carbon-700 px-4 md:px-5 flex items-center justify-between select-none z-20 shrink-0">
      {/* Brand Mark (Inline SVG Isometric Folio Logo) */}
      <div className="flex items-center gap-4">
        <IsometricFolioLogo size={34} showWordmark={true} />

        <div className="hidden md:block w-[1px] h-6 bg-carbon-700 mx-1" />

        {/* Document Title Input */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-carbon-950 border border-carbon-700/80 hover:border-carbon-600 focus-within:border-accent-electric transition-colors">
          <Edit3 className="w-3.5 h-3.5 text-carbon-400 shrink-0" />
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Document title..."
            className="bg-transparent text-xs text-white font-medium outline-none w-44 lg:w-64 placeholder:text-carbon-500"
            aria-label="Document Title"
          />
        </div>
      </div>

      {/* Center: View Mode Toggle */}
      <div className="flex items-center bg-carbon-950 border border-carbon-700 rounded p-0.5 text-xs">
        <button
          type="button"
          onClick={() => onViewModeChange('split')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
            viewMode === 'split'
              ? 'bg-carbon-800 text-white font-medium'
              : 'text-carbon-400 hover:text-carbon-200'
          }`}
          title="Split View (Editor + Live Preview)"
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px] font-mono">Split</span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange('editor')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
            viewMode === 'editor'
              ? 'bg-carbon-800 text-white font-medium'
              : 'text-carbon-400 hover:text-carbon-200'
          }`}
          title="Editor Only"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px] font-mono">Editor</span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange('preview')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
            viewMode === 'preview'
              ? 'bg-carbon-800 text-white font-medium'
              : 'text-carbon-400 hover:text-carbon-200'
          }`}
          title="Preview Only"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px] font-mono">Preview</span>
        </button>
      </div>

      {/* Right Controls: Security Badge, Shortcuts & Export Dropdown */}
      <div className="flex items-center gap-2">
        {/* Security Audit Trigger Button */}
        <button
          type="button"
          onClick={onOpenSecurityModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-carbon-850 hover:bg-carbon-800 text-carbon-300 hover:text-white border border-carbon-700 text-xs transition-colors"
          title="Inspect Security Audit & XSS Sanitization Engine"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline text-[11px] font-mono">Security</span>
        </button>

        {/* Shortcuts Reference */}
        <button
          type="button"
          onClick={onOpenShortcutsModal}
          className="p-1.5 rounded text-carbon-400 hover:text-white hover:bg-carbon-800 transition-colors"
          title="Keyboard Shortcuts"
          aria-label="Keyboard Shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-carbon-700 mx-0.5" />

        {/* Primary Export Dropdown */}
        <ExportDropdown
          onExportHtml={onExportHtml}
          onExportPdf={onExportPdf}
          onCopyHtml={onCopyHtml}
          onNativePrint={onNativePrint}
          isExportingPdf={isExportingPdf}
        />
      </div>
    </header>
  );
};
