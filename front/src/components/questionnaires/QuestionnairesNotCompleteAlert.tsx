import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Trans } from "react-i18next";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import { TId } from "../../types";
import QANumberIndicator from "../shared/QANumberIndicator";

type TQuestionnairesNotCompleteAlertProps = {
  subjectName?: string;
  subjectId?: TId;
  progress?: number;
  q?: number;
  a?: number;
};

const QuestionnairesNotCompleteAlert = (
  props: TQuestionnairesNotCompleteAlertProps
) => {
  const { subjectName, subjectId, progress, q, a } = props;
  const location = useLocation();
  return (
    <Alert
      severity="warning"
      variant="filled"
      sx={{
        backgroundColor: "#622301",
        background: progress
          ? `linear-gradient(135deg, #a53900 ${progress}%, #622301 ${progress}%)`
          : undefined,
        color: "white",
        borderRadius: 2,
      }}
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
              ? `./../questionnaires?subject_pk=${subjectId}`
              : "questionnaires"
          }
        >
          {subjectName} questionnaires{" "}
          {q && a && (
            <QANumberIndicator
              q={q}
              a={a}
              sx={{
                ml: 1,
                pl: 1,
                color: "white",
                borderLeft: "1px dashed #ffffff52",
              }}
            />
          )}
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
