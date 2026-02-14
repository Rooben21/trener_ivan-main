import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { trainerData } from '../data/mock';
import { Phone, Instagram, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const { t, language } = useLanguage();

  if (!language) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#004534] text-white py-12 md:py-16 pb-24 md:pb-28">
      <div className="container max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Ivan Volosyanko</h3>
            <p className="text-white/70 leading-relaxed">
              {language === 'ua' 
                ? 'Персональний тренер у Лодзі. Допоможу досягти твоїх цілей!'
                : 'Trener personalny w Łodzi. Pomogę osiągnąć twoje cele!'
              }
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ua' ? 'Контакти' : 'Kontakt'}
            </h4>
            <div className="space-y-3">
              <a 
                href={trainerData.phoneLink}
                className="flex items-center gap-3 text-white/70 hover:text-[#D3FF62] transition-colors"
              >
                <Phone size={18} />
                {trainerData.phone}
              </a>
              <a 
                href={trainerData.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-[#D3FF62] transition-colors"
              >
                <Instagram size={18} />
                {trainerData.instagram}
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin size={18} />
                {trainerData.location}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ua' ? 'Навігація' : 'Nawigacja'}
            </h4>
            <div className="space-y-2">
              {Object.entries(t.nav).map(([key, value]) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className="block text-white/70 hover:text-[#D3FF62] transition-colors"
                >
                  {value}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {currentYear} Ivan Volosyanko. {t.footer.rights}
          </p>
          <p className="text-white/60 text-sm flex items-center gap-2">
            Made with <Heart size={14} className="text-[#D3FF62] fill-[#D3FF62]" /> in {t.footer.location}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;