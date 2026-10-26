import DOMPurify from 'dompurify';
import { SanitizationResult } from '../types';

/**
 * Strict DOMPurify Configuration
 * Configured as per OWASP and enterprise application security guidelines:
 * - Strict tag and attribute allowlists
 * - No script execution, object/embed/iframe injection
 * - Block javascript: and malicious data: URIs
 * - Enforce rel="noopener noreferrer" and target="_blank" on external anchors
 */

// Permitted semantic HTML tags for document rendering
const ALLOWED_TAGS = [
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Text content & formatting
  'p', 'blockquote', 'pre', 'code', 'kbd', 'samp',
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup',
  'hr', 'br', 'span', 'div',
  // Lists
  'ul', 'ol', 'li',
  // Tables
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  // Links & Media
  'a', 'img',
  // Interactive / Details
  'details', 'summary',
  // Input strictly limited to disabled checkbox for GFM task lists
  'input',
];

// Permitted HTML attributes
const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'id',
  'width', 'height', 'align',
  'type', 'checked', 'disabled', // For task list checkboxes
  'colspan', 'rowspan', 'scope', // For tables
  'target', 'rel',
  'data-language', 'data-code',
];

// Permitted URI schemes: http, https, mailto, tel, sms, relative, fragment, or safe blob
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel|sms):|#|\/|blob:)/i;

// Get or initialize active DOMPurify instance (handles browser and Node/SSR/JSDOM gracefully)
function getPurifyInstance(): DOMPurify.DOMPurifyI {
  if (typeof window !== 'undefined') {
    return (typeof DOMPurify === 'function'
      ? (DOMPurify as unknown as (w: Window) => DOMPurify.DOMPurifyI)(window)
      : DOMPurify) as DOMPurify.DOMPurifyI;
  }
  return DOMPurify as unknown as DOMPurify.DOMPurifyI;
}

const purify = getPurifyInstance();

/**
 * Configure DOMPurify hooks once
 */
let isHookConfigured = false;

function configurePurifyHooks() {
  if (isHookConfigured || !purify || typeof purify.addHook !== 'function') return;

  // Enforce secure link behavior: target="_blank" and rel="noopener noreferrer"
  purify.addHook('afterSanitizeAttributes', (node: Element) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href');

      // Block javascript: and data: URIs completely on hyperlinks
      if (
        href &&
        (href.trim().toLowerCase().startsWith('javascript:') ||
          href.trim().toLowerCase().startsWith('data:'))
      ) {
        node.removeAttribute('href');
        node.setAttribute('data-blocked-scheme', 'true');
      }

      // External links get rel="noopener noreferrer"
      if (href && !href.startsWith('#')) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }

    // Task list checkbox hardening
    if (node.tagName === 'INPUT') {
      const type = node.getAttribute('type');
      if (type !== 'checkbox') {
        node.remove();
      } else {
        // Always force disabled attribute on checkboxes to prevent form tampering
        node.setAttribute('disabled', 'disabled');
      }
    }

    // Image hardening: block unsafe SVG scripts or data URIs that might execute
    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src');
      if (src && src.trim().toLowerCase().startsWith('data:image/svg+xml')) {
        // Disallow inline SVG data URI as image source to prevent nested XSS vectors
        node.removeAttribute('src');
      }
    }
  });

  isHookConfigured = true;
}

// Initialize hooks
configurePurifyHooks();

/**
 * Sanitize Markdown-rendered HTML string with high rigor
 */
