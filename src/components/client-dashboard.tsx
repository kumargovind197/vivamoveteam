
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import ActivityChart from '@/components/activity-chart';
import { User } from '@/lib/firebase';
import { Progress } from './ui/progress';
import { Footprints, Flame, Target, Trophy, CalendarDays,TrendingUp } from 'lucide-react';
import ProgressRing from './progress-ring';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Slider } from './ui/slider';


const weeklyStepsData = [
    { day: 'Mon', steps: 3500 }, { day: 'Tue', steps: 4200 },
    { day: 'Wed', steps: 7800 }, { day: 'Thu', steps: 9500 },
    { day: 'Fri', steps: 2100 }, { day: 'Sat', steps: 11000 },
    { day: 'Sun', steps: 6000 },
];

const generateMonthlyData = (goal: number) => {
    const data = [];
    const daysInMonth = 30;
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(2024, 6, i); // July 2024
        data.push({
            day: dayNames[date.getDay()],
            date: i,
            steps: Math.floor(Math.random() * (goal * 1.5))
        });
    }
    return data;
};

const chartConfigSteps = {
  steps: { label: "Steps", color: "hsl(var(--accent))" },
};

const chartConfigDailyAverage = {
    steps: { label: "Avg Steps", color: "hsl(var(--primary))" },
};

type ClientDashboardProps = {
  isEnrolled: boolean;
  user: User | null;
  fitData: {
      steps: number | null;
      activeMinutes: number | null;
  }
};


const DAILY_MINUTE_GOAL = 30;

export default function ClientDashboard({ isEnrolled, user, fitData }: ClientDashboardProps) {
  const [dailyStepGoal, setDailyStepGoal] = useState(10000);
  const [isGoalDialogOpen, setGoalDialogOpen] = useState(false);
  const [pendingStepGoal, setPendingStepGoal] = useState(dailyStepGoal);

  const { steps, activeMinutes } = fitData;

  const stepProgress = steps ? (steps / dailyStepGoal) * 100 : 0;
  const minuteProgress = activeMinutes ? (activeMinutes / DAILY_MINUTE_GOAL) * 100 : 0;

  const getProgressColorClass = (progress: number) => {
    if (progress < 40) return "bg-amber-500";
    if (progress < 80) return "bg-yellow-400";
    return "bg-green-500";
  };
  
  const getRingColor = (progress: number) => {
    if (progress < 40) return "hsl(var(--destructive))";
    if (progress < 80) return "hsl(36, 83%, 50%)"; // amber
    return "hsl(142.1, 76.2%, 36.3%)"; // primary green
  }

  const handleSaveGoal = () => {
    setDailyStepGoal(pendingStepGoal);
    setGoalDialogOpen(false);
  }

  const weeklyAverage = Math.round(weeklyStepsData.reduce((acc, curr) => acc + curr.steps, 0) / weeklyStepsData.length);
  
  const monthlyData = generateMonthlyData(dailyStepGoal);
  const monthlyTotalSteps = monthlyData.reduce((acc, curr) => acc + curr.steps, 0);
  const monthlyAverage = Math.round(monthlyTotalSteps / monthlyData.length);
  const daysGoalMet = monthlyData.filter(day => day.steps >= dailyStepGoal).length;
  
  const averageStepsByDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayName => {
      const days = monthlyData.filter(d => d.day === dayName);
      const total = days.reduce((acc, curr) => acc + curr.steps, 0);
      const avg = days.length > 0 ? Math.round(total / days.length) : 0;
      return { day: dayName, steps: avg };
  });


  return (
    <>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle className="flex items-center gap-2">
                    <Footprints className="h-6 w-6 text-muted-foreground" />
                    <span>Daily Steps</span>
                </CardTitle>
                <CardDescription>
                  You've walked {steps?.toLocaleString() ?? 0} steps today.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setGoalDialogOpen(true)}>
                Change Goal
              </Button>
            </CardHeader>
            <CardContent>
              <Progress value={stepProgress} indicatorClassName={getProgressColorClass(stepProgress)} trackClassName="bg-red-800/50" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Goal: {dailyStepGoal.toLocaleString()}</span>
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
                    <CardDescription>Your daily step count for the last 7 days. Your daily average was {weeklyAverage.toLocaleString()} steps.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ActivityChart data={weeklyStepsData} config={chartConfigSteps} dataKey={"steps"} timeKey="day" type="line" showGoalBands={true} average={weeklyAverage} goal={dailyStepGoal} />
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
                        <Footprints className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monthlyTotalSteps.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">in the last 30 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monthlyAverage.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">steps per day</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Goals Met</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{daysGoalMet} / {monthlyData.length}</div>
                        <p className="text-xs text-muted-foreground">days you reached your goal</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Goal</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dailyStepGoal.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">steps per day</p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Averages by Weekday</CardTitle>
                        <CardDescription>See your average step count for each day of the week over the last month.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ActivityChart data={averageStepsByDay} config={chartConfigDailyAverage} dataKey="steps" timeKey="day" type="bar" />
                    </CardContent>
                </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isGoalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Your Daily Step Goal</DialogTitle>
            <DialogDescription>
              Adjust the slider to set a new daily step goal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div className="text-center text-2xl font-bold text-primary">{pendingStepGoal.toLocaleString()} steps</div>
              <Slider
                defaultValue={[dailyStepGoal]}
                value={[pendingStepGoal]}
                max={20000}
                min={2000}
                step={500}
                onValueChange={(value) => setPendingStepGoal(value[0])}
              />
               <div className="flex justify-between text-xs text-muted-foreground">
                <span>2,000</span>
                <span>20,000</span>
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveGoal}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
