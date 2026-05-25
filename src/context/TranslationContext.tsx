import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { API_BASE_URL } from '../services/api';
import { TRANSLATIONS } from './translationsData';

// --- TYPES & INTERFACES ---
export interface TranslationContextType {
  t: (
    key: string,
    fallbackOrOptions?: string | Record<string, string | number>,
    options?: Record<string, string | number>
  ) => string;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  isLoading: boolean;
  isRTL: boolean;
}

// --- CONTEXT ---
export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from LocalStorage
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('jobito_language') as 'ar' | 'en') || 'en';
  });

  // 1.5 Sync Language preference to backend (fire-and-forget)
  const syncLanguageToBackend = useCallback((newLang: 'ar' | 'en') => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_BASE_URL}/users/me/language`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': '69420',
      },
      body: JSON.stringify({ language: newLang }),
    }).catch(() => {
      // Silently fail — language is already saved in localStorage
    });
  }, []);

  // On mount, try to get the language from the backend profile (optional sync)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': '69420',
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.languagePreference && ['ar', 'en'].includes(data.languagePreference)) {
          setLanguageState(data.languagePreference);
        }
      })
      .catch(() => {
        // Use localStorage value as fallback
      });
  }, []);

  // 2. Language Switch Side Effects
  const applyLanguageProps = useCallback((lang: 'ar' | 'en') => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('jobito_language', lang);
  }, []);

  useEffect(() => {
    applyLanguageProps(language);
  }, [language, applyLanguageProps]);

  const setLanguage = useCallback((lang: 'ar' | 'en') => {
    setLanguageState(lang);
    syncLanguageToBackend(lang);
  }, [syncLanguageToBackend]);

  // 3. Local Offline 't' function
  const t = useCallback(
    (
      key: string,
      fallbackOrOptions?: string | Record<string, string | number>,
      options?: Record<string, string | number>
    ): string => {
      if (!key) return '';

      // Determine fallback and options
      let fallbackText: string | undefined;
      let actualOptions: Record<string, string | number> | undefined;

      if (typeof fallbackOrOptions === 'string') {
        fallbackText = fallbackOrOptions;
        actualOptions = options;
      } else if (typeof fallbackOrOptions === 'object') {
        actualOptions = fallbackOrOptions;
      }

      // Lookup in the local TRANSLATIONS map
      const entry = TRANSLATIONS[key];
      let text = entry ? entry[language] : undefined;

      // If translation not found in map, check if there is an explicit fallbackText
      if (!text && fallbackText) {
        text = fallbackText;
      }

      // If still no translation, use key itself
      if (!text) {
        text = key;
      }

      // Variable Replacement (e.g. {{name}})
      if (actualOptions && typeof text === 'string') {
        Object.entries(actualOptions).forEach(([k, v]) => {
          text = text?.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        });
      }
      return text;
    },
    [language]
  );

  const contextValue = React.useMemo(() => ({
    t,
    language,
    setLanguage,
    isLoading: false,
    isRTL: language === 'ar',
  }), [t, language, setLanguage]);

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

// --- HOOK ---
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
