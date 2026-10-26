import React, { useRef } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  SquareCode,
  List,
  ListOrdered,
  CheckSquare,
  Link2,
  Table,
  Minus,
  RotateCcw,
  Upload,
} from 'lucide-react';

interface EditorToolbarProps {
  onInsertMarkdown: (prefix: string, suffix?: string, defaultText?: string) => void;
  onInsertTable: () => void;
  onResetDraft: () => void;
  onFileUpload: (file: File) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onInsertMarkdown,
  onInsertTable,
  onResetDraft,
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset file input value so re-selecting same file triggers change
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-carbon-850 border-b border-carbon-700 select-none overflow-x-auto text-carbon-300">
      <div className="flex items-center gap-0.5">
        {/* Headings */}
        <button
          type="button"
          onClick={() => onInsertMarkdown('# ', '', 'Heading 1')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Heading 1 (H1)"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onInsertMarkdown('## ', '', 'Heading 2')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Heading 2 (H2)"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onInsertMarkdown('### ', '', 'Heading 3')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Heading 3 (H3)"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-carbon-700 mx-1" />

        {/* Inline formatting */}
        <button
          type="button"
          onClick={() => onInsertMarkdown('**', '**', 'bold text')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onInsertMarkdown('*', '*', 'italic text')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onInsertMarkdown('~~', '~~', 'strikethrough')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-carbon-700 mx-1" />

        {/* Lists & Tasks */}
        <button
          type="button"
          onClick={() => onInsertMarkdown('- ', '', 'List item')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onInsertMarkdown('1. ', '', 'Numbered item')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onInsertMarkdown('- [ ] ', '', 'Task item')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Task Checklist"
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-carbon-700 mx-1" />

        {/* Blocks: Quote, Code, Table */}
        <button
          type="button"
          onClick={() => onInsertMarkdown('> ', '', 'Quote text')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onInsertMarkdown('`', '`', 'code')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Inline Code"
        >
          <Code className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onInsertMarkdown('```typescript\n', '\n```', '// Code snippet')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Fenced Code Block"
        >
          <SquareCode className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onInsertMarkdown('[', '](https://example.com)', 'Link label')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Hyperlink (Ctrl+K)"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onInsertTable}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Insert Architectural Table"
        >
          <Table className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onInsertMarkdown('\n---\n\n', '')}
          className="p-1.5 rounded hover:bg-carbon-700 hover:text-white transition-colors"
          title="Horizontal Rule / Divider"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right controls: Upload & Reset */}
      <div className="flex items-center gap-1">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload Markdown File"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs hover:bg-carbon-700 text-carbon-300 hover:text-white transition-colors"
          title="Upload .md / .txt file"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-mono">Upload</span>
        </button>
        <button
          type="button"
          onClick={onResetDraft}
          className="p-1.5 rounded text-carbon-400 hover:text-rose-400 hover:bg-carbon-700 transition-colors"
          title="Reset to sample document"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
