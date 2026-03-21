import React from 'react';
import { LANGUAGES } from '@/i18n/translations';
import type { LanguageCode } from '@/i18n/translations';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/i18n';

const FLAGS: Record<LanguageCode, string> = {
  ca: '🏴󠁥󠁳󠁣󠁴󠁿', es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷',
  de: '🇩🇪', it: '🇮🇹', pt: '🇵🇹', nl: '🇳🇱', ar: '🇸🇦',
};

export function LanguageSettingsPage() {
  const { lang, setLang, t } = useTranslation();
  const { addToast } = useToast();

  const handleSelect = (code: LanguageCode) => {
    setLang(code);
    const selected = LANGUAGES.find(l => l.code === code);
    addToast('success', `${selected?.nativeName || code} ✓`);
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
                  <span className="text-2xl">{FLAGS[language.code]}</span>
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
