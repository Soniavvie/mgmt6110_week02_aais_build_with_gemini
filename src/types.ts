export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export interface SparklinePoint {
  time: string;
  value: number;
}

export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  badgeNumber: string;
  badgeColor: string; // e.g. '#ba1a1a' for red, '#00A3D9' for cyan
  badgeTextColor?: string;
  currentPrice: number;
  changePercent: number;
  changeValue: number;
  isPositive: boolean;
  sparklineData: number[];
  currency?: string;
  country?: string;
  description?: string;
  high52?: number;
  low52?: number;
  volume?: string;
  category?: string;
}

export interface WorldIndexLink {
  symbol: string;
  name: string;
  region: string;
  countryCode?: string;
  price: number;
  changePercent: number;
  isPositive: boolean;
  currency: string;
}

export interface StockItem {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  changePercent: number;
  changeValue: number;
  isPositive: boolean;
  volume: number;
  volumeFormatted: string;
  marketCap: string;
  sector: string;
  tag: string;
  tagType?: 'Tech' | 'Retail' | 'Finance' | 'Healthcare' | 'Energy' | 'Auto' | 'Crypto' | 'Telecom' | 'Commodity';
  sparklineData: number[];
  candleData?: { time: string; open: number; high: number; low: number; close: number; volume: number }[];
  peRatio?: number;
  high52?: number;
  low52?: number;
  open?: number;
  prevClose?: number;
  dividendYield?: string;
  avgVolume?: string;
  category: MarketCategory;
}

export interface FinancialNews {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  url?: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  relatedSymbols: string[];
}
