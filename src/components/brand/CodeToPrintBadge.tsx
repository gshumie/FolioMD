import React from 'react';

interface CodeToPrintBadgeProps {
  size?: number;
  className?: string;
}

export const CodeToPrintBadge: React.FC<CodeToPrintBadgeProps> = ({
  size = 28,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="FolioMD Code-to-Print Mark"
    >
      {/* Background Plate */}
      <rect width="32" height="32" rx="6" fill="#141619" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="5.5" fill="none" stroke="#262930" strokeWidth="1" />

      {/* Electric Blue # Symbol in Header/Corner */}
      <text
        x="9"
        y="11"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="800"
        fontSize="7"
        fill="#0EA5E9"
      >
        #
      </text>

      {/* Curly Braces { } enclosing FM */}
      <text
        x="4.5"
        y="20.5"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="600"
        fontSize="12.5"
        fill="#0EA5E9"
      >
        &#123;
      </text>
      <text
        x="22.5"
        y="20.5"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="600"
        fontSize="12.5"
        fill="#0EA5E9"
      >
        &#125;
      </text>

      {/* FM Letters */}
      <text
        x="10.5"
        y="18"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        fontSize="8"
        letterSpacing="-0.02em"
        fill="#FFFFFF"
      >
        FM
      </text>

      {/* Horizontal Text-Line Bars (Representing Print Layout) */}
      <line x1="10" y1="21.5" x2="22" y2="21.5" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10" y1="24" x2="18" y2="24" stroke="#475569" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
};
