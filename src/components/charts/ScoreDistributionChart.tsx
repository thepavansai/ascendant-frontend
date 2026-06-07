'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ScoreDistributionChartProps {
  data: any[];
}

export default function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" hide />
          <YAxis
            dataKey="range"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }}
            width={80}
          />
          <Tooltip
            cursor={{ fill: 'rgba(31, 45, 69, 0.3)' }}
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #1F2D45',
              borderRadius: '12px',
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
