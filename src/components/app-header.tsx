
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircle, Wrench, ShieldQuestion, Users, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User } from 'firebase/auth';
import { MOCK_GROUPS } from '@/lib/mock-data';

type Group = typeof MOCK_GROUPS[keyof typeof MOCK_GROUPS];

// This is a simplified approach for the prototype. In a real app, this would be managed
// through a global state (like Context or Redux) that's updated after the logo upload.
const vivaLogoSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEyLjI1LDE4LjVDMTIuMjUsMTguNSwxMi4yNSwxOC41LDEyLjI1LDE4LjVMMTIuNTUsMTguODRDMTMuMjYsMTkuNjMsMTQuMDEsMjAuMywxNC43OSwyMC44NEwxNS4zMiwyMS4yMkMxNS44NiwyMS41NywxNi44NCwyMS40OSwxNy4yOSwyMC45N0MxNy43NCwyMC40NSwxNy42NSwxOS40NywxNy4xMSwxOS4xMkwxNi41OCwxOC43NEMxNS44LDE4LjIsMTUuMDUsMTcuNTMsMTQuMzQsMTYuNzRMMTMuODEsMTYuMTRDMTMuNzIsMTYuMDMsMTMuNTYsMTYuMDMsMTMuNDYsNi4xM0wxMy4xOSwxNS43N0MxMi40OCwxNC45OCwxMS43MywxNC4zMSwxMC45NSwxMy43N0wxMC40MiwxMy4zOUM5Ljg4LDEzLjA0LDguOSwxMy4xMiw4LjQ1LDEzLjY0QzgsMTQuMTYsOC4wOSwxNS4xNCw4LjYzLDE1LjQ5TDkuMTYsMTUuODdDOS45NCwxNi40MSwxMC42OSwxNy4wOCwxMS40LDE3Ljg3TDExLjcsMTguMkMxMS45NiwxOC40OSwxMi4yNSwxOC41LDEyLjI1LDE4LjVaIiBmaWxsPSJoc2wodmFyKC0tcHJpbWFyeSkpIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC4xNSwxMC42MkwxMC4zNSwxMC44NUMxMC45OCwxMS41NSwxMS41MSwxMi4zMywxMS45MSwxMy4xNkwxMi4wNywxMy41M0MxMi4zLDE0LjA3LDEyLjk4LDE0LjMsMTMuNTIsMTQuMDdDMTQuMDYsMTMuODQsMTQuMjksMTMuMTYsMTQuMDYsMTIuNjJMMTMuOSwxMi4yNUMxMy41LDExLjQyLDEyLjk3LDEwLjY0LDEyLjM0LDkuOTRMMTIuMTQsOS43MUMxMS44OCw5LjQxLDExLjQyLDkuNDEsMTEuMTYsOS43MUwxMC43NCwxMC4xOUMxMC4wNCwxMC45Nyw5LjQzLDExLjgzLDguOTYsMTIuNzJMOC43OSwxMy4wNEM4LjU1LDEzLjUsOC44MSwxNC4wNyw5LjMsMTQuMjhDOS43OSwxNC40OSwxMC4zNiwxNC4yMywxMC41NywxMy43NEwxMC43NCwxMy40MkMxMS4yMSwxMi41MywxMS44MiwxMS42NywxMi41MiwxMC44OUwxMS4xNiw5LjcxQzEwLjksOS40MSwxMC40MSw5LjQxLDEwLjE1LECw5LjQxQzEwLjE1LDEwLjYyWk02LjQ0LDE1LjE5TDYuNTQsMTUuMjVDNi45MywxNS41MSw3LjI4LDE1LjgsNy41OCwxNi4xNEw3Ljc0LDE2LjMyQzcuOTksMTYuNiwwLjQyLDE2LjY1LDguNywxNi40QzkuMDcsMTYuMDYsOS4wMiwxNS41NCw4LjY1LDE1LjJMMC40OSwxNS4wMkM4LjE5LDE0LjY4LDcuODQsMTQuMzksNy40NSwxNC4xM0w3LjM1LDE0LjA3QzYuOTYsMTMuODEsNi40NCwxMy45Myw2LjE4LDE0LjMyQzUuOTIsMTQuNzEsNi4wNCwxNS4yMyw2LjQ0LDE1LjE5WiIgZmlsbD0iaHNsKHZhcigtLXByaW1hcnkpKSIvPgogICAgICAgICAgICA8cGF0aCBkPSJNMTIsMkM2LjQ4LDIsMiw2LjQ4LDIsMTJDMiwxNy41Miw2LjQ4LDIyLDEyLDIyQzE3LjUyLDIyLDIyLDE3LjUyLDIyLDEyQzIyLDYuNDgsMTcuNTIsMiwxMiwyWk0xMiwyMEM3LjU4LDIwLDQsMTYuNDIsNCwxMkM0LDcuNTgsNy41OCw0LDEyLDRDMTYuNDIsNCwyMCw3LjU4LDIwLDEyQzIwLDE2LjQyLDE2LjQyLDIwLDEyLDIwWiIgZmlsbD0iaHNsKHZhcigtLXByaW1hcnkpKSIvPgogICAgICAgIDwvc3ZnPg==";

