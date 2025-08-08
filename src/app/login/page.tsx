
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { auth, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithPopup, provider } from '@/lib/firebase';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [resetEmail, setResetEmail] = useState('');
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, [router]);
    
    const handleSignIn = async (values: z.infer<typeof loginSchema>) => {
        try {
          await signInWithEmailAndPassword(auth, values.email, values.password);
          router.push('/');
        } catch (error: any) {
            console.error("Error signing in", error);
            toast({
                variant: "destructive",
                title: "Sign In Failed",
                description: error.message || "An unknown error occurred.",
            });
        }
    };
    
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (error: any) {
             console.error("Error signing in with Google", error);
            toast({
                variant: "destructive",
                title: "Sign In Failed",
                description: error.message || "An unknown error occurred.",
            });
        }
    };

    const handlePasswordReset = async () => {
        if (!resetEmail) {
             toast({
                variant: "destructive",
                title: "Email Required",
                description: "Please enter your email address to reset your password.",
            });
            return;
        }
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            toast({
                title: "Password Reset Email Sent",
                description: `If an account exists for ${resetEmail}, you will receive an email with instructions.`,
            });
            setIsResetDialogOpen(false);
            setResetEmail('');
        } catch (error: any) {
             console.error("Error sending password reset email", error);
             toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Could not send password reset email.",
            });
        }
    }

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
                        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
                            Sign In with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </form>
                        </Form>
                    </div>
                     <div className="mt-4 text-center text-sm">
                        <Button variant="link" className="px-0" onClick={() => setIsResetDialogOpen(true)}>
                            Forgot your password?
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          Enter your email address below and we'll send you a link to reset your password.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reset-email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="reset-email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="col-span-3"
                                placeholder="name@example.com"
                                type="email"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePasswordReset}>Send Reset Link</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
