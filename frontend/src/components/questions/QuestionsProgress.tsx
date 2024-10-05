import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Hidden from "@mui/material/Hidden";
import LinearProgress from "@mui/material/LinearProgress";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { styles } from "@styles";
import {
  EAssessmentStatus,
  questionActions,
  useQuestionContext,
  useQuestionDispatch,
} from "@/providers/QuestionProvider";
import usePopover from "@utils/usePopover";
import Typography from "@mui/material/Typography";
import { QuestionThumb } from "./QuestionThumb";
import { QuestionPopover } from "./QuestionPopover";
import { theme } from "@/config/theme";

const QuestionsProgress = ({ hasNextQuestion, hasPreviousQuestion }: any) => {
  const { assessmentStatus, questionIndex, questionsInfo, isSubmitting } =
    useQuestionContext();
  const { total_number_of_questions, questions = [] } = questionsInfo;
  const dispatch = useQuestionDispatch();
  const { questionIndex: questionParam } = useParams();
  const isFinish = questionParam === "completed";

  return (
    <Box
      position="relative"
      sx={{ mt: { xs: 1, sm: 3 }, mx: { xs: 0, sm: "24px" } }}
    >
      <Hidden
        smDown
        mdDown={questions.length > 20 ? true : false}
        lgDown={questions.length > 23 ? true : false}
        xlDown={questions.length > 32 ? true : false}
        xlUp={questions.length > 40 ? true : false}
      >
        <Box
          position={"absolute"}
          sx={{
            ...styles.centerV,
            width: "calc(100% - 114px)",
            ml: "57px",
          }}
          height="100%"
          justifyContent="space-evenly"
        >
          {questions.map((question) => {
            return (
              <QuestionProgressItem
                isSubmitting={isSubmitting}
                key={question.id}
                question={question}
                questionsInfo={questionsInfo}
                to={`./../${question.index}`}
              />
            );
          })}
        </Box>
      </Hidden>
      <Box sx={{ ...styles.centerV, px: { xs: 0.5, sm: 0 } }}>
        <Button
          size="small"
          disabled={!hasPreviousQuestion || isSubmitting}
          sx={{
            minWidth: 0,
            width: "56px",
            marginRight: theme.direction === "ltr" ? "1px" : "unset",
            marginLeft: theme.direction === "rtl" ? "1px" : "unset",
          }}
          component={Link}
          to={`../${questionIndex - 1}`}
        >
          <Trans i18nKey={isFinish ? "edit" : "prev"} />
        </Button>
        <LinearProgress
          sx={{ flex: 1, borderRadius: 4 }}
          variant="determinate"
          value={
            assessmentStatus === EAssessmentStatus.DONE
              ? 100
              : (100 / (total_number_of_questions + 1)) * questionIndex
          }
        />
        <Button
          size="small"
          disabled={isFinish || isSubmitting}
          sx={{ minWidth: 0, width: "56px", ml: "1px" }}
          component={Link}
          to={hasNextQuestion ? `../${questionIndex + 1}` : "../completed"}
          onClick={() => {
            if (!hasNextQuestion) {
              dispatch(
                questionActions.setAssessmentStatus(EAssessmentStatus.DONE),
              );
            }
          }}
        >
          <Trans i18nKey={"skip"} />
        </Button>
      </Box>
    </Box>
  );
};

export const QuestionProgressItem = (props: any) => {
  const { questionsInfo, question, to } = props;
  const { total_number_of_questions } = questionsInfo;

  const { questionIndex } = useParams();
  const { handleClick, ...popoverProps } = usePopover();
  return (
    <Box
      sx={{
        width: "20px",
        zIndex: 1,
        height: "20px",
        cursor: questionIndex != question.index ? "pointer" : "auto",
        backgroundColor: (t: any) =>
          question?.answer?.selectedOption || question?.answer?.isNotApplicable
            ? `${t.palette.primary.main}`
            : "white",
        border: (t: any) => `3px solid white`,
        outline: (t: any) =>
          `${
            question?.answer?.selectedOption ||
            question?.answer?.isNotApplicable
              ? t.palette.primary.main
              : "#a7caed"
          } solid 5px`,
        transition: "background-color .3s ease, transform .2s ease",
        borderRadius: "8px",
        transform: question.index == questionIndex ? "scale(1.3)" : "scale(.9)",
        "&:hover p.i-p-i-n": {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{ zIndex: 1, width: "100%", height: "100%" }}
        onClick={(e: any) => {
          questionIndex != question.index && handleClick(e);
        }}
      >
        <Typography
          sx={{
            fontSize: question.index == questionIndex ? ".75rem" : ".7rem",
            textAlign: "center",
            lineHeight: "13px",
            opacity: question.index == questionIndex ? 1 : 0.6,
            color:
              question?.answer?.selectedOption ||
              question?.answer?.isNotApplicable
                ? `white`
                : "gray",
            transition: "opacity .1s ease",
          }}
          className="i-p-i-n"
        >
          {question.index}
        </Typography>
      </Box>
      <QuestionPopover {...popoverProps}>
        <QuestionThumb
          {...props}
          onClose={popoverProps.onClose}
          questionIndex={question.index}
          link={to || `${question.index}`}
        />
      </QuestionPopover>
    </Box>
  );
};

export { QuestionsProgress };
