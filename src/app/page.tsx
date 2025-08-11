
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppHeader from '@/components/app-header';
import ClientDashboard from '@/components/client-dashboard';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import DataCards from '@/components/data-cards';
import FooterAdBanner from '@/components/footer-ad-banner';
import NotificationManager from '@/components/notification-manager';
import type { User } from 'firebase/auth';
import MessageInbox from '@/components/message-inbox';
import { Button } from '@/components/ui/button';
import { Download, LogIn, AlertTriangle } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


// This now represents the "logged-in" user's ID for the session.
const LOGGED_IN_USER_ID = 'patient@example.com';

// Mock ad data that would be fetched from the admin settings
const MOCK_AD_SETTINGS = {
    showPopupAd: false,
    popupAds: [
      { id: 1, description: 'Get 20% off your first order!', imageUrl: 'https://placehold.co/400x300.png', targetUrl: 'https://example.com/supplements' },
      { id: 2, description: 'Find your calm in just 5 minutes a day.', imageUrl: 'https://placehold.co/400x300.png', targetUrl: 'https://example.com/meditation' },
    ],
    showFooterAd: false,
    footerAds: [
      { id: 1, description: '30% off new running shoes.', imageUrl: 'https://placehold.co/728x90.png', targetUrl: 'https://example.com/shoes' },
      { id: 2, description: 'Healthy eating, delivered to you.', imageUrl: 'https://placehold.co/728x90.png', targetUrl: 'https://example.com/meals' },
    ]
};


export default function Home() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [fitData, setFitData] = useState<{steps: number | null, activeMinutes: number | null}>({ steps: 5432, activeMinutes: 25 });
  const [dailyStepGoal, setDailyStepGoal] = useState(10000);

  const [adSettings] = useState(MOCK_AD_SETTINGS);
  const [popupAdToShow, setPopupAdToShow] = useState<(typeof adSettings.popupAds)[0] | null>(null);
  const [footerAdToShow, setFooterAdToShow] = useState<(typeof adSettings.footerAds)[0] | null>(null);
  
  // The user's state is now derived from the centralized mock data
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAccessRevoked, setAccessRevoked] = useState(false);

  const { toast } = useToast();
  
  useEffect(() => {
    // SIMULATE AUTH CHECK: Check if the user still exists in our mock database.
    const userRecord = MOCK_USERS[LOGGED_IN_USER_ID as keyof typeof MOCK_USERS];
    if (userRecord) {
        // This is a simplified mock. In a real app, this would be the full User object from Firebase Auth.
        const mockUser: User = {
          uid: 'mock-user-id',
          email: LOGGED_IN_USER_ID,
          displayName: 'John Doe',
          photoURL: 'https://placehold.co/100x100',
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
    } else {
        // User has been removed from the mock DB, simulating logout/access revocation.
        setCurrentUser(null);
        setAccessRevoked(true);
    }


    // Ad rotation logic
    if (adSettings.showPopupAd && adSettings.popupAds.length > 0) {
        const randomIndex = Math.floor(Math.random() * adSettings.popupAds.length);
        setPopupAdToShow(adSettings.popupAds[randomIndex]);
    }
    if (adSettings.showFooterAd && adSettings.footerAds.length > 0) {
        const randomIndex = Math.floor(Math.random() * adSettings.footerAds.length);
        setFooterAdToShow(adSettings.footerAds[randomIndex]);
    }
  }, [adSettings]);


  const handleEnrollment = () => {
    // This function is now just a placeholder for a successful enrollment via email link.
    // In a real app, this might be triggered after a user clicks a magic link and sets their password.
      setIsEnrolled(true);
      toast({
        title: "Successfully Enrolled!",
        description: "You are now connected with 'Wellness Clinic'. Consider adding this app to your home screen for easy access.",
        duration: 10000, // Keep toast on screen longer
        action: (
          <Button>
              <Download className="mr-2"/>
              Add to Home Screen
          </Button>
        ),
      });
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
                    <p className="text-muted-foreground">Your access to ViVa move has been revoked by the clinic administrator. If you believe this is an error, please contact your clinic.</p>
                     <Button asChild className="mt-6 w-full">
                        <Link href="/login">
                            <LogIn className="mr-2" />
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
      <AppHeader user={currentUser} isEnrolled={isEnrolled} view="client"/>
      <main className="flex-1">
        {/* In a real app, a user would be redirected to /login if not authenticated */}
        <div className="container mx-auto px-4 py-4 text-center">
            <Button asChild>
                <Link href="/login">
                    <LogIn className="mr-2" />
                    Go to Login Page (Prototype)
                </Link>
            </Button>
        </div>
        <DataCards user={currentUser} onDataFetched={setFitData} />
        <ClientDashboard view="client" isEnrolled={isEnrolled} user={currentUser} fitData={fitData} dailyStepGoal={dailyStepGoal} onStepGoalChange={setDailyStepGoal} />
        <MessageInbox />
      </main>
      <NotificationManager 
        user={currentUser}
        currentSteps={fitData.steps}
        dailyStepGoal={dailyStepGoal}
      />
      
      <AdBanner 
        isPopupVisible={adSettings.showPopupAd && !!popupAdToShow} 
        adContent={popupAdToShow}
      />
      <FooterAdBanner 
        isVisible={adSettings.showFooterAd && !!footerAdToShow}
        adContent={footerAdToShow}
      />
    </div>
  );
}
