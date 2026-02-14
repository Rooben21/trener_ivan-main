import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/mock';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Default to Polish if no language saved
      setLanguage('pl');
      localStorage.setItem('preferredLanguage', 'pl');
    }
  }, []);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    setShowModal(false);
  };

  const toggleLanguage = () => {
    const newLang = language === 'ua' ? 'pl' : 'ua';
    selectLanguage(newLang);
  };

  const t = translations[language] || translations.ua;

  return (
    <LanguageContext.Provider value={{ language, t, selectLanguage, toggleLanguage, showModal }}>
      {children}
    </LanguageContext.Provider>
  );
};