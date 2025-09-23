import React, { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, supportedLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = supportedLanguages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-sm font-medium">{currentLang?.name}</span>
        <span className="text-xs text-gray-500">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-40">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-blue-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};