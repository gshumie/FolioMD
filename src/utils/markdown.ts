import { Marked, Tokens } from 'marked';
import hljs from 'highlight.js';
import { sanitizeHtml } from './security';
import { DocumentMetrics, SanitizationResult } from '../types';

/**
 * Configure Marked instance with GFM, tables, breaks, and highlight.js
 */
const markedInstance = new Marked({
  gfm: true,
  breaks: false,
});

// Configure custom renderer for syntax highlighting & architectural styling
markedInstance.use({
  renderer: {
    code(token: Tokens.Code) {
      const text = token.text;
      const lang = token.lang;
      const validLanguage = lang && hljs.getLanguage(lang) ? lang : '';
      let highlightedCode = '';

      try {
        if (validLanguage) {
          highlightedCode = hljs.highlight(text, { language: validLanguage, ignoreIllegals: true }).value;
        } else {
          highlightedCode = hljs.highlightAuto(text).value;
        }
      } catch {
        highlightedCode = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }

      const displayLang = validLanguage || 'text';

      return `
        <div class="code-block-wrapper my-4 rounded-md border border-slate-700/60 overflow-hidden bg-[#0D0E11]">
          <div class="code-block-header flex items-center justify-between px-3.5 py-1.5 bg-[#141619] border-b border-slate-700/50 text-[11px] font-mono text-slate-400 select-none">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#0EA5E9]/80 inline-block"></span>
              <span class="uppercase tracking-wider font-semibold">${displayLang}</span>
            </div>
            <button
              type="button"
              class="copy-code-btn px-2 py-0.5 text-[10px] rounded hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-colors"
              data-code="${encodeURIComponent(text)}"
              title="Copy code snippet"
            >
              Copy
            </button>
          </div>
          <pre class="p-3.5 overflow-x-auto text-[13px] leading-relaxed font-mono"><code class="hljs language-${displayLang}">${highlightedCode}</code></pre>
        </div>
      `;
    },

    checkbox(token: Tokens.Checkbox) {
      return `<input type="checkbox" disabled ${token.checked ? 'checked' : ''} class="mr-2 rounded border-slate-400 text-[#0EA5E9] focus:ring-0 align-middle inline-block pointer-events-none" />`;
    },
  },
});

/**
 * Parse markdown and strictly sanitize output HTML
 */
export function parseMarkdown(markdown: string): SanitizationResult {
  if (!markdown || typeof markdown !== 'string') {
    return {
      cleanHtml: '',
      removedNodesCount: 0,
      warnings: [],
    };
  }

  try {
    const rawHtml = markedInstance.parse(markdown) as string;
    return sanitizeHtml(rawHtml);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Markdown parsing error';
    return {
      cleanHtml: `<div class="p-4 rounded border border-red-800 bg-red-950/30 text-red-300 text-sm font-mono">Error parsing markdown: ${errorMsg}</div>`,
      removedNodesCount: 0,
      warnings: [errorMsg],
    };
  }
}

/**
 * Compute real-time document metrics
 */
export function calculateMetrics(text: string): DocumentMetrics {
  if (!text || !text.trim()) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      lines: 0,
      paragraphs: 0,
      readingTimeMin: 0,
    };
  }

  const lines = text.split(/\r\n|\r|\n/);
  const lineCount = lines.length;

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Words regex matching alphanumeric tokens & words
  const wordsArray = text.match(/\b[\w'-]+\b/g) || [];
  const wordCount = wordsArray.length;

  // Paragraphs separated by blank lines
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;

  // Average reading speed: 200 words per minute
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return {
    words: wordCount,
    characters,
    charactersNoSpaces,
    lines: lineCount,
    paragraphs,
    readingTimeMin: wordCount === 0 ? 0 : readingTimeMin,
  };
}
