import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import toastError from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import ColorfulProgress from "../common/progress/ColorfulProgress";
import { Gauge } from "../common/charts/Gauge";
import { getNumberBaseOnScreen } from "@/utils/returnBasedOnScreen";
import { getMaturityLevelColors, styles } from "@styles";
import { ISubjectInfo, IMaturityLevel, TId, ISubjectReportModel } from "@types";
import { ICustomError } from "@/utils/CustomError";
import SubjectRadarChart from "../subject-report/SubjectRadarChart";

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
  const [expanded, setExpanded] = useState<boolean>(false);
  const [subjectData, setSubjectData] = useState<any>([]);
  const [attributes, setAttributes] = useState<any>([]);

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

  const subjectQueryData = useQuery<ISubjectReportModel>({
    service: (args, config) => service.fetchSubject(args, config),
    runOnMount: false,
  });

  const fetchAttributes = async () => {
    try {
      const data = await subjectQueryData.query({
        subjectId: id,
        assessmentId: assessmentId,
      });
      setSubjectData((prev: any) => [...prev, data]);
      setAttributes(data.attributes);
    } catch (e) {}
  };

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded);
    if (isExpanded) {
      fetchAttributes();
    }
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
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
        sx={{
          borderTopLeftRadius: "32px !important",
          borderTopRightRadius: "32px !important",
          textAlign: "center",
          py: 3,
          maxHeight: { sm: "160px" },
          backgroundColor: expanded ? "rgba(10, 35, 66, 0.07)" : "",
        }}
      >
        <Grid container spacing={2} alignItems="center" px={4}>
          <Grid item xs={12} sm={2}>
            <Box
              sx={{
                maxHeight: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "start",
                width: "100%",
              }}
            >
              <Typography variant="h6" sx={{ textTransform: "none" }}>
                {title}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box
              sx={{
                maxHeight: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "start",
                width: "100%",
              }}
            >
              <Typography variant="body2" sx={{ textTransform: "none" }}>
                {description}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ ...styles.centerCVH, gap: 2, width: "100%" }}>
              <ColorfulProgress progress={progress} />
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 4, textTransform: "none" }}
                component={Link}
                to="./../questionnaires"
              >
                Complete Now!
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SubjectStatus title={title} maturity_level={maturityLevel} />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Grid container alignItems="center" padding={2}>
          <Grid item xs={12} sm={7.5}>
            <Box height={"340px"}>
              <SubjectRadarChart {...subjectQueryData} loading={false} />
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              borderLeft: "0.5px solid rgba(0, 0, 0, 0.32)",
              paddingLeft: "12px",
            }}
          >
            {attributes.map((element: any) => {
              return (
                <Box display="flex" justifyContent="space-between" margin={2}>
                  <Typography>{element.title}</Typography>
                  <Typography
                    sx={{
                      color: getMaturityLevelColors(
                        element.maturityScores.length
                      )[element.maturityLevel.value - 1],
                    }}
                  >
                    {element.maturityLevel.title}
                  </Typography>
                </Box>
              );
            })}
          </Grid>
        </Grid>
        <Box mt="auto">
          <Button
            color="success"
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            to={progress === 100 ? `./${id}#insight` : `./${id}`}
            sx={{
              borderBottomRightRadius: "32px",
              borderBottomLeftRadius: "32px",
            }}
          >
            <Trans i18nKey={"checkMoreDetails"} />
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
    <Box sx={{ textAlign: "center", paddingTop: 6, marginRight: -10 }}>
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
