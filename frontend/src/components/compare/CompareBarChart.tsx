import React from "react";
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
}

const barColors = ["#A3C7D6", "#9F73AB", "#624F82", "#3F3B6C"];

const CompareBarChart: React.FC<CompareBarProps> = ({ data, isSubject }) => {
  const bars = Object.values(data).map((attribute, index) => {
    const mlKey = `ml${index + 1}`;
    if (attribute.hasOwnProperty(mlKey)) {
      const barName = attribute[`assessmentTitle${index + 1}`];
      return (
        <Bar
          key={mlKey}
          dataKey={mlKey}
          name={barName}
          fill={barColors[index % barColors.length]}
          maxBarSize={40}
        />
      );
    }
    return null;
  });

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
        {isSubject ? (
          <>{bars}</>
        ) : (
          <Bar
            dataKey={"ml"}
            name={"Maturity Level"}
            fill={barColors[1]}
            maxBarSize={40}
          />
        )}
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
