import { TypographyTheme, PaperTheme, FontSize, LineHeight, PdfMargin } from '../types';

export interface TypographyConfig {
  id: TypographyTheme;
  name: string;
  subtitle: string;
  fontFamily: string;
  headingFamily: string;
  description: string;
  accentClass: string;
}

export const TYPOGRAPHY_THEMES: Record<TypographyTheme, TypographyConfig> = {
  swiss: {
    id: 'swiss',
    name: 'Clean Swiss Sans',
    subtitle: 'Geometric Clarity & International Style',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
    description: 'High-contrast, objective modernist hierarchy with sharp structural lines.',
    accentClass: 'theme-swiss',
  },
  editorial: {
    id: 'editorial',
    name: 'Classic Editorial Serif',
    subtitle: 'Literary Proportion & Long-form Rhythm',
    fontFamily: 'Merriweather, Georgia, "Times New Roman", serif',
    headingFamily: 'Merriweather, Georgia, serif',
    description: 'Warm, bookish cadence ideal for formal monographs and technical essays.',
    accentClass: 'theme-editorial',
  },
  mono: {
    id: 'mono',
    name: 'Technical Mono',
    subtitle: 'Architectural Blueprint & RFC Precision',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    headingFamily: '"JetBrains Mono", "Fira Code", monospace',
    description: 'Engineering blueprint aesthetic with strict columnar alignment.',
    accentClass: 'theme-mono',
  },
};

export interface PaperThemeConfig {
  id: PaperTheme;
  name: string;
  bgHex: string;
  textHex: string;
  borderHex: string;
  codeBgHex: string;
}

export const PAPER_THEMES: Record<PaperTheme, PaperThemeConfig> = {
  paper: {
    id: 'paper',
    name: 'Warm Paper',
    bgHex: '#F8FAFC',
    textHex: '#0F172A',
    borderHex: '#E2E8F0',
    codeBgHex: '#F1F5F9',
  },
  pure: {
    id: 'pure',
    name: 'Crisp White',
    bgHex: '#FFFFFF',
    textHex: '#111827',
    borderHex: '#E5E7EB',
    codeBgHex: '#F3F4F6',
  },
  dark: {
    id: 'dark',
    name: 'Deep Carbon',
    bgHex: '#141619',
    textHex: '#E2E8F0',
    borderHex: '#262930',
    codeBgHex: '#0D0E11',
  },
};

export const FONT_SIZES: Record<FontSize, { label: string; px: string; scale: string }> = {
  sm: { label: 'Small', px: '14px', scale: '0.9rem' },
  base: { label: 'Medium', px: '16px', scale: '1rem' },
  lg: { label: 'Large', px: '18px', scale: '1.125rem' },
};

export const LINE_HEIGHTS: Record<LineHeight, { label: string; value: string }> = {
  compact: { label: 'Compact', value: '1.45' },
  normal: { label: 'Standard', value: '1.65' },
  relaxed: { label: 'Relaxed', value: '1.85' },
};

export const PDF_MARGINS: Record<PdfMargin, { label: string; mm: number }> = {
  compact: { label: 'Compact (10mm)', mm: 10 },
  normal: { label: 'Normal (15mm)', mm: 15 },
  wide: { label: 'Wide (25mm)', mm: 25 },
};
