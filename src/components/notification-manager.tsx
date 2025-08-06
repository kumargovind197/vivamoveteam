
'use client';

import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from 'firebase/auth';
import { generateMotivation } from '@/ai/flows/generate-motivation-flow';
import { Footprints } from 'lucide-react';

interface NotificationManagerProps {
  user: User | null;
  currentSteps: number | null;
  dailyStepGoal: number;
}

// Milestones to trigger notifications
const MILESTONES = [
    { percent: 50, id: 'halfway' },
    { percent: 75, id: 'almost_there' },
    { percent: 100, id: 'goal_reached' },
];

export default function NotificationManager({ user, currentSteps, dailyStepGoal }: NotificationManagerProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
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

    if (!user || currentSteps === null || isGenerating) {
      return;
    }

    const checkAndSendNotification = async () => {
      const progress = (currentSteps / dailyStepGoal) * 100;
      
      for (const milestone of MILESTONES) {
        if (progress >= milestone.percent && !sentNotifications.current.has(milestone.id)) {
          
          setIsGenerating(true);
          sentNotifications.current.add(milestone.id); // Mark as sent immediately

          try {
            const result = await generateMotivation({
              userName: user.displayName?.split(' ')[0] || 'User',
              currentSteps: currentSteps,
              stepGoal: dailyStepGoal
            });
            
            toast({
              title: (
                <div className="flex items-center gap-2">
                  <Footprints className="h-5 w-5 text-primary" />
                  <span className="font-headline">Go, You!</span>
                </div>
              ),
              description: result.message,
            });

          } catch (error) {
            console.error("Failed to generate motivational message:", error);
            // If AI fails, remove from set to allow retry later
            sentNotifications.current.delete(milestone.id);
          } finally {
            setIsGenerating(false);
          }
          // Break after sending one notification to avoid multiple toasts at once
          break;
        }
      }
    };

    checkAndSendNotification();

  }, [currentSteps, dailyStepGoal, user, toast, isGenerating]);

  return null; // This is a non-visual component
}