const VivaMoveLogo = () => (
    <img src={vivaLogoSrc} alt="ViVa Move Logo" className="h-6 w-6" />
);


type AppHeaderProps = {
  user: User | null;
  group: Group | null;
  view: 'member' | 'group' | 'admin';
  memberId?: string;
  memberName?: string;
};

export default function AppHeader({ user, group, view, memberId, memberName }: AppHeaderProps) {

  const renderGroupBranding = () => {
    if (group) {
        return (
            <div className="flex items-center gap-4">
                <Image
                    data-ai-hint="company logo"
                    src={group.logo}
                    alt={`${group.name} Logo`}
                    width={320}
                    height={40}
                    className="rounded-md object-cover"
                />
                <span className="font-headline text-lg font-semibold text-foreground hidden md:block">{group.name}</span>
            </div>
        );
    }
    // Default icon for non-enrolled users
    return (
        <div className="h-10 w-10 flex items-center justify-center rounded-md bg-muted">
            <ShieldQuestion className="h-6 w-6 text-muted-foreground"/>
        </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          
          <div className="flex items-center">
            {view === 'member' && renderGroupBranding()}
            {(view === 'group' && !memberId && group) && (
                <div className="flex items-center gap-4">
                     <Image
                        data-ai-hint="company logo"
                        src={group.logo}
                        alt={`${group.name} Logo`}
                        width={320}
                        height={40}
                        className="rounded-md object-cover"
                    />
                     <span className="font-headline text-lg font-semibold text-foreground hidden md:block">{group.name}</span>
                </div>
            )}
             {view === 'group' && memberId && (
                <Button asChild variant="outline" size="sm">
                    <Link href="/group">
                        <ChevronLeft className="mr-2" />
                        <span>Back to All Members</span>
                    </Link>
                </Button>
            )}
             {view === 'admin' && (
                 <div className="h-10 w-10 flex items-center justify-center rounded-md bg-muted">
                    <Wrench className="h-6 w-6 text-muted-foreground"/>
                </div>
            )}
             {memberName && (
                 <span className="font-headline text-lg font-semibold text-foreground ml-4">
                    Member: {memberName}
                 </span>
             )}
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <VivaMoveLogo />
                <div>
                    <span className="block text-sm font-semibold text-primary/80">ViVa step up challenge</span>
                    <span className="block text-[0.6rem] leading-tight text-muted-foreground">by Viva health solutions</span>
                </div>
             </div>

             {view === 'member' && (
               <div className="flex items-center gap-2">
                 <Button asChild variant="outline">
                    <Link href="/group">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Group Leader View</span>
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
             {(view === 'group' || view === 'admin') && (
                <Button asChild variant="outline">
                    <Link href="/">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Member View</span>
                    </Link>
                </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

    