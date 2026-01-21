import React, { useState } from 'react';
import { UserProfile, NetworkType, ThemeMode } from '../types';
import { Icons } from './Icons';

interface HeaderProps {
  user: UserProfile;
  currentNetwork: NetworkType;
  onNetworkChange: (network: NetworkType) => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, currentNetwork, onNetworkChange, theme, onThemeToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const networks: NetworkType[] = ['Rhiza Mainnet', 'TON Mainnet', 'Devnet'];

  const getNetworkColor = (net: NetworkType) => {
    switch (net) {
      case 'Rhiza Mainnet': return 'text-rzc-gold';
      case 'TON Mainnet': return 'text-blue-500';
      case 'Devnet': return 'text-orange-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-rzc-light-bg/90 dark:bg-rzc-black/80 backdrop-blur-2xl sticky top-0 z-[100] border-b border-rzc-light-border dark:border-rzc-gold/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-stone-900 dark:bg-rzc-dark border border-stone-700 dark:border-rzc-gold/30 flex items-center justify-center text-rzc-gold font-bold shadow-lg">
          {user.avatarLetter}
        </div>
        <div className="flex flex-col">
          <span className="text-stone-900 dark:text-white font-bold text-sm tracking-tight transition-colors">{user.username}</span>
          <span className="text-rzc-gold-dim dark:text-rzc-gold text-[9px] font-mono font-bold leading-none mt-1 uppercase tracking-[0.2em] opacity-80">{user.tag}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={onThemeToggle}
          aria-label="Toggle Theme"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-200/50 dark:bg-white/5 border border-stone-300 dark:border-white/10 text-stone-600 dark:text-gray-400 hover:text-rzc-gold dark:hover:text-rzc-gold transition-all active:scale-90"
        >
          {theme === 'dark' ? <Icons.Sun size={18} /> : <Icons.Moon size={18} />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-stone-900 dark:bg-white/5 border border-stone-700 dark:border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold tracking-widest text-white hover:bg-black dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
          >
            <div className={`w-2 h-2 rounded-full ${getNetworkColor(currentNetwork).replace('text-', 'bg-')}`}></div>
            <span className="uppercase">{currentNetwork.split(' ')[0]}</span>
            <Icons.ChevronRight size={12} className={`text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
              <div className="absolute right-0 mt-3 w-52 bg-rzc-light-card dark:bg-rzc-dark border border-stone-200 dark:border-rzc-gold/20 rounded-[1.5rem] shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-4 border-b border-stone-100 dark:border-white/5 bg-stone-50 dark:bg-white/5">
                  <span className="text-[10px] font-bold text-stone-400 dark:text-gray-500 uppercase tracking-widest">Imperial Protocols</span>
                </div>
                {networks.map((net) => (
                  <button
                    key={net}
                    onClick={() => {
                      onNetworkChange(net);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-5 py-4 text-[11px] font-bold transition-colors hover:bg-stone-50 dark:hover:bg-white/5 ${currentNetwork === net ? 'text-rzc-gold' : 'text-stone-400 dark:text-gray-500'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${currentNetwork === net ? getNetworkColor(net).replace('text-', 'bg-') : 'bg-stone-200 dark:bg-gray-800'}`}></div>
                      {net}
                    </div>
                    {currentNetwork === net && <Icons.Check size={14} className="text-rzc-gold" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};