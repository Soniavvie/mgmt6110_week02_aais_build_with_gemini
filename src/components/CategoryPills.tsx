import React from 'react';
import { MarketCategory } from '../types';

interface CategoryPillsProps {
  categories: MarketCategory[];
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  return (
    <div 
      className="flex items-center gap-2 sm:gap-3 overflow-x-auto hide-scrollbar mb-10 pb-2 border-b border-[#c3c5d8]"
      id="category-pills-container"
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-[#5a5e6b] text-white shadow-xs font-bold'
                : 'bg-[#f1f3fe] text-[#181c23] hover:bg-[#ebedf9] hover:text-[#0049db]'
            }`}
            id={`pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
