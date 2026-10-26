import { JSDOM } from 'jsdom';

// Polyfill window for Node test environment so DOMPurify initializes with real DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.Node = dom.window.Node;
globalThis.Element = dom.window.Element;

// Now import security & markdown modules
const { sanitizeHtml, validateUploadedFile, sanitizeFilename } = await import('./src/utils/security.ts');
const { parseMarkdown, calculateMetrics } = await import('./src/utils/markdown.ts');

console.log('=== RUNNING FOLIOMD SECURITY & SANITIZATION VERIFICATION SUITE ===\n');

let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName} - ${details}`);
    failedTests++;
  }
}

// 1. XSS Tests
const xssPayloads = [
  {
    name: 'Raw script tag',
    input: '<script>alert("XSS")</script>Hello',
    forbidden: ['<script', 'alert("XSS")'],
  },
  {
    name: 'Image with onerror handler',
    input: '<img src="invalid.jpg" onerror="alert(document.cookie)">',
    forbidden: ['onerror', 'alert'],
  },
  {
    name: 'Iframe injection',
    input: '<iframe src="https://attacker.com/malicious"></iframe>',
    forbidden: ['<iframe'],
  },
  {
    name: 'Markdown javascript: hyperlink',
    input: '[Malicious Link](javascript:alert("pwned"))',
    forbidden: ['href="javascript:', 'alert("pwned")'],
  },
  {
    name: 'Markdown data: URI hyperlink',
    input: '[Data Link](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)',
    forbidden: ['href="data:text/html'],
  },
  {
    name: 'Onmouseover attack on link',
    input: '<a href="https://example.com" onmouseover="stealTokens()">Safe Looking</a>',
    forbidden: ['onmouseover', 'stealTokens'],
  },
  {
    name: 'SVG onload payload',
    input: '<svg onload="alert(1)"><circle r="10"/></svg>',
    forbidden: ['onload', '<svg'],
  },
  {
    name: 'Object & Embed tags',
    input: '<object data="exploit.swf"></object><embed src="flash.swf">',
    forbidden: ['<object', '<embed'],
  },
];

for (const test of xssPayloads) {
  const result = parseMarkdown(test.input);
  let clean = true;
  for (const forbidden of test.forbidden) {
    if (result.cleanHtml.toLowerCase().includes(forbidden.toLowerCase())) {
      clean = false;
      assert(false, test.name, `Output contained forbidden token "${forbidden}": ${result.cleanHtml}`);
      break;
    }
  }
  if (clean) {
    assert(true, test.name);
  }
}

// 2. Link Hardening Check (rel="noopener noreferrer" and target="_blank")
const linkResult = parseMarkdown('[Trusted Site](https://google.com)');
assert(
  linkResult.cleanHtml.includes('rel="noopener noreferrer"') && linkResult.cleanHtml.includes('target="_blank"'),
  'External link automatically receives rel="noopener noreferrer" and target="_blank"',
  `Got: ${linkResult.cleanHtml}`
);

// 3. Filename Sanitization Checks
const filenameTests = [
  {
    raw: '../../etc/passwd.md',
    expected: 'etc-passwd',
    desc: 'Path traversal ../ stripped',
  },
  {
    raw: 'Quarterly Report *2026* ?:<>|"\\',
    expected: 'Quarterly-Report-2026',
    desc: 'Special filesystem characters removed and spaces converted',
  },
  {
    raw: 'a'.repeat(100),
    expected: 'a'.repeat(64),
    desc: 'Clamped to max 64 characters',
  },
  {
    raw: '   ',
    expected: 'document',
    desc: 'Empty/whitespace defaults to safe fallback',
  },
];

for (const test of filenameTests) {
  const clean = sanitizeFilename(test.raw, 'document');
  assert(clean === test.expected, `Filename Sanitization: ${test.desc}`, `Got: "${clean}", Expected: "${test.expected}"`);
}

// 4. File Upload Validator Checks
const validFile = {
  name: 'architecture-spec.md',
  size: 500 * 1024,
  type: 'text/markdown',
};
assert(validateUploadedFile(validFile).valid, 'Valid .md file accepted');

const oversizeFile = {
  name: 'large-dump.md',
  size: 3 * 1024 * 1024, // 3MB
  type: 'text/markdown',
};
const oversizeResult = validateUploadedFile(oversizeFile);
assert(!oversizeResult.valid && oversizeResult.error.includes('2MB'), 'Oversize 3MB file blocked at pre-flight check');

const maliciousExtFile = {
  name: 'exploit.html',
  size: 1024,
  type: 'text/html',
};
const maliciousExtResult = validateUploadedFile(maliciousExtFile);
assert(!maliciousExtResult.valid && maliciousExtResult.error.includes('Disallowed file extension'), 'Executable/HTML file rejected by extension allowlist');

// 5. Metrics calculation check
const sampleText = '# Header\n\nThis is a sample sentence with six words.\n\nAnother paragraph here.';
const metrics = calculateMetrics(sampleText);
assert(metrics.words === 12, `Word count calculated accurately (Got ${metrics.words}, expected 12)`);
assert(metrics.lines === 5, `Line count accurate (Got ${metrics.lines}, expected 5)`);
assert(metrics.paragraphs === 3, `Paragraph count accurate (Got ${metrics.paragraphs}, expected 3)`);

console.log(`\n=== TEST SUITE COMPLETED: ${failedTests === 0 ? 'ALL CHECKS PASSED (0 ERRORS)' : failedTests + ' FAILED'} ===`);
process.exit(failedTests);
