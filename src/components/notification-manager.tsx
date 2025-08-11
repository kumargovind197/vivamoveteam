
"use client";

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MOCK_MESSAGES } from '@/lib/mock-data';

// This component is a simulation. In a real app, this logic might be
// handled by a service worker listening to push notifications.
export default function NotificationManager() {
  const { toast } = useToast();
  // Keep track of which message IDs we've already shown a toast for
  const [notifiedIds, setNotifiedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Check for new, unread messages periodically
    const interval = setInterval(() => {
      const unreadMessages = MOCK_MESSAGES.filter(m => !m.read);
      
      if (unreadMessages.length > 0) {
        const latestUnread = unreadMessages[0];
        
        // If we haven't already shown a toast for this message, show one.
        if (!notifiedIds.has(latestUnread.id)) {
          toast({
            title: "New Message from Group Leader",
            description: latestUnread.subject,
          });
          // Add the ID to our set so we don't notify again for the same message
          setNotifiedIds(prev => new Set(prev).add(latestUnread.id));
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [toast, notifiedIds]);

  // This component doesn't render anything itself
  return null;
}
