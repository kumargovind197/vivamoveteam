
"use client";

import React from 'react';
import AppHeader from '@/components/app-header';
import PatientManagement from '@/components/patient-management';
import type { User } from 'firebase/auth';

// Mock user for development purposes
const mockUser: User = {
  uid: 'mock-clinic-id',
  email: 'clinic@example.com',
  displayName: 'Dr. Smith',
  photoURL: 'https://placehold.co/100x100',
  providerId: 'password',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    token: 'mock-token',
    expirationTime: '',
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
};


export default function ClinicPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={mockUser} view="clinic" />
      <main className="flex-1">
        <PatientManagement />
      </main>
    </div>
  );
}
