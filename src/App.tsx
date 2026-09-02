import React, { useState, useEffect } from 'react';
import { MarketCategory, MarketIndex, StockItem, WorldIndexLink } from './types';
import { CATEGORY_DATA, WORLD_INDICES_LINKS } from './data/marketData';
import { TopNavbar } from './components/TopNavbar';
import { HeaderSection } from './components/HeaderSection';
import { CategoryPills } from './components/CategoryPills';
import { IndicesSection } from './components/IndicesSection';
import { StocksSection } from './components/StocksSection';
import { StockDetailModal } from './components/StockDetailModal';
import { SearchModal } from './components/SearchModal';
import { AllIndicesModal } from './components/AllIndicesModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';
import { Star, TrendingUp, Sparkles, Shield, Users, Award, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('US stocks');
  const [selectedRegion, setSelectedRegion] = useState<string>('everywhere');
  const [activeNav, setActiveNav] = useState<string>('Markets');
  
  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAllIndicesOpen, setIsAllIndicesOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | MarketIndex | null>(null);

  // Watchlist state with localStorage
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('precision_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'AAPL', 'SPX'];
    } catch {
      return ['NVDA', 'AAPL', 'SPX'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('precision_watchlist', JSON.stringify(watchlistSymbols));
    } catch {
      // Ignore localStorage errors
    }
  }, [watchlistSymbols]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const currentCategoryData = CATEGORY_DATA[activeCategory] || CATEGORY_DATA['US stocks'];

  const categories: MarketCategory[] = [
    'US stocks',
    'World stocks',
    'Crypto',
    'Futures',
    'Forex',
    'Government bonds',
    'Corporate bonds',
    'ETFs',
    'Economy'
  ];

  const handleSelectWorldLink = (link: WorldIndexLink) => {
    // Map link into a temporary MarketIndex object for the modal
    const matchedIndex: MarketIndex = {
      id: link.symbol.toLowerCase(),
      name: link.name,
      symbol: link.symbol,
      badgeNumber: link.symbol.slice(0, 3),
      badgeColor: link.isPositive ? '#00A3D9' : '#ba1a1a',
      currentPrice: link.price,
      changePercent: link.changePercent,
      changeValue: (link.price * link.changePercent) / 100,
      isPositive: link.isPositive,
      sparklineData: [
        link.price * 0.98,
        link.price * 0.99,
        link.price * 0.995,
        link.price * (link.isPositive ? 1.005 : 0.99),
        link.price
      ],
      country: link.region,
      currency: link.currency
    };
    setSelectedItem(matchedIndex);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#181c23] flex flex-col font-sans selection:bg-[#2962ff] selection:text-white" id="main-app-container">
      {/* Top Navbar */}
      <TopNavbar
        onOpenSearch={() => setIsSearchOpen(true)}
        activeNav={activeNav}
        onSelectNav={(nav) => setActiveNav(nav)}
      />

      {/* Main Content Area */}
      <main className="max-w-[1280px] w-full mx-auto px-4 md:px-8 py-10 flex-1">
        {activeNav === 'Markets' && (
          <>
            {/* Header Section */}
            <HeaderSection
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />

            {/* Category Pill Navigation */}
            <CategoryPills
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            {/* Floating Quick Watchlist Pill for mobile / desktop */}
            <div className="flex justify-end mb-4 -mt-6">
              <button
                onClick={() => setIsWatchlistOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#ebedf9] border border-[#c3c5d8] rounded-full text-xs font-semibold text-[#181c23] shadow-2xs transition-colors cursor-pointer"
                id="open-watchlist-btn"
              >
                <Star className="w-3.5 h-3.5 fill-[#eab308] text-[#eab308]" />
                <span>Watchlist ({watchlistSymbols.length})</span>
              </button>
            </div>

            {/* Indices Section */}
            <IndicesSection
              indices={currentCategoryData.indices}
              subLinksTitle={currentCategoryData.subLinksTitle}
              subLinks={currentCategoryData.subLinks}
              onSelectIndex={(idx) => setSelectedItem(idx)}
              onOpenAllIndices={() => setIsAllIndicesOpen(true)}
              onSelectWorldLink={handleSelectWorldLink}
            />

            {/* Assets / Stocks Section */}
            <StocksSection
              categoryTitle={activeCategory}
              featuredStocks={currentCategoryData.featured}
              volumeTableStocks={currentCategoryData.volumeTable}
              onSelectStock={(stk) => setSelectedItem(stk)}
              watchlistSymbols={watchlistSymbols}
              onToggleWatchlist={toggleWatchlist}
            />
          </>
        )}

        {/* Community Nav View */}
        {activeNav === 'Community' && (
          <div className="py-12 space-y-8 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebedf9] text-[#0049db] text-xs font-bold mb-3">
                <Users className="w-4 h-4" /> Global Trading Community
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#181c23]">
                Ideas, Analysis & Market Insights
              </h1>
              <p className="text-sm text-[#5a5e6b] mt-2">
                Learn from millions of top-performing traders publishing live chart setups and strategies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-[#c3c5d8] p-6 rounded-2xl shadow-xs">
                <div className="text-xs font-bold text-[#0049db] mb-1">STOCKS IDEA</div>
                <h3 className="text-lg font-bold text-[#181c23] mb-2">NVDA Breakout Confirmation into Q4</h3>
                <p className="text-xs text-[#5a5e6b] mb-4">
                  Symmetrical triangle continuation pattern confirmed on the 4H timeframe. Key support at $890.
                </p>
                <div className="flex items-center justify-between text-xs text-[#737687] pt-3 border-t border-[#e0e2ed]">
                  <span>by @AlphaTrader</span>
                  <span>1.4k likes</span>
                </div>
              </div>

              <div className="bg-white border border-[#c3c5d8] p-6 rounded-2xl shadow-xs">
                <div className="text-xs font-bold text-[#00A3D9] mb-1">CRYPTO SETUP</div>
                <h3 className="text-lg font-bold text-[#181c23] mb-2">Bitcoin Institutional Accumulation Range</h3>
                <p className="text-xs text-[#5a5e6b] mb-4">
                  On-chain metrics show strong wallet consolidation with funding rates resetting to neutral.
                </p>
                <div className="flex items-center justify-between text-xs text-[#737687] pt-3 border-t border-[#e0e2ed]">
                  <span>by @CryptoQuant_Pro</span>
                  <span>2.8k likes</span>
                </div>
              </div>

              <div className="bg-white border border-[#c3c5d8] p-6 rounded-2xl shadow-xs">
                <div className="text-xs font-bold text-[#ba1a1a] mb-1">MACRO FOREX</div>
                <h3 className="text-lg font-bold text-[#181c23] mb-2">EUR/USD Central Bank Rate Spread</h3>
                <p className="text-xs text-[#5a5e6b] mb-4">
                  Diverging ECB and Fed terminal rate projections testing multi-month trendline support at 1.0800.
                </p>
                <div className="flex items-center justify-between text-xs text-[#737687] pt-3 border-t border-[#e0e2ed]">
                  <span>by @MacroEdge</span>
                  <span>940 likes</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setActiveNav('Markets')}
                className="px-6 py-2.5 bg-[#0049db] hover:bg-[#2962ff] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                Back to Markets Overview
              </button>
            </div>
          </div>
        )}

        {/* Brokers Nav View */}
        {activeNav === 'Brokers' && (
          <div className="py-12 space-y-8 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebedf9] text-[#0049db] text-xs font-bold mb-3">
                <Shield className="w-4 h-4" /> Integrated Broker Partners
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#181c23]">
                Direct Trading Integration
              </h1>
              <p className="text-sm text-[#5a5e6b] mt-2">
                Execute live trades directly from the chart without switching applications. Fully regulated top-tier brokerages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Interactive Brokers', type: 'Global Multi-Asset', badge: 'Top Rated', fee: '$0 Commission US' },
                { name: 'TradeStation', type: 'Equities & Futures', badge: 'High Speed', fee: 'Ultra-low Latency' },
                { name: 'OANDA', type: 'Forex & CFDs', badge: 'Global Regulated', fee: 'Tight Spreads' },
                { name: 'Binance / Coinbase', type: 'Cryptocurrency Spot & Perps', badge: 'Deep Liquidity', fee: 'Tiered Volume' },
                { name: 'Saxo Bank', type: 'European & Global Multi-Asset', badge: 'VIP Access', fee: '70k+ Instruments' },
                { name: 'Tradovate', type: 'Futures Specialist', badge: 'CME Verified', fee: 'Micro Contracts' }
              ].map((b) => (
                <div key={b.name} className="bg-white border border-[#c3c5d8] p-5 rounded-2xl shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-base text-[#181c23]">{b.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ebedf9] text-[#0049db]">
                        {b.badge}
                      </span>
                    </div>
                    <div className="text-xs text-[#5a5e6b]">{b.type}</div>
                    <div className="text-xs font-semibold text-[#181c23] mt-2 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#00A3D9]" />
                      {b.fee}
                    </div>
                  </div>

                  <button className="mt-4 w-full py-2 bg-[#f1f3fe] hover:bg-[#0049db] text-[#0049db] hover:text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer">
                    Connect Account
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setActiveNav('Markets')}
                className="px-6 py-2.5 bg-[#0049db] hover:bg-[#2962ff] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                Back to Markets Overview
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStock={(stk) => setSelectedItem(stk)}
        onSelectIndex={(idx) => setSelectedItem(idx)}
      />

      <StockDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isStarred={selectedItem ? watchlistSymbols.includes(selectedItem.symbol) : false}
        onToggleStar={toggleWatchlist}
      />

      <AllIndicesModal
        isOpen={isAllIndicesOpen}
        onClose={() => setIsAllIndicesOpen(false)}
        onSelectIndexLink={handleSelectWorldLink}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlistSymbols}
        onRemoveFromWatchlist={toggleWatchlist}
        onSelectStock={(stk) => setSelectedItem(stk)}
        onSelectIndex={(idx) => setSelectedItem(idx)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
