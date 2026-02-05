import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  isRTL: boolean;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isRTL, setIsRTL] = useState(() => {
    // Try to get saved language preference from localStorage
    const saved = localStorage.getItem('language');
    return saved ? saved === 'ar' : true; // Default to Arabic
  });

  useEffect(() => {
    // Save language preference
    localStorage.setItem('language', isRTL ? 'ar' : 'en');
    
    // Update document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = isRTL ? 'ar' : 'en';
  }, [isRTL]);

  const toggleLanguage = () => {
    setIsRTL(!isRTL);
  };

  return (
    <LanguageContext.Provider value={{ isRTL, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
