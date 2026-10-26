import { DocumentSettings } from '../types';
import { DEFAULT_MARKDOWN_SAMPLE } from '../constants/sampleDocument';

const STORAGE_KEYS = {
  MARKDOWN: 'foliomd_draft_markdown',
  TITLE: 'foliomd_draft_title',
  SETTINGS: 'foliomd_document_settings',
  LAST_SAVED: 'foliomd_last_saved',
};

export const DEFAULT_SETTINGS: DocumentSettings = {
  typography: 'swiss',
  paperTheme: 'paper',
  fontSize: 'base',
  lineHeight: 'normal',
  pdfMargin: 'normal',
};

export function loadSavedDraft(): {
  markdown: string;
  title: string;
  settings: DocumentSettings;
  lastSaved: string | null;
} {
  try {
    const savedMarkdown = localStorage.getItem(STORAGE_KEYS.MARKDOWN);
    const savedTitle = localStorage.getItem(STORAGE_KEYS.TITLE);
    const savedSettingsRaw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const lastSaved = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);

    let settings = DEFAULT_SETTINGS;
    if (savedSettingsRaw) {
      try {
        const parsed = JSON.parse(savedSettingsRaw);
        settings = { ...DEFAULT_SETTINGS, ...parsed };
      } catch {
        // Fallback to default
      }
    }

    return {
      markdown: savedMarkdown !== null ? savedMarkdown : DEFAULT_MARKDOWN_SAMPLE,
      title: savedTitle || 'FolioMD Architecture Guide',
      settings,
      lastSaved,
    };
  } catch {
    return {
      markdown: DEFAULT_MARKDOWN_SAMPLE,
      title: 'FolioMD Architecture Guide',
      settings: DEFAULT_SETTINGS,
      lastSaved: null,
    };
  }
}

export function saveDraft(markdown: string, title: string, settings: DocumentSettings): string {
  try {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    localStorage.setItem(STORAGE_KEYS.MARKDOWN, markdown);
    localStorage.setItem(STORAGE_KEYS.TITLE, title);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, timestamp);
    return timestamp;
  } catch (e) {
    console.warn('LocalStorage quota exceeded or restricted:', e);
    return '';
  }
}

export function clearSavedDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.MARKDOWN);
    localStorage.removeItem(STORAGE_KEYS.TITLE);
    localStorage.removeItem(STORAGE_KEYS.LAST_SAVED);
  } catch {
    // Ignore error
  }
}
