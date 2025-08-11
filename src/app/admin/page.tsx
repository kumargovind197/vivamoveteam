
"use client";

import React, { useState } from 'react';
import AppHeader from '@/components/app-header';
import AdminPanel from '@/components/admin-panel';
import type { User } from 'firebase/auth';

// Mock user for development purposes
const mockUser: User = {
  uid: 'mock-admin-id',
  email: 'admin@example.com',
  displayName: 'Admin User',
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


export default function AdminPage() {
  // In a real app, this state would be persisted to a database (e.g., Firestore)
  // and likely managed with a global state manager or context.
  const [adSettings, setAdSettings] = useState({
    popupAds: [
      {
        id: 1,
        description: 'Get 20% off your first order and boost your wellness journey!',
        imageUrl: 'https://placehold.co/400x300.png',
        targetUrl: 'https://example.com/supplements'
      }
    ],
    footerAds: [
        {
        id: 1,
        description: 'Find the perfect pair of running shoes to crush your goals. 30% off for new customers!',
        imageUrl: 'https://placehold.co/728x90.png',
        targetUrl: 'https://example.com/shoes'
    }
    ]
  });

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={mockUser} view="client" />
      <main className="flex-1">
        {/* Ad settings are passed down to the panel */}
        <AdminPanel adSettings={adSettings} setAdSettings={setAdSettings} />
      </main>
    </div>
  );
}
