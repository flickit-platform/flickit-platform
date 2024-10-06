import { useEffect } from "react";
import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { useParams } from "react-router-dom";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useConfigContext } from "@/providers/ConfgProvider";

interface IAssessmentReportTitle {
  data: any;
  colorCode: string;
}

const AssessmentReportTitle = (props: IAssessmentReportTitle) => {
  const { data } = props;
  const {
    assessment: { title, space },
  } = data;
  const { page } = useParams();
  const { config } = useConfigContext();

  useEffect(() => {
    setDocumentTitle(
      `${t("overallInsight", { title: title })}`,
      config.appTitle,
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
