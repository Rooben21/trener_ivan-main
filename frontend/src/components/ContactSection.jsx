import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { trainerData } from '../data/mock';
import { Phone, Instagram, Send, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ContactSection = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  if (!language) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    
    try {
      await axios.post(`${BACKEND_URL}/api/contact`, formData);
      setIsSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
      
      // Track Google Ads conversion
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-17957308226/contact_form_submit',
          'event_category': 'form',
          'event_label': 'contact_form'
        });
      }
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsError(true);
      setTimeout(() => setIsError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#FAFFEE]">
      <div className="container max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004534] mb-4">
              {t.contact.title}
            </h2>
            <p className="text-lg text-[#0C6951] mb-10">
              {t.contact.subtitle}
            </p>

            <div className="space-y-6">
              <a
                href={trainerData.phoneLink}
                className="flex items-center gap-4 p-4 bg-[#FAFAFF] rounded-[20px] shadow-md
                          hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#D3FF62] flex items-center justify-center
                              group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-[#004534]" />
                </div>
                <div>
                  <div className="text-sm text-[#807979] mb-1">{t.contact.form.phone}</div>
                  <div className="text-lg font-semibold text-[#004534]">{trainerData.phone}</div>
                </div>
              </a>

              <a
                href={trainerData.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#FAFAFF] rounded-[20px] shadow-md
                          hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#EDEDFE] flex items-center justify-center
                              group-hover:scale-110 transition-transform">
                  <Instagram className="w-6 h-6 text-[#004534]" />
                </div>
                <div>
                  <div className="text-sm text-[#807979] mb-1">Instagram</div>
                  <div className="text-lg font-semibold text-[#004534]">{trainerData.instagram}</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-[#FAFAFF] rounded-[20px] shadow-md">
                <div className="w-14 h-14 rounded-full bg-[#CACAFC] flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#004534]" />
                </div>
                <div>
                  <div className="text-sm text-[#807979] mb-1">{language === 'ua' ? 'Місцезнаходження' : 'Lokalizacja'}</div>
                  <div className="text-lg font-semibold text-[#004534]">{trainerData.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#FAFAFF] rounded-[32px] p-6 md:p-8 shadow-xl">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-[#D3FF62] flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-[#004534]" />
                </div>
                <p className="text-xl font-semibold text-[#004534]">
                  {t.contact.form.success}
                </p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-xl font-semibold text-red-500">
                  {t.contact.form.error}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#004534] mb-2">
                    {t.contact.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-[20px] border-2 border-[#DDDDDD] bg-white
                              text-[#004534] placeholder-[#807979]
                              focus:border-[#0C6951] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#004534] mb-2">
                    {t.contact.form.phone}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-[20px] border-2 border-[#DDDDDD] bg-white
                              text-[#004534] placeholder-[#807979]
                              focus:border-[#0C6951] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#004534] mb-2">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t.contact.form.messagePlaceholder}
                    className="w-full px-5 py-4 rounded-[20px] border-2 border-[#DDDDDD] bg-white
                              text-[#004534] placeholder-[#807979] resize-none
                              focus:border-[#0C6951] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-[25px] bg-[#004534] text-white font-semibold text-lg
                            hover:bg-[#0C6951] transform hover:-translate-y-1 transition-all duration-200
                            shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
                            disabled:transform-none flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={20} />
                      {t.contact.form.submit}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;