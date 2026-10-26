import React, { useState, useRef, useEffect } from 'react';
import { Download, FileCode, FileDown, Copy, Printer, ChevronDown } from 'lucide-react';

interface ExportDropdownProps {
  onExportHtml: () => void;
  onExportPdf: () => void;
  onCopyHtml: () => void;
  onNativePrint: () => void;
  isExportingPdf: boolean;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  onExportHtml,
  onExportPdf,
  onCopyHtml,
  onNativePrint,
  isExportingPdf,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Primary Export Trigger Button (Electric Blue Accent #0EA5E9) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExportingPdf}
        className="flex items-center gap-2 px-3.5 py-1.5 bg-accent-electric hover:bg-accent-electricHover active:bg-accent-blueDim text-white font-medium text-xs rounded transition-all shadow-sm select-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isExportingPdf ? 'Exporting PDF...' : 'Export'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded bg-carbon-900 border border-carbon-700 shadow-2xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-carbon-800 text-[10px] font-mono uppercase tracking-wider text-carbon-400">
            Export Document
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportPdf();
            }}
            disabled={isExportingPdf}
            className="w-full text-left px-3.5 py-2.5 hover:bg-carbon-800 flex items-center gap-2.5 text-carbon-100 transition-colors"
          >
            <FileDown className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="font-semibold leading-tight">Download PDF Document</div>
              <div className="text-[10px] text-carbon-400 font-mono">Print-optimized .pdf with margins</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportHtml();
            }}
            className="w-full text-left px-3.5 py-2.5 hover:bg-carbon-800 flex items-center gap-2.5 text-carbon-100 transition-colors"
          >
            <FileCode className="w-4 h-4 text-accent-electric shrink-0" />
            <div>
              <div className="font-semibold leading-tight">Download Standalone HTML</div>
              <div className="text-[10px] text-carbon-400 font-mono">Self-contained .html with CSS</div>
            </div>
          </button>

          <div className="border-t border-carbon-800 my-1" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onCopyHtml();
            }}
            className="w-full text-left px-3.5 py-2 hover:bg-carbon-800 flex items-center gap-2.5 text-carbon-300 hover:text-white transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-carbon-400 shrink-0" />
            <div className="text-[11px]">Copy Sanitized Raw HTML</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onNativePrint();
            }}
            className="w-full text-left px-3.5 py-2 hover:bg-carbon-800 flex items-center gap-2.5 text-carbon-300 hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-carbon-400 shrink-0" />
            <div className="text-[11px]">Native Print / Save as Vector PDF</div>
          </button>
        </div>
      )}
    </div>
  );
};
