
"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/app-header';
import PatientManagement from '@/components/patient-management';
import type { User } from 'firebase/auth';
import { MOCK_CLINICS } from '@/lib/mock-data';


// Mock user for development purposes
const mockUser: User = {
  uid: 'mock-clinic-id',
  email: 'clinic@example.com',
  displayName: 'Dr. Smith',
  photoURL: 'https://placehold.co/100x100.png',
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

const LOGGED_IN_CLINIC_ID = 'clinic-wellness';

export default function ClinicPage() {
  const [clinicData, setClinicData] = useState<typeof MOCK_CLINICS[keyof typeof MOCK_CLINICS] | null>(null);

  useEffect(() => {
    setClinicData(MOCK_CLINICS[LOGGED_IN_CLINIC_ID]);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={mockUser} view="clinic" clinic={clinicData}/>
      <main className="flex-1">
        <PatientManagement />
      </main>
    </div>
  );
}
