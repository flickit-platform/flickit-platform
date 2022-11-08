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
import convertToSubjectChartData from "../../utils/convertToSubjectChartData";

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
  const { results = [] } = res;

  const data = useMemo(() => {
    return convertToSubjectChartData(results);
  }, [loaded]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" />
        <YAxis type="number" domain={[0, 5]} tickCount={6} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="ml"
          name={t("maturityLevel")}
          fill="#6035A1"
          maxBarSize={80}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SubjectBarChart;
