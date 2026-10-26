# FolioMD — Markdown to PDF / HTML Converter

> Production-ready, high-craft Markdown to PDF and HTML converter built with Swiss typographic precision, architectural blueprint aesthetic, and enterprise-grade input/output sanitization.

---

## Key Features

- **Split-Screen Workspace:** Flush, full-viewport split-pane IDE layout with draggable resizer and structural 1px carbon hairlines (`#262930`).
- **Markdown Editor:** Monospace code editor (`JetBrains Mono` / `Fira Code`) with synchronized line numbers, keyboard shortcuts (`Ctrl+B`, `Ctrl+I`, `Ctrl+K`, `Tab`), and tactile formatting toolbar.
- **GFM & Syntax Highlighting:** Live GFM rendering with tables, task checklists, blockquotes, and `highlight.js` syntax highlighting with copy-code buttons.
- **Export Engine:**
  - **Standalone HTML:** Self-contained `.html` document with embedded CSS.
  - **Download PDF:** High-resolution PDF output with page-break avoidance and configurable margins (Compact 10mm, Normal 15mm, Wide 25mm).
  - **Copy Raw HTML:** One-click copy of sanitized HTML.
  - **Native Vector Print:** Seamless `Ctrl+P` integration with print media stylesheets.
- **Typography & Document Customization:**
  - *Clean Swiss Sans* (Inter / modernist hierarchy)
  - *Classic Editorial Serif* (Merriweather / literary rhythm)
  - *Technical Mono* (JetBrains Mono / blueprint aesthetic)
  - Paper Themes: *Warm Paper* (`#F8FAFC`), *Crisp White* (`#FFFFFF`), and *Deep Carbon* (`#141619`).
- **Local Persistence:** Auto-save drafts safely to `localStorage` with subtle status indicator and reset/clear confirmation.
- **Quiet Status Bar:** Inline typographic metrics (words, characters, lines, reading time) adhering strictly to anti-bloat design rules.
- **Strict Security:** Zero vulnerabilities in dependencies (`npm audit` = 0), hardened `DOMPurify` pipeline, 2MB upload limit, and CSP security headers.

---

## Getting Started

### Prerequisites
- Node.js >= 18 (Tested on Node.js v24)
- npm

### Installation
```bash
# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Security Test Suite
```bash
npm run test:security
# or
node --use-system-ca "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" exec -- tsx test-security.mjs
```

---

## Security Verification Summary

See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) for full audit details.
- **XSS Protection:** Enforced via strict `DOMPurify` allowlists, blocking `<script>`, `<iframe>`, `<object>`, inline `on*` event handlers, and `javascript:` URIs.
- **Link Hardening:** Injects `rel="noopener noreferrer"` and `target="_blank"` on external anchors.
- **File Validation:** Restricts uploads to 2MB, requires `.md`/`.txt` extensions, and normalizes output filenames against path traversal.
- **HTTP Headers:** Configured for Vercel (`vercel.json`) and Netlify (`netlify.toml`).
