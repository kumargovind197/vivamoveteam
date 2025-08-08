
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, provider, signInWithPopup, onAuthStateChanged } from '@/lib/firebase';

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, redirect to home page.
                router.push('/');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [router]);
    
    const handleSignIn = async () => {
        try {
          await signInWithPopup(auth, provider);
          router.push('/');
        } catch (error) {
          console.error("Error signing in with Google", error);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/50">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center items-center gap-3">
                        <HeartPulse className="h-8 w-8 text-primary" />
                        <span className="font-headline text-2xl font-bold text-primary">ViVa move</span>
                    </div>
                    <CardTitle className="font-headline text-2xl">Welcome</CardTitle>
                    <CardDescription>Sign in to continue to your health dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                         <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                Continue with
                                </span>
                            </div>
                        </div>
                         <Button onClick={handleSignIn} className="w-full">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 64.5C305.1 102.4 278.2 96 248 96c-88.3 0-160 71.7-160 160s71.7 160 160 160c92.6 0 151.3-63.1 156.4-102.6H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
                            Sign in with Google
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
