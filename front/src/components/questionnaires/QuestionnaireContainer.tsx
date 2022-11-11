import React from "react";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import QANumberIndicator from "../shared/QANumberIndicator";
import { QuestionnaireList } from "./QuestionnaireList";
import { Trans } from "react-i18next";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import { styles } from "../../config/styles";
import { useQuery } from "../../utils/useQuery";
import { useServiceContext } from "../../providers/ServiceProvider";
import { IQuestionnairesModel } from "../../types";

const QuestionnaireContainer = () => {
  const {
    progress,
    isCompleted,
    questionnaireQueryData,
    total_metric_number,
    total_answered_metric,
    loading,
  } = useQuestionnaire();

  return (
    <Box
      flexWrap={"wrap"}
      sx={{
        ...styles.centerCV,
        backgroundColor: "#2e7d72",
        background: `linear-gradient(135deg, #2e7d72 ${progress}%, #01221e ${progress}%)`,
        px: { xs: 3, md: 4 },
      }}
      py={4}
      borderRadius={2}
      my={2}
      color="white"
      position={"relative"}
    >
      <Box display={"flex"} justifyContent="space-between">
        <Box pb={1} pt={1} pr={4}>
          <Typography variant="h4" fontFamily="RobotoMedium">
            {loading || isCompleted === undefined ? (
              <Skeleton width="220px" />
            ) : isCompleted ? (
              <Trans i18nKey={"YouHaveFinishedAllQuestionnaires"} />
            ) : (
              <Trans i18nKey="toAssessSystemNeedToAnswerQuestions" />
            )}
          </Typography>
          <Typography
            variant="h6"
            fontFamily="RobotoMedium"
            letterSpacing={".05rem"}
          >
            {loading || isCompleted === undefined ? (
              <Skeleton width="164px" />
            ) : isCompleted ? (
              <Trans i18nKey={"ToChangeYourInsightTryEditingQuestionnaires"} />
            ) : (
              <Trans i18nKey="pickupQuestionnaire" />
            )}
          </Typography>
        </Box>
        <Box
          minWidth="130px"
          display="flex"
          justifyContent={"flex-end"}
          sx={{
            position: {
              xs: "absolute",
              md: "static",
              top: "6px",
              right: "12px",
            },
          }}
        >
          {loading ? (
            <Skeleton width="60px" height="40px" />
          ) : (
            <QANumberIndicator
              color="white"
              q={total_metric_number}
              a={total_answered_metric}
              variant="h6"
            />
          )}
        </Box>
      </Box>
      <Box>
        <Divider sx={{ borderColor: "white", opacity: 0.4, mt: 2, mb: 2 }} />
        <Box pb={2}>
          <Box sx={{ ...styles.centerV }}>
            <CategoryRoundedIcon sx={{ mr: 1 }} />
            <Typography
              variant="h5"
              color="white"
              fontFamily="RobotoMedium"
              letterSpacing={".05rem"}
            >
              <Trans i18nKey="Questionnaires" />
            </Typography>
          </Box>
          <QuestionnaireList questionnaireQueryData={questionnaireQueryData} />
        </Box>
      </Box>
    </Box>
  );
};

const useQuestionnaire = () => {
  const { service } = useServiceContext();

  const questionnaireQueryData = useQuery<IQuestionnairesModel>({
    service: (args, config) => service.fetchQuestionnaires(args, config),
  });

  const { data, loading = true, loaded } = questionnaireQueryData;
  const {
    total_metric_number = 0,
    total_answered_metric = 0,
    progress = 0,
  } = data || {};

  const isCompleted = progress === 100;

  return {
    progress,
    isCompleted,
    questionnaireQueryData,
    total_metric_number,
    total_answered_metric,
    loading,
  };
};

export { QuestionnaireContainer };
