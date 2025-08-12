
"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/app-header';
import MemberManagement from '@/components/member-management';
import type { User } from 'firebase/auth';
import { MOCK_GROUPS } from '@/lib/mock-data';
import AppFooter from '@/components/app-footer';


// Mock user for development purposes
const mockUser: User = {
  uid: 'mock-group-leader-id',
  email: 'leader@example.com',
  displayName: 'Wellness Leader',
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

const LOGGED_IN_GROUP_ID = 'group-awesome';

export default function GroupPage() {
  const [groupData, setGroupData] = useState<typeof MOCK_GROUPS[keyof typeof MOCK_GROUPS] | null>(null);

  useEffect(() => {
    setGroupData(MOCK_GROUPS[LOGGED_IN_GROUP_ID]);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={mockUser} view="group" group={groupData}/>
      <main className="flex-1">
        <MemberManagement />
      </main>
      <AppFooter view="group" group={groupData} />
    </div>
  );
}
