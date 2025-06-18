
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar' | 'es';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
    es: string;
  };
}

const translations: Translations = {
  // Navigation & Common
  settings: { en: 'Settings', ar: 'الإعدادات', es: 'Configuración' },
  dashboard: { en: 'Dashboard', ar: 'لوحة القيادة', es: 'Panel de Control' },
  profile: { en: 'Profile', ar: 'الملف الشخصي', es: 'Perfil' },
  notifications: { en: 'Notifications', ar: 'الإشعارات', es: 'Notificaciones' },
  
  // Settings Page
  appearancePreferences: { en: 'Appearance & Preferences', ar: 'المظهر والتفضيلات', es: 'Apariencia y Preferencias' },
  customizeAppLooks: { en: 'Customize how the app looks and feels', ar: 'خصص شكل وملمس التطبيق', es: 'Personaliza cómo se ve y se siente la aplicación' },
  theme: { en: 'Theme', ar: 'المظهر', es: 'Tema' },
  chooseColorScheme: { en: 'Choose your preferred color scheme', ar: 'اختر نظام الألوان المفضل لديك', es: 'Elige tu esquema de colores preferido' },
  language: { en: 'Language', ar: 'اللغة', es: 'Idioma' },
  chooseLanguage: { en: 'Choose your preferred language (with graceful fallbacks to English)', ar: 'اختر لغتك المفضلة (مع الرجوع إلى الإنجليزية)', es: 'Elige tu idioma preferido (con respaldo al inglés)' },
  
  // Theme Options
  light: { en: 'Light', ar: 'فاتح', es: 'Claro' },
  dark: { en: 'Dark', ar: 'داكن', es: 'Oscuro' },
  coffeeTheme: { en: 'Mid-Coffee Crash ☕', ar: 'أزمة القهوة ☕', es: 'Crisis de Café ☕' },
  lightDesc: { en: 'Clean and bright interface', ar: 'واجهة نظيفة ومشرقة', es: 'Interfaz limpia y brillante' },
  darkDesc: { en: 'Easy on the eyes for night owls', ar: 'مريح للعيون لمحبي السهر', es: 'Fácil para los ojos de los noctámbulos' },
  coffeeDesc: { en: 'Warm browns when you need that caffeine fix', ar: 'ألوان بنية دافئة عندما تحتاج للكافيين', es: 'Marrones cálidos cuando necesitas cafeína' },
  
  // Language Options
  english: { en: 'English', ar: 'الإنجليزية', es: 'Inglés' },
  arabic: { en: 'العربية', ar: 'العربية', es: 'Árabe' },
  spanish: { en: 'Español', ar: 'الإسبانية', es: 'Español' },
  
  // Feedback & Support
  feedbackSupport: { en: 'Feedback & Support', ar: 'التعليقات والدعم', es: 'Comentarios y Soporte' },
  helpImprove: { en: 'Help us improve by sharing your thoughts and reporting issues', ar: 'ساعدنا في التحسين من خلال مشاركة أفكارك والإبلاغ عن المشاكل', es: 'Ayúdanos a mejorar compartiendo tus pensamientos y reportando problemas' },
  shareFeedback: { en: 'Share Your Feedback', ar: 'شارك تعليقاتك', es: 'Comparte tus Comentarios' },
  reportBug: { en: 'Report a Bug', ar: 'الإبلاغ عن خطأ', es: 'Reportar un Error' },
  
  // Rate & Share
  rateShare: { en: 'Rate & Share', ar: 'قيم وشارك', es: 'Calificar y Compartir' },
  loveApp: { en: 'Love the app? Help spread the word to your amigos! 🎉', ar: 'تحب التطبيق؟ ساعد في نشر الكلمة لأصدقائك! 🎉', es: '¿Te encanta la aplicación? ¡Ayuda a correr la voz a tus amigos! 🎉' },
  
  // About
  aboutUs: { en: 'About Us', ar: 'من نحن', es: 'Acerca de Nosotros' },
  scrappyStartup: { en: 'The scrappy startup behind this magical rent management experience', ar: 'الشركة الناشئة المبدعة وراء تجربة إدارة الإيجار السحرية هذه', es: 'La startup ingeniosa detrás de esta experiencia mágica de gestión de alquiler' },
  
  // Warning Banner
  headsUp: { en: '🎉 Heads up!', ar: '🎉 انتبه!', es: '🎉 ¡Atención!' },
  freeApp: { en: 'This app is completely free—for now! We\'re in our startup phase and loving every caffeinated moment. Enjoy all features while we perfect this magic! ✨', ar: 'هذا التطبيق مجاني تماماً - في الوقت الحالي! نحن في مرحلة الشركة الناشئة ونحب كل لحظة مليئة بالكافيين. استمتع بجميع الميزات بينما نحن نكمل هذا السحر! ✨', es: 'Esta aplicación es completamente gratis—¡por ahora! Estamos en nuestra fase de startup y amamos cada momento lleno de cafeína. ¡Disfruta todas las funciones mientras perfeccionamos esta magia! ✨' },
  
  // Buttons
  sendFeedback: { en: 'Send Feedback 🚀', ar: 'إرسال التعليقات 🚀', es: 'Enviar Comentarios 🚀' },
  reportBugBtn: { en: 'Report Bug 🐛', ar: 'الإبلاغ عن خطأ 🐛', es: 'Reportar Error 🐛' },
  close: { en: 'Close', ar: 'إغلاق', es: 'Cerrar' },
  
  // Forms
  feedbackType: { en: 'Feedback Type', ar: 'نوع التعليق', es: 'Tipo de Comentario' },
  whatsOnMind: { en: 'What\'s on your mind?', ar: 'ما الذي يدور في ذهنك؟', es: '¿Qué tienes en mente?' },
  yourFeedback: { en: 'Your Feedback', ar: 'تعليقاتك', es: 'Tus Comentarios' },
  bugTitle: { en: 'Bug Title', ar: 'عنوان الخطأ', es: 'Título del Error' },
  severity: { en: 'Severity', ar: 'الخطورة', es: 'Gravedad' },
  bugDescription: { en: 'Bug Description', ar: 'وصف الخطأ', es: 'Descripción del Error' },
  
  // Success Messages
  feedbackSent: { en: 'Feedback sent! 🎉', ar: 'تم إرسال التعليقات! 🎉', es: '¡Comentarios enviados! 🎉' },
  thanksFeedback: { en: 'Thanks for helping us improve. We\'ll get back to you if needed!', ar: 'شكراً لمساعدتنا في التحسين. سنعود إليك إذا لزم الأمر!', es: '¡Gracias por ayudarnos a mejorar. Te contactaremos si es necesario!' },
  bugReported: { en: 'Bug report submitted! 🐛', ar: 'تم إرسال تقرير الخطأ! 🐛', es: '¡Reporte de error enviado! 🐛' },
  devInvestigate: { en: 'Our dev team will investigate this faster than you can say \'stack overflow\'', ar: 'فريق التطوير لدينا سيحقق في هذا أسرع مما يمكنك قول \'stack overflow\'', es: 'Nuestro equipo de desarrollo investigará esto más rápido de lo que puedes decir \'stack overflow\'' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language || 'en';
    setLanguage(savedLanguage);
    applyLanguageSettings(savedLanguage);
  }, []);

  const applyLanguageSettings = (lang: Language) => {
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    applyLanguageSettings(lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
