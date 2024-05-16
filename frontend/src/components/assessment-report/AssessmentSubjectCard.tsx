import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SubjectProgress from "@common/progress/SubjectProgress";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { getMaturityLevelColors, styles } from "@styles";
import { ISubjectInfo, IMaturityLevel, TId } from "@types";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useEffect, useState } from "react";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";
import ColorfulProgress from "../common/progress/ColorfulProgress";
import { Gauge } from "../common/charts/Gauge";
import { getNumberBaseOnScreen } from "@/utils/returnBasedOnScreen";

interface IAssessmentSubjectCardProps extends ISubjectInfo {
  colorCode: string;
  maturity_level?: IMaturityLevel;
}
interface IAssessmentSubjectProgress {
  id: TId;
  title: string;
  questionCount: number;
  answerCount: number;
}

export const AssessmentSubjectAccordion = (
  props: IAssessmentSubjectCardProps
) => {
  const { title, maturityLevel, id, colorCode, description = "" } = props;
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [progress, setProgress] = useState<number>(0);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const subjectProgressQueryData = useQuery<IAssessmentSubjectProgress>({
    service: (args = { subjectId: id, assessmentId }, config) =>
      service.fetchSubjectProgress(args, config),
    runOnMount: false,
  });

  const fetchProgress = async () => {
    try {
      setInProgress(true);
      const data = await subjectProgressQueryData.query();
      const { answerCount, questionCount } = data;
      const total_progress = ((answerCount ?? 0) / (questionCount ?? 1)) * 100;
      setProgress(total_progress);
      setInProgress(false);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  function hexToRGBA(hex: string, alpha: number) {
    hex = hex.replace(/^#/, "");

    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <Accordion
      sx={{
        borderRadius: "32px !important",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        transition: "background-position .4s ease",
        position: "relative",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ textAlign: "center", py: 3, maxHeight: "160px" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
          px={4}
        >
          <Typography
            variant="h6"
            textTransform={"uppercase"}
            letterSpacing={".1em"}
            fontFamily="Oswald"
            fontWeight={500}
            flexGrow={1}
          >
            {title}
          </Typography>
          <Box
            sx={{
              ml: 2,
              flexGrow: 2,
              maxHeight: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Typography variant="body2">{description}</Typography>
          </Box>
          <Box sx={{ ml: 2 }}>
            <ColorfulProgress progress={progress} />
          </Box>
          <Box sx={{ ml: 2 }}>
            <SubjectStatus title={title} maturity_level={maturityLevel} />
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{ textAlign: "center", px: { xs: 2, sm: 5 }, py: { xs: 3, sm: 5 } }}
      >
        <Box mt="auto">
          <Button
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            to={progress === 100 ? `./${id}#insight` : `./${id}`}
            startIcon={
              progress === 0 ? <StartRoundedIcon /> : <QueryStatsRoundedIcon />
            }
          >
            <Trans i18nKey={"viewInsights"} />
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const SubjectStatus = (
  props: Pick<IAssessmentSubjectCardProps, "title" | "maturity_level">
) => {
  const { title, maturity_level } = props;
  const colorPallet = getMaturityLevelColors(maturity_level?.index ?? 0);
  const hasStats = maturity_level?.index ? true : false;
  return (
    <Box sx={{ textAlign: "center", paddingTop: 6, marginRight:-10 }}>
      <Typography>
        {hasStats ? (
          <Gauge
            maturity_level_number={5}
            maturity_level_status={maturity_level?.title ?? ""}
            level_value={maturity_level?.index ?? 0}
            shortTitle={true}
            titleSize={20}
            height={getNumberBaseOnScreen(60, 90, 120, 150, 180)}
          />
        ) : (
          <Trans i18nKey="notEvaluated" />
        )}
      </Typography>
    </Box>
  );
};
