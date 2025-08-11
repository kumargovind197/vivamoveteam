
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Footprints } from "lucide-react";
import React from 'react';

interface MotivationalStepsCardProps {
    steps: number | null;
}

const AnimatedWalker = ({ steps }: { steps: number | null }) => {
    const safeSteps = steps || 0;

    const getAnimationDuration = (s: number) => {
        if (s < 1000) return '3s'; // very slow
        if (s < 5000) return '1.5s'; // slow walk
        if (s < 10000) return '0.8s'; // brisk walk
        return '0.5s'; // running!
    };
    
    const animationDuration = getAnimationDuration(safeSteps);
    const isPaused = safeSteps === 0;

    const animationStyle = {
        animationDuration: animationDuration,
        animationPlayState: isPaused ? 'paused' : 'running',
    };

    return (
        <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <style>
                {`
                    @keyframes walk {
                        0% { transform: translateY(0px); }
                        25% { transform: translateY(-2px); }
                        50% { transform: translateY(0px); }
                        75% { transform: translateY(2px); }
                        100% { transform: translateY(0px); }
                    }
                    @keyframes leg-swing-1 {
                        0% { transform: rotate(-25deg); }
                        50% { transform: rotate(25deg); }
                        100% { transform: rotate(-25deg); }
                    }
                    @keyframes leg-swing-2 {
                        0% { transform: rotate(25deg); }
                        50% { transform: rotate(-25deg); }
                        100% { transform: rotate(25deg); }
                    }
                    @keyframes arm-swing-1 {
                        0% { transform: rotate(-20deg); }
                        50% { transform: rotate(20deg); }
                        100% { transform: rotate(-20deg); }
                    }
                     @keyframes arm-swing-2 {
                        0% { transform: rotate(20deg); }
                        50% { transform: rotate(-20deg); }
                        100% { transform: rotate(20deg); }
                    }
                    @keyframes scroll {
                        from { transform: translateX(0); }
                        to { transform: translateX(-500px); }
                    }
                    .walker { animation: walk infinite linear; }
                    .leg-1 { animation: leg-swing-1 infinite linear; transform-origin: 50% 0; }
                    .leg-2 { animation: leg-swing-2 infinite linear; transform-origin: 50% 0; }
                    .arm-1 { animation: arm-swing-1 infinite linear; transform-origin: 50% 0; }
                    .arm-2 { animation: arm-swing-2 infinite linear; transform-origin: 50% 0; }
                    .scrolling-bg { animation: scroll infinite linear; }
                `}
            </style>
            
            {/* Background */}
            <g className="scrolling-bg" style={animationStyle}>
                 <line x1="0" y1="85" x2="700" y2="85" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeDasharray="5 5" />
                 {/* Clouds */}
                 <circle cx="150" cy="30" r="10" fill="hsl(var(--muted))" />
                 <circle cx="160" cy="30" r="12" fill="hsl(var(--muted))" />
                 <circle cx="170" cy="30" r="10" fill="hsl(var(--muted))" />
                 <circle cx="450" cy="40" r="15" fill="hsl(var(--muted))" />
                 <circle cx="465" cy="40" r="18" fill="hsl(var(--muted))" />
                 <circle cx="480" cy="40" r="15" fill="hsl(var(--muted))" />
            </g>

            {/* Character */}
            <g transform="translate(100, 40)" className="walker" style={animationStyle}>
                 {/* Head */}
                <circle cx="0" cy="-10" r="8" fill="hsl(var(--primary))" />
                {/* Body */}
                <line x1="0" y1="0" x2="0" y2="20" stroke="hsl(var(--primary))" strokeWidth="4" />
                {/* Legs */}
                <line x1="0" y1="20" x2="0" y2="40" stroke="hsl(var(--primary))" strokeWidth="4" className="leg-1" style={animationStyle} />
                <line x1="0" y1="20" x2="0" y2="40" stroke="hsl(var(--primary))" strokeWidth="4" className="leg-2" style={animationStyle} />
                 {/* Arms */}
                <line x1="0" y1="5" x2="0" y2="23" stroke="hsl(var(--primary))" strokeWidth="3" className="arm-1" style={{...animationStyle, animationName: 'arm-swing-2' }} />
                <line x1="0" y1="5" x2="0" y2="23" stroke="hsl(var(--primary))" strokeWidth="3" className="arm-2" style={{...animationStyle, animationName: 'arm-swing-1' }} />
            </g>
        </svg>
    );
}

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
                <div className="flex flex-col gap-1 z-10">
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
                <div className="w-48 h-24 absolute right-0 top-1/2 -translate-y-1/2 opacity-50">
                   <AnimatedWalker steps={steps} />
                </div>
            </div>
        </Card>
    );
}
