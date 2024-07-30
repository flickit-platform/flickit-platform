import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import Title from "@common/Title";
import { useQuestionContext } from "@/providers/QuestionProvider";
import doneSvg from "@assets/svg/Done.svg";
import noQuestionSvg from "@assets/svg/noQuestion.svg";
import someQuestionSvg from "@assets/svg/someQuestion.svg";

import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import Hidden from "@mui/material/Hidden";
import languageDetector from "@utils/languageDetector";
import Rating from "@mui/material/Rating";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { useEffect, useMemo, useState } from "react";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { ECustomErrorType, IAssessmentKitReportModel } from "@/types";
import { customFontFamily } from "@/config/theme";
import { useQuestionnaire } from "../questionnaires/QuestionnaireContainer";

const QuestionsReview = () => {
  const { questionIndex, questionsInfo, assessmentStatus } =
    useQuestionContext();
  return (
    <Box width="100%">
      <Review questions={questionsInfo.questions} isReviewPage={true} />
    </Box>
  );
};

export const Review = ({ questions = [], isReviewPage }: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const AssessmentInfo = useQuery({
    service: (args = { assessmentId }, config) =>
      service.AssessmentsLoad(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const isPermitted = useMemo(() => {
    return AssessmentInfo?.data?.viewable;
  }, [AssessmentInfo]);

  const navigate = useNavigate();
  const { questionIndex, questionsInfo, assessmentStatus } =
    useQuestionContext();
  const [answeredQuestions, setAnsweredQuestions] = useState<number>();
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  useEffect(() => {
    if (questionsInfo.questions) {
      const answeredQuestionsCount = questionsInfo.questions.filter(
        (question) => question.answer !== null
      ).length;
      setAnsweredQuestions(answeredQuestionsCount);
      if (answeredQuestionsCount === 0) {
        setIsEmpty(true);
      }
    }
  }, [questionsInfo]);
  const { assessmentTotalProgress } = useQuestionnaire();

  const progress =
    ((assessmentTotalProgress?.data?.answersCount || 0) /
      (assessmentTotalProgress?.data?.questionsCount || 1)) *
    100;

  return (
    <Box
      maxWidth={"1440px"}
      sx={{
        px: { xs: 1, sm: 2, md: 6 },
        my: { xs: 1, md: 3 },
        mx: "auto",
      }}
    >
      <Box
        mb={6}
        mt={6}
        sx={{
          background: "white",
          borderRadius: 2,
          p: { xs: 2, sm: 3, md: 6 },
          display: "flex",
          width: "100%",
        }}
      >
        <Hidden smDown>
          <Box display="flex">
            <Box mt="-28px" alignItems="center" display="flex">
              {answeredQuestions ===
                questionsInfo?.total_number_of_questions && (
                  <img
                    style={{ width: "100%" }}
                    src={doneSvg}
                    alt="questionnaire done"
                  />
                )}
              {isEmpty && (
                <img
                  style={{ width: "100%" }}
                  src={noQuestionSvg}
                  alt="questionnaire empty"
                />
              )}
              {answeredQuestions !== questionsInfo?.total_number_of_questions &&
                !isEmpty && (
                  <img
                    style={{ width: "100%" }}
                    src={someQuestionSvg}
                    alt="questionnaire some answered"
                  />
                )}
            </Box>
          </Box>
        </Hidden>
        <Box sx={{ ml: { xs: 0, sm: 2, md: 6, lg: 8 } }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {answeredQuestions === questionsInfo?.total_number_of_questions && (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: "2.2rem",
                    mb: 1,
                    fontWeight: 600,
                    color: "#004F83",
                  }}
                >
                  <Trans i18nKey="goodJob" />
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: "1.5rem",
                    mb: 4,
                    fontWeight: 600,
                    color: "#004F83",
                  }}
                >
                  <Trans i18nKey="allQuestionsHaveBeenAnswered" />
                </Typography>
                {progress === 100 ? (
                  <Typography
                    variant="h4"
                    sx={{
                      opacity: 0.8,
                      fontSize: "1rem",
                      mb: 4,
                      fontWeight: 600,
                      color: "#0A2342",
                    }}
                  >
                    <Trans i18nKey="allQuestionsInAllQuestionnaireHaveBeenAnswered" />
                  </Typography>
                ) : (
                  <Typography
                    variant="h4"
                    sx={{
                      opacity: 0.8,
                      fontSize: "1rem",
                      mb: 4,
                      fontWeight: 600,
                      color: "#0A2342",
                    }}
                  >
                    <Trans i18nKey="allQuestionsInThisQuestionnaireHaveBeenAnswered" />
                  </Typography>
                )}
              </>
            )}
            {isEmpty && (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: "2.2rem",
                    mb: 1,
                    fontWeight: 600,
                    color: "#D81E5B",
                  }}
                >
                  <Trans i18nKey="hmmm" />
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: "1.5rem",
                    mb: 4,
                    fontWeight: 600,
                    color: "#D81E5B",
                  }}
                >
                  <Trans i18nKey="noQuestionsHaveBeenAnswered" />
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    opacity: 0.8,
                    mb: 4,
                    fontWeight: 600,
                    color: "#0A2342",
                  }}
                >
                  <Trans i18nKey="weHighlyRecommendAnsweringMoreQuestions" />
                </Typography>
              </>
            )}
            {answeredQuestions !== questionsInfo?.total_number_of_questions &&
              !isEmpty && (
                <>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: "2.2rem",
                      mb: 1,
                      fontWeight: 600,
                      color: "#F9A03F",
                    }}
                  >
                    <Trans i18nKey="nice" />
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: "1.25rem",
                      mb: 4,
                      fontWeight: 600,
                      color: "#F9A03F",
                    }}
                  >
                    <Trans
                      i18nKey="youAnsweredQuestionOf"
                      values={{
                        answeredQuestions: answeredQuestions,
                        totalQuestions:
                          questionsInfo?.total_number_of_questions,
                      }}
                    />
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      opacity: 0.8,
                      fontSize: "16px",
                      mb: 4,
                      fontWeight: 600,
                      color: "#0A2342",
                    }}
                  >
                    <Trans i18nKey="someQuestionsHaveNotBeenAnswered" />
                  </Typography>
                </>
              )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 4 },
            }}
          >
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to={"./../../../insights"}
              sx={{ fontSize: "1rem", display: isPermitted ? "" : "none" }}
            // sx={{borderRadius:"32px"}}
            >
              <Trans i18nKey="insights" />
            </Button>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to={"./../../../questionnaires"}
              sx={{ fontSize: "1rem" }}
            // sx={{borderRadius:"32px"}}
            >
              <Trans i18nKey="Choose another questionnaire" />
            </Button>
          </Box>
        </Box>
      </Box>

      <Box>
        {!isReviewPage && (
          <Title>
            <Trans i18nKey="review" />
          </Title>
        )}
        <Box mt={2}>
          {questions.map((question: any) => {
            const is_farsi = languageDetector(question.title);
            return (
              <Paper
                key={question.id}
                sx={{
                  p: 3,
                  backgroundColor: "#273248",
                  flex: 1,
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  mb: 2,
                  borderRadius: "8px",
                  direction: `${is_farsi ? "rtl" : "ltr"}`,
                }}
                elevation={3}
              >
                <Box>
                  <Box>
                    <Typography
                      textTransform={"capitalize"}
                      variant="subMedium"
                      sx={{ color: "#b3b3b3" }}
                    >
                      <Trans i18nKey={"question"} />
                    </Typography>
                    <Typography
                      variant="h6"
                      fontFamily={`${is_farsi ? "Vazirmatn" : customFontFamily
                        }`}
                      fontWeight="bold"
                      letterSpacing={is_farsi ? "0" : ".05em"}
                    >
                      {question.index}.{question.title}
                    </Typography>
                  </Box>
                  {question?.answer?.selectedOption && (
                    <Box mt={3}>
                      <Typography
                        variant="subMedium"
                        textTransform="uppercase"
                        sx={{ color: "#b3b3b3" }}
                      >
                        <Trans i18nKey={"yourAnswer"} />
                      </Typography>
                      <Typography
                        variant="h6"
                        fontFamily={`${is_farsi ? "Vazirmatn" : customFontFamily
                          }`}
                        fontWeight="bold"
                        letterSpacing={is_farsi ? "0" : ".05em"}
                      >
                        {question.answer?.selectedOption?.index}.
                        {question.answer?.selectedOption?.title}
                      </Typography>
                    </Box>
                  )}
                  {question?.answer?.isNotApplicable && (
                    <Box mt={3}>
                      <Typography
                        variant="subMedium"
                        textTransform="uppercase"
                        sx={{ color: "#b3b3b3" }}
                      >
                        <Trans i18nKey={"yourAnswer"} />
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        <Trans i18nKey={"markedAsNotApplicable"} />
                      </Typography>
                    </Box>
                  )}
                  {question?.answer?.confidenceLevel && (
                    <Box mt={3}>
                      <Typography
                        variant="subMedium"
                        textTransform="uppercase"
                        sx={{ color: "#b3b3b3" }}
                      >
                        <Trans i18nKey={"yourConfidence"} />
                      </Typography>
                      <Box sx={{ display: "flex", mt: 1 }}>
                        <Box sx={{ mr: 1, color: "#fff" }}>
                          <Typography sx={{ display: "flex" }}>
                            <Typography variant="h6" fontWeight="bold">
                              {question.answer.confidenceLevel.title}
                            </Typography>
                          </Typography>
                        </Box>
                        <Rating
                          sx={{ alignItems: "center" }}
                          value={question.answer.confidenceLevel?.id}
                          size="medium"
                          readOnly
                          icon={
                            <RadioButtonCheckedRoundedIcon
                              sx={{ mx: 0.25, color: "#42a5f5" }}
                              fontSize="inherit"
                            />
                          }
                          emptyIcon={
                            <RadioButtonUncheckedRoundedIcon
                              style={{ opacity: 0.55 }}
                              sx={{ mx: 0.25, color: "#fff" }}
                              fontSize="inherit"
                            />
                          }
                        />
                      </Box>
                    </Box>
                  )}

                  <Box display="flex" mt={2}>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 0.2,
                        ml: `${is_farsi ? "0" : "auto"}`,
                        mr: `${is_farsi ? "auto" : "0"}`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          isReviewPage
                            ? `./../${question.index}`
                            : `../${question.index}`
                        );
                      }}
                    >
                      {question.answer || !questionsInfo?.permissions?.answerQuestion || question.is_not_applicable ? (
                        <Trans i18nKey="edit" />
                      ) : (
                        <Trans i18nKey="submitAnAnswer" />
                      )}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionsReview;
