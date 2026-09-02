import React from 'react';

interface SparklineProps {
  data: number[];
  color?: string; // e.g. '#ba1a1a' or '#00a3d9' or '#10b981'
  isPositive?: boolean;
  height?: number;
  width?: number | string;
  fillOpacity?: number;
  strokeWidth?: number;
  className?: string;
  id?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color,
  isPositive = true,
  height = 56,
  strokeWidth = 2,
  className = '',
  id
}) => {
  if (!data || data.length < 2) {
    return (
      <div className={`w-full h-[${height}px] bg-gradient-to-r from-[#f1f3fe] to-transparent rounded-lg ${className}`} />
    );
  }

  const effectiveColor = color || (isPositive ? '#00a3d9' : '#ba1a1a');
  const gradientId = `sparkline-grad-${id || Math.random().toString(36).substr(2, 9)}`;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const paddingY = 6;
  const svgWidth = 260;
  const svgHeight = height;
  const usableHeight = svgHeight - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * svgWidth;
    const normalizedY = (val - min) / range;
    const y = svgHeight - paddingY - normalizedY * usableHeight;
    return { x, y };
  });

  // Generate smooth SVG curve path
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1},${cpY1} ${cpX2},${cpY2} ${point.x},${point.y}`;
  }, '');

  const areaD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={effectiveColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={effectiveColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradientId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={effectiveColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
