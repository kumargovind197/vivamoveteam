
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app-header';
import ClientDashboard from '@/components/client-dashboard';
import MessageInbox from '@/components/message-inbox';
import NotificationManager from '@/components/notification-manager';
import { useToast } from '@/hooks/use-toast';
import DataCards from '@/components/data-cards';
import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MOCK_USERS, MOCK_GROUPS } from '@/lib/mock-data';
import AdBanner from '@/components/ad-banner';
import FooterAdBanner from '@/components/footer-ad-banner';

// This now represents the "logged-in" user's ID for the session.
const LOGGED_IN_USER_ID = 'member@example.com';
const USER_GROUP_ID = 'group-awesome'; // The group this user is assigned to.

export default function Home() {
  const [dailyStepGoal, setDailyStepGoal] = useState(8000);
  const [fitData, setFitData] = useState<{steps: number | null, activeMinutes: number | null}>({ steps: null, activeMinutes: null });
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAccessRevoked, setAccessRevoked] = useState(false);
  const [groupData, setGroupData] = useState<typeof MOCK_GROUPS[keyof typeof MOCK_GROUPS] | null>(null);
  
  // States for controlling ad visibility
  const [showPopupAd, setShowPopupAd] = useState(false);
  const [showFooterAd, setShowFooterAd] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

   useEffect(() => {
    // SIMULATE AUTH CHECK: Check if the user still exists in our mock database.
    const userRecord = MOCK_USERS[LOGGED_IN_USER_ID as keyof typeof MOCK_USERS];
    const groupRecord = MOCK_GROUPS[USER_GROUP_ID as keyof typeof MOCK_GROUPS];
    setGroupData(groupRecord);


    if (userRecord) {
        const mockUser: User = {
          uid: 'mock-user-id',
          email: LOGGED_IN_USER_ID,
          displayName: 'Alex Doe',
          photoURL: 'https://placehold.co/100x100.png',
          providerId: 'password',
          emailVerified: true, isAnonymous: false, metadata: {}, providerData: [], tenantId: null,
          delete: async () => {},
          getIdToken: async () => 'mock-token',
          getIdTokenResult: async () => ({ token: 'mock-token', expirationTime: '', authTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null, claims: {}, }),
          reload: async () => {},
          toJSON: () => ({}),
        };
        setCurrentUser(mockUser);
        setAccessRevoked(false);

        // Check the group's ad setting from mock data
        if (groupRecord?.adsEnabled) {
             // Logic to decide which ad to show, could be random or based on other factors
            const adDecision = Math.random();
            if (adDecision < 0.5) {
                setShowPopupAd(true);
                setShowFooterAd(false);
            } else {
                setShowPopupAd(false);
                setShowFooterAd(true);
            }
        } else {
            setShowPopupAd(false);
            setShowFooterAd(false);
        }

    } else {
        setCurrentUser(null);
        setAccessRevoked(true);
    }
  }, []);

  const adContent = {
      description: 'Ad for ergonomic office chairs',
      imageUrl: 'https://placehold.co/400x300.png',
      targetUrl: '#',
  };
  const footerAdContent = {
      description: 'Horizontal ad banner for wellness retreats',
      imageUrl: 'https://placehold.co/728x90.png',
      targetUrl: '#',
  };


  // Render a "logged out" or "access revoked" state if the user has been deleted.
  if (isAccessRevoked || !currentUser) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
            <Card className="w-full max-w-md m-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="text-destructive"/>
                        Access Revoked
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Your access has been revoked by the group administrator. If you believe this is an error, please contact your group admin.</p>
                     <Button asChild className="mt-6 w-full">
                        <Link href="/login">
                            Return to Login
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={currentUser} group={groupData} view="member" />
      <NotificationManager />
      <main className="flex-1">
        <DataCards user={currentUser} onDataFetched={setFitData} />
        <ClientDashboard user={currentUser} fitData={fitData} view="member" group={groupData}/>
        <MessageInbox />
      </main>
      <FooterAdBanner isVisible={showFooterAd} adContent={footerAdContent} />
    </div>
  );
}
