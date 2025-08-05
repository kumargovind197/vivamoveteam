
"use client";

import React, { useState } from 'react';
import AppHeader from '@/components/app-header';
import ClientDashboard from '@/components/client-dashboard';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { toast } = useToast();

  const handleEnrollment = (code: string) => {
    // In a real app, you'd validate the code against a backend service
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
      <AppHeader onEnroll={handleEnrollment} />
      <main className="flex-1">
        <ClientDashboard isEnrolled={isEnrolled} />
      </main>
      <AdBanner />
    </div>
  );
}
