
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from '@/components/ui/chart';
import { ChartLegend, ChartLegendContent } from './ui/chart';

interface ActivityChartProps {
  data: any[];
  config: ChartConfig;
  dataKey: string;
  timeKey: string;
  type: 'bar' | 'line';
  showGoalBands?: boolean;
}

const GOAL_THRESHOLDS = {
    amber: { y1: 0, y2: 3999, color: "hsl(36, 83%, 50%, 0.1)"},
    yellow: { y1: 4000, y2: 7999, color: "hsl(48, 96%, 50%, 0.1)" },
    green: { y1: 8000, y2: 15000, color: "hsl(var(--primary), 0.1)" }, // Assuming max goal is ~15k steps
};

export default function ActivityChart({ data, config, dataKey, timeKey, type, showGoalBands = false }: ActivityChartProps) {
  const ChartComponent = type === 'bar' ? BarChart : BarChart; // Defaulting to BarChart as line is removed
  
  return (
    <ChartContainer config={config} className="h-full w-full">
      <ResponsiveContainer>
        <ChartComponent data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={timeKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            domain={[0, 'dataMax + 2000']} // Add some padding to the top
            />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          
          {showGoalBands && (
              <>
                <ReferenceArea y1={GOAL_THRESHOLDS.amber.y1} y2={GOAL_THRESHOLDS.amber.y2} fill={GOAL_THRESHOLDS.amber.color} strokeOpacity={0.3} />
                <ReferenceArea y1={GOAL_THRESHOLDS.yellow.y1} y2={GOAL_THRESHOLDS.yellow.y2} fill={GOAL_THRESHOLDS.yellow.color} strokeOpacity={0.3} />
                <ReferenceArea y1={GOAL_THRESHOLDS.green.y1} y2={GOAL_THRESHOLDS.green.y2} fill={GOAL_THRESHOLDS.green.color} strokeOpacity={0.3} />
              </>
          )}

          <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={4} />

        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
