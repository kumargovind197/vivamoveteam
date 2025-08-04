"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { HeartPulse, UserCircle, Building, Settings, LogOut, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from './ui/label';

type AppHeaderProps = {
  onEnroll?: (code: string) => void;
};

export default function AppHeader({ onEnroll }: AppHeaderProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [invitationCode, setInvitationCode] = useState('');

  const handleEnroll = () => {
    if (onEnroll) {
        onEnroll(invitationCode);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-primary" />
            <span className="font-headline text-2xl font-bold text-primary">ViVa move</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://placehold.co/100x100" alt="User avatar" />
                  <AvatarFallback>
                    <UserCircle />
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-background text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Jane Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    jane.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/clinic">
                  <Building className="mr-2 h-4 w-4" />
                  <span>Clinic View</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                <Building className="mr-2 h-4 w-4" />
                <span>Enroll in Clinic</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
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
