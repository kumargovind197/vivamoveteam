
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Footprints } from "lucide-react";

interface MotivationalStepsCardProps {
    steps: number | null;
}

const WalkingBoot = ({ className }: { className?: string }) => (
    <svg 
        className={className}
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <style>
        {`
            .boot-body {
                animation: rock 0.8s infinite ease-in-out;
                transform-origin: 50% 90%;
            }
            @keyframes rock {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(5deg); }
                100% { transform: rotate(0deg); }
            }
        `}
        </style>
        <g className="boot-body">
            <path d="M65,85 V60 C65,55 60,50 55,50 H35 C30,50 25,55 25,60 V85" />
            <path d="M25,75 H15 C10,75 10,85 15,85 H85 C90,85 90,75 85,75 H65" />
            <line x1="35" y1="50" x2="35" y2="40" />
            <line x1="45" y1="50" x2="45" y2="40" />
            <line x1="55" y1="50" x2="55" y2="40" />
            <path d="M35,65 h20" />
            <path d="M35,75 h20" />
        </g>
    </svg>
);


export default function MotivationalStepsCard({ steps }: MotivationalStepsCardProps) {
    const getMotivationalMessage = () => {
        if (steps === null) return "Let's get moving!";
        if (steps < 1000) return "Every step counts!";
        if (steps < 5000) return "You're off to a great start!";
        if (steps < 10000) return "Amazing progress, keep it up!";
        return "Fantastic work! You're crushing it!";
    }

    return (
        <Card className="bg-secondary/50 overflow-hidden">
            <div className="flex items-center justify-between p-6">
                <div className="flex flex-col gap-1">
                    <CardTitle className="flex items-center gap-2">
                        <Footprints className="h-6 w-6 text-muted-foreground" />
                        <span>Today's Steps</span>
                    </CardTitle>
                    <CardDescription>
                        {getMotivationalMessage()}
                    </CardDescription>
                    <div className="text-4xl font-bold text-primary mt-2">
                        {steps?.toLocaleString() ?? <span className="text-2xl text-muted-foreground">...</span>}
                    </div>
                </div>
                <div className="w-32 h-32 flex items-center justify-center">
                    <WalkingBoot className="w-full h-full" />
                </div>
            </div>
        </Card>
    );
}
