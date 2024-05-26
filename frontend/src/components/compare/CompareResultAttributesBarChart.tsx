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
import { convertToGeneralChartData } from "@utils/convertToAttributesChartData";
import { convertToAttributesChartData } from "@utils/convertToAttributesChartData";

const CompareResultSubjectAttributesBarChart = (props: {
  data?: any;
  isSubject: boolean;
}) => {
  const { data, isSubject } = props;
  const res = useMemo(() => {
    if (!isSubject) {
    return convertToGeneralChartData(data);}
  }, [data, isSubject]);
  const attRes = useMemo(() => {
    if (isSubject) {
      return convertToAttributesChartData(data);
    }
  }, [data, isSubject]);

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "1.05rem",
          fontFamily: "Roboto",
          opacity: 0.7,
          mb: 0.5,
          mt: 2,
        }}
      >
        <Trans i18nKey="attributes" />
      </Typography>
      <Box sx={{ overflowX: "auto", overflowY: "hidden" }}>
        <Box height="420px" minWidth="740px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={isSubject ? attRes : res}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 120,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                interval={0}
                angle={-90}
                textAnchor="end"
                dataKey="title"
                tick={<CustomAxisTick />}
              />
              <YAxis type="number" domain={[0, 5]} tickCount={6} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={"ml"}
                name={"Maturity Level"}
                fill={barColors[1]}
                maxBarSize={40}
              />
              
            </BarChart>
          </ResponsiveContainer>
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
