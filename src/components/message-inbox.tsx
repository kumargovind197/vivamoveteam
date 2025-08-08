
"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { MessageSquareText } from 'lucide-react';

const mockMessages = [
    {
        id: 1,
        subject: "Your Weekly Progress",
        content: "Hi John, just checking in. You've had a great week, keep up the momentum! Remember to take a walk after dinner, it really helps.",
        received: "2 hours ago",
        read: false,
    },
    {
        id: 2,
        subject: "Quick Reminder",
        content: "Don't forget your appointment tomorrow at 10 AM. Please make sure to bring your updated food diary.",
        received: "1 day ago",
        read: true,
    },
    {
        id: 3,
        subject: "New Article for You",
        content: "We thought you might find this article on 'The Benefits of Morning Stretches' interesting. Let us know your thoughts!",
        received: "3 days ago",
        read: true,
    },
    {
        id: 4,
        subject: "Following Up",
        content: "Hello! We noticed your activity was a bit lower last weekend. Is everything okay? Let us know if we can help with anything.",
        received: "5 days ago",
        read: true,
    },
    {
        id: 5,
        subject: "Welcome to the Program!",
        content: "Welcome to the ViVa move program with Wellness Clinic! We're excited to have you on board and look forward to helping you reach your health goals.",
        received: "1 week ago",
        read: true,
    },
    {
        id: 6,
        subject: "This one is too old",
        content: "This message should not be displayed as it is the 6th message.",
        received: "2 weeks ago",
        read: true,
    }
];

export default function MessageInbox() {
  const recentMessages = mockMessages.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <MessageSquareText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Message Inbox</CardTitle>
              <CardDescription>Recent messages from your clinic. Showing last 5.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recentMessages.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
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
