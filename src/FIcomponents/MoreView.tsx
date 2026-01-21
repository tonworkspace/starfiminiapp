import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Icons } from './Icons';

interface MoreViewProps {
  user: UserProfile;
}

export const MoreView: React.FC<MoreViewProps> = ({ user }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("8F392A"); 
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SettingItem = ({ icon: Icon, label, value, type = 'arrow', onClick, active }: any) => (
    <div 
        onClick={onClick}
        className="flex items-center justify-between p-5 bg-white dark:bg-rzc-dark border border-slate-100 dark:border-white/5 rounded-2xl mb-3 hover:border-rzc-gold/30 transition-all cursor-pointer group shadow-sm"
    >
        <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-500 group-hover:text-rzc-gold group-hover:bg-rzc-gold/10 transition-all">
                <Icon size={18} />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{label}</span>
        </div>

        {type === 'toggle' && (
            <div className={`w-11 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-rzc-gold' : 'bg-slate-200 dark:bg-gray-800'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-300 ${active ? 'left-6 bg-black shadow-md' : 'left-1 bg-white dark:bg-gray-600'}`}></div>
            </div>
        )}

        {type === 'arrow' && (
             <div className="flex items-center gap-3">
                 {value && <span className="text-[10px] text-slate-400 dark:text-gray-600 font-mono font-bold tracking-widest uppercase">{value}</span>}
                 <Icons.ChevronRight size={16} className="text-slate-300 dark:text-gray-700" />
             </div>
        )}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide bg-rzc-light-bg dark:bg-rzc-black transition-colors duration-300">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-8 dark:neon-text-gold">System Configuration</h1>

      {/* Profile Summary */}
      <div className="p-6 rounded-[2.5rem] bg-slate-900 dark:bg-rzc-dark border border-slate-700 dark:border-rzc-gold/20 mb-10 flex items-center gap-5 relative overflow-hidden shadow-2xl">
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-rzc-gold/5 to-transparent pointer-events-none"></div>
         
         {/* Avatar */}
         <div className="relative z-10">
            <div className="w-16 h-16 rounded-[1.2rem] bg-black border border-rzc-gold/40 flex items-center justify-center text-rzc-gold text-2xl font-bold shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                {user.avatarLetter}
            </div>
         </div>
         
         {/* User Info */}
         <div className="z-10 flex-1 min-w-0">
             <h2 className="text-lg font-bold text-white tracking-tight">{user.username}</h2>
             <div className="flex items-center gap-2 mt-1">
                <p className="text-[9px] text-gray-500 font-mono tracking-widest">UID: 8F3...92A</p>
                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                <p className="text-[9px] text-rzc-gold font-mono font-bold tracking-widest uppercase">{user.rank}</p>
             </div>
         </div>
         
         {/* Copy Button */}
         <div className="ml-auto z-10 flex-shrink-0">
             <button 
                onClick={handleCopy}
                className={`p-3 rounded-xl border transition-all duration-500 ${
                    copied 
                    ? 'bg-rzc-gold text-black border-rzc-gold shadow-[0_0_15px_rgba(251,191,36,0.4)]' 
                    : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
             >
                 {copied ? <Icons.Check size={16} strokeWidth={3} /> : <Icons.Copy size={16} />}
             </button>
         </div>
      </div>

      {/* General Settings */}
      <div className="mb-8">
          <h3 className="text-slate-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 ml-1">Terminal_Settings</h3>
          <SettingItem 
            icon={Icons.Globe} 
            label="Neural Link Language" 
            value="English (US)" 
          />
          <SettingItem 
            icon={Icons.Energy} 
            label="Audio Feedback" 
            type="toggle" 
            active={soundEnabled} 
            onClick={() => setSoundEnabled(!soundEnabled)} 
          />
           <SettingItem 
            icon={Icons.Game} 
            label="Haptic Response" 
            type="toggle" 
            active={hapticEnabled} 
            onClick={() => setHapticEnabled(!hapticEnabled)} 
          />
      </div>

      {/* Community */}
      <div className="mb-8">
          <h3 className="text-slate-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 ml-1">Imperial_Network</h3>
          <SettingItem icon={Icons.Telegram} label="Announcement Uplink" />
          <SettingItem icon={Icons.Users} label="Imperial Assembly Chat" />
          <SettingItem icon={Icons.Twitter} label="Broadcast on X" />
      </div>

       {/* Support */}
      <div className="mb-10">
          <h3 className="text-slate-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 ml-1">Imperial_Data</h3>
          <SettingItem icon={Icons.Mining} label="Whitepaper & Roadmap" />
          <SettingItem icon={Icons.Check} label="Sovereign Terms" />
      </div>

      <div className="text-center mt-auto pb-8">
          <p className="text-slate-300 dark:text-gray-800 text-[10px] font-mono tracking-widest uppercase">RhizaCore_Node_Imperial_V5</p>
          <div className="flex items-center justify-center gap-3 mt-3">
             <div className="w-1.5 h-1.5 rounded-full bg-rzc-gold animate-pulse shadow-[0_0_8px_#fbbf24]"></div>
             <p className="text-rzc-gold/60 text-[9px] font-bold tracking-[0.3em] uppercase">SYSTEM_OPERATIONAL</p>
          </div>
      </div>
    </div>
  );
};