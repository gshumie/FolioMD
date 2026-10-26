import React from 'react';
import { DocumentSettings, TypographyTheme, PaperTheme, FontSize, LineHeight, PdfMargin } from '../../types';
import { TYPOGRAPHY_THEMES, PAPER_THEMES, FONT_SIZES, LINE_HEIGHTS, PDF_MARGINS } from '../../constants/themes';
import { Type, Palette, Printer, Copy, Check } from 'lucide-react';

interface PreviewToolbarProps {
  settings: DocumentSettings;
  onUpdateSettings: (updater: (prev: DocumentSettings) => DocumentSettings) => void;
  onCopyHtml: () => void;
  onNativePrint: () => void;
  hasCopiedHtml: boolean;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  settings,
  onUpdateSettings,
  onCopyHtml,
  onNativePrint,
  hasCopiedHtml,
}) => {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-carbon-850 border-b border-carbon-700 select-none overflow-x-auto text-carbon-300 gap-3">
      {/* Left controls: Typography style & Paper background */}
      <div className="flex items-center gap-2">
        {/* Typography Theme Selector */}
        <div className="flex items-center gap-1.5 bg-carbon-900 border border-carbon-700 rounded px-2 py-1 text-xs">
          <Type className="w-3.5 h-3.5 text-accent-electric" />
          <select
            value={settings.typography}
            onChange={(e) =>
              onUpdateSettings((prev) => ({ ...prev, typography: e.target.value as TypographyTheme }))
            }
            className="bg-transparent text-white font-medium outline-none cursor-pointer text-xs"
            aria-label="Document Typography Theme"
          >
            {Object.values(TYPOGRAPHY_THEMES).map((t) => (
              <option key={t.id} value={t.id} className="bg-carbon-900 text-white">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Paper Surface Style */}
        <div className="flex items-center gap-1.5 bg-carbon-900 border border-carbon-700 rounded px-2 py-1 text-xs">
          <Palette className="w-3.5 h-3.5 text-accent-cyan" />
          <select
            value={settings.paperTheme}
            onChange={(e) =>
              onUpdateSettings((prev) => ({ ...prev, paperTheme: e.target.value as PaperTheme }))
            }
            className="bg-transparent text-white font-medium outline-none cursor-pointer text-xs"
            aria-label="Document Paper Surface"
          >
            {Object.values(PAPER_THEMES).map((p) => (
              <option key={p.id} value={p.id} className="bg-carbon-900 text-white">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Toggle */}
        <div className="hidden lg:flex items-center bg-carbon-900 border border-carbon-700 rounded text-[11px] p-0.5">
          {(Object.keys(FONT_SIZES) as FontSize[]).map((sizeKey) => (
            <button
              key={sizeKey}
              type="button"
              onClick={() => onUpdateSettings((prev) => ({ ...prev, fontSize: sizeKey }))}
              className={`px-2 py-0.5 rounded font-mono ${
                settings.fontSize === sizeKey
                  ? 'bg-accent-electric text-white font-semibold'
                  : 'text-carbon-400 hover:text-white'
              }`}
              title={`Font Size: ${FONT_SIZES[sizeKey].label}`}
            >
              {sizeKey.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Line Height */}
        <div className="hidden xl:flex items-center bg-carbon-900 border border-carbon-700 rounded text-[11px] p-0.5">
          {(Object.keys(LINE_HEIGHTS) as LineHeight[]).map((lhKey) => (
            <button
              key={lhKey}
              type="button"
              onClick={() => onUpdateSettings((prev) => ({ ...prev, lineHeight: lhKey }))}
              className={`px-1.5 py-0.5 rounded font-mono ${
                settings.lineHeight === lhKey
                  ? 'bg-carbon-700 text-white font-semibold'
                  : 'text-carbon-400 hover:text-white'
              }`}
              title={`Line Spacing: ${LINE_HEIGHTS[lhKey].label}`}
            >
              {lhKey === 'compact' ? '1.4x' : lhKey === 'normal' ? '1.6x' : '1.8x'}
            </button>
          ))}
        </div>

        {/* PDF Margin Setting */}
        <div className="hidden 2xl:flex items-center gap-1 text-[11px] font-mono text-carbon-400">
          <span>Margin:</span>
          <select
            value={settings.pdfMargin}
            onChange={(e) =>
              onUpdateSettings((prev) => ({ ...prev, pdfMargin: e.target.value as PdfMargin }))
            }
            className="bg-carbon-900 text-carbon-200 border border-carbon-700 rounded px-1.5 py-0.5 outline-none cursor-pointer"
          >
            {Object.entries(PDF_MARGINS).map(([key, val]) => (
              <option key={key} value={key} className="bg-carbon-900 text-white">
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right controls: Direct Copy HTML & Print */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onCopyHtml}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-carbon-800 hover:bg-carbon-700 text-carbon-200 hover:text-white border border-carbon-700 transition-colors"
          title="Copy Sanitized HTML to Clipboard"
        >
          {hasCopiedHtml ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-carbon-400" />
              <span className="font-mono text-[11px]">Copy HTML</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onNativePrint}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-carbon-800 hover:bg-carbon-700 text-carbon-200 hover:text-white border border-carbon-700 transition-colors"
          title="Print or Save as Vector PDF via Browser (Ctrl+P)"
        >
          <Printer className="w-3.5 h-3.5 text-carbon-400" />
          <span className="font-mono text-[11px] hidden sm:inline">Print / PDF</span>
        </button>
      </div>
    </div>
  );
};
