"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ActivityChart from "@/components/activity-chart";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Footprints, Trophy } from "lucide-react";
import { MOCK_GROUPS } from "@/lib/mock-data";
import MotivationalCard from "./motivational-card";
import Leaderboard from "./leaderboard";

type Group = typeof MOCK_GROUPS[keyof typeof MOCK_GROUPS];

const generateInitialLocalData = () => {
  const data = [];
  const today = new Date();
  for (let i = 0; i < 35; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      steps: Math.floor(Math.random() * 18000),
    });
  }
  return data.reverse();
};

const chartConfigSteps = {
  steps: { label: "Steps", color: "hsl(var(--accent))" },
};

const chartConfigDailyAverage = {
  steps: { label: "Avg Steps", color: "hsl(var(--primary))" },
};

type ClientDashboardProps = {
  fitData: {
    steps: number | null;
    activeMinutes: number | null;
  };
  view: "member" | "group";
  group: Group | null;
};

export default function ClientDashboard({
  fitData,
  view,
  group,
}: ClientDashboardProps) {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [firestoreName, setFirestoreName] = useState<string | null>(null);
  const [localDeviceData] = useState(generateInitialLocalData);

  const { steps } = fitData;

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setFirebaseUser(currentUser);

      const userRef = doc(db, "Newusers", currentUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        if (data.role === "member") {
          setFirestoreName(data.name || currentUser.displayName || "User");
        } else {
          router.push("/unauthorized");
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsub();
  }, [router]);

  // *** ALL hooks here before any return ***

  const weeklyData = useMemo(() => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7DaysData = localDeviceData.slice(-7);
    return last7DaysData.map((d) => ({
      day: dayNames[new Date(d.date).getUTCDay()],
      steps: d.steps,
    }));
  }, [localDeviceData]);

  const weeklyAverage = Math.round(
    weeklyData.reduce((acc, curr) => acc + curr.steps, 0) / weeklyData.length
  );

  const monthlyData = useMemo(() => {
    return localDeviceData.slice(-30);
  }, [localDeviceData]);

  const monthlyTotalSteps = monthlyData.reduce(
    (acc, curr) => acc + curr.steps,
    0
  );

  const monthlyAverageSteps = Math.round(
    monthlyTotalSteps / monthlyData.length
  );

  const averageStepsByDay = useMemo(() => {
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayMap: { [key: string]: { total: number; count: number } } = {};
    localDeviceData.slice(-28).forEach((d) => {
      const dayName = dayNames[new Date(d.date).getUTCDay()];
      if (!dayMap[dayName]) {
        dayMap[dayName] = { total: 0, count: 0 };
      }
      dayMap[dayName].total += d.steps;
      dayMap[dayName].count += 1;
    });

    return dayNames.map((dayName) => ({
      day: dayName,
      steps: dayMap[dayName]
        ? Math.round(dayMap[dayName].total / dayMap[dayName].count)
        : 0,
    }));
  }, [localDeviceData]);

  // Now safe to conditionally render
  if (!firebaseUser || !firestoreName) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Welcome back, {firestoreName}!
          </h1>
          <p className="text-muted-foreground">Here's your activity summary.</p>
        </div>
        {group && (
          <Card className="flex items-center gap-4 p-4 bg-transparent border-muted">
            <Image
              src={group.logo}
              alt="Group Logo"
              width={64}
              height={64}
              className="rounded-md"
            />
            <div>
              <p className="text-sm text-muted-foreground">Member of</p>
              <p className="font-headline font-semibold">{group.name}</p>
            </div>
          </Card>
        )}
      </div>

      <MotivationalCard steps={steps} name={firestoreName} />

      <Leaderboard />

      <Tabs defaultValue="weekly" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>This Week's Steps</CardTitle>
              <CardDescription>
                Your daily step count for the last 7 days. Your daily average was{" "}
                {weeklyAverage.toLocaleString()} steps.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ActivityChart
                data={weeklyData}
                config={chartConfigSteps}
                dataKey={"steps"}
                timeKey="day"
                type="line"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Total Steps
                </CardTitle>
                <Footprints className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {monthlyTotalSteps.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  in the last 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Daily Step Average
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {monthlyAverageSteps.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  in the last 30 days
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Daily Averages by Weekday</CardTitle>
              <CardDescription>
                Your average step count for each day of the week over the last
                month.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ActivityChart
                data={averageStepsByDay}
                config={chartConfigDailyAverage}
                dataKey="steps"
                timeKey="day"
                type="bar"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
