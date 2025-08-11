
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building, LayoutDashboard, UserCircle, Wrench } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from 'firebase/auth';

type AppHeaderProps = {
  user: User | null;
  view: 'client' | 'clinic';
  isEnrolled?: boolean;
  onEnroll?: (code: string) => void;
  patientId?: string; // Used in clinic view when looking at a specific patient
  patientName?: string;
};

const VivaLogo = () => (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="38" cy="62" r="20" fill="#F44336"/>
        <circle cx="62" cy="62" r="20" fill="#4CAF50"/>
        <circle cx="50" cy="40" r="20" fill="#2196F3"/>
    </svg>
)


export default function AppHeader({ user, view, isEnrolled = false, onEnroll, patientId, patientName }: AppHeaderProps) {
  const [isEnrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [invitationCode, setInvitationCode] = useState('');

  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll(invitationCode);
    }
    setEnrollDialogOpen(false);
  };

  const renderClinicBranding = () => {
    // View when looking at a specific patient from the clinic dashboard
    if (patientId) {
        return (
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                    <Link href="/clinic">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </Link>
                </Button>
                <div>
                    <p className="text-sm text-muted-foreground">Viewing Patient</p>
                    <p className="font-semibold">{patientName}</p>
                </div>
            </div>
        );
    }
    
    // Default view for client and clinic main pages
    if (isEnrolled && view === 'client') {
        return (
            <Image
                data-ai-hint="medical logo"
                src="https://placehold.co/40x40.png"
                alt="Clinic Logo"
                width={40}
                height={40}
                className="rounded-md"
            />
        );
    }

    // Placeholder for non-enrolled or clinic view
    return (
        <div className="h-10 w-10 flex items-center justify-center rounded-md bg-muted">
            <Building className="h-6 w-6 text-muted-foreground"/>
        </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          
          {/* Left Side: Clinic Branding */}
          <div className="flex items-center">
            {renderClinicBranding()}
          </div>
          

          {/* Right Side: All other elements */}
          <div className="flex items-center gap-4">
             {view === 'client' && (
               <div className="hidden items-center gap-2 md:flex">
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
                 <Button asChild variant="outline">
                    <Link href="/admin">
                        <Wrench className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                    </Link>
                 </Button>
               </div>
            )}
             {view === 'clinic' && !patientId && (
                <Button asChild variant="outline">
                    <Link href="/">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Patient View</span>
                    </Link>
                </Button>
            )}

            <Link href="/" className="flex items-center gap-2">
                <VivaLogo />
                <span className="text-sm font-semibold text-primary/80">ViVa move</span>
            </Link>

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
