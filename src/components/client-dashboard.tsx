
"use client";
import React from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import ActivityChart from '@/components/activity-chart';
import { User } from '@/lib/firebase';
import { Progress } from './ui/progress';
import { Footprints, Flame } from 'lucide-react';
import ProgressRing from './progress-ring';


const weeklyStepsData = [
    { day: 'Mon', steps: 3500 }, { day: 'Tue', steps: 4200 },
    { day: 'Wed', steps: 7800 }, { day: 'Thu', steps: 9500 },
    { day: 'Fri', steps: 2100 }, { day: 'Sat', steps: 11000 },
    { day: 'Sun', steps: 6000 },
];

const monthlyStepsData = [
    { week: 'Week 1', steps: 35000 }, { week: 'Week 2', steps: 42000 },
    { week: 'Week 3', steps: 38000 }, { week: 'Week 4', steps: 45000 },
];

const chartConfigSteps = {
  steps: { label: "Steps", color: "hsl(var(--chart-1))" },
};

type ClientDashboardProps = {
  isEnrolled: boolean;
  user: User | null;
  fitData: {
      steps: number | null;
      activeMinutes: number | null;
  }
};

const DAILY_STEP_GOAL = 10000;
const DAILY_MINUTE_GOAL = 30;

export default function ClientDashboard({ isEnrolled, user, fitData }: ClientDashboardProps) {

  const { steps, activeMinutes } = fitData;

  const stepProgress = steps ? (steps / DAILY_STEP_GOAL) * 100 : 0;
  const minuteProgress = activeMinutes ? (activeMinutes / DAILY_MINUTE_GOAL) * 100 : 0;
  
   const getProgressColorClass = (progress: number) => {
    if (progress >= 80) return "bg-primary"; // Green
    if (progress >= 40) return "bg-yellow-400"; // Yellow
    return "bg-amber-500"; // Amber
  };

  const getRingColor = (progress: number) => {
    if (progress >= 80) return "hsl(var(--primary))"; // Green
    if (progress >= 40) return "hsl(48, 96%, 50%)"; // Yellow
    return "hsl(36, 83%, 50%)"; // Amber
  }
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">Welcome back!</h1>
              <p className="text-muted-foreground">Here's your activity summary.</p>
          </div>
          {isEnrolled && (
              <Card className="flex items-center gap-4 p-4 bg-transparent border-muted">
                  <Image data-ai-hint="medical logo" src="https://placehold.co/64x64.png" alt="Clinic Logo" width={64} height={64} className="rounded-md" />
                  <div>
                      <p className="text-sm text-muted-foreground">Enrolled with</p>
                      <p className="font-headline font-semibold">Wellness Clinic</p>
                  </div>
              </Card>
          )}
      </div>

       <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Daily Steps</span>
              <Footprints className="h-6 w-6 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              You've walked {steps?.toLocaleString() ?? 0} steps today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={stepProgress} indicatorClassName={getProgressColorClass(stepProgress)} trackClassName="bg-red-800/50" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Goal: {DAILY_STEP_GOAL.toLocaleString()}</span>
              <span>{Math.round(stepProgress)}%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Minutes</span>
              <Flame className="h-6 w-6 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              Your goal is {DAILY_MINUTE_GOAL} active minutes today.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             <ProgressRing progress={minuteProgress} color={getRingColor(minuteProgress)} trackColor="hsl(0, 72%, 51%, 0.2)" />
          </CardContent>
        </Card>
      </div>


      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly">
           <Card>
              <CardHeader>
                  <CardTitle>This Week's Steps</CardTitle>
                  <CardDescription>Your daily step count for the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                   <ActivityChart data={weeklyStepsData} config={chartConfigSteps} dataKey={"steps"} timeKey="day" type="bar" showGoalBands={true} />
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
              <CardHeader>
                  <CardTitle>This Month's Progress</CardTitle>
                  <CardDescription>Your total step count over the last four weeks.</CardDescription>
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
