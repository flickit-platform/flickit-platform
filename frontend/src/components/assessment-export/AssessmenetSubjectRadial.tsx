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
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import Skeleton from "@mui/material/Skeleton";
import { t } from "i18next";
import convertToSubjectChartData from "@/utils/convertToSubjectChartData";
import convertToAssessmentChartData, {
  convertToRadialChartData,
} from "@/utils/convertToAssessmentChartData";

interface AssessmentSubjectRadialChartProps {
  loading: boolean;
  data: any[];
  maturityLevelsCount: number;
}

const style = {
  right: 0,
  lineHeight: "24px",
};

const AssessmentSubjectRadialChart: React.FC<
  AssessmentSubjectRadialChartProps
> = ({ loading, data, maturityLevelsCount }) => {
  return loading ? (
    <Skeleton
      height={"620px"}
      width="620px"
      variant="circular"
      sx={{ margin: "auto" }}
    />
  ) : (
    <SubjectRadial data={data} maturityLevelsCount={maturityLevelsCount} />
  );
};

interface SubjectRadialProps {
  data: any[];
  maturityLevelsCount: number;
}

const SubjectRadial: React.FC<SubjectRadialProps> = ({
  data,
  maturityLevelsCount,
}) => {
  const chartData = useMemo(() => convertToRadialChartData(data), [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart cx="50%" cy="50%" barSize={30} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" />
        <YAxis type="number" domain={[0, 5]} tickCount={6} />
        <Bar
          min={15}
          dataKey="ml"
          label={{ position: "middle", fill: "#fff", fontSize: "1.75rem" }}
          background
          name="name"
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AssessmentSubjectRadialChart;
