
"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Crown, Footprints, Medal, Trophy, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type Member = {
    id: string;
    memberId: string;
    firstName: string;
    surname: string;
    email: string;
    department: string;
    monthlySteps: number;
    quarterlySteps: number;
    avatarUrl: string;
};

interface MemberDashboardProps {
    members: Member[];
}

const getMedalColor = (rank: number) => {
    switch (rank) {
        case 1: return "text-yellow-400";
        case 2: return "text-gray-400";
        case 3: return "text-amber-600";
        default: return "text-muted-foreground";
    }
}

export default function MemberDashboard({ members }: MemberDashboardProps) {
    const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly'>('monthly');

    const individualLeaderboard = useMemo(() => {
        const stepKey = timeframe === 'monthly' ? 'monthlySteps' : 'quarterlySteps';
        return [...members]
            .sort((a, b) => b[stepKey] - a[stepKey])
            .slice(0, 5);
    }, [members, timeframe]);

    const departmentLeaderboard = useMemo(() => {
        const stepKey = timeframe === 'monthly' ? 'monthlySteps' : 'quarterlySteps';
        const departments: Record<string, { totalSteps: number; memberCount: number }> = {};

        members.forEach(member => {
            if (!departments[member.department]) {
                departments[member.department] = { totalSteps: 0, memberCount: 0 };
            }
            departments[member.department].totalSteps += member[stepKey];
            departments[member.department].memberCount++;
        });
        
        return Object.entries(departments)
            .map(([name, data]) => ({
                name,
                avgSteps: Math.round(data.totalSteps / data.memberCount),
            }))
            .sort((a, b) => b.avgSteps - a.avgSteps)
            .slice(0, 5);

    }, [members, timeframe]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Group Leaderboard</h1>
                    <p className="text-muted-foreground">View top performers and department rankings. Updated every 24 hours.</p>
                </div>
                <Select value={timeframe} onValueChange={(value) => setTimeframe(value as 'monthly' | 'quarterly')}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="text-primary" />
                            Top 5 Individuals ({timeframe === 'monthly' ? 'This Month' : 'This Quarter'})
                        </CardTitle>
                         <CardDescription>The top 5 members with the most steps.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ol className="space-y-4">
                            {individualLeaderboard.map((member, index) => (
                                <li key={member.id} className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-muted/50">
                                    <div className={`flex items-center justify-center w-8 font-bold text-lg ${getMedalColor(index + 1)}`}>
                                        {index < 3 ? <Medal className="h-6 w-6" /> : <span className="w-6 text-center">{index + 1}</span>}
                                    </div>
                                    <Avatar>
                                        <AvatarImage src={member.avatarUrl} alt={`${member.firstName} ${member.surname}`} />
                                        <AvatarFallback>{member.firstName[0]}{member.surname[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold">{member.firstName} {member.surname}</p>
                                        <p className="text-sm text-muted-foreground">{member.department}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary text-lg">
                                            {timeframe === 'monthly' ? member.monthlySteps.toLocaleString() : member.quarterlySteps.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">steps</p>
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
                            Top 5 Departments ({timeframe === 'monthly' ? 'This Month' : 'This Quarter'})
                        </CardTitle>
                        <CardDescription>The top 5 departments with the highest average steps per member.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ol className="space-y-4">
                            {departmentLeaderboard.map((dept, index) => (
                                <li key={dept.name} className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-muted/50">
                                    <div className={`flex items-center justify-center w-8 font-bold text-lg ${getMedalColor(index + 1)}`}>
                                         {index < 3 ? <Medal className="h-6 w-6" /> : <span className="w-6 text-center">{index + 1}</span>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{dept.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary text-lg">
                                            {dept.avgSteps.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">avg steps / member</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
