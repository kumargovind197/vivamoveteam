
"use client"
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProgressRingProps {
  progress: number; // 0 to 100
}

const ProgressRing: React.FC<ProgressRingProps> = ({ progress }) => {
  const safeProgress = Math.max(0, Math.min(100, progress));
  const data = [
    { name: 'Completed', value: safeProgress },
    { name: 'Remaining', value: 100 - safeProgress },
  ];
  
  const color = safeProgress >= 100 ? 'hsl(var(--primary))' : 'hsl(var(--accent))';

  return (
    <div style={{ width: '150px', height: '150px', position: 'relative' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            startAngle={90}
            endAngle={450}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <span className="text-3xl font-bold text-foreground">{`${Math.round(safeProgress)}%`}</span>
        <p className="text-sm text-muted-foreground">Completed</p>
      </div>
    </div>
  );
};

export default ProgressRing;
