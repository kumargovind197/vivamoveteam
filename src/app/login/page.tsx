
import { Footprints } from 'lucide-react';
import LoginForm from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Footprints className="h-12 w-12 text-primary" />
          <h1 className="font-headline text-4xl font-bold text-primary">Step-Up Challenge</h1>
          <p className="text-muted-foreground">Please sign in to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
