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
  RadialBarChart,
  RadialBar,
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
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="10%"
        outerRadius="80%"
        barSize={30}
        data={chartData}
      >
        <PolarAngleAxis domain={[0, 5]} type="number" tick={false} />

        <RadialBar
          min={15}
          dataKey="ml"
          label={{ position: "middle", fill: "#fff", fontSize: "1.75rem" }}
          background
        />
        <Legend iconSize={10} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default AssessmentSubjectRadialChart;
