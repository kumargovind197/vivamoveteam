
"use client";

import React from 'react';
import AppInfoDialog from './app-info-dialog';
import LogoutButton from './logout-button';
import type { MOCK_GROUPS } from '@/lib/mock-data';

type Group = typeof MOCK_GROUPS[keyof typeof MOCK_GROUPS];

interface AppFooterProps {
    view: 'member' | 'group' | 'admin';
    group?: Group | null;
}

export default function AppFooter({ view, group }: AppFooterProps) {
  return (
    <footer className="w-full py-4 px-4 md:px-6 border-t bg-card mt-auto">
      <div className="container mx-auto flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <AppInfoDialog view={view} group={group} />
        <LogoutButton />
      </div>
    </footer>
  );
}
