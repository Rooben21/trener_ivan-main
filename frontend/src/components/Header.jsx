import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Phone } from 'lucide-react';
import { trainerData } from '../data/mock';

const Header = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  if (!language) return null;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 px-3 md:px-4
                  ${isScrolled ? 'py-2' : 'py-4 md:py-6'}`}
    >
      <nav 
        className={`max-w-[1440px] mx-auto rounded-[25px] px-4 md:px-6 py-3 flex items-center justify-between
                   transition-all duration-300
                   ${isScrolled 
                     ? 'bg-[#004534]/95 backdrop-blur-md shadow-lg' 
                     : 'bg-[#004534] shadow-md'}`}
      >
        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
          className="text-white font-semibold text-lg md:text-xl hover:opacity-90 transition-opacity"
        >
          Ivan Volosyanko
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('about')}
            className="text-white font-medium hover:text-[#D3FF62] transition-colors px-3 py-2"
          >
            {t.nav.about}
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="text-white font-medium hover:text-[#D3FF62] transition-colors px-3 py-2"
          >
            {t.nav.services}
          </button>
          <button 
            onClick={() => scrollToSection('gallery')}
            className="text-white font-medium hover:text-[#D3FF62] transition-colors px-3 py-2"
          >
            {t.nav.gallery}
          </button>
          <button 
            onClick={() => scrollToSection('reviews')}
            className="text-white font-medium hover:text-[#D3FF62] transition-colors px-3 py-2"
          >
            {t.nav.reviews}
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-white font-medium hover:text-[#D3FF62] transition-colors px-3 py-2"
          >
            {t.nav.contact}
          </button>
          
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="ml-2 px-4 py-2 rounded-[20px] bg-white/10 text-white font-medium
                      hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <span>{language === 'ua' ? '🇺🇦' : '🇵🇱'}</span>
            <span className="text-sm">{language === 'ua' ? 'UA' : 'PL'}</span>
          </button>

          {/* Phone CTA */}
          <a 
            href={trainerData.phoneLink}
            className="ml-2 px-5 py-2.5 rounded-[25px] bg-[#D3FF62] text-[#004534] font-semibold
                      hover:bg-[#c4f050] transition-all transform hover:-translate-y-0.5
                      flex items-center gap-2 shadow-md"
          >
            <Phone size={18} />
            <span className="hidden lg:inline">{trainerData.phone}</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-3 py-2 rounded-[20px] bg-white/10 text-white font-medium text-sm"
          >
            {language === 'ua' ? '🇺🇦 UA' : '🇵🇱 PL'}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden mt-2 mx-3 bg-[#004534] rounded-[20px] p-4 shadow-xl"
          style={{ animation: 'fadeInDown 0.3s ease-out' }}
        >
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white font-medium py-3 px-4 rounded-[15px] hover:bg-white/10 transition-colors text-left"
            >
              {t.nav.about}
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-white font-medium py-3 px-4 rounded-[15px] hover:bg-white/10 transition-colors text-left"
            >
              {t.nav.services}
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-white font-medium py-3 px-4 rounded-[15px] hover:bg-white/10 transition-colors text-left"
            >
              {t.nav.gallery}
            </button>
            <button 
              onClick={() => scrollToSection('reviews')}
              className="text-white font-medium py-3 px-4 rounded-[15px] hover:bg-white/10 transition-colors text-left"
            >
              {t.nav.reviews}
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-white font-medium py-3 px-4 rounded-[15px] hover:bg-white/10 transition-colors text-left"
            >
              {t.nav.contact}
            </button>
            <a 
              href={trainerData.phoneLink}
              className="mt-2 py-3 px-4 rounded-[25px] bg-[#D3FF62] text-[#004534] font-semibold
                        text-center flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              {trainerData.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;