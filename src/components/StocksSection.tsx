import React, { useState } from 'react';
import { ChevronRight, BarChart2, ExternalLink, ChevronLeft, ArrowUpDown, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { StockItem, MarketCategory } from '../types';
import { Sparkline } from './Sparkline';

interface StocksSectionProps {
  categoryTitle: MarketCategory;
  featuredStocks: StockItem[];
  volumeTableStocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  watchlistSymbols: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export const StocksSection: React.FC<StocksSectionProps> = ({
  categoryTitle,
  featuredStocks,
  volumeTableStocks,
  onSelectStock,
  watchlistSymbols,
  onToggleWatchlist
}) => {
  const [showAllRows, setShowAllRows] = useState(false);
  const [filterType, setFilterType] = useState<'volume' | 'gainers' | 'losers'>('volume');
  const [sortField, setSortField] = useState<'symbol' | 'price' | 'changePercent' | 'volume'>('volume');
  const [sortAsc, setSortAsc] = useState(false);

  // Scroll helper for cards
  const scrollCards = (direction: 'left' | 'right') => {
    const container = document.getElementById('featured-stocks-scroll');
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Sorting and filtering table data
  let tableData = [...volumeTableStocks];
  if (filterType === 'gainers') {
    tableData = tableData.filter((s) => s.isPositive).sort((a, b) => b.changePercent - a.changePercent);
  } else if (filterType === 'losers') {
    tableData = tableData.filter((s) => !s.isPositive).sort((a, b) => a.changePercent - b.changePercent);
  }

  tableData.sort((a, b) => {
    let factor = sortAsc ? 1 : -1;
    if (sortField === 'symbol') return a.symbol.localeCompare(b.symbol) * factor;
    if (sortField === 'price') return (a.price - b.price) * factor;
    if (sortField === 'changePercent') return (a.changePercent - b.changePercent) * factor;
    if (sortField === 'volume') return (a.volume - b.volume) * factor;
    return 0;
  });

  const displayedRows = showAllRows ? tableData : tableData.slice(0, 5);

  const handleSort = (field: 'symbol' | 'price' | 'changePercent' | 'volume') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <section className="mb-12" id="stocks-section">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 border-b border-[#c3c5d8] pb-2">
        <h2 className="text-2xl md:text-[32px] font-bold text-[#181c23] flex items-center gap-1 cursor-pointer hover:text-[#0049db] transition-colors group">
          <span>{categoryTitle}</span>
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-0.5 transition-transform" />
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollCards('left')}
            className="hidden sm:flex p-1.5 text-[#5a5e6b] hover:bg-[#ebedf9] rounded-full transition-colors cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollCards('right')}
            className="hidden sm:flex p-1.5 text-[#5a5e6b] hover:bg-[#ebedf9] rounded-full transition-colors cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAllRows(!showAllRows)}
            className="p-2 text-[#5a5e6b] hover:bg-[#ebedf9] rounded-full transition-colors cursor-pointer"
            title="Analytics view"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAllRows(!showAllRows)}
            className="p-2 text-[#5a5e6b] hover:bg-[#ebedf9] rounded-full transition-colors cursor-pointer"
            title="Expand / Full Table"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Data Cards (Glassmorphism & Crisp TradingView Card Style) */}
      <div
        id="featured-stocks-scroll"
        className="flex overflow-x-auto gap-5 pb-4 hide-scrollbar snap-x scroll-smooth -mx-2 px-2"
      >
        {featuredStocks.map((stk) => {
          const isStarred = watchlistSymbols.includes(stk.symbol);
          return (
            <div
              key={stk.symbol}
              onClick={() => onSelectStock(stk)}
              className="min-w-[280px] sm:min-w-[290px] snap-center bg-white border border-[#c3c5d8] rounded-xl p-4 hover:bg-[#f1f3fe]/70 hover:border-[#0049db]/40 transition-all shadow-2xs hover:shadow-md cursor-pointer group relative flex flex-col justify-between"
              id={`featured-card-${stk.symbol.toLowerCase()}`}
            >
              {/* Card top row */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-base md:text-lg text-[#181c23] group-hover:text-[#0049db] transition-colors flex items-center gap-1.5">
                    <span>{stk.name.split(' ')[0]}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(stk.symbol);
                      }}
                      className="text-[#c3c5d8] hover:text-[#eab308] p-0.5 rounded transition-colors"
                      title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#eab308] text-[#eab308]' : ''}`} />
                    </button>
                  </div>
                  <div className="text-[#434656] text-xs font-semibold">
                    {stk.exchange}
                  </div>
                </div>

                <span className="bg-[#2962ff] text-white px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide shadow-2xs">
                  {stk.tag}
                </span>
              </div>

              {/* Price & Sparkline */}
              <div className="my-2">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-base font-bold text-[#181c23] tabular-nums">
                    ${stk.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      stk.isPositive ? 'text-[#00A3D9]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {stk.isPositive ? '+' : ''}
                    {stk.changePercent}%
                  </span>
                </div>
                <Sparkline
                  data={stk.sparklineData}
                  isPositive={stk.isPositive}
                  height={38}
                  id={`feat-${stk.symbol}`}
                />
              </div>

              {/* Card footer details */}
              <div className="text-[11px] text-[#737687] flex justify-between items-center pt-2 border-t border-[#e0e2ed]/60">
                <span>Cap: {stk.marketCap}</span>
                <span className="text-[#0049db] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  Analyze <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dense Table Layout for Highest Volume Stocks */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-[#434656]">
              Highest volume stocks
            </h3>
            {/* Filter tags */}
            <div className="flex items-center bg-[#f1f3fe] p-0.5 rounded-lg border border-[#c3c5d8]">
              <button
                onClick={() => setFilterType('volume')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  filterType === 'volume' ? 'bg-white text-[#0049db] shadow-2xs' : 'text-[#5a5e6b] hover:text-[#181c23]'
                }`}
              >
                All Volume
              </button>
              <button
                onClick={() => setFilterType('gainers')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  filterType === 'gainers' ? 'bg-white text-[#00A3D9] shadow-2xs' : 'text-[#5a5e6b] hover:text-[#181c23]'
                }`}
              >
                Gainers
              </button>
              <button
                onClick={() => setFilterType('losers')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  filterType === 'losers' ? 'bg-white text-[#ba1a1a] shadow-2xs' : 'text-[#5a5e6b] hover:text-[#181c23]'
                }`}
              >
                Losers
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowAllRows(!showAllRows)}
            className="text-[#0049db] text-sm font-semibold hover:underline cursor-pointer self-start sm:self-auto"
            id="see-all-stocks-btn"
          >
            {showAllRows ? 'Show Less' : 'See all'}
          </button>
        </div>

        {/* High Precision Table */}
        <div className="w-full overflow-x-auto border border-[#c3c5d8] rounded-xl bg-white shadow-2xs">
          <table className="w-full text-left border-collapse" id="volume-stocks-table">
            <thead>
              <tr className="border-b border-[#c3c5d8] text-[11px] text-[#737687] uppercase font-semibold bg-[#f9f9ff]">
                <th
                  onClick={() => handleSort('symbol')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-[#181c23] select-none"
                >
                  <div className="flex items-center gap-1">
                    SYMBOL
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#181c23] select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    LAST
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#181c23] select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    CHG %
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('volume')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#181c23] select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    VOL
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 pr-4 text-center w-12 font-semibold">
                  WATCH
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#e0e2ed]">
              {displayedRows.map((stk) => {
                const isPositive = stk.isPositive;
                const isStarred = watchlistSymbols.includes(stk.symbol);

                return (
                  <tr
                    key={stk.symbol}
                    onClick={() => onSelectStock(stk)}
                    className="hover:bg-[#f1f3fe]/80 transition-colors cursor-pointer group"
                    id={`table-row-${stk.symbol.toLowerCase()}`}
                  >
                    {/* Symbol & Name */}
                    <td className="py-3.5 px-4 font-bold text-[#0049db] group-hover:underline">
                      <div className="flex items-center gap-2">
                        <span>{stk.symbol}</span>
                        <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-[#ebedf9] text-[#0049db] font-semibold">
                          {stk.tag}
                        </span>
                      </div>
                      <span className="text-[#5a5e6b] text-xs block font-normal truncate max-w-[200px] sm:max-w-xs">
                        {stk.name}
                      </span>
                    </td>

                    {/* Last Price */}
                    <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-[#181c23]">
                      {stk.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>

                    {/* Change % */}
                    <td
                      className={`py-3.5 px-4 text-right tabular-nums font-bold ${
                        isPositive ? 'text-[#00A3D9]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stk.changePercent.toFixed(2)}%
                    </td>

                    {/* Volume */}
                    <td className="py-3.5 px-4 text-right tabular-nums text-[#434656] font-medium">
                      {stk.volumeFormatted}
                    </td>

                    {/* Star Watchlist */}
                    <td
                      className="py-3.5 pr-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(stk.symbol);
                      }}
                    >
                      <button
                        className="p-1 rounded hover:bg-[#ebedf9] text-[#c3c5d8] hover:text-[#eab308] transition-colors"
                        title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star
                          className={`w-4 h-4 mx-auto ${
                            isStarred ? 'fill-[#eab308] text-[#eab308]' : ''
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
