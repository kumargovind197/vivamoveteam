
"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { MessageSquareText } from 'lucide-react';

const mockMessages = [
    {
        id: 1,
        subject: "Welcome to the Step-Up Challenge!",
        content: "Hi Alex, welcome to the challenge! We're excited to have you on board. Remember to sync your device daily. Let's get stepping!",
        received: "2 hours ago",
        read: false,
    },
    {
        id: 2,
        subject: "New Challenge Starting Monday!",
        content: "A new quarterly challenge is starting this Monday. Get ready to compete and win prizes for your department!",
        received: "1 day ago",
        read: true,
    },
    {
        id: 3,
        subject: "You're on the Leaderboard!",
        content: "Great work this month, you've made it to the top 5! Keep up the fantastic effort.",
        received: "3 days ago",
        read: true,
    },
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
              <CardDescription>Showing last 5 of the most recent messages.</CardDescription>
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
