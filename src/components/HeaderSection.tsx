import React, { useState } from 'react';
import { ChevronDown, Check, Globe, MapPin } from 'lucide-react';

interface HeaderSectionProps {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  selectedRegion,
  onSelectRegion
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const regions = [
    { id: 'everywhere', label: 'everywhere', description: 'Global aggregate view across all liquid asset classes' },
    { id: 'us', label: 'in United States', description: 'NYSE, NASDAQ, CME, US Treasuries & Macro' },
    { id: 'europe', label: 'in Europe', description: 'Euronext, LSE, Deutsche Börse, Sovereign Bunds' },
    { id: 'asia', label: 'in Asia-Pacific', description: 'Tokyo, Hong Kong, Shanghai, Mumbai & Sydney' },
    { id: 'americas', label: 'in The Americas', description: 'TSX Canada, B3 Brazil, BMV Mexico' },
    { id: 'emerging', label: 'in Emerging Markets', description: 'High-growth frontier markets & commodities' }
  ];

  const currentLabel = regions.find(r => r.id === selectedRegion)?.label || selectedRegion;

  return (
    <div className="text-center mb-10 relative">
      <div className="inline-block relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-4xl sm:text-5xl md:text-[58px] lg:text-[64px] font-bold tracking-tight text-[#181c23] hover:text-[#0049db] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer group leading-tight"
          id="markets-header-dropdown-btn"
        >
          <span>Markets, {currentLabel}</span>
          <ChevronDown className={`w-8 h-8 md:w-12 md:h-12 text-[#181c23] group-hover:text-[#0049db] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 sm:w-96 bg-white border border-[#c3c5d8] rounded-2xl shadow-2xl p-2 z-50 text-left animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#737687] border-b border-[#e0e2ed]">
                Select Market Region
              </div>
              <div className="py-1 space-y-1">
                {regions.map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => {
                      onSelectRegion(reg.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start justify-between p-3 rounded-xl transition-colors cursor-pointer text-left ${
                      selectedRegion === reg.id ? 'bg-[#f1f3fe] text-[#0049db]' : 'hover:bg-[#f9f9ff] text-[#181c23]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold capitalize flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0049db]" />
                        Markets, {reg.label}
                      </div>
                      <div className="text-xs text-[#737687] mt-0.5">
                        {reg.description}
                      </div>
                    </div>
                    {selectedRegion === reg.id && (
                      <Check className="w-4 h-4 text-[#0049db] shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
