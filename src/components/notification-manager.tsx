
'use client';

import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from 'firebase/auth';
import { getMotivationalMessage } from '@/lib/motivational-messages';
import { Footprints } from 'lucide-react';

interface NotificationManagerProps {
  user: User | null;
  currentSteps: number | null;
  dailyStepGoal: number;
}

// Milestones to trigger notifications
const MILESTONES = [
    { percent: 25, id: 'quarter_way' },
    { percent: 50, id: 'halfway' },
    { percent: 75, id: 'almost_there' },
    { percent: 100, id: 'goal_reached' },
    { percent: 125, id: 'goal_crushed' },
];

export default function NotificationManager({ user, currentSteps, dailyStepGoal }: NotificationManagerProps) {
  const { toast } = useToast();
  
  // Using refs to track sent notifications for the current session/day
  // In a real app, this state should be stored per-user, per-day in a database
  const sentNotifications = useRef(new Set<string>());

  useEffect(() => {
    // Reset notification tracking at the start of a new day
    const now = new Date();
    const lastReset = localStorage.getItem('lastNotificationReset');
    if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
        sentNotifications.current.clear();
        localStorage.setItem('lastNotificationReset', now.toISOString());
    }

    if (!user || currentSteps === null || dailyStepGoal === 0) {
      return;
    }

    const checkAndSendNotification = () => {
      const progress = (currentSteps / dailyStepGoal) * 100;
      
      // Find the highest milestone achieved that hasn't been sent
      let milestoneToSend = null;
      for (const milestone of MILESTONES) {
          if (progress >= milestone.percent && !sentNotifications.current.has(milestone.id)) {
              milestoneToSend = milestone;
          }
      }

      if (milestoneToSend) {
        sentNotifications.current.add(milestoneToSend.id); // Mark as sent immediately

        const message = getMotivationalMessage(
            milestoneToSend.id, 
            user.displayName?.split(' ')[0] || 'User',
            currentSteps,
            dailyStepGoal
        );
        
        toast({
          title: (
            <div className="flex items-center gap-2">
              <Footprints className="h-5 w-5 text-primary" />
              <span className="font-headline">Go, You!</span>
            </div>
          ),
          description: message,
        });
      }
    };

    checkAndSendNotification();

  }, [currentSteps, dailyStepGoal, user, toast]);

  return null; // This is a non-visual component
}
