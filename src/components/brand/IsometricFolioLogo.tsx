import React from 'react';

interface IsometricFolioLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export const IsometricFolioLogo: React.FC<IsometricFolioLogoProps> = ({
  size = 36,
  className = '',
  showWordmark = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Isometric 3D Wireframe Folio Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="FolioMD Architectural Isometric Logo"
      >
        <defs>
          {/* Subtle blueprint grid pattern */}
          <pattern id="blueprint-grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#262930" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Outer Isometric Base Plate / Workspace Horizon */}
        <polygon
          points="20,4 36,13 20,22 4,13"
          fill="#181B20"
          stroke="#262930"
          strokeWidth="1"
        />

        {/* Back Folio Cover (Wireframe 3D) */}
        <polygon
          points="8,15 20,8 32,15 32,27 20,34 8,27"
          fill="#141619"
          stroke="#475569"
          strokeWidth="1.2"
        />

        {/* Stacked Pages Volume (Isometric Offset) */}
        <polygon
          points="10,16 20,10.5 30,16 30,26 20,31.5 10,26"
          fill="#1E2229"
          stroke="#64748B"
          strokeWidth="1"
        />

        {/* Top Front Document Sheet (High-Contrast Monochrome with Folded Corner) */}
        {/* Main sheet body points: Top-left(12,17), Top-mid(20,12.5), Fold-start(25,15.3), Fold-end(28,20), Bottom-right(28,25), Bottom-spine(20,29.5), Bottom-left(12,25) */}
        <path
          d="M 12 17 L 20 12.5 L 25 15.3 L 28 20 L 28 25 L 20 29.5 L 12 25 Z"
          fill="#0D0E11"
          stroke="#F8FAFC"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Folded Top-Right Page Corner Flap */}
        <polygon
          points="25,15.3 28,17 28,20"
          fill="#0EA5E9"
          fillOpacity="0.25"
          stroke="#0EA5E9"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Architectural Construction Lines (Electric Blue Accent #0EA5E9) */}
        {/* Crease line on fold */}
        <line
          x1="25"
          y1="15.3"
          x2="28"
          y2="20"
          stroke="#0EA5E9"
          strokeWidth="1.5"
          strokeDasharray="2 1.5"
        />

        {/* Document Spine Alignment Axis */}
        <line
          x1="20"
          y1="12.5"
          x2="20"
          y2="29.5"
          stroke="#0EA5E9"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Typographic Blueprint Guidelines on Left Page */}
        <line x1="14" y1="20" x2="18.5" y2="17.5" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
        <line x1="14" y1="22.5" x2="18.5" y2="20" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
        <line x1="14" y1="25" x2="17" y2="23.3" stroke="#64748B" strokeWidth="1" strokeLinecap="round" />

        {/* Typographic Blueprint Guidelines on Right Page */}
        <line x1="21.5" y1="22" x2="26" y2="24.5" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
        <line x1="21.5" y1="24.5" x2="26" y2="27" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />

        {/* Dimension Arrow / Precision Blueprint Accent Vertex */}
        <circle cx="20" cy="12.5" r="1.5" fill="#0EA5E9" />
        <circle cx="28" cy="20" r="1.2" fill="#0EA5E9" />
      </svg>

      {/* Wordmark: Geometric Sans (Inter/Geist), 600 weight, tight tracking -0.03em */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[17px] font-semibold text-white tracking-[-0.03em]"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Folio<span className="text-[#0EA5E9]">MD</span>
            </span>
            <span className="inline-block text-[9px] uppercase tracking-wider font-mono font-medium px-1.5 py-0.5 rounded bg-[#1C2027] border border-[#262930] text-[#94A3B8]">
              v1.0
            </span>
          </div>
          <span className="text-[10px] tracking-tight text-[#64748B] font-mono mt-0.5">
            Markdown to PDF / HTML
          </span>
        </div>
      )}
    </div>
  );
};
