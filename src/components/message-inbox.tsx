
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { MessageSquareText } from 'lucide-react';
import { MOCK_MESSAGES, markAsRead } from '@/lib/mock-data';

export default function MessageInbox() {
  // Local state to track which messages have been read *during this session*.
  const [readMessages, setReadMessages] = useState<Set<number>>(new Set());
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  // This effect simulates keeping the message list in sync with our "global" mock data store.
  useEffect(() => {
    // In a real app with a backend, you might refetch messages here or use a subscription.
    // For our mock, we can just reset our component's state if the global one changes.
    const interval = setInterval(() => {
      setMessages([...MOCK_MESSAGES]);
    }, 1000); // Check for new messages every second

    return () => clearInterval(interval);
  }, []);

  const handleAccordionChange = (value: string) => {
    if (value) {
      const messageId = parseInt(value.split('-')[1]);
      if (!readMessages.has(messageId)) {
        markAsRead(messageId);
        setReadMessages(prev => new Set(prev).add(messageId));
      }
    }
  };

  const recentMessages = messages.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <MessageSquareText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Message Inbox</CardTitle>
              <CardDescription>Showing last 5 of the most recent messages.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recentMessages.length > 0 ? (
            <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
              {recentMessages.map((message) => (
                <AccordionItem value={`item-${message.id}`} key={message.id}>
                  <AccordionTrigger>
                    <div className="flex w-full items-center justify-between">
                        <div className='flex items-center gap-2'>
                           {!message.read && <div className="h-2.5 w-2.5 rounded-full bg-accent"></div>}
                           <span className={!message.read ? "font-bold" : "font-medium"}>
                             {message.subject}
                           </span>
                        </div>
                      <span className="text-sm text-muted-foreground">{message.received}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="px-4 py-2 bg-muted/50 rounded-md">{message.content}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              You have no new messages.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
