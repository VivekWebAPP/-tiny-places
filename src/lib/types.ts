export type ThemeKey = 'buttercup' | 'blossom' | 'lavender' | 'mint' | 'peach' | 'sky';

export type TemplateKey =
  | 'friendship'
  | 'proposal'
  | 'valentine'
  | 'apology'
  | 'birthday';

export interface ExhibitConfig {
  /** Exhibit 001 — scratch/rub glass */
  scratch: {
    title: string;
    hiddenText: string;
    coverText: string;
  };
  /** Exhibit 002 — slide lock */
  slideLock: {
    title: string;
    label: string;
    hiddenText: string;
  };
  /** Exhibit 003 — curtain reveal */
  curtain: {
    title: string;
    hiddenText: string;
    imageUrl: string;
  };
}

export interface DiagnosticCheck {
  label: string;
  result: string;
}

export interface WordSearchWord {
  word: string;
  emoji: string;
}

export interface AgreementItem {
  id: string;
  text: string;
}

export interface CardData {
  template: TemplateKey;
  theme: ThemeKey;
  recipientName: string;
  authorName: string;
  introNote: string;
  museumTitle: string;
  exhibits: ExhibitConfig;
  diagnostic: {
    title: string;
    checks: DiagnosticCheck[];
    stampText: string;
  };
  letter: string;
  letterSignature: string;
  wordSearch: {
    title: string;
    words: WordSearchWord[];
  };
  agreement: {
    title: string;
    items: AgreementItem[];
    stampText: string;
  };
  outro: {
    message: string;
    whatsappNumber: string;
    email: string;
  };
}

export interface SavedCard {
  id: string;
  data: CardData;
  created_at: string;
  updated_at: string;
}
