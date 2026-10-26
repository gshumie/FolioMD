export type TypographyTheme = 'swiss' | 'editorial' | 'mono';
export type PaperTheme = 'paper' | 'pure' | 'dark';
export type FontSize = 'sm' | 'base' | 'lg';
export type LineHeight = 'compact' | 'normal' | 'relaxed';
export type PdfMargin = 'compact' | 'normal' | 'wide';
export type ViewMode = 'split' | 'editor' | 'preview';

export interface DocumentSettings {
  typography: TypographyTheme;
  paperTheme: PaperTheme;
  fontSize: FontSize;
  lineHeight: LineHeight;
  pdfMargin: PdfMargin;
}

export interface DocumentMetrics {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  lines: number;
  paragraphs: number;
  readingTimeMin: number;
}

export interface SanitizationResult {
  cleanHtml: string;
  removedNodesCount: number;
  warnings: string[];
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
}
