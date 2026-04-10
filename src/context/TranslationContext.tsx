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

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('jobito_language') as 'ar' | 'en') || 'en';
  });
  
  const [staticTranslations, setStaticTranslations] = useState<Record<string, string>>({});
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>({});
  const [pendingTranslations] = useState<Set<string>>(new Set());

  const applyLanguageProps = useCallback((lang: 'ar' | 'en') => {
    document.documentElement.dir = 'ltr'; 
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('jobito_language', lang);
  }, []);

  useEffect(() => {
    applyLanguageProps(language);
  }, [language, applyLanguageProps]);

  useEffect(() => {
    const fetchStaticTranslations = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/translations?lang=${language}`);
        if (response.ok) {
          const data = await response.json();
          setStaticTranslations(data);
        }
      } catch (err) {
        console.error('[Translation API Error]: Failed to fetch static translations', err);
      }
    };
    fetchStaticTranslations();
  }, [language]);

  const setLanguage = useCallback((lang: 'ar' | 'en') => {
    setLanguageState(lang);
  }, []);

  const fetchTranslation = useCallback(async (text: string, targetLang: string) => {
    const cacheKey = `${targetLang}:${text}`;
    if (pendingTranslations.has(cacheKey)) return;
    
    pendingTranslations.add(cacheKey);
    try {
      const response = await fetch('http://localhost:5001/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          target_lang: targetLang,
          source_lang: 'auto'
        })
      });
      const data = await response.json();
      if (data.translated_text) {
        setDynamicTranslations(prev => ({
          ...prev,
          [cacheKey]: data.translated_text
        }));
      }
    } catch (err) {
      console.error('[Translation Error]:', err);
    } finally {
      pendingTranslations.delete(cacheKey);
    }
  }, [pendingTranslations]);

  const t = useCallback(
    (key: string, options?: Record<string, string | number>): string => {
      if (!key) return '';

      let text = FALLBACK_TRANSLATIONS[language]?.[key] || key;
      const cacheKey = `${language}:${key}`;
      
      if (staticTranslations[key]) {
        text = staticTranslations[key];
      } else if (dynamicTranslations[cacheKey]) {
        text = dynamicTranslations[cacheKey];
      } else if (!FALLBACK_TRANSLATIONS[language]?.[key] && !staticTranslations[key]) {
        const isTranslationKey = /^[a-zA-Z0-9_\-]+(\.[a-zA-Z0-9_\-]+)+$/.test(key);
        if (!isTranslationKey) {
          const isArabicText = /[\u0600-\u06FF]/.test(key);
          if (language === 'en' && isArabicText) {
            fetchTranslation(key, language);
          } else if (language === 'ar' && !isArabicText) {
            fetchTranslation(key, language);
          }
        }
      }

      if (options && typeof text === 'string') {
        Object.entries(options).forEach(([k, v]) => {
          text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        });
      }
      return text;
    },
    [language, staticTranslations, dynamicTranslations, fetchTranslation]
  );

  const contextValue: TranslationContextType = {
    t,
    language,
    setLanguage,
    isLoading: false,
    isRTL: false,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};
