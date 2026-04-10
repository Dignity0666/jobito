import { createContext, useContext } from 'react';

export interface TranslationContextType {
  t: (key: string, options?: Record<string, string | number>) => string;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  isLoading: boolean;
  isRTL: boolean;
}

export const TranslationContext = createContext<TranslationContextType>({
  t: (key) => key,
  language: 'en',
  setLanguage: () => {},
  isLoading: false,
  isRTL: false,
});

export const useTranslation = () => useContext(TranslationContext);

export const FALLBACK_TRANSLATIONS: Record<string, Record<string, string>> = {
  ar: {
    'nav.home': 'الرئيسية',
    'nav.find_jobs': 'بحث عن وظائف',
    'nav.companies': 'تصفح الشركات',
    'nav.about': 'عن المنصة',
    'nav.contact': 'اتصل بنا',
    'nav.dashboard': 'لوحة التحكم',
    'nav.profile': 'الملف الشخصي',
    'nav.messaging': 'الرسائل',
    'dashboard.total_applied': 'طلباتي',
    'profile.experience': 'قائمة الوظائف',
  },
  en: {
    'nav.home': 'Home',
    'nav.find_jobs': 'Find Jobs',
    'nav.companies': 'Browse Companies',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.messaging': 'Messaging',
    'dashboard.total_applied': 'My Applications',
    'profile.experience': 'Job Listing',
    'profile.title': 'My Profile',
    'profile.save_changes': 'Save Changes',
    'profile.save_success': 'Profile updated successfully!',
    'profile.skills': 'Skills',
    'profile.email': 'Email',
    'profile.social_links': 'Social Links',
    'profile.languages': 'Languages',
  },
};
