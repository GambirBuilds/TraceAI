/**
 * TraceAI Analysis Overview Chart
 * Visualizes historical analysis volumes across multimodal categories using Recharts.
 */

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export function AnalysisOverviewChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No trend data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-md text-xs">
          <div className="font-semibold text-slate-800 mb-1">{label} Analyses</div>
          <div className="space-y-0.5 text-slate-600">
            <div className="flex items-center justify-between gap-4">
              <span>Text:</span>
              <span className="font-mono font-medium text-blue-600">{payload[0]?.value}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Image:</span>
              <span className="font-mono font-medium text-indigo-600">{payload[1]?.value}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Audio:</span>
              <span className="font-mono font-medium text-teal-600">{payload[2]?.value}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Video:</span>
              <span className="font-mono font-medium text-orange-600">{payload[3]?.value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorText" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorImage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#64748B', fontSize: 11 }} 
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis 
            tick={{ fill: '#64748B', fontSize: 11 }} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="text" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorText)" />
          <Area type="monotone" dataKey="image" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorImage)" />
          <Area type="monotone" dataKey="audio" stroke="#0D9488" strokeWidth={2} fill="none" />
          <Area type="monotone" dataKey="video" stroke="#EA580C" strokeWidth={2} fill="none" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalysisOverviewChart;
