import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { Icons } from './Icons';

interface TaskViewProps {
  onClaimReward: (amount: number) => void;
}

type FilterType = 'all' | 'social' | 'partner' | 'daily';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Imperial Assembly', reward: 5000, icon: 'Telegram', category: 'social', status: 'pending', link: '#' },
  { id: '2', title: 'Solar Feed (X)', reward: 2500, icon: 'Twitter', category: 'social', status: 'pending', link: '#' },
  { id: '3', title: 'Broadcast Uplink', reward: 2500, icon: 'Youtube', category: 'social', status: 'pending', link: '#' },
  { id: '4', title: 'Recruit Lieutenants', reward: 15000, icon: 'Users', category: 'social', status: 'pending', link: '#' },
  { id: '5', title: 'Solar Gaming Lab', reward: 10000, icon: 'Game', category: 'partner', status: 'pending', link: '#' },
  { id: '6', title: 'Daily Pulse Check', reward: 1000, icon: 'Energy', category: 'daily', status: 'ready_to_claim', link: '#' },
  { id: '7', title: 'Circuit Maintenance', reward: 3000, icon: 'Chip', category: 'daily', status: 'pending', link: '#' },
];

export const TaskView: React.FC<TaskViewProps> = ({ onClaimReward }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const completedCount = useMemo(() => tasks.filter(t => t.status === 'completed').length, [tasks]);
  const totalTasks = tasks.length;
  const quotaProgress = (completedCount / totalTasks) * 100;

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') return tasks;
    return tasks.filter(t => t.category === activeFilter);
  }, [tasks, activeFilter]);

  const handleTaskAction = (task: Task) => {
    if (task.status === 'completed') return;
    if (task.status === 'pending') {
      window.open(task.link || '#', '_blank');
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'ready_to_claim' } : t));
    } else if (task.status === 'ready_to_claim') {
      setClaimingId(task.id);
      setTimeout(() => {
        onClaimReward(task.reward);
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
        setClaimingId(null);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full w-full px-5 pt-6 pb-32 overflow-y-auto scrollbar-hide bg-rzc-light-bg dark:bg-rzc-black transition-colors duration-500">
      
      {/* HEADER & QUOTA */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">Imperial Edicts</h1>
                <p className="text-stone-400 dark:text-gray-500 text-[9px] font-mono uppercase tracking-widest mt-0.5">Neural_Task_Interface</p>
            </div>
            <div className="text-right">
                <div className="text-[9px] font-mono font-bold text-rzc-gold tracking-widest mb-1.5 uppercase">Quota_Progress</div>
                <div className="flex items-center gap-2">
                   <div className="w-24 h-1.5 bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
                       <div 
                          className="h-full bg-rzc-gold transition-all duration-1000 shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
                          style={{ width: `${quotaProgress}%` }}
                       ></div>
                   </div>
                   <span className="text-[9px] font-mono font-bold text-stone-900 dark:text-white">{completedCount}/{totalTasks}</span>
                </div>
            </div>
        </div>

        {/* TABS / FILTERS */}
        <div className="flex gap-2 p-1 bg-stone-100/50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/5">
            {(['all', 'social', 'daily', 'partner'] as FilterType[]).map((filter) => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`
                        flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all
                        ${activeFilter === filter 
                            ? 'bg-white dark:bg-rzc-dark text-stone-900 dark:text-rzc-gold shadow-sm border border-stone-200 dark:border-white/10' 
                            : 'text-stone-400 dark:text-gray-600 hover:text-stone-600 dark:hover:text-gray-400'
                        }
                    `}
                >
                    {filter}
                </button>
            ))}
        </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center mb-1 px-1">
          <h2 className="text-stone-400 dark:text-gray-600 text-[8px] font-bold uppercase tracking-[0.4em]">Available_Directives</h2>
          <span className="text-stone-300 dark:text-gray-800 text-[7px] font-mono">PRIORITY_SORTED</span>
        </div>

        {filteredTasks.length > 0 ? filteredTasks.map((task, idx) => {
            const Icon = Icons[task.icon] || Icons.Mining;
            const isCompleted = task.status === 'completed';
            const isClaiming = claimingId === task.id;
            const isReady = task.status === 'ready_to_claim';
            
            return (
                <div 
                    key={task.id} 
                    className={`
                        animate-in slide-in-from-bottom-2 duration-500 stagger-${(idx % 4) + 1}
                        flex items-center justify-between p-3.5 rounded-[1.8rem] border transition-all duration-300
                        ${isCompleted 
                            ? 'bg-stone-50/50 dark:bg-rzc-dark/40 border-transparent opacity-40' 
                            : 'bg-rzc-light-card dark:bg-rzc-dark border-stone-200 dark:border-white/5 hover:border-rzc-gold/20'
                        }
                    `}
                >
                    <div className="flex items-center gap-3.5">
                        <div className={`
                            w-11 h-11 rounded-2xl flex items-center justify-center transition-all
                            ${isReady 
                                ? 'bg-rzc-gold text-black shadow-lg animate-plasma-pulse' 
                                : 'bg-stone-100 dark:bg-white/5 text-stone-500 dark:text-gray-400'
                            }
                        `}>
                            {isCompleted ? <Icons.Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-stone-900 dark:text-white text-[13px] font-bold tracking-tight mb-1">{task.title}</span>
                            <div className="flex items-center gap-1.5">
                                <div className="px-1.5 py-0.5 rounded bg-rzc-gold/10 border border-rzc-gold/10">
                                    <span className="text-rzc-gold font-mono text-[9px] font-bold">+{task.reward.toLocaleString()}</span>
                                </div>
                                <span className="text-stone-400 dark:text-gray-600 text-[8px] font-mono uppercase font-bold tracking-tighter">Imperial_Credit</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleTaskAction(task)} 
                        disabled={isCompleted || isClaiming} 
                        className={`
                            h-10 min-w-[76px] rounded-xl text-[9px] font-bold transition-all uppercase tracking-widest
                            ${isCompleted 
                                ? 'bg-transparent text-stone-300' 
                                : isReady 
                                    ? 'bg-stone-900 dark:bg-rzc-gold text-white dark:text-black shadow-md scale-105' 
                                    : 'bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-white hover:bg-rzc-gold hover:text-black active:scale-95'
                            }
                        `}
                    >
                        {isClaiming ? (
                            <Icons.Refresh className="animate-spin mx-auto" size={14} />
                        ) : isCompleted ? (
                            'Done'
                        ) : isReady ? (
                            'Claim'
                        ) : (
                            'Start'
                        )}
                    </button>
                </div>
            );
        }) : (
            <div className="py-20 text-center flex flex-col items-center opacity-30">
                <Icons.Lock size={32} className="mb-4 text-stone-300 dark:text-gray-700" />
                <p className="text-[10px] font-mono uppercase tracking-[0.2em]">No_Edicts_In_Category</p>
            </div>
        )}
      </div>

      <div className="mt-10 p-6 rounded-[2rem] border border-dashed border-stone-200 dark:border-rzc-gold/10 text-center">
          <p className="text-[9px] text-stone-400 dark:text-gray-600 font-mono tracking-widest leading-relaxed uppercase">
            System_Advisory: Protocols_Refresh_Daily_00:00_UTC
          </p>
      </div>
    </div>
  );
};