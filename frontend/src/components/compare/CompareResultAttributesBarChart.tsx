import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
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

export default CompareResultSubjectAttributesBarChart;
