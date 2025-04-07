import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '@/data/translations';

type Language = 'en' | 'de' | 'it' | 'es' | 'fr' | 'sv';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getElementTranslation: (elementName: string, property: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (language === 'en') return key;
    return translations[language]?.ui[key] || key;
  };

  const getElementTranslation = (elementName: string, property: string): string => {
    if (language === 'en') return elementName;
    return translations[language]?.elements[elementName]?.[property] || elementName;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getElementTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 