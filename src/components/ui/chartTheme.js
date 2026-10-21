export const chartColors = {
  primary: "#227cff",
  mint: "#45d996",
  grid: "rgba(255,255,255,0.07)",
  axis: "rgba(255,255,255,0.14)",
  text: "#a8b0c0",
  surface: "#0a1228",
};

export const chartPalette = ["#227cff", "#45d996", "#6aa6ff", "#8fe9c0", "#1a4fd4", "#2fb57c"];

export const axisProps = {
  stroke: chartColors.axis,
  tick: { fill: chartColors.text, fontSize: 12, fontFamily: "Space Grotesk, sans-serif" },
  tickLine: false,
  axisLine: { stroke: chartColors.axis },
};

export const gridProps = {
  stroke: chartColors.grid,
  strokeDasharray: "3 6",
  vertical: false,
};

export const tooltipProps = {
  contentStyle: {
    background: "rgba(10,18,40,0.95)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    color: "#ffffff",
    boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
    fontFamily: "Space Grotesk, sans-serif",
  },
  labelStyle: { color: "#ffffff", fontWeight: 600 },
  itemStyle: { color: "#c5cad6" },
  cursor: { fill: "rgba(34,124,255,0.08)", stroke: "rgba(34,124,255,0.3)" },
};

export const legendProps = {
  wrapperStyle: { color: chartColors.text, fontSize: 13, fontFamily: "Space Grotesk, sans-serif" },
};
