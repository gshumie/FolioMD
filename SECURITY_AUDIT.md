# FolioMD Security Audit & Architecture Specification

**Product:** FolioMD (Markdown to PDF / HTML Converter)  
**Security Classification:** Enterprise Client-Side Architecture  
**Audit Status:** `VERIFIED & HARDENED (0 Known Vulnerabilities)`  
**Audit Date:** October 2026

---

## 1. Threat Model & Security Posture Summary

FolioMD processes untrusted user input (arbitrary Markdown documents, pasted text, and dropped files) and renders it into live DOM HTML, as well as compiling standalone HTML and PDF assets. The primary attack surfaces are:

1. **Cross-Site Scripting (XSS):** Malicious payloads injected via raw HTML, crafted Markdown links, malicious image tags, or SVG event handlers.
2. **Resource & Denial of Service (DoS):** Exploitation via oversized files or deeply nested DOM patterns.
3. **Path Traversal & Filesystem Abuse:** Custom filename injections targeting OS file systems on export.
4. **Supply Chain Vulnerabilities:** Vulnerabilities in rendering and PDF conversion packages.

---

## 2. Hardening Measures & Enforcement

### 2.1 Strict Input/Output XSS Sanitization (`DOMPurify`)
- **Strict Tag Allowlist:** Permitted semantic HTML tags are restricted to formatting (`h1-h6`, `p`, `blockquote`, `pre`, `code`, `b`, `strong`, `i`, `em`, `ul`, `ol`, `li`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `a`, `img`, `hr`, `span`, `div`, `details`, `summary`, and disabled checkboxes).
- **Hard Blocked Tags:** `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<button>`, `<svg>`, `<canvas>`, `<applet>`, `<meta>`, `<link>`, `<style>`, and `<base>` are completely stripped.
- **Event Handler Neutralization:** All inline event handlers (`onerror`, `onload`, `onclick`, `onmouseover`, `onfocus`, etc.) are forbidden.
- **Protocol Filtering:** Hyperlink protocols are restricted to `https:`, `http:`, `mailto:`, `tel:`, and relative `#` anchors. Schemes such as `javascript:` and malicious `data:text/html` are intercepted and neutralized.
- **Link Hardening Hook:** An automated DOMPurify post-processing hook forces `rel="noopener noreferrer"` and `target="_blank"` onto all external hyperlinks, eliminating reverse tabnabbing.

### 2.2 File Upload & Pre-Flight Validation
- **Size Threshold:** Enforces a client-side limit of **2MB** (`2 * 1024 * 1024` bytes) prior to reading file buffers into memory.
- **Extension Allowlist:** Accepts only `.md`, `.markdown`, and `.txt`. Binary or executable formats are immediately rejected.
- **MIME-Type Validation:** Validates MIME headers against `text/markdown`, `text/plain`, and standard markdown descriptors.
- **Filename Sanitization:** All downloaded documents run through a multi-pass normalizer that strips directory traversal indicators (`../`, `..\`), removes non-alphanumeric characters (except safe hyphens/underscores), collapses consecutive dividers, and clamps length to 64 characters.

### 2.3 Dependency Hygiene & Supply Chain Security
- Dependencies are audited and kept strictly minimal:
  - `marked` (v15.x): Actively maintained GFM parser.
  - `dompurify` (v3.2.x): Industry standard HTML sanitizer.
  - `highlight.js` (v11.11.x): High-speed syntax highlighter.
  - `html2pdf.js` (v0.14.0): Updated to version 0.14.0, resolving legacy `jspdf` CVEs (GHSA-w8x4-x68c-m6fc).
  - `@tailwindcss/vite` & `tailwindcss` (v4.x): Vulnerability-free styling engine.
- `npm audit` reports **0 vulnerabilities**.

### 2.4 HTTP Security Headers (Vercel & Netlify)
Configured in both `vercel.json` and `netlify.toml`:
- `Content-Security-Policy`:
  `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';`
- `X-Content-Type-Options: nosniff` (prevents MIME type sniffing)
- `X-Frame-Options: DENY` (prevents clickjacking via iframes)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

### 2.5 Production Build Hardening
- In `vite.config.ts`, `drop: ['console', 'debugger']` is active in production builds, ensuring no stack traces, logs, or debug tokens leak to client bundles.
- `.gitignore` strictly blocks environment files (`.env*`), private keys (`*.pem`, `*.key`), and build artifacts.

---

## 3. Backend / API & Auth Hardening Blueprint (Cloud Sync Ready)

For teams extending FolioMD with cloud sync or server-side document storage, adhere to these architectural standards:

1. **IP & Token Rate Limiting:**
   - Enforce sliding-window rate limiting on all document upload/sync endpoints (e.g. 60 requests/min per IP, 120 requests/min per authenticated token).
2. **Explicit CORS Allowlisting:**
   - Set `Access-Control-Allow-Origin` to explicit trusted domains (e.g., `https://foliomd.app`). Never reflect `Origin` headers with credentials or use wildcard `*` on state-changing endpoints.
3. **Authentication & RBAC:**
   - Verify JWT signatures with asymmetric algorithms (`RS256` or `EdDSA`). Enforce short lifetimes (15 minutes) with HTTP-only, secure, `SameSite=Strict` refresh tokens.
4. **Credential Hashing:**
   - Hash passwords exclusively with `Argon2id` (memory cost: 64MB, iterations: 3, parallelism: 1) or `bcrypt` (cost factor &ge; 12).
5. **Database Parameterization:**
   - Utilize parameterized SQL queries or ORM prepared statements with least-privilege credentials. Ensure public static asset directories never serve `.git`, `.env`, or configuration backups.
