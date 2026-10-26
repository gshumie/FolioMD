import React, { useRef, useState, useEffect, useCallback } from 'react';
import { LineNumbers } from './LineNumbers';
import { EditorToolbar } from './EditorToolbar';
import { validateUploadedFile } from '../../utils/security';
import { UploadCloud } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  onReset: () => void;
  onFileLoaded: (content: string, filename: string) => void;
  onErrorToast: (title: string, description?: string) => void;
  onSuccessToast: (title: string, description?: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onReset,
  onFileLoaded,
  onErrorToast,
  onSuccessToast,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate lines based on newlines
  const lineCount = (value.match(/\n/g) || []).length + 1;

  // Handle scroll sync with line numbers
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Helper to wrap or insert text around current selection
  const insertText = useCallback(
    (prefix: string, suffix = '', defaultText = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      const textToInsert = selected || defaultText;

      const replacement = `${prefix}${textToInsert}${suffix}`;
      const newValue = value.substring(0, start) + replacement + value.substring(end);

      onChange(newValue);

      // Restore focus and selection
      setTimeout(() => {
        textarea.focus();
        if (selected) {
          textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
        } else {
          textarea.setSelectionRange(start + prefix.length, start + prefix.length + textToInsert.length);
        }
      }, 10);
    },
    [value, onChange]
  );

  // Helper to insert an architectural markdown table
  const insertTable = useCallback(() => {
    const tableTemplate = `
| Blueprint ID | Component Name | Tolerance | Status |
| :--- | :--- | :--- | :---: |
| BP-01 | Main Frame Axis | ±0.05mm | Nominal |
| BP-02 | Isometric Foliage | ±0.10mm | Active |
`;
    insertText('\n' + tableTemplate.trim() + '\n\n', '');
  }, [insertText]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMeta = e.ctrlKey || e.metaKey;

    if (isMeta && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      insertText('**', '**', 'bold text');
    } else if (isMeta && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      insertText('*', '*', 'italic text');
    } else if (isMeta && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      insertText('[', '](https://example.com)', 'Link label');
    } else if (isMeta && e.key.toLowerCase() === 's') {
      e.preventDefault();
      onSuccessToast('Draft Saved', 'All changes persisted to local browser storage.');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (!e.shiftKey) {
        // Insert 2 spaces
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      } else {
        // Outdent if at start of line
        const beforeCursor = value.substring(0, start);
        if (beforeCursor.endsWith('  ')) {
          const newValue = value.substring(0, start - 2) + value.substring(start);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start - 2;
          }, 0);
        }
      }
    }
  };

  // Process file upload safely
  const processUploadedFile = (file: File) => {
    const validation = validateUploadedFile(file);
    if (!validation.valid) {
      onErrorToast('Upload Security Violation', validation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        const cleanName = validation.sanitizedFilename || file.name.replace(/\.[^/.]+$/, '');
        onFileLoaded(content, cleanName);
        onSuccessToast('File Loaded Successfully', `Opened "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
      }
    };
    reader.onerror = () => {
      onErrorToast('File Read Error', 'Failed to read the selected file from disk.');
    };
    reader.readAsText(file);
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate if leaving target element
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  // Ensure textarea adjusts to container resize
  useEffect(() => {
    if (textareaRef.current) {
      setScrollTop(textareaRef.current.scrollTop);
    }
  }, []);

  return (
    <div
      className="relative flex flex-col h-full bg-carbon-900 overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Tactile Formatting Toolbar */}
      <EditorToolbar
        onInsertMarkdown={insertText}
        onInsertTable={insertTable}
        onResetDraft={onReset}
        onFileUpload={processUploadedFile}
      />

      {/* Editor & Line Numbers Workspace */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Synchronized Line Numbers */}
        <LineNumbers lineCount={lineCount} scrollTop={scrollTop} />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 w-full h-full py-3 px-4 bg-carbon-900 text-carbon-100 font-mono text-[13px] leading-[1.65rem] resize-none outline-none border-none selection:bg-accent-electric selection:text-white"
          placeholder="Write, paste, or drag-and-drop your Markdown specification here..."
          aria-label="Markdown Source Code Editor"
        />
      </div>

      {/* Drag & Drop Visual Blueprint Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-carbon-950/90 backdrop-blur-xs border-2 border-dashed border-accent-electric pointer-events-none animate-in fade-in duration-150">
          <div className="p-4 rounded-full bg-accent-electric/15 text-accent-electric mb-3 animate-bounce">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Drop Markdown or Text File
          </h3>
          <p className="text-xs text-carbon-400 font-mono mt-1">
            Accepts .md, .markdown, .txt (Max 2MB)
          </p>
        </div>
      )}
    </div>
  );
};
