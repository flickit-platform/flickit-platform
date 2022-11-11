import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Trans } from "react-i18next";
import Title from "../shared/Title";
import QANumberIndicator from "../shared/QANumberIndicator";
import QuestionnaireProgress from "../shared/progress/CategoryProgress";
import { Link } from "react-router-dom";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import useScreenResize from "../../utils/useScreenResize";
import { styles } from "../../config/styles";
import { IQuestionnaire, TId } from "../../types";

interface IQuestionnaireCardProps {
  data: IQuestionnaire;
}

const QuestionnaireCard = (props: IQuestionnaireCardProps) => {
  const { data } = props;
  const {
    id,
    last_updated,
    answered_metric: number_of_answers,
    metric_number: number_of_questions,
    progress = 0,
    title,
  } = data || {};

  const isSmallScreen = useScreenResize("sm");

  return (
    <Paper sx={{ height: "100%", mt: 3 }}>
      <Box
        p="8px 6px"
        pl={"12px"}
        display="flex"
        flexDirection={"column"}
        height="100%"
        justifyContent={"space-between"}
      >
        <Box>
          <Box flex={1}>
            <Title
              sub={
                last_updated &&
                `${(<Trans i18nKey={"lastUpdated"} />)} ${last_updated}`
              }
              size="small"
              fontFamily={"RobotoBold"}
            >
              <Box flex="1" display="flex" alignItems={"flex-start"}>
                {title}
                {!isSmallScreen && (
                  <Box
                    p="0 8px"
                    display="inline-block"
                    sx={{
                      float: "right",
                      marginLeft: "auto",
                      minWidth: "80px",
                    }}
                  >
                    <QANumberIndicator
                      q={number_of_questions}
                      a={number_of_answers}
                    />
                  </Box>
                )}
              </Box>
            </Title>
          </Box>
        </Box>
        <Box sx={{ ...styles.centerV }} pt={1} pb={2}>
          <QuestionnaireProgress
            position="relative"
            left="-12px"
            progress={progress}
            q={number_of_questions}
            a={number_of_answers}
            isQuestionnaire={true}
            isSmallScreen={isSmallScreen}
          />
        </Box>
        <Box sx={{ ...styles.centerV }} justifyContent={"space-between"}>
          <Box>
            {/* {remainingTime && (
              <Typography variant="subMedium">
                {remainingTime} <Trans i18nKey="minRemaining" />
              </Typography>
            )} */}
          </Box>
          <ActionButtons
            id={id}
            progress={progress}
            number_of_answers={number_of_answers}
          />
        </Box>
      </Box>
    </Paper>
  );
};

const ActionButtons = (props: {
  id: TId;
  progress: number;
  number_of_answers: number;
}) => {
  const { id, progress, number_of_answers } = props;

  return (
    <Box>
      {progress === 100 && (
        <ActionButton
          to={`${id}/1`}
          text="edit"
          icon={<ModeEditOutlineRoundedIcon fontSize="small" />}
        />
      )}
      {progress > 0 && (
        <ActionButton
          to={`${id}/review`}
          text="review"
          state={{ name: "Questionnaires" }}
          icon={<RemoveRedEyeRoundedIcon fontSize="small" />}
        />
      )}
      {progress < 100 && progress > 0 && (
        <ActionButton
          to={`${id}/${number_of_answers + 1}`}
          text="continue"
          icon={<PlayArrowRoundedIcon fontSize="small" />}
        />
      )}
      {progress === 0 && (
        <ActionButton
          to={`${id}/1`}
          text="start"
          icon={<StartRoundedIcon fontSize="small" />}
        />
      )}
    </Box>
  );
};

const ActionButton = (props: {
  to: string;
  text: string;
  icon: JSX.Element;
  state?: any;
}) => {
  const { to, text, icon, state = {} } = props;
  return (
    <Button
      size="small"
      component={Link}
      state={state}
      to={to}
      startIcon={icon}
      sx={{ ml: 0.5 }}
    >
      <Trans i18nKey={text} />
    </Button>
  );
};

export { QuestionnaireCard };
