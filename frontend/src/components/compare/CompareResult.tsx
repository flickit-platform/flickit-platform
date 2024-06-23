import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Chip from "@mui/material/Chip";
import MuiLink from "@mui/material/Link";
import CompareTable from "./CompareTable";
import AlertBox from "@common/AlertBox";
import { ICompareResultModel, ISubjectReportModel } from "@types";
import { getMinWithBaseOnNumberOfAssessments } from "./utils";
import CompareResultAssessmentsSection from "./CompareResultAssessmentsSection";
import CompareResultSubjectAttributesBarChart from "./CompareResultAttributesBarChart";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import Title from "@common/Title";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import QueryData from "../common/QueryData";
import { Link, useSearchParams } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Divider from "@mui/material/Divider";
import { useConfigContext } from "@/providers/ConfgProvider";
interface ICompareResultProps {
  data: any;
}

const CompareResult = (props: ICompareResultProps) => {
  const { data } = props;
  const { subjects, assessments } = data;

  const { config } = useConfigContext();

  useEffect(() => {
    setDocumentTitle(
      `${t("comparisonResultT")} `,
      config.appTitle
    );
  }, []);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [show, setShow] = useState<boolean>(false);
  const handleSubjectClick = (subject: any) => {
    setSelectedSubject(subject.id);
    setShow(!show);
  };
  return (
    <Box mt={4}>
      <Box sx={{ overflowX: "auto" }}>
        <Box
          px={1}
          minWidth={getMinWithBaseOnNumberOfAssessments(data?.length)}
        >
          <CompareResultCommonBaseInfo data={data} />
          <CompareResultAssessmentsSection data={assessments} />
          <div id="generalSpecification" />
          <Box pt={8}>
            <Box mt={2}>
              <Title
                size="small"
                sx={{ opacity: 0.9, flex: 1 }}
                inPageLink={`generalSpecification`}
              >
                <Trans i18nKey={"generalSpecification"} />
              </Title>
              <Box
                sx={{
                  py: 1.5,
                  px: { xs: 1, sm: 2, md: 3 },
                  background: "white",
                  borderRadius: 2,
                  mt: 1,
                }}
              >
                <CompareTable data={data} isSubject={false} />
              </Box>
            </Box>
          </Box>
          <Title ml={2} mt={10}>
            <Trans i18nKey="subjects" />
          </Title>
          <Divider />
          <Box>
            <CompareTable data={data} isSubject={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const CompareResultCommonBaseInfo = (props: { data: any }) => {
  const { data } = props;
  const { assessments, subjects } = data;
  const assessmentKit = assessments[0].assessmentKit;
  return (
    <AlertBox severity="info" sx={{ mb: 3 }}>
      <Trans i18nKey={"allOfTheSelectedAssessmentsUse"} />
      <Chip
        component={Link}
        to={`/assessment-kits/${assessmentKit?.id}`}
        label={assessmentKit.title}
        size="medium"
        sx={{
          height: "fit-content",
          textTransform: "none",
          color: "#004F83",
          background: "#D0E4FF",
          cursor: "pointer",
          mx: "0.2rem",
          "& .MuiChip-label": {
            whiteSpace: "pre-wrap",
          },
        }}
      />
      <Trans i18nKey={"whichHasNamed"} values={{ value: subjects.length }} />
      {subjects.map((subject: any) => (
        <MuiLink
          href={`#${subject.title}`}
          sx={{
            mx: 0.6,
            cursor: "default",
            color: "#004F83",
            textDecorationColor: "#004F83",

            ":hover": {
              color: "#004F83",
              textDecorationColor: "#004F83",
            },
          }}
        >
          {subject.title}
        </MuiLink>
      ))}
    </AlertBox>
  );
};

export default CompareResult;
