export const DEFAULT_MARKDOWN_SAMPLE = `# Welcome to FolioMD — Architecture & Formatting Guide

> **FolioMD** is a production-grade, high-craft Markdown to PDF and HTML converter built on architectural blueprint principles, Swiss typographic precision, and strict enterprise security guarantees.

---

## 1. Architectural Philosophy & Workspace Overview

FolioMD eliminates decorative UI bloat. Instead of generic dashboards or glowing background gradients, the workspace provides a **split-screen IDE** with structural \`1px\` carbon hairlines (\`#262930\`), calibrated typography, and an electric blue (\`#0EA5E9\`) focal accent.

### Core Architecture Pillars

- **Zero-Trust Input Sanitization:** Powered by a hardened \`DOMPurify\` engine enforcing strict HTML element allowlists.
- **Client-Side Autonomy:** All Markdown rendering and document generation occurs directly in your browser. No telemetry or unauthorized network dispatch.
- **Print-Engine Optimization:** Vector-crisp PDF output with intelligent page-break prevention around headers and code blocks.
- **Editorial Typography:** Switch dynamically between *Clean Swiss Sans*, *Classic Editorial Serif*, and *Technical Mono*.

---

## 2. Formatting Capabilities & GFM Support

### Typography & Text Elements

FolioMD renders standard CommonMark and GitHub-Flavored Markdown (GFM) formatting seamlessly:

You can write **bold architectural statements**, *subtle italic annotations*, ~~deprecated revisions~~, and \`inline code tokens\`. Superscripts and footnotes allow rigorous documentation standards.

### Structural Blockquotes & Architectural Callouts

> **Blueprint Note (A-102):**
> High-contrast typography and intentional surface hierarchy ensure documents remain readable across high-resolution displays, e-ink panels, and physical print stock.
>
> *"Form follows function — that has been misunderstood. Form and function should be one, joined in a spiritual union."*
> — Frank Lloyd Wright

---

## 3. Security Verification Matrix

FolioMD enforces mandatory security guardrails against Cross-Site Scripting (XSS), prototype pollution, and arbitrary resource exfiltration:

| Security Vector | Mechanism | Protection Scope | Status |
| :--- | :--- | :--- | :---: |
| **XSS Injection** | \`DOMPurify\` Allowlist | Strips \`<script>\`, \`<iframe>\`, \`<object>\`, inline \`on*\` handlers | \`VERIFIED\` |
| **Dangerous Schemes** | Regex Protocol Filter | Blocks \`javascript:\` and malicious \`data:\` URIs | \`BLOCKED\` |
| **Link Poisoning** | Automated Hook | Injects \`rel="noopener noreferrer"\` on external anchors | \`ENFORCED\` |
| **File Traversal** | Filename Normalizer | Clamps to 64 chars; filters path separators and non-alphanumerics | \`SANITIZED\` |
| **MIME / Size Abuse** | Multi-layer Gate | Restricts uploads to \`<= 2MB\` and valid \`.md\` / \`.txt\` extensions | \`RESTRICTED\` |

---

## 4. Syntax-Highlighted Code Blocks

FolioMD includes native syntax highlighting powered by \`highlight.js\` with language identification and clean container borders.

### TypeScript / Secure Sanitization Pipeline

\`\`\`typescript
import DOMPurify from 'dompurify';

export interface SanitizationResult {
  readonly cleanHtml: string;
  readonly removedNodesCount: number;
}

export function sanitizeDocument(rawHtml: string): SanitizationResult {
  let strippedCount = 0;
  
  DOMPurify.addHook('beforeSanitizeElements', (node) => {
    if ((node as HTMLElement).tagName) strippedCount++;
  });

  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'code', 'pre', 'table', 'blockquote'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'style'],
  }) as string;

  return { cleanHtml, removedNodesCount: strippedCount };
}
\`\`\`

### Architectural CSS Surface Tokens

\`\`\`css
:root {
  --surface-carbon-base: #0D0E11;
  --surface-carbon-panel: #141619;
  --border-structural-hairline: #262930;
  --accent-electric-blue: #0EA5E9;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

.document-preview-page {
  background-color: var(--surface-carbon-panel);
  border: 1px solid var(--border-structural-hairline);
  box-shadow: none; /* No artificial floating drop shadows */
}
\`\`\`

---

## 5. Active Specification & Release Checklist

Track your document tasks and publication workflows using interactive task lists:

- [x] Configure strict Content-Security-Policy (CSP) headers in hosting configuration
- [x] Architect isometric 3D wireframe Folio logo with electric blue crease lines
- [x] Implement live typography switcher (*Swiss Sans*, *Editorial Serif*, *Technical Mono*)
- [x] Enable 2MB client-side drag-and-drop validation with error toast
- [ ] Export final architectural PDF specification with custom margins
- [ ] Review document metrics in the quiet footer status bar

---

## 6. Mathematical Formulations & Blueprint Specs

Physical print margin calibrations follow standardized DIN / ISO 216 proportions:

$$\\text{Aspect Ratio} = \\frac{\\text{Height}}{\\text{Width}} = \\sqrt{2} \\approx 1.4142$$

For an A4 sheet ($210\\text{mm} \\times 297\\text{mm}$), standard printable area with $15\\text{mm}$ structural margins yields:

$$\\text{Active Width} = 210 - (2 \\times 15) = 180\\text{mm}$$

---

*FolioMD — Designed for engineers, technical writers, and architects.*
`;
