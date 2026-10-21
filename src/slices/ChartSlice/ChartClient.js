"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { axisProps, chartPalette, gridProps, legendProps, tooltipProps } from "@/components/ui/chartTheme";

export default function ChartClient({ type = "bar", data = [], color = "#227cff" }) {
  if (!data.length) return null;

  const safeColor = color && /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#227cff";
  const palette = data.map((_, i) => (i === 0 ? safeColor : chartPalette[i % chartPalette.length]));

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={130}
            labelLine={false}
            label={({ name, percent, x, y }) => (
              <text x={x} y={y} fill="#a8b0c0" fontSize={13} textAnchor="middle" dominantBaseline="central">
                {`${name} ${(percent * 100).toFixed(0)}%`}
              </text>
            )}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={palette[i]} stroke="#040b1e" strokeWidth={2} />
            ))}
          </Pie>
          <Legend {...legendProps} />
          <Tooltip {...tooltipProps} formatter={(v) => v.toLocaleString()} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip {...tooltipProps} formatter={(v) => v.toLocaleString()} />
          <Line type="monotone" dataKey="value" stroke={safeColor} strokeWidth={2.5} dot={{ fill: safeColor, r: 5 }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipProps} formatter={(v) => v.toLocaleString()} />
        <Bar dataKey="value" fill={safeColor} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
