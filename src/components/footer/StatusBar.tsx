import React from 'react';
import { DocumentMetrics } from '../../types';
import { CodeToPrintBadge } from '../brand/CodeToPrintBadge';
import { ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';

interface StatusBarProps {
  metrics: DocumentMetrics;
  lastSavedTime: string | null;
  onOpenSecurityModal: () => void;
  onOpenShortcutsModal: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  metrics,
  lastSavedTime,
  onOpenSecurityModal,
  onOpenShortcutsModal,
}) => {
  return (
    <footer className="h-8 bg-carbon-900 border-t border-carbon-700 px-4 flex items-center justify-between text-[11px] font-mono text-carbon-400 select-none shrink-0 z-20">
      {/* Left: Document Metrics (Quiet, inline typography — NO generic 4-stat cards) */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-carbon-300">
          <FileText className="w-3 h-3 text-carbon-500" />
          <span>
            <strong className="text-white font-medium">{metrics.words.toLocaleString()}</strong> words
          </span>
        </div>

        <span className="text-carbon-700">/</span>

        <div className="hidden sm:inline">
          <strong className="text-white font-medium">{metrics.characters.toLocaleString()}</strong> chars
          <span className="text-carbon-500 text-[10px] ml-1">({metrics.charactersNoSpaces.toLocaleString()} no spaces)</span>
        </div>

        <span className="hidden sm:inline text-carbon-700">/</span>

        <div>
          <strong className="text-white font-medium">{metrics.lines.toLocaleString()}</strong> lines
        </div>

        <span className="text-carbon-700">/</span>

        <div className="flex items-center gap-1 text-carbon-300">
          <Clock className="w-3 h-3 text-carbon-500" />
          <span>~{metrics.readingTimeMin} min read</span>
        </div>
      </div>

      {/* Right: Security state, auto-save timestamp & Code-to-Print mark */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Local Persistence Status */}
        <div className="hidden md:flex items-center gap-1.5 text-carbon-400">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{lastSavedTime ? `Draft saved ${lastSavedTime}` : 'Autosaved locally'}</span>
        </div>

        <span className="hidden md:inline text-carbon-700">/</span>

        {/* Security Engine State (Clickable) */}
        <button
          type="button"
          onClick={onOpenSecurityModal}
          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
          title="DOMPurify strict sanitization active"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[10px]">DOMPurify Active</span>
        </button>

        <span className="text-carbon-700">/</span>

        {/* Shortcuts quick trigger */}
        <button
          type="button"
          onClick={onOpenShortcutsModal}
          className="hover:text-carbon-200 transition-colors hidden sm:inline"
        >
          Ctrl+B / ⌘+K
        </button>

        {/* Favicon / Secondary Code-to-Print Mark Icon */}
        <div title="FolioMD Architectural Code-to-Print Badge">
          <CodeToPrintBadge size={18} />
        </div>
      </div>
    </footer>
  );
};
