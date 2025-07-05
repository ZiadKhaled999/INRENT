import React, { useEffect, useState } from 'react';
import AppLogoWithBg from "@/components/AppLogoWithBg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fadeOut_0.5s_ease-out_forwards]"
        style={{
          backgroundImage: `url(/lovable-uploads/00243405-45bb-4cc8-bebc-0d10f4ac0b8e.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-green-600/80 to-teal-600/90"></div>
        <div className="relative z-10 text-center text-white">
          <div className="animate-[scaleOut_0.5s_ease-out_forwards]">
            <AppLogoWithBg size={120} />
          </div>
          <h1 className="text-5xl font-bold mt-6 animate-[fadeOut_0.3s_ease-out_0.2s_forwards]">InRent</h1>
          <p className="text-xl mt-2 animate-[fadeOut_0.3s_ease-out_0.1s_forwards]">Fair rent splitting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundImage: `url(/lovable-uploads/00243405-45bb-4cc8-bebc-0d10f4ac0b8e.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-green-600/80 to-teal-600/90"></div>
      <div className="relative z-10 text-center text-white">
        <div className="animate-[logoScale_2s_ease-out]">
          <AppLogoWithBg size={120} />
        </div>
        <h1 className="text-5xl font-bold mt-6 animate-[fadeInUp_1s_ease-out_0.5s_both]">InRent</h1>
        <p className="text-xl mt-2 animate-[fadeInUp_1s_ease-out_0.8s_both]">Fair rent splitting</p>
        <div className="mt-8 flex justify-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundImage: `url(/lovable-uploads/00243405-45bb-4cc8-bebc-0d10f4ac0b8e.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-green-600/80 to-teal-600/90"></div>
      <div className="relative z-10 text-center text-white">
        <div className="animate-[logoScale_2s_ease-out]">
          <AppLogoWithBg size={120} />
        </div>
        <h1 className="text-5xl font-bold mt-6 animate-[fadeInUp_1s_ease-out_0.5s_both]">InRent</h1>
        <p className="text-xl mt-2 animate-[fadeInUp_1s_ease-out_0.8s_both]">Fair rent splitting</p>
        <div className="mt-8 flex justify-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;