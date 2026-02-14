import React from 'react';
import { trainerData } from '../data/mock';
import { Instagram, Facebook, Send, MapPin } from 'lucide-react';

const FixedSocialBar = () => {
  const socialLinks = [
    {
      icon: Instagram,
      href: trainerData.instagramLink,
      label: 'Instagram',
      color: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]'
    },
    {
      icon: Facebook,
      href: trainerData.facebookLink,
      label: 'Facebook',
      color: 'hover:bg-[#1877f2]'
    },
    {
      icon: Send,
      href: trainerData.telegramLink,
      label: 'Telegram',
      color: 'hover:bg-[#0088cc]'
    },
    {
      icon: MapPin,
      href: trainerData.googleMapsLink,
      label: 'Google Maps',
      color: 'hover:bg-[#ea4335]'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-[#004534] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <div className="container max-w-[1440px] mx-auto px-2">
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-3">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full 
                         bg-white/10 text-white transition-all duration-300 
                         hover:text-white hover:scale-110 ${link.color}
                         shadow-md hover:shadow-lg`}
            >
              <link.icon size={22} className="sm:w-6 sm:h-6" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FixedSocialBar;