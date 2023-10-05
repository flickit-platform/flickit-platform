import React, { useEffect } from "react";
import Title from "@common/Title";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import formatDate from "@utils/formatDate";
import Typography from "@mui/material/Typography";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import { useParams } from "react-router-dom";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";

interface IAssessmentReportTitle {
  data: any;
  colorCode: string;
}

const AssessmentReportTitle = (props: IAssessmentReportTitle) => {
  const { data, colorCode } = props;
  const {
    assessment: {
      title,
      last_modification_time,
      assessment_kit,
      space,
    },
  } = data;
  const { title: spaceTitle = "" } = space || {};
  const { spaceId } = useParams();

  useEffect(() => {
    setDocumentTitle(`${title} ${t("overallInsightsT")}`);
  }, [title]);

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
              to: `/${spaceId}/assessments/`,
              icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
            },
            {
              title,
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
            <Trans i18nKey="lastUpdated" /> {formatDate(last_modification_time)}
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

        <Box
          sx={{
            display: "inline-block",
            mr: "8px",
          }}
        >
          {title}
        </Box>
        <span style={{ opacity: 0.9 }}>
          {assessment_kit.description || <Trans i18nKey="insights" />}
        </span>
      </Box>
    </Title>
  );
};

export default AssessmentReportTitle;
