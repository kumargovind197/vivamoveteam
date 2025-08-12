
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "./ui/card";
import { X } from 'lucide-react';
import Link from 'next/link';
import type { AdContent } from '@/lib/ad-store';

interface AdBannerProps {
  isVisible: boolean;
  adContents: AdContent[];
}

const AD_ROTATION_INTERVAL = 5000; // 5 seconds

export default function AdBanner({ isVisible, adContents }: AdBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isVisible && adContents.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % adContents.length);
      }, AD_ROTATION_INTERVAL);
      return () => clearInterval(timer);
    }
  }, [isVisible, adContents.length]);

  if (!isVisible || isDismissed || adContents.length === 0) {
    return null;
  }

  const adContent = adContents[currentIndex];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-full max-w-xs shadow-2xl overflow-hidden">
        <CardContent className="p-0 relative">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="absolute top-2 right-2 z-10 rounded-full bg-background/50 p-1 text-foreground/80 hover:bg-background/80"
            aria-label="Close ad"
          >
            <X className="h-4 w-4" />
          </button>
          <Link href={adContent.targetUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer aspect-[4/3] relative">
             <Image 
                data-ai-hint="running shoes"
                src={adContent.imageUrl} 
                alt={adContent.description} 
                fill
                className="rounded-lg object-cover"
              />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
