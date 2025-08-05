
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { X } from 'lucide-react';

interface AdBannerProps {
  isPopupVisible: boolean;
}

export default function AdBanner({ isPopupVisible }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(isPopupVisible);

  useEffect(() => {
    setIsVisible(isPopupVisible);
  }, [isPopupVisible]);

  if (!isVisible) {
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
            data-ai-hint="supplements bottle"
            src="https://placehold.co/400x300.png" 
            alt="Ad for supplements" 
            width={400} 
            height={300}
            className="rounded-t-lg object-cover aspect-[4/3]"
          />
        </div>
        <CardContent className="p-4">
            <h3 className="font-headline text-lg font-semibold">Healthy You Supplements</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
                Get 20% off your first order and boost your wellness journey!
            </p>
            <Button size="sm" className="w-full bg-accent hover:bg-accent/90">
                Shop Now
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
