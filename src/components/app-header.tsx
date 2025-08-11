
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, LayoutDashboard, UserCircle, Wrench } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from 'firebase/auth';

type AppHeaderProps = {
  user: User | null;
  view: 'member' | 'group';
  isEnrolled?: boolean;
  memberId?: string; // Used in group view when looking at a specific member
  memberName?: string;
};

const StepTrackLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#3F51B5"/>
        <path d="M7.5 3C4.42 3 2 5.42 2 8.5" stroke="#7E57C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)


export default function AppHeader({ user, view, isEnrolled = false, memberId, memberName }: AppHeaderProps) {

  const renderGroupBranding = () => {
    // View when looking at a specific member from the group dashboard
    if (memberId) {
        return (
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                    <Link href="/group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </Link>
                </Button>
                <div>
                    <p className="text-sm text-muted-foreground">Viewing Member</p>
                    <p className="font-semibold">{memberName}</p>
                </div>
            </div>
        );
    }
    
    // Default view for member and group main pages
    if (isEnrolled && view === 'member') {
        return (
            <Image
                data-ai-hint="company logo"
                src="https://placehold.co/40x40.png"
                alt="Group Logo"
                width={40}
                height={40}
                className="rounded-md"
            />
        );
    }

    // Placeholder for non-enrolled or group view
    return (
        <div className="h-10 w-10 flex items-center justify-center rounded-md bg-muted">
            <Users className="h-6 w-6 text-muted-foreground"/>
        </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          
          <div className="flex items-center">
            {renderGroupBranding()}
          </div>
          

          <div className="flex items-center gap-4">
             {view === 'member' && (
               <div className="hidden items-center gap-2 md:flex">
                 <Button asChild variant="outline">
                    <Link href="/group">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Group View</span>
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
             {view === 'group' && !memberId && (
                <Button asChild variant="outline">
                    <Link href="/">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Member View</span>
                    </Link>
                </Button>
            )}

            <Link href="/" className="flex items-center gap-2">
                <StepTrackLogo />
                <div>
                    <span className="block text-sm font-semibold text-primary/80">StepTrack</span>
                    <span className="block text-[0.6rem] leading-tight text-muted-foreground">Wellness Challenge</span>
                </div>
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
    </>
  );
}
