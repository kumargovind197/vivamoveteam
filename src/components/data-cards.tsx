
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { User } from 'firebase/auth';
import { Skeleton } from './ui/skeleton';

interface DataCardsProps {
  user: User | null;
  onDataFetched: (data: { steps: number | null, activeMinutes: number | null }) => void;
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

export default function DataCards({ user, onDataFetched }: DataCardsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We will disable fetching for the mock user to avoid console errors.
    if (!user || user.uid.startsWith('mock-')) {
      setLoading(false);
      // We return some mock data to make the UI look populated
      onDataFetched({ steps: 7891, activeMinutes: 0 }); // Active minutes set to 0 as it's not used
      return;
    }

    const fetchFitData = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = await user.getIdToken();

        const requestBody = {
          "aggregateBy": [
            { "dataTypeName": "com.google.step_count.delta", "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps" }
          ],
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

        const steps = data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal || 0;
        
        // Active minutes is no longer needed but we keep the structure
        onDataFetched({ steps, activeMinutes: 0 });

      } catch (err: any) {
        setError(err.message);
        onDataFetched({ steps: null, activeMinutes: null });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFitData();
  }, [user, onDataFetched]);
  
  if (error) {
      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="mb-6 bg-red-900/50 border-red-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-200">Error Fetching Data</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-red-300">Could not retrieve data from Google Fit. Please ensure you have granted permissions and have data available. Error: {error}</p>
                </CardContent>
            </Card>
        </div>
      )
  }
  
  // This component now only fetches data and shows errors, display is handled elsewhere.
  if (loading) {
       return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
              <Skeleton className="h-[120px]" />
          </div>
        </div>
      );
  }

  return null;
}
