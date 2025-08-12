
import Image from 'next/image';
import Link from 'next/link';

interface AdContent {
  description: string;
  imageUrl: string;
  targetUrl: string;
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
    <footer className="sticky bottom-0 z-40 w-full border-t bg-background/95 backdrop-blur-sm py-2">
      <div className="container mx-auto flex items-center justify-center">
         <Link href={adContent.targetUrl} passHref legacyBehavior>
           <a target="_blank" rel="noopener noreferrer" className="block w-[728px] h-[90px] relative overflow-hidden rounded-md shadow-lg cursor-pointer bg-muted">
             <Image 
              data-ai-hint="ad banner"
              src={adContent.imageUrl}
              alt={adContent.description}
              fill
              className="object-contain"
            />
          </a>
        </Link>
      </div>
    </footer>
  );
}
