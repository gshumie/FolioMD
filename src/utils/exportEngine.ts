import { DocumentSettings } from '../types';
import { TYPOGRAPHY_THEMES, PAPER_THEMES, FONT_SIZES, LINE_HEIGHTS, PDF_MARGINS } from '../constants/themes';
import { sanitizeFilename } from './security';

/**
 * Generate a complete standalone HTML document with embedded CSS
 */
export function generateSelfContainedHtml(
  contentHtml: string,
  docTitle: string,
  settings: DocumentSettings
): string {
  const typography = TYPOGRAPHY_THEMES[settings.typography];
  const paper = PAPER_THEMES[settings.paperTheme];
  const fontSize = FONT_SIZES[settings.fontSize];
  const lineHeight = LINE_HEIGHTS[settings.lineHeight];
  const cleanTitle = docTitle.trim() || 'FolioMD Document';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanTitle}</title>
  <style>
    /* FolioMD Self-Contained Stylesheet */
    :root {
      --bg-color: ${paper.bgHex};
      --text-color: ${paper.textHex};
      --border-color: ${paper.borderHex};
      --code-bg: ${paper.codeBgHex};
      --accent-electric: #0EA5E9;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      font-family: ${typography.fontFamily};
      font-size: ${fontSize.px};
      line-height: ${lineHeight.value};
      padding: 3rem 2rem;
      max-width: 860px;
      margin: 0 auto;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    /* Architectural Header Line */
    .document-masthead {
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 1.5rem;
      margin-bottom: 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #64748B;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: ${typography.headingFamily};
      color: var(--text-color);
      font-weight: 700;
      line-height: 1.25;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
    }

    h1 {
      font-size: 2.25em;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
      margin-top: 1rem;
    }

    h2 {
      font-size: 1.6em;
      border-bottom: 1px dashed var(--border-color);
      padding-bottom: 0.35rem;
    }

    h3 { font-size: 1.3em; }
    h4 { font-size: 1.1em; }

    p {
      margin-bottom: 1.25rem;
    }

    a {
      color: var(--accent-electric);
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    blockquote {
      border-left: 3px solid var(--accent-electric);
      padding: 0.75rem 1.25rem;
      margin: 1.5rem 0;
      background: ${settings.paperTheme === 'dark' ? '#181B20' : '#F1F5F9'};
      border-radius: 0 4px 4px 0;
      font-style: italic;
    }

    blockquote > p:last-child {
      margin-bottom: 0;
    }

    ul, ol {
      margin-bottom: 1.25rem;
      padding-left: 1.75rem;
    }

    li {
      margin-bottom: 0.4rem;
    }

    hr {
      border: 0;
      height: 1px;
      background: var(--border-color);
      margin: 2.5rem 0;
    }

    code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      background-color: var(--code-bg);
      padding: 0.15rem 0.35rem;
      border-radius: 3px;
      font-size: 0.88em;
      border: 1px solid var(--border-color);
    }

    pre {
      background-color: #0D0E11;
      color: #E2E8F0;
      padding: 1rem 1.25rem;
      border-radius: 6px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85em;
      line-height: 1.6;
      margin: 1.5rem 0;
      border: 1px solid #262930;
    }

    pre code {
      background: transparent;
      padding: 0;
      border: none;
      color: inherit;
    }

    .code-block-wrapper {
      border: 1px solid #262930;
      border-radius: 6px;
      overflow: hidden;
      margin: 1.5rem 0;
      background: #0D0E11;
    }

    .code-block-header {
      background: #141619;
      padding: 0.4rem 0.85rem;
      border-bottom: 1px solid #262930;
      font-family: monospace;
      font-size: 0.75rem;
      color: #94A3B8;
      display: flex;
      justify-content: space-between;
    }

    .copy-code-btn {
      display: none; /* Hide interactive copy button in export */
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.75rem 0;
      font-size: 0.92em;
    }

    th, td {
      border: 1px solid var(--border-color);
      padding: 0.65rem 0.9rem;
      text-align: left;
    }

    th {
      background-color: ${settings.paperTheme === 'dark' ? '#1E2229' : '#F8FAFC'};
      font-weight: 600;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      margin: 1rem 0;
    }

    /* Print styles */
    @media print {
      body {
        background: #FFFFFF !important;
        color: #000000 !important;
        padding: 0;
        max-width: none;
      }

      .code-block-wrapper, pre {
        background: #F8FAFC !important;
        color: #0F172A !important;
        border: 1px solid #CBD5E1 !important;
        page-break-inside: avoid;
      }

      h1, h2, h3, h4, table, blockquote, img {
        page-break-inside: avoid;
      }

      h1, h2, h3 {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="document-masthead">
    <span>FOLIO-MD // ARCHITECTURAL EXPORT</span>
    <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
  </div>
  <main class="document-body">
    ${contentHtml}
  </main>
</body>
</html>`;
}

/**
 * Trigger browser download of self-contained HTML file
 */
export function downloadHtml(contentHtml: string, rawFilename: string, settings: DocumentSettings): void {
  const safeBaseName = sanitizeFilename(rawFilename, 'document');
  const fullHtml = generateSelfContainedHtml(contentHtml, safeBaseName, settings);

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `${safeBaseName}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Trigger client-side PDF generation using html2pdf.js or native vector print
 */
export async function downloadPdf(
  element: HTMLElement,
  rawFilename: string,
  settings: DocumentSettings
): Promise<void> {
  const safeBaseName = sanitizeFilename(rawFilename, 'document');
  const marginMm = PDF_MARGINS[settings.pdfMargin].mm;

  try {
    // Dynamic import to avoid SSR or bundle-time evaluation issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html2pdfModule = (await import('html2pdf.js')) as any;
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const opt = {
      margin: [marginMm, marginMm, marginMm, marginMm],
      filename: `${safeBaseName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        avoid: ['h1', 'h2', 'h3', 'h4', '.code-block-wrapper', 'table', 'blockquote', 'img'],
      },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    // Fallback gracefully: if html2pdf encounters an issue in strict sandboxes, open print dialog
    console.warn('html2pdf fallback to native vector print:', error);
    window.print();
  }
}

/**
 * Copy text or HTML to user clipboard safely
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older context
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
