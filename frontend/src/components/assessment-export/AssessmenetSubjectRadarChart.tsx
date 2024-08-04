import React, { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart,
  ResponsiveContainer,
  Radar,
  Legend,
} from "recharts";
import Skeleton from "@mui/material/Skeleton";
import { t } from "i18next";
import convertToAssessmentChartData from "@/utils/convertToAssessmentChartData";
import { useTheme } from "@mui/material";

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

const breakTextIntoLines = (text: string, maxLineLength: number) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if ((currentLine + " " + words[i]).length <= maxLineLength) {
      currentLine += " " + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};

const SubjectRadar: React.FC<SubjectRadarProps> = ({
  data,
  maturityLevelsCount,
}) => {
  const theme = useTheme();
  const chartData = useMemo(() => convertToAssessmentChartData(data), [data]);
  const maxLineLength = 24; 

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="title"
          tick={({ payload, x, y, cx, cy, ...rest }: any) => {
            const lines = breakTextIntoLines(payload.value, maxLineLength);
            return (
              <g>
                {lines.map((line, index) => (
                  <text
                    key={index}
                    {...rest}
                    y={y + (y - cy) / 15 + index * 12} 
                    x={x + (x - cx) / 15}
                    style={{ ...theme.typography.labelSmall }}
                  >
                    {line}
                  </text>
                ))}
              </g>
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
          isAnimationActive={false}
        />
        <Legend wrapperStyle={{ paddingTop: 20 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default AssessmentSubjectRadarChart;
