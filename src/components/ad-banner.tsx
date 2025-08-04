import { Button } from "./ui/button";

export default function AdBanner() {
  return (
    <footer className="sticky bottom-0 z-50 w-full bg-muted shadow-inner">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Healthy You Supplements:</span> Get 20% off your first order!
        </p>
        <Button size="sm" variant="outline" className="bg-background hover:bg-background/90">
          Shop Now
        </Button>
      </div>
    </footer>
  );
}
