import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  TooltipProps,
} from "recharts";

interface CompareBarProps {
  data: any[];
  isSubject: boolean;
  assessmentCount: number;
}

const barColors = ["#82A6CB", "#98ABEE", "#0E46A3", "#11235A"];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {payload.map((entry, index) => (
          <p key={`tooltip-item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${
              entry.payload[`${entry.dataKey}Title`]
                ? entry.payload[`${entry.dataKey}Title`]
                : entry.value
            } `}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CompareBarChart: React.FC<CompareBarProps> = ({
  data,
  isSubject,
  assessmentCount,
}) => {
  const generalBars = useMemo(() => {
    const bars: any = [];

    for (let i = 0; i < assessmentCount; i++) {
      const mlKey = `ml${i + 1}`;
      const mlTitleKey = `mlTitle${i + 1}`;
      const barName = data.find(
        (attribute) => attribute[`assessmentTitle${i + 1}`]
      )?.[`assessmentTitle${i + 1}`];
      if (barName) {
        bars.push(
          <Bar
            key={mlKey}
            dataKey={mlKey}
            name={barName}
            fill={barColors[i % barColors.length]}
            type={mlTitleKey}
          />
        );
      }
    }
    return bars;
  }, [data, assessmentCount]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 160,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          interval={0}
          angle={-45}
          textAnchor="end"
          dataKey="title"
          tick={<CustomAxisTick />}
        />
        <YAxis type="number" domain={[0, 5]} tickCount={6} />
        <Tooltip content={<CustomTooltip />} />
        <Legend layout="horizontal" verticalAlign="top" align="right" />
        {generalBars}
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomAxisTick = (props: any) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-45)"
      >
        {payload.value}
      </text>
    </g>
  );
};

export default CompareBarChart;
