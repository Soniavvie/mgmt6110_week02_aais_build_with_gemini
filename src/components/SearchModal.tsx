import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { StockItem, MarketIndex } from '../types';
import { CATEGORY_DATA } from '../data/marketData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (stock: StockItem) => void;
  onSelectIndex: (index: MarketIndex) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  onSelectIndex
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent or event
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Aggregate all searchable items
  const allStocks: StockItem[] = [];
  const allIndices: MarketIndex[] = [];

  Object.values(CATEGORY_DATA).forEach(cat => {
    cat.indices.forEach(idx => {
      if (!allIndices.some(existing => existing.symbol === idx.symbol)) {
        allIndices.push(idx);
      }
    });
    cat.featured.forEach(stk => {
      if (!allStocks.some(existing => existing.symbol === stk.symbol)) {
        allStocks.push(stk);
      }
    });
    cat.volumeTable.forEach(stk => {
      if (!allStocks.some(existing => existing.symbol === stk.symbol)) {
        allStocks.push(stk);
      }
    });
  });

  const q = query.trim().toLowerCase();
  const filteredIndices = q
    ? allIndices.filter(i => i.name.toLowerCase().includes(q) || i.symbol.toLowerCase().includes(q))
    : allIndices.slice(0, 4);

  const filteredStocks = q
    ? allStocks.filter(s => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q) || s.tag.toLowerCase().includes(q))
    : allStocks.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#ffffff] border border-[#c3c5d8] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="search-modal-container"
      >
        {/* Search header input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e0e2ed] gap-3 bg-[#f9f9ff]">
          <Search className="w-5 h-5 text-[#5a5e6b]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search instruments, symbols, indices (e.g. NVDA, S&P 500, Crypto)..."
            className="flex-1 bg-transparent text-[#181c23] text-base placeholder:text-[#737687] outline-none font-medium"
            id="search-modal-input"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-[#737687] hover:text-[#181c23] rounded-full hover:bg-[#ebedf9] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 bg-[#ebedf9] text-[#5a5e6b] rounded-md hover:bg-[#e0e2ed] transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search results body */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-3 space-y-4">
          {/* Indices group */}
          {filteredIndices.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#737687] tracking-wider uppercase px-2 mb-1.5">
                Market Indices
              </div>
              <div className="space-y-1">
                {filteredIndices.map(idx => (
                  <button
                    key={idx.id}
                    onClick={() => {
                      onSelectIndex(idx);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f3fe] transition-colors group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: idx.badgeColor }}
                      >
                        {idx.badgeNumber}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#181c23] group-hover:text-[#0049db] transition-colors">
                          {idx.name}
                        </div>
                        <div className="text-xs text-[#737687]">
                          {idx.symbol} · {idx.country || 'Global'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#181c23]">
                        {idx.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs font-bold flex items-center justify-end gap-0.5 ${idx.isPositive ? 'text-[#00A3D9]' : 'text-[#ba1a1a]'}`}>
                        {idx.isPositive ? '+' : ''}{idx.changePercent}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stocks & Instruments group */}
          {filteredStocks.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#737687] tracking-wider uppercase px-2 mb-1.5">
                Equities & Assets
              </div>
              <div className="space-y-1">
                {filteredStocks.map(stk => (
                  <button
                    key={stk.symbol}
                    onClick={() => {
                      onSelectStock(stk);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f3fe] transition-colors group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#ebedf9] text-[#0049db] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#2962ff] group-hover:text-white transition-colors">
                        {stk.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0049db] flex items-center gap-2">
                          {stk.symbol}
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#ebedf9] text-[#0049db]">
                            {stk.tag}
                          </span>
                        </div>
                        <div className="text-xs text-[#737687] truncate max-w-[220px]">
                          {stk.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#181c23]">
                        ${stk.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs font-bold flex items-center justify-end gap-0.5 ${stk.isPositive ? 'text-[#00A3D9]' : 'text-[#ba1a1a]'}`}>
                        {stk.isPositive ? '+' : ''}{stk.changePercent}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredIndices.length === 0 && filteredStocks.length === 0 && (
            <div className="py-12 text-center text-[#737687]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No instruments found matching "{query}"</p>
              <p className="text-xs mt-1">Try searching by ticker (AAPL, TSLA, BTC) or company name.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#f1f3fe] border-t border-[#e0e2ed] flex items-center justify-between text-xs text-[#737687]">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-white border border-[#c3c5d8] rounded text-[10px] font-bold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white border border-[#c3c5d8] rounded text-[10px] font-bold">K</kbd> anytime to search</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
