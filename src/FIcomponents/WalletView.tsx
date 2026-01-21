import React, { useState, useEffect } from 'react';
import { MiningState } from '../types';
import { Icons } from './Icons';

interface WalletViewProps {
  state: MiningState;
  onActivate: (unlockedBonus: number, purchaseAmount: number) => void;
  onUpdateBalance?: (amount: number) => void;
  onClaimAirdrop: (liquid: number, locked: number) => void;
}

type ModalType = 'none' | 'send' | 'receive' | 'swap' | 'launchpad_buy' | 'airdrop_wizard';

export const WalletView: React.FC<WalletViewProps> = ({ state, onActivate, onUpdateBalance, onClaimAirdrop }) => {
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [aiInsight, setAiInsight] = useState("Scanning imperial vault clusters...");
  
  const RZC_USD_RATE = 0.12; 
  const totalPool = state.miningBalance;
  const liquidClaimable = totalPool * 0.3;

  

  const resetModal = () => {
    setActiveModal('none');
    setStep('input');
  };

  const WalletAction = ({ icon: Icon, label, onClick, disabled }: any) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-4 group"
    >
      <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-700
        ${disabled 
          ? 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-gray-700 border border-black/5 dark:border-white/5 opacity-40' 
          : 'bg-slate-900 dark:bg-rzc-gold text-white dark:text-black shadow-xl hover:scale-110 active:scale-95 border-t border-white/20 dark:border-black/10'
        }
      `}>
        <Icon size={26} />
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${disabled ? 'text-slate-300 dark:text-gray-600' : 'text-slate-500 dark:text-gray-400 group-hover:text-rzc-gold'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="flex flex-col h-full w-full bg-rzc-light-bg dark:bg-rzc-black overflow-y-auto scrollbar-hide pb-32 relative transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center px-8 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight dark:neon-text-gold">Imperial Vault</h1>
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 dark:bg-rzc-gold/10 rounded-full border border-slate-800 dark:border-rzc-gold/20">
            <div className="w-1.5 h-1.5 rounded-full bg-rzc-gold animate-pulse shadow-[0_0_8px_#fbbf24]"></div>
            <span className="text-[9px] font-bold text-rzc-gold uppercase font-mono tracking-[0.2em]">{state.network.split(' ')[0]}</span>
        </div>
      </div>

      {/* Balance Section */}
      <div className="flex flex-col items-center py-12 px-8">
        <div className="flex items-center gap-4">
            <span className="text-5xl font-bold text-slate-900 dark:text-white font-mono tracking-tighter dark:neon-text-gold">
                {(state.balance + (state.isAirdropClaimed ? 0 : state.miningBalance)).toLocaleString(undefined, { minimumFractionDigits: 1 })}
            </span>
            <div className="bg-rzc-gold/10 px-3 py-1.5 rounded-xl border border-rzc-gold/30">
                <span className="text-rzc-gold font-bold text-sm font-mono">RZC</span>
            </div>
        </div>
        <div className="text-slate-400 dark:text-gray-500 text-xs font-mono mt-4 tracking-widest opacity-80 uppercase">
            ≈ ${((state.balance + (state.isAirdropClaimed ? 0 : state.miningBalance)) * RZC_USD_RATE).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex justify-center gap-10 mb-12">
        <WalletAction icon={Icons.Send} label="Send" disabled={!state.isAirdropClaimed} />
        <WalletAction icon={Icons.Receive} label="Recv" disabled={!state.isAirdropClaimed} />
        <WalletAction icon={Icons.Refresh} label="Swap" disabled={!state.isAirdropClaimed} />
      </div>

      {/* Insight Section */}
      <div className="mx-8 mb-10">
          <div className="bg-slate-900/40 dark:bg-black/40 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-7 relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icons.Chip size={64} className="text-rzc-gold" />
              </div>
              <h4 className="text-[10px] font-bold text-rzc-gold uppercase tracking-[0.4em] mb-4">IMPERIAL_INTELLIGENCE</h4>
              <p className="text-slate-700 dark:text-white text-xs leading-relaxed font-mono opacity-90 italic">
                "{aiInsight}"
              </p>
          </div>
      </div>

      {/* Asset List */}
      <div className="px-8 mb-8">
          <h3 className="text-slate-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-6 ml-1">Vault_Inventory</h3>
          <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-white dark:bg-white/5 backdrop-blur-md rounded-[2.2rem] border border-slate-100 dark:border-white/10 shadow-sm hover:border-rzc-gold/40 transition-all group">
                  <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-rzc-gold/10 flex items-center justify-center text-rzc-gold group-hover:scale-110 transition-transform"><Icons.Mining size={26} /></div>
                      <div>
                          <h4 className="text-slate-900 dark:text-white text-sm font-bold tracking-tight">Imperial Core (RZC)</h4>
                          <p className="text-[9px] text-gray-500 uppercase font-mono mt-1 font-bold">Mainframe Asset</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <div className="text-slate-900 dark:text-white font-bold text-lg font-mono tracking-tighter">
                        {state.balance.toFixed(1)}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};