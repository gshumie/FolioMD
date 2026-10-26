# FolioMD — Markdown to PDF / HTML Converter

[![FolioMD CI](https://github.com/gshumie/FolioMD/actions/workflows/ci.yml/badge.svg)](https://github.com/gshumie/FolioMD/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Security: OWASP Hardened](https://img.shields.io/badge/Security-DOMPurify%2018%2F18%20Pass-emerald)](SECURITY_AUDIT.md)
[![Vulnerabilities: 0](https://img.shields.io/badge/Vulnerabilities-0%20Known-emerald)](package.json)

> **FolioMD** is a production-ready, high-craft Markdown to PDF and HTML converter built on Swiss typographic precision, architectural blueprint aesthetics, and enterprise-grade input/output sanitization.

Write, paste, or upload Markdown on the left pane and instantly preview, customize, and export cleanly formatted HTML or PDF documents on the right pane.

---

## Architectural & Design Philosophy

FolioMD eliminates generic dashboard bloat, decorative neon gradients, and floating drop-shadow widgets in favor of an intentional, functional workspace inspired by architectural blueprints and International Typographic Style:

- **Solid Blueprint Surfaces:** Deep carbon (`#0D0E11` and `#141619`) IDE workspace separated by flush, structural `1px` hairlines (`#262930`).
- **Purposeful Electric Blue Accent:** `#0EA5E9` reserved exclusively for focal export actions, fold creases, and active interactive states.
- **Quiet Typographic Status Bar:** Real-time document metrics (words, characters, lines, reading time) embedded directly in the footer — strictly rejecting arbitrary 4-card stat grids.
- **Client-Side Autonomy:** All parsing, sanitization, and PDF compilation occurs locally in browser memory. No tracking, telemetry, or external data dispatch.

---

## Core Features & Capabilities

### 1. Split-Screen IDE Workspace
- **Left Pane (Editor):** Monospace editing powered by `JetBrains Mono` and `Fira Code` with synchronized line numbering and multi-cursor friendly selection.
- **Tactile Formatting Toolbar:** Instant controls for Bold (`Ctrl+B`), Italic (`Ctrl+I`), Strikethrough, Headings (H1–H3), Blockquotes, Inline Code, Fenced Code Blocks, Lists, Task Checklists, Links (`Ctrl+K`), and Architectural Tables.
- **Keyboard Shortcuts:** `Tab` (2-space indentation without losing focus), `Shift+Tab` (outdent), `Ctrl/Cmd+S` (save notification), `Ctrl/Cmd+P` (vector print).
- **Drag-and-Drop Ingestion:** Drag `.md`, `.markdown`, or `.txt` files directly into the editor with visual blueprint dropzone feedback.

### 2. High-Fidelity Live Preview
- **Full GFM Support:** GitHub-Flavored Markdown rendering including tables, task lists, and blockquote callouts.
- **Syntax Highlighting:** Integrated `highlight.js` with language detection and one-click code snippet copy buttons.
- **Interactive Pane Resizer:** Draggable split handle allowing custom width ratios from 25% to 75%.
- **View Modes:** Toggle seamlessly between **Split View**, **Editor Only**, and **Preview Only**.

### 3. Curated Editorial Typography & Paper Themes
- **Typography Styles:**
  - *Clean Swiss Sans* (Inter / modernist hierarchy and geometric clarity)
  - *Classic Editorial Serif* (Merriweather / bookish rhythm for monographs)
  - *Technical Mono* (JetBrains Mono / blueprint aesthetic for RFCs and specifications)
- **Paper Surfaces:**
  - *Warm Paper* (`#F8FAFC` background with `#0F172A` ink)
  - *Crisp White* (`#FFFFFF` background with `#111827` ink)
  - *Deep Carbon* (`#141619` background with `#E2E8F0` text)
- **Typographic Scale Controls:** Adjust font size (Small 14px, Medium 16px, Large 18px), line spacing (Compact 1.45, Standard 1.65, Relaxed 1.85), and PDF page margins (Compact 10mm, Normal 15mm, Wide 25mm).

### 4. Triple Export Engine
- **Download Standalone HTML:** Produces a self-contained `.html` file with embedded CSS styling matching the chosen theme, complete with meta tags and clean print stylesheets.
- **Download PDF Document:** Vector-crisp client-side `.pdf` generation via print CSS and `html2pdf.js` (v0.14.0) with intelligent page-break avoidance around headings, tables, and code blocks.
- **Copy Raw HTML:** Instant sanitized HTML copy to the clipboard for CMS or blog publishing.
- **Native Vector Print:** Direct trigger for browser native print dialog (`Ctrl+P`) for 100% vector-sharp print output without rasterization.

### 5. Local Persistence
- Debounced auto-save to `localStorage` with a subtle timestamp indicator in the status bar.
- "Reset to Sample" confirmation modal to safely revert to the architectural guide document.

---

## Security Architecture & Audit (18/18 Verified)

FolioMD is audited against OWASP Top 10 client-side vulnerabilities. See [`SECURITY_AUDIT.md`](SECURITY_AUDIT.md) for the full architectural report.

### Automated Test Suite Results
Run the automated security test suite locally via:
```bash
npm run test:security
```

```text
=== RUNNING FOLIOMD SECURITY & SANITIZATION VERIFICATION SUITE ===

[PASS] Raw script tag
[PASS] Image with onerror handler
[PASS] Iframe injection
[PASS] Markdown javascript: hyperlink
[PASS] Markdown data: URI hyperlink
[PASS] Onmouseover attack on link
[PASS] SVG onload payload
[PASS] Object & Embed tags
[PASS] External link automatically receives rel="noopener noreferrer" and target="_blank"
[PASS] Filename Sanitization: Path traversal ../ stripped
[PASS] Filename Sanitization: Special filesystem characters removed and spaces converted
[PASS] Filename Sanitization: Clamped to max 64 characters
[PASS] Filename Sanitization: Empty/whitespace defaults to safe fallback
[PASS] Valid .md file accepted
[PASS] Oversize 3MB file blocked at pre-flight check
[PASS] Executable/HTML file rejected by extension allowlist
[PASS] Word count calculated accurately (Got 12, expected 12)
[PASS] Line count accurate (Got 5, expected 5)
[PASS] Paragraph count accurate (Got 3, expected 3)

=== TEST SUITE COMPLETED: ALL CHECKS PASSED (0 ERRORS) ===
```

### Security Enforcement Controls
1. **DOMPurify Strict Allowlist:** Strips `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<button>`, `<svg>`, `<canvas>`, and all inline event handlers (`onerror`, `onload`, `onclick`, `onmouseover`).
2. **Protocol Hardening:** Blocks `javascript:` and `data:text/html` schemes. External hyperlinks automatically receive `rel="noopener noreferrer"` and `target="_blank"`.
3. **Pre-Flight File Upload Guard:** 2MB size ceiling checked before reading file buffers; restricts extensions strictly to `.md`, `.markdown`, and `.txt`.
4. **Filename Normalization:** Sanitizes export filenames against directory traversal (`../`, `..\`), clamps length to 64 chars, and strips non-alphanumeric characters.
5. **Zero Vulnerability Dependencies:** Dependency tree audited clean (`0 vulnerabilities` on `npm audit`).
6. **HTTP Security Headers (`vercel.json` & `netlify.toml`):**
   - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; ...`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

---

## Local Development & Installation

### Prerequisites
- Node.js >= 18 (Tested on Node.js v20 and v24)
- npm >= 9

### Quick Start
```bash
# Clone the repository
git clone https://github.com/gshumie/FolioMD.git
cd FolioMD

# Install dependencies cleanly
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` to interact with FolioMD.

### Scripts
- `npm run dev`: Starts the Vite development server on port 3000.
- `npm run build`: Executes TypeScript verification (`tsc`) and bundles optimized production assets into `dist/`.
- `npm run preview`: Previews the production build locally.
- `npm run test:security`: Executes the 18-point XSS sanitization and security audit suite.

---

## Continuous Integration (CI)

FolioMD includes a GitHub Actions workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) triggered on every push and pull request to `main`:
1. Clean dependency installation (`npm ci`).
2. Execution of the 18/18 automated security and XSS test vectors (`npm run test:security`).
3. Verification of TypeScript compilation and production bundle generation (`npm run build`).

---

## Deployment Guide

### Deploying to Vercel

#### Method 1: One-Click Vercel Import (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import the repository: `https://github.com/gshumie/FolioMD`.
3. Vercel automatically detects the Vite framework and applies the settings from [`vercel.json`](vercel.json):
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Vercel will deploy the site with all strict HTTP security headers active.

#### Method 2: Deploying via Vercel CLI
```bash
# Install Vercel CLI globally (or run via npx)
npm i -g vercel

# Deploy production release
vercel --prod
```

### Deploying to Netlify
FolioMD includes pre-configured [`netlify.toml`](netlify.toml):
```bash
# Deploy to Netlify
npx netlify-cli deploy --prod --dir=dist
```

---

## License

MIT © [FolioMD Architect](https://github.com/gshumie/FolioMD)
