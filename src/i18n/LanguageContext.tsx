import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, LANGUAGES, type LanguageCode } from './translations';

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | null>(null);
const STORAGE_KEY = 'SHgestions_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in translations) return stored as LanguageCode;
    return 'ca';
  });

  const langInfo = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = langInfo.dir;
  }, [lang, langInfo.dir]);

  const setLang = useCallback((code: LanguageCode) => {
    setLangState(code);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const strings = translations[lang];
    let text = (strings as any)[key] ?? (translations['ca'] as any)[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return text;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: langInfo.dir, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

// Alias perquè ambdós noms funcionin a tot arreu
export const useTranslation = useLanguage;
