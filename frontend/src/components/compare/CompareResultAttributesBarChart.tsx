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
import { ICompareResultBaseInfo, TCompareResultAttributeInfo } from "@types";
import React, { useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { convertToAssessmentsChartData } from "@utils/convertToAttributesChartData";
import { convertToAttributesChartData } from "@utils/convertToAttributesChartData";
import CompareBarChart from "./CompareBarChart";

const CompareResultSubjectAttributesBarChart = (props: {
  data?: any;
  isSubject: boolean;
  assessments?: any;
}) => {
  const { data, isSubject, assessments } = props;

  const res = useMemo(() => {
    if (!isSubject) {
      let tempData = data;
      tempData = { ...tempData, title: "assessment", id: 0 };
      return convertToAssessmentsChartData(tempData, assessments);
    }
  }, [data, isSubject]);
  
  const attRes = useMemo(() => {
    if (isSubject) {
      return convertToAttributesChartData(data, assessments);
    }
  }, [data, isSubject]);

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "1.05rem",
          opacity: 0.7,
          mb: 0.5,
          mt: 2,
        }}
      >
        <Trans i18nKey={data.title} />
      </Typography>
      <Box sx={{ overflowX: "auto", overflowY: "hidden" }}>
        <Box height="420px" minWidth="740px">
          <CompareBarChart
            isSubject={isSubject}
            assessmentCount={assessments?.length}
            data={isSubject ? attRes : res}
          />
        </Box>
      </Box>
    </Box>
  );
};

const barColors = ["#A3C7D6", "#9F73AB", "#624F82", "#3F3B6C"];

export default CompareResultSubjectAttributesBarChart;

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
