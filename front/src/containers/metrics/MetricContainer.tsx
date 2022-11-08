import React, { useRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import Hidden from "@mui/material/Hidden";
import Box from "@mui/material/Box";
import {
  EAssessmentStatus,
  metricActions,
  useMetricContext,
  useMetricDispatch,
} from "../../providers/MetricProvider";
import { MetricCard } from "./MetricCard";
import { Trans } from "react-i18next";
import { Empty } from "../../components";
import { Review } from "./MetricsReview";
import { TransitionGroup } from "react-transition-group";
import useScreenResize from "../../utils/useScreenResize";
import { styles } from "../../config/styles";
import MetricNextPrev from "./MetricNextPrev";
import { MetricsProgress } from "./MetricsProgress";
import { NotFoundOrAccessDenied } from "../../components/errors/NotFoundOrAccessDenied";

export const MetricContainer = () => {
  const {
    hasAnyMetric,
    metricInfo,
    hasNextQuestion,
    hasPreviousQuestion,
    container,
    assessmentStatus,
    metricsInfo,
    loaded,
    metricIndex,
  } = useMetric();

  return loaded ? (
    hasAnyMetric ? (
      <Box minWidth="100vw" overflow="hidden">
        {metricsInfo.metrics?.[metricIndex - 1] && (
          <MetricsProgress
            hasNextQuestion={hasNextQuestion}
            hasPreviousQuestion={hasPreviousQuestion}
          />
        )}
        {assessmentStatus === EAssessmentStatus.DONE ? (
          <Review metrics={metricsInfo.metrics} />
        ) : (
          <Box
            position="relative"
            sx={{ ...styles.centerVH, px: { xs: 0, sm: 5, md: 6 } }}
          >
            {metricsInfo.metrics?.[metricIndex - 1] ? (
              <>
                <Hidden smDown>
                  <MetricNextPrev
                    hasNextQuestion={hasNextQuestion}
                    isNext={true}
                  />
                </Hidden>
                <Box
                  display="flex"
                  flexDirection={"column"}
                  flex="1"
                  py={2}
                  sx={{ pt: { xs: 0, sm: 2 } }}
                  ref={container}
                >
                  <TransitionGroup>
                    <Collapse
                      key={metricsInfo.metrics[metricIndex - 1].index as any}
                    >
                      <MetricCard
                        metricsInfo={metricsInfo}
                        metricInfo={metricInfo}
                        key={metricsInfo.metrics[metricIndex - 1].index}
                      />
                    </Collapse>
                  </TransitionGroup>
                  <Box display="flex" sx={{ mx: { xs: 2, sm: 3, md: 5.5 } }}>
                    <Box>
                      <SubmitOnSelectCheckBox />
                    </Box>
                  </Box>
                </Box>
                <Hidden smDown>
                  {hasPreviousQuestion && <MetricNextPrev isNext={false} />}
                </Hidden>
              </>
            ) : (
              <Box mt={6}>
                <NotFoundOrAccessDenied />
              </Box>
            )}
          </Box>
        )}
      </Box>
    ) : (
      <Empty />
    )
  ) : null;
};

const SubmitOnSelectCheckBox = () => {
  const { submitOnAnswerSelection } = useMetricContext();
  const dispatch = useMetricDispatch();
  const isSmallerScreen = useScreenResize("sm");

  return (
    <FormControlLabel
      sx={{ mr: 0 }}
      control={
        <Checkbox
          checked={submitOnAnswerSelection}
          onChange={(e) => {
            dispatch(
              metricActions.setSubmitOnAnswerSelection(
                e.target.checked || false
              )
            );
          }}
        />
      }
      label={
        <Trans
          i18nKey={
            isSmallerScreen
              ? "submitAnswerAutomatically"
              : "submitAnswerAutomaticallyAndGoToNextQuestion"
          }
        />
      }
    />
  );
};

const findMetric = (
  metrics: any[] = [],
  metricIndex: string | undefined | number
) => {
  return metricIndex
    ? metrics.find((metric) => metric.index == Number(metricIndex))
    : undefined;
};

const useMetric = () => {
  const { metricIndex, metricsInfo, assessmentStatus, isSubmitting } =
    useMetricContext();
  const loaded = !!metricsInfo?.metrics;
  const hasAnyMetric = loaded
    ? (metricsInfo?.metrics as any).length > 0
    : false;
  const hasAnyQuestion = loaded
    ? (metricsInfo?.metrics as any).length > 0
    : false;
  const metricInfo = findMetric(metricsInfo.metrics, metricIndex);
  const hasNextQuestion =
    hasAnyQuestion && metricIndex < metricsInfo.total_number_of_metrics;
  const hasPreviousQuestion = hasAnyQuestion && metricIndex > 1;
  const container = useRef(null);

  return {
    hasAnyMetric,
    metricInfo,
    hasNextQuestion,
    hasPreviousQuestion,
    container,
    assessmentStatus,
    metricsInfo,
    metricIndex,
    isSubmitting,
    loaded,
  };
};
