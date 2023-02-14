import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Trans } from "react-i18next";
import Chip from "@mui/material/Chip";
import MuiLink from "@mui/material/Link";
import CompareTable from "./CompareTable";
import AlertBox from "../shared/AlertBox";
import { ICompareResultModel } from "../@types";
import { getMinWithBaseOnNumberOfAssessments } from "./utils";
import CompareResultAssessmentsSection from "./CompareResultAssessmentsSection";
import CompareResultSubjectAttributesBarChart from "./CompareResultAttributesBarChart";
import setDocumentTitle from "../@utils/setDocumentTitle";
import { t } from "i18next";
import Title from "../shared/Title";

interface ICompareResultProps {
  data: ICompareResultModel;
}

const CompareResult = (props: ICompareResultProps) => {
  const { data } = props;

  useEffect(() => {
    setDocumentTitle(`${t("comparisonResultT")} ${data.base_infos.map((bi) => bi.title).join(` & `)}`);
  }, [data.base_infos]);

  return (
    <Box mt={4}>
      <Box sx={{ overflowX: "auto" }}>
        <Box px={1} minWidth={getMinWithBaseOnNumberOfAssessments(data?.base_infos?.length)}>
          <CompareResultCommonBaseInfo data={data} />
          <CompareResultAssessmentsSection data={data.base_infos} />
          <div id="generalSpecification" />
          <Box pt={8}>
            <Box mt={2}>
              <Title size="small" sx={{ opacity: 0.9, flex: 1 }} inPageLink={`generalSpecification`}>
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
                <CompareTable title="generalSpecification" data={data.overall_insights} base_infos={data.base_infos} />
              </Box>
            </Box>
          </Box>
          {data.subjects.map((subject, index) => {
            return (
              <Box key={index}>
                <div id={subject.title} />
                <Box pt={10}>
                  <Box>
                    <Title size="small" sx={{ opacity: 0.9, flex: 1 }} inPageLink={`${subject.title}`}>
                      <Trans i18nKey={subject.title} />
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
                      <CompareTable title={subject.title} data={subject.subject_report_info} base_infos={data.base_infos} />
                      <CompareResultSubjectAttributesBarChart data={subject.attributes_info} base_infos={data.base_infos} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

const CompareResultCommonBaseInfo = (props: { data: ICompareResultModel }) => {
  const { data } = props;
  const { base_infos, subjects } = data;
  const profile = base_infos[0].profile;
  return (
    <AlertBox severity="info" sx={{ mb: 3 }}>
      <Trans i18nKey={"allOfTheSelectedAssessmentsUse"} />
      <Chip sx={{ mx: 0.6 }} label={profile} /> <Trans i18nKey={"whichHasNamed"} values={{ value: subjects.length }} />
      {subjects.map((subject) => (
        <MuiLink href={`#${subject.title}`} sx={{ mx: 0.6 }}>
          {subject.title}
        </MuiLink>
      ))}
    </AlertBox>
  );
};

export default CompareResult;
