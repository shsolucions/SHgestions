import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { LANGUAGES } from '@/i18n/translations';
import type { LanguageCode } from '@/i18n/translations';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';

function FlagIcon({ code }: { code: LanguageCode }) {
  if (code === 'ca') {
    return (
      <svg width="28" height="20" viewBox="0 0 28 20" className="rounded-sm">
        <rect width="28" height="20" fill="#FCDD09"/>
        <rect y="2.2" width="28" height="2.2" fill="#DA121A"/>
        <rect y="6.6" width="28" height="2.2" fill="#DA121A"/>
        <rect y="11" width="28" height="2.2" fill="#DA121A"/>
        <rect y="15.4" width="28" height="2.2" fill="#DA121A"/>
        <rect width="12" height="10" fill="#003DA5"/>
        <polygon points="6,2 7.2,5.2 10.5,5.2 7.8,7.2 8.8,10.4 6,8.2 3.2,10.4 4.2,7.2 1.5,5.2 4.8,5.2" fill="#DA121A"/>
      </svg>
    );
  }
  const flags: Record<string, string> = {
    es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪',
    it: '🇮🇹', pt: '🇵🇹', nl: '🇳🇱', ar: '🇸🇦',
  };
  return <span className="text-2xl">{flags[code] || '🏳️'}</span>;
}

export function LanguageSettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSelect = (code: LanguageCode) => {
    setLang(code);
    const selected = LANGUAGES.find(l => l.code === code);
    addToast('success', `${selected?.nativeName || code} ✓`);
    // Tornar al menú principal després de seleccionar
    setTimeout(() => navigate('/loans'), 400);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{t('langTitle')}</h2>
      <p className="text-sm text-surface-500 dark:text-surface-400">{t('langSelect')}</p>

      <div className="space-y-2">
        {LANGUAGES.map(language => {
          const isActive = lang === language.code;
          return (
            <Card
              key={language.code}
              hoverable
              onClick={() => handleSelect(language.code)}
              className={`p-4 transition-all ${isActive ? 'ring-2 ring-brand-500 border-brand-400 dark:border-brand-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FlagIcon code={language.code} />
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                      {language.nativeName}
                    </p>
                    <p className="text-xs text-surface-400">{language.name}</p>
                  </div>
                </div>
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
