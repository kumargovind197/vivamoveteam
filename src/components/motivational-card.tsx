
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Footprints, Bike, PersonStanding, Waves } from "lucide-react";

interface MotivationalCardProps {
    steps: number | null;
}

const icons = [
    { icon: <PersonStanding className="h-10 w-10" />, name: "Walking" },
    { icon: <Bike className="h-10 w-10" />, name: "Cycling" },
    { icon: <Waves className="h-10 w-10" />, name: "Swimming" },
];

export default function MotivationalCard({ steps }: MotivationalCardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % icons.length);
        }, 3000); // Change icon every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const getMotivationalMessage = () => {
        if (steps === null) return "Let's get moving!";
        if (steps < 1000) return "Every step counts!";
        if (steps < 5000) return "You're off to a great start!";
        if (steps < 10000) return "Amazing progress, keep it up!";
        return "Fantastic work! You're crushing it!";
    };

    return (
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-orange-400 text-primary-foreground">
             <style>
                {`
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                    .shimmer-bg {
                        animation: shimmer 10s linear infinite;
                        background-image: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%);
                        background-size: 200% 100%;
                    }
                `}
            </style>
            <div className="absolute inset-0 shimmer-bg" />
            <div className="relative flex flex-col md:flex-row items-center justify-between p-6">
                <div className="flex flex-col gap-1 z-10 mb-4 md:mb-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Footprints className="h-6 w-6" />
                        <span>Today's Steps</span>
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                        {getMotivationalMessage()}
                    </CardDescription>
                    <div className="text-4xl font-bold mt-2">
                        {steps?.toLocaleString() ?? <span className="text-2xl">...</span>}
                    </div>
                </div>
                <div className="relative w-40 h-32 flex items-center justify-center overflow-hidden">
                    {icons.map((item, index) => (
                        <div
                            key={item.name}
                            className="absolute transition-all duration-1000 ease-in-out flex flex-col items-center gap-2"
                            style={{
                                transform: `rotate(${(index - currentIndex) * 120}deg) translate(80px) rotate(-${(index - currentIndex) * 120}deg)`,
                                opacity: index === currentIndex ? 1 : 0,
                            }}
                        >
                            {item.icon}
                            <span className="font-semibold">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
