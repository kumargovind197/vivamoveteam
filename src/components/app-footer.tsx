
"use client";

import React from 'react';
import AppInfoDialog from './app-info-dialog';

export default function AppFooter() {
  return (
    <footer className="w-full py-4 px-4 md:px-6 border-t bg-card mt-auto">
      <div className="container mx-auto flex items-center justify-center text-sm text-muted-foreground">
        <AppInfoDialog />
      </div>
    </footer>
  );
}
