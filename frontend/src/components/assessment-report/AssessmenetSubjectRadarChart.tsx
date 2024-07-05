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
import { t } from "i18next";
import convertToSubjectChartData from "@/utils/convertToSubjectChartData";
import convertToAssessmentChartData from "@/utils/convertToAssessmentChartData";
import { useTheme, Typography } from "@mui/material";

interface AssessmentSubjectRadarChartProps {
  loading: boolean;
  data: any[];
  maturityLevelsCount: number;
}

const AssessmentSubjectRadarChart: React.FC<
  AssessmentSubjectRadarChartProps
> = ({ loading, data, maturityLevelsCount }) => {
  return loading ? (
    <Skeleton
      height={"620px"}
      width="620px"
      variant="circular"
      sx={{ margin: "auto" }}
    />
  ) : (
    <SubjectRadar data={data} maturityLevelsCount={maturityLevelsCount} />
  );
};

interface SubjectRadarProps {
  data: any[];
  maturityLevelsCount: number;
}

const SubjectRadar: React.FC<SubjectRadarProps> = ({
  data,
  maturityLevelsCount,
}) => {
  const theme = useTheme();
  const chartData = useMemo(() => convertToAssessmentChartData(data), [data]);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
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
                style={{ ...theme.typography.titleSmall }}
              >
                {payload.value}
              </Text>
            );
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maturityLevelsCount]}
          type="number"
          tickCount={maturityLevelsCount + 1}
          tick={false}
        />
        <Radar
          name={t("maturityLevel") as string}
          dataKey="ml"
          stroke="#9CCAFF"
          fill="#9CCAFF"
          fillOpacity={0.5}
          isAnimationActive={true}
        />
        <Legend wrapperStyle={{ paddingTop: 20 }} />{" "}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default AssessmentSubjectRadarChart;
