
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
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-primary"; // Green
    if (progress >= 40) return "bg-yellow-500"; // Amber
    return "bg-red-600"; // Red
  };

  const getRingColor = (progress: number) => {
    if (progress >= 80) return "hsl(var(--primary))"; // Green
    if (progress >= 40) return "hsl(48, 96%, 50%)"; // Amber
    return "hsl(0, 72%, 51%)"; // Red
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
            <Progress value={stepProgress} indicatorClassName={getProgressColor(stepProgress)} />
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
             <ProgressRing progress={minuteProgress} color={getRingColor(minuteProgress)} />
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
