
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import Link from 'next/link';

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
          <CardContent className="p-0 flex items-center justify-center">
             <Link href="#" passHref>
               <Image 
                data-ai-hint={adContent.imageHint}
                src={adContent.imageUrl}
                alt={adContent.headline}
                width={728}
                height={90}
                className="object-cover cursor-pointer"
              />
            </Link>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
}
