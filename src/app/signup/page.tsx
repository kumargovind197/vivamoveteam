// src/app/signup/page.tsx

import SignUpForm from "@/components/signup-form";


export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <SignUpForm />
    </div>
  );
}