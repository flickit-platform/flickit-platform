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
import { theme } from "@/config/theme";

const SubjectBarChart = (props: any) => {
  const { loading, ...rest } = props;
  return loading ? (
    <Skeleton
      height={"520px"}
      width="520px"
      variant="rectangular"
      sx={{ margin: "auto" }}
    />
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
          left: theme.direction === "ltr" ? 20 : 30,
          right: theme.direction === "rtl" ? 20 : 30,
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
          wrapperStyle={{
            position: "absolute",
            bottom: "8px",
            left: theme.direction === "ltr" ? "0%" : "unset",
            right: theme.direction === "rtl" ? "0%" : "unset",
          }}
        />
        <Bar
          dataKey="ml"
          name={t("maturityLevel") as string}
          fill="#6035A1"
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
        textAnchor={theme.direction == "rtl" ? "start" : "end"}
        fill="#666"
        transform="rotate(-45)"
      >
        {payload.value}
      </text>
    </g>
  );
};
