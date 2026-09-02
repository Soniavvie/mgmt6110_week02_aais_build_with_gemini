import React from 'react';
import { Star, X, Trash2, ArrowUpRight, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { StockItem, MarketIndex } from '../types';
import { CATEGORY_DATA } from '../data/marketData';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  onRemoveFromWatchlist: (symbol: string) => void;
  onSelectStock: (stock: StockItem) => void;
  onSelectIndex: (index: MarketIndex) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  onRemoveFromWatchlist,
  onSelectStock,
  onSelectIndex
}) => {
  if (!isOpen) return null;

  // Resolve watched items from full data catalog
  const allStocks: StockItem[] = [];
  const allIndices: MarketIndex[] = [];

  Object.values(CATEGORY_DATA).forEach((cat) => {
    cat.indices.forEach((idx) => {
      if (!allIndices.some((e) => e.symbol === idx.symbol)) allIndices.push(idx);
    });
    cat.featured.forEach((stk) => {
      if (!allStocks.some((e) => e.symbol === stk.symbol)) allStocks.push(stk);
    });
    cat.volumeTable.forEach((stk) => {
      if (!allStocks.some((e) => e.symbol === stk.symbol)) allStocks.push(stk);
    });
  });

  const watchedStocks = allStocks.filter((s) => watchlistSymbols.includes(s.symbol));
  const watchedIndices = allIndices.filter((i) => watchlistSymbols.includes(i.symbol));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white border-l border-[#c3c5d8] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
        id="watchlist-drawer-container"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e0e2ed] flex items-center justify-between bg-[#f9f9ff]">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-[#eab308] text-[#eab308]" />
            <h3 className="text-lg font-bold text-[#181c23]">My Watchlist</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#ebedf9] text-[#0049db] font-bold">
              {watchlistSymbols.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737687] hover:text-[#181c23] hover:bg-[#ebedf9] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {watchlistSymbols.length === 0 ? (
            <div className="py-16 text-center text-[#737687] space-y-2">
              <Star className="w-10 h-10 mx-auto text-[#c3c5d8]" />
              <p className="text-sm font-semibold text-[#181c23]">Your watchlist is empty</p>
              <p className="text-xs max-w-xs mx-auto">
                Click the star icon next to any stock, index, or cryptocurrency to pin it here for quick tracking.
              </p>
            </div>
          ) : (
            <>
              {watchedIndices.map((idx) => (
                <div
                  key={idx.id}
                  onClick={() => {
                    onSelectIndex(idx);
                    onClose();
                  }}
                  className="p-3.5 bg-[#f9f9ff] border border-[#c3c5d8] rounded-xl hover:bg-[#f1f3fe] transition-colors cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: idx.badgeColor }}
                    >
                      {idx.badgeNumber}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#181c23] group-hover:text-[#0049db] transition-colors">
                        {idx.name}
                      </div>
                      <div className="text-xs text-[#737687]">{idx.symbol}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#181c23] tabular-nums">
                        {idx.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs font-bold tabular-nums ${idx.isPositive ? 'text-[#00A3D9]' : 'text-[#ba1a1a]'}`}>
                        {idx.isPositive ? '+' : ''}{idx.changePercent}%
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(idx.symbol);
                      }}
                      className="p-1.5 text-[#c3c5d8] hover:text-[#ba1a1a] rounded-lg hover:bg-[#ebedf9] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {watchedStocks.map((stk) => (
                <div
                  key={stk.symbol}
                  onClick={() => {
                    onSelectStock(stk);
                    onClose();
                  }}
                  className="p-3.5 bg-[#f9f9ff] border border-[#c3c5d8] rounded-xl hover:bg-[#f1f3fe] transition-colors cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ebedf9] text-[#0049db] flex items-center justify-center font-bold text-xs">
                      {stk.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0049db] flex items-center gap-1.5">
                        <span>{stk.symbol}</span>
                        <span className="text-[10px] px-1 rounded bg-[#ebedf9] font-normal">{stk.tag}</span>
                      </div>
                      <div className="text-xs text-[#737687] truncate max-w-[130px]">{stk.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#181c23] tabular-nums">
                        ${stk.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs font-bold tabular-nums ${stk.isPositive ? 'text-[#00A3D9]' : 'text-[#ba1a1a]'}`}>
                        {stk.isPositive ? '+' : ''}{stk.changePercent}%
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(stk.symbol);
                      }}
                      className="p-1.5 text-[#c3c5d8] hover:text-[#ba1a1a] rounded-lg hover:bg-[#ebedf9] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f9f9ff] border-t border-[#e0e2ed] flex justify-between items-center text-xs text-[#737687]">
          <span>Synced locally in browser</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0049db] hover:bg-[#2962ff] text-white font-bold rounded-full transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
