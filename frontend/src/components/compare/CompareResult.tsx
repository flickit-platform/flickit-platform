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
import { useSearchParams } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Divider from "@mui/material/Divider";
interface ICompareResultProps {
  data: any;
}

const CompareResult = (props: ICompareResultProps) => {
  const { data } = props;
  useEffect(() => {
    setDocumentTitle(`${t("comparisonResultT")} `);
  }, []);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [show, setShow] = useState<boolean>(false);
  const handleSubjectClick = (subject: any) => {
    setSelectedSubject(subject.id);
    setShow(!show)
  };
  return (
    <Box mt={4}>
      <Box sx={{ overflowX: "auto" }}>
        <Box
          px={1}
          minWidth={getMinWithBaseOnNumberOfAssessments(data?.length)}
        >
          {/* <CompareResultCommonBaseInfo data={data} /> */}
          <CompareResultAssessmentsSection data={data} />
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
                <CompareTable title="generalSpecification" data={data} />
              </Box>
            </Box>
          </Box>
          <Title ml={2} mt={10}>
            <Trans i18nKey="subjects" />
          </Title>
          <Divider />
          {data[0]?.subjects.map((subject: any, index: number) => {
            return (
              <Box key={index} onClick={() => handleSubjectClick(subject)}>
                <div id={subject.title} />
                <Box pt={5}>
                  <Box>
                    <Title
                      size="small"
                      sx={{ opacity: 0.9, flex: 1 }}
                      inPageLink={`${subject.title}`}
                    >
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
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <KeyboardArrowDownIcon />
                      </Box>

                      {show&&selectedSubject === subject.id && (
                        <Box>
                          <CompareTable
                            subjectId={subject?.id}
                            title={subject.title}
                            data={data}
                          />
                        </Box>
                      )}
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
  const assessmentKit = base_infos[0].assessment_kit;
  return (
    <AlertBox severity="info" sx={{ mb: 3 }}>
      <Trans i18nKey={"allOfTheSelectedAssessmentsUse"} />
      <Chip sx={{ mx: 0.6 }} label={assessmentKit} />{" "}
      <Trans i18nKey={"whichHasNamed"} values={{ value: subjects.length }} />
      {subjects.map((subject) => (
        <MuiLink href={`#${subject.title}`} sx={{ mx: 0.6 }}>
          {subject.title}
        </MuiLink>
      ))}
    </AlertBox>
  );
};

export default CompareResult;
