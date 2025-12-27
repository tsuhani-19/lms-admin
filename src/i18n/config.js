import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files - English (US)
import enUSCommon from './locales/en-US/common.json';
import enUSDashboard from './locales/en-US/dashboard.json';
import enUSProfile from './locales/en-US/profile.json';
import enUSSettings from './locales/en-US/settings.json';
import enUSLogin from './locales/en-US/login.json';
import enUSSidebar from './locales/en-US/sidebar.json';
import enUSUsers from './locales/en-US/users.json';
import enUSContent from './locales/en-US/content.json';

// Import translation files - Japanese
import jaJPCommon from './locales/ja-JP/common.json';
import jaJPDashboard from './locales/ja-JP/dashboard.json';
import jaJPProfile from './locales/ja-JP/profile.json';
import jaJPSettings from './locales/ja-JP/settings.json';
import jaJPLogin from './locales/ja-JP/login.json';
import jaJPSidebar from './locales/ja-JP/sidebar.json';
import jaJPUsers from './locales/ja-JP/users.json';
import jaJPContent from './locales/ja-JP/content.json';

// For other languages, we'll use English as fallback for now
// You can add proper translations later

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': {
        common: enUSCommon,
        dashboard: enUSDashboard,
        profile: enUSProfile,
        settings: enUSSettings,
        login: enUSLogin,
        sidebar: enUSSidebar,
        users: enUSUsers,
        content: enUSContent,
      },
      'ja-JP': {
        common: jaJPCommon,
        dashboard: jaJPDashboard,
        profile: jaJPProfile,
        settings: jaJPSettings,
        login: jaJPLogin,
        sidebar: jaJPSidebar,
        users: jaJPUsers,
        content: jaJPContent,
      },
      // Other languages will fallback to English
      'es-ES': {
        common: enUSCommon,
        dashboard: enUSDashboard,
        profile: enUSProfile,
        settings: enUSSettings,
        login: enUSLogin,
        sidebar: enUSSidebar,
        users: enUSUsers,
        content: enUSContent,
      },
      'fr-FR': {
        common: enUSCommon,
        dashboard: enUSDashboard,
        profile: enUSProfile,
        settings: enUSSettings,
        login: enUSLogin,
        sidebar: enUSSidebar,
        users: enUSUsers,
        content: enUSContent,
      },
      'de-DE': {
        common: enUSCommon,
        dashboard: enUSDashboard,
        profile: enUSProfile,
        settings: enUSSettings,
        login: enUSLogin,
        sidebar: enUSSidebar,
        users: enUSUsers,
        content: enUSContent,
      },
      'zh-CN': {
        common: enUSCommon,
        dashboard: enUSDashboard,
        profile: enUSProfile,
        settings: enUSSettings,
        login: enUSLogin,
        sidebar: enUSSidebar,
        users: enUSUsers,
        content: enUSContent,
      },
      'en-GB': {
        common: enUSCommon,
        dashboard: enUSDashboard,
        profile: enUSProfile,
        settings: enUSSettings,
        login: enUSLogin,
        sidebar: enUSSidebar,
        users: enUSUsers,
        content: enUSContent,
      },
    },
    fallbackLng: 'en-US',
    defaultNS: 'common',
    ns: ['common', 'dashboard', 'profile', 'settings', 'login', 'sidebar', 'users', 'content'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
