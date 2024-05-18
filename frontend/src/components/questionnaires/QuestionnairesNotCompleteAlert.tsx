import AlertTitle from "@mui/material/AlertTitle";
import { Trans } from "react-i18next";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import QANumberIndicator from "@common/QANumberIndicator";
import AlertBox from "@common/AlertBox";

type TQuestionnairesNotCompleteAlertProps = {
  subjectName?: string;
  to?: string;
  progress?: number;
  q?: number;
  a?: number;
};

const QuestionnairesNotCompleteAlert = (
  props: TQuestionnairesNotCompleteAlertProps
) => {
  const { subjectName, to, progress, q, a } = props;
  const location = useLocation();
  const isComplete = q === a;
  return (
    <AlertBox
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
        <>
          {to ? (
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
              to={to}
            >
              {subjectName} <Trans i18nKey="questionnaires" />{" "}
              {q && (
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
          ) : (
            <></>
          )}
        </>
      }
    >
      {!isComplete ? (
        <>
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
        </>
      ) : (
        <>
          <AlertTitle>
            <Trans i18nKey="allQuestionsHaveBeenAnswered" />
          </AlertTitle>
        </>
      )}
    </AlertBox>
  );
};

export default QuestionnairesNotCompleteAlert;
