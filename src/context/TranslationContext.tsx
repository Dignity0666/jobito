import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { API_BASE_URL } from '../services/api';
import enTranslations from '../locales/en';

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

  // Sync Language preference to backend (fire-and-forget)
  const syncLanguageToBackend = useCallback((newLang: 'ar' | 'en') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log('[TranslationContext.tsx] Syncing language to backend:', newLang);
      fetch(`${API_BASE_URL}/users/me/language`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': '69420',
        },
        body: JSON.stringify({ language: newLang }),
      }).catch((err) => {
        console.warn('[TranslationContext.tsx] Async backend sync warning:', err);
      });
    } catch (e) {
      console.warn('[TranslationContext.tsx] Backend sync failed synchronously:', e);
    }
  }, []);

  // On mount, try to get the language from the backend profile
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
    console.log('[TranslationContext.tsx] setLanguage called with:', lang);
    setLanguageState(lang);
    try {
      syncLanguageToBackend(lang);
    } catch (e) {
      console.error('[TranslationContext.tsx] Failed to sync language to backend:', e);
    }
  }, [syncLanguageToBackend]);

  // 3. Main 't' function (Local only, no backend API calls)
  const t = useCallback(
    (
      key: string,
      fallbackOrOptions?: string | Record<string, string | number>,
      options?: Record<string, string | number>
    ): string => {
      if (typeof key !== 'string') {
        if (Array.isArray(key)) {
          key = key[0] || '';
        } else if (key && typeof key === 'object') {
          key = (key as any).name || (key as any).title || String(key);
        } else {
          key = String(key || '');
        }
      }
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

      // Priority 1: Local Dictionary
      let text = '';
      if (language === 'en') {
        text = (enTranslations as Record<string, string>)[key] || '';
      }

      // Priority 2: Explicit Fallback (if provided and not in dictionary)
      if (!text && fallbackText) {
        const arabicCharCount = (key.match(/[\u0600-\u06FF]/g) || []).length;
        const englishCharCount = (key.match(/[a-zA-Z]/g) || []).length;
        const isMostlyArabicKey = arabicCharCount >= englishCharCount;

        if (language === 'ar') {
          text = isMostlyArabicKey ? key : fallbackText;
        } else {
          text = isMostlyArabicKey ? fallbackText : key;
        }
      }

      // If no text derived from fallback logic, use the key itself
      if (!text) {
        text = key;
      }

      // Variable Replacement
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
