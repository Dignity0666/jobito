import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { API_BASE_URL, getCommonHeaders } from '../services/api';

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

  const [staticTranslations, setStaticTranslations] = useState<Record<string, string>>({});
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>({});
  const [pendingQueue] = useState<Set<string>>(new Set());
  
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queueToFetchRef = useRef<Set<string>>(new Set());

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

  // 3. Fetch Static Data from API
  useEffect(() => {
    const fetchStaticTranslations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/translations?lang=${language}`, {
          headers: getCommonHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setStaticTranslations(data);
        }
      } catch (err) {
        console.warn('[Translation API]: Using fallback values.', err);
      }
    };
    fetchStaticTranslations();
  }, [language]);

  const setLanguage = useCallback((lang: 'ar' | 'en') => {
    setLanguageState(lang);
    syncLanguageToBackend(lang);
  }, [syncLanguageToBackend]);

  // 4. Batch Processing for on-demand translations
  const processBatch = useCallback(async () => {
    if (queueToFetchRef.current.size === 0) return;

    const textsToTranslate = Array.from(queueToFetchRef.current);
    queueToFetchRef.current.clear();

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/translations/batch`, {
        method: 'POST',
        headers: getCommonHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          texts: textsToTranslate,
          target_lang: language,
        })
      });
      const data = await response.json();
      
      if (data.translated_texts) {
        setDynamicTranslations(prev => {
          const newMap = { ...prev };
          textsToTranslate.forEach((text, index) => {
            const cacheKey = `${language}:${text}`;
            newMap[cacheKey] = data.translated_texts[index];
            pendingQueue.delete(cacheKey);
          });
          return newMap;
        });
      }
    } catch (err) {
      console.error('[Translation Batch API Error]:', err);
      textsToTranslate.forEach(text => pendingQueue.delete(`${language}:${text}`));
    }
  }, [language, pendingQueue]);

  const queueTranslation = useCallback((text: string) => {
    const cacheKey = `${language}:${text}`;
    if (pendingQueue.has(cacheKey) || dynamicTranslations[cacheKey]) return;

    pendingQueue.add(cacheKey);
    queueToFetchRef.current.add(text);

    if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current);
    batchTimeoutRef.current = setTimeout(() => {
      processBatch();
    }, 100); 
  }, [language, dynamicTranslations, pendingQueue, processBatch]);

  // 5. Main 't' function
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

      // Priority 1: Static API translations (Postgres)
      let text = staticTranslations[key];

      // Priority 2: Dynamic translations cache (Redis/Python results)
      if (!text && dynamicTranslations[`${language}:${key}`]) {
        text = dynamicTranslations[`${language}:${key}`];
      }

      // Priority 3: Explicit Fallback (if provided and translation is missing)
      // Only use fallback if we are NOT in Arabic mode or if the key is NOT already Arabic
      if (!text && fallbackText) {
        const arabicCharCount = (key.match(/[\u0600-\u06FF]/g) || []).length;
        const englishCharCount = (key.match(/[a-zA-Z]/g) || []).length;
        const isMostlyArabicKey = arabicCharCount >= englishCharCount;

        if (language === 'ar' && isMostlyArabicKey) {
          text = key;
        } else {
          text = fallbackText;
        }
      }

      // If still no translation, use key itself
      if (!text) {
        text = key;
      }

      // Priority 4: Dynamic on-demand translation logic (only if not found in static/cache)
      if (typeof key === 'string' && !staticTranslations[key] && !dynamicTranslations[`${language}:${key}`]) {
        const isTranslationKey = /^[a-zA-Z0-9_\-]+(\.[a-zA-Z0-9_\-]+)+$/.test(key);
        if (!isTranslationKey) {
          const arabicCharCount = (key.match(/[\u0600-\u06FF]/g) || []).length;
          const englishCharCount = (key.match(/[a-zA-Z]/g) || []).length;
          
          const isMostlyArabic = arabicCharCount >= englishCharCount;
          
          const needsTranslation = (language === 'en' && isMostlyArabic) || (language === 'ar' && !isMostlyArabic);
          
          if (needsTranslation) {
            queueTranslation(key);
          }
        }
      }

      // Variable Replacement
      if (actualOptions && typeof text === 'string') {
        Object.entries(actualOptions).forEach(([k, v]) => {
          text = text?.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        });
      }
      return text;
    },
    [language, staticTranslations, dynamicTranslations, queueTranslation]
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
