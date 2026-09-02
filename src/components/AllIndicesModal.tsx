import React, { useState } from 'react';
import { X, Search, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { WorldIndexLink, MarketIndex } from '../types';
import { WORLD_INDICES_LINKS, TOP_INDICES } from '../data/marketData';

interface AllIndicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndexLink: (link: WorldIndexLink) => void;
}

export const AllIndicesModal: React.FC<AllIndicesModalProps> = ({
  isOpen,
  onClose,
  onSelectIndexLink
}) => {
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const regions = ['All', 'Americas', 'Europe', 'Asia', 'Asia-Pacific', 'Global'];

  const allWorldIndices: WorldIndexLink[] = [
    ...WORLD_INDICES_LINKS,
    { symbol: 'SPX', name: 'S&P 500 Index', region: 'Americas', price: 5864.67, changePercent: -0.24, isPositive: false, currency: 'USD' },
    { symbol: 'NDX', name: 'Nasdaq 100 Index', region: 'Americas', price: 20412.30, changePercent: 0.88, isPositive: true, currency: 'USD' },
    { symbol: 'DJI', name: 'Dow Jones Industrial 30', region: 'Americas', price: 43210.15, changePercent: 0.35, isPositive: true, currency: 'USD' },
    { symbol: 'RUT', name: 'Russell 2000 Index', region: 'Americas', price: 2240.10, changePercent: 0.45, isPositive: true, currency: 'USD' },
    { symbol: 'VIX', name: 'CBOE Volatility Index', region: 'Americas', price: 18.25, changePercent: -2.15, isPositive: false, currency: 'Points' },
    { symbol: 'STOXX50', name: 'EURO STOXX 50', region: 'Europe', price: 4940.20, changePercent: 0.38, isPositive: true, currency: 'EUR' },
    { symbol: 'AEX', name: 'Amsterdam Exchange Index', region: 'Europe', price: 902.40, changePercent: 0.15, isPositive: true, currency: 'EUR' },
    { symbol: 'BEL20', name: 'BEL 20 Index Brussels', region: 'Europe', price: 4210.80, changePercent: -0.12, isPositive: false, currency: 'EUR' },
    { symbol: 'KOSPI', name: 'Korea Composite Stock', region: 'Asia', price: 2595.60, changePercent: 1.15, isPositive: true, currency: 'KRW' },
    { symbol: 'TAIEX', name: 'Taiwan Capitalization Weighted', region: 'Asia', price: 23480.20, changePercent: 1.84, isPositive: true, currency: 'TWD' },
    { symbol: 'SSEC', name: 'Shanghai Composite Index', region: 'Asia', price: 3280.10, changePercent: 0.52, isPositive: true, currency: 'CNY' },
    { symbol: 'NZ50', name: 'S&P/NZX 50 Index', region: 'Asia-Pacific', price: 12820.40, changePercent: 0.22, isPositive: true, currency: 'NZD' }
  ];

  const filtered = allWorldIndices.filter((idx) => {
    const matchesRegion = regionFilter === 'All' || idx.region === regionFilter;
    const matchesQuery =
      idx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idx.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white border border-[#c3c5d8] rounded-2xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="all-indices-modal-container"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e0e2ed] flex items-center justify-between bg-[#f9f9ff]">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#0049db]" />
            <h3 className="text-xl font-bold text-[#181c23]">Global Major Indices Matrix</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737687] hover:text-[#181c23] hover:bg-[#ebedf9] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-[#e0e2ed] bg-[#ffffff] flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#737687] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search index by symbol or name..."
              className="w-full pl-9 pr-4 py-2 bg-[#f9f9ff] border border-[#c3c5d8] rounded-full text-xs outline-none focus:border-[#0049db]"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar w-full sm:w-auto">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  regionFilter === reg
                    ? 'bg-[#5a5e6b] text-white'
                    : 'bg-[#f1f3fe] text-[#181c23] hover:bg-[#ebedf9]'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Index Table List */}
        <div className="overflow-y-auto custom-scrollbar p-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((item) => (
              <div
                key={item.symbol}
                onClick={() => {
                  onSelectIndexLink(item);
                  onClose();
                }}
                className="p-4 bg-[#f9f9ff] border border-[#c3c5d8] rounded-xl hover:bg-[#f1f3fe] hover:border-[#0049db] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-bold text-[#0049db] group-hover:underline">
                      {item.symbol}
                    </span>
                    <span className="text-xs text-[#181c23] block font-semibold truncate max-w-[180px]">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#737687]">{item.region}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-[#181c23] block tabular-nums">
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-xs font-bold tabular-nums inline-flex items-center gap-0.5 ${
                        item.isPositive ? 'text-[#00A3D9]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {item.isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f9f9ff] border-t border-[#e0e2ed] flex justify-between items-center text-xs text-[#737687]">
          <span>Showing {filtered.length} major global indices</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0049db] text-white font-semibold rounded-full hover:bg-[#2962ff] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
