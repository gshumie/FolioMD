import { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/header/Header';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { DocumentPreview } from './components/preview/DocumentPreview';
import { StatusBar } from './components/footer/StatusBar';
import { SecurityAuditModal } from './components/modals/SecurityAuditModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';
import { ResetConfirmModal } from './components/modals/ResetConfirmModal';
import { Toast } from './components/ui/Toast';
import { DocumentSettings, ViewMode, ToastMessage } from './types';
import { loadSavedDraft, saveDraft, clearSavedDraft, DEFAULT_SETTINGS } from './utils/storage';
import { parseMarkdown, calculateMetrics } from './utils/markdown';
import { downloadHtml, downloadPdf, copyToClipboard } from './utils/exportEngine';
import { sanitizeFilename } from './utils/security';
import { DEFAULT_MARKDOWN_SAMPLE } from './constants/sampleDocument';

export function App() {
  // Load initial draft from localStorage or fallback to architectural sample
  const initialDraft = useMemo(() => loadSavedDraft(), []);

  const [markdown, setMarkdown] = useState<string>(initialDraft.markdown);
  const [documentTitle, setDocumentTitle] = useState<string>(initialDraft.title);
  const [settings, setSettings] = useState<DocumentSettings>(initialDraft.settings);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(initialDraft.lastSaved);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // Split-screen pane resizing
  const [splitRatio, setSplitRatio] = useState<number>(50); // 50% left, 50% right
  const [isResizing, setIsResizing] = useState<boolean>(false);

  // Modals & export status
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [hasCopiedHtml, setHasCopiedHtml] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Preview element ref for PDF generation
  const previewRef = useRef<HTMLDivElement>(null);

  // Toast dispatch helpers
  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      description,
    };
    setToasts((prev) => [...prev.slice(-4), newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Compute metrics with memoization
  const metrics = useMemo(() => calculateMetrics(markdown), [markdown]);

  // Parse markdown and strictly sanitize HTML output
  const sanitizationResult = useMemo(() => parseMarkdown(markdown), [markdown]);

  // Debounced auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedTime = saveDraft(markdown, documentTitle, settings);
      if (savedTime) {
        setLastSavedTime(savedTime);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [markdown, documentTitle, settings]);

  // Split pane mouse dragging handlers
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const totalWidth = window.innerWidth;
      const percentage = (e.clientX / totalWidth) * 100;
      if (percentage >= 25 && percentage <= 75) {
        setSplitRatio(percentage);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Global print shortcut listener (Ctrl/Cmd + P)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Export HTML
  const handleExportHtml = () => {
    const safeName = sanitizeFilename(documentTitle, 'foliomd-document');
    downloadHtml(sanitizationResult.cleanHtml, safeName, settings);
    addToast('success', 'HTML File Exported', `Saved clean standalone "${safeName}.html" with embedded styles.`);
  };

  // Export PDF
  const handleExportPdf = async () => {
    if (!previewRef.current) return;
    setIsExportingPdf(true);
    addToast('info', 'Compiling PDF Specification', 'Calculating layout geometry and page breaks...');

    try {
      const safeName = sanitizeFilename(documentTitle, 'foliomd-document');
      await downloadPdf(previewRef.current, safeName, settings);
      addToast('success', 'PDF Document Ready', `Downloaded "${safeName}.pdf" successfully.`);
    } catch (err) {
      addToast('error', 'PDF Generation Alert', 'Falling back to browser vector print dialog.');
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Copy raw HTML
  const handleCopyHtml = async () => {
    const ok = await copyToClipboard(sanitizationResult.cleanHtml);
    if (ok) {
      setHasCopiedHtml(true);
      addToast('success', 'HTML Copied to Clipboard', 'Strictly sanitized HTML copied ready for web insertion.');
      setTimeout(() => setHasCopiedHtml(false), 2500);
    } else {
      addToast('error', 'Clipboard Access Denied', 'Unable to write to clipboard.');
    }
  };

  // Native Vector Print / PDF
  const handleNativePrint = () => {
    window.print();
  };

  // Reset draft to initial sample
  const handleConfirmReset = () => {
    setMarkdown(DEFAULT_MARKDOWN_SAMPLE);
    setDocumentTitle('FolioMD Architecture Guide');
    setSettings(DEFAULT_SETTINGS);
    clearSavedDraft();
    setIsResetModalOpen(false);
    addToast('info', 'Document Reset', 'Loaded the architectural blueprint sample specification.');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-carbon-950 select-none">
      {/* Top Application Header with Brand Mark */}
      <Header
        documentTitle={documentTitle}
        onTitleChange={setDocumentTitle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onExportHtml={handleExportHtml}
        onExportPdf={handleExportPdf}
        onCopyHtml={handleCopyHtml}
        onNativePrint={handleNativePrint}
        isExportingPdf={isExportingPdf}
      />

      {/* Main Split-Screen Workspace (Flush, full-viewport split-pane separated by 1px hairline) */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Pane: Markdown Editor */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div
            style={{
              width: viewMode === 'split' ? `${splitRatio}%` : '100%',
            }}
            className="editor-pane h-full flex flex-col overflow-hidden"
          >
            <MarkdownEditor
              value={markdown}
              onChange={setMarkdown}
              onReset={() => setIsResetModalOpen(true)}
              onFileLoaded={(content, filename) => {
                setMarkdown(content);
                setDocumentTitle(filename);
              }}
              onErrorToast={(title, desc) => addToast('error', title, desc)}
              onSuccessToast={(title, desc) => addToast('success', title, desc)}
            />
          </div>
        )}

        {/* Resizer Hairline Bar (Split mode only) */}
        {viewMode === 'split' && (
          <div
            onMouseDown={handleMouseDownResize}
            className={`resizer w-[1px] hover:w-[4px] -mx-[1.5px] z-10 bg-carbon-700 hover:bg-accent-electric cursor-col-resize transition-all duration-150 relative ${
              isResizing ? 'w-[4px] bg-accent-electric' : ''
            }`}
            title="Drag to resize panes"
          >
            {/* Grip accent hairline */}
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1 h-8 rounded-full bg-carbon-500 opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Right Pane: Live Document Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            style={{
              width: viewMode === 'split' ? `${100 - splitRatio}%` : '100%',
            }}
            className="preview-pane h-full flex flex-col overflow-hidden"
          >
            <DocumentPreview
              sanitizedHtml={sanitizationResult.cleanHtml}
              settings={settings}
              onUpdateSettings={setSettings}
              onCopyHtml={handleCopyHtml}
              onNativePrint={handleNativePrint}
              hasCopiedHtml={hasCopiedHtml}
              onSuccessToast={(title, desc) => addToast('success', title, desc)}
              previewRef={previewRef}
            />
          </div>
        )}
      </main>

      {/* Quiet Typographic Footer Status Bar */}
      <StatusBar
        metrics={metrics}
        lastSavedTime={lastSavedTime}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
      />

      {/* Modals & Dialogs */}
      <SecurityAuditModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />

      {/* High-Craft Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
