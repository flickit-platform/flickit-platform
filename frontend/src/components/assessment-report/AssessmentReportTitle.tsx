import React, { useEffect } from "react";
import Title from "@common/TitleComponent";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import formatDate from "@utils/formatDate";
import Typography from "@mui/material/Typography";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { useParams } from "react-router-dom";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useConfigContext } from "@/providers/ConfgProvider";

interface IAssessmentReportTitle {
  data: any;
  colorCode: string;
}

const AssessmentReportTitle = (props: IAssessmentReportTitle) => {
  const { data, colorCode } = props;
  const {
    assessment: { title, lastModificationTime, assessmentKit, space },
  } = data;
  const { spaceId, page } = useParams();
  const { config } = useConfigContext();

  useEffect(() => {
    setDocumentTitle(
      `${t("overallInsight", { title: title })}`,
      config.appTitle
    );
  }, [title]);

  return (
    <Title
      backLink="/"
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
              title: space?.title,
              to: `/${space?.id}/assessments/${page}`,
            },
            {
              title: `${title} ${t("insights")}`,
            },
          ]}
          displayChip
        />
      }
    ></Title>
  );
};

export default AssessmentReportTitle;
