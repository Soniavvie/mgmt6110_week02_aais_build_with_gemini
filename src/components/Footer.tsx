import React, { useState } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<string | null>(null);

  const links = [
    { name: 'About', content: 'TradingView & Market Precision are built for speed, depth, and precision financial analysis across all global assets.' },
    { name: 'Features', content: 'Advanced multi-asset charts, high-volume real-time stream feeds, customizable watchlists, and smart alerts.' },
    { name: 'Pricing', content: 'Free forever for individual traders with real-time essentials. Pro and Premium tiers for professional multi-screen desks.' },
    { name: 'Wall of Love', content: 'Trusted by over 60 million active traders and investors worldwide to make informed market decisions every day.' },
    { name: 'Athletes', content: 'Supporting high-performance athletes who balance extreme discipline in sports and financial independence.' },
    { name: 'Manifesto', content: 'Look first / Then leap. We believe the future of global market data should be accessible, transparent, and beautiful.' }
  ];

  return (
    <>
      <footer 
        className="bg-white border-t border-[#c3c5d8] w-full py-6 px-4 md:px-8 max-w-[1280px] mx-auto mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs"
        id="app-footer"
      >
        <div className="font-bold text-[#181c23]" id="footer-copyright">
          © 2024 TradingView, Inc.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6" id="footer-links">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => setModalContent(link.content)}
              className="text-[#434656] hover:text-[#0049db] font-medium transition-colors cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>
      </footer>

      {/* Info Popup for Footer Links */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#c3c5d8] rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-4 right-4 p-1 text-[#737687] hover:text-[#181c23] rounded-full hover:bg-[#ebedf9]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-[#0049db] mb-2 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>TradingView Precision</span>
            </div>
            <p className="text-sm text-[#181c23] leading-relaxed mb-4">
              {modalContent}
            </p>
            <button
              onClick={() => setModalContent(null)}
              className="w-full py-2 bg-[#0049db] text-white rounded-xl text-xs font-semibold hover:bg-[#2962ff] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
