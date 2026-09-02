import React, { useState } from 'react';
import { X, Star, TrendingUp, TrendingDown, Bell, Share2, Layers, Clock, DollarSign, Activity, Newspaper } from 'lucide-react';
import { StockItem, MarketIndex, FinancialNews } from '../types';
import { FINANCIAL_NEWS } from '../data/marketData';

interface StockDetailModalProps {
  item: StockItem | MarketIndex | null;
  onClose: () => void;
  isStarred: boolean;
  onToggleStar: (symbol: string) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  item,
  onClose,
  isStarred,
  onToggleStar
}) => {
  if (!item) return null;

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1D');
  const [chartType, setChartType] = useState<'area' | 'candles' | 'line'>('area');
  const [hoveredPoint, setHoveredPoint] = useState<{ val: number; label: string } | null>(null);
  const [alertSet, setAlertSet] = useState(false);

  // Generate synthetic timeline data based on selected timeframe
  const generateTimelinePoints = () => {
    const base = 'price' in item ? item.price : item.currentPrice;
    const count = timeframe === '1D' ? 24 : timeframe === '5D' ? 30 : timeframe === '1M' ? 28 : 36;
    const points: { label: string; value: number; open: number; high: number; low: number; close: number; vol: number }[] = [];

    let current = base * 0.96;
    for (let i = 0; i < count; i++) {
      const delta = (Math.random() - 0.48) * (base * 0.025);
      current = Math.max(base * 0.7, current + delta);
      const high = current + Math.random() * (base * 0.015);
      const low = current - Math.random() * (base * 0.015);
      const open = (current + low) / 2;
      const close = current;

      let label = '';
      if (timeframe === '1D') {
        const hour = 9 + Math.floor((i / count) * 7);
        const min = (i % 4) * 15;
        label = `${hour}:${min === 0 ? '00' : min}`;
      } else if (timeframe === '5D') {
        label = `Day ${Math.floor(i / 6) + 1}`;
      } else {
        label = `Sep ${i + 1}`;
      }

      points.push({
        label,
        value: current,
        open,
        high,
        low,
        close,
        vol: Math.floor(Math.random() * 50000) + 10000
      });
    }
    // Make last point exactly the current price
    points[points.length - 1].value = base;
    points[points.length - 1].close = base;
    return points;
  };

  const chartData = generateTimelinePoints();
  const values = chartData.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 640;
  const height = 240;
  const paddingY = 20;
  const usableH = height - paddingY * 2;

  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * width;
    const y = height - paddingY - ((d.value - minVal) / range) * usableH;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[idx - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${acc} C ${cpX1},${cpY1} ${cpX2},${cpY2} ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  const isPositive = item.isPositive;
  const primaryThemeColor = isPositive ? '#00A3D9' : '#ba1a1a';
  const priceDisplay = 'price' in item ? item.price : item.currentPrice;

  // Filter relevant news
  const relevantNews = FINANCIAL_NEWS.filter(
    (n) => n.relatedSymbols.includes(item.symbol) || Math.random() > 0.4
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white border border-[#c3c5d8] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="stock-detail-modal"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#e0e2ed] flex items-start justify-between bg-[#f9f9ff]">
          <div className="flex items-center gap-3">
            {'badgeColor' in item ? (
              <div
                className="w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs"
                style={{ backgroundColor: item.badgeColor }}
              >
                {item.badgeNumber}
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-[#ebedf9] text-[#0049db] flex items-center justify-center font-bold text-base shadow-xs">
                {item.symbol.slice(0, 3)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#181c23]">{item.name}</h2>
                {'tag' in item && (
                  <span className="text-xs px-2 py-0.5 rounded bg-[#2962ff] text-white font-bold">
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="text-xs text-[#737687] font-medium">
                {item.symbol} · {'exchange' in item ? item.exchange : item.country || 'Global Index'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStar(item.symbol)}
              className="p-2 text-[#737687] hover:text-[#eab308] hover:bg-[#ebedf9] rounded-full transition-colors cursor-pointer"
              title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-5 h-5 ${isStarred ? 'fill-[#eab308] text-[#eab308]' : ''}`} />
            </button>
            <button
              onClick={() => setAlertSet(!alertSet)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                alertSet ? 'bg-[#ebedf9] text-[#0049db]' : 'text-[#737687] hover:bg-[#ebedf9]'
              }`}
              title="Set Price Alert"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#737687] hover:text-[#181c23] hover:bg-[#ebedf9] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-6">
          {/* Price Header & Metric */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl font-extrabold text-[#181c23] tabular-nums">
                ${hoveredPoint ? hoveredPoint.val.toFixed(2) : priceDisplay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 ${isPositive ? 'text-[#00A3D9]' : 'text-[#ba1a1a]'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {isPositive ? '+' : ''}
                  {'changeValue' in item ? item.changeValue.toFixed(2) : '0.00'} ({isPositive ? '+' : ''}
                  {item.changePercent}%)
                </span>
                <span className="text-xs text-[#737687] font-normal ml-2">
                  {hoveredPoint ? hoveredPoint.label : 'Real-time quotes'}
                </span>
              </div>
            </div>

            {/* Timeframe & Chart Style toggles */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#f1f3fe] p-1 rounded-lg border border-[#c3c5d8]">
                {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      timeframe === tf ? 'bg-white text-[#0049db] shadow-xs' : 'text-[#5a5e6b] hover:text-[#181c23]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center bg-[#f1f3fe] p-1 rounded-lg border border-[#c3c5d8]">
                <button
                  onClick={() => setChartType('area')}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                    chartType === 'area' ? 'bg-white text-[#0049db] shadow-xs' : 'text-[#5a5e6b]'
                  }`}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType('candles')}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                    chartType === 'candles' ? 'bg-white text-[#0049db] shadow-xs' : 'text-[#5a5e6b]'
                  }`}
                >
                  Candles
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="bg-[#f9f9ff] border border-[#c3c5d8] rounded-xl p-4 relative overflow-hidden">
            <div className="h-[240px] w-full relative">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="detail-chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={primaryThemeColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={primaryThemeColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="0" y1={paddingY} x2={width} y2={paddingY} stroke="#e0e2ed" strokeDasharray="3 3" />
                <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#e0e2ed" strokeDasharray="3 3" />
                <line x1="0" y1={height - paddingY} x2={width} y2={height - paddingY} stroke="#e0e2ed" strokeDasharray="3 3" />

                {chartType === 'candles' ? (
                  /* Candlestick renderer */
                  points.map((pt, i) => {
                    const candleWidth = Math.max(3, (width / points.length) * 0.6);
                    const isBull = pt.close >= pt.open;
                    const candleColor = isBull ? '#00A3D9' : '#ba1a1a';
                    const yOpen = height - paddingY - ((pt.open - minVal) / range) * usableH;
                    const yClose = height - paddingY - ((pt.close - minVal) / range) * usableH;
                    const yHigh = height - paddingY - ((pt.high - minVal) / range) * usableH;
                    const yLow = height - paddingY - ((pt.low - minVal) / range) * usableH;
                    const topY = Math.min(yOpen, yClose);
                    const bodyH = Math.max(2, Math.abs(yClose - yOpen));

                    return (
                      <g key={i}>
                        <line x1={pt.x} y1={yHigh} x2={pt.x} y2={yLow} stroke={candleColor} strokeWidth={1} />
                        <rect
                          x={pt.x - candleWidth / 2}
                          y={topY}
                          width={candleWidth}
                          height={bodyH}
                          fill={candleColor}
                          rx={1}
                        />
                      </g>
                    );
                  })
                ) : (
                  /* Area / Line Chart */
                  <>
                    <path d={areaD} fill="url(#detail-chart-grad)" />
                    <path
                      d={pathD}
                      fill="none"
                      stroke={primaryThemeColor}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {/* Hover dots & crosshair */}
                {hoveredPoint && (
                  <circle
                    cx={points.find((p) => p.label === hoveredPoint.label)?.x || width / 2}
                    cy={points.find((p) => p.label === hoveredPoint.label)?.y || height / 2}
                    r={5}
                    fill={primaryThemeColor}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                )}
              </svg>

              {/* Invisible interactive hover columns */}
              <div className="absolute inset-0 flex">
                {points.map((pt, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-full cursor-crosshair"
                    onMouseEnter={() => setHoveredPoint({ val: pt.value, label: pt.label })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-[#737687] mt-2 pt-2 border-t border-[#e0e2ed]">
              <span>Low: ${minVal.toFixed(2)}</span>
              <span>Selected Period: {timeframe}</span>
              <span>High: ${maxVal.toFixed(2)}</span>
            </div>
          </div>

          {/* Key Fundamentals Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#434656] mb-3">
              Key Fundamentals & Overview
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#f9f9ff] border border-[#c3c5d8] rounded-xl">
                <span className="text-[11px] text-[#737687] block">Market Cap</span>
                <span className="text-sm font-bold text-[#181c23]">
                  {'marketCap' in item ? item.marketCap : '$1.82T'}
                </span>
              </div>
              <div className="p-3 bg-[#f9f9ff] border border-[#c3c5d8] rounded-xl">
                <span className="text-[11px] text-[#737687] block">P/E Ratio</span>
                <span className="text-sm font-bold text-[#181c23]">
                  {'peRatio' in item && item.peRatio ? item.peRatio : '32.4'}
                </span>
              </div>
              <div className="p-3 bg-[#f9f9ff] border border-[#c3c5d8] rounded-xl">
                <span className="text-[11px] text-[#737687] block">52-Week High</span>
                <span className="text-sm font-bold text-[#181c23]">
                  ${'high52' in item && item.high52 ? item.high52.toFixed(2) : (priceDisplay * 1.15).toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-[#f9f9ff] border border-[#c3c5d8] rounded-xl">
                <span className="text-[11px] text-[#737687] block">52-Week Low</span>
                <span className="text-sm font-bold text-[#181c23]">
                  ${'low52' in item && item.low52 ? item.low52.toFixed(2) : (priceDisplay * 0.72).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Market News */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#434656] flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5 text-[#0049db]" />
                Recent Financial News & Analysis
              </h4>
            </div>
            <div className="space-y-2">
              {relevantNews.map((news) => (
                <div
                  key={news.id}
                  className="p-3 border border-[#e0e2ed] hover:border-[#0049db] rounded-xl hover:bg-[#f1f3fe] transition-colors"
                >
                  <div className="text-sm font-semibold text-[#181c23] hover:text-[#0049db] cursor-pointer">
                    {news.title}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#737687] mt-1">
                    <span>{news.source}</span>
                    <span>·</span>
                    <span>{news.timeAgo}</span>
                    <span>·</span>
                    <span className={`font-semibold ${news.sentiment === 'bullish' ? 'text-[#00A3D9]' : 'text-[#5a5e6b]'}`}>
                      {news.sentiment.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer actions */}
        <div className="p-4 bg-[#f9f9ff] border-t border-[#e0e2ed] flex items-center justify-between">
          <div className="text-xs text-[#737687]">
            Exchange: {'exchange' in item ? item.exchange : 'Official Index'} · Data delayed 15m
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0049db] hover:bg-[#2962ff] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
