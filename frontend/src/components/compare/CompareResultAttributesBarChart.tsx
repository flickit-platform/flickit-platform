import React from "react";
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
import {
  ICompareResultBaseInfo,
  TCompareResultAttributeInfo,
} from "../../types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";

const CompareResultSubjectAttributesBarChart = (props: {
  data: TCompareResultAttributeInfo[];
  base_infos: ICompareResultBaseInfo[];
}) => {
  const { data, base_infos } = props;

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "1.05rem",
          fontFamily: "RobotoRegular",
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
              {base_infos.map((assessment, index) => {
                const title = assessment.title;
                return title ? (
                  <Bar
                    dataKey={assessment.id}
                    name={title}
                    fill={barColors[index]}
                    maxBarSize={20}
                  />
                ) : null;
              })}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

const barColors = ["#A3C7D6", "#9F73AB", "#624F82", "#3F3B6C"];

export default CompareResultSubjectAttributesBarChart;
