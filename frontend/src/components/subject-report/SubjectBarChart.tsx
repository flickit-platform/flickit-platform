import Skeleton from "@mui/material/Skeleton";
import { t } from "i18next";
import React, { useMemo } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import convertToSubjectChartData from "@utils/convertToSubjectChartData";

const SubjectBarChart = (props: any) => {
  const { loading, ...rest } = props;
  return loading ? (
    <Skeleton height={"520px"} variant="rectangular" sx={{ margin: "auto" }} />
  ) : (
    <SubjectBar {...rest} />
  );
};

const SubjectBar = (props: any) => {
  const { data: res = {}, loaded } = props;
  const data = useMemo(() => {
    return convertToSubjectChartData(res);
  }, [loaded]);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 150,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="title"
          interval={0}
          angle={-90}
          textAnchor="end"
          tick={<CustomAxisTick />}
        />
        <YAxis type="number" domain={[0, 5]} tickCount={5 + 1} />
        <Tooltip />
        <Legend
          layout="horizontal"
          wrapperStyle={{ position: "absolute", bottom: "8px", left: "0%" }}
        />
        <Bar
          dataKey="ml"
          name={t("maturityLevel") as string}
          stroke="#004F83"
          fill="#004F83"
          fillOpacity={0.5}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SubjectBarChart;
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
