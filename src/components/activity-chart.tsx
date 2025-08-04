"use client"

import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartTooltipContent, ChartContainer, ChartConfig } from '@/components/ui/chart';
import { ChartLegend, ChartLegendContent } from './ui/chart';

interface ActivityChartProps {
  data: any[];
  config: ChartConfig;
  dataKey: string | string[];
  timeKey: string;
  type: 'bar' | 'line';
}

export default function ActivityChart({ data, config, dataKey, timeKey, type }: ActivityChartProps) {
  const ChartComponent = type === 'bar' ? BarChart : LineChart;
  
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
            />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {Array.isArray(dataKey) ? (
            dataKey.map((key) => 
                type === 'line' ? (
                    <Line key={key} type="monotone" dataKey={key} stroke={`var(--color-${key})`} strokeWidth={2} dot={false} />
                ) : (
                    <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
                )
            )
          ) : (
             type === 'line' ? (
                <Line type="monotone" dataKey={dataKey} stroke={`var(--color-${dataKey})`} strokeWidth={2} dot={{ fill: `var(--color-${dataKey})` }} activeDot={{ r: 8 }} />
             ) : (
                <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={4} />
             )
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
