
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircle, Wrench, ShieldQuestion, Users, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User } from 'firebase/auth';
import { MOCK_GROUPS } from '@/lib/mock-data';
import { vivaLogoSrc } from '@/lib/logo-store';

type Group = typeof MOCK_GROUPS[keyof typeof MOCK_GROUPS];

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
                <div className="relative w-40 h-10 bg-muted rounded-md shrink-0">
                    <Image
                        fill
                        data-ai-hint="company logo"
                        src={group.logo}
                        alt={`${group.name} Logo`}
                        className="rounded-md object-cover"
                    />
                </div>
            </div>
        );
    }
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
                    <div className="relative w-40 h-10">
                         <Image
                            fill
                            data-ai-hint="company logo"
                            src={group.logo}
                            alt={`${group.name} Logo`}
                            className="rounded-md object-cover"
                        />
                    </div>
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
                <>
                    <Button asChild variant="outline">
                        <Link href="/group">
                            <Users className="mr-2 h-4 w-4" />
                            <span>Group Leader View</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin">
                            <Wrench className="mr-2 h-4 w-4" />
                            <span>Admin View</span>
                        </Link>
                    </Button>
                </>
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
