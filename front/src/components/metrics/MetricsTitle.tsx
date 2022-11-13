import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Title from "../../components/shared/Title";
import {
  EAssessmentStatus,
  useMetricContext,
} from "../../providers/MetricProvider";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import GradingRoundedIcon from "@mui/icons-material/GradingRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { IQuestionnaireModel } from "../../types";

const MetricsTitle = (props: {
  data: IQuestionnaireModel;
  isReview?: boolean;
}) => {
  const { data, isReview } = props;
  const { title } = data || {};
  const {
    metricsInfo: { total_number_of_metrics },
    assessmentStatus,
    isSubmitting,
  } = useMetricContext();
  const { metricIndex } = useParams();
  const isComplete = metricIndex === "completed";
  const canFinishQuestionnaire = !isComplete && !isReview;

  return (
    <Box sx={{ pt: 1, pb: 0 }}>
      <Title
        wrapperProps={{
          sx: {
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "flex-end" },
            display: { xs: "block", sm: "flex" },
          },
        }}
        toolbar={
          <Box sx={{ mt: { xs: 1.5, sm: 0 } }}>
            {!isReview && (
              <Button
                disabled={isSubmitting}
                component={Link}
                to={isReview ? "./../.." : "./.."}
                sx={{ mr: 1 }}
                startIcon={<QuizRoundedIcon />}
              >
                <Trans i18nKey="selectAnotherQuestionnaire" />
              </Button>
            )}
            {canFinishQuestionnaire && (
              <Button
                disabled={isSubmitting}
                component={Link}
                to={"./review"}
                startIcon={<GradingRoundedIcon />}
              >
                <Trans i18nKey="review" />
              </Button>
            )}
          </Box>
        }
        backLink={-1}
        sup={
          <Typography variant="subLarge">
            <Trans i18nKey="assessment" />
          </Typography>
        }
      >
        {isReview ? (
          <>
            {title}
            <Typography
              display="inline-block"
              variant="h5"
              sx={{ opacity: 0.6, marginLeft: 1 }}
            >
              <Trans i18nKey="review" />
            </Typography>
          </>
        ) : (
          <>
            {assessmentStatus === EAssessmentStatus.DONE && (
              <AssignmentTurnedInRoundedIcon
                sx={{ mr: 0.5, opacity: 0.6 }}
                fontSize="large"
              />
            )}
            <Box display="block">
              {title}{" "}
              {assessmentStatus === EAssessmentStatus.DONE ? (
                <Typography
                  display="inline-flex"
                  variant="h5"
                  sx={{
                    opacity: 0.6,
                    ml: { xs: 0, sm: 1 },
                    alignItems: "center",
                  }}
                >
                  <Trans i18nKey="questionnaireFinished" />
                </Typography>
              ) : (
                <Typography
                  display="inline-block"
                  variant="h5"
                  sx={{ opacity: 0.6, ml: { xs: 0, sm: 1 } }}
                >
                  {" "}
                  <Trans i18nKey="question" /> {metricIndex}/
                  {total_number_of_metrics}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Title>
    </Box>
  );
};

export default MetricsTitle;
