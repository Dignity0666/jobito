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

  // 3. Fetch Static Data from API
  useEffect(() => {
    const fetchStaticTranslations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/translations?lang=${language}`, {
          headers: getCommonHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
        
        // Add hardcoded fallbacks for stubborn strings
        const fallbacks: Record<string, string> = {
          'Company Review': 'مراجعة الشركة',
          'Operations Revenue': 'إيرادات العمليات',
          'Operations Monitor': 'مراقب العمليات',
          'Technical Support': 'الدعم الفني',
          'Total Revenue': 'إجمالي الإيرادات',
          'Operations Manager Activity': 'نشاط مدير العمليات',
          'Criminal Records Review': 'مراجعة السجلات الجنائية',
          'One-time': 'خدمة سريعة',
          'One Time': 'خدمة سريعة',
          'Full Time': 'دوام كامل',
          'Part Time': 'دوام جزئي',
          'Freelance': 'عمل حر',
          'Internship': 'تدريب',
          'Remote': 'عن بعد',
          'Tradesman': 'صنايعي',
          'Technical': 'تقني',
          'Non-Technical': 'غير تقني',
          'Activity Breakdown': 'تحليل النشاط',
          'Hourly Activity (Last 24h)': 'معدل النشاط (آخر 24 ساعة)',
          'No chart data available yet': 'لا توجد بيانات للرسم البياني بعد',
          'Login Activity': 'نشاط تسجيل الدخول',
          'User Actions': 'إجراءات المستخدمين',
          'Company Actions': 'إجراءات الشركات',
          'Admin Actions': 'إجراءات المشرفين',
          'Content Actions': 'إجراءات المحتوى',
          'System Events': 'أحداث النظام',
          'Live': 'مباشر',
          'Login Sessions': 'جلسات الدخول',
          'From current activity log': 'من سجل النشاط الحالي',
          'User Events': 'أحداث المستخدمين',
          'Warn, suspend, ban actions': 'عمليات التحذير، الإيقاف، والحظر',
          'Company Events': 'أحداث الشركات',
          'Review & approval actions': 'عمليات المراجعة والموافقات',
          'Registration, verification, resets': 'التسجيل، التفعيل، وإعادة التعيين',
          'Security Alerts': 'التنبيهات الأمنية',
          'Bans, suspensions, failed logins': 'الحظر، الإيقاف، والدخول الفاشل',
          'System Activity Log': 'سجل نشاط النظام',
          'All Entities': 'جميع الكيانات',
          'Users': 'المستخدمين',
          'Companies': 'الشركات',
          'Admins': 'المشرفين',
          'Content': 'المحتوى',
          'System': 'النظام',
          'Search activity...': 'بحث في الأنشطة...',
          'Admin': 'المشرف',
          'Description': 'الوصف',
          'Target': 'الهدف',
          'Action': 'الإجراء',
          'Time': 'الوقت',
          'Loading activity data...': 'جاري تحميل سجل النشاط...',
          'No activity records found': 'لم يتم العثور على سجلات نشاط',
          'Page': 'صفحة',
          'total': 'إجمالي',
          'Just now': 'الآن',
          'm ago': ' دقيقة',
          'h ago': ' ساعة',
          'd ago': ' يوم',
          'Company Registration Requests': 'طلبات تسجيل الشركات',
          'Criminal Record Reviews': 'مراجعات السجل الجنائي',
          'Tradesmen': 'الحرفيين',
          'Applicant': 'المتقدم',
          'Submission Date': 'تاريخ التقديم',
          'Commercial Registration Review': 'مراجعة السجل التجاري',
          'Commercial Register': 'السجل التجاري',
          'Tax Register': 'البطاقة الضريبية',
          'Criminal Record Document': 'مستند الفيش والتشبيه',
          'View Document': 'عرض المستند',
          'No document uploaded': 'لم يتم رفع مستند',
          'Tax ID': 'الرقم الضريبي',
          'License Number': 'رقم الترخيص',
          'National ID': 'الرقم القومي',
          'Address': 'العنوان',
          'Classification': 'التصنيف',
          'Pending review': 'قيد الانتظار',
          'Reviewed by Super Admin': 'تمت المراجعة بواسطة المسؤول',
          'System Requests': 'طلبات النظام',
          'Review and manage assistant addition requests from Operations Managers': 'مراجعة وإدارة طلبات إضافة المساعدين من مدراء العمليات',
          'Requested by': 'مقدم الطلب',
          'No requests yet': 'لا توجد طلبات بعد',
          'No system requests have been submitted by Operations Managers': 'لم يتم تقديم أي طلبات نظام بواسطة مدراء العمليات بعد',
          'Request approved successfully': 'تمت الموافقة على الطلب بنجاح',
          'Request rejected': 'تم رفض الطلب',
          'Add Assistant': 'إضافة مساعد'
        };

        if (language === 'ar') {
          setStaticTranslations({ ...data, ...fallbacks });
        } else {
          setStaticTranslations(data);
        }
        }
      } catch (err) {
        console.warn('[Translation API]: Using fallback values.', err);
      }
    };
    fetchStaticTranslations();
  }, [language]);

  const setLanguage = useCallback((lang: 'ar' | 'en') => {
    console.log('[TranslationContext.tsx] setLanguage called with:', lang);
    setLanguageState(lang);
    try {
      syncLanguageToBackend(lang);
    } catch (e) {
      console.error('[TranslationContext.tsx] Failed to sync language to backend:', e);
    }
  }, [syncLanguageToBackend]);

  // 4. Batch Processing for on-demand translations
  const processBatch = useCallback(async () => {
    if (queueToFetchRef.current.size === 0) return;

    const textsToTranslate = Array.from(queueToFetchRef.current);
    queueToFetchRef.current.clear();

    try {
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
      
      if (!response.ok || data.error) {
        console.error('[Translation Batch API Error]:', data);
        textsToTranslate.forEach(text => pendingQueue.delete(`${language}:${text}`));
        return;
      }
      
      if (data.translated_texts) {
        setDynamicTranslations(prev => {
          const newMap = { ...prev };
          textsToTranslate.forEach((text, index) => {
            const cacheKey = `${language}:${text}`;
            newMap[cacheKey] = data.translated_texts[index];
            pendingQueue.delete(cacheKey);
          });
          console.log("[DEBUG processBatch] new dynamicTranslations map:", newMap);
          return newMap;
        });
      }
    } catch (err) {
      console.error('[Translation Batch Network Error]:', err);
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

      // Hardcoded high-priority overrides for stubborn strings in both Arabic and English
      if (language === 'en') {
        const englishOverrides: Record<string, string> = {
          'بحث': 'Search',
          'أي مكان': 'Anywhere',
          'القاهرة، مصر': 'Cairo, Egypt',
          'الإسكندرية، مصر': 'Alexandria, Egypt',
          'مسمى الوظيفة أو الكلمة الرئيسية...': 'Job title or keyword...',
          'ما هي الخدمة التي تستطيع تقديمها؟ (سباكة، نجارة...)': 'What service can you provide? (Plumbing, carpentry...)',
          'المؤسسة التعليمية': 'Educational Institution',
          'طلبات التقديم': 'My Applications',
          'USER_REGISTERED': 'User Registered',
          'USER_VERIFIED': 'User Verified',
          'FAILED_LOGIN': 'Failed Login',
          'LOGIN': 'Successful Login',
          'USER_LOGIN': 'User Login',
          'PASSWORD_RESET': 'Password Reset',
          'GOOGLE_LOGIN': 'Google Login',
          'MAINTENANCE_ENABLED': 'Maintenance Mode Enabled',
          'MAINTENANCE_DISABLED': 'Maintenance Mode Disabled',
          'MAINTENANCE_ENABLED_SYSTEM': 'Maintenance Mode Enabled',
          'MAINTENANCE_DISABLED_SYSTEM': 'Maintenance Mode Disabled',
          'WARN_USER': 'User Warned',
          'SUSPEND_USER': 'User Suspended',
          'BAN_USER': 'User Banned',
          'UNBAN_USER': 'User Unbanned',
          'UNSUSPEND_USER': 'User Unsuspended',
          'APPROVE_COMPANY': 'Company Approved',
          'REJECT_COMPANY': 'Company Rejected',
          'INVITE_ADMIN': 'Admin Invited',
          'MAINTENANCE': 'System Maintenance',
          'SYSTEM': 'System Event',
          'actions': 'actions'
        };
        if (englishOverrides[key]) return englishOverrides[key];
        const normalizedKey = key.toUpperCase().replace(/\s+/g, '_');
        if (englishOverrides[normalizedKey]) return englishOverrides[normalizedKey];
      } else if (language === 'ar') {
        const arabicOverrides: Record<string, string> = {
          'Search': 'بحث',
          'Anywhere': 'أي مكان',
          'USER_REGISTERED': 'تسجيل مستخدم جديد',
          'USER_VERIFIED': 'تفعيل حساب مستخدم',
          'FAILED_LOGIN': 'محاولة دخول فاشلة',
          'LOGIN': 'تسجيل دخول ناجح',
          'USER_LOGIN': 'تسجيل دخول مستخدم',
          'PASSWORD_RESET': 'إعادة تعيين كلمة المرور',
          'GOOGLE_LOGIN': 'دخول بواسطة جوجل',
          'MAINTENANCE_ENABLED': 'تفعيل وضع الصيانة',
          'MAINTENANCE_DISABLED': 'إيقاف وضع الصيانة',
          'MAINTENANCE_ENABLED_SYSTEM': 'تفعيل وضع الصيانة',
          'MAINTENANCE_DISABLED_SYSTEM': 'إيقاف وضع الصيانة',
          'WARN_USER': 'إرسال تحذير لمستخدم',
          'SUSPEND_USER': 'إيقاف حساب مستخدم',
          'BAN_USER': 'حظر مستخدم نهائياً',
          'UNBAN_USER': 'إلغاء حظر مستخدم',
          'UNSUSPEND_USER': 'إلغاء إيقاف مستخدم',
          'APPROVE_COMPANY': 'الموافقة على شركة',
          'REJECT_COMPANY': 'رفض تسجيل شركة',
          'INVITE_ADMIN': 'دعوة مشرف جديد',
          'MAINTENANCE': 'صيانة النظام',
          'SYSTEM': 'حدث نظام',
          'actions': 'إجراءات'
        };
        if (arabicOverrides[key]) return arabicOverrides[key];
        const normalizedKey = key.toUpperCase().replace(/\s+/g, '_');
        if (arabicOverrides[normalizedKey]) return arabicOverrides[normalizedKey];
      }

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

        if (language === 'ar') {
          text = isMostlyArabicKey ? key : fallbackText;
        } else {
          text = isMostlyArabicKey ? fallbackText : key;
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
