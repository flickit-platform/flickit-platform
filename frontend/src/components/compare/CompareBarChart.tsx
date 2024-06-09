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
} from "recharts";

interface CompareBarProps {
  data: any[];
  isSubject: boolean;
  assessmentCount: number;
}

const barColors = ["#49CED0", "#3B4F68", "#FAB365", "#E04B7C"];

const CompareBarChart: React.FC<CompareBarProps> = ({
  data,
  isSubject,
  assessmentCount,
}) => {
  const generalBars = useMemo(() => {
    const bars: any = [];

    for (let i = 0; i < assessmentCount; i++) {
      const mlKey = `ml${i + 1}`;
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
            maxBarSize={40}
          />
        );
      }
    }
    return bars;
  }, [data]);

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
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="top" align="right" />
        {generalBars}{" "}
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
