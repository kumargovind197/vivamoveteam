
"use client";

import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from './ui/dialog';
import { Info, Link } from 'lucide-react';
import type { MOCK_GROUPS } from '@/lib/mock-data';
import { vivaLogoSrc } from '@/lib/logo-store';

type Group = typeof MOCK_GROUPS[keyof typeof MOCK_GROUPS];

interface AppInfoDialogProps {
    view: 'member' | 'group' | 'admin';
    group?: Group | null;
}

const VivaMoveLogo = () => {
    const [logo, setLogo] = React.useState(vivaLogoSrc);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (logo !== vivaLogoSrc) {
                setLogo(vivaLogoSrc);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [logo]);

    return <img src={logo} alt="ViVa Move Logo" className="h-6 w-6" />;
};


export default function AppInfoDialog({ view, group }: AppInfoDialogProps) {
  const currentYear = new Date().getFullYear();

  const getOrganisationName = () => {
      if (view === 'admin') return 'Main Admin';
      if (group) return group.name;
      return 'Not Enrolled';
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="text-muted-foreground">
          <Info className="mr-2 h-4 w-4" />
          App Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
             <VivaMoveLogo />
             <div>
                <DialogTitle className="text-xl">ViVa step up challenge</DialogTitle>
                <DialogDescription>A motivational step tracking app.</DialogDescription>
             </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">App Version:</span>
                <span className="font-medium">2.025.2</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Organisation:</span>
                <span className="font-medium">{getOrganisationName()}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Admin:</span>
                <span className="font-medium">Contact your admin for support</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">URL:</span>
                <span className="font-medium text-xs text-muted-foreground italic">Link will be available soon</span>
            </div>
        </div>
        <DialogFooter>
          <p className="text-xs text-muted-foreground w-full text-center">
            &copy; {currentYear} Viva health solutions. All rights reserved.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    

    
