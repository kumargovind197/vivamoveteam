
"use client";

import React from 'react';
import AppHeader from '@/components/app-header';
import MemberManagement from '@/components/member-management';
import type { User } from 'firebase/auth';

// Mock user for development purposes
const mockUser: User = {
  uid: 'mock-group-id',
  email: 'group@example.com',
  displayName: 'Group Admin',
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


export default function GroupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={mockUser} view="group" />
      <main className="flex-1">
        <MemberManagement />
      </main>
    </div>
  );
}