export function sanitizeHtml(dirtyHtml: string): SanitizationResult {
  const removedNodes: string[] = [];
  const warnings: string[] = [];

  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return { cleanHtml: '', removedNodesCount: 0, warnings: [] };
  }

  // Pre-filter dangerous schemes
  let prefiltered = dirtyHtml;
  prefiltered = prefiltered.replace(/href=["']?\s*javascript:[^"'>\s]*/gi, 'href="#" data-blocked-scheme="true"');
  prefiltered = prefiltered.replace(/href=["']?\s*data:text\/html[^"'>\s]*/gi, 'href="#" data-blocked-scheme="true"');

  const auditRemoved = (node: Node) => {
    const el = node as HTMLElement;
    if (el.tagName) {
      removedNodes.push(el.tagName.toLowerCase());
      warnings.push(`Stripped disallowed HTML element <${el.tagName.toLowerCase()}>`);
    }
  };

  if (purify && typeof purify.addHook === 'function') {
    purify.addHook('beforeSanitizeElements', auditRemoved);
  }

  let cleanHtml = '';
  if (purify && typeof purify.sanitize === 'function') {
    cleanHtml = purify.sanitize(prefiltered, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOWED_URI_REGEXP,
      FORBID_TAGS: [
        'script', 'iframe', 'object', 'embed', 'form', 'button', 'svg',
        'canvas', 'applet', 'meta', 'link', 'style', 'base',
      ],
      FORBID_ATTR: [
        'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur',
        'onchange', 'onsubmit', 'onkeydown', 'onkeypress', 'onkeyup', 'style',
      ],
      ALLOW_DATA_ATTR: true,
      RETURN_TRUSTED_TYPE: false,
    }) as string;
  } else {
    // Basic fallback if purify is unavailable
    cleanHtml = prefiltered
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  }

  if (purify && typeof purify.removeHook === 'function') {
    purify.removeHook('beforeSanitizeElements');
  }

  return {
    cleanHtml,
    removedNodesCount: removedNodes.length,
    warnings,
  };
}

/**
 * File Upload Security Validation
 * - Enforces extension allowlist: .md, .markdown, .txt
 * - Enforces MIME-type allowlist
 * - Enforces maximum size: 2MB (2 * 1024 * 1024 bytes)
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
}

export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const ALLOWED_EXTENSIONS = ['.md', '.markdown', '.txt'];
export const ALLOWED_MIME_TYPES = [
  'text/markdown',
  'text/plain',
  'text/x-markdown',
  'text/x-web-markdown',
  '', // Browsers often provide empty string for .md files on Windows
];

export function validateUploadedFile(file: { name?: string; size: number; type?: string }): FileValidationResult {
  // 1. File size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds the 2MB security threshold (Attempted: ${sizeInMb}MB).`,
    };
  }

  // 2. File extension check
  const fileName = file.name || '';
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Disallowed file extension "${extension}". Only .md, .markdown, and .txt files are accepted.`,
    };
  }

  // 3. MIME type check
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Disallowed MIME type "${file.type}". Only plain text and markdown are accepted.`,
    };
  }

  return {
    valid: true,
    sanitizedFilename: sanitizeFilename(fileName),
  };
}

/**
 * Sanitize custom filenames before download
 * - Strict alphanumeric allowlist: a-z, A-Z, 0-9, dash, underscore, space
 * - Strips directory traversal sequences (../, ..\)
 * - Clamps filename length to 64 characters
 * - Ensures safe fallback
 */
export function sanitizeFilename(rawName: string, fallback = 'document'): string {
  if (!rawName || typeof rawName !== 'string') {
    return fallback;
  }

  // Strip extension first if present
  let clean = rawName.replace(/\.(md|markdown|txt|html|pdf)$/i, '');

  // Strip directory traversal sequences (../, ..\, etc.)
  clean = clean.replace(/\.{2,}/g, '');

  // Remove path traversal and directory separators
  clean = clean.replace(/[\/\\]/g, '-');

  // Strip illegal filesystem characters (Windows / POSIX): < > : " / \ | ? *
  clean = clean.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');

  // Trim whitespace and collapse repeating dashes/underscores
  clean = clean.trim().replace(/\s+/g, '-').replace(/[-_]{2,}/g, '-');

  // Strict character whitelist: alphanumeric, hyphen, underscore
  clean = clean.replace(/[^a-zA-Z0-9_\-]/g, '');

  // Trim leading and trailing hyphens/underscores
  clean = clean.replace(/^[-_]+|[-_]+$/g, '');

  // Clamp length
  if (clean.length > 64) {
    clean = clean.substring(0, 64);
  }

  return clean || fallback;
}
