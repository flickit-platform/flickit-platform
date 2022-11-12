import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Trans } from "react-i18next";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import { TId } from "../../types";

type TQuestionnairesNotCompleteAlertProps = {
  subjectName?: string;
  subjectId?: TId;
};

const QuestionnairesNotCompleteAlert = (
  props: TQuestionnairesNotCompleteAlertProps
) => {
  const { subjectName, subjectId } = props;
  const location = useLocation();
  return (
    <Alert
      severity="warning"
      variant="filled"
      sx={{ backgroundColor: "#622301", color: "white" }}
      action={
        <Button
          color="inherit"
          sx={{
            backgroundColor: "#ffffff22",
            "&:hover": {
              backgroundColor: "#ffffff55",
            },
          }}
          component={Link}
          state={location}
          to={
            subjectId
              ? `./../questionnaires?subjectId=${subjectId}`
              : "questionnaires"
          }
        >
          {subjectName} questionnaires
        </Button>
      }
    >
      <AlertTitle>
        <Trans i18nKey="thisReportIsNotAccurate" />
      </AlertTitle>
      {subjectName ? (
        <Trans
          i18nKey="pleaseCompleteAllSubjectQuestionnaires"
          values={{ subjectName }}
        />
      ) : (
        <Trans i18nKey="pleaseCompleteAllQuestionnaires" />
      )}
    </Alert>
  );
};

export default QuestionnairesNotCompleteAlert;
