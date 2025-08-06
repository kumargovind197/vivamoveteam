
"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/app-header';
import ClientDashboard from '@/components/client-dashboard';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { auth, onAuthStateChanged, User } from '@/lib/firebase';
import DataCards from '@/components/data-cards';
import FooterAdBanner from '@/components/footer-ad-banner';
import NotificationManager from '@/components/notification-manager';


export default function Home() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [fitData, setFitData] = useState<{steps: number | null, activeMinutes: number | null}>({ steps: null, activeMinutes: null });
  const [showPopupAd, setShowPopupAd] = useState(false); // Admin toggle for popup
  const [showFooterAd, setShowFooterAd] = useState(false); // Admin toggle for footer
  const { toast } = useToast();
  const [dailyStepGoal, setDailyStepGoal] = useState(10000);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setFitData({ steps: null, activeMinutes: null });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEnrollment = (code: string) => {
    if (code) {
      setIsEnrolled(true);
      toast({
        title: "Successfully Enrolled!",
        description: "You are now connected with 'Wellness Clinic'.",
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
      <AppHeader onEnroll={handleEnrollment} user={user} isEnrolled={isEnrolled} />
      <main className="flex-1">
        <DataCards user={user} onDataFetched={setFitData} />
        <ClientDashboard isEnrolled={isEnrolled} user={user} fitData={fitData} dailyStepGoal={dailyStepGoal} onStepGoalChange={setDailyStepGoal} />
      </main>
      <NotificationManager 
        user={user}
        currentSteps={fitData.steps}
        dailyStepGoal={dailyStepGoal}
      />
      <AdBanner isPopupVisible={showPopupAd} />
      <FooterAdBanner isVisible={showFooterAd} />
    </div>
  );
}
