import React from 'react';

interface AdBannerProps {
  type: 'skyscraper' | 'square' | 'billboard';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  if (type === 'skyscraper') {
    return (
      <div className={`sticky top-28 bg-[#eceef0] flex flex-col items-center justify-center text-[#43474f] font-mono text-xs border border-[#c3c6d1] h-[600px] rounded ${className}`}>
        <span className="mb-2 opacity-60 tracking-wider text-[10px]">ADVERTISEMENT</span>
        <div className="w-[120px] h-[550px] bg-[#e0e3e5] flex flex-col items-center justify-center text-center p-2 rounded">
          <span className="font-bold text-gray-700">120x600</span>
          <span className="text-[10px] text-gray-500 mt-2">Space IAB Banner</span>
        </div>
      </div>
    );
  }

  if (type === 'square') {
    return (
      <div className={`bg-[#eceef0] flex flex-col items-center justify-center text-[#43474f] font-mono text-xs border border-[#c3c6d1] h-[300px] rounded p-2 ${className}`}>
        <span className="mb-2 opacity-60 tracking-wider text-[10px]">ADVERTISEMENT</span>
        <div className="w-[300px] h-[250px] bg-[#e0e3e5] flex flex-col items-center justify-center text-center rounded">
          <span className="font-bold text-gray-700">300x250</span>
          <span className="text-[10px] text-gray-500 mt-1">Medium Rectangle Ad</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-[#eceef0] flex flex-col items-center justify-center text-[#43474f] font-mono text-xs border border-[#c3c6d1] h-[120px] rounded my-8 p-2 ${className}`}>
      <span className="mb-1 opacity-60 tracking-widest text-[10px]">ADVERTISEMENT</span>
      <div className="w-full max-w-[728px] h-[90px] bg-[#e0e3e5] flex items-center justify-center rounded">
        <span className="font-bold text-gray-700">728x90 Billboard Banner</span>
      </div>
    </div>
  );
};
