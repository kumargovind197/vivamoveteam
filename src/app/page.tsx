
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app-header';
import ClientDashboard from '@/components/client-dashboard';
import MessageInbox from '@/components/message-inbox';
import AdBanner from '@/components/ad-banner';
import NotificationManager from '@/components/notification-manager';
import FooterAdBanner from '@/components/footer-ad-banner';
import { useToast } from '@/hooks/use-toast';
import DataCards from '@/components/data-cards';
import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MOCK_USERS } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// This now represents the "logged-in" user's ID for the session.
const LOGGED_IN_USER_ID = 'patient@example.com';

const adContent = {
    popup: {
        description: "Special offer on smart watches",
        imageUrl: "https://placehold.co/400x300.png",
        targetUrl: "#"
    },
    footer: {
        description: "Horizontal banner ad for gym membership",
        imageUrl: "https://placehold.co/728x90.png",
        targetUrl: "#"
    }
};

export default function Home() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [dailyStepGoal, setDailyStepGoal] = useState(8000);
  const [fitData, setFitData] = useState<{steps: number | null, activeMinutes: number | null}>({ steps: null, activeMinutes: null });
  const [isEnrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [showPopupAd, setShowPopupAd] = useState(false);
  const [showFooterAd, setShowFooterAd] = useState(true);

  // The user's state is now derived from the centralized mock data
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAccessRevoked, setAccessRevoked] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

   useEffect(() => {
    // SIMULATE AUTH CHECK: Check if the user still exists in our mock database.
    const userRecord = MOCK_USERS[LOGGED_IN_USER_ID as keyof typeof MOCK_USERS];
    if (userRecord) {
        const mockUser: User = {
          uid: 'mock-user-id',
          email: LOGGED_IN_USER_ID,
          displayName: 'John Doe',
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
    } else {
        setCurrentUser(null);
        setAccessRevoked(true);
    }
  }, []);

  const handleEnrollment = () => {
    if (enrollmentCode.trim() !== '') {
      setIsEnrolled(true);
      setEnrollmentDialogOpen(false);
      setEnrollmentCode('');
      toast({
        title: 'Enrollment Successful!',
        description: 'You are now connected with Wellness Clinic.',
      });
      // In a real app, you would likely hide ads for enrolled users.
      // We will simulate this by hiding the ads upon enrollment.
      setShowPopupAd(false);
      setShowFooterAd(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Code',
        description: 'Please enter a valid enrollment code.',
      });
    }
  };

  useEffect(() => {
    if (!isEnrolled) {
        const timer = setTimeout(() => {
            setShowPopupAd(true);
        }, 5000); // Show popup ad after 5 seconds for non-enrolled users

        return () => clearTimeout(timer);
    } else {
        setShowPopupAd(false); // Ensure popup is hidden if user enrolls
    }
  }, [isEnrolled]);


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
                    <p className="text-muted-foreground">Your access to ViVa move has been revoked by the clinic administrator. If you believe this is an error, please contact your clinic admin.</p>
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
      <AppHeader user={currentUser} isEnrolled={isEnrolled} onEnrollClick={() => setEnrollmentDialogOpen(true)} view="client" />
      <main className="flex-1">
        <DataCards user={currentUser} onDataFetched={setFitData} />
        <ClientDashboard isEnrolled={isEnrolled} user={currentUser} fitData={fitData} dailyStepGoal={dailyStepGoal} onStepGoalChange={setDailyStepGoal} view="client" />
        {isEnrolled && <MessageInbox />}
        {!isEnrolled && <AdBanner isPopupVisible={showPopupAd} adContent={adContent.popup}/>}
        <NotificationManager user={currentUser} currentSteps={fitData.steps} dailyStepGoal={dailyStepGoal}/>
      </main>
      {!isEnrolled && <FooterAdBanner isVisible={showFooterAd} adContent={adContent.footer}/>}
      
      <Dialog open={isEnrollmentDialogOpen} onOpenChange={setEnrollmentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enroll in Clinic</DialogTitle>
            <DialogDescription>
              Enter the unique enrollment code provided by your clinic. This will link your app to the clinic's dashboard. This link cannot be used by anyone else and will expire in 24 hours.
            </DialogDescription>
             <div className="text-sm pt-4 text-muted-foreground">
                <p className="font-semibold flex items-center gap-2"><Info className="h-4 w-4" />First Time Setup:</p>
                <ol className="list-decimal list-inside pl-2 space-y-1 mt-2">
                    <li>Download the PWA by selecting 'Add to Home Screen' in your browser menu.</li>
                    <li>Use the link from your email to set your password.</li>
                    <li>Log in to the app to complete your registration.</li>
                </ol>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="enrollment-code" className="text-right">
                Code
              </Label>
              <Input
                id="enrollment-code"
                value={enrollmentCode}
                onChange={(e) => setEnrollmentCode(e.target.value)}
                className="col-span-3"
                placeholder="Enter your code"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollmentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEnrollment}>Enroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    