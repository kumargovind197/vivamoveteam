
"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/app-header';
import ClientDashboard from '@/components/client-dashboard';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { auth, onAuthStateChanged, User } from '@/lib/firebase';


export default function Home() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
      <AppHeader onEnroll={handleEnrollment} user={user} />
      <main className="flex-1">
        <ClientDashboard isEnrolled={isEnrolled} user={user} />
      </main>
      <AdBanner />
    </div>
  );
}
