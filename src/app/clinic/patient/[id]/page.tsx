
"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import AppHeader from '@/components/app-header';
import ClientDashboard from '@/components/client-dashboard';
import DataCards from '@/components/data-cards';
import type { User } from 'firebase/auth';

// Mock user for development purposes - this would be the patient's user object
const mockPatientUser: User = {
  uid: 'mock-user-id-from-clinic-view',
  email: 'patient@example.com',
  displayName: 'John Doe',
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

// Mock clinic user for the header
const mockClinicUser: User = {
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


export default function PatientDetailPage() {
  const [fitData, setFitData] = useState<{steps: number | null, activeMinutes: number | null}>({ steps: 5432, activeMinutes: 25 });
  const [dailyStepGoal, setDailyStepGoal] = useState(10000);
  const params = useParams();
  const patientId = params.id as string;

  // In a real app, you would use patientId to fetch the patient's data.

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* The header knows it's in a patient detail view from the 'clinic' view context */}
      <AppHeader user={mockClinicUser} view="clinic" patientId={patientId} patientName={mockPatientUser.displayName || 'Patient'} />
      <main className="flex-1">
        {/* These components are for the patient being viewed */}
        <DataCards user={mockPatientUser} onDataFetched={setFitData} />
        <ClientDashboard view="clinic" isEnrolled={true} user={mockPatientUser} fitData={fitData} dailyStepGoal={dailyStepGoal} onStepGoalChange={setDailyStepGoal} />
      </main>
      {/* Ads and notifications would typically be disabled in a clinical view */}
    </div>
  );
}

    