
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app-header';
import PatientManagement from '@/components/patient-management';
import { auth, onAuthStateChanged, User } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

// In a real application, this would come from a database.
const ADMIN_USER_IDS = ['INSERT_YOUR_ADMIN_UID_HERE'];


export default function ClinicPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            // Check if the user is an admin
            if (ADMIN_USER_IDS.includes(currentUser.uid)) {
                setIsAuthorized(true);
            }
          } else {
            router.push('/login');
          }
          setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center">
                <p>Checking authorization...</p>
            </div>
        );
    }
    
    if (!isAuthorized) {
        return (
             <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                            <span>Access Denied</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">You do not have permission to view this page. Please contact your administrator if you believe this is an error.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={user} view="clinic" />
      <main className="flex-1">
        <PatientManagement />
      </main>
    </div>
  );
}
