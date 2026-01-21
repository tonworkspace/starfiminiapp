import React, { useState, useEffect } from 'react';
import { Header } from '@/FIcomponents/Header';
import { BottomNav } from '@/FIcomponents/BottomNav';
import { MiningDashboard } from '@/FIcomponents/MiningDashboard';
import { WalletView } from '@/FIcomponents/WalletView';
import { TaskView } from '@/FIcomponents/TaskView';
import { CoreView } from '@/FIcomponents/CoreView';
import { FriendsView } from '@/FIcomponents/FriendsView';
import { MoreView } from '@/FIcomponents/MoreView';
import { Onboarding } from '@/FIcomponents/Onboarding';
import { MiningState, UserProfile, BottomTab, TopTab, NetworkType, ThemeMode } from '@/types';

// Initial Mock Data
const INITIAL_USER: UserProfile = {
  username: 'aurum_node',
  tag: 'Gilded Miner',
  avatarLetter: 'A',
  rank: 'Imperial'
};

const INITIAL_STATE: MiningState = {
  balance: 1250,
  miningRatePerHour: 260.42,
  sessionStartTime: Date.now() - (23 * 60 * 60 * 1000 + 58 * 60 * 1000), 
  isMining: true,
  validatedBalance: 1036.73,
  miningBalance: 89496.81,
  isWalletActivated: false,
  isAirdropClaimed: false,
  network: 'Rhiza Mainnet'
};

const IndexPage: React.FC = () => {
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTab>('Mining');
  const [activeTopTab, setActiveTopTab] = useState<TopTab>('Mining');
  const [miningState, setMiningState] = useState<MiningState>(INITIAL_STATE);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  
  const [isCoreOverlay, setIsCoreOverlay] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleClaimReward = (amount: number) => {
    setMiningState(prev => ({
      ...prev,
      miningBalance: prev.miningBalance + amount
    }));
  };

  const handleUpdateBalance = (amount: number) => {
    setMiningState(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
  };

  const handleActivateWallet = (unlockedBonus: number, purchaseAmount: number) => {
    setMiningState(prev => ({
      ...prev,
      isWalletActivated: true,
      balance: prev.balance + unlockedBonus + purchaseAmount,
      miningBalance: prev.miningBalance - unlockedBonus
    }));
  };

  const handleClaimAirdrop = (liquidAmount: number, lockedAmount: number) => {
    setMiningState(prev => ({
      ...prev,
      balance: prev.balance + liquidAmount,
      miningBalance: 0, 
      validatedBalance: prev.validatedBalance + lockedAmount,
      isAirdropClaimed: true
    }));
  };

  const handleClaimMinedTokens = (totalMined: number) => {
    const liquid = totalMined * 0.3;
    const locked = totalMined * 0.7;
    
    setMiningState(prev => ({
      ...prev,
      balance: prev.balance + liquid,
      miningBalance: 0, 
      validatedBalance: prev.validatedBalance + locked,
      sessionStartTime: Date.now() 
    }));
  };

  const handleNetworkChange = (network: NetworkType) => {
    setMiningState(prev => ({ ...prev, network }));
  };

  const handlePurchase = (cost: number, type: string): boolean => {
    if (miningState.balance >= cost) {
      setMiningState(prev => {
        let newRate = prev.miningRatePerHour;
        if (type === 'upgrade') {
          newRate += 50;
        } else if (type === 'nft') {
          newRate += 500;
        }
        
        return {
          ...prev,
          balance: prev.balance - cost,
          miningRatePerHour: newRate
        };
      });
      return true;
    }
    return false;
  };

  const renderContent = () => {
    if (isCoreOverlay) {
      return (
        <div className="h-full relative overflow-hidden bg-rzc-light-bg dark:bg-rzc-black">
          <button 
            onClick={() => setIsCoreOverlay(false)}
            className="absolute top-4 right-4 z-50 text-rzc-gold hover:text-white font-mono text-[9px] sm:text-[10px] bg-rzc-gold/10 border border-rzc-gold/20 px-3 py-1.5 rounded-full backdrop-blur-md transition-all active:scale-95"
          >
            [EXIT_MAINFRAME]
          </button>
          <CoreView state={miningState} onPurchase={handlePurchase} />
        </div>
      );
    }

    switch (activeBottomTab) {
      case 'Mining':
        return (
          <MiningDashboard 
            state={miningState} 
            activeTopTab={activeTopTab}
            onTabChange={setActiveTopTab}
            onOpenUpgrades={() => setIsCoreOverlay(true)}
            onClaim={handleClaimMinedTokens}
          />
        );
      case 'Task':
        return (
          <TaskView onClaimReward={handleClaimReward} />
        );
      case 'Friends':
        return (
          <FriendsView />
        );
      case 'Wallet':
        return (
            <WalletView 
              state={miningState} 
              onActivate={handleActivateWallet} 
              onUpdateBalance={handleUpdateBalance} 
              onClaimAirdrop={handleClaimAirdrop}
            />
        );
      case 'More':
        return (
            <MoreView user={INITIAL_USER} />
        );
      default:
        return null;
    }
  };

  const handleTabChange = (tab: BottomTab) => {
    setIsCoreOverlay(false);
    setActiveBottomTab(tab);
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#020202] sm:py-6 lg:py-10 transition-colors duration-500 overflow-hidden">
      {/* Desktop Background Decorations */}
      <div className="hidden lg:block absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] border border-rzc-gold/20 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] border border-rzc-gold/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      </div>

      <div className="w-full max-w-md h-[100dvh] sm:h-[800px] sm:rounded-[3rem] bg-rzc-light-bg dark:bg-rzc-black relative shadow-2xl overflow-hidden flex flex-col transition-all duration-500 border-x border-slate-200 dark:border-rzc-gold/10 sm:border-y">
        
        {/* BACKGROUND LAYERS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-5%] left-[-15%] w-80 h-80 bg-rzc-gold/10 dark:bg-rzc-gold/5 rounded-full blur-[100px] animate-blob transition-colors duration-700"></div>
          <div className="absolute bottom-[10%] right-[-15%] w-96 h-96 bg-rzc-bronze/10 dark:bg-rzc-bronze/5 rounded-full blur-[110px] animate-blob [animation-delay:3s] transition-colors duration-700"></div>
          
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
               style={{ 
                 backgroundImage: theme === 'dark' 
                   ? 'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)'
                   : 'radial-gradient(#fbbf24 1px, transparent 1px)', 
                 backgroundSize: '60px 60px' 
               }}>
          </div>

          {theme === 'dark' && (
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="w-full h-[200%] bg-gradient-to-b from-transparent via-rzc-gold/[0.02] to-transparent animate-scanline"></div>
            </div>
          )}
        </div>

        {showOnboarding ? (
          <Onboarding onComplete={() => setShowOnboarding(false)} />
        ) : (
          <>
            <Header 
              user={INITIAL_USER} 
              currentNetwork={miningState.network} 
              onNetworkChange={handleNetworkChange} 
              theme={theme}
              onThemeToggle={toggleTheme}
            />
            
            <main className="flex-1 overflow-hidden relative z-10 safe-pb">
              {renderContent()}
            </main>
            
            <BottomNav activeTab={activeBottomTab} onTabChange={handleTabChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default IndexPage;