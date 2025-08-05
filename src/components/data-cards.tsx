
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footprints, Timer, AlertCircle } from 'lucide-react';
import { User } from 'firebase/auth';
import { Skeleton } from './ui/skeleton';

interface DataCardsProps {
  user: User | null;
}

const STATS_API_URL = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";

const getMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    return midnight.getTime();
}

const getNow = () => {
    return new Date().getTime();
}

export default function DataCards({ user }: DataCardsProps) {
  const [steps, setSteps] = useState<number | null>(null);
  const [activeMinutes, setActiveMinutes] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFitData = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = await user.getIdToken();

        const requestBody = {
          "aggregateBy": [{
            "dataTypeName": "com.google.step_count.delta",
            "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
          }, {
            "dataTypeName": "com.google.active_minutes",
            "dataSourceId": "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes"
          }],
          "bucketByTime": { "durationMillis": 86400000 }, // 24 hours
          "startTimeMillis": getMidnight(),
          "endTimeMillis": getNow()
        };

        const response = await fetch(STATS_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
           const errorData = await response.json();
           console.error("Google Fit API Error:", errorData);
           throw new Error(errorData.error.message || 'Failed to fetch Google Fit data');
        }

        const data = await response.json();

        // Extract steps
        const stepsBucket = data.bucket[0]?.dataset[0]?.point[0];
        setSteps(stepsBucket?.value[0]?.intVal || 0);

        // Extract active minutes
        const activeMinutesBucket = data.bucket[0]?.dataset[1]?.point[0];
        setActiveMinutes(activeMinutesBucket?.value[0]?.intVal || 0);

      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFitData();
  }, [user]);

  if (!user) {
      return (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">Sign in to view your data</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-yellow-700">Please sign in with your Google account to see your personalized fitness data from Google Fit.</p>
            </CardContent>
        </Card>
      )
  }

  if (loading) {
      return (
          <div className="grid gap-6 md:grid-cols-2 mb-6">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
                      <Footprints className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-32 mt-1" />
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Time</CardTitle>
                      <Timer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-32 mt-1" />
                  </CardContent>
              </Card>
          </div>
      )
  }

  if (error) {
      return (
         <Card className="mb-6 bg-red-50 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Error Fetching Data</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-red-700">Could not retrieve data from Google Fit. Please ensure you have granted permissions and have data available. Error: {error}</p>
            </CardContent>
        </Card>
      )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
          <Footprints className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{steps?.toLocaleString() ?? '0'}</div>
          <p className="text-xs text-muted-foreground">Today</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Time</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeMinutes ?? '0'}m</div>
          <p className="text-xs text-muted-foreground">Today</p>
        </CardContent>
      </Card>
    </div>
  );
}
