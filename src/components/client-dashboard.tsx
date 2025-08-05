
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building, Footprints, Timer, Flame, TrendingUp } from 'lucide-react';
import ActivityChart from '@/components/activity-chart';

const dailyStepsData = [
  { time: '12am', steps: 10 }, { time: '3am', steps: 20 }, { time: '6am', steps: 150 },
  { time: '9am', steps: 800 }, { time: '12pm', steps: 1200 }, { time: '3pm', steps: 2500 },
  { time: '6pm', steps: 4000 }, { time: '9pm', steps: 5200 },
];

const weeklyExerciseData = [
  { day: 'Mon', Running: 30, Walking: 60 }, { day: 'Tue', Running: 45, Walking: 50 },
  { day: 'Wed', Running: 20, Walking: 70 }, { day: 'Thu', Running: 60, Walking: 40 },
  { day: 'Fri', Running: 35, Walking: 80 }, { day: 'Sat', Running: 75, Walking: 30 },
  { day: 'Sun', Running: 15, Walking: 90 },
];

const monthlyStepsData = [
    { week: 'Week 1', steps: 35000 }, { week: 'Week 2', steps: 42000 },
    { week: 'Week 3', steps: 38000 }, { week: 'Week 4', steps: 45000 },
];

const chartConfigSteps = {
  steps: { label: "Steps", color: "hsl(var(--chart-1))" },
};

const chartConfigExercise = {
  Running: { label: "Running", color: "hsl(var(--chart-1))" },
  Walking: { label: "Walking", color: "hsl(var(--chart-2))" },
};

type ClientDashboardProps = {
  isEnrolled: boolean;
};

export default function ClientDashboard({ isEnrolled }: ClientDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">Welcome back!</h1>
              <p className="text-muted-foreground">Here's your activity summary.</p>
          </div>
          {isEnrolled && (
              <Card className="flex items-center gap-4 p-4">
                  <Image data-ai-hint="medical logo" src="https://placehold.co/64x64.png" alt="Clinic Logo" width={64} height={64} className="rounded-md" />
                  <div>
                      <p className="text-sm text-muted-foreground">Enrolled with</p>
                      <p className="font-headline font-semibold">Wellness Clinic</p>
                  </div>
              </Card>
          )}
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily">
          <div className="grid gap-6 md:grid-cols-3">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
                      <Footprints className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">5,231</div>
                      <p className="text-xs text-muted-foreground">+801 since yesterday</p>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Time</CardTitle>
                      <Timer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">1h 12m</div>
                      <p className="text-xs text-muted-foreground">+15m from yesterday</p>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                      <Flame className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">345</div>
                      <p className="text-xs text-muted-foreground">+50 kcal from yesterday</p>
                  </CardContent>
              </Card>
          </div>
          <div className="mt-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Today's Steps</CardTitle>
                      <CardDescription>A summary of your steps throughout the day.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                      <ActivityChart data={dailyStepsData} config={chartConfigSteps} dataKey="steps" timeKey="time" type="bar" />
                  </CardContent>
              </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly">
           <Card>
              <CardHeader>
                  <CardTitle>This Week's Exercise</CardTitle>
                  <CardDescription>Time spent on different exercises this week.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                   <ActivityChart data={weeklyExerciseData} config={chartConfigExercise} dataKey={["Running", "Walking"]} timeKey="day" type="line" />
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
              <CardHeader>
                  <CardTitle>This Month's Progress</CardTitle>
                  <CardDescription>Your step count progress over the last four weeks.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                   <ActivityChart data={monthlyStepsData} config={chartConfigSteps} dataKey="steps" timeKey="week" type="bar" />
              </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
