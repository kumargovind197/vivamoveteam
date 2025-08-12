
"use client";

import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from './ui/dialog';
import { Info, Link } from 'lucide-react';
import type { MOCK_GROUPS } from '@/lib/mock-data';

type Group = typeof MOCK_GROUPS[keyof typeof MOCK_GROUPS];

interface AppInfoDialogProps {
    view: 'member' | 'group' | 'admin';
    group?: Group | null;
}

const vivaLogoSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEyLjI1LDE4LjVDMTIuMjUsMTguNSwxMi4yNSwxOC41LDEyLjI1LDE4LjVMMTIuNTUsMTguODRDMTMuMjYsMTkuNjMsMTQuMDEsMjAuMywxNC43OSwyMC44NEwxNS4zMiwyMS4yMkMxNS44NiwyMS41NywxNi44NCwyMS40OSwxNy4yOSwyMC45N0MxNy43NCwyMC40NSwxNy42NSwxOS40NywxNy4xMSwxOS4xMkwxNi41OCwxOC43NEMxNS44LDE4LjIsMTUuMDUsMTcuNTMsMTQuMzQsMTYuNzRMMTMuODEsMTYuMTRDMTMuNzIsMTYuMDMsMTMuNTYsMTYuMDMsMTMuNDYsNi4xM0wxMy4xOSwxNS43N0MxMi40OCwxNC45OCwxMS43MywxNC4zMSwxMC45NSwxMy43N0wxMC40MiwxMy4zOUM5Ljg4LDEzLjA0LDguOSwxMy4xMiw4LjQ1LDEzLjY0QzgsMTQuMTYsOC4wOSwxNS4xNCw4LjYzLDE1LjQ5TDkuMTYsMTUuODdDOS45NCwxNi40MSwxMC42OSwxNy4wOCwxMS40LDE3Ljg3TDExLjcsMTguMkMxMS45NiwxOC40OSwxMi4yNSwxOC41LDEyLjI1LDE4LjVaIiBmaWxsPSJoc2wodmFyKC0tcHJpbWFyeSkpIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC4xNSwxMC42MkwxMC4zNSwxMC44NUMxMC45OCwxMS41NSwxMS41MSwxMi4zMywxMS45MSwxMy4xNkwxMi4wNywxMy41M0MxMi4zLDE0LjA3LDEyLjk4LDE0LjMsMTMuNTIsMTQuMDdDMTQuMDYsMTMuODQsMTQuMjksMTMuMTYsMTQuMDYsMTIuNjJMMTMuOSwxMi4yNUMxMy41LDExLjQyLDEyLjk3LDEwLjY0LDEyLjM0LDkuOTRMMTIuMTQsOS43MUMxMS44OCw5LjQxLDExLjQyLDkuNDEsMTEuMTYsOS43MUwxMC43NCwxMC4xOUMxMC4wNCwxMC45Nyw5LjQzLDExLjgzLDguOTYsMTIuNzJMOC43OSwxMy4wNEM4LjU1LDEzLjUsOC44MSwxNC4wNyw5LjMsMTQuMjhDOS43OSwxNC40OSwxMC4zNiwxNC4yMywxMC41NywxMy43NEwxMC43NCwxMy40MkMxMS4yMSwxMi41MywxMS44MiwxMS42NywxMi41MiwxMC44OUwxMS4xNiw5LjcxQzEwLjksOS40MSwxMC40MSw5LjQxLDEwLjE1LECw5LjQxQzEwLjE1LDEwLjYyWk02LjQ0LDE1LjE5TDYuNTQsMTUuMjVDNi45MywxNS41MSw3LjI4LDE1LjgsNy41OCwxNi4xNEw3Ljc0LDE2LjMyQzcuOTksMTYuNiwwLjQyLDE2LjY1LDguNywxNi40QzkuMDcsMTYuMDYsOS4wMiwxNS41NCw4LjY1LDE1LjJMMC40OSwxNS4wMkM4LjE5LDE0LjY4LDcuODQsMTQuMzksNy40NSwxNC4xM0w3LjM1LDE0LjA3QzYuOTYsMTMuODEsNi40NCwxMy45Myw2LjE4LDE0LjMyQzUuOTIsMTQuNzEsNi4wNCwxNS4yMyw2LjQ0LDE1LjE5WiIgZmlsbD0iaHNsKHZhcigtLXByaW1hcnkpKSIvPgogICAgICAgICAgICA8cGF0aCBkPSJNMTIsMkM2LjQ4LDIsMiw2LjQ4LDIsMTJDMiwxNy41Miw2LjQ4LDIyLDEyLDIyQzE3LjUyLDIyLDIyLDE3LjUyLDIyLDEyQzIyLDYuNDgsMTcuNTIsMiwxMiwyWk0xMiwyMEM3LjU4LDIwLDQsMTYuNDIsNCwxMkM0LDcuNTgsNy41OCw0LDEyLDRDMTYuNDIsNCwyMCw3LjU4LDIwLDEyQzIwLDE2LjQyLDE2LjQyLDIwLDEyLDIwWiIgZmlsbD0iaHNsKHZhcigtLXByaW1hcnkpKSIvPgogICAgICAgIDwvc3ZnPg==";

const VivaMoveLogo = () => (
    <img src={vivaLogoSrc} alt="ViVa Move Logo" className="h-6 w-6" />
);

export default function AppInfoDialog({ view, group }: AppInfoDialogProps) {
  const currentYear = new Date().getFullYear();

  const getOrganisationName = () => {
      if (view === 'admin') return 'Main Admin';
      if (group) return group.name;
      return 'Not Enrolled';
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="text-muted-foreground">
          <Info className="mr-2 h-4 w-4" />
          App Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
             <VivaMoveLogo />
             <div>
                <DialogTitle className="text-xl">ViVa step up challenge</DialogTitle>
                <DialogDescription>A motivational step tracking app.</DialogDescription>
             </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">App Version:</span>
                <span className="font-medium">2.025.2</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Organisation:</span>
                <span className="font-medium">{getOrganisationName()}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Admin:</span>
                <span className="font-medium">Contact your admin for support</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">URL:</span>
                <span className="font-medium text-xs text-muted-foreground italic">Link will be available soon</span>
            </div>
        </div>
        <DialogFooter>
          <p className="text-xs text-muted-foreground w-full text-center">
            &copy; {currentYear} Viva health solutions. All rights reserved.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    