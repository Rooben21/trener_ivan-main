import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TrendingDown, TrendingUp, RefreshCw, User, Calculator, Calendar, ArrowRight, Sparkles, X, Mail, Phone } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Body transformation images
const bodyImages = {
  male: {
    before: '/images/calculator/fat_man.png',
    after: '/images/calculator/sport_man.png'
  },
  female: {
    before: '/images/calculator/fat_woman.png',
    after: '/images/calculator/sport_woman.png'
  }
};

const CalculatorSection = () => {
  const { t, language } = useLanguage();
  
  const [formData, setFormData] = useState({
    goal: 'weightLoss',
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    activity: 'moderate',
    duration: 3
  });
  
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!language) return null;

  const goals = [
    { id: 'weightLoss', icon: TrendingDown, color: 'bg-blue-500' },
    { id: 'muscleGain', icon: TrendingUp, color: 'bg-orange-500' },
    { id: 'complex', icon: RefreshCw, color: 'bg-purple-500' }
  ];

  const durations = [
    { months: 1, key: 'month1' },
    { months: 3, key: 'month3' },
    { months: 6, key: 'month6' }
  ];

  const validateForm = () => {
    const newErrors = {};
    const age = parseInt(formData.age);
    const height = parseInt(formData.height);
    const weight = parseFloat(formData.weight);

    if (!formData.age || age < 16 || age > 70) {
      newErrors.age = t.calculator.validation.ageRange;
    }
    if (!formData.height || height < 140 || height > 220) {
      newErrors.height = t.calculator.validation.heightRange;
    }
    if (!formData.weight || weight < 40 || weight > 200) {
      newErrors.weight = t.calculator.validation.weightRange;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Age factor for metabolism and results
  const getAgeFactor = (age) => {
    if (age <= 25) return { weightLoss: 1.10, muscleGain: 1.20 };
    if (age <= 35) return { weightLoss: 1.00, muscleGain: 1.00 };
    if (age <= 45) return { weightLoss: 0.90, muscleGain: 0.85 };
    if (age <= 55) return { weightLoss: 0.80, muscleGain: 0.75 };
    return { weightLoss: 0.70, muscleGain: 0.65 };
  };

  // Activity level rates (kg per week)
  const getActivityRates = (activity) => {
    switch (activity) {
      case 'beginner':
        return { weightLoss: 0.30, muscleGain: 0.15, newbieBonus: 1.5 };
      case 'moderate':
        return { weightLoss: 0.45, muscleGain: 0.22, newbieBonus: 1.2 };
      case 'advanced':
        return { weightLoss: 0.55, muscleGain: 0.28, newbieBonus: 1.0 };
      default:
        return { weightLoss: 0.45, muscleGain: 0.22, newbieBonus: 1.2 };
    }
  };

  const calculateResults = () => {
    if (!validateForm()) return;

    setIsCalculating(true);

    setTimeout(() => {
      const age = parseInt(formData.age);
      const height = parseInt(formData.height);
      const weight = parseFloat(formData.weight);
      const isMale = formData.gender === 'male';
      const weeks = formData.duration * 4;

      // BMR calculation (Mifflin-St Jeor)
      let bmr;
      if (isMale) {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }

      // Activity multipliers for TDEE
      const activityMultipliers = {
        beginner: 1.2,
        moderate: 1.375,
        advanced: 1.55
      };
      const tdee = bmr * activityMultipliers[formData.activity];

      // Get age and activity factors
      const ageFactor = getAgeFactor(age);
      const activityRates = getActivityRates(formData.activity);

      // BMI for body fat estimation
      const bmi = weight / (height / 100) ** 2;

      // Estimate current body fat percentage based on age, gender, and BMI
      let currentFatPercent;
      const ageAdjustment = Math.max(0, (age - 25) * 0.15); // +0.15% per year after 25
      if (isMale) {
        // Men: base ~15% at healthy BMI, increases with BMI and age
        currentFatPercent = Math.max(8, Math.min(40, 10 + (bmi - 22) * 1.2 + ageAdjustment));
      } else {
        // Women: base ~23% at healthy BMI, increases with BMI and age
        currentFatPercent = Math.max(15, Math.min(45, 18 + (bmi - 22) * 1.2 + ageAdjustment));
      }

      // Current muscle mass estimation (based on lean mass)
      const fatMass = weight * (currentFatPercent / 100);
      const leanMass = weight - fatMass;
      const currentMuscleMass = leanMass * (isMale ? 0.48 : 0.42); // Men have more muscle

      let targetWeight, targetFatPercent, targetMuscleMass, summaryText;

      if (formData.goal === 'weightLoss') {
        // Weight loss with age and activity factors
        const baseWeeklyLoss = activityRates.weightLoss * ageFactor.weightLoss;
        // Max 1% of body weight per week for safety
        const maxWeeklyLoss = weight * 0.01;
        const effectiveWeeklyLoss = Math.min(baseWeeklyLoss, maxWeeklyLoss);
        const totalWeightLoss = Math.min(effectiveWeeklyLoss * weeks, weight * 0.15);
        
        targetWeight = weight - totalWeightLoss;
        // Fat loss is ~85% of weight loss with proper training
        const fatLoss = totalWeightLoss * 0.85;
        targetFatPercent = currentFatPercent - (fatLoss / weight * 100);
        // Preserve muscle with training (lose only ~5% of weight loss as muscle)
        targetMuscleMass = currentMuscleMass - (totalWeightLoss * 0.05);
        
        if (language === 'ua') {
          const activityText = formData.activity === 'beginner' ? 'При збільшенні активності результат буде кращим!' : '';
          summaryText = `За ${formData.duration} ${formData.duration === 1 ? 'місяць' : 'місяці(-ів)'} під моїм наставництвом ви можете скинути ~${totalWeightLoss.toFixed(1)} кг жиру та зберегти м'язову масу. ${activityText}`;
        } else {
          const activityText = formData.activity === 'beginner' ? 'Przy większej aktywności wynik będzie lepszy!' : '';
          summaryText = `W ciągu ${formData.duration} ${formData.duration === 1 ? 'miesiąca' : 'miesięcy'} pod moim kierownictwem możesz schudnąć ~${totalWeightLoss.toFixed(1)} kg tłuszczu i zachować masę mięśniową. ${activityText}`;
        }
      } else if (formData.goal === 'muscleGain') {
        // Muscle gain with age, activity, and newbie bonus factors
        const baseWeeklyGain = activityRates.muscleGain * ageFactor.muscleGain;
        // Newbie gains bonus for beginners
        const effectiveWeeklyGain = baseWeeklyGain * activityRates.newbieBonus;
        // Max realistic muscle gain: ~0.5 kg/month for experienced, ~1 kg for beginners
        const maxMonthlyGain = formData.activity === 'beginner' ? 1.0 : 0.5;
        const totalMuscleGain = Math.min(effectiveWeeklyGain * weeks, maxMonthlyGain * formData.duration);
        
        // Some fat gain is inevitable (~20-30% of total weight gain)
        const fatGain = totalMuscleGain * 0.25;
        const totalWeightGain = totalMuscleGain + fatGain;
        
        targetWeight = weight + totalWeightGain;
        targetMuscleMass = currentMuscleMass + totalMuscleGain;
        // Fat percent decreases due to more muscle mass despite some fat gain
        targetFatPercent = ((fatMass + fatGain) / targetWeight) * 100;
        
        if (language === 'ua') {
          const ageText = age > 40 ? 'Для вашого віку це відмінний результат!' : '';
          const beginnerText = formData.activity === 'beginner' ? 'Початківці набирають м\'язи швидше завдяки "newbie gains"!' : '';
          summaryText = `За ${formData.duration} ${formData.duration === 1 ? 'місяць' : 'місяці(-ів)'} ви можете набрати ~${totalMuscleGain.toFixed(1)} кг м'язової маси. ${beginnerText} ${ageText}`;
        } else {
          const ageText = age > 40 ? 'Dla twojego wieku to świetny wynik!' : '';
          const beginnerText = formData.activity === 'beginner' ? 'Początkujący budują mięśnie szybciej dzięki "newbie gains"!' : '';
          summaryText = `W ciągu ${formData.duration} ${formData.duration === 1 ? 'miesiąca' : 'miesięcy'} możesz zbudować ~${totalMuscleGain.toFixed(1)} kg masy mięśniowej. ${beginnerText} ${ageText}`;
        }
      } else {
        // Complex: body recomposition (lose fat + gain muscle)
        const weightLossRate = activityRates.weightLoss * ageFactor.weightLoss * 0.6;
        const muscleGainRate = activityRates.muscleGain * ageFactor.muscleGain * 0.5 * activityRates.newbieBonus;
        
        const totalFatLoss = Math.min(weightLossRate * weeks, weight * 0.08);
        const totalMuscleGain = Math.min(muscleGainRate * weeks, 0.4 * formData.duration);
        
        targetWeight = weight - totalFatLoss + totalMuscleGain;
        targetMuscleMass = currentMuscleMass + totalMuscleGain;
        targetFatPercent = ((fatMass - totalFatLoss) / targetWeight) * 100;
        
        if (language === 'ua') {
          summaryText = `За ${formData.duration} ${formData.duration === 1 ? 'місяць' : 'місяці(-ів)'} ви можете скинути ~${totalFatLoss.toFixed(1)} кг жиру та набрати ~${totalMuscleGain.toFixed(1)} кг м'язової маси. Ідеальна рекомпозиція тіла!`;
        } else {
          summaryText = `W ciągu ${formData.duration} ${formData.duration === 1 ? 'miesiąca' : 'miesięcy'} możesz schudnąć ~${totalFatLoss.toFixed(1)} kg tłuszczu i zbudować ~${totalMuscleGain.toFixed(1)} kg masy mięśniowej. Idealna rekompozycja ciała!`;
        }
      }

      // Ensure realistic minimums for fat percentage
      const minFatPercent = isMale ? 6 : 14;

      setResults({
        current: {
          weight: weight,
          fatPercent: Math.round(currentFatPercent * 10) / 10,
          muscleMass: Math.round(currentMuscleMass * 10) / 10
        },
        forecast: {
          weight: Math.round(targetWeight * 10) / 10,
          fatPercent: Math.round(Math.max(minFatPercent, targetFatPercent) * 10) / 10,
          muscleMass: Math.round(Math.max(currentMuscleMass * 0.9, targetMuscleMass) * 10) / 10
        },
        summaryText,
        tdee: Math.round(tdee)
      });

      setIsCalculating(false);
    }, 800);
  };

  // Contact form state for calculator CTA
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [contactErrors, setContactErrors] = useState({});

  // Validate phone - only digits, spaces, +, -, ()
  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/[\s\-\+\(\)]/g, '');
    return /^\d{9,15}$/.test(digitsOnly);
  };

  // Validate email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
    if (contactErrors[name]) {
      setContactErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCtaClick = () => {
    setShowContactModal(true);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fields
    const newErrors = {};
    if (!contactFormData.name.trim()) {
      newErrors.name = language === 'ua' ? "Введіть ім'я" : 'Wprowadź imię';
    }
    if (!validatePhone(contactFormData.phone)) {
      newErrors.phone = language === 'ua' ? 'Введіть коректний номер телефону' : 'Wprowadź poprawny numer telefonu';
    }
    if (!validateEmail(contactFormData.email)) {
      newErrors.email = language === 'ua' ? 'Введіть коректний email' : 'Wprowadź poprawny email';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setContactErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    const goalLabels = {
      weightLoss: language === 'ua' ? 'Схуднення' : 'Odchudzanie',
      muscleGain: language === 'ua' ? 'Набір маси' : 'Budowanie masy',
      complex: language === 'ua' ? 'Комплекс' : 'Kompleks'
    };

    const message = language === 'ua' 
      ? `📧 Email: ${contactFormData.email}\n🎯 Ціль: ${goalLabels[formData.goal]}\n📊 Поточна вага: ${formData.weight} кг\n🎯 Цільова вага: ${results.forecast.weight} кг\n⏱ Термін: ${formData.duration} міс.\n\n${results.summaryText}`
      : `📧 Email: ${contactFormData.email}\n🎯 Cel: ${goalLabels[formData.goal]}\n📊 Aktualna waga: ${formData.weight} kg\n🎯 Docelowa waga: ${results.forecast.weight} kg\n⏱ Okres: ${formData.duration} mies.\n\n${results.summaryText}`;

    try {
      await axios.post(`${BACKEND_URL}/api/contact`, {
        name: contactFormData.name,
        phone: contactFormData.phone,
        message: message
      });
      setSubmitSuccess(true);
      setShowContactModal(false);
      setContactFormData({ name: '', phone: '', email: '' });
      
      // Track Google Ads conversion
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-17957308226/calculator_form_submit',
          'event_category': 'form',
          'event_label': 'calculator_cta'
        });
      }
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    setResults(null);
    setSubmitSuccess(false);
  };

  // Body Image component
  const BodyImage = ({ type }) => {
    const gender = formData.gender;
    const imageSrc = bodyImages[gender][type];
    
    return (
      <div className="relative mx-auto w-32 h-48 md:w-40 md:h-60 flex items-center justify-center">
        <img 
          src={imageSrc} 
          alt={type === 'before' ? 'Before transformation' : 'After transformation'}
          className={`max-w-full max-h-full object-contain transition-all duration-500
            ${type === 'after' ? 'drop-shadow-[0_0_15px_rgba(211,255,98,0.5)]' : ''}`}
        />
      </div>
    );
  };

  return (
    <section id="calculator" className="py-16 md:py-24 bg-gradient-to-b from-[#FAFFEE] to-[#EDEDFE]">
      <div className="container max-w-[1440px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D3FF62] rounded-full mb-4">
            <Calculator size={20} className="text-[#004534]" />
            <span className="text-[#004534] font-semibold text-sm">
              {language === 'ua' ? 'Калькулятор трансформації' : 'Kalkulator transformacji'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004534] mb-4">
            {t.calculator.title}
          </h2>
          <p className="text-lg text-[#0C6951] max-w-2xl mx-auto">
            {t.calculator.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-xl">
            {/* Step 1: Goal Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#004534] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#004534] text-white flex items-center justify-center text-sm">1</span>
                {t.calculator.step1}
              </h3>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {goals.map(({ id, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => handleInputChange('goal', id)}
                    className={`p-3 md:p-6 rounded-[16px] md:rounded-[20px] border-2 transition-all duration-300 
                      ${formData.goal === id 
                        ? 'border-[#004534] bg-[#004534] text-white shadow-lg scale-[1.02]' 
                        : 'border-[#DDDDDD] bg-white text-[#004534] hover:border-[#0C6951]'}`}
                  >
                    <Icon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 ${formData.goal === id ? 'text-[#D3FF62]' : 'text-[#0C6951]'}`} />
                    <span className="block text-xs md:text-base font-medium leading-tight">
                      {t.calculator.goals[id]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Personal Data */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#004534] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#004534] text-white flex items-center justify-center text-sm">2</span>
                {t.calculator.step2}
              </h3>
              
              {/* Gender */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#004534] mb-2">
                  {t.calculator.gender.label}
                </label>
                <div className="flex gap-3">
                  {['male', 'female'].map((g) => (
                    <button
                      key={g}
                      onClick={() => handleInputChange('gender', g)}
                      className={`flex-1 py-3 px-4 rounded-[15px] border-2 font-medium transition-all
                        ${formData.gender === g 
                          ? 'border-[#004534] bg-[#004534] text-white' 
                          : 'border-[#DDDDDD] text-[#004534] hover:border-[#0C6951]'}`}
                    >
                      <User className={`w-5 h-5 mx-auto mb-1 ${formData.gender === g ? 'text-[#D3FF62]' : ''}`} />
                      {t.calculator.gender[g]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numeric inputs grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-[#004534] mb-2">
                    {t.calculator.age}
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="25"
                    min="16"
                    max="70"
                    className={`w-full px-4 py-3 rounded-[15px] border-2 bg-white text-[#004534]
                      focus:outline-none transition-colors
                      ${errors.age ? 'border-red-400' : 'border-[#DDDDDD] focus:border-[#0C6951]'}`}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-[#004534] mb-2">
                    {t.calculator.height}
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="175"
                    min="140"
                    max="220"
                    className={`w-full px-4 py-3 rounded-[15px] border-2 bg-white text-[#004534]
                      focus:outline-none transition-colors
                      ${errors.height ? 'border-red-400' : 'border-[#DDDDDD] focus:border-[#0C6951]'}`}
                  />
                  {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-[#004534] mb-2">
                    {t.calculator.weight}
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="80"
                    min="40"
                    max="200"
                    step="0.1"
                    className={`w-full px-4 py-3 rounded-[15px] border-2 bg-white text-[#004534]
                      focus:outline-none transition-colors
                      ${errors.weight ? 'border-red-400' : 'border-[#DDDDDD] focus:border-[#0C6951]'}`}
                  />
                  {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-[#004534] mb-2">
                  {t.calculator.activity.label}
                </label>
                <select
                  value={formData.activity}
                  onChange={(e) => handleInputChange('activity', e.target.value)}
                  className="w-full px-4 py-3 rounded-[15px] border-2 border-[#DDDDDD] bg-white text-[#004534]
                    focus:border-[#0C6951] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="beginner">{t.calculator.activity.beginner}</option>
                  <option value="moderate">{t.calculator.activity.moderate}</option>
                  <option value="advanced">{t.calculator.activity.advanced}</option>
                </select>
              </div>
            </div>

            {/* Step 3: Duration */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#004534] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#004534] text-white flex items-center justify-center text-sm">3</span>
                {t.calculator.step3}
              </h3>
              <div className="flex gap-3">
                {durations.map(({ months, key }) => (
                  <button
                    key={months}
                    onClick={() => handleInputChange('duration', months)}
                    className={`flex-1 py-4 px-4 rounded-[20px] border-2 font-medium transition-all
                      ${formData.duration === months 
                        ? 'border-[#004534] bg-[#004534] text-white shadow-md' 
                        : 'border-[#DDDDDD] text-[#004534] hover:border-[#0C6951]'}`}
                  >
                    <Calendar className={`w-5 h-5 mx-auto mb-1 ${formData.duration === months ? 'text-[#D3FF62]' : ''}`} />
                    {t.calculator.duration[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateResults}
              disabled={isCalculating}
              className="w-full py-4 px-6 rounded-[25px] bg-[#004534] text-white font-semibold text-lg
                hover:bg-[#0C6951] transform hover:-translate-y-1 transition-all duration-200
                shadow-lg hover:shadow-xl disabled:opacity-70 disabled:transform-none
                flex items-center justify-center gap-3"
            >
              {isCalculating ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={22} />
                  {t.calculator.calculate}
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div 
              className="mt-8 bg-white rounded-[32px] p-6 md:p-10 shadow-xl"
              style={{ animation: 'fadeInUp 0.5s ease-out' }}
            >
              {/* Visualization */}
              <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
                {/* Before */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-[#807979] mb-4">{t.calculator.results.now}</h4>
                  <BodyImage type="before" />
                  <div className="mt-4 space-y-2">
                    <div className="bg-[#EDEDFE] rounded-[12px] p-3">
                      <span className="text-sm text-[#807979]">{t.calculator.results.weight}</span>
                      <div className="text-xl font-bold text-[#004534]">{results.current.weight} kg</div>
                    </div>
                    <div className="bg-[#EDEDFE] rounded-[12px] p-3">
                      <span className="text-sm text-[#807979]">{t.calculator.results.fatPercent}</span>
                      <div className="text-xl font-bold text-[#004534]">{results.current.fatPercent}%</div>
                    </div>
                    <div className="bg-[#EDEDFE] rounded-[12px] p-3">
                      <span className="text-sm text-[#807979]">{t.calculator.results.muscleMass}</span>
                      <div className="text-xl font-bold text-[#004534]">{results.current.muscleMass} kg</div>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-[#004534] mb-4">
                    {t.calculator.results.after} {formData.duration} {language === 'ua' ? 'міс.' : 'mies.'}
                  </h4>
                  <BodyImage type="after" />
                  <div className="mt-4 space-y-2">
                    <div className="bg-[#D3FF62]/30 rounded-[12px] p-3 border-2 border-[#D3FF62]">
                      <span className="text-sm text-[#0C6951]">{t.calculator.results.weight}</span>
                      <div className="text-xl font-bold text-[#004534]">
                        {results.forecast.weight} kg
                        <span className={`ml-2 text-sm ${results.forecast.weight < results.current.weight ? 'text-green-600' : 'text-orange-500'}`}>
                          ({results.forecast.weight < results.current.weight ? '' : '+'}{(results.forecast.weight - results.current.weight).toFixed(1)})
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#D3FF62]/30 rounded-[12px] p-3 border-2 border-[#D3FF62]">
                      <span className="text-sm text-[#0C6951]">{t.calculator.results.fatPercent}</span>
                      <div className="text-xl font-bold text-[#004534]">
                        {results.forecast.fatPercent}%
                        <span className="ml-2 text-sm text-green-600">
                          ({(results.forecast.fatPercent - results.current.fatPercent).toFixed(1)})
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#D3FF62]/30 rounded-[12px] p-3 border-2 border-[#D3FF62]">
                      <span className="text-sm text-[#0C6951]">{t.calculator.results.muscleMass}</span>
                      <div className="text-xl font-bold text-[#004534]">
                        {results.forecast.muscleMass} kg
                        <span className={`ml-2 text-sm ${results.forecast.muscleMass > results.current.muscleMass ? 'text-green-600' : 'text-orange-500'}`}>
                          (+{(results.forecast.muscleMass - results.current.muscleMass).toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Text */}
              <div className="bg-[#FAFFEE] rounded-[20px] p-6 mb-6 border-l-4 border-[#D3FF62]">
                <p className="text-[#004534] text-lg leading-relaxed">
                  {results.summaryText}
                </p>
              </div>

              {/* CTA Button */}
              {submitSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-[#D3FF62] flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-[#004534]" />
                  </div>
                  <p className="text-xl font-semibold text-[#004534]">
                    {language === 'ua' ? 'Заявку надіслано!' : 'Zgłoszenie wysłane!'}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleCtaClick}
                  disabled={isSubmitting}
                  className="w-full py-5 px-6 rounded-[25px] bg-[#D3FF62] text-[#004534] font-bold text-lg
                    hover:bg-[#c4f050] transform hover:-translate-y-1 transition-all duration-200
                    shadow-lg hover:shadow-xl disabled:opacity-70 disabled:transform-none
                    flex flex-col items-center justify-center gap-1"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-[#004534] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="flex items-center gap-2">
                        {t.calculator.results.cta}
                        <ArrowRight size={22} />
                      </span>
                      <span className="text-sm font-medium opacity-80">
                        {t.calculator.results.ctaSubtitle}
                      </span>
                    </>
                  )}
                </button>
              )}

              {/* Disclaimer */}
              <p className="mt-6 text-center text-sm text-[#807979] italic">
                {t.calculator.disclaimer}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowContactModal(false)}
        >
          <div 
            className="bg-white rounded-[32px] p-6 md:p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'fadeInUp 0.3s ease-out' }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-[#807979]" />
            </button>

            <h3 className="text-2xl font-bold text-[#004534] mb-2">
              {language === 'ua' ? 'Залиште свої дані' : 'Zostaw swoje dane'}
            </h3>
            <p className="text-[#0C6951] mb-6">
              {language === 'ua' 
                ? "Я зв'яжусь з вами для безкоштовної консультації" 
                : 'Skontaktuję się z tobą w celu bezpłatnej konsultacji'}
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#004534] mb-2">
                  {language === 'ua' ? "Ім'я" : 'Imię'} *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#807979]" />
                  <input
                    type="text"
                    name="name"
                    value={contactFormData.name}
                    onChange={handleContactFormChange}
                    required
                    placeholder={language === 'ua' ? "Ваше ім'я" : 'Twoje imię'}
                    className={`w-full pl-12 pr-4 py-3 rounded-[15px] border-2 bg-white text-[#004534]
                              placeholder-[#807979] focus:outline-none transition-colors
                              ${contactErrors.name ? 'border-red-400' : 'border-[#DDDDDD] focus:border-[#0C6951]'}`}
                  />
                </div>
                {contactErrors.name && <p className="text-red-500 text-sm mt-1">{contactErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#004534] mb-2">
                  {language === 'ua' ? 'Телефон' : 'Telefon'} *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#807979]" />
                  <input
                    type="tel"
                    name="phone"
                    value={contactFormData.phone}
                    onChange={handleContactFormChange}
                    required
                    placeholder="+48 XXX XXX XXX"
                    className={`w-full pl-12 pr-4 py-3 rounded-[15px] border-2 bg-white text-[#004534]
                              placeholder-[#807979] focus:outline-none transition-colors
                              ${contactErrors.phone ? 'border-red-400' : 'border-[#DDDDDD] focus:border-[#0C6951]'}`}
                  />
                </div>
                {contactErrors.phone && <p className="text-red-500 text-sm mt-1">{contactErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#004534] mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#807979]" />
                  <input
                    type="email"
                    name="email"
                    value={contactFormData.email}
                    onChange={handleContactFormChange}
                    required
                    placeholder="example@email.com"
                    className={`w-full pl-12 pr-4 py-3 rounded-[15px] border-2 bg-white text-[#004534]
                              placeholder-[#807979] focus:outline-none transition-colors
                              ${contactErrors.email ? 'border-red-400' : 'border-[#DDDDDD] focus:border-[#0C6951]'}`}
                  />
                </div>
                {contactErrors.email && <p className="text-red-500 text-sm mt-1">{contactErrors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-[25px] bg-[#D3FF62] text-[#004534] font-bold text-lg
                          hover:bg-[#c4f050] transform hover:-translate-y-1 transition-all duration-200
                          shadow-md hover:shadow-lg disabled:opacity-70 disabled:transform-none
                          flex items-center justify-center gap-2 mt-6"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-[#004534] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={20} />
                    {language === 'ua' ? 'Надіслати заявку' : 'Wyślij zgłoszenie'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CalculatorSection;
