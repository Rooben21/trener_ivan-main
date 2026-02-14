import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Instagram } from 'lucide-react';
import { trainerData, galleryImages } from '../data/mock';

const HeroSection = () => {
  const { t, language } = useLanguage();

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!language) return null;

  return (
    <section 
      id="hero" 
      className="min-h-screen bg-[#FAFFEE] pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EDEDFE]/30 rounded-bl-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D3FF62]/20 rounded-full blur-3xl -z-10" />
      
      <div className="container max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#EDEDFE] rounded-full mb-6"
              style={{ animation: 'fadeInUp 0.6s ease-out' }}
            >
              <MapPin size={18} className="text-[#0C6951]" />
              <span className="text-[#0C6951] font-medium">{t.hero.location}</span>
            </div>
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#004534] mb-4 leading-tight"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
            >
              {t.hero.title}
            </h1>
            
            <p 
              className="text-xl md:text-2xl text-[#0C6951] mb-8 font-medium"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
            >
              {t.hero.subtitle}
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-4"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
            >
              <button
                onClick={scrollToContact}
                className="px-8 py-4 rounded-[25px] bg-[#004534] text-white font-semibold text-lg
                          hover:bg-[#0C6951] transform hover:-translate-y-1 transition-all duration-200
                          shadow-lg hover:shadow-xl"
              >
                {t.hero.cta}
              </button>
              
              <a
                href={trainerData.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-[25px] border-2 border-[#004534] text-[#004534] font-semibold text-lg
                          hover:bg-[#004534] hover:text-white transform hover:-translate-y-1 transition-all duration-200
                          flex items-center justify-center gap-3"
              >
                <Instagram size={22} />
                {trainerData.instagram}
              </a>
            </div>
          </div>
          
          {/* Image */}
          <div 
            className="order-1 md:order-2 flex justify-center"
            style={{ animation: 'fadeInRight 0.8s ease-out 0.2s both' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#D3FF62] rounded-[32px] transform rotate-3 scale-105" />
              <img
                src={galleryImages[0].src}
                alt={t.hero.title}
                className="relative w-full max-w-md md:max-w-lg rounded-[32px] shadow-2xl object-cover aspect-[4/5]"
              />
              {/* Floating badge */}
              <div 
                className="absolute -bottom-4 -left-4 md:-left-8 bg-white rounded-[20px] p-4 shadow-xl"
                style={{ animation: 'bounce 2s infinite' }}
              >
                <div className="text-[#004534] font-bold text-2xl">{trainerData.stats.experience}</div>
                <div className="text-[#0C6951] text-sm font-medium">{t.about.experience}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;