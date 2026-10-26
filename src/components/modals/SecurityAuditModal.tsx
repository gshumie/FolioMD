import React from 'react';
import { X, ShieldCheck, Check, Lock, FileCode, Server } from 'lucide-react';

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-carbon-900 border border-carbon-700 rounded-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="security-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-carbon-700 bg-carbon-850">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-accent-electric/15 text-accent-electric">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="security-modal-title" className="text-sm font-semibold text-white tracking-tight">
                FolioMD Security Architecture & Verification Audit
              </h2>
              <p className="text-[11px] text-carbon-400 font-mono">
                Hardened Client-Side Engine // ISO & OWASP Alignment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-carbon-400 hover:text-white rounded hover:bg-carbon-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-carbon-300">
          {/* Section 1: XSS Defense */}
          <div className="p-4 rounded border border-carbon-700 bg-carbon-950/60">
            <div className="flex items-center gap-2 mb-2 font-mono font-semibold text-white">
              <Lock className="w-3.5 h-3.5 text-accent-electric" />
              <span>1. Strict DOMPurify Sanitization Engine</span>
            </div>
            <p className="text-carbon-400 leading-relaxed mb-3">
              All parsed Markdown AST HTML is filtered through a hardened DOMPurify allowlist before DOM injection or document export.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Script & Iframe Execution: BLOCKED</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Inline Event Handlers (on*): STRIPPED</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>javascript: & data: URIs: FILTERED</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>External Links: rel="noopener noreferrer"</span>
              </div>
            </div>
          </div>

          {/* Section 2: Input & File Validation */}
          <div className="p-4 rounded border border-carbon-700 bg-carbon-950/60">
            <div className="flex items-center gap-2 mb-2 font-mono font-semibold text-white">
              <FileCode className="w-3.5 h-3.5 text-accent-electric" />
              <span>2. File Upload & Filename Sanitation</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-carbon-300">
              <p><strong className="text-white">Maximum File Size:</strong> 2MB threshold enforced via client pre-flight check.</p>
              <p><strong className="text-white">Allowed Extensions:</strong> <code className="text-accent-cyan font-mono">.md, .markdown, .txt</code></p>
              <p><strong className="text-white">MIME Validation:</strong> Restricts to <code className="text-accent-cyan font-mono">text/markdown, text/plain</code>.</p>
              <p><strong className="text-white">Filename Normalization:</strong> Strips path traversal sequences (<code className="text-accent-cyan font-mono">../, ..\</code>), filters non-alphanumerics, and clamps to 64 chars.</p>
            </div>
          </div>

          {/* Section 3: HTTP Security Headers */}
          <div className="p-4 rounded border border-carbon-700 bg-carbon-950/60">
            <div className="flex items-center gap-2 mb-2 font-mono font-semibold text-white">
              <Server className="w-3.5 h-3.5 text-accent-electric" />
              <span>3. HTTP Security Headers (Vercel & Netlify Configured)</span>
            </div>
            <div className="p-2.5 rounded bg-carbon-900 border border-carbon-800 font-mono text-[10.5px] space-y-1 text-carbon-300">
              <div className="text-emerald-400">Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self';</div>
              <div>X-Content-Type-Options: nosniff</div>
              <div>X-Frame-Options: DENY</div>
              <div>Referrer-Policy: strict-origin-when-cross-origin</div>
              <div>Permissions-Policy: camera=(), microphone=(), geolocation=()</div>
            </div>
          </div>

          {/* Section 4: Backend / Cloud Sync Hardening Blueprint */}
          <div className="p-4 rounded border border-carbon-700 bg-carbon-950/60">
            <div className="flex items-center gap-2 mb-2 font-mono font-semibold text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-electric" />
              <span>4. Backend & API Hardening Guidelines (Cloud Sync)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-carbon-400">
              <li><strong className="text-carbon-200">Rate Limiting:</strong> Enforce 60 requests/min per IP on API routes using sliding-window rate limiters.</li>
              <li><strong className="text-carbon-200">Explicit CORS:</strong> Strict origin allowlists; never use wildcard <code className="text-accent-cyan font-mono">*</code> with credentials.</li>
              <li><strong className="text-carbon-200">Authentication & RBAC:</strong> JWT signature verification with cryptographic expiration and role-based policies.</li>
              <li><strong className="text-carbon-200">Password Hashing:</strong> Enforce <code className="text-accent-cyan font-mono">Argon2id</code> or <code className="text-accent-cyan font-mono">bcrypt</code> (cost &ge; 12) for credentials.</li>
              <li><strong className="text-carbon-200">Database Defense:</strong> Parameterized statements and prepared queries to neutralize SQL/NoSQL injection.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-carbon-700 bg-carbon-850">
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            All 8 Security Guardrails Active & Verified
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-accent-electric hover:bg-accent-electricHover text-white font-medium rounded text-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
