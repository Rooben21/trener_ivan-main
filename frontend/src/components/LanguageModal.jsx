import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageModal = () => {
  const { showModal, selectLanguage } = useLanguage();

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-white rounded-[32px] p-8 md:p-12 mx-4 max-w-md w-full shadow-2xl"
        style={{ animation: 'fadeInUp 0.4s ease-out' }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#004534] mb-2">
            Виберіть мову
          </h2>
          <p className="text-lg text-[#0C6951]">
            Wybierz język
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => selectLanguage('ua')}
            className="w-full py-4 px-6 rounded-[25px] bg-[#004534] text-white font-semibold text-lg
                       hover:bg-[#0C6951] transform hover:-translate-y-1 transition-all duration-200
                       shadow-md hover:shadow-lg flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🇺🇦</span>
            <span>Українська</span>
          </button>
          
          <button
            onClick={() => selectLanguage('pl')}
            className="w-full py-4 px-6 rounded-[25px] bg-transparent border-2 border-[#004534] 
                       text-[#004534] font-semibold text-lg hover:bg-[#004534] hover:text-white
                       transform hover:-translate-y-1 transition-all duration-200
                       flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🇵🇱</span>
            <span>Polski</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;