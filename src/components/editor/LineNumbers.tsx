import React from 'react';

interface LineNumbersProps {
  lineCount: number;
  scrollTop: number;
}

export const LineNumbers: React.FC<LineNumbersProps> = ({ lineCount, scrollTop }) => {
  // Generate numbers array
  const lines = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  return (
    <div
      className="shrink-0 w-12 py-3 bg-carbon-900 border-r border-carbon-700/80 select-none overflow-hidden text-right font-mono text-[12px] text-carbon-500 leading-[1.65rem]"
      aria-hidden="true"
    >
      <div
        style={{
          transform: `translateY(-${scrollTop}px)`,
        }}
        className="pr-3"
      >
        {lines.map((num) => (
          <div key={num} className="h-[1.65rem]">
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};
