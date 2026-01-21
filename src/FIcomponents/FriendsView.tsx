import React, { useState } from 'react';
import { Icons } from './Icons';
import { Friend } from '../types';

const MOCK_FRIENDS: Friend[] = [
  { id: '1', username: 'crypto_junkie', avatar: 'C', earnings: 1250.50, status: 'active' },
  { id: '2', username: 'neo_miner', avatar: 'N', earnings: 840.20, status: 'active' },
  { id: '3', username: 'pixel_drifter', avatar: 'P', earnings: 120.00, status: 'idle' },
  { id: '4', username: 'void_walker', avatar: 'V', earnings: 0, status: 'idle' },
];

export const FriendsView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://t.me/rhizacore_bot?startapp=ref_8F392A";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide bg-rzc-light-bg dark:bg-rzc-black transition-colors duration-300">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 dark:neon-text-gold">Network Expansion</h1>
      <p className="text-slate-400 dark:text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] mb-8 leading-relaxed">
        Earn <span className="text-rzc-gold font-bold">10%</span> of all RZC mined by your direct invites.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-rzc-dark border border-slate-200 dark:border-white/5 rounded-[1.8rem] p-5 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-[9px] text-slate-400 dark:text-gray-600 font-bold uppercase tracking-widest mb-1">Total Nodes</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">12</span>
          </div>
          <div className="bg-white dark:bg-rzc-dark border border-slate-200 dark:border-white/5 rounded-[1.8rem] p-5 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-[9px] text-slate-400 dark:text-gray-600 font-bold uppercase tracking-widest mb-1">Gilded Bonus</span>
              <span className="text-xl font-bold text-rzc-gold-dim dark:text-rzc-gold font-mono">2,210.7</span>
          </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-slate-900 dark:bg-gradient-to-br dark:from-rzc-dark dark:to-black border border-slate-700 dark:border-rzc-gold/20 rounded-[2.5rem] p-7 mb-8 relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-rzc-gold/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-rzc-gold/10 transition-colors"></div>
         
         <div className="relative z-10">
             <h3 className="text-white text-xs font-bold mb-4 flex items-center gap-3 uppercase tracking-widest">
                 <Icons.Users size={16} className="text-rzc-gold" />
                 Invitation Key
             </h3>
             
             <div className="flex gap-2">
                <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 flex items-center overflow-hidden">
                    <span className="text-gray-400 text-[9px] font-mono truncate">{referralLink}</span>
                </div>
                <button 
                    onClick={handleCopy}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                        copied 
                        ? 'bg-rzc-gold text-black border-rzc-gold' 
                        : 'bg-white/5 text-rzc-gold border-white/10 hover:bg-white/10'
                    }`}
                >
                    {copied ? <Icons.Check size={18} strokeWidth={3} /> : <Icons.Copy size={18} />}
                </button>
             </div>
             
             <button className="w-full mt-6 py-4 bg-rzc-gold text-black rounded-2xl text-[10px] font-bold tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-rzc-gold/20">
                 RECRUIT LIEUTENANT
             </button>
         </div>
      </div>

      {/* Friends List */}
      <div className="flex-1">
          <div className="flex justify-between items-center mb-6 px-1">
              <h3 className="text-slate-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.4em]">Active_Subnodes</h3>
              <span className="text-[9px] text-slate-300 dark:text-gray-800 font-mono">LATEST_SYNC</span>
          </div>

          <div className="space-y-4">
              {MOCK_FRIENDS.map((friend) => (
                  <div key={friend.id} className="bg-white dark:bg-rzc-dark border border-slate-100 dark:border-white/5 rounded-[1.8rem] p-5 flex items-center justify-between hover:border-rzc-gold/30 transition-all group shadow-sm">
                      <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-[1rem] border flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-105 ${
                              friend.status === 'active' ? 'border-rzc-gold/30 bg-rzc-gold/5 text-rzc-gold' : 'border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 text-slate-300 dark:text-gray-600'
                          }`}>
                              {friend.avatar}
                          </div>
                          <div>
                              <div className="flex items-center gap-2">
                                  <span className="text-slate-900 dark:text-white text-sm font-bold tracking-tight">{friend.username}</span>
                                  {friend.status === 'active' && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-rzc-gold animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
                                  )}
                              </div>
                              <span className="text-[9px] text-slate-400 dark:text-gray-500 font-mono uppercase tracking-widest">Imperial Node</span>
                          </div>
                      </div>
                      
                      <div className="text-right">
                          <div className="text-rzc-gold-dim dark:text-rzc-gold text-xs font-mono font-bold">+{friend.earnings.toFixed(1)}</div>
                          <div className="text-[8px] text-slate-300 dark:text-gray-700 uppercase tracking-tighter">Harvested</div>
                      </div>
                  </div>
              ))}
          </div>

          <div className="mt-8 p-6 rounded-3xl bg-slate-50 dark:bg-rzc-gold/5 border border-dashed border-slate-200 dark:border-rzc-gold/20 text-center">
              <p className="text-[10px] text-slate-400 dark:text-gray-600 italic font-medium leading-relaxed">"Refer more nodes to climb the global leaderboard and unlock exclusive Imperial validator roles."</p>
          </div>
      </div>
    </div>
  );
};