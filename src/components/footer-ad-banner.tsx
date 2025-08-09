
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface AdContent {
  headline: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

interface FooterAdBannerProps {
  isVisible: boolean;
  adContent: AdContent | null;
}

export default function FooterAdBanner({ isVisible, adContent }: FooterAdBannerProps) {
  if (!isVisible || !adContent) {
    return null;
  }

  return (
    <footer className="sticky bottom-0 z-40 w-full border-t bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="my-2 max-w-3xl mx-auto overflow-hidden border-accent/50 shadow-lg">
          <CardContent className="p-0 flex items-center">
            <div className="flex-shrink-0">
               <Image 
                data-ai-hint={adContent.imageHint}
                src={adContent.imageUrl}
                alt={adContent.headline}
                width={150}
                height={100}
                className="object-cover h-full"
              />
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-headline font-semibold">{adContent.headline}</h3>
              <p className="text-sm text-muted-foreground">
                {adContent.description}
              </p>
            </div>
            <div className="p-4 flex-shrink-0">
              <Button size="sm" className="bg-accent hover:bg-accent/80">
                Shop Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
}
