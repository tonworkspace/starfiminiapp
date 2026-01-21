import React from 'react';
import { BottomTab } from '../types';
import { Icons } from './Icons';

interface BottomNavProps {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: BottomTab; icon: any; label: string }[] = [
    { id: 'Mining', icon: Icons.Mining, label: 'Core' },
    { id: 'Task', icon: Icons.Task, label: 'Edicts' },
    { id: 'Friends', icon: Icons.Nodes, label: 'Nodes' },
    { id: 'Wallet', icon: Icons.Vault, label: 'Vault' },
    { id: 'More', icon: Icons.More, label: 'System' },
  ];

  return (
    <div className="absolute bottom-5 left-5 right-5 h-16 sm:h-20 bg-white/95 dark:bg-rzc-dark/80 backdrop-blur-3xl rounded-[2.2rem] border border-stone-200 dark:border-rzc-gold/15 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between px-2.5 z-50 transition-all duration-700">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="relative flex-1 h-full flex flex-col items-center justify-center group outline-none"
          >
            {/* ACTIVE GLOW HALO */}
            {isActive && (
                <div className="absolute inset-x-0 -top-8 flex justify-center pointer-events-none">
                    <div className="w-14 h-14 bg-rzc-gold/20 dark:bg-rzc-gold/30 blur-2xl rounded-full animate-pulse"></div>
                    <div className="absolute w-12 h-12 border border-rzc-gold/20 dark:border-rzc-gold/30 rounded-full animate-spin-slow scale-150"></div>
                </div>
            )}

            <div className={`
                flex items-center justify-center transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275)
                ${isActive 
                  ? 'w-12 h-12 sm:w-15 sm:h-15 bg-stone-900 dark:bg-rzc-gold text-white dark:text-black rounded-2xl -translate-y-8 shadow-2xl dark:shadow-[0_12px_24px_rgba(251,191,36,0.3)] border-[3px] border-white dark:border-rzc-black rotate-[2deg] scale-110 z-10' 
                  : 'w-10 h-10 text-stone-300 dark:text-gray-700 group-hover:text-stone-500 dark:group-hover:text-gray-400 group-hover:scale-110'
                }
            `}>
              <Icon 
                className={`transition-all duration-500 ${isActive ? 'w-6 h-6 sm:w-7 sm:h-7 animate-plasma-pulse' : 'w-5 h-5 sm:w-6 sm:h-6'}`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
            </div>
            
            <span className={`
                absolute bottom-2 text-[8px] font-bold tracking-[0.15em] transition-all duration-500 uppercase
                ${isActive ? 'opacity-100 translate-y-0 text-stone-900 dark:text-rzc-gold' : 'opacity-0 translate-y-2 text-transparent'}
            `}>
              {item.label}
            </span>
            
            {!isActive && (
                <div className="w-1 h-1 rounded-full bg-stone-200 dark:bg-gray-800 transition-all group-hover:bg-rzc-gold/40 mt-1"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};