/**
 * TraceAI Content Distribution Chart
 * Visualizes the breakdown of analyzed media categories.
 */

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

export function ContentDistributionChart({ distribution = [] }) {
  if (!distribution || distribution.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No distribution data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-2 rounded-lg shadow-md text-xs">
          <div className="font-semibold text-slate-800">{data.name} Content</div>
          <div className="text-slate-600 font-mono mt-0.5">
            {data.count} items ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={3}
            >
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Clean Unboxed Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 w-full pt-3 border-t border-slate-100">
        {distribution.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 truncate">{item.name}</span>
            </div>
            <span className="font-mono tabular-nums text-slate-900 font-medium">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentDistributionChart;
