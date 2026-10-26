import React, { useEffect, useRef } from 'react';
import { DocumentSettings } from '../../types';
import { PreviewToolbar } from './PreviewToolbar';
import { TYPOGRAPHY_THEMES, PAPER_THEMES, FONT_SIZES, LINE_HEIGHTS } from '../../constants/themes';
import { copyToClipboard } from '../../utils/exportEngine';

interface DocumentPreviewProps {
  sanitizedHtml: string;
  settings: DocumentSettings;
  onUpdateSettings: (updater: (prev: DocumentSettings) => DocumentSettings) => void;
  onCopyHtml: () => void;
  onNativePrint: () => void;
  hasCopiedHtml: boolean;
  onSuccessToast: (title: string, description?: string) => void;
  previewRef: React.RefObject<HTMLDivElement>;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  sanitizedHtml,
  settings,
  onUpdateSettings,
  onCopyHtml,
  onNativePrint,
  hasCopiedHtml,
  onSuccessToast,
  previewRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const typography = TYPOGRAPHY_THEMES[settings.typography];
  const paper = PAPER_THEMES[settings.paperTheme];
  const fontSize = FONT_SIZES[settings.fontSize];
  const lineHeight = LINE_HEIGHTS[settings.lineHeight];

  // Intercept click on dynamically rendered .copy-code-btn elements
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleCopyCodeClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('.copy-code-btn') as HTMLButtonElement | null;
      if (!button) return;

      const encodedCode = button.getAttribute('data-code');
      if (encodedCode) {
        const decoded = decodeURIComponent(encodedCode);
        const ok = await copyToClipboard(decoded);
        if (ok) {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          button.classList.add('bg-emerald-950', 'text-emerald-400', 'border-emerald-700');
          onSuccessToast('Code Snippet Copied', 'Raw code snippet copied to your clipboard.');

          setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-emerald-950', 'text-emerald-400', 'border-emerald-700');
          }, 2000);
        }
      }
    };

    container.addEventListener('click', handleCopyCodeClick);
    return () => {
      container.removeEventListener('click', handleCopyCodeClick);
    };
  }, [sanitizedHtml, onSuccessToast]);

  return (
    <div className="flex flex-col h-full bg-carbon-950 overflow-hidden preview-pane">
      {/* Preview Customization Toolbar */}
      <PreviewToolbar
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onCopyHtml={onCopyHtml}
        onNativePrint={onNativePrint}
        hasCopiedHtml={hasCopiedHtml}
      />

      {/* Scrollable Viewport with Centered Sheet */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-carbon-950">
        <article
          ref={previewRef}
          style={{
            backgroundColor: paper.bgHex,
            color: paper.textHex,
            fontFamily: typography.fontFamily,
            fontSize: fontSize.px,
            lineHeight: lineHeight.value,
          }}
          className="document-preview-sheet w-full max-w-3xl min-h-[calc(100vh-10rem)] p-8 md:p-14 border border-carbon-700/80 rounded-sm shadow-none transition-all selection:bg-accent-electric selection:text-white"
        >
          {/* Architectural Document Masthead */}
          <div
            style={{ borderColor: paper.borderHex }}
            className="pb-4 mb-8 border-b-2 flex items-center justify-between font-mono text-[11px] text-carbon-400 select-none"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-electric"></span>
              <span className="tracking-wider uppercase">FolioMD // PREVIEW ENGINE</span>
            </div>
            <span className="tracking-tight">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Render Sanitized Markdown Body */}
          <div
            ref={containerRef}
            className="document-content-root prose prose-slate max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </article>
      </div>
    </div>
  );
};
