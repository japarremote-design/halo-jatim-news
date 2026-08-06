import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Ad, AdPosition } from '../types';

interface AdBannerProps {
  type: AdPosition;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'ads'),
      where('position', '==', type),
      where('isActive', '==', true)
    );
    const unsub = onSnapshot(q, (snap) => {
      const now = new Date();
      const candidates = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as Ad))
        .filter(a => !a.expiresAt || new Date(a.expiresAt) >= now)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setAd(candidates[0] || null);
    }, () => setAd(null));
    return () => unsub();
  }, [type]);

  const dims = {
    skyscraper: { w: 120, h: 600, label: '120x600' },
    square: { w: 300, h: 250, label: '300x250' },
    billboard: { w: 728, h: 90, label: '728x90' },
  }[type];

  if (ad) {
    return (
      <a
        href={ad.linkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`block overflow-hidden rounded ${type === 'billboard' ? 'w-full my-8' : ''} ${className}`}
        title={ad.label}
      >
        <img
          src={ad.imageUrl}
          alt={ad.label}
          className={`w-full object-cover ${type === 'skyscraper' ? 'sticky top-28' : ''}`}
          style={type !== 'billboard' ? { aspectRatio: `${dims.w}/${dims.h}` } : undefined}
        />
      </a>
    );
  }

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
