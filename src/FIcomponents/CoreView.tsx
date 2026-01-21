import React, { useState } from 'react';
import { MiningState } from '../types';
import { Icons } from './Icons';

interface CoreViewProps {
  state: MiningState;
  onPurchase: (cost: number, type: string) => boolean;
}

type CoreTab = 'Upgrades' | 'NFT' | 'Artifacts';

export const CoreView: React.FC<CoreViewProps> = ({ state, onPurchase }) => {
  const [activeTab, setActiveTab] = useState<CoreTab>('Upgrades');
  const [minting, setMinting] = useState(false);

  const upgrades = [
    { id: 1, name: 'Obsidian Processor', cost: 5000, rate: '+8%', level: 1, icon: 'Chip', desc: 'Carbon-threaded quantum core.' },
    { id: 2, name: 'Gilded Uplink', cost: 15000, rate: '+15%', level: 0, icon: 'Energy', desc: 'High-bandwidth golden tether.' },
    { id: 3, name: 'Helios Cooling', cost: 45000, rate: '+30%', level: 0, icon: 'Fire', desc: 'Solar-cooled thermal management.' },
    { id: 4, name: 'Neural Silk', cost: 120000, rate: '+55%', level: 0, icon: 'Globe', desc: 'Ethereal network interconnects.' },
  ];

  const handleBuy = (item: any) => {
    if (state.balance >= item.cost) {
      onPurchase(item.cost, 'upgrade');
    }
  };

  const handleMint = () => {
    if (state.balance >= 50000) {
      setMinting(true);
      setTimeout(() => {
        onPurchase(50000, 'nft');
        setMinting(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full w-full px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide transition-colors duration-300 bg-rzc-light-bg dark:bg-rzc-black">
      
      {/* Header & Simplified "Clear" Tabs */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight dark:neon-text-gold mb-1">Imperial Core</h1>
        <p className="text-slate-400 dark:text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] mb-8">Node_Infrastructure_V5</p>

        <div className="flex justify-between items-end border-b border-slate-200 dark:border-white/5 mb-8">
           {(['Upgrades', 'NFT', 'Artifacts'] as CoreTab[]).map(tab => {
             const isActive = activeTab === tab;
             return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 px-2 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${
                  isActive 
                    ? 'text-slate-900 dark:text-rzc-gold' 
                    : 'text-slate-400 dark:text-gray-600 hover:text-slate-600 dark:hover:text-gray-400'
                }`}
              >
                {tab}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rzc-gold dark:shadow-[0_0_10px_rgba(251,191,36,0.5)] animate-in fade-in zoom-in duration-500"></div>
                )}
              </button>
             );
           })}
        </div>

        <div className="bg-slate-900 dark:bg-white/5 border border-slate-800 dark:border-rzc-gold/20 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <span className="text-slate-400 dark:text-gray-500 text-[9px] font-mono uppercase tracking-widest">Available Reserve</span>
            <span className="text-rzc-gold font-bold font-mono text-base tracking-tight">{state.balance.toLocaleString()} RZC</span>
        </div>
      </div>

      {activeTab === 'Upgrades' && (
        <div className="space-y-4">
          {upgrades.map((item, idx) => {
               const canAfford = state.balance >= item.cost;
               const Icon = Icons[item.icon as keyof typeof Icons] || Icons.Core;
               return (
                 <div 
                    key={item.id} 
                    className={`
                      opacity-0 animate-scale-in stagger-${(idx % 3) + 1}
                      bg-white dark:bg-rzc-dark border border-slate-200 dark:border-white/5 rounded-[2.2rem] p-5 flex items-center justify-between shadow-sm hover:border-rzc-gold/30 transition-all duration-500 group
                    `}
                 >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 dark:bg-rzc-gold/5 rounded-[1.2rem] flex items-center justify-center text-slate-800 dark:text-rzc-gold border border-slate-100 dark:border-rzc-gold/20 group-hover:scale-105 transition-transform">
                            <Icon size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">{item.name}</h4>
                                <span className="text-[9px] bg-slate-100 dark:bg-rzc-gold/10 text-slate-600 dark:text-rzc-gold px-2 py-0.5 rounded-md font-bold border border-slate-200 dark:border-rzc-gold/20">L{item.level}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5 font-mono">{item.desc}</p>
                            <div className="text-rzc-gold-dim dark:text-rzc-gold text-[10px] font-bold uppercase tracking-[0.2em] mt-2 font-mono">{item.rate} HR</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleBuy(item)} 
                        disabled={!canAfford} 
                        className={`
                            px-5 py-3 rounded-xl text-[10px] font-bold flex flex-col items-center min-w-[90px] transition-all
                            ${canAfford 
                                ? 'bg-slate-900 dark:bg-rzc-gold text-white dark:text-black shadow-lg hover:scale-[1.05] active:scale-95' 
                                : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-700 cursor-not-allowed opacity-40'
                            }
                        `}
                    >
                       <span className="uppercase tracking-widest">Buy</span>
                       <span className="text-[8px] opacity-70 mt-0.5 font-mono">{item.cost >= 1000 ? (item.cost/1000).toFixed(0)+'K' : item.cost}</span>
                    </button>
                 </div>
               )
          })}
        </div>
      )}

      {activeTab === 'NFT' && (
        <div className="flex flex-col items-center animate-scale-in">
            <div className="w-full relative aspect-square bg-slate-900 dark:bg-gradient-to-b dark:from-rzc-dark dark:to-black rounded-[2.5rem] border border-slate-800 dark:border-rzc-gold/20 overflow-hidden mb-8 group shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icons.NFT size={120} className="text-rzc-gold/10 group-hover:text-rzc-gold/20 transition-all duration-1000 transform group-hover:rotate-[8deg]" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="text-[10px] font-bold text-rzc-gold uppercase tracking-[0.5em] mb-2 block">Sovereign Tier</span>
                    <h2 className="text-3xl font-bold text-white tracking-tighter">Monarch Node</h2>
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed font-mono italic">"The ultimate validator key for the imperial network."</p>
                </div>
            </div>
            
            <div className="w-full bg-white dark:bg-rzc-dark border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 mb-6 shadow-sm flex flex-col items-center">
                <div className="flex justify-between items-center w-full mb-8 pb-8 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">Protocol Fee</span>
                    <span className="text-slate-900 dark:text-white font-bold text-xl font-mono tracking-tighter">50,000 RZC</span>
                </div>
                <button 
                  onClick={handleMint} 
                  disabled={state.balance < 50000 || minting} 
                  className={`
                    w-full py-5 rounded-2xl font-bold text-xs tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4
                    ${state.balance >= 50000 
                      ? 'bg-slate-900 dark:bg-rzc-gold text-white dark:text-black shadow-2xl hover:scale-[1.02] active:scale-95' 
                      : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-800 cursor-not-allowed opacity-60'
                    }
                  `}
                >
                    {minting ? <Icons.Refresh className="animate-spin" size={16} /> : <><Icons.Mint size={18} /> INITIATE_MINT</>}
                </button>
            </div>
        </div>
      )}

      {activeTab === 'Artifacts' && (
        <div className="flex flex-col items-center justify-center py-20 animate-scale-in text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-rzc-gold/5 flex items-center justify-center text-slate-300 dark:text-rzc-gold/20 mb-6 border border-dashed border-slate-200 dark:border-rzc-gold/20">
                <Icons.Lock size={32} />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold tracking-tight mb-2 uppercase text-sm tracking-[0.2em]">Imperial Vault Locked</h3>
            <p className="text-slate-500 dark:text-gray-500 text-[10px] max-w-[200px] font-mono">STABILIZING_CELESTIAL_DATA...</p>
        </div>
      )}
    </div>
  );
};