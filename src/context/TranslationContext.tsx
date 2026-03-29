import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  TranslationContext,
  FALLBACK_TRANSLATIONS,
} from './translation-context';
import type { TranslationContextType } from './translation-context';

// ─── Provider ────────────────────────────────────────────────────────────────
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Forced to Arabic as per user request
  const [language, setLanguageState] = useState<'ar' | 'en'>('ar');
  const [translations, setTranslations] = useState<Record<string, string>>(FALLBACK_TRANSLATIONS.ar);
  const [isLoading] = useState(false);

  // ── Apply language properties to HTML ───────────────────────────────────────
  const applyLanguageProps = useCallback((lang: 'ar' | 'en') => {
    const isRTLLang = lang === 'ar';
    document.documentElement.dir = isRTLLang ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
  }, []);

  useEffect(() => {
    applyLanguageProps(language);
    setTranslations(FALLBACK_TRANSLATIONS[language] || FALLBACK_TRANSLATIONS.ar);
  }, [language, applyLanguageProps]);

  const setLanguage = useCallback((lang: 'ar' | 'en') => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string, options?: Record<string, string | number>): string => {
      if (!key) return '';
      let text = translations[key] || FALLBACK_TRANSLATIONS.ar[key] || key;

      if (options && typeof text === 'string') {
        Object.entries(options).forEach(([k, v]) => {
          text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        });
      }
      return text;
    },
    [translations]
  );

  const isRTL = language === 'ar';

  const contextValue: TranslationContextType = {
    t,
    language,
    setLanguage,
    isLoading,
    isRTL
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};