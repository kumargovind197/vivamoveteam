
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const lowerCaseEmail = email.toLowerCase();
      // Find the user key case-insensitively
      const userKey = Object.keys(MOCK_USERS).find(key => key.toLowerCase() === lowerCaseEmail);
      const user = userKey ? MOCK_USERS[userKey as keyof typeof MOCK_USERS] : undefined;
      
      if (user && user.password === password) {
        toast({
          title: "Login Successful",
          description: `Redirecting to ${user.role} dashboard...`,
        });
        router.push(user.redirect);
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  const handlePasswordRecovery = () => {
    if (!email) {
        toast({
            variant: 'destructive',
            title: 'Email Required',
            description: 'Please enter your admin email address to recover your password.',
        });
        return;
    }
    if (email.toLowerCase() !== 'admin@example.com') {
         toast({
            variant: 'destructive',
            title: 'Recovery Not Applicable',
            description: 'Password recovery is only available for the main administrator account.',
        });
        return;
    }

    // Simulate sending a password reset email
    toast({
        title: 'Password Recovery Email Sent',
        description: `If an account exists for ${email}, a recovery link has been sent.`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email or Group ID</Label>
            <Input
              id="email"
              type="text"
              placeholder="e.g., member@example.com or group-awesome"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                />
                <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Signing In...' : 'Sign In'}
            {!isLoading && <LogIn className="ml-2" />}
          </Button>
           <Button 
            type="button" 
            variant="link" 
            size="sm" 
            onClick={handlePasswordRecovery}
            className="text-muted-foreground"
            >
            Forgot Password? (Admin only)
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
