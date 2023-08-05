import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { styles } from "@styles";
import { EAssessmentStatus, questionActions, useQuestionContext, useQuestionDispatch } from "@/providers/QuestionProvider";
import { QuestionThumb } from "./QuestionThumb";

interface IQuestionNextPrevProps {
  hasNextQuestion?: boolean;
  isNext?: boolean;
}

const QuestionNextPrev = (props: IQuestionNextPrevProps) => {
  const { isNext, hasNextQuestion } = props;
  const { questionsInfo, questionIndex, isSubmitting } = useQuestionContext();
  const nextQuestion = isNext ? Number(questionIndex) + 1 : Number(questionIndex) - 1;
  const question = questionsInfo?.questions?.find((question) => question.index == nextQuestion);
  const dispatch = useQuestionDispatch();

  return (
    <Paper
      sx={{
        backgroundColor: "#363636",
        color: "white",
        position: "absolute",
        height: "calc(100% - 80px)",
        width: "calc(100% - 80px)",
        transform: isNext ? "translateX(calc(100% - 40px))" : "translateX(calc(-100% + 40px))",
        "&": isNext ? { right: 0 } : { left: 0 },
        display: "flex",
        alignItems: "center",
        justifyContent: isNext ? "left" : "right",
        borderRadius: "8px",
        transition: "transform .2s .35s ease",
        flexDirection: isNext ? "row" : "row-reverse",
        zIndex: 5,
        "&:hover": isNext
          ? hasNextQuestion
            ? {
                transform: "translateX(calc(100% - 380px))",
              }
            : {}
          : {
              transform: "translateX(calc(-100% + 380px))",
            },
      }}
    >
      <Box
        height="100%"
        sx={{ ...styles.centerV }}
        component={Link}
        replace={isNext ? true : true}
        color="#ffffff96"
        onClick={() => {
          if (!isSubmitting && isNext && !hasNextQuestion) {
            dispatch(questionActions.setAssessmentStatus(EAssessmentStatus.DONE));
          }
        }}
        to={isSubmitting ? "" : isNext ? (hasNextQuestion ? `../${questionIndex + 1}` : "../completed") : `../${questionIndex - 1}`}
      >
        <Typography
          sx={{
            transform: isNext ? "rotate(90deg)" : "rotate(-90deg)",
            fontSize: ".85rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            "&": isNext
              ? {
                  marginLeft: "-65px",
                }
              : { marginRight: "-65px" },
          }}
        >
          <Trans i18nKey={isNext ? "skipThisQuestion" : "previousQuestion"} />
        </Typography>
      </Box>
      <Box
        maxWidth="330px"
        flex="1"
        height="100%"
        ml={"-50px"}
        sx={{
          overflowY: "auto",
          "&": isNext ? { ml: "-50px" } : { mr: "-55px", direction: "rtl" },
        }}
      >
        <Box sx={{ direction: "ltr" }}>
          {(!isNext || hasNextQuestion) && (
            <QuestionThumb
              question={question}
              questionsInfo={questionsInfo}
              questionIndex={nextQuestion}
              link={`../${nextQuestion}`}
              isSubmitting={isSubmitting}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default QuestionNextPrev;
