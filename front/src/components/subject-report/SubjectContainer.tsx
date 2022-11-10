import React, { useEffect, useRef } from "react";
import { Hidden, Link, Paper, Skeleton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import GettingThingsReadyLoading from "../../components/shared/loadings/GettingThingsReadyLoading";
import QueryData from "../../components/shared/QueryData";
import Title from "../../components/shared/Title";
import { styles } from "../../config/styles";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import { SubjectAttributeList } from "./SubjectAttributeList";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SubjectRadarChart from "./SubjectRadarChart";
import SubjectBarChart from "./SubjectBarChart";
import SubjectOverallInsight from "./SubjectOverallInsight";
import { QuestionnaireContainer } from "../questionnaires/QuestionnaireContainer";
import { IAssessmentResultModel, ISubjectReportModel } from "../../types";
import hasStatus from "../../utils/hasStatus";

const SubjectContainer = () => {
  const {
    noStatus,
    loading,
    loaded,
    hasError,
    subjectQueryData,
    linkRef,
    hash,
  } = useSubject();

  return (
    <QueryData
      {...subjectQueryData}
      error={hasError}
      loading={loading}
      loaded={loaded}
      render={() => {
        return (
          <Box>
            <a ref={linkRef} href={hash} style={{ display: "none" }} />
            <Box id="categories"></Box>
            <SubjectTitle {...subjectQueryData} loading={loading} />
            <QuestionnaireContainer
              subjectQueryData={{ ...subjectQueryData, loading }}
            />
            <Box id="insight"></Box>
            {loading ? (
              <Box sx={{ ...styles.centerVH }} py={6} mt={5}>
                <GettingThingsReadyLoading color="gray" />
              </Box>
            ) : !loaded ? null : noStatus ? (
              <NoInsightYetMessage {...subjectQueryData} />
            ) : (
              <Box sx={{ px: 0.5 }}>
                <Box mt={12}>
                  <SubjectOverallInsight
                    {...subjectQueryData}
                    loading={loading}
                  />
                </Box>
                <Hidden smDown>
                  <Box height={"620px"} mb={10} mt={10}>
                    <Typography>
                      <Trans
                        i18nKey="inTheRadarChartBelow"
                        values={{ title: subjectQueryData?.data?.title || "" }}
                      />
                    </Typography>
                    <SubjectRadarChart
                      {...subjectQueryData}
                      loading={loading}
                    />
                  </Box>
                  <Box height={"520px"} mt={10}>
                    <SubjectBarChart {...subjectQueryData} loading={loading} />
                  </Box>
                </Hidden>
                <Box>
                  <SubjectAttributeList
                    {...subjectQueryData}
                    loading={loading}
                  />
                </Box>
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

const useSubject = () => {
  const { service } = useServiceContext();
  const { subjectId = "", assessmentId = "" } = useParams();
  const linkRef = useRef<any>(null);
  const { hash, state } = useLocation();
  const resultsQueryData = useQuery<IAssessmentResultModel>({
    service: (args, config) => service.fetchResults(args, config),
  });
  const subjectQueryData = useQuery<ISubjectReportModel>({
    service: (args: { subjectId: string; resultId: string }, config) =>
      service.fetchSubject(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (resultsQueryData.loaded) {
      const result = resultsQueryData.data.results.find(
        (item: any) => item?.assessment_project == assessmentId
      );
      const { id: resultId } = result || {};
      subjectQueryData.query({ subjectId, resultId });
    }
  }, [resultsQueryData.loading]);

  useEffect(() => {
    setTimeout(() => {
      if (subjectQueryData.loaded && hash) {
        linkRef.current.click();
      } else {
        window.scrollTo(0, 0);
      }
    }, 350);
  }, [subjectQueryData.loaded]);

  const hasError = subjectQueryData.error || resultsQueryData.error;

  const loading = subjectQueryData.loading || resultsQueryData.loading;
  const loaded = subjectQueryData.loaded;

  const noStatus = !hasStatus(subjectQueryData.data?.status);

  return {
    noStatus,
    loading,
    loaded,
    hasError,
    subjectQueryData,
    linkRef,
    hash,
  };
};

const SubjectTitle = (props: {
  data: ISubjectReportModel;
  loading: boolean;
}) => {
  const { data, loading } = props;
  const {
    assessment_profile_description,
    assessment_project_title,
    assessment_project_color_code,
    title,
  } = data || {};

  return (
    <Title
      size="large"
      letterSpacing=".08em"
      sx={{ opacity: 0.9 }}
      backLink="./.."
      sup={
        <Typography variant="subLarge">
          {assessment_profile_description || (
            <Trans i18nKey="technicalDueDiligence" />
          )}{" "}
          {assessment_project_title}
        </Typography>
      }
    >
      <Box sx={{ ...styles.centerV }}>
        <QueryStatsRoundedIcon
          fontSize="large"
          sx={{
            mr: 1,
            color: assessment_project_color_code,
          }}
        />
        {loading ? (
          <Skeleton width={"84px"} sx={{ mr: 0.5, display: "inline-block" }} />
        ) : (
          title || ""
        )}{" "}
        <Trans i18nKey="insights" />
      </Box>
    </Title>
  );
};

const NoInsightYetMessage = (props: { data: ISubjectReportModel }) => {
  const { data } = props;
  const { no_insight_yet_message } = data || {};

  return (
    <Box>
      <Paper
        sx={{
          ...styles.centerCVH,
          background: "gray",
          color: "white",
          p: 3,
          py: 8,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        {no_insight_yet_message ? (
          <Typography variant="h4" fontFamily={"RobotoRegular"}>
            {no_insight_yet_message}
          </Typography>
        ) : (
          <>
            <Typography variant="h4" fontFamily={"RobotoRegular"}>
              <Trans i18nKey="moreQuestionsNeedToBeAnswered" />
            </Typography>
            <Typography variant="h5" fontFamily={"RobotoLight"} sx={{ mt: 2 }}>
              <Trans i18nKey="completeSomeOfCategories" />
            </Typography>
          </>
        )}

        <Link href="#categories" sx={{ mt: 3, color: "white" }}>
          <Trans i18nKey="listOfCategories" />
        </Link>
      </Paper>
    </Box>
  );
};

export default SubjectContainer;
