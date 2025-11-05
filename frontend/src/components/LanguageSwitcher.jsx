import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      title={language === 'en' ? 'Switch to Kazakh' : 'Қазақ тіліне ауысу'}
    >
      <Languages className="h-5 w-5 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        {language === 'en' ? 'QAZ' : 'ENG'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
