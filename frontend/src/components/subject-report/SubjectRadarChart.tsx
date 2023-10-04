import React, { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart,
  ResponsiveContainer,
  Text,
  Radar,
  Legend,
} from "recharts";
import Skeleton from "@mui/material/Skeleton";
import convertToSubjectChartData from "@utils/convertToSubjectChartData";
import { t } from "i18next";
import { Subject } from "@mui/icons-material";

const SubjectRadarChart = (props: any) => {
  const { loading, ...rest } = props;
  return loading ? (
    <Skeleton
      height={"620px"}
      width="620px"
      variant="circular"
      sx={{ margin: "auto" }}
    />
  ) : (
    <SubjectRadar {...rest} />
  );
};

const SubjectRadar = (props: any) => {
  const { data: res = {}, loaded } = props;
  const { subject } = res;
  const {maturity_level}=subject
  const data = useMemo(() => {
    return convertToSubjectChartData(res);
  }, [loaded]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="title"
          tick={({ payload, x, y, cx, cy, ...rest }: any) => {
            return (
              <Text
                {...rest}
                verticalAnchor="middle"
                y={y + (y - cy) / 15}
                x={x + (x - cx) / 15}
              >
                {payload.value}
              </Text>
            );
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maturity_level?.maturity_levels_count]}
          type="number"
          tickCount={maturity_level?.maturity_levels_count + 1}
        />
        {/* <Radar name="confidence level" dataKey="cl" stroke="#137681" fill="#3596A1" fillOpacity={0.5} /> */}
        <Radar
          name={t("maturityLevel") as string}
          dataKey="ml"
          stroke="#491e8a"
          fill="#6035A1"
          fillOpacity={0.5}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default SubjectRadarChart;
