export type TabView = 'wallet' | 'swap' | 'earn' | 'profile';

export type BottomTab = 'Mining' | 'Task' | 'Friends' | 'Wallet' | 'More';

export type ChainType = 'ton' | 'ethereum' | 'solana';

export interface ChainInfo {
  id: ChainType;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  connected: boolean;
  balance: string;
  usdValue: number;
  address?: string;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  change24h: number;
  icon?: string;
  chain: ChainType;
  verified: boolean;
}

export interface WalletState {
  address: string | null;
  totalBalanceUsd: number;
  isConnected: boolean;
  chain: ChainType;
}



import { Icons } from "./FIcomponents/Icons";

export type TopTab = 'Mining' | 'Boost' | 'Rank';
export type NetworkType = 'Rhiza Mainnet' | 'TON Mainnet' | 'Devnet';
export type ThemeMode = 'light' | 'dark';

export interface MiningState {
  balance: number;
  miningRatePerHour: number;
  sessionStartTime: number; // Timestamp
  isMining: boolean;
  validatedBalance: number;
  miningBalance: number;
  isWalletActivated: boolean;
  isAirdropClaimed: boolean;
  network: NetworkType;
}

export interface UserProfile {
  username: string;
  tag: string;
  avatarLetter: string;
  rank: string;
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  icon: keyof typeof Icons;
  category: 'social' | 'partner' | 'daily';
  status: 'pending' | 'ready_to_claim' | 'completed';
  link?: string;
}

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  earnings: number;
  status: 'active' | 'idle';
}