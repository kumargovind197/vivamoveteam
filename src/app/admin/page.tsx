
"use client";

import React from 'react';
import AppHeader from '@/components/app-header';
import AdminPanel from '@/components/admin-panel';
import type { User } from 'firebase/auth';
import AppFooter from '@/components/app-footer';

// Mock user for development purposes
const mockUser: User = {
  uid: 'mock-admin-id',
  email: 'admin@example.com',
  displayName: 'Admin User',
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


export default function AdminPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={mockUser} view="admin" group={null} />
      <main className="flex-1">
        <AdminPanel />
      </main>
      <AppFooter view="admin" />
    </div>
  );
}
