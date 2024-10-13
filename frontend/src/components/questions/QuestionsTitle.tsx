import { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Title from "@common/Title";
import {
  EAssessmentStatus,
  useQuestionContext,
} from "@/providers/QuestionProvider";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import GradingRoundedIcon from "@mui/icons-material/GradingRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { IQuestionnaireModel } from "@types";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import { t } from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";
import { useConfigContext } from "@/providers/ConfgProvider";
import { theme } from "@/config/theme";

const QuestionsTitle = (props: {
  data: IQuestionnaireModel;
  isReview?: boolean;
  pathInfo: any;
}) => {
  const { isReview, pathInfo } = props;
  const {
    questionsInfo: { total_number_of_questions },
    assessmentStatus,
    isSubmitting,
  } = useQuestionContext();
  const { spaceId, assessmentId, questionIndex, page } = useParams();
  const isComplete = questionIndex === "completed";
  const canFinishQuestionnaire = !isComplete && !isReview;
  const { space, assessment, questionnaire } = pathInfo;
  const { config } = useConfigContext();

  useEffect(() => {
    if (isComplete) {
      setDocumentTitle(
        `${questionnaire.title} ${t("questionnaireFinished")}`,
        config.appTitle,
      );
    }
  }, [questionnaire, isComplete]);

  return (
    <Box sx={{ pt: 1, pb: 0 }}>
      <Title
        size="large"
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
                sx={{
                  marginRight: theme.direction === "ltr" ? 1 : "unset",
                  marginLeft: theme.direction === "rtl" ? 1 : "unset",
                }}
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
        backLink={"/"}
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                title: space?.title,
                to: `/${spaceId}/assessments/${page}`,
                // icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
              },
              {
                title: `${assessment?.title} ${t("questionnaires")}`,
                to: `/${spaceId}/assessments/${page}/${assessmentId}/questionnaires`,
                // icon: (
                //   <DescriptionRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                // ),
              },
              {
                title: questionnaire?.title,
                to: `/${spaceId}/assessments/${page}/${assessmentId}/questionnaires`,
                // icon: <QuizRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
              },
            ]}
          />
        }
      >
        {isReview ? (
          <>
            {questionnaire?.title}
            <div style={{ marginInline: 4 }}></div>
            <Title size="large">
              <Trans i18nKey="review" />
            </Title>
          </>
        ) : (
          <>
            {assessmentStatus === EAssessmentStatus.DONE && (
              <AssignmentTurnedInRoundedIcon
                sx={{
                  marginRight: theme.direction === "ltr" ? 0.5 : "unset",
                  marginLeft: theme.direction === "rtl" ? 0.5 : "unset",
                  opacity: 0.6,
                }}
                fontSize="large"
              />
            )}
            <Box display="block">
              {questionnaire?.title}{" "}
              {assessmentStatus === EAssessmentStatus.DONE ? (
                <Typography
                  display="inline-flex"
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
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
                  fontWeight={"bold"}
                  sx={{ opacity: 0.6, ml: theme.direction == "ltr" ? { xs: 0, sm: 1 } : "unset",
                  mr: theme.direction == "rtl" ? { xs: 0, sm: 1 } : "unset"
                  }}
                >
                  {" "}
                  <Trans i18nKey="question" /> {questionIndex}/
                  {total_number_of_questions}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Title>
    </Box>
  );
};

export default QuestionsTitle;
