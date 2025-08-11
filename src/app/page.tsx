
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppHeader from '@/components/app-header';
import MemberDashboard from '@/components/member-dashboard';
import { useToast } from '@/hooks/use-toast';
import DataCards from '@/components/data-cards';
import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { LogIn, AlertTriangle } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// This now represents the "logged-in" user's ID for the session.
const LOGGED_IN_USER_ID = 'member@example.com';

export default function Home() {
  const [isEnrolled, setIsEnrolled] = useState(true);
  const [fitData, setFitData] = useState<{steps: number | null}>({ steps: 5432 });

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
          displayName: 'Jane Doe',
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
  }, []);

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
                    <p className="text-muted-foreground">Your access to StepTrack Wellness has been revoked by the group administrator. If you believe this is an error, please contact your group admin.</p>
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
      <AppHeader user={currentUser} isEnrolled={isEnrolled} view="member"/>
      <main className="flex-1">
        <DataCards user={currentUser} onDataFetched={setFitData} />
        <MemberDashboard view="member" isEnrolled={isEnrolled} user={currentUser} fitData={fitData} />
      </main>
    </div>
  );
}
