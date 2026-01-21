import React, { useState, useEffect, useRef } from 'react';
import { TopTab, MiningState } from '../types';
import { Icons } from './Icons';

interface MiningDashboardProps {
  state: MiningState;
  activeTopTab: TopTab;
  onTabChange: (tab: TopTab) => void;
  onOpenUpgrades: () => void;
  onClaim: (amount: number) => void;
}

type WizardStep = 'review' | 'syncing' | 'distributing' | 'success';

export const MiningDashboard: React.FC<MiningDashboardProps> = ({ state, activeTopTab, onTabChange, onOpenUpgrades, onClaim }) => {
  const [displayBalance, setDisplayBalance] = useState(state.balance);
  const [sessionString, setSessionString] = useState("00h 00m 00s");
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>('review');
  const [txLogs, setTxLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(-1);

  const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      const increment = (state.miningRatePerHour / 3600000) * deltaTime;
      if (state.isMining && !isSessionComplete) {
        setDisplayBalance(prev => prev + increment);
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [state.isMining, state.miningRatePerHour, isSessionComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - state.sessionStartTime;
      const remaining = SESSION_DURATION_MS - elapsed;

      if (remaining <= 0) {
        setSessionString("00h 00m 00s");
        setSessionProgress(100);
        setIsSessionComplete(true);
        clearInterval(interval);
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setSessionString(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
        setSessionProgress((elapsed / SESSION_DURATION_MS) * 100);
        setIsSessionComplete(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.sessionStartTime]);

  const startClaimWizard = async () => {
    setShowWizard(true);
    setWizardStep('review');
  };



  const renderMiningContent = () => (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-8 py-4 sm:py-0 animate-in fade-in duration-700">
      {/* BALANCE DISPLAY */}
      <div className="text-center mb-6 sm:mb-10 shrink-0">
         <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <span className="text-rzc-gold-dim dark:text-rzc-gold font-bold text-base sm:text-lg font-mono tracking-widest">RZC</span>
            <div className="w-1 h-1 rounded-full bg-rzc-gold/20"></div>
            <span className="text-stone-500 dark:text-gray-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] sm:tracking-[0.3em]">Imperial_Node</span>
         </div>
         <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-white font-mono tracking-tighter dark:neon-text-gold" style={{ fontSize: 'var(--fluid-balance)' }}>
            {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
         </h1>
      </div>

      {/* CENTRAL GILDED CORE */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: 'var(--fluid-orb)', height: 'var(--fluid-orb)' }}>
          <div className="absolute inset-0 bg-rzc-gold/5 dark:bg-rzc-gold/10 rounded-full blur-3xl animate-pulse scale-110"></div>
          <div className="absolute inset-0 rounded-full border border-dashed border-rzc-gold/10 dark:border-rzc-gold/20 animate-spin-slow"></div>
          
          <div className={`
              relative w-4/5 h-4/5 rounded-full border-2 sm:border-4 border-white dark:border-rzc-gold/30 
              bg-gradient-to-br from-rzc-light-card to-stone-50 dark:from-rzc-dark dark:to-black 
              flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 group
              ${isSessionComplete ? 'scale-110 border-rzc-gold animate-pulse' : 'animate-plasma-pulse'}
          `}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rzc-gold/10 rounded-full flex items-center justify-center text-rzc-gold mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <Icons.Energy className="w-6 h-6 sm:w-10 sm:h-10" />
              </div>
              {!isSessionComplete && (
                <div className="text-rzc-gold font-mono text-[9px] sm:text-[11px] font-bold tracking-widest animate-pulse">
                  +{state.miningRatePerHour.toFixed(2)} / h
                </div>
              )}
              {isSessionComplete && (
                 <div className="text-rzc-gold font-bold text-[8px] sm:text-[10px] uppercase tracking-widest">
                    Ready to Claim
                 </div>
              )}
          </div>

          {[...Array(6)].map((_, i) => (
              <div 
                  key={i} 
                  className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-rzc-gold rounded-full opacity-40 blur-[1px]"
                  style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 60}deg) translate(clamp(5rem, 15vh, 8rem), 0)`,
                      animation: `spin ${10 + i * 2}s linear infinite`
                  }}
              ></div>
          ))}
      </div>

      <div className="mt-6 sm:mt-10 flex gap-6 sm:gap-8 shrink-0">
          <div className="flex flex-col items-center">
              <span className="text-[8px] sm:text-[9px] text-stone-400 dark:text-gray-600 font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Session</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-stone-900 dark:text-white">{state.miningBalance.toFixed(0)} RZC</span>
          </div>
          <div className="w-px h-6 sm:h-8 bg-rzc-gold/10 dark:bg-white/10 self-center"></div>
          <div className="flex flex-col items-center">
              <span className="text-[8px] sm:text-[9px] text-stone-400 dark:text-gray-600 font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Global Hash</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-stone-900 dark:text-white">1.2 EH/s</span>
          </div>
      </div>
    </div>
  );

  const renderBoostContent = () => (
    <div className="flex-1 flex flex-col w-full px-6 pt-10 overflow-y-auto scrollbar-hide animate-in slide-in-from-right-10 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight dark:neon-text-gold">Imperial Boosters</h2>
        <p className="text-stone-400 dark:text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Accelerate accumulation speed</p>
      </div>

      <div className="space-y-4 pb-12">
        <div className="bg-rzc-light-card dark:bg-rzc-dark border border-rzc-light-border dark:border-rzc-gold/20 rounded-[2rem] p-6 shadow-sm hover:border-rzc-gold/40 transition-all group">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-rzc-gold/10 rounded-2xl flex items-center justify-center text-rzc-gold group-hover:scale-110 transition-transform">
                    <Icons.Energy size={28} />
                </div>
                <div className="flex-1">
                    <h4 className="text-stone-900 dark:text-white text-sm font-bold tracking-tight">Neural Overclock</h4>
                    <p className="text-[9px] text-gray-500 uppercase font-mono mt-1 font-bold">2X Speed for 1 Hour</p>
                </div>
                <button className="px-4 py-2.5 bg-rzc-gold text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md">Start</button>
            </div>
        </div>

        <div className="bg-rzc-light-card dark:bg-rzc-dark border border-rzc-light-border dark:border-rzc-gold/20 rounded-[2rem] p-6 shadow-sm hover:border-rzc-gold/40 transition-all group opacity-60">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-rzc-gold/5 rounded-2xl flex items-center justify-center text-rzc-gold/40">
                    <Icons.Users size={28} />
                </div>
                <div className="flex-1">
                    <h4 className="text-stone-900 dark:text-white text-sm font-bold tracking-tight">Node Multiplier</h4>
                    <p className="text-[9px] text-gray-500 uppercase font-mono mt-1 font-bold">Permanent +10% per Node</p>
                </div>
                <Icons.Lock size={16} className="text-stone-600" />
            </div>
        </div>

        <div className="bg-rzc-light-card dark:bg-rzc-dark border border-rzc-light-border dark:border-rzc-gold/20 rounded-[2rem] p-6 shadow-sm hover:border-rzc-gold/40 transition-all group">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-rzc-gold/10 rounded-2xl flex items-center justify-center text-rzc-gold group-hover:scale-110 transition-transform">
                    <Icons.Fire size={28} />
                </div>
                <div className="flex-1">
                    <h4 className="text-stone-900 dark:text-white text-sm font-bold tracking-tight">Genesis Streak</h4>
                    <p className="text-[9px] text-gray-500 uppercase font-mono mt-1 font-bold">Daily Multiplier: 1.25x</p>
                </div>
                <span className="text-rzc-gold font-mono font-bold text-[10px] uppercase">Active</span>
            </div>
        </div>
      </div>
    </div>
  );

  const renderRankContent = () => (
    <div className="flex-1 flex flex-col w-full px-5 pt-6 overflow-y-auto scrollbar-hide animate-in slide-in-from-right-5 duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">Imperial Standings</h2>
          <p className="text-stone-400 dark:text-gray-500 text-[9px] font-mono uppercase tracking-widest mt-0.5">Solar_Cycle_2.0</p>
        </div>
        <div className="text-right">
          <span className="text-rzc-gold text-[8px] font-mono font-bold block mb-1 uppercase tracking-widest">Season Ends</span>
          <span className="text-stone-900 dark:text-white font-mono text-[10px] font-bold bg-stone-100 dark:bg-white/5 px-2 py-1 rounded-md border border-stone-200 dark:border-white/5">08D:14H:22M</span>
        </div>
      </div>

      {/* USER'S COMPACT RANK CARD */}
      <div className="bg-stone-900 dark:bg-rzc-gold/5 border border-stone-800 dark:border-rzc-gold/20 rounded-[1.8rem] p-4 mb-8 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rzc-gold text-black flex items-center justify-center font-bold text-xs shadow-lg">#42</div>
                  <div>
                      <h4 className="text-white text-xs font-bold tracking-tight">You (aurum_node)</h4>
                      <p className="text-[8px] text-rzc-gold/60 uppercase font-mono font-bold tracking-widest">Imperial Tier</p>
                  </div>
              </div>
              <div className="text-right">
                  <span className="text-rzc-gold font-mono font-bold text-xs">1.2M RZC</span>
              </div>
          </div>
          <div className="space-y-1.5">
              <div className="flex justify-between text-[7px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                  <span>Progress to Archon</span>
                  <span className="text-rzc-gold">74%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rzc-gold shadow-[0_0_8px_#fbbf24]" style={{ width: '74%' }}></div>
              </div>
          </div>
      </div>

      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-stone-400 dark:text-gray-600 text-[9px] font-bold uppercase tracking-[0.4em]">Archon_Leaderboard</h3>
        <span className="text-stone-300 dark:text-gray-800 text-[8px] font-mono">TOP_100_GLOBAL</span>
      </div>

      {/* COMPACT RANK LIST */}
      <div className="space-y-2 pb-24">
          {[
              { rank: 1, name: 'sol_king', balance: '12.4M', tier: 'ARC', color: 'text-rzc-gold' },
              { rank: 2, name: 'luna_proxy', balance: '10.8M', tier: 'ARC', color: 'text-stone-300' },
              { rank: 3, name: 'nova_hash', balance: '9.2M', tier: 'VAL', color: 'text-rzc-gold-dim' },
              { rank: 4, name: 'void_miner', balance: '8.1M', tier: 'VAL', color: 'text-stone-500' },
              { rank: 5, name: 'ether_pulse', balance: '7.5M', tier: 'VAL', color: 'text-stone-500' },
              { rank: 6, name: 'zen_node', balance: '6.9M', tier: 'MIN', color: 'text-stone-500' },
              { rank: 7, name: 'iron_core', balance: '5.2M', tier: 'MIN', color: 'text-stone-500' },
              { rank: 8, name: 'neon_soul', balance: '4.8M', tier: 'MIN', color: 'text-stone-500' },
          ].map((user, idx) => (
            <div 
                key={user.rank} 
                className={`
                    flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 animate-in slide-in-from-right-4 stagger-${(idx % 4) + 1}
                    ${user.rank <= 3 
                        ? 'bg-white dark:bg-white/5 border-rzc-gold/10' 
                        : 'bg-stone-50/50 dark:bg-rzc-dark/40 border-stone-100 dark:border-white/5 opacity-80'
                    }
                `}
            >
                <div className="flex items-center gap-3.5">
                    <div className={`w-6 text-center text-[10px] font-bold ${user.color}`}>
                        {user.rank === 1 ? '❶' : user.rank === 2 ? '❷' : user.rank === 3 ? '❸' : `#${user.rank}`}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-stone-900 dark:text-white text-[11px] font-bold">{user.name}</span>
                            <span className={`text-[7px] px-1 rounded bg-stone-200 dark:bg-white/10 font-mono font-bold tracking-tighter ${user.rank <= 3 ? 'text-rzc-gold' : 'text-stone-400'}`}>
                                [{user.tier}]
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-stone-900 dark:text-white font-mono text-[10px] font-bold">{user.balance}</span>
                    <span className="text-[7px] text-stone-400 dark:text-gray-600 font-mono uppercase tracking-tighter">Imperial_RZC</span>
                </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-rzc-light-bg dark:bg-rzc-black transition-colors duration-500 overflow-hidden relative">
      
      {/* BACKGROUND PARTICLES */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-rzc-gold rounded-full animate-blob"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-rzc-gold/40 rounded-full animate-blob [animation-delay:4s]"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-rzc-gold/60 rounded-full animate-blob [animation-delay:7s]"></div>
      </div>

      {/* CLAIM WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-stone-900/60 dark:bg-black/80 backdrop-blur-md" onClick={() => wizardStep !== 'syncing' && setShowWizard(false)}></div>
          <div className="bg-white dark:bg-rzc-dark border border-stone-200 dark:border-rzc-gold/20 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-sm relative z-10 shadow-2xl p-6 sm:p-8">
            {wizardStep === 'review' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white mb-4 sm:mb-6 tracking-tight">Imperial Audit</h3>
                <div className="bg-stone-50 dark:bg-black/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-100 dark:border-rzc-gold/10 mb-6 sm:mb-8">
                  <span className="text-[9px] sm:text-[10px] text-stone-400 dark:text-gray-500 font-bold uppercase tracking-widest block mb-1">Session Yield</span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-rzc-gold">{state.miningBalance.toFixed(2)} RZC</span>
                </div>
                <button className="w-full py-4 bg-rzc-gold text-black rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Initialize Release
                </button>
              </div>
            )}
            {wizardStep === 'syncing' && (
              <div className="flex flex-col items-center py-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-rzc-gold/10 border-t-rzc-gold animate-spin mb-6 sm:mb-8"></div>
                <div className="w-full bg-stone-900 dark:bg-black/60 rounded-xl p-4 font-mono text-[8px] min-h-[100px] sm:min-h-[120px]">
                    {txLogs.map((log, i) => (
                        <div key={i} className={`mb-1 transition-opacity ${i <= currentLogIndex ? 'text-rzc-gold opacity-100' : 'text-stone-700 dark:text-gray-800 opacity-50'}`}>
                            {i <= currentLogIndex ? '✓' : '○'} {log}
                        </div>
                    ))}
                </div>
              </div>
            )}
            {wizardStep === 'distributing' && (
                <div className="text-center py-8">
                    <Icons.Refresh size={32} className="text-rzc-gold animate-spin mx-auto mb-6" />
                    <button className="w-full py-4 bg-rzc-gold text-black rounded-2xl font-bold uppercase text-xs tracking-widest">
                      Finalize Uplink
                    </button>
                </div>
            )}
            {wizardStep === 'success' && (
              <div className="text-center py-4 animate-in zoom-in">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rzc-gold flex items-center justify-center text-black mx-auto mb-4 sm:mb-6 shadow-2xl">
                  <Icons.Check size={32} strokeWidth={3} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-2">Assets Vaulted</h3>
                <p className="text-stone-500 text-xs mb-6 sm:mb-8">Harvest successful. Re-initializing node protocols.</p>
                <button className="w-full py-4 bg-stone-100 dark:bg-white/5 text-stone-900 dark:text-white rounded-2xl font-bold uppercase text-xs tracking-widest border border-stone-200 dark:border-white/10">
                  Return to Core
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOP NAVIGATION */}
      <div className="flex justify-center mt-4 sm:mt-6 px-4 sm:px-8 z-20">
        <div className="flex bg-stone-100/50 dark:bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl border border-stone-200 dark:border-white/10 w-full max-w-xs transition-all">
          {(['Mining', 'Boost', 'Rank'] as TopTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-bold tracking-widest uppercase transition-all ${
                activeTopTab === tab 
                  ? 'bg-stone-900 dark:bg-rzc-gold text-white dark:text-black shadow-lg' 
                  : 'text-stone-400 dark:text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTopTab === 'Mining' && renderMiningContent()}
      {activeTopTab === 'Boost' && renderBoostContent()}
      {activeTopTab === 'Rank' && renderRankContent()}

      {activeTopTab === 'Mining' && (
        <div className="px-6 sm:px-8 pb-24 sm:pb-32 mt-auto relative z-20 shrink-0">
          <div className="relative group">
              {isSessionComplete ? (
                 <button 
                    onClick={startClaimWizard}
                    className="w-full bg-rzc-gold text-black h-14 sm:h-18 py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-bold uppercase text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.4em] shadow-2xl shadow-rzc-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 sm:gap-4 animate-pulse"
                 >
                    Claim Mined Assets <Icons.ChevronRight size={16} strokeWidth={3} />
                 </button>
              ) : (
                 <div className="relative h-14 sm:h-18 w-full bg-stone-900 dark:bg-rzc-gold/5 border border-stone-700 dark:border-rzc-gold/20 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-md">
                     <div 
                        className="absolute inset-0 bg-rzc-gold/20 dark:bg-rzc-gold/30 transition-all duration-1000 ease-linear"
                        style={{ width: `${sessionProgress}%` }}
                     ></div>
                     
                     <div className="relative h-full flex items-center justify-between px-6 sm:px-8">
                          <div className="flex items-center gap-2 sm:gap-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-rzc-gold animate-pulse"></div>
                              <span className="text-white text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.2em] uppercase">Farming Protocols</span>
                          </div>
                          <span className="text-rzc-gold font-mono font-bold text-xs sm:text-sm tracking-tight">{sessionString}</span>
                     </div>
                 </div>
              )}
          </div>
          
          <button 
              onClick={onOpenUpgrades}
              className="w-full mt-3 sm:mt-4 text-[8px] sm:text-[10px] text-stone-400 dark:text-gray-600 font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:text-rzc-gold transition-colors flex items-center justify-center gap-2 group"
          >
              <Icons.Chip size={12} className="group-hover:rotate-45 transition-transform" /> Access Upgrade Core
          </button>
        </div>
      )}

    </div>
  );
};