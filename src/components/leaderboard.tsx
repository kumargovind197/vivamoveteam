
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Crown, Medal, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// In a real app, this data would be fetched from your backend.
// It is updated once every 24 hours.
const mockMembers = [
  { id: '1', memberId: 'EMP-001', firstName: 'John', surname: 'Smith', email: 'john.smith@example.com', department: 'Sales', monthlySteps: 285000, avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '2', memberId: 'EMP-002', firstName: 'Emily', surname: 'Jones', email: 'emily.jones@example.com', department: 'Engineering', monthlySteps: 310500, avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '3', memberId: 'EMP-003', firstName: 'Michael', surname: 'Johnson', email: 'michael.johnson@example.com', department: 'Engineering', monthlySteps: 155000, avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '4', memberId: 'EMP-004', firstName: 'Sarah', surname: 'Miller', email: 'sarah.miller@example.com', department: 'Marketing', monthlySteps: 210000, avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '5', memberId: 'EMP-005', firstName: 'David', surname: 'Wilson', email: 'david.wilson@example.com', department: 'Sales', monthlySteps: 180000, avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '6', memberId: 'EMP-006', firstName: 'Jessica', surname: 'Brown', email: 'jessica.brown@example.com', department: 'HR', monthlySteps: 250000, avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '7', memberId: 'EMP-007', firstName: 'Alex', surname: 'Doe', email: 'member@example.com', department: 'Marketing', monthlySteps: 220000, avatarUrl: 'https://placehold.co/100x100.png' },
];

const getMedalColor = (rank: number) => {
    switch (rank) {
        case 1: return "text-yellow-400";
        case 2: return "text-gray-400";
        case 3: return "text-amber-600";
        default: return "text-muted-foreground";
    }
}

export default function Leaderboard() {
    const individualLeaderboard = useMemo(() => {
        return [...mockMembers]
            .sort((a, b) => b.monthlySteps - a.monthlySteps)
            .slice(0, 5);
    }, []);

    const departmentLeaderboard = useMemo(() => {
        const departments: Record<string, { totalSteps: number; memberCount: number }> = {};

        mockMembers.forEach(member => {
            if (!departments[member.department]) {
                departments[member.department] = { totalSteps: 0, memberCount: 0 };
            }
            departments[member.department].totalSteps += member.monthlySteps;
            departments[member.department].memberCount++;
        });
        
        return Object.entries(departments)
            .map(([name, data]) => ({
                name,
                avgSteps: Math.round(data.totalSteps / data.memberCount),
            }))
            .sort((a, b) => b.avgSteps - a.avgSteps)
            .slice(0, 5);

    }, []);

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h2 className="font-headline text-3xl font-bold tracking-tight">This Month's Leaderboard</h2>
                <p className="text-muted-foreground">Rankings reset on the 1st of each month. Updated daily.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="text-primary" />
                            Top 5 Individuals
                        </CardTitle>
                         <CardDescription>The top 5 members with the most steps this month.</CardDescription>
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
                                            {member.monthlySteps.toLocaleString()}
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
                            Top 5 Departments
                        </CardTitle>
                        <CardDescription>The top 5 departments by average steps per member.</CardDescription>
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
                                        <p className="text-xs text-muted-foreground">avg steps</p>
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
