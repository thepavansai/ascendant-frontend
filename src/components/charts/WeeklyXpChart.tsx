'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface WeeklyXpChartProps {
  data: any[];
}

export default function WeeklyXpChart({ data }: WeeklyXpChartProps) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(31, 45, 69, 0.3)' }}
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #1F2D45',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="xp" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
