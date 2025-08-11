
"use client";
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import ActivityChart from '@/components/activity-chart';
import { User } from 'firebase/auth';
import { Footprints, Trophy, CalendarDays,TrendingUp, BarChart3, Users } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

// --- MOCK LOCAL DEVICE STORAGE ---
const generateInitialLocalData = () => {
    const data = [];
    const today = new Date();
    // Simulate having the last 90 days of data stored on the device
    for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0], // YYYY-MM-DD
            steps: Math.floor(Math.random() * 18000),
        });
    }
    return data.reverse(); // Return in chronological order
};

// --- MOCK LEADERBOARD DATA ---
const mockLeaderboardData = {
    individual: [
        { rank: 1, name: 'Michael Johnson', department: 'Engineering', steps: 285432, avatar: 'https://placehold.co/40x40' },
        { rank: 2, name: 'You (Jane Doe)', department: 'Marketing', steps: 254123, avatar: 'https://placehold.co/40x40' },
        { rank: 3, name: 'David Wilson', department: 'Engineering', steps: 249876, avatar: 'https://placehold.co/40x40' },
        { rank: 4, name: 'John Smith', department: 'Sales', steps: 231456, avatar: 'https://placehold.co/40x40' },
        { rank: 5, name: 'Jessica Brown', department: 'Marketing', steps: 228765, avatar: 'https://placehold.co/40x40' },
    ],
    department: [
        { rank: 1, name: 'Engineering', steps: 215345, members: 15 },
        { rank: 2, name: 'Marketing', steps: 198765, members: 12 },
        { rank: 3, name: 'Sales', steps: 189432, members: 22 },
        { rank: 4, name: 'Support', steps: 154321, members: 18 },
        { rank: 5, name: 'HR', steps: 123456, members: 5 },
    ]
}

const chartConfigSteps = {
  steps: { label: "Steps", color: "hsl(var(--accent))" },
};

type MemberDashboardProps = {
  isEnrolled: boolean;
  user: User | null;
  fitData: {
      steps: number | null;
  };
  view: 'member' | 'group';
};

export default function MemberDashboard({ isEnrolled, user, fitData, view }: MemberDashboardProps) {
  const [localDeviceData] = useState(generateInitialLocalData);
  const { steps } = fitData;

  const weeklyData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7DaysData = localDeviceData.slice(-7);
    return last7DaysData.map(d => ({
        day: dayNames[new Date(d.date).getUTCDay()],
        steps: d.steps
    }));
  }, [localDeviceData]);

  const monthlyData = useMemo(() => {
    return localDeviceData.slice(-30);
  }, [localDeviceData]);

  const monthlyTotalSteps = monthlyData.reduce((acc, curr) => acc + curr.steps, 0);
  const monthlyAverageSteps = Math.round(monthlyTotalSteps / monthlyData.length);

  const averageStepsByDay = useMemo(() => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayMap: { [key: string]: { total: number, count: number } } = {};
    
    localDeviceData.slice(-28).forEach(d => {
        const dayName = dayNames[new Date(d.date).getUTCDay()];
        if (!dayMap[dayName]) {
            dayMap[dayName] = { total: 0, count: 0 };
        }
        dayMap[dayName].total += d.steps;
        dayMap[dayName].count += 1;
    });

    return dayNames.map(dayName => ({
        day: dayName,
        steps: dayMap[dayName] ? Math.round(dayMap[dayName].total / dayMap[dayName].count) : 0,
    }));
  }, [localDeviceData]);


  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!</h1>
                <p className="text-muted-foreground">Here's your activity summary.</p>
            </div>
            {isEnrolled && (
                <Card className="flex items-center gap-4 p-4 bg-transparent border-muted">
                    <Image data-ai-hint="company logo" src="https://placehold.co/64x64.png" alt="Group Logo" width={64} height={64} className="rounded-md" />
                    <div>
                        <p className="text-sm text-muted-foreground">Enrolled in</p>
                        <p className="font-headline font-semibold">Alpha Division Challenge</p>
                    </div>
                </Card>
            )}
        </div>

        <Card className="bg-secondary/50 mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                    <CardTitle className="flex items-center gap-2">
                        <Footprints className="h-6 w-6 text-muted-foreground" />
                        <span>Today's Steps</span>
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{steps?.toLocaleString() ?? 0}</div>
              <p className="text-xs text-muted-foreground">Keep up the great work!</p>
            </CardContent>
        </Card>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaderboard">Leaderboards</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leaderboard">
            <div className="grid gap-8 md:grid-cols-2 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Trophy className="text-amber-400"/> Individual Leaderboard</CardTitle>
                        <CardDescription>Top 5 performers this month. Keep stepping to climb the ranks!</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Rank</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Steps</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockLeaderboardData.individual.map(p => (
                                    <TableRow key={p.rank} className={p.name.includes('You') ? 'bg-primary/20' : ''}>
                                        <TableCell className="font-bold">{p.rank}</TableCell>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={p.avatar} />
                                                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {p.name}
                                        </TableCell>
                                        <TableCell>{p.department}</TableCell>
                                        <TableCell className="text-right font-mono">{p.steps.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="text-blue-400"/> Department Leaderboard</CardTitle>
                        <CardDescription>Top 5 departments by average steps this month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Rank</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Avg. Steps</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockLeaderboardData.department.map(d => (
                                    <TableRow key={d.rank}>
                                        <TableCell className="font-bold">{d.rank}</TableCell>
                                        <TableCell className="font-medium">{d.name}</TableCell>
                                        <TableCell className="text-right font-mono">{d.steps.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            <Card>
                <CardHeader>
                    <CardTitle>This Week's Steps</CardTitle>
                    <CardDescription>Your daily step count for the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ActivityChart data={weeklyData} config={chartConfigSteps} dataKey={"steps"} timeKey="day" type="line" />
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Step Average</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monthlyAverageSteps.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">steps per day this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Steps This Month</CardTitle>
                        <Footprints className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monthlyTotalSteps.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">in the last 30 days</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Daily Averages by Weekday</CardTitle>
                    <CardDescription>Your average step count for each day of the week over the last month.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ActivityChart data={averageStepsByDay} config={chartConfigSteps} dataKey="steps" timeKey="day" type="bar" />
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
