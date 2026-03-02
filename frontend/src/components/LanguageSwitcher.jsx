import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FLAG_EN = '🇬🇧'
const FLAG_KK = '🇰🇿'

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();
  const isEN = language === 'en'

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200
                 bg-white hover:bg-gray-50 hover:border-gray-300
                 shadow-sm transition-all duration-150 text-sm font-semibold text-gray-700
                 hover:-translate-y-0.5 hover:shadow active:translate-y-0"
      title={isEN ? 'Switch to Kazakh' : 'Ағылшын тіліне ауысу'}
    >
      <span className="text-base leading-none">{isEN ? FLAG_EN : FLAG_KK}</span>
      <span className="text-xs">{isEN ? 'ENG' : 'ҚАЗ'}</span>
    </button>
  );
};

export default LanguageSwitcher;
