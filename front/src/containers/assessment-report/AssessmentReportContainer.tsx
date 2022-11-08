import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useQuery } from "../../utils/useQuery";
import { QueryData, Title } from "../../components";
import { useServiceContext } from "../../providers/ServiceProvider";
import { AssessmentOverallStatus } from "./AssessmentOverallStatus";
import { AssessmentMostSignificantAttributes } from "./AssessmentMostSignificantAttributes";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import formatDate from "../../utils/formatDate";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import Skeleton from "@mui/material/Skeleton";
import { LoadingSkeleton } from "../../components/loading/LoadingSkeleton";
import LoadingSkeletonOfAssessmentReport from "../../components/loading/LoadingSkeletonOfAssessmentReport";

const AssessmentReportContainer = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const queryData = useQuery({
    service: () => service.fetchAssessment(assessmentId),
    toastError: true,
    toastErrorOptions: { filterByStatus: [404] },
  });

  return (
    <QueryData
      {...queryData}
      renderLoading={() => <LoadingSkeletonOfAssessmentReport />}
      render={(data = {}) => {
        const {
          assessment_project: { color = { color_code: "#101c32" } },
          status,
          most_significant_weaknessness_atts,
          most_significant_strength_atts,
          subjects_info = [],
        } = data;
        const colorCode = color?.color_code || "#101c32";

        return (
          <Box m="auto" pb={3} maxWidth="1440px">
            <AssessmentReportTitle {...data} colorCode={colorCode} />
            <Grid container spacing={3} columns={14} mt={1}>
              <Grid item lg={8} md={14} sm={14} xs={14}>
                <AssessmentOverallStatus
                  status={status}
                  subjects={subjects_info}
                />
              </Grid>
              <Grid item lg={3} md={7} sm={14} xs={14}>
                <AssessmentMostSignificantAttributes
                  isWeakness={false}
                  most_significant_items={most_significant_strength_atts}
                />
              </Grid>
              <Grid item lg={3} md={7} sm={14} xs={14}>
                <AssessmentMostSignificantAttributes
                  isWeakness={true}
                  most_significant_items={most_significant_weaknessness_atts}
                />
              </Grid>
              <Grid item sm={14} xs={14} id="subjects">
                <AssessmentSubjectList
                  subjects={subjects_info}
                  colorCode={colorCode}
                />
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

const AssessmentReportTitle = (props: any) => {
  const {
    assessment_project: { title, last_modification_date, space = {} },
    assessment_profile = {},
    colorCode,
  } = props;
  const { title: spaceTitle = "" } = space;

  return (
    <Title
      wrapperProps={{
        sx: {
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "flex-end" },
        },
      }}
      sup={
        <Typography variant="subLarge" sx={{ opacity: 0.6 }}>
          {spaceTitle}
        </Typography>
      }
      toolbar={
        <Box sx={{ mt: { xs: 1.5, md: 0 } }}>
          <Typography variant="subLarge" sx={{ opacity: 0.6, ml: "auto" }}>
            <Trans i18nKey="lastUpdated" /> {formatDate(last_modification_date)}
          </Typography>
        </Box>
      }
    >
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          alignItems: "center",
        }}
      >
        <AnalyticsRoundedIcon
          sx={{
            mr: 0.5,
            opacity: 0.8,
            color: colorCode,
            position: { xs: "relative", md: "static" },
            top: "6px",
          }}
          fontSize="large"
        />
        <span style={{ opacity: 0.9 }}>
          {assessment_profile.description || (
            <Trans i18nKey="technicalDueDiligence" />
          )}
        </span>{" "}
        <Box
          sx={{
            display: "inline-block",
            ml: { xd: 0, md: "8px" },
          }}
        >
          {title}
        </Box>
      </Box>
    </Title>
  );
};

export default AssessmentReportContainer;
