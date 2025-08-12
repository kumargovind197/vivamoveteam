
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { AdContent } from '@/lib/ad-store';

interface FooterAdBannerProps {
  isVisible: boolean;
  adContents: AdContent[];
}

const AD_ROTATION_INTERVAL = 7000; // 7 seconds for footer

export default function FooterAdBanner({ isVisible, adContents }: FooterAdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isVisible && adContents.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % adContents.length);
      }, AD_ROTATION_INTERVAL);
      return () => clearInterval(timer);
    }
  }, [isVisible, adContents.length]);

  if (!isVisible || adContents.length === 0) {
    return null;
  }
  
  const adContent = adContents[currentIndex];

  return (
    <footer className="sticky bottom-0 z-40 w-full border-t bg-background/95 backdrop-blur-sm py-2">
      <div className="container mx-auto flex items-center justify-center">
         <Link href={adContent.targetUrl} target="_blank" rel="noopener noreferrer" className="block w-[728px] h-[90px] relative overflow-hidden rounded-md shadow-lg cursor-pointer bg-muted">
           <Image 
            data-ai-hint="ad banner"
            src={adContent.imageUrl}
            alt={adContent.description}
            fill
            className="object-contain"
          />
        </Link>
      </div>
    </footer>
  );
}
