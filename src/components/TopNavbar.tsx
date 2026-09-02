import React, { useState } from 'react';
import { Search, Globe, User, ChevronDown, Check, Sparkles, X, ShieldCheck, Zap } from 'lucide-react';

interface TopNavbarProps {
  onOpenSearch: () => void;
  activeNav?: string;
  onSelectNav?: (nav: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenSearch,
  activeNav = 'Markets',
  onSelectNav
}) => {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'get-started' | 'signin'>('get-started');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' }
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setUserRegistered(true);
      setTimeout(() => {
        setAuthModalOpen(false);
      }, 1200);
    }
  };

  return (
    <>
      <nav 
        className="bg-[#f9f9ff] border-b border-[#c3c5d8] w-full px-4 md:px-8 h-16 max-w-[1280px] mx-auto flex justify-between items-center sticky top-0 z-40"
        id="top-nav-bar"
      >
        {/* Left branding & search */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={() => onSelectNav && onSelectNav('Markets')} 
            className="text-[#181c23] flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
            id="brand-logo-btn"
            title="TradingView Markets"
          >
            <svg
              fill="none"
              height="28"
              viewBox="0 0 28 28"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#181c23]"
            >
              <path
                d="M14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0ZM14 25.2C7.81442 25.2 2.8 20.1856 2.8 14C2.8 7.81442 7.81442 2.8 14 2.8C20.1856 2.8 25.2 7.81442 25.2 14C25.2 20.1856 20.1856 25.2 14 25.2Z"
                fill="currentColor"
              />
              <path d="M19.6 8.4H8.4V11.2H19.6V8.4Z" fill="currentColor" />
              <path d="M15.4 12.6H12.6V19.6H15.4V12.6Z" fill="currentColor" />
            </svg>
          </button>

          {/* Search Pill Input */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center bg-[#f1f3fe] hover:bg-[#ebedf9] rounded-full px-4 py-2 border border-[#c3c5d8] w-56 lg:w-64 transition-all text-left cursor-pointer group shadow-2xs"
            id="search-trigger-btn"
          >
            <Search className="w-4 h-4 text-[#434656] mr-2 group-hover:text-[#0049db] transition-colors shrink-0" />
            <span className="text-sm font-normal text-[#434656] flex-1 truncate">
              Search (Ctrl+K)
            </span>
          </button>
        </div>

        {/* Center navigation links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-5 relative">
          <div className="relative">
            <button
              onClick={() => {
                setProductsMenuOpen(!productsMenuOpen);
                setMoreMenuOpen(false);
              }}
              className={`text-sm font-medium px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                productsMenuOpen ? 'text-[#181c23] bg-[#ebedf9]' : 'text-[#434656] hover:text-[#181c23] hover:bg-[#ebedf9]'
              }`}
            >
              Products
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {productsMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#c3c5d8] rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <a href="#supercharts" onClick={() => setProductsMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#f1f3fe] text-sm font-medium text-[#181c23]">
                  SuperCharts <span className="text-xs text-[#737687] block font-normal">Advanced multi-asset charting</span>
                </a>
                <a href="#screeners" onClick={() => setProductsMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#f1f3fe] text-sm font-medium text-[#181c23]">
                  Stock & Crypto Screeners <span className="text-xs text-[#737687] block font-normal">Real-time technical filters</span>
                </a>
                <a href="#heatmaps" onClick={() => setProductsMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#f1f3fe] text-sm font-medium text-[#181c23]">
                  Market Heatmaps <span className="text-xs text-[#737687] block font-normal">Visual sector performance</span>
                </a>
              </div>
            )}
          </div>

          <a
            href="#community"
            onClick={(e) => {
              e.preventDefault();
              onSelectNav && onSelectNav('Community');
            }}
            className={`text-sm font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeNav === 'Community' ? 'text-[#0049db] font-bold' : 'text-[#434656] hover:text-[#181c23] hover:bg-[#ebedf9]'
            }`}
          >
            Community
          </a>

          {/* Markets (Active) */}
          <a
            href="#markets"
            onClick={(e) => {
              e.preventDefault();
              onSelectNav && onSelectNav('Markets');
            }}
            className="text-[#0049db] text-sm font-bold border-b-2 border-[#0049db] pb-1 px-2.5 py-1 cursor-pointer"
          >
            Markets
          </a>

          <a
            href="#brokers"
            onClick={(e) => {
              e.preventDefault();
              onSelectNav && onSelectNav('Brokers');
            }}
            className={`text-sm font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeNav === 'Brokers' ? 'text-[#0049db] font-bold' : 'text-[#434656] hover:text-[#181c23] hover:bg-[#ebedf9]'
            }`}
          >
            Brokers
          </a>

          <div className="relative">
            <button
              onClick={() => {
                setMoreMenuOpen(!moreMenuOpen);
                setProductsMenuOpen(false);
              }}
              className={`text-sm font-medium px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                moreMenuOpen ? 'text-[#181c23] bg-[#ebedf9]' : 'text-[#434656] hover:text-[#181c23] hover:bg-[#ebedf9]'
              }`}
            >
              More
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {moreMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#c3c5d8] rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <a href="#pricing" onClick={() => setMoreMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#f1f3fe] text-sm font-medium text-[#181c23]">
                  Pricing Plans
                </a>
                <a href="#news" onClick={() => setMoreMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#f1f3fe] text-sm font-medium text-[#181c23]">
                  Economic Calendar
                </a>
                <a href="#desktop" onClick={() => setMoreMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#f1f3fe] text-sm font-medium text-[#181c23]">
                  Desktop & Mobile Apps
                </a>
                <div className="border-t border-[#e0e2ed] my-1" />
                <a href="#about" onClick={() => setMoreMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#f1f3fe] text-xs font-normal text-[#737687]">
                  About & Manifesto
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile search icon */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-[#181c23] hover:bg-[#ebedf9] rounded-full transition-colors cursor-pointer"
            id="mobile-search-btn"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-[#181c23] text-xs font-semibold hover:bg-[#ebedf9] px-2.5 py-1.5 rounded-full transition-colors cursor-pointer"
              id="language-btn"
            >
              <Globe className="w-4 h-4 text-[#434656]" />
              <span>{currentLang}</span>
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-[#c3c5d8] rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setCurrentLang(l.code);
                      setLangOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-[#181c23] hover:bg-[#f1f3fe] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <span>{l.name}</span>
                    {currentLang === l.code && <Check className="w-3.5 h-3.5 text-[#0049db]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User profile icon */}
          <button
            onClick={() => {
              setAuthMode('signin');
              setAuthModalOpen(true);
            }}
            className="text-[#181c23] hover:bg-[#ebedf9] p-2 rounded-full transition-colors cursor-pointer"
            id="profile-btn"
            title="User Profile"
          >
            <User className="w-5 h-5 text-[#181c23]" />
          </button>

          {/* Get Started Button */}
          <button
            onClick={() => {
              setAuthMode('get-started');
              setAuthModalOpen(true);
            }}
            className="bg-[#0049db] text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-[#2962ff] transition-all cursor-pointer shadow-xs active:scale-95"
            id="get-started-btn"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Interactive Get Started / Sign In Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-white border border-[#c3c5d8] rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            id="auth-modal-box"
          >
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#737687] hover:text-[#181c23] rounded-full hover:bg-[#ebedf9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {userRegistered ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-[#ebedf9] text-[#0049db] rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#181c23]">Welcome to Market Precision!</h3>
                <p className="text-sm text-[#5a5e6b]">
                  Your trading workspace is synchronized. Real-time streaming feeds are now active.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#0049db]">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">TradingView Precision</span>
                </div>
                <h3 className="text-2xl font-bold text-[#181c23]">
                  {authMode === 'get-started' ? 'Join 60M+ Traders Worldwide' : 'Sign in to your account'}
                </h3>
                <p className="text-sm text-[#5a5e6b] mt-1 mb-5">
                  Track custom watchlists, create real-time price alerts, and analyze global markets with low-latency charts.
                </p>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#181c23] uppercase tracking-wider mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 bg-[#f9f9ff] border border-[#c3c5d8] rounded-xl text-sm outline-none focus:border-[#0049db] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0049db] hover:bg-[#2962ff] text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Zap className="w-4 h-4" />
                    {authMode === 'get-started' ? 'Create Free Account' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'get-started' ? 'signin' : 'get-started')}
                    className="text-xs text-[#0049db] hover:underline font-semibold"
                  >
                    {authMode === 'get-started'
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Get started free"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
