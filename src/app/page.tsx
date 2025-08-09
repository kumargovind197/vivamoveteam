
"use client";

import React, { useState, useEffect } from 'react';
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
import { Download } from 'lucide-react';

// Mock user for development purposes
const mockUser: User = {
  uid: 'mock-user-id',
  email: 'patient@example.com',
  displayName: 'John Doe',
  photoURL: 'https://placehold.co/100x100',
  providerId: 'password',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    token: 'mock-token',
    expirationTime: '',
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
};


export default function Home() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [fitData, setFitData] = useState<{steps: number | null, activeMinutes: number | null}>({ steps: 5432, activeMinutes: 25 });
  const [showPopupAd, setShowPopupAd] = useState(false); // Admin toggle for popup
  const [showFooterAd, setShowFooterAd] = useState(false); // Admin toggle for footer
  const { toast } = useToast();
  const [dailyStepGoal, setDailyStepGoal] = useState(10000);

  const handleEnrollment = (code: string) => {
    if (code) {
      setIsEnrolled(true);
      toast({
        title: "Successfully Enrolled!",
        description: "You are now connected with 'Wellness Clinic'. Consider adding this app to your home screen for easy access.",
        duration: 10000, // Keep toast on screen longer
        action: (
          <Button>
              <Download className="mr-2"/>
              Install App
          </Button>
        ),
      });
    } else {
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: "Please enter a valid invitation code.",
      });
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader onEnroll={handleEnrollment} user={mockUser} isEnrolled={isEnrolled} view="client"/>
      <main className="flex-1">
        <DataCards user={mockUser} onDataFetched={setFitData} />
        <ClientDashboard view="client" isEnrolled={isEnrolled} user={mockUser} fitData={fitData} dailyStepGoal={dailyStepGoal} onStepGoalChange={setDailyStepGoal} />
        <MessageInbox />
      </main>
      <NotificationManager 
        user={mockUser}
        currentSteps={fitData.steps}
        dailyStepGoal={dailyStepGoal}
      />
      <AdBanner isPopupVisible={showPopupAd} />
      <FooterAdBanner isVisible={showFooterAd} />
    </div>
  );
}
