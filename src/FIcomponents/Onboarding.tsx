import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [bootStep, setBootStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const bootSequence = [
    "Initializing RhizaCore Kernel...",
    "Loading Imperial Interfaces...",
    "Verifying Cryptographic Keys...",
    "Establishing Uplink to Mainframe...",
    "Connection Secure."
  ];

  const tutorialSteps = [
    {
      title: "Activate Node",
      description: "Your device acts as a neural node. Keep mining sessions active to earn RZC tokens continuously.",
      icon: Icons.Mining,
      color: "text-rzc-gold"
    },
    {
      title: "Complete Missions",
      description: "Boost your earnings by completing daily tasks, social quests, and partner missions.",
      icon: Icons.Task,
      color: "text-rzc-gold"
    },
    {
      title: "Upgrade Hardware",
      description: "Reinvest your RZC into Core upgrades and NFTs to permanently increase your mining hashrate.",
      icon: Icons.Core,
      color: "text-rzc-gold"
    }
  ];

  useEffect(() => {
    if (bootStep < bootSequence.length) {
      const timeout = setTimeout(() => {
        setBootStep(prev => prev + 1);
      }, 600); 
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setShowTutorial(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [bootStep]);

  const handleNext = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  if (showTutorial) {
    const currentSlide = tutorialSteps[tutorialStep];
    const Icon = currentSlide.icon;
    const isLastStep = tutorialStep === tutorialSteps.length - 1;

    return (
      <div className="flex flex-col h-full w-full relative overflow-hidden bg-rzc-black z-50">
         {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
             style={{ 
               backgroundImage: 'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Top Skip Button */}
        <div className="absolute top-6 right-6 z-20">
            <button onClick={onComplete} className="text-gray-600 text-[10px] font-mono hover:text-rzc-gold transition-colors tracking-widest uppercase">
                SKIP_INTRO
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 text-center">
             {/* Animated Icon Circle */}
            <div className={`w-32 h-32 bg-rzc-dark border border-rzc-gold/20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl relative group`}>
                <div className={`absolute inset-0 rounded-[2.5rem] opacity-20 blur-2xl bg-rzc-gold`}></div>
                <Icon size={48} className={`text-rzc-gold drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-500 transform scale-110`} />
                
                {/* Decorative corners */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-rzc-gold/30"></div>
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-rzc-gold/30"></div>
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-rzc-gold/30"></div>
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-rzc-gold/30"></div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight dark:neon-text-gold">{currentSlide.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] font-medium">
                {currentSlide.description}
            </p>
        </div>

        {/* Bottom Controls */}
        <div className="p-8 pb-12 w-full z-10">
            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mb-8">
                {tutorialSteps.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                            idx === tutorialStep 
                            ? 'w-8 bg-rzc-gold' 
                            : 'w-2 bg-white/10'
                        }`} 
                    />
                ))}
            </div>

            <button 
                onClick={handleNext}
                className={`w-full font-bold py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 tracking-[0.2em] uppercase text-xs
                    ${isLastStep 
                        ? 'bg-rzc-gold text-black shadow-[0_0_30px_rgba(251,191,36,0.2)]' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
            >
                {isLastStep ? (
                    <>
                        INITIALIZE_SYSTEM <Icons.Power size={18} />
                    </>
                ) : (
                    'CONTINUE'
                )}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-end pb-24 h-full w-full p-8 bg-rzc-black font-mono text-xs z-50">
        {bootSequence.slice(0, bootStep).map((line, index) => (
            <div key={index} className="text-rzc-gold/80 mb-3 tracking-widest">
                <span className="mr-3 opacity-30">{`>`}</span>
                {line}
            </div>
        ))}
        <div className="text-rzc-gold animate-pulse text-lg">_</div>
    </div>
  );
};