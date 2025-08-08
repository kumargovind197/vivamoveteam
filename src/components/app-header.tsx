
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartPulse, Building, LayoutDashboard, UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from 'firebase/auth';

type AppHeaderProps = {
  onEnroll?: (code: string) => void;
  user: User | null;
  isEnrolled?: boolean;
  view: 'client' | 'clinic';
};

export default function AppHeader({ onEnroll, user, isEnrolled = false, view }: AppHeaderProps) {
  const [isEnrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [invitationCode, setInvitationCode] = useState('');

  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll(invitationCode);
    }
    setEnrollDialogOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            {isEnrolled && (
              <>
                <Image 
                  data-ai-hint="medical logo"
                  src="https://placehold.co/40x40.png" 
                  alt="Clinic Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-md"
                />
                <Separator orientation="vertical" className="h-8" />
              </>
            )}
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">ViVa move</span>
          </Link>

          <div className="flex items-center gap-4">
             {view === 'client' && (
               <>
                <Button variant="ghost" onClick={() => setEnrollDialogOpen(true)}>
                  <Building className="mr-2 h-4 w-4" />
                  <span>Enroll in Clinic</span>
                </Button>
                 <Button asChild variant="outline">
                    <Link href="/clinic">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Clinic View</span>
                    </Link>
                 </Button>
               </>
            )}
             {view === 'clinic' && (
                <Button asChild variant="outline">
                    <Link href="/">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Patient View</span>
                    </Link>
                </Button>
            )}
            {user && (
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL ?? "https://placehold.co/100x100"} alt="User avatar" />
                    <AvatarFallback>
                      <UserCircle />
                    </AvatarFallback>
                  </Avatar>
            )}
          </div>
        </div>
      </header>

      <Dialog open={isEnrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enroll in a Clinic</DialogTitle>
            <DialogDescription>
              Enter the invitation code provided by your clinic to enroll.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invitation-code" className="text-right">
                Code
              </Label>
              <Input
                id="invitation-code"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                className="col-span-3"
                placeholder="Enter your invitation code"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEnroll} className="bg-accent hover:bg-accent/90">Enroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
