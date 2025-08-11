
"use client";

import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from './ui/dialog';
import { Info } from 'lucide-react';

const VivaLogo = () => (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="38" cy="62" r="20" fill="#F44336"/>
        <circle cx="62" cy="62" r="20" fill="#4CAF50"/>
        <circle cx="50" cy="40" r="20" fill="#2196F3"/>
    </svg>
)

export default function AppInfoDialog() {
  const currentYear = new Date().getFullYear();

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
             <VivaLogo />
             <div>
                <DialogTitle className="text-xl">ViVa Health Solutions</DialogTitle>
                <DialogDescription>Your partner in health and wellness.</DialogDescription>
             </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">App Name:</span>
                <span className="font-medium">ViVa move</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">App Version:</span>
                <span className="font-medium">2.025.1</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium">ViVa Health Solutions</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-medium">Your admin for support</span>
            </div>
        </div>
        <DialogFooter>
          <p className="text-xs text-muted-foreground w-full text-center">
            &copy; {currentYear} ViVa Health Solutions. All rights reserved.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
