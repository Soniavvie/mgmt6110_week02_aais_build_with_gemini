import React, { useState } from 'react';
import { ChevronRight, BarChart2, ExternalLink, ArrowRight, TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';
import { MarketIndex, WorldIndexLink } from '../types';
import { Sparkline } from './Sparkline';

interface IndicesSectionProps {
  indices: MarketIndex[];
  subLinksTitle: string;
  subLinks: WorldIndexLink[];
  onSelectIndex: (index: MarketIndex) => void;
  onOpenAllIndices: () => void;
  onSelectWorldLink: (link: WorldIndexLink) => void;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  indices,
  subLinksTitle,
  subLinks,
  onSelectIndex,
  onOpenAllIndices,
  onSelectWorldLink
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'dense'>('cards');

  return (
    <section className="mb-12" id="indices-section">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 border-b border-[#c3c5d8] pb-2">
        <button
          onClick={onOpenAllIndices}
          className="text-2xl md:text-[32px] font-bold text-[#181c23] flex items-center gap-1 cursor-pointer hover:text-[#0049db] transition-colors group"
          id="indices-title-btn"
        >
          <span>Indices</span>
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'dense' : 'cards')}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              viewMode === 'dense' ? 'bg-[#ebedf9] text-[#0049db]' : 'text-[#5a5e6b] hover:bg-[#ebedf9]'
            }`}
            title="Toggle Analytics View"
            id="indices-analytics-btn"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenAllIndices}
            className="p-2 text-[#5a5e6b] hover:bg-[#ebedf9] rounded-full transition-colors cursor-pointer"
            title="Open all indices modal"
            id="indices-expand-btn"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bento Grid for Indices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {indices.map((idx) => {
          const isRed = idx.badgeColor === '#ba1a1a' || !idx.isPositive;
          const badgeBg = idx.badgeColor;

          return (
            <div
              key={idx.id}
              onClick={() => onSelectIndex(idx)}
              className="bg-white border border-[#c3c5d8] rounded-xl p-5 hover:bg-[#f1f3fe]/70 hover:border-[#0049db]/40 transition-all duration-200 group cursor-pointer relative overflow-hidden shadow-2xs hover:shadow-md"
              id={`index-card-${idx.symbol.toLowerCase()}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs"
                    style={{ backgroundColor: badgeBg }}
                  >
                    {idx.badgeNumber}
                  </div>
                  <div>
                    <span className="font-bold text-xl md:text-2xl text-[#181c23] block group-hover:text-[#0049db] transition-colors">
                      {idx.name}
                    </span>
                    <span className="text-xs text-[#737687] font-medium">
                      {idx.symbol} · {idx.country || 'Index'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-[#181c23] tabular-nums">
                    {idx.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-xs font-bold tabular-nums flex items-center justify-end gap-0.5 ${
                      idx.isPositive ? 'text-[#00A3D9]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {idx.isPositive ? '+' : ''}
                    {idx.changePercent}%
                  </div>
                </div>
              </div>

              {/* Sparkline Graphic Matching Screenshot */}
              <div className="mt-3">
                <Sparkline
                  data={idx.sparklineData}
                  color={idx.badgeColor}
                  isPositive={idx.isPositive}
                  height={56}
                  id={idx.id}
                />
              </div>

              {/* Footer sub-details on hover */}
              <div className="mt-2 pt-2 border-t border-[#e0e2ed]/60 flex items-center justify-between text-[11px] text-[#737687]">
                <span>Vol: {idx.volume || '1.2B'}</span>
                <span className="group-hover:text-[#0049db] flex items-center gap-1 font-semibold">
                  View Chart <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub-section: World Indices Links */}
      <div className="mt-6 pt-2">
        <h3 className="text-xs font-bold text-[#434656] mb-3 uppercase tracking-wider">
          {subLinksTitle}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2.5">
          {subLinks.map((item) => (
            <button
              key={item.symbol}
              onClick={() => onSelectWorldLink(item)}
              className="text-left text-sm font-medium text-[#0049db] hover:underline truncate block cursor-pointer transition-colors"
              title={`${item.symbol} ${item.name} (${item.price} ${item.isPositive ? '+' : ''}${item.changePercent}%)`}
            >
              <span className="font-bold">{item.symbol}</span> {item.name}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenAllIndices}
          className="inline-flex items-center gap-1.5 mt-4 text-[#0049db] text-sm font-semibold hover:underline cursor-pointer group"
          id="see-all-major-indices-btn"
        >
          <span>See all major indices</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
