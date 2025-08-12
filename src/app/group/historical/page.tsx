
"use client";

import { useMemo } from 'react';
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal, Trophy } from 'lucide-react';
import { allTimeMembersForLeaderboard, generatePastLeaderboardData } from '@/components/member-management';
import { MOCK_GROUPS } from '@/lib/mock-data';

// Note: In a real app, this would be derived from the logged-in user's context
const LOGGED_IN_GROUP_ID = 'group-awesome';
const groupData = MOCK_GROUPS[LOGGED_IN_GROUP_ID];

const getMedalColor = (rank: number) => {
    switch (rank) {
        case 1: return "text-yellow-400";
        case 2: return "text-gray-400";
        case 3: return "text-amber-600";
        default: return "text-muted-foreground";
    }
}

export default function HistoricalPage() {
    const historicalData = useMemo(() => generatePastLeaderboardData(), []);
    
    // Aggregate data over the last 12 months (or however many are available)
    const rollingLeaderboards = useMemo(() => {
        const availableMonths = Object.values(historicalData).slice(0, 12);

        // Aggregate individual stats
        const individualTotals: Record<string, { member: typeof allTimeMembersForLeaderboard[0], totalSteps: number }> = {};

        allTimeMembersForLeaderboard.forEach(member => {
            individualTotals[member.id] = { member, totalSteps: 0 };
        });

        availableMonths.forEach(monthData => {
            monthData.individuals.forEach(record => {
                if (individualTotals[record.id]) {
                    individualTotals[record.id].totalSteps += record.monthlySteps;
                }
            });
        });

        const sortedIndividuals = Object.values(individualTotals)
            .sort((a, b) => b.totalSteps - a.totalSteps)
            .slice(0, 5);

        // Aggregate department stats
        const departmentTotals: Record<string, { totalAvgSteps: number, count: number }> = {};

        availableMonths.forEach(monthData => {
            monthData.departments.forEach(dept => {
                if (!departmentTotals[dept.name]) {
                    departmentTotals[dept.name] = { totalAvgSteps: 0, count: 0 };
                }
                departmentTotals[dept.name].totalAvgSteps += dept.avgSteps;
                departmentTotals[dept.name].count++;
            });
        });
        
        const sortedDepartments = Object.entries(departmentTotals)
            .map(([name, data]) => ({
                name,
                avgSteps: Math.round(data.totalAvgSteps / data.count),
            }))
            .sort((a, b) => b.avgSteps - a.avgSteps)
            .slice(0, 5);

        return {
            individuals: sortedIndividuals,
            departments: sortedDepartments,
            monthCount: availableMonths.length
        };

    }, [historicalData]);

    return (
        <div className="flex min-h-screen w-full flex-col">
            <AppHeader user={null} view="group" group={groupData} memberId="historical" />
            <main className="flex-1 py-8 px-4 md:px-6">
                <div className="container mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="font-headline text-3xl font-bold tracking-tight">12-Month Rolling Leaderboard</h1>
                        <p className="text-muted-foreground">
                            Top performers based on cumulative data from the last {rollingLeaderboards.monthCount} months.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="text-primary" />
                                    Top 5 Individuals
                                </CardTitle>
                                <CardDescription>The most consistent members over the last year.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-4">
                                    {rollingLeaderboards.individuals.map((entry, index) => (
                                        <li key={entry.member.id} className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-muted/50">
                                            <div className={`flex items-center justify-center w-8 font-bold text-lg ${getMedalColor(index + 1)}`}>
                                                <Medal className="h-6 w-6" />
                                            </div>
                                            <Avatar>
                                                <AvatarImage src={entry.member.avatarUrl} alt={`${entry.member.firstName} ${entry.member.surname}`} />
                                                <AvatarFallback>{entry.member.firstName[0]}{entry.member.surname[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-semibold">{entry.member.firstName} {entry.member.surname}</p>
                                                <p className="text-sm text-muted-foreground">{entry.member.department}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-primary text-lg">
                                                    {entry.totalSteps.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground">total steps</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="text-primary" />
                                    Top 5 Departments
                                </CardTitle>
                                <CardDescription>The top performing departments by average steps.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-4">
                                    {rollingLeaderboards.departments.map((dept, index) => (
                                        <li key={dept.name} className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-muted/50">
                                            <div className={`flex items-center justify-center w-8 font-bold text-lg ${getMedalColor(index + 1)}`}>
                                                <Medal className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">{dept.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-primary text-lg">
                                                    {dept.avgSteps.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground">avg steps</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <AppFooter view="group" group={groupData} />
        </div>
    );
}

    