import React from "react";
import Title from "../shared/Title";
import { Box } from "@mui/material";
import { Trans } from "react-i18next";
import formatDate from "../../utils/formatDate";
import Typography from "@mui/material/Typography";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import { IAssessmentReportModel } from "../../types";
import SupTitleBreadcrumb from "../shared/SupTitleBreadcrumb";
import { useParams } from "react-router-dom";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

interface IAssessmentReportTitle {
  data: IAssessmentReportModel;
  colorCode: string;
}

const AssessmentReportTitle = (props: IAssessmentReportTitle) => {
  const { data, colorCode } = props;
  const {
    assessment_project: {
      title,
      last_modification_date,
      assessment_profile,
      space,
    },
  } = data;
  const { title: spaceTitle = "" } = space || {};
  const { spaceId } = useParams();

  return (
    <Title
      wrapperProps={{
        sx: {
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "flex-end" },
        },
      }}
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: spaceTitle,
              to: "/spaces/",
              icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
            },
            {
              title,
              to: `/${spaceId}/assessments`,
              icon: (
                <DescriptionRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              ),
            },
          ]}
        />
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

export default AssessmentReportTitle;
