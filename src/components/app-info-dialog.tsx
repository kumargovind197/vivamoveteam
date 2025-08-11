
"use client";

import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from './ui/dialog';
import { Info } from 'lucide-react';

const StepTrackLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#3F51B5"/>
        <path d="M7.5 3C4.42 3 2 5.42 2 8.5" stroke="#7E57C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
             <StepTrackLogo />
             <div>
                <DialogTitle className="text-xl">StepTrack Wellness</DialogTitle>
                <DialogDescription>A fun and interactive way to keep staff well.</DialogDescription>
             </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">App Name:</span>
                <span className="font-medium">StepTrack Wellness</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">App Version:</span>
                <span className="font-medium">1.0.0</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium">Your Company Name</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-medium">Your admin for support</span>
            </div>
        </div>
        <DialogFooter>
          <p className="text-xs text-muted-foreground w-full text-center">
            &copy; {currentYear} Your Company. All rights reserved.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
