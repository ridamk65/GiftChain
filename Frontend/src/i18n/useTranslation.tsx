import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Translation, supportedLanguages } from './translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translation;
  supportedLanguages: typeof supportedLanguages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    // Get language from localStorage or browser preference
    const saved = localStorage.getItem('giftchain-language');
    if (saved && translations[saved]) return saved;
    
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) return browserLang;
    
    return 'en'; // Default to English
  });

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('giftchain-language', lang);
      
      // Update document language
      document.documentElement.lang = lang;
      
      // Update page title based on language
      const titles = {
        en: 'GiftChain - Crypto Gifting Platform',
        es: 'GiftChain - Plataforma de Regalos Crypto',
        fr: 'GiftChain - Plateforme de Cadeaux Crypto',
        de: 'GiftChain - Krypto-Geschenk-Plattform',
        ja: 'GiftChain - 暗号通貨ギフトプラットフォーム',
        zh: 'GiftChain - 加密货币礼品平台'
      };
      document.title = titles[lang as keyof typeof titles] || titles.en;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language] || translations.en,
    supportedLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};