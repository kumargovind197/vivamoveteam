
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { X } from 'lucide-react';

interface AdContent {
  headline: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

interface AdBannerProps {
  isPopupVisible: boolean;
  adContent: AdContent | null;
}

export default function AdBanner({ isPopupVisible, adContent }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(isPopupVisible);

  useEffect(() => {
    setIsVisible(isPopupVisible);
  }, [isPopupVisible]);

  if (!isVisible || !adContent) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-full max-w-xs shadow-2xl">
        <div className="relative">
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 z-10 rounded-full bg-background/50 p-1 text-foreground/80 hover:bg-background/80"
            aria-label="Close ad"
          >
            <X className="h-4 w-4" />
          </button>
          <Image 
            data-ai-hint={adContent.imageHint}
            src={adContent.imageUrl} 
            alt={adContent.headline} 
            width={400} 
            height={300}
            className="rounded-t-lg object-cover aspect-[4/3]"
          />
        </div>
        <CardContent className="p-4">
            <h3 className="font-headline text-lg font-semibold">{adContent.headline}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
                {adContent.description}
            </p>
            <Button size="sm" className="w-full bg-accent hover:bg-accent/90">
                Shop Now
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
